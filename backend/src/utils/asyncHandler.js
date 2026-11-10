import express from 'express';

const METHODS = ['get', 'post', 'put', 'patch', 'delete'];

function wrap(fn) {
  if (typeof fn !== 'function' || fn.length >= 4) return fn;
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

/** Express 4 does not catch rejected promises; this router forwards them to errorHandler. */
export function safeRouter() {
  const router = express.Router();
  METHODS.forEach((method) => {
    const original = router[method].bind(router);
    router[method] = (path, ...handlers) => original(path, ...handlers.map(wrap));
  });
  return router;
}

export function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function csvCell(value) {
  let text = value == null ? '' : String(value);
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

export function parsePaging(query, defaultLimit = 20) {
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, Number.parseInt(query.limit, 10) || defaultLimit));
  return { page, limit, skip: (page - 1) * limit };
}
