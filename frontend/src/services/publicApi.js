import api from './api.js';
import { FALLBACK_SERVICES, getFallbackService } from '../data/fallbackServices.js';

function unwrap(response) {
  const payload = response.data;
  if (payload && typeof payload === 'object' && Object.prototype.hasOwnProperty.call(payload, 'success')) {
    return {
      data: payload.data,
      meta: payload.meta ?? null,
    };
  }
  return { data: payload, meta: null };
}

function servicesFallback() {
  return { data: FALLBACK_SERVICES, meta: null };
}

export async function getProducts(params = {}) {
  const response = await api.get('/products', { params });
  return unwrap(response);
}

export async function getProduct(slug) {
  const response = await api.get(`/products/${slug}`);
  return unwrap(response);
}

export async function getServices(params = {}) {
  try {
    const response = await api.get('/services', { params });
    const result = unwrap(response);
    return Array.isArray(result.data) ? result : servicesFallback();
  } catch {
    return servicesFallback();
  }
}

export async function getService(slug) {
  try {
    const response = await api.get(`/services/${slug}`);
    const result = unwrap(response);
    if (result.data && typeof result.data === 'object') {
      return result;
    }
    const fallback = getFallbackService(slug);
    if (fallback) return { data: fallback, meta: null };
    throw new Error('Service not found');
  } catch (error) {
    const fallback = getFallbackService(slug);
    if (fallback) return { data: fallback, meta: null };
    throw error;
  }
}

export async function getTestimonials(params = {}) {
  const response = await api.get('/testimonials', { params });
  return unwrap(response);
}

export async function validateDiscount(code) {
  const response = await api.post('/discounts/validate', { code });
  return unwrap(response);
}

export async function createCheckout(payload) {
  const response = await api.post('/checkout/session', payload);
  return unwrap(response);
}

export async function getOrderBySession(sessionId) {
  const response = await api.get('/orders/by-session', {
    params: { sessionId },
  });
  return unwrap(response);
}

export async function submitBooking(payload) {
  const response = await api.post('/bookings', payload);
  return unwrap(response);
}

export async function submitContact(payload) {
  const response = await api.post('/contact', payload);
  return unwrap(response);
}
