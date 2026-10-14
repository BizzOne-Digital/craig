import { getApp } from '../backend/src/app.js';

const appPromise = getApp();

export default async function handler(req, res) {
  try {
    const app = await appPromise;
    app(req, res);
  } catch (error) {
    console.error('API bootstrap failed:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'API failed to start. Check Vercel environment variables.',
    });
  }
}
