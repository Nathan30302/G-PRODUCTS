/**
 * Upsert categories + catalog products (no user/owner changes).
 * Then ready for scripts/sync-catalog-photos.ts
 */
import { PrismaClient } from "@prisma/client";
import { categories } from "../lib/categories";
import { products } from "../lib/products";
import { isUploadUrl } from "../lib/uploads";
import { DEFAULT_SETTINGS } from "../lib/services";

const prisma = new PrismaClient();

async function main() {
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
  console.log(`Categories: ${categories.length}`);

  for (const p of products) {
    const categoryId = categoryIdBySlug.get(p.categorySlug);
    if (!categoryId) {
      console.warn(`skip ${p.slug}: unknown category ${p.categorySlug}`);
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
    const row = await prisma.product.findUnique({ where: { slug: p.slug } });
    if (!row) continue;
    const hasPhotos = (existing?.images.length ?? 0) > 0;
    const hasUploads = existing?.images.some((img) => isUploadUrl(img.url));
    if (!existing) {
      await prisma.productImage.createMany({
        data: p.images.map((img, idx) => ({
          productId: row.id,
          url: img.url,
          alt: img.alt,
          sortOrder: idx
        }))
      });
    } else if (!hasPhotos && !hasUploads) {
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
  console.log(`Products upserted: ${products.length}`);

  await prisma.serviceOffer.updateMany({
    where: { slug: "printing" },
    data: {
      imageUrl: "/services/printing-menu.jpg",
      priceLabel: "From K 1",
      settings: JSON.stringify(DEFAULT_SETTINGS)
    }
  });
  console.log("Printing menu prices updated");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
