import { env } from '../config/env.js';

export function calculateDiscount(subtotal, code) {
  if (!code || !env.discount.value) {
    return { discountAmount: 0, discountCode: '', valid: false, message: 'Invalid discount code' };
  }

  const normalized = code.trim().toUpperCase();
  if (normalized !== env.discount.code) {
    return { discountAmount: 0, discountCode: '', valid: false, message: 'Invalid discount code' };
  }

  let discountAmount = 0;
  if (env.discount.type === 'percentage') {
    discountAmount = Math.round((subtotal * env.discount.value) / 100 * 100) / 100;
  } else if (env.discount.type === 'fixed') {
    discountAmount = Math.min(env.discount.value, subtotal);
  }

  return {
    discountAmount,
    discountCode: env.discount.code,
    valid: true,
    message: 'Discount applied',
    type: env.discount.type,
    value: env.discount.value,
  };
}

export function calculateOrderTotals(subtotal, discountAmount, shippingAmount, taxRate) {
  const taxable = Math.max(subtotal - discountAmount, 0);
  const taxAmount = Math.round(taxable * taxRate * 100) / 100;
  const total = Math.round((taxable + shippingAmount + taxAmount) * 100) / 100;
  return { taxAmount, total };
}
