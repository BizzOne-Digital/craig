/** Lightweight sanitizer (no sanitize-html) — safe for Vercel serverless bundles. */
function stripHtml(value) {
  return value
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .trim();
}

export function sanitizeInput(value) {
  if (typeof value === 'string') {
    return stripHtml(value);
  }
  if (Array.isArray(value)) return value.map(sanitizeInput);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, sanitizeInput(v)]));
  }
  return value;
}

export function sanitizeBody(req, _res, next) {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeInput(req.body);
  }
  next();
}
