/** Static product catalog when the API is unavailable or not yet seeded. */
export const FALLBACK_PRODUCTS = [
  {
    _id: 'fallback-i-make-cute-kids-tee',
    name: 'I Make Cute Kids T-Shirt',
    slug: 'i-make-cute-kids-tee',
    shortDescription:
      'More than a t-shirt. Your purchase supports the CEO Foundation mission—fairness, accountability, and assistance.',
    description:
      'Bold red streetwear tee featuring the I Make Cute Kids design on the front and the CEO Foundation mission on the back (Option 2 layout). Printed on demand and shipped directly to you.\n\nYour purchase helps support the CEO Foundation’s mission to promote fairness, accountability, and assistance for individuals and families affected by injustice within the criminal justice system.\n\nContent related to this merchandise is provided for educational and entertainment purposes only. This is not legal advice and does not guarantee any legal outcome.',
    category: 'Apparel',
    price: 49.99,
    compareAtPrice: 0,
    sku: 'IMCK-TEE-RED',
    images: [
      {
        url: '/shop/i-make-cute-kids-front.png',
        publicId: 'local/i-make-cute-kids-front',
        alt: 'I Make Cute Kids t-shirt — front design on red tee',
        order: 0,
      },
      {
        url: '/shop/i-make-cute-kids-back.png',
        publicId: 'local/i-make-cute-kids-back',
        alt: 'I Make Cute Kids t-shirt — back with foundation mission message',
        order: 1,
      },
      {
        url: '/shop/i-make-cute-kids-layout.png',
        publicId: 'local/i-make-cute-kids-layout',
        alt: 'I Make Cute Kids t-shirt — print placement layout',
        order: 2,
      },
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    colors: ['Red'],
    stock: 999,
    featured: true,
    active: true,
    seoTitle: 'I Make Cute Kids T-Shirt | CEO Foundation Shop',
    seoDescription:
      'Shop the I Make Cute Kids mission tee for $49.99. Supports CEO Foundation advocacy and assistance.',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
];

export function getFallbackProduct(slug) {
  return FALLBACK_PRODUCTS.find((product) => product.slug === slug) ?? null;
}
