import express from 'express';
import { listProducts, getProductBySlug } from '../controllers/productController.js';
import { listServices, getServiceBySlug } from '../controllers/serviceController.js';
import { listTestimonials } from '../controllers/testimonialController.js';
import {
  createCheckoutSession,
  getCheckoutSettings,
  getOrderBySession,
  validateDiscount,
} from '../controllers/checkoutController.js';
import {
  createDonationCheckoutSession,
  getDonationBySession,
} from '../controllers/donationController.js';
import { submitBooking, submitContact } from '../controllers/formController.js';
import { validate } from '../middleware/errorHandler.js';
import {
  checkoutSchema,
  discountSchema,
  donationSchema,
  bookingSchema,
  contactSchema,
} from '../validators/schemas.js';
import { checkoutLimiter, formLimiter } from '../middleware/rateLimit.js';

const router = express.Router();

router.get('/products', listProducts);
router.get('/products/:slug', getProductBySlug);
router.get('/services', listServices);
router.get('/services/:slug', getServiceBySlug);
router.get('/testimonials', listTestimonials);
router.get('/orders/by-session', getOrderBySession);
router.get('/checkout/settings', getCheckoutSettings);
router.get('/donations/by-session', getDonationBySession);

router.post('/discounts/validate', checkoutLimiter, validate(discountSchema), validateDiscount);
router.post('/checkout/session', checkoutLimiter, validate(checkoutSchema), createCheckoutSession);
router.post('/donations/checkout', checkoutLimiter, validate(donationSchema), createDonationCheckoutSession);
router.post('/bookings', formLimiter, validate(bookingSchema), submitBooking);
router.post('/contact', formLimiter, validate(contactSchema), submitContact);

export default router;
