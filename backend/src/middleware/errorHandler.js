import { ZodError } from 'zod';
import { fail } from '../utils/apiResponse.js';
import logger from '../utils/logger.js';

export function validate(schema, source = 'body') {
  return (req, res, next) => {
    try {
      const parsed = schema.parse(req[source]);
      req[source] = parsed;
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return fail(res, 'Validation failed', 400, error.flatten().fieldErrors);
      }
      return next(error);
    }
  };
}

export function notFound(req, res) {
  return fail(res, 'Route not found', 404);
}

export function errorHandler(err, req, res, _next) {
  logger.error('Unhandled error', { message: err.message, stack: err.stack });
  const status = err.statusCode || 500;
  const message = status === 500 ? 'Something went wrong' : err.message;
  return fail(res, message, status);
}
