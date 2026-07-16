# G-Products

A Plug-style electronics storefront for Zambia. Customers browse chargers, power
banks, phones, headphones, laptops and more, then buy online with Mobile Money
(MTN / Airtel) or order via WhatsApp. Web first; native apps planned later.

## Tech stack

- **Next.js 15** (App Router) + **React 19**
- **TypeScript**
- **Tailwind CSS** (dark, Plug-style theme)

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Project structure

```
app/                 Routes (home, category, product, cart, checkout, search)
components/           UI components (Navbar, ProductCard, Hero, etc.)
lib/                  Data + logic (products, categories, cart, formatting, whatsapp)
config/site.ts       Brand config: name, WhatsApp number, currency, delivery
```

## Configuration

Update [config/site.ts](config/site.ts) before launch:

- `whatsappNumber` - the seller's WhatsApp number (international format, no `+`)
- `deliveryArea`, `supportEmail`, trust badges

## Phase 1 status (current build)

Done:
- Dark Plug-style UI: home (hero, category tiles, hot deals, featured, trust badges)
- Category pages, product detail pages with shareable links + rich previews
- Cart + checkout with MTN / Airtel selection (UI)
- Order via WhatsApp (prefilled messages)
- Search with trending + category filters

Next (backend phase):
- Database + admin panel (owner + staff logins) to manage products, stock, orders
- Live MTN MoMo / Airtel Money payment integration
- Image uploads (Cloudinary)
- Order management (New -> Paid -> Preparing -> Delivered)

Product data currently lives in [lib/products.ts](lib/products.ts) as seed data;
this moves to the database + admin in the backend phase.
