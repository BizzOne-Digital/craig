import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Admin from '../models/Admin.js';
import { validateEnv } from '../config/env.js';

dotenv.config();

async function seedAdmin() {
  validateEnv();
  await connectDB();

  const { name, email, password } = {
    name: process.env.ADMIN_SEED_NAME,
    email: process.env.ADMIN_SEED_EMAIL,
    password: process.env.ADMIN_SEED_PASSWORD,
  };

  if (!name || !email || !password) {
    throw new Error('ADMIN_SEED_NAME, ADMIN_SEED_EMAIL, and ADMIN_SEED_PASSWORD are required');
  }

  if (password.length < 12) {
    throw new Error('ADMIN_SEED_PASSWORD must be at least 12 characters');
  }

  const existing = await Admin.findOne({ email: email.toLowerCase() });
  if (existing) {
    console.log('Admin already exists:', email);
    process.exit(0);
  }

  const passwordHash = await Admin.hashPassword(password);
  await Admin.create({ name, email: email.toLowerCase(), passwordHash });
  console.log('Admin seeded successfully:', email);
  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
