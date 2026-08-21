import express from 'express';
import { login, logout, me, dashboard } from '../controllers/adminController.js';
import {
  adminListProducts,
  adminGetProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import {
  adminListServices,
  adminGetService,
  createService,
  updateService,
  deleteService,
  reorderServices,
} from '../controllers/serviceController.js';
import {
  adminListOrders,
  adminGetOrder,
  adminUpdateOrder,
  exportOrdersCsv,
} from '../controllers/checkoutController.js';
import {
  adminListTestimonials,
  adminGetTestimonial,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from '../controllers/testimonialController.js';
import { requireAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/errorHandler.js';
import {
  loginSchema,
  productSchema,
  serviceSchema,
  testimonialSchema,
  orderUpdateSchema,
} from '../validators/schemas.js';
import { loginLimiter } from '../middleware/rateLimit.js';

const router = express.Router();

router.post('/auth/login', loginLimiter, validate(loginSchema), login);
router.post('/auth/logout', logout);
router.get('/auth/me', requireAdmin, me);

router.get('/dashboard', requireAdmin, dashboard);

router.get('/products', requireAdmin, adminListProducts);
router.get('/products/:id', requireAdmin, adminGetProduct);
router.post('/products', requireAdmin, validate(productSchema), createProduct);
router.put('/products/:id', requireAdmin, validate(productSchema), updateProduct);
router.delete('/products/:id', requireAdmin, deleteProduct);

router.get('/services', requireAdmin, adminListServices);
router.get('/services/:id', requireAdmin, adminGetService);
router.post('/services', requireAdmin, validate(serviceSchema), createService);
router.put('/services/:id', requireAdmin, validate(serviceSchema), updateService);
router.delete('/services/:id', requireAdmin, deleteService);
router.patch('/services/reorder', requireAdmin, reorderServices);

router.get('/orders', requireAdmin, adminListOrders);
router.get('/orders/export.csv', requireAdmin, exportOrdersCsv);
router.get('/orders/:id', requireAdmin, adminGetOrder);
router.patch('/orders/:id', requireAdmin, validate(orderUpdateSchema), adminUpdateOrder);

router.get('/testimonials', requireAdmin, adminListTestimonials);
router.get('/testimonials/:id', requireAdmin, adminGetTestimonial);
router.post('/testimonials', requireAdmin, validate(testimonialSchema), createTestimonial);
router.put('/testimonials/:id', requireAdmin, validate(testimonialSchema), updateTestimonial);
router.delete('/testimonials/:id', requireAdmin, deleteTestimonial);

export default router;
