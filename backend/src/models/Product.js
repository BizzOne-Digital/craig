import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    alt: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    shortDescription: { type: String, default: '' },
    description: { type: String, default: '' },
    category: { type: String, default: 'General', index: true },
    baseCost: { type: Number, required: true, min: 0, select: false },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, min: 0 },
    sku: { type: String, trim: true },
    images: [imageSchema],
    sizes: [{ type: String }],
    colors: [{ type: String }],
    stock: { type: Number, default: 0, min: 0 },
    lowStockThreshold: { type: Number, default: 5 },
    featured: { type: Boolean, default: false, index: true },
    active: { type: Boolean, default: true, index: true },
    seoTitle: { type: String, default: '' },
    seoDescription: { type: String, default: '' },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', shortDescription: 'text', description: 'text' });

export default mongoose.model('Product', productSchema);
