# G-Products

A Plug-style electronics storefront for Zambia. Customers browse chargers, power
banks, phones, headphones, laptops and more, then buy online with Mobile Money
(MTN / Airtel / Zamtel) or order via WhatsApp. Web first; native apps planned
later.

## Tech stack

- **Next.js 15** (App Router) + **React 19**
- **TypeScript**
- **Tailwind CSS** (dark teal + yellow theme, from the G-Products logo)
- **Prisma + SQLite** (database)
- **jose** (JWT sessions) + **bcryptjs** (password hashing)

## Getting started

```bash
npm install                 # installs deps + generates Prisma client
cp .env.example .env        # then edit values (see below)
npm run db:push             # create the SQLite database from the schema
npm run db:seed             # load categories, catalog and the owner account
npm run dev
```

Open http://localhost:3000 — the admin panel is at http://localhost:3000/admin

## Environment (`.env`)

Copy `.env.example` to `.env`. Key values:

- `AUTH_SECRET` — long random string used to sign login sessions
- `OWNER_EMAIL` / `OWNER_NAME` / `OWNER_PASSWORD` — the owner account the seed
  script creates (change the password after first login)
- Payment credentials (leave blank to run in **manual/WhatsApp** mode):
  - MTN MoMo: `MTN_MOMO_SUBSCRIPTION_KEY`, `MTN_MOMO_API_USER`, `MTN_MOMO_API_KEY`
  - Airtel Money: `AIRTEL_CLIENT_ID`, `AIRTEL_CLIENT_SECRET`
  - Zamtel: `ZAMTEL_BASE_URL`, `ZAMTEL_API_KEY`

## Project structure

```
app/
  (public routes)      home, category, product, cart, checkout, search
  admin/               login + guarded dashboard (products, orders, staff)
  api/                 checkout, order status, payment callback
components/            UI + admin components
lib/                   db, auth, queries, payments, cart, whatsapp, format
prisma/                schema.prisma + seed.ts
config/site.ts         brand config: name, WhatsApp, mobile money, hours
```

## Admin panel (`/admin`)

- **Login** with the owner (or staff) account.
- **Dashboard** — product/order counts and paid revenue.
- **Products** — add / edit / delete, images (by URL), price, stock, featured,
  hot deal.
- **Orders** — view items and customer, update status (Pending → Paid →
  Preparing → Ready → Delivered / Cancelled), message the customer on WhatsApp.
- **Staff** (owner only) — add users with **Owner** or **Staff** roles.

Roles: **Owner** can do everything (incl. delete products, manage staff);
**Staff** can manage products and orders.

## Payments

`lib/payments.ts` implements MTN MoMo and Airtel Money collections, with Zamtel
scaffolding. Checkout (`/api/checkout`) creates an order and initiates payment:

- **Live mode** (credentials set): the customer gets a Mobile Money prompt on
  their phone; the checkout page polls `/api/orders/[ref]/status` and providers
  can also notify `/api/payments/callback/[provider]`.
- **Manual mode** (credentials blank): the order is recorded and confirmed over
  WhatsApp.

## Useful scripts

```bash
npm run db:push       # sync schema to the database
npm run db:seed       # seed categories, products, owner
npm run db:reset      # wipe + reseed (destroys local data)
npm run build         # prisma generate + next build
```

## Not yet done (future phases)

- Direct image file uploads (currently image URLs) via Cloudinary / S3
- Card payments, receipts/invoices, promo codes
- Native iOS / Android apps on the shared API
- Move from SQLite to hosted Postgres for production
