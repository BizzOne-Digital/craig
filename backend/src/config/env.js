import dotenv from 'dotenv';

dotenv.config();

const required = [
  'MONGODB_URI',
  'JWT_SECRET',
  'COOKIE_SECRET',
  'FRONTEND_URL',
];

const requiredInProduction = [
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'SMTP_USER',
  'SMTP_APP_PASSWORD',
];

function getEnv(key, fallback = undefined) {
  const value = process.env[key];
  if (value === undefined || value === '') {
    if (fallback !== undefined) return fallback;
    return null;
  }
  return value;
}

function validateEnv() {
  const missing = required.filter((key) => !getEnv(key));
  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  if (process.env.NODE_ENV === 'production') {
    const missingProd = requiredInProduction.filter((key) => !getEnv(key));
    if (missingProd.length) {
      throw new Error(`Missing production environment variables: ${missingProd.join(', ')}`);
    }
  }

  const familyValue = getEnv('FAMILY_DISCOUNT_VALUE');
  if (familyValue !== null && Number.isNaN(Number(familyValue))) {
    throw new Error('FAMILY_DISCOUNT_VALUE must be a valid number when set');
  }
}

export const env = {
  nodeEnv: getEnv('NODE_ENV', 'development'),
  port: Number(getEnv('PORT', '5000')),
  mongodbUri: getEnv('MONGODB_URI'),
  frontendUrl: getEnv('FRONTEND_URL'),
  jwtSecret: getEnv('JWT_SECRET'),
  cookieSecret: getEnv('COOKIE_SECRET'),
  jwtExpiresIn: getEnv('JWT_EXPIRES_IN', '2h'),
  adminSeed: {
    name: getEnv('ADMIN_SEED_NAME'),
    email: getEnv('ADMIN_SEED_EMAIL'),
    password: getEnv('ADMIN_SEED_PASSWORD'),
  },
  cloudinary: {
    cloudName: getEnv('CLOUDINARY_CLOUD_NAME'),
    apiKey: getEnv('CLOUDINARY_API_KEY'),
    apiSecret: getEnv('CLOUDINARY_API_SECRET'),
  },
  smtp: {
    host: getEnv('SMTP_HOST', 'smtp.gmail.com'),
    port: Number(getEnv('SMTP_PORT', '465')),
    secure: getEnv('SMTP_SECURE', 'true') === 'true',
    user: getEnv('SMTP_USER'),
    pass: getEnv('SMTP_APP_PASSWORD'),
  },
  adminNotificationEmail: getEnv('ADMIN_NOTIFICATION_EMAIL', 'ceoassociatesllc@gmail.com'),
  stripe: {
    secretKey: getEnv('STRIPE_SECRET_KEY'),
    webhookSecret: getEnv('STRIPE_WEBHOOK_SECRET'),
    currency: getEnv('STRIPE_CURRENCY', 'usd'),
  },
  discount: {
    code: 'FAMILY',
    type: getEnv('FAMILY_DISCOUNT_TYPE', 'percentage'),
    value: getEnv('FAMILY_DISCOUNT_VALUE') !== null ? Number(getEnv('FAMILY_DISCOUNT_VALUE')) : null,
  },
  shippingFlatRate: Number(getEnv('SHIPPING_FLAT_RATE', '8.99')),
  taxRate: Number(getEnv('TAX_RATE', '0')),
  isProduction: getEnv('NODE_ENV', 'development') === 'production',
};

export { validateEnv };
