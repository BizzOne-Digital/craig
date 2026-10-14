import api from './api.js';

function unwrap(response) {
  return response.data?.data ?? response.data;
}

function unwrapMeta(response) {
  return {
    data: unwrap(response),
    meta: response.data?.meta ?? null,
  };
}

export async function adminLogin(credentials) {
  const response = await api.post('/admin/auth/login', credentials);
  return unwrap(response);
}

export async function adminLogout() {
  const response = await api.post('/admin/auth/logout');
  return unwrap(response);
}

export async function adminMe() {
  const response = await api.get('/admin/auth/me');
  return unwrap(response);
}

export async function getDashboard() {
  const response = await api.get('/admin/dashboard');
  return unwrap(response);
}

export async function getAdminProducts(params = {}) {
  const response = await api.get('/admin/products', { params });
  return unwrapMeta(response);
}

export async function getAdminProduct(id) {
  const response = await api.get(`/admin/products/${id}`);
  return unwrap(response);
}

export async function createAdminProduct(payload) {
  const response = await api.post('/admin/products', payload);
  return unwrap(response);
}

export async function updateAdminProduct(id, payload) {
  const response = await api.put(`/admin/products/${id}`, payload);
  return unwrap(response);
}

export async function deleteAdminProduct(id) {
  const response = await api.delete(`/admin/products/${id}`);
  return unwrap(response);
}

export async function uploadProductImages(formData) {
  const response = await api.post('/admin/upload/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return unwrap(response);
}

export async function getAdminServices(params = {}) {
  const response = await api.get('/admin/services', { params });
  return unwrap(response);
}

export async function getAdminService(id) {
  const response = await api.get(`/admin/services/${id}`);
  return unwrap(response);
}

export async function createAdminService(payload) {
  const response = await api.post('/admin/services', payload);
  return unwrap(response);
}

export async function updateAdminService(id, payload) {
  const response = await api.put(`/admin/services/${id}`, payload);
  return unwrap(response);
}

export async function deleteAdminService(id) {
  const response = await api.delete(`/admin/services/${id}`);
  return unwrap(response);
}

export async function reorderAdminServices(items) {
  const response = await api.patch('/admin/services/reorder', { items });
  return unwrap(response);
}

export async function getAdminOrders(params = {}) {
  const response = await api.get('/admin/orders', { params });
  return unwrapMeta(response);
}

export async function getAdminOrder(id) {
  const response = await api.get(`/admin/orders/${id}`);
  return unwrap(response);
}

export async function updateAdminOrder(id, payload) {
  const response = await api.patch(`/admin/orders/${id}`, payload);
  return unwrap(response);
}

export async function exportOrdersCsv(params = {}) {
  const response = await api.get('/admin/orders/export.csv', {
    params,
    responseType: 'blob',
  });
  return response.data;
}

export async function getAdminTestimonials(params = {}) {
  const response = await api.get('/admin/testimonials', { params });
  return unwrap(response);
}

export async function getAdminTestimonial(id) {
  const response = await api.get(`/admin/testimonials/${id}`);
  return unwrap(response);
}

export async function createAdminTestimonial(payload) {
  const response = await api.post('/admin/testimonials', payload);
  return unwrap(response);
}

export async function updateAdminTestimonial(id, payload) {
  const response = await api.put(`/admin/testimonials/${id}`, payload);
  return unwrap(response);
}

export async function deleteAdminTestimonial(id) {
  const response = await api.delete(`/admin/testimonials/${id}`);
  return unwrap(response);
}

export async function uploadTestimonialImage(formData) {
  const response = await api.post('/admin/upload/testimonials', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return unwrap(response);
}
