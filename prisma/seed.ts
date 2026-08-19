import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { categories } from "../lib/categories";
import { products } from "../lib/products";
import { services, DEFAULT_SETTINGS } from "../lib/services";

const prisma = new PrismaClient();

async function main() {
  // --- Owner account ---
  const ownerEmail = process.env.OWNER_EMAIL ?? "gift@gproducts.zm";
  const ownerName = process.env.OWNER_NAME ?? "Gift Mbumwae";
  const ownerPassword = process.env.OWNER_PASSWORD ?? "changeme123";

  const passwordHash = await bcrypt.hash(ownerPassword, 10);
  await prisma.user.upsert({
    where: { email: ownerEmail },
    update: { name: ownerName, role: "OWNER" },
    create: {
      email: ownerEmail,
      name: ownerName,
      passwordHash,
      role: "OWNER"
    }
  });
  console.log(`Owner account ready: ${ownerEmail}`);

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

  // --- Products (never delete provider-added items or their photos) ---
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

    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
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
      },
      create: {
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

    const row = await prisma.product.findUnique({
      where: { slug: p.slug }
    });
    if (!row) continue;

    // Only seed images/variants when the product is new or still empty
    if (!existing || existing.images.length === 0) {
      await prisma.productImage.deleteMany({ where: { productId: row.id } });
      await prisma.productImage.createMany({
        data: p.images.map((img, idx) => ({
          productId: row.id,
          url: img.url,
          alt: img.alt,
          sortOrder: idx
        }))
      });
    }

    if (!existing || existing.variants.length === 0) {
      const qty =
        p.stock === "sold_out" ? 0 : p.stock === "low_stock" ? 3 : 12;
      await prisma.productVariant.deleteMany({ where: { productId: row.id } });
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
  }
  console.log(`Seeded ${products.length} catalog products (photos preserved)`);

  // Do not delete products the provider added outside the seed catalog

  // --- Service offerings (admin-editable) ---
  for (let i = 0; i < services.length; i++) {
    const s = services[i];
    await prisma.serviceOffer.upsert({
      where: { slug: s.slug },
      update: {
        name: s.name,
        tagline: s.tagline,
        description: s.description,
        icon: s.icon,
        imageUrl: s.image,
        priceLabel: s.priceLabel ?? null,
        payable: s.payable,
        enabled: true,
        sortOrder: i,
        serviceType: s.type,
        settings: JSON.stringify(DEFAULT_SETTINGS)
      },
      create: {
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
  console.log(`Seeded ${services.length} service offerings`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
