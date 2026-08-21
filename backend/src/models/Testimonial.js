import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema(
  {
    quote: { type: String, required: true, trim: true },
    displayName: { type: String, required: true, trim: true },
    roleOrLocation: { type: String, default: '' },
    image: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
      alt: { type: String, default: '' },
    },
    featured: { type: Boolean, default: false, index: true },
    published: { type: Boolean, default: false, index: true },
    displayOrder: { type: Number, default: 0, index: true },
  },
  { timestamps: true }
);

export default mongoose.model('Testimonial', testimonialSchema);
