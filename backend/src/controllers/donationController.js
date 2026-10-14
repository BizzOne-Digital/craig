import Donation from '../models/Donation.js';
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
}
