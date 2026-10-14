import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { validateEnv, env } from './config/env.js';
import connectDB from './config/db.js';
import publicRoutes from './routes/publicRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import { handleStripeWebhook } from './controllers/checkoutController.js';
import { sanitizeBody } from './middleware/sanitize.js';
import { apiLimiter } from './middleware/rateLimit.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import logger from './utils/logger.js';

let appInstance = null;

function buildCorsOrigins() {
  const origins = new Set(
    [env.frontendUrl, ...env.allowedOrigins].filter(Boolean).map((url) => url.replace(/\/$/, ''))
  );
  if (process.env.VERCEL_URL) {
    origins.add(`https://${process.env.VERCEL_URL.replace(/\/$/, '')}`);
  }
  return origins;
}

export async function getApp() {
  if (appInstance) return appInstance;

  dotenv.config();
  validateEnv();
  await connectDB();

  const app = express();
  app.set('trust proxy', 1);

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  );

  const corsOrigins = buildCorsOrigins();

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin) {
          callback(null, true);
          return;
        }
        const normalized = origin.replace(/\/$/, '');
        if (corsOrigins.has(normalized)) {
          callback(null, true);
          return;
        }
        callback(null, false);
      },
      credentials: true,
    })
  );

  app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

  app.use(express.json({ limit: '1mb' }));
  app.use(cookieParser(env.cookieSecret));
  app.use(sanitizeBody);
  app.use('/api', apiLimiter);

  app.get('/api/health', (_req, res) => {
    res.json({ success: true, data: { status: 'ok', env: env.nodeEnv, host: 'vercel-serverless' } });
  });

  app.use('/api', publicRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/admin/upload', uploadRoutes);

  app.use(notFound);
  app.use(errorHandler);

  appInstance = app;
  logger.info('API app initialized');
  return appInstance;
}

export default getApp;
