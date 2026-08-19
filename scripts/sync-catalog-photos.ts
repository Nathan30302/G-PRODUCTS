/**
 * Apply HD catalog photos to the database (variants + per-colour images).
 * Skips products that only have provider uploads. Replaces Unsplash / old placeholders.
 *
 * Usage: npx tsx scripts/sync-catalog-photos.ts
 *        npx tsx scripts/sync-catalog-photos.ts --force   # replace all non-upload images
 */
import { PrismaClient } from "@prisma/client";
import { products } from "../lib/products";
import {
  catalogDefForSlug,
  catalogUrl,
  expectedCatalogFile
} from "../lib/catalog-photos";
import { isUploadUrl } from "../lib/uploads";

const prisma = new PrismaClient();
const force = process.argv.includes("--force");

function isPlaceholder(url: string): boolean {
  if (isUploadUrl(url)) return false;
  if (url.startsWith("/products/catalog/")) return false;
  return (
    url.includes("unsplash.com") ||
    url.startsWith("/products/") ||
    force
  );
}

async function syncProduct(slug: string): Promise<boolean> {
  const row = await prisma.product.findUnique({
    where: { slug },
    include: { images: true, variants: true }
  });
  if (!row) return false;

  const hasUploads = row.images.some((i) => isUploadUrl(i.url));
  if (hasUploads && !force) {
    console.log(`  skip ${slug} (provider uploads)`);
    return false;
  }

  const def = catalogDefForSlug(slug);
  const defaultFile = def?.file ?? expectedCatalogFile(slug);
  const defaultUrl = catalogUrl(defaultFile);

  if (def?.variants && def.variants.length > 0) {
    await prisma.productVariant.deleteMany({ where: { productId: row.id } });
    await prisma.productImage.deleteMany({ where: { productId: row.id } });

    for (let i = 0; i < def.variants.length; i++) {
      const v = def.variants[i];
      const variant = await prisma.productVariant.create({
        data: {
          productId: row.id,
          name: v.name,
          colorHex: v.colorHex,
          quantity: v.quantity ?? 8,
          sortOrder: i
        }
      });
      await prisma.productImage.create({
        data: {
          productId: row.id,
          variantId: variant.id,
          url: catalogUrl(v.file),
          alt: `${row.name} — ${v.name}`,
          sortOrder: 0
        }
      });
    }

    const totalQty = def.variants.reduce((n, v) => n + (v.quantity ?? 8), 0);
    await prisma.product.update({
      where: { id: row.id },
      data: {
        stock: totalQty === 0 ? "sold_out" : totalQty <= 5 ? "low_stock" : "in_stock"
      }
    });

    console.log(`  ✓ ${slug} (${def.variants.length} colours)`);
    return true;
  }

  const shouldReplace =
    force ||
    row.images.length === 0 ||
    row.images.every((i) => isPlaceholder(i.url));

  if (!shouldReplace) {
    console.log(`  skip ${slug} (custom photos)`);
    return false;
  }

  await prisma.productImage.deleteMany({
    where: {
      productId: row.id,
      NOT: { url: { startsWith: "/api/media/" } }
    }
  });

  if (row.variants.length === 0) {
    await prisma.productVariant.create({
      data: {
        productId: row.id,
        name: "Standard",
        colorHex: null,
        quantity: row.stock === "sold_out" ? 0 : row.stock === "low_stock" ? 3 : 12,
        sortOrder: 0
      }
    });
  }

  await prisma.productImage.create({
    data: {
      productId: row.id,
      url: defaultUrl,
      alt: row.name,
      sortOrder: 0
    }
  });

  console.log(`  ✓ ${slug}`);
  return true;
}

async function main() {
  console.log(`Syncing catalog photos${force ? " (force)" : ""}…`);
  let updated = 0;

  for (const p of products) {
    if (await syncProduct(p.slug)) updated++;
  }

  // Also sync any DB products not in seed catalog
  const extra = await prisma.product.findMany({
    where: { slug: { notIn: products.map((x) => x.slug) } },
    select: { slug: true }
  });
  for (const { slug } of extra) {
    if (await syncProduct(slug)) updated++;
  }

  console.log(`Updated ${updated} product(s).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
