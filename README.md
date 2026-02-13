# SkinFluencer

Premium skincare e-commerce platform for **Bangladesh**. BDT ৳ currency, light & dark themes, Skin-Insider membership, and local payment support (bKash, Nagad, Visa/Mastercard).

## Features

- **Platform**: High-end skincare experience (Ralph Lauren / Lacoste–inspired design)
- **Market**: Bangladesh-based; all prices in Bangladeshi Taka (BDT ৳)
- **Theme**: Persistent light/dark mode with system detection
- **Users**: Guest (session cart), Regular (dashboard, addresses, order history), Skin-Insider (early access, members-only shop, discounts, VIP support)
- **Navigation**: Persistent search bar with autocomplete and popular terms
- **Products**: Filters by skin type (Oily, Dry, Combination, Sensitive), concerns (Acne, Anti-aging, Hyperpigmentation), ingredients (Vitamin C, Retinol, Niacinamide)
- **PDP**: Image gallery with zoom-on-hover, “Complete Your Routine” suggestions, inventory alerts (In Stock / Low Stock / Out of Stock)
- **Cart**: Session-based; BDT display; checkout with delivery and payment (bKash, Nagad, Visa/Mastercard)
- **Admin (Epsira Tech)**: Sign in with admin@skinfluencer.bd / admin123. Add or remove products, update inventory (stock), Quick Add via CSV.

## Tech

- **Next.js 14** (App Router), **TypeScript**, **Tailwind CSS**
- **Performance**: Responsive from 320px (mobile), tablet, desktop
- **Accessibility**: Skip link, focus-visible outlines, semantic HTML (WCAG 2.1 AA–oriented)
- **Security**: SSL/TLS assumed in production; PCI-DSS–compliant payment flow (integration placeholder)

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Login

- **Customer**: Sign up at `/signup` (any email + password). Sign in at `/login`.
- **Admin**: Sign in at `/login` or `/admin/login` with **admin@skinfluencer.bd** / **admin123**. Then go to `/admin` to manage inventory and products.

## Build

```bash
npm run build
npm start
```

## Routes

| Route | Description |
|-------|-------------|
| `/` | Home: hero, featured products, Skin-Insider CTA |
| `/shop` | Catalog with filters (skin type, concerns, ingredients, members-only) |
| `/product/[slug]` | Product detail, gallery, routine builder, add to cart |
| `/cart` | Session cart, BDT summary |
| `/checkout` | Delivery & payment (bKash, Nagad, card) |
| `/skin-insider` | Membership benefits |
| `/account` | Dashboard, orders, addresses, membership (tabs) |
| `/about`, `/contact`, `/faq`, `/shipping`, `/privacy`, `/terms` | Info pages |
| `/admin` | Epsira Tech: dashboard, inventory, campaigns, Quick Add |

## Database & backend

Product and user data are currently in-memory/mock. For production you would:

- Add a database (e.g. Prisma + PostgreSQL) for products, users, orders, addresses
- Implement auth (e.g. NextAuth) for guest vs regular vs Skin-Insider
- Integrate bKash/Nagad APIs and a 3D Secure card gateway (Stripe or local processor)
- Wire admin inventory/campaigns/Quick Add to the database and file storage
