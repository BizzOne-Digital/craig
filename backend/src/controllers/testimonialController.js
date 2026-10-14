import Testimonial from '../models/Testimonial.js';
import { created, fail, success } from '../utils/apiResponse.js';
import { deleteImage } from '../services/cloudinaryService.js';

export async function listTestimonials(_req, res) {
  const testimonials = await Testimonial.find({ published: true }).sort({ displayOrder: 1, createdAt: -1 });
  return success(res, testimonials);
}

export async function adminListTestimonials(_req, res) {
  const testimonials = await Testimonial.find().sort({ displayOrder: 1 });
  return success(res, testimonials);
}

export async function adminGetTestimonial(req, res) {
  const testimonial = await Testimonial.findById(req.params.id);
  if (!testimonial) return fail(res, 'Testimonial not found', 404);
  return success(res, testimonial);
}

export async function createTestimonial(req, res) {
  const testimonial = await Testimonial.create(req.body);
  return created(res, testimonial);
}

export async function updateTestimonial(req, res) {
  const testimonial = await Testimonial.findById(req.params.id);
  if (!testimonial) return fail(res, 'Testimonial not found', 404);

  const oldPublicId = testimonial.image?.publicId;
  Object.assign(testimonial, req.body);
  await testimonial.save();

  if (oldPublicId && oldPublicId !== testimonial.image?.publicId) {
    await deleteImage(oldPublicId);
  }

  return success(res, testimonial);
}

export async function deleteTestimonial(req, res) {
  const testimonial = await Testimonial.findById(req.params.id);
  if (!testimonial) return fail(res, 'Testimonial not found', 404);
  if (testimonial.image?.publicId) await deleteImage(testimonial.image.publicId);
  await testimonial.deleteOne();
  return success(res, { deleted: true });
}
