import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { categories } from "../lib/categories";
import { products } from "../lib/products";
import { services, DEFAULT_SETTINGS } from "../lib/services";
import { isUploadUrl } from "../lib/uploads";

const prisma = new PrismaClient();

async function main() {
  // --- Owner account (create only — never reset an existing password) ---
  const ownerEmail = process.env.OWNER_EMAIL ?? "gift@gproducts.zm";
  const ownerName = process.env.OWNER_NAME ?? "Gift Mbumwae";
  const ownerPassword = process.env.OWNER_PASSWORD ?? "changeme123";

  const existingOwner = await prisma.user.findUnique({
    where: { email: ownerEmail }
  });
  if (!existingOwner) {
    const passwordHash = await bcrypt.hash(ownerPassword, 10);
    await prisma.user.create({
      data: {
        email: ownerEmail,
        name: ownerName,
        passwordHash,
        role: "OWNER"
      }
    });
    console.log(`Owner account created: ${ownerEmail}`);
  } else {
    await prisma.user.update({
      where: { email: ownerEmail },
      data: { name: ownerName, role: "OWNER" }
    });
    console.log(
      `Owner account ready: ${ownerEmail} (password unchanged)`
    );
  }

  // --- Categories ---
  const categoryIdBySlug = new Map<string, string>();
  for (let i = 0; i < categories.length; i++) {
    const c = categories[i];
    const cat = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, tagline: c.tagline, icon: c.icon, sortOrder: i },
      create: {
        slug: c.slug,
        name: c.name,
        tagline: c.tagline,
        icon: c.icon,
        sortOrder: i
      }
    });
    categoryIdBySlug.set(c.slug, cat.id);
  }
  console.log(`Seeded ${categories.length} categories`);

  // --- Products: create missing only. Never overwrite live prices, copy, or photos. ---
  let created = 0;
  let skipped = 0;
  for (const p of products) {
    const categoryId = categoryIdBySlug.get(p.categorySlug);
    if (!categoryId) {
      console.warn(`Skipping ${p.slug}: unknown category ${p.categorySlug}`);
      continue;
    }

    const existing = await prisma.product.findUnique({
      where: { slug: p.slug },
      include: { images: true, variants: true }
    });

    if (existing) {
      skipped += 1;
      // Fill images only if the live product has none (never wipe uploads).
      const hasPhotos = existing.images.length > 0;
      const hasUploads = existing.images.some((img) => isUploadUrl(img.url));
      if (!hasPhotos && !hasUploads) {
        await prisma.productImage.createMany({
          data: p.images.map((img, idx) => ({
            productId: existing.id,
            url: img.url,
            alt: img.alt,
            sortOrder: idx
          }))
        });
      }
      if (existing.variants.length === 0) {
        const qty =
          p.stock === "sold_out" ? 0 : p.stock === "low_stock" ? 3 : 12;
        await prisma.productVariant.create({
          data: {
            productId: existing.id,
            name: "Standard",
            colorHex: null,
            quantity: qty,
            sortOrder: 0
          }
        });
      }
      continue;
    }

    const row = await prisma.product.create({
      data: {
        slug: p.slug,
        name: p.name,
        brand: p.brand,
        categoryId,
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        description: p.description,
        shortSpecs: JSON.stringify(p.shortSpecs),
        stock: p.stock,
        featured: p.featured ?? false,
        hotDeal: p.hotDeal ?? false
      }
    });
    created += 1;

    await prisma.productImage.createMany({
      data: p.images.map((img, idx) => ({
        productId: row.id,
        url: img.url,
        alt: img.alt,
        sortOrder: idx
      }))
    });

    const qty =
      p.stock === "sold_out" ? 0 : p.stock === "low_stock" ? 3 : 12;
    await prisma.productVariant.create({
      data: {
        productId: row.id,
        name: "Standard",
        colorHex: null,
        quantity: qty,
        sortOrder: 0
      }
    });
  }
  console.log(
    `Catalog seed: ${created} created, ${skipped} left untouched (photos & prices preserved)`
  );

  // Do not delete products the provider added outside the seed catalog

  // --- Service offerings: create missing; never overwrite Gift's live edits ---
  for (let i = 0; i < services.length; i++) {
    const s = services[i];
    const existing = await prisma.serviceOffer.findUnique({
      where: { slug: s.slug }
    });
    if (existing) {
      await prisma.serviceOffer.update({
        where: { slug: s.slug },
        data: { sortOrder: i, enabled: true }
      });
      continue;
    }
    await prisma.serviceOffer.create({
      data: {
        slug: s.slug,
        serviceType: s.type,
        name: s.name,
        tagline: s.tagline,
        description: s.description,
        icon: s.icon,
        imageUrl: s.image,
        priceLabel: s.priceLabel ?? null,
        payable: s.payable,
        enabled: true,
        sortOrder: i,
        settings: JSON.stringify(DEFAULT_SETTINGS)
      }
    });
  }
  console.log(`Seeded ${services.length} service offerings (live edits preserved)`);

  // --- Browse tiles: seed defaults only when table is empty ---
  const existingTiles = await prisma.shopBrowseTile.count();
  if (existingTiles === 0) {
    const defaults = [
      {
        label: "Back to School 🔥",
        href: "/search?q=book",
        isPromo: true,
        sortOrder: 0
      },
      {
        label: "Chargers & Cables",
        href: "/category/chargers",
        isPromo: false,
        sortOrder: 10
      },
      {
        label: "Phone Accessories",
        href: "/category/phone-accessories",
        isPromo: false,
        sortOrder: 20
      },
      {
        label: "Stationery & School",
        href: "/category/stationery",
        isPromo: false,
        sortOrder: 30
      },
      {
        label: "Storage",
        href: "/category/storage",
        isPromo: false,
        sortOrder: 40
      },
      {
        label: "Audio",
        href: "/category/audio",
        isPromo: false,
        sortOrder: 50
      },
      {
        label: "Phones",
        href: "/category/phones",
        isPromo: false,
        sortOrder: 60
      },
      {
        label: "Smart Watches",
        href: "/category/watches",
        isPromo: false,
        sortOrder: 70
      }
    ];
    for (const tile of defaults) {
      await prisma.shopBrowseTile.create({ data: tile });
    }
    console.log(`Seeded ${defaults.length} browse tiles`);
  } else {
    console.log(`Browse tiles unchanged (${existingTiles} existing)`);
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
