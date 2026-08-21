import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

function isHtmlPayload(data) {
  return typeof data === 'string' && data.trimStart().startsWith('<!');
}

api.interceptors.response.use(
  (response) => {
    if (isHtmlPayload(response.data)) {
      const normalized = new Error('API unavailable');
      normalized.status = response.status;
      return Promise.reject(normalized);
    }
    return response;
  },
  (error) => {
    const payload = error.response?.data;
    const message = payload?.message || error.message || 'Request failed';
    const normalized = new Error(message);
    normalized.status = error.response?.status;
    normalized.errors = payload?.errors;
    normalized.data = payload;
    return Promise.reject(normalized);
  }
);

export default api;
export { baseURL };
