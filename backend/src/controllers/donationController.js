import mongoose from 'mongoose';
import Donation from '../models/Donation.js';
import { sendMail } from '../services/mailService.js';
import { donationAdminEmail } from '../templates/emailTemplates.js';
import { escapeRegex, csvCell, parsePaging } from '../utils/asyncHandler.js';
import { env } from '../config/env.js';
import { generateOrderNumber } from '../utils/slugify.js';
import { getStripe, isStripeConfigured } from '../services/stripeService.js';
import { created, fail, success } from '../utils/apiResponse.js';
import logger from '../utils/logger.js';

function generateDonationNumber() {
  return generateOrderNumber().replace(/^CEO-/, 'CEO-DON-');
}

export async function createDonationCheckoutSession(req, res) {
  if (req.body.website) return fail(res, 'Unable to process request', 400);
  if (!isStripeConfigured()) return fail(res, 'Donations are temporarily unavailable', 503);

  const { amount, customer = {} } = req.body;
  const unitAmount = Math.round(amount * 100);

  const donationNumber = generateDonationNumber();
  const donation = await Donation.create({
    donationNumber,
    amount,
    currency: env.stripe.currency,
    customer: {
      name: customer.name || '',
      email: customer.email || '',
    },
    paymentStatus: 'pending',
  });

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer_email: customer.email || undefined,
    line_items: [
      {
        price_data: {
          currency: env.stripe.currency,
          product_data: {
            name: 'Donation to CEO Foundation',
            description: 'Thank you for supporting justice, advocacy, and community.',
          },
          unit_amount: unitAmount,
        },
        quantity: 1,
      },
    ],
    success_url: `${env.frontendUrl}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.frontendUrl}/?donate=cancelled`,
    metadata: {
      kind: 'donation',
      donationId: donation._id.toString(),
      donationNumber,
    },
  });

  donation.checkoutSessionId = session.id;
  await donation.save();

  return created(res, { sessionId: session.id, url: session.url, donationNumber });
}

export async function getDonationBySession(req, res) {
  const { sessionId } = req.query;
  if (!sessionId) return fail(res, 'Session ID required', 400);
  const donation = await Donation.findOne({ checkoutSessionId: sessionId }).select('-__v');
  if (!donation) return fail(res, 'Donation not found', 404);
  return success(res, {
    donationNumber: donation.donationNumber,
    paymentStatus: donation.paymentStatus,
    amount: donation.amount,
    customer: { name: donation.customer.name, email: donation.customer.email },
    paidAt: donation.paidAt,
  });
}

export async function fulfillPaidDonation(session) {
  if (session.metadata?.kind !== 'donation') return;

  const donation = await Donation.findOne({ checkoutSessionId: session.id });
  if (!donation) {
    logger.error('Donation not found for checkout session', { sessionId: session.id });
    return;
  }

  if (donation.webhookProcessedAt) {
    logger.info('Donation webhook already processed', { donationNumber: donation.donationNumber });
    return;
  }

  if (session.payment_status !== 'paid') return;

  donation.paymentStatus = 'paid';
  donation.paymentIntentId = session.payment_intent || '';
  donation.paidAt = new Date();
  donation.webhookProcessedAt = new Date();

  if (session.customer_details?.email && !donation.customer.email) {
    donation.customer.email = session.customer_details.email;
  }
  if (session.customer_details?.name && !donation.customer.name) {
    donation.customer.name = session.customer_details.name;
  }

  await donation.save();

  if (!donation.adminEmailSentAt) {
    const result = await sendMail({
      to: env.adminNotificationEmail,
      ...donationAdminEmail(donation, `${env.frontendUrl}/admin/donations`),
    });
    if (result.sent) {
      donation.adminEmailSentAt = new Date();
      await donation.save();
    }
  }
}

export async function markDonationExpired(session) {
  if (session.metadata?.kind !== 'donation') return;
  await Donation.updateOne(
    { checkoutSessionId: session.id, paymentStatus: 'pending' },
    { paymentStatus: 'failed' }
  );
}

function donationFilter(query) {
  const filter = {};
  if (query.paymentStatus) filter.paymentStatus = query.paymentStatus;
  if (query.search) {
    const rx = new RegExp(escapeRegex(query.search), 'i');
    filter.$or = [{ donationNumber: rx }, { 'customer.email': rx }, { 'customer.name': rx }];
  }
  return filter;
}

export async function adminListDonations(req, res) {
  const { page, limit, skip } = parsePaging(req.query);
  const filter = donationFilter(req.query);
  const [items, total, totals] = await Promise.all([
    Donation.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Donation.countDocuments(filter),
    Donation.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, amount: { $sum: '$amount' }, count: { $sum: 1 } } },
    ]),
  ]);
  return success(res, items, {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
    paidTotal: totals[0]?.amount || 0,
    paidCount: totals[0]?.count || 0,
  });
}

export async function adminGetDonation(req, res) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return fail(res, 'Donation not found', 404);
  const donation = await Donation.findById(req.params.id);
  if (!donation) return fail(res, 'Donation not found', 404);
  return success(res, donation);
}

export async function exportDonationsCsv(req, res) {
  const donations = await Donation.find(donationFilter(req.query)).sort({ createdAt: -1 }).limit(5000);
  const header = 'Donation Number,Date,Name,Email,Amount,Currency,Status,Paid At\n';
  const rows = donations
    .map((d) =>
      [
        d.donationNumber,
        d.createdAt.toISOString(),
        d.customer?.name,
        d.customer?.email,
        d.amount,
        d.currency,
        d.paymentStatus,
        d.paidAt ? d.paidAt.toISOString() : '',
      ]
        .map(csvCell)
        .join(',')
    )
    .join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="CEO-donations.csv"');
  return res.send(header + rows);
}
