import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { env } from '../config/env.js';
import { generateOrderNumber } from '../utils/slugify.js';
import { calculateDiscount, calculateOrderTotals } from '../services/pricingService.js';
import { getStripe, isStripeConfigured } from '../services/stripeService.js';
import { sendMail } from '../services/mailService.js';
import { orderCustomerEmail, orderAdminEmail } from '../templates/emailTemplates.js';
import { created, fail, success } from '../utils/apiResponse.js';
import logger from '../utils/logger.js';

export async function validateDiscount(req, res) {
  const { code } = req.body;
  if (!env.discount.value) {
    return fail(res, 'Discount is not configured', 400);
  }
  const result = calculateDiscount(100, code);
  if (!result.valid) return fail(res, result.message, 400);
  return success(res, {
    code: result.discountCode,
    type: result.type,
    value: result.value,
    message: result.message,
  });
}

export async function createCheckoutSession(req, res) {
  if (req.body.website) return fail(res, 'Unable to process request', 400);
  if (!isStripeConfigured()) return fail(res, 'Checkout is temporarily unavailable', 503);

  const { items, customer, shippingAddress, discountCode } = req.body;
  const productIds = items.map((i) => i.productId);
  const products = await Product.find({ _id: { $in: productIds }, active: true });

  if (products.length !== new Set(productIds).size) {
    return fail(res, 'One or more products are unavailable', 400);
  }

  const productMap = new Map(products.map((p) => [p._id.toString(), p]));
  const lineItems = [];
  let subtotal = 0;

  for (const item of items) {
    const product = productMap.get(item.productId);
    if (!product) return fail(res, 'Product not found', 400);
    if (product.stock < item.quantity) {
      return fail(res, `${product.name} has insufficient stock`, 400);
    }

    const unitPrice = product.price;
    const lineTotal = Math.round(unitPrice * item.quantity * 100) / 100;
    subtotal += lineTotal;

    lineItems.push({
      productId: product._id,
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      image: product.images[0]?.url || '',
      size: item.size || '',
      color: item.color || '',
      quantity: item.quantity,
      unitPrice,
      lineTotal,
    });
  }

  subtotal = Math.round(subtotal * 100) / 100;
  const discount = discountCode ? calculateDiscount(subtotal, discountCode) : { discountAmount: 0, discountCode: '' };
  if (discountCode && !discount.valid) return fail(res, discount.message, 400);

  const shippingAmount = env.shippingFlatRate;
  const { taxAmount, total } = calculateOrderTotals(subtotal, discount.discountAmount, shippingAmount, env.taxRate);

  const orderNumber = generateOrderNumber();
  const order = await Order.create({
    orderNumber,
    customer,
    shippingAddress,
    lineItems,
    subtotal,
    discountCode: discount.discountCode,
    discountAmount: discount.discountAmount,
    shippingAmount,
    taxAmount,
    total,
    currency: env.stripe.currency,
    paymentStatus: 'pending',
    statusHistory: [{ status: 'pending', note: 'Checkout session created' }],
  });

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer_email: customer.email,
    line_items: lineItems.map((item) => ({
      price_data: {
        currency: env.stripe.currency,
        product_data: {
          name: item.name,
          description: [item.size, item.color].filter(Boolean).join(' · ') || undefined,
          images: item.image ? [item.image] : undefined,
        },
        unit_amount: Math.round(item.unitPrice * 100),
      },
      quantity: item.quantity,
    })),
    shipping_options: [
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: { amount: Math.round(shippingAmount * 100), currency: env.stripe.currency },
          display_name: 'Standard Shipping',
        },
      },
    ],
    discounts:
      discount.discountAmount > 0
        ? [
            {
              coupon: await ensureStripeCoupon(stripe, discount),
            },
          ]
        : undefined,
    success_url: `${env.frontendUrl}/order/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.frontendUrl}/order/cancel?order=${orderNumber}`,
    metadata: {
      orderId: order._id.toString(),
      orderNumber,
    },
  });

  order.checkoutSessionId = session.id;
  await order.save();

  return created(res, { sessionId: session.id, url: session.url, orderNumber });
}

async function ensureStripeCoupon(stripe, discount) {
  const id = `JLF_${env.discount.code}_${env.discount.type}_${env.discount.value}`.toUpperCase();
  try {
    await stripe.coupons.retrieve(id);
    return id;
  } catch {
    if (env.discount.type === 'percentage') {
      const coupon = await stripe.coupons.create({
        id,
        percent_off: env.discount.value,
        duration: 'forever',
        name: env.discount.code,
      });
      return coupon.id;
    }
    const coupon = await stripe.coupons.create({
      id,
      amount_off: Math.round(env.discount.value * 100),
      currency: env.stripe.currency,
      duration: 'forever',
      name: env.discount.code,
    });
    return coupon.id;
  }
}

export async function getOrderBySession(req, res) {
  const { sessionId } = req.query;
  if (!sessionId) return fail(res, 'Session ID required', 400);
  const order = await Order.findOne({ checkoutSessionId: sessionId }).select('-__v');
  if (!order) return fail(res, 'Order not found', 404);
  return success(res, {
    orderNumber: order.orderNumber,
    paymentStatus: order.paymentStatus,
    total: order.total,
    lineItems: order.lineItems,
    customer: { name: order.customer.name, email: order.customer.email },
    paidAt: order.paidAt,
  });
}

export async function handleStripeWebhook(req, res) {
  const stripe = getStripe();
  const signature = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, env.stripe.webhookSecret);
  } catch (err) {
    logger.error('Webhook signature verification failed', { message: err.message });
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    await fulfillPaidOrder(session);
  }

  return res.json({ received: true });
}

export async function fulfillPaidOrder(session) {
  const order = await Order.findOne({ checkoutSessionId: session.id });
  if (!order) {
    logger.error('Order not found for checkout session', { sessionId: session.id });
    return;
  }

  if (order.webhookProcessedAt) {
    logger.info('Webhook already processed', { orderNumber: order.orderNumber });
    return;
  }

  if (session.payment_status !== 'paid') return;

  order.paymentStatus = 'paid';
  order.paymentIntentId = session.payment_intent || '';
  order.paidAt = new Date();
  order.webhookProcessedAt = new Date();
  order.statusHistory.push({ status: 'paid', note: 'Payment confirmed via Stripe webhook' });

  for (const item of order.lineItems) {
    await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
  }

  await order.save();

  if (!order.customerEmailSentAt) {
    const email = orderCustomerEmail(order);
    const result = await sendMail({ to: order.customer.email, ...email });
    if (result.sent) {
      order.customerEmailSentAt = new Date();
      await order.save();
    }
  }

  if (!order.adminEmailSentAt) {
    const adminUrl = `${env.frontendUrl}/admin/orders/${order._id}`;
    const email = orderAdminEmail(order, adminUrl);
    const result = await sendMail({ to: env.adminNotificationEmail, ...email });
    if (result.sent) {
      order.adminEmailSentAt = new Date();
      await order.save();
    }
  }
}

export async function adminListOrders(req, res) {
  const { page = 1, limit = 20, search, paymentStatus, fulfillmentStatus, discountCode, sort = '-createdAt' } = req.query;
  const filter = {};
  if (paymentStatus) filter.paymentStatus = paymentStatus;
  if (fulfillmentStatus) filter.fulfillmentStatus = fulfillmentStatus;
  if (discountCode) filter.discountCode = discountCode.toUpperCase();
  if (search) {
    filter.$or = [
      { orderNumber: new RegExp(search, 'i') },
      { 'customer.email': new RegExp(search, 'i') },
      { 'customer.name': new RegExp(search, 'i') },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Order.find(filter).sort(sort).skip(skip).limit(Number(limit)),
    Order.countDocuments(filter),
  ]);

  return success(res, items, { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) });
}

export async function adminGetOrder(req, res) {
  const order = await Order.findById(req.params.id);
  if (!order) return fail(res, 'Order not found', 404);
  return success(res, order);
}

export async function adminUpdateOrder(req, res) {
  const order = await Order.findById(req.params.id);
  if (!order) return fail(res, 'Order not found', 404);

  const { fulfillmentStatus, trackingNumber, carrier, note } = req.body;
  order.fulfillmentStatus = fulfillmentStatus;
  if (fulfillmentStatus === 'Shipped') {
    order.trackingNumber = trackingNumber || '';
    order.carrier = carrier || '';
  }
  order.statusHistory.push({ status: fulfillmentStatus, note: note || '' });
  await order.save();
  return success(res, order);
}

export async function exportOrdersCsv(req, res) {
  const orders = await Order.find().sort({ createdAt: -1 }).limit(5000);
  const header = 'Order Number,Date,Customer,Email,Total,Payment,Fulfillment,Discount\n';
  const rows = orders
    .map((o) =>
      [
        o.orderNumber,
        o.createdAt.toISOString(),
        `"${o.customer.name.replace(/"/g, '""')}"`,
        o.customer.email,
        o.total,
        o.paymentStatus,
        o.fulfillmentStatus,
        o.discountCode || '',
      ].join(',')
    )
    .join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="jlf-orders.csv"');
  return res.send(header + rows);
}
