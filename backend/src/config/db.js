import mongoose from 'mongoose';
import { env } from './env.js';
import logger from '../utils/logger.js';

const globalCache = globalThis;

export async function connectDB() {
  if (globalCache.__mongooseConn?.connection?.readyState === 1) {
    return globalCache.__mongooseConn;
  }

  mongoose.set('strictQuery', true);

  if (!globalCache.__mongoosePromise) {
    globalCache.__mongoosePromise = mongoose
      .connect(env.mongodbUri)
      .then((conn) => {
        globalCache.__mongooseConn = conn;
        logger.info('MongoDB connected');
        return conn;
      })
      .catch((error) => {
        globalCache.__mongoosePromise = null;
        throw error;
      });
  }

  return globalCache.__mongoosePromise;
}

export default connectDB;
