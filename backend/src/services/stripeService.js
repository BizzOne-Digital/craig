import Stripe from 'stripe';
import { env } from '../config/env.js';

let stripeClient = null;

export function getStripe() {
  if (!env.stripe.secretKey) {
    throw Object.assign(new Error('Stripe is not configured'), { statusCode: 503 });
  }
  if (!stripeClient) {
    stripeClient = new Stripe(env.stripe.secretKey);
  }
  return stripeClient;
}

export function isStripeConfigured() {
  return Boolean(env.stripe.secretKey);
}
