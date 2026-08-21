import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import Admin from '../models/Admin.js';
import { fail } from '../utils/apiResponse.js';

export function signToken(admin) {
  return jwt.sign(
    { sub: admin._id.toString(), email: admin.email, role: admin.role },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );
}

export async function requireAdmin(req, res, next) {
  try {
    const token = req.cookies?.jlf_admin_token;
    if (!token) {
      return fail(res, 'Authentication required', 401);
    }

    const payload = jwt.verify(token, env.jwtSecret);
    const admin = await Admin.findById(payload.sub).select('-passwordHash');
    if (!admin || !admin.active) {
      return fail(res, 'Authentication required', 401);
    }

    req.admin = admin;
    return next();
  } catch {
    return fail(res, 'Authentication required', 401);
  }
}

export const authCookieOptions = {
  httpOnly: true,
  secure: env.isProduction,
  sameSite: env.isProduction ? 'strict' : 'lax',
  maxAge: 2 * 60 * 60 * 1000,
  path: '/',
};
