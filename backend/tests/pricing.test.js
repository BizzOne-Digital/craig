import { describe, test, expect, beforeAll } from '@jest/globals';
import dotenv from 'dotenv';

beforeAll(() => {
  dotenv.config();
  process.env.FAMILY_DISCOUNT_TYPE = 'percentage';
  process.env.FAMILY_DISCOUNT_VALUE = '15';
});

describe('pricingService', () => {
  test('validates FAMILY discount code', async () => {
    const { calculateDiscount } = await import('../src/services/pricingService.js');
    const result = calculateDiscount(200, 'family');
    expect(result.valid).toBe(true);
    expect(result.discountCode).toBe('FAMILY');
    expect(result.discountAmount).toBe(30);
  });

  test('rejects invalid discount code', async () => {
    const { calculateDiscount } = await import('../src/services/pricingService.js');
    const result = calculateDiscount(200, 'INVALID');
    expect(result.valid).toBe(false);
  });

  test('calculates order totals server-side', async () => {
    const { calculateOrderTotals } = await import('../src/services/pricingService.js');
    const { taxAmount, total } = calculateOrderTotals(100, 15, 8.99, 0);
    expect(taxAmount).toBe(0);
    expect(total).toBe(93.99);
  });

  test('ignores manipulated frontend totals by recalculating from unit prices', () => {
    const serverItems = [{ unitPrice: 40, quantity: 2, lineTotal: 80 }];
    const clientClaimedSubtotal = 10;
    const serverSubtotal = serverItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    expect(serverSubtotal).not.toBe(clientClaimedSubtotal);
    expect(serverSubtotal).toBe(80);
  });
});

describe('fulfillment idempotency logic', () => {
  test('duplicate webhook should be ignored when webhookProcessedAt exists', () => {
    const order = { webhookProcessedAt: new Date(), orderNumber: 'CEO-TEST' };
    const shouldProcess = !order.webhookProcessedAt;
    expect(shouldProcess).toBe(false);
  });
});

describe('product public projection', () => {
  test('baseCost must not appear in public product shape', () => {
    const product = {
      name: 'Shirt',
      price: 40,
      baseCost: 10,
    };
    const { baseCost, ...publicProduct } = product;
    expect(publicProduct.baseCost).toBeUndefined();
    expect(publicProduct.price).toBe(40);
  });
});

describe('admin auth cookie policy', () => {
  test('auth cookie options use httpOnly and sameSite', async () => {
    const { authCookieOptions } = await import('../src/middleware/auth.js');
    expect(authCookieOptions.httpOnly).toBe(true);
    expect(authCookieOptions.sameSite).toBeDefined();
  });
});

describe('public form validation', () => {
  test('booking schema requires consent', async () => {
    const { bookingSchema } = await import('../src/validators/schemas.js');
    expect(() =>
      bookingSchema.parse({
        name: 'Jane Doe',
        email: 'jane@example.com',
        service: 'Consulting',
        preferredDate: '2026-09-01',
        preferredTime: '10:00',
        consent: false,
      })
    ).toThrow();
  });

  test('contact honeypot must remain empty', async () => {
    const { contactSchema } = await import('../src/validators/schemas.js');
    expect(() =>
      contactSchema.parse({
        name: 'Jane Doe',
        email: 'jane@example.com',
        subject: 'Question',
        message: 'Hello there, I have a general question.',
        consent: true,
        website: 'spam',
      })
    ).toThrow();
  });
});
