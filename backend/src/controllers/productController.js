import Product from '../models/Product.js';
import { slugify } from '../utils/slugify.js';
import { created, fail, success } from '../utils/apiResponse.js';
import { deleteImage } from '../services/cloudinaryService.js';

const publicSelect = '-baseCost';

export async function listProducts(req, res) {
  const { page = 1, limit = 20, search = '', category, active, featured, inStock } = req.query;
  const filter = { active: active === 'false' ? false : true };
  if (search) filter.$text = { $search: search };
  if (category) filter.category = category;
  if (featured !== undefined) filter.featured = featured === 'true';
  if (inStock === 'true') filter.stock = { $gt: 0 };

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Product.find(filter).select(publicSelect).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Product.countDocuments(filter),
  ]);

  return success(res, items, { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) });
}

export async function getProductBySlug(req, res) {
  const product = await Product.findOne({ slug: req.params.slug, active: true }).select(publicSelect);
  if (!product) return fail(res, 'Product not found', 404);
  return success(res, product);
}

export async function adminListProducts(req, res) {
  const products = await Product.find().sort({ createdAt: -1 });
  return success(res, products);
}

export async function adminGetProduct(req, res) {
  const product = await Product.findById(req.params.id);
  if (!product) return fail(res, 'Product not found', 404);
  return success(res, product);
}

export async function createProduct(req, res) {
  const data = { ...req.body };
  data.slug = data.slug ? slugify(data.slug) : slugify(data.name);
  const existing = await Product.findOne({ slug: data.slug });
  if (existing) return fail(res, 'Slug already exists', 409);
  const product = await Product.create(data);
  return created(res, product);
}

export async function updateProduct(req, res) {
  const product = await Product.findById(req.params.id);
  if (!product) return fail(res, 'Product not found', 404);

  const oldImages = [...product.images];
  Object.assign(product, req.body);
  if (req.body.slug) product.slug = slugify(req.body.slug);
  await product.save();

  const removed = oldImages.filter((old) => !product.images.some((img) => img.publicId === old.publicId));
  await Promise.all(removed.map((img) => deleteImage(img.publicId)));

  return success(res, product);
}

export async function deleteProduct(req, res) {
  const product = await Product.findById(req.params.id);
  if (!product) return fail(res, 'Product not found', 404);
  await Promise.all(product.images.map((img) => deleteImage(img.publicId)));
  await product.deleteOne();
  return success(res, { deleted: true });
}

export async function uploadProductImages(req, res) {
  if (!req.files?.length) return fail(res, 'No files uploaded', 400);
  const images = req.files.map((file, index) => ({
    url: file.path || file.secure_url,
    publicId: file.filename || file.public_id,
    alt: file.originalname,
    order: index,
  }));
  return success(res, images);
}
