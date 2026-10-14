import Service from '../models/Service.js';
import { slugify } from '../utils/slugify.js';
import { created, fail, success } from '../utils/apiResponse.js';

export async function listServices(_req, res) {
  const services = await Service.find({ active: true }).sort({ displayOrder: 1, createdAt: 1 });
  return success(res, services);
}

export async function getServiceBySlug(req, res) {
  const service = await Service.findOne({ slug: req.params.slug, active: true });
  if (!service) return fail(res, 'Service not found', 404);
  return success(res, service);
}

export async function adminListServices(_req, res) {
  const services = await Service.find().sort({ displayOrder: 1 });
  return success(res, services);
}

export async function adminGetService(req, res) {
  const service = await Service.findById(req.params.id);
  if (!service) return fail(res, 'Service not found', 404);
  return success(res, service);
}

export async function createService(req, res) {
  const data = { ...req.body };
  data.slug = data.slug ? slugify(data.slug) : slugify(data.title);
  const existing = await Service.findOne({ slug: data.slug });
  if (existing) return fail(res, 'Slug already exists', 409);
  const service = await Service.create(data);
  return created(res, service);
}

export async function updateService(req, res) {
  const service = await Service.findById(req.params.id);
  if (!service) return fail(res, 'Service not found', 404);
  Object.assign(service, req.body);
  if (req.body.slug) service.slug = slugify(req.body.slug);
  await service.save();
  return success(res, service);
}

export async function deleteService(req, res) {
  const service = await Service.findById(req.params.id);
  if (!service) return fail(res, 'Service not found', 404);
  await service.deleteOne();
  return success(res, { deleted: true });
}

export async function reorderServices(req, res) {
  const { items } = req.body;
  if (!Array.isArray(items)) return fail(res, 'Invalid payload', 400);
  await Promise.all(items.map(({ id, displayOrder }) => Service.findByIdAndUpdate(id, { displayOrder })));
  const services = await Service.find().sort({ displayOrder: 1 });
  return success(res, services);
}
