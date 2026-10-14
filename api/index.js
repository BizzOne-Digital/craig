// Force Vercel to trace and bundle runtime dependencies for backend/src imports.
import 'express';
import 'mongoose';
import 'stripe';

import { getApp } from '../backend/src/app.js';

let appInstance;

export default async function handler(req, res) {
  try {
    if (!appInstance) {
      appInstance = await getApp();
    }
    appInstance(req, res);
  } catch (error) {
    console.error('API error:', error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: error.message || 'API failed to start. Check Vercel environment variables.',
      });
    }
  }
}
