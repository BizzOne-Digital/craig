# CEO Foundation

Production-ready MERN application for the CEO Foundation — a bold, cinematic public website with e-commerce, service intake, and a focused admin portal.

## Project overview

- **Frontend:** React + Vite, Tailwind CSS, GSAP, Framer Motion, Lenis
- **Backend:** Node.js + Express, MongoDB Atlas, Stripe Checkout, Cloudinary, Nodemailer
- **Admin:** Products, Services, Orders, Testimonials (cookie-based JWT auth)

```
jackson-lashley-foundation/
├── frontend/          # Public site + admin UI
├── backend/           # REST API
└── README.md
```

## Prerequisites

- Node.js 20+
- MongoDB Atlas cluster
- Cloudinary account
- Stripe account
- Gmail account with 2-Step Verification (App Password)

## Installation

### 1. Clone and install

```bash
cd jackson-lashley-foundation/backend
npm install

cd ../frontend
npm install
```

### 2. Environment setup

Copy the example files and fill in real values:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

**Backend required variables**

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Strong random secret (32+ chars) |
| `COOKIE_SECRET` | Strong random secret |
| `FRONTEND_URL` | e.g. `http://localhost:5173` |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `CLOUDINARY_*` | Cloudinary credentials |
| `SMTP_USER` / `SMTP_APP_PASSWORD` | Gmail SMTP |
| `FAMILY_DISCOUNT_VALUE` | Numeric discount value (required to enable FAMILY code) |

**Frontend**

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | e.g. `http://localhost:5000/api` |
| `VITE_APP_URL` | e.g. `http://localhost:5173` |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |

The server **fails fast** if required secrets are missing in production.

### 3. MongoDB Atlas

1. Create a free/paid cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a database user and allow your IP (or `0.0.0.0/0` for development)
3. Copy the connection string into `MONGODB_URI`

### 4. Cloudinary

1. Create an account at [cloudinary.com](https://cloudinary.com)
2. Copy Cloud Name, API Key, and API Secret to `.env`
3. Admin product/testimonial uploads use server-side signed uploads

### 5. Gmail App Password

1. Enable 2-Step Verification on your Google account
2. Go to Google Account → Security → App passwords
3. Generate an app password for "Mail"
4. Set `SMTP_USER` to your Gmail address and `SMTP_APP_PASSWORD` to the generated password
5. Set `ADMIN_NOTIFICATION_EMAIL=ceoassociatesllc@gmail.com`

### 6. Stripe Checkout & webhooks

**Local development**

```bash
stripe listen --forward-to localhost:5000/api/stripe/webhook
```

Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`.

**Production**

1. Create a webhook endpoint pointing to `https://your-api.com/api/stripe/webhook`
2. Listen for `checkout.session.completed`
3. Add the signing secret to production env

### 7. Seed admin & services

```bash
cd backend

# Set ADMIN_SEED_NAME, ADMIN_SEED_EMAIL, ADMIN_SEED_PASSWORD in .env first
# Password must be at least 12 characters
npm run seed:admin
npm run seed:services
```

There is **no public admin registration**. The first admin is created only via this script.

## Running locally

```bash
# Terminal 1 — API
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

- Public site: [http://localhost:5173](http://localhost:5173)
- Admin login: [http://localhost:5173/admin/login](http://localhost:5173/admin/login)
- API health: [http://localhost:5000/api/health](http://localhost:5000/api/health)

## FAMILY discount configuration

The discount code **FAMILY** is validated server-side only.

```env
FAMILY_DISCOUNT_TYPE=percentage   # or "fixed"
FAMILY_DISCOUNT_VALUE=15          # 15% or $15 off — set by client approval
```

If `FAMILY_DISCOUNT_VALUE` is empty, the code is rejected. **Never hardcode an unapproved amount in source code.**

## Production build

```bash
cd frontend && npm run build
cd ../backend && npm start
```

Serve `frontend/dist` via Vercel (or similar). Host the API on Render, Railway, or another Node platform.

### Vercel (frontend)

The repo root has no `package.json`; the Vite app lives in `frontend/`. A root `vercel.json` tells Vercel how to build it.

1. Import the GitHub repo in Vercel (leave **Root Directory** empty / `.`).
2. Vercel will use `vercel.json`: install in `frontend/`, build to `frontend/dist`, SPA rewrites for React Router.
3. Add **Environment Variables** in the Vercel project:

| Variable | Example |
|----------|---------|
| `VITE_API_BASE_URL` | `https://your-api.onrender.com/api` |
| `VITE_APP_URL` | `https://your-site.vercel.app` |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |

4. Redeploy after saving env vars.

**Alternative:** set Vercel **Root Directory** to `frontend` instead — Vite auto-detection works; `frontend/vercel.json` handles SPA routing.

**Suggested deployment**

| Layer | Platform |
|-------|----------|
| Frontend | Vercel |
| Backend | Render / Railway |
| Database | MongoDB Atlas |
| Images | Cloudinary |
| Payments | Stripe |

Set `FRONTEND_URL` and CORS on the backend to match your production frontend URL.

## Public routes

`/`, `/about`, `/services`, `/services/:slug`, `/shop`, `/shop/:slug`, `/cart`, `/booking`, `/team`, `/pricing`, `/blog`, `/blog/:slug`, `/contact`, `/testimonials`, `/faq`, `/privacy`, `/terms`, `/shipping-returns`, `/disclaimer`, `/order/success`, `/order/cancel`

## Admin routes

`/admin/login`, `/admin/dashboard`, `/admin/products`, `/admin/services`, `/admin/orders`, `/admin/testimonials`

## Testing

```bash
cd backend
npm test
```

Tests cover discount validation, server-side totals, auth cookie policy, form validation, and idempotency patterns.

## Replacing imagery and copy

- **Hero / section images:** Replace URLs in page components or upload product images via admin
- **About origin story:** Marked with `[CLIENT REPLACEMENT]` placeholders on `/about`
- **Legal pages:** Marked `[DRAFT — FOR CLIENT & LEGAL REVIEW]`
- **Team:** Shows "Leadership information coming soon" until real profiles are added via future CMS work
- **Blog:** Seed content in `frontend/src/data/blogPosts.js`

## Security notes

- Admin JWT stored in **HTTP-only, SameSite** cookies — not localStorage
- Product `baseCost` excluded from all public API responses
- Checkout totals calculated **server-side** from MongoDB prices
- Stripe webhook is the source of truth for paid orders
- Rate limiting on login, checkout, booking, and contact endpoints
- Honeypot fields on public forms
- Helmet, CORS allowlist, input sanitization, bcrypt password hashing

## Launch checklist

- [ ] All `.env` values set for production
- [ ] MongoDB Atlas IP allowlist configured
- [ ] Stripe webhook live and tested
- [ ] Gmail / transactional email sending verified
- [ ] Cloudinary uploads tested from admin
- [ ] FAMILY discount value approved and configured
- [ ] Legal pages reviewed by client counsel
- [ ] No secrets committed to git
- [ ] Admin password rotated after first login
- [ ] Lighthouse accessibility audit passed

## Contact

**CEO Foundation**  
Email: ceoassociatesllc@gmail.com  
Phone: 314-267-5674

Information on this site is general and does not guarantee any legal outcome.
