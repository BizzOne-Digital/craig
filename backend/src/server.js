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

dotenv.config();

try {
  validateEnv();
} catch (error) {
  logger.error(error.message);
  process.exit(1);
}

const app = express();
await connectDB();

app.set('trust proxy', 1);

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

app.use(cors({
  origin: env.frontendUrl,
  credentials: true,
}));

app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

app.use(express.json({ limit: '1mb' }));
app.use(cookieParser(env.cookieSecret));
app.use(sanitizeBody);
app.use('/api', apiLimiter);

app.get('/api/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok', env: env.nodeEnv } });
});

app.use('/api', publicRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/upload', uploadRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(env.port, () => {
  logger.info(`Server running on port ${env.port}`);
});

export default app;
