import mongoose from 'mongoose';

const lineItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: { type: String, required: true },
    slug: { type: String },
    sku: { type: String },
    image: { type: String },
    size: { type: String },
    color: { type: String },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    lineTotal: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const statusHistorySchema = new mongoose.Schema(
  {
    status: { type: String, required: true },
    note: { type: String, default: '' },
    changedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true, lowercase: true },
      phone: { type: String, default: '' },
    },
    shippingAddress: {
      line1: { type: String, required: true },
      line2: { type: String, default: '' },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, default: 'US' },
    },
    lineItems: [lineItemSchema],
    subtotal: { type: Number, required: true, min: 0 },
    discountCode: { type: String, default: '' },
    discountAmount: { type: Number, default: 0, min: 0 },
    shippingAmount: { type: Number, default: 0, min: 0 },
    taxAmount: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'usd' },
    paymentProvider: { type: String, default: 'stripe' },
    checkoutSessionId: { type: String, unique: true, sparse: true },
    paymentIntentId: { type: String, default: '' },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
      index: true,
    },
    fulfillmentStatus: {
      type: String,
      enum: ['Unfulfilled', 'Processing', 'Shipped', 'Completed', 'Cancelled'],
      default: 'Unfulfilled',
      index: true,
    },
    trackingNumber: { type: String, default: '' },
    carrier: { type: String, default: '' },
    customerEmailSentAt: { type: Date },
    adminEmailSentAt: { type: Date },
    webhookProcessedAt: { type: Date },
    statusHistory: [statusHistorySchema],
    paidAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
