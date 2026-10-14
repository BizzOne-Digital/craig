export function calculateCartTotals(subtotal, { shippingFlatRate, taxRate, discountAmount = 0 }) {
  const taxable = Math.max(subtotal - discountAmount, 0);
  const taxAmount = Math.round(taxable * taxRate * 100) / 100;
  const total = Math.round((taxable + shippingFlatRate + taxAmount) * 100) / 100;
  return { subtotal, discountAmount, shippingFlatRate, taxAmount, total };
}

export const PRODUCT_COLOR_OPTIONS = ['Red', 'Black', 'Blue', 'Green'];
export const PRODUCT_SIZE_OPTIONS = ['S', 'M', 'L', 'XL', 'XXL'];
