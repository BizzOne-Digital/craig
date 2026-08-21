import mongoose from 'mongoose';

const bookingRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, default: '' },
    service: { type: String, required: true },
    serviceSlug: { type: String, default: '' },
    preferredDate: { type: String, required: true },
    preferredTime: { type: String, required: true },
    contactPreference: { type: String, default: 'email' },
    message: { type: String, default: '' },
    consent: { type: Boolean, required: true },
    ipHash: { type: String, default: '' },
  },
  { timestamps: true }
);

bookingRequestSchema.index({ createdAt: -1 });

export default mongoose.model('BookingRequest', bookingRequestSchema);
