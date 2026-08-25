import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Product from '../models/Product.js';
import { validateEnv } from '../config/env.js';

dotenv.config();

const frontendUrl = (process.env.FRONTEND_URL || '').replace(/\/$/, '');
const asset = (path) => (frontendUrl ? `${frontendUrl}${path}` : path);

const products = [
  {
    name: 'I Make Cute Kids T-Shirt',
    slug: 'i-make-cute-kids-tee',
    shortDescription:
      'More than a t-shirt. Your purchase supports the Jackson-Lashley Foundation mission—fairness, accountability, and assistance.',
    description:
      'Bold red streetwear tee featuring the I Make Cute Kids design on the front and the Jackson-Lashley Foundation mission on the back (Option 2 layout). Printed on demand and shipped directly to you.\n\nYour purchase helps support the Jackson-Lashley Foundation’s mission to promote fairness, accountability, and assistance for individuals and families affected by injustice within the criminal justice system.\n\nContent related to this merchandise is provided for educational and entertainment purposes only. This is not legal advice and does not guarantee any legal outcome.',
    category: 'Apparel',
    baseCost: 28,
    price: 49.99,
    compareAtPrice: 0,
    sku: 'IMCK-TEE-RED',
    images: [
      {
        url: asset('/shop/i-make-cute-kids-front.png'),
        publicId: 'local/i-make-cute-kids-front',
        alt: 'I Make Cute Kids t-shirt — front design on red tee',
        order: 0,
      },
      {
        url: asset('/shop/i-make-cute-kids-back.png'),
        publicId: 'local/i-make-cute-kids-back',
        alt: 'I Make Cute Kids t-shirt — back with foundation mission message',
        order: 1,
      },
      {
        url: asset('/shop/i-make-cute-kids-layout.png'),
        publicId: 'local/i-make-cute-kids-layout',
        alt: 'I Make Cute Kids t-shirt — print placement layout',
        order: 2,
      },
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    colors: ['Red'],
    stock: 999,
    lowStockThreshold: 5,
    featured: true,
    active: true,
    seoTitle: 'I Make Cute Kids T-Shirt | Jackson-Lashley Foundation Shop',
    seoDescription:
      'Shop the I Make Cute Kids mission tee for $49.99. Supports Jackson-Lashley Foundation advocacy and assistance.',
  },
];

async function seedProducts() {
  validateEnv();
  await connectDB();

  for (const product of products) {
    await Product.findOneAndUpdate({ slug: product.slug }, product, { upsert: true, new: true });
    console.log('Seeded product:', product.name);
  }

  process.exit(0);
}

seedProducts().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
