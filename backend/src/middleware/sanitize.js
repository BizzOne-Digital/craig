import sanitizeHtml from 'sanitize-html';

export function sanitizeInput(value) {
  if (typeof value === 'string') {
    return sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} }).trim();
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
