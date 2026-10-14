import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema(
  {
    donationNumber: { type: String, required: true, unique: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'usd' },
    customer: {
      name: { type: String, default: '' },
      email: { type: String, default: '', lowercase: true },
    },
    paymentProvider: { type: String, default: 'stripe' },
    checkoutSessionId: { type: String, unique: true, sparse: true },
    paymentIntentId: { type: String, default: '' },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
      index: true,
    },
    webhookProcessedAt: { type: Date },
    paidAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model('Donation', donationSchema);
