import dotenv from 'dotenv';
import { env } from './config/env.js';
import { getApp } from './app.js';
import logger from './utils/logger.js';

dotenv.config();

try {
  const app = await getApp();
  app.listen(env.port, () => {
    logger.info(`Server running on port ${env.port}`);
  });
} catch (error) {
  logger.error(error.message);
  process.exit(1);
}
