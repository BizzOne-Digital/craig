import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const productSchema = z.object({
  name: z.string().min(2).max(200),
  slug: z.string().min(2).max(200).optional(),
  shortDescription: z.string().max(500).optional(),
  description: z.string().max(10000).optional(),
  category: z.string().max(100).optional(),
  baseCost: z.number().min(0),
  price: z.number().min(0),
  compareAtPrice: z.number().min(0).optional().nullable(),
  sku: z.string().max(100).optional(),
  images: z
    .array(
      z.object({
        url: z.string().url(),
        publicId: z.string(),
        alt: z.string().optional(),
        order: z.number().optional(),
      })
    )
    .optional(),
  sizes: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
  stock: z.number().int().min(0).optional(),
  lowStockThreshold: z.number().int().min(0).optional(),
  featured: z.boolean().optional(),
  active: z.boolean().optional(),
  seoTitle: z.string().max(160).optional(),
  seoDescription: z.string().max(320).optional(),
});

export const serviceSchema = z.object({
  title: z.string().min(2).max(200),
  slug: z.string().min(2).max(200).optional(),
  shortDescription: z.string().max(500).optional(),
  description: z.string().max(10000).optional(),
  price: z.number().min(0),
  priceLabel: z.string().max(100).optional(),
  billingUnit: z.string().max(100).optional(),
  features: z.array(z.string()).optional(),
  duration: z.string().max(100).optional(),
  ctaLabel: z.string().max(100).optional(),
  featured: z.boolean().optional(),
  active: z.boolean().optional(),
  displayOrder: z.number().int().optional(),
});

export const testimonialSchema = z.object({
  quote: z.string().min(10).max(2000),
  displayName: z.string().min(1).max(100),
  roleOrLocation: z.string().max(200).optional(),
  image: z
    .object({
      url: z.string().url().optional().or(z.literal('')),
      publicId: z.string().optional(),
      alt: z.string().optional(),
    })
    .optional(),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
  displayOrder: z.number().int().optional(),
});

export const checkoutSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().min(1).max(20),
        size: z.string().optional(),
        color: z.string().optional(),
      })
    )
    .min(1),
  customer: z.object({
    name: z.string().min(2).max(120),
    email: z.string().email(),
    phone: z.string().max(30).optional(),
  }),
  shippingAddress: z.object({
    line1: z.string().min(3).max(200),
    line2: z.string().max(200).optional(),
    city: z.string().min(2).max(100),
    state: z.string().min(2).max(100),
    postalCode: z.string().min(3).max(20),
    country: z.string().max(2).default('US'),
  }),
  discountCode: z.string().max(50).optional(),
  website: z.string().max(0).optional(),
});

export const discountSchema = z.object({
  code: z.string().min(1).max(50),
});

export const bookingSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().max(30).optional(),
  service: z.string().min(2).max(200),
  serviceSlug: z.string().optional(),
  preferredDate: z.string().min(4),
  preferredTime: z.string().min(2),
  contactPreference: z.enum(['email', 'phone']).default('email'),
  message: z.string().max(2000).optional(),
  consent: z.literal(true),
  website: z.string().max(0).optional(),
});

export const contactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().max(30).optional(),
  subject: z.string().min(3).max(200),
  message: z.string().min(10).max(5000),
  replyMethod: z.enum(['email', 'phone']).default('email'),
  consent: z.literal(true),
  website: z.string().max(0).optional(),
});

export const orderUpdateSchema = z.object({
  fulfillmentStatus: z.enum(['Unfulfilled', 'Processing', 'Shipped', 'Completed', 'Cancelled']),
  trackingNumber: z.string().max(100).optional(),
  carrier: z.string().max(100).optional(),
  note: z.string().max(500).optional(),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  sort: z.string().optional(),
  paymentStatus: z.string().optional(),
  fulfillmentStatus: z.string().optional(),
  discountCode: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
});
