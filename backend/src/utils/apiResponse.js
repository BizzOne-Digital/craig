export function success(res, data = null, meta = null, status = 200) {
  const payload = { success: true, data };
  if (meta) payload.meta = meta;
  return res.status(status).json(payload);
}

export function created(res, data = null) {
  return success(res, data, null, 201);
}

export function fail(res, message = 'Something went wrong', status = 500, errors = null) {
  const payload = { success: false, message };
  if (errors) payload.errors = errors;
  return res.status(status).json(payload);
}
