/**
 * Apply extension-cable consolidation + catalog upsert after schema change.
 * Removes old extension-*-way-* SKUs once the unified product exists.
 */
import { copyFileSync, existsSync } from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { categories } from "../lib/categories";
import { products } from "../lib/products";
import { isUploadUrl } from "../lib/uploads";
import { DEFAULT_SETTINGS } from "../lib/services";

const prisma = new PrismaClient();
const CATALOG = path.join(process.cwd(), "public", "products", "catalog");

const OLD_EXTENSION_SLUGS = [
  "extension-3-way-3m",
  "extension-3-way-5m",
  "extension-4-way-3m",
  "extension-4-way-5m",
  "extension-5-way-3m",
  "extension-5-way-5m",
  "extension-6-way-3m",
  "extension-6-way-5m"
];

async function main() {
  const flyerSrc = path.join(CATALOG, "extension-6-way-5m-flyer.jpg");
  const flyerDest = path.join(CATALOG, "extension-cable-flyer.jpg");
  if (existsSync(flyerSrc) && !existsSync(flyerDest)) {
    copyFileSync(flyerSrc, flyerDest);
    console.log("Copied extension-cable-flyer.jpg");
  }

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

  for (const p of products) {
    const categoryId = categoryIdBySlug.get(p.categorySlug);
    if (!categoryId) continue;
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
    const row = await prisma.product.findUnique({ where: { slug: p.slug } });
    if (!row) continue;
    if (!existing) {
      await prisma.productImage.createMany({
        data: p.images.map((img, idx) => ({
          productId: row.id,
          url: img.url,
          alt: img.alt,
          sortOrder: idx
        }))
      });
      await prisma.productVariant.create({
        data: {
          productId: row.id,
          name: "Standard",
          quantity: 12,
          sortOrder: 0
        }
      });
    } else if (existing.variants.length === 0) {
      await prisma.productVariant.create({
        data: {
          productId: row.id,
          name: "Standard",
          quantity: 12,
          sortOrder: 0
        }
      });
    } else if (
      !existing.images.length &&
      !existing.images.some((img) => isUploadUrl(img.url))
    ) {
      await prisma.productImage.createMany({
        data: p.images.map((img, idx) => ({
          productId: row.id,
          url: img.url,
          alt: img.alt,
          sortOrder: idx
        }))
      });
    }
  }

  for (const slug of OLD_EXTENSION_SLUGS) {
    const deleted = await prisma.product.deleteMany({ where: { slug } });
    if (deleted.count) console.log(`Removed old SKU ${slug}`);
  }

  await prisma.serviceOffer.updateMany({
    where: { slug: "printing" },
    data: {
      imageUrl: "/services/printing-menu.jpg",
      priceLabel: "From K 1",
      settings: JSON.stringify(DEFAULT_SETTINGS)
    }
  });

  console.log("Catalog upserted. Run sync-catalog-photos next.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
