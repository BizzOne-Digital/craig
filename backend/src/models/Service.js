import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    shortDescription: { type: String, default: '' },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    priceLabel: { type: String, default: '' },
    billingUnit: { type: String, default: '' },
    features: [{ type: String }],
    duration: { type: String, default: '' },
    ctaLabel: { type: String, default: 'Book This Service' },
    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: true, index: true },
    displayOrder: { type: Number, default: 0, index: true },
  },
  { timestamps: true }
);

export default mongoose.model('Service', serviceSchema);
