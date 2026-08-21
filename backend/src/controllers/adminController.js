import Admin from '../models/Admin.js';
import Product from '../models/Product.js';
import Service from '../models/Service.js';
import Order from '../models/Order.js';
import Testimonial from '../models/Testimonial.js';
import { signToken, authCookieOptions } from '../middleware/auth.js';
import { fail, success } from '../utils/apiResponse.js';

const LOCK_TIME_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

export async function login(req, res) {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email: email.toLowerCase() });

  if (!admin || !admin.active) {
    return fail(res, 'Invalid email or password', 401);
  }

  if (admin.lockUntil && admin.lockUntil > Date.now()) {
    return fail(res, 'Account temporarily locked. Try again later.', 429);
  }

  const valid = await admin.comparePassword(password);
  if (!valid) {
    admin.failedLoginAttempts += 1;
    if (admin.failedLoginAttempts >= MAX_ATTEMPTS) {
      admin.lockUntil = new Date(Date.now() + LOCK_TIME_MS);
      admin.failedLoginAttempts = 0;
    }
    await admin.save();
    return fail(res, 'Invalid email or password', 401);
  }

  admin.failedLoginAttempts = 0;
  admin.lockUntil = undefined;
  admin.lastLoginAt = new Date();
  await admin.save();

  const token = signToken(admin);
  res.cookie('jlf_admin_token', token, authCookieOptions);
  return success(res, { admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role } });
}

export async function logout(_req, res) {
  res.clearCookie('jlf_admin_token', { path: '/' });
  return success(res, { loggedOut: true });
}

export async function me(req, res) {
  return success(res, { admin: req.admin });
}

export async function dashboard(_req, res) {
  const [products, services, orders, pendingOrders, testimonials, recentOrders, lowStockProducts, paidTotals] =
    await Promise.all([
      Product.countDocuments(),
      Service.countDocuments({ active: true }),
      Order.countDocuments(),
      Order.countDocuments({ paymentStatus: 'pending' }),
      Testimonial.countDocuments({ published: true }),
      Order.find().sort({ createdAt: -1 }).limit(8).select('orderNumber customer total paymentStatus fulfillmentStatus createdAt'),
      Product.find({ active: true, stock: { $lte: 5 } }).select('name stock lowStockThreshold sku').limit(10),
      Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, totalRevenue: { $sum: '$total' }, count: { $sum: 1 } } },
      ]),
    ]);

  return success(res, {
    stats: {
      products,
      activeServices: services,
      orders,
      pendingOrders,
      publishedTestimonials: testimonials,
      paidOrderCount: paidTotals[0]?.count || 0,
      paidRevenueTotal: paidTotals[0]?.totalRevenue || 0,
    },
    recentOrders,
    lowStockProducts,
  });
}
