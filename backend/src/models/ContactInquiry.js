import mongoose from 'mongoose';

const contactInquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, default: '' },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    replyMethod: { type: String, default: 'email' },
    consent: { type: Boolean, required: true },
    ipHash: { type: String, default: '' },
  },
  { timestamps: true }
);

contactInquirySchema.index({ createdAt: -1 });

export default mongoose.model('ContactInquiry', contactInquirySchema);
