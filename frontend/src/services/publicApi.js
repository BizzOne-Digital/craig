import api from './api.js';
import { FALLBACK_SERVICES, getFallbackService } from '../data/fallbackServices.js';
import { FALLBACK_PRODUCTS, getFallbackProduct } from '../data/fallbackProducts.js';

function enrichProduct(product) {
  if (!product || typeof product !== 'object') return product;
  const fallback = getFallbackProduct(product.slug);
  if (!fallback) return product;
  return {
    ...fallback,
    ...product,
    sizes: product.sizes?.length ? product.sizes : fallback.sizes,
    colors: product.colors?.length ? product.colors : fallback.colors,
    images: product.images?.length ? product.images : fallback.images,
  };
}

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

function productsFallback() {
  return { data: FALLBACK_PRODUCTS, meta: null };
}

export async function getProducts(params = {}) {
  try {
    const response = await api.get('/products', { params });
    const result = unwrap(response);
    const list = Array.isArray(result.data) ? result.data : [];
    return list.length > 0 ? result : productsFallback();
  } catch {
    return productsFallback();
  }
}

export async function getProduct(slug) {
  try {
    const response = await api.get(`/products/${slug}`);
    const result = unwrap(response);
    if (result.data && typeof result.data === 'object') {
      return { data: enrichProduct(result.data), meta: result.meta };
    }
    const fallback = getFallbackProduct(slug);
    if (fallback) return { data: fallback, meta: null };
    throw new Error('Product not found');
  } catch (error) {
    const fallback = getFallbackProduct(slug);
    if (fallback) return { data: fallback, meta: null };
    throw error;
  }
}

function mergeServices(apiList) {
  const bySlug = new Map();
  for (const service of FALLBACK_SERVICES) {
    bySlug.set(service.slug, service);
  }
  for (const service of apiList) {
    bySlug.set(service.slug, service);
  }
  return [...bySlug.values()].sort(
    (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0) || a.title.localeCompare(b.title)
  );
}

export async function getServices(params = {}) {
  try {
    const response = await api.get('/services', { params });
    const result = unwrap(response);
    const list = Array.isArray(result.data) ? result.data : [];
    if (list.length === 0) return servicesFallback();
    return { data: mergeServices(list), meta: result.meta };
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
