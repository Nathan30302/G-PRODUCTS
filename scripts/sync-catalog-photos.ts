/**
 * Apply unique HD catalog photos (3 angles, colour variants) to the database.
 * Replaces Unsplash / leftover catalog placeholders. Never wipes /api/media uploads.
 * Only attaches image URLs for files that exist on disk.
 *
 * Usage: npx tsx scripts/sync-catalog-photos.ts
 *        npx tsx scripts/sync-catalog-photos.ts --force
 */
import { existsSync } from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { products } from "../lib/products";
import {
  catalogDefForSlug,
  catalogUrl,
  galleryFilesForSlug
} from "../lib/catalog-photos";
import { isUploadUrl } from "../lib/uploads";

const prisma = new PrismaClient();
const force = process.argv.includes("--force");
const refreshCopy = process.argv.includes("--refresh-copy");
const onlyArg = process.argv.find((a) => a.startsWith("--only="));
const onlySlugs = onlyArg
  ? onlyArg
      .slice("--only=".length)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  : null;
const CATALOG_DIR = path.join(process.cwd(), "public", "products", "catalog");

function existingCatalogFiles(files: string[]): string[] {
  return files.filter((file) => existsSync(path.join(CATALOG_DIR, file)));
}

type KeptUpload = { url: string; alt: string; variantName: string | null };

async function syncProduct(slug: string): Promise<boolean> {
  const row = await prisma.product.findUnique({
    where: { slug },
    include: { images: true, variants: true }
  });
  if (!row) return false;

  if (refreshCopy) {
    const def = products.find((p) => p.slug === slug);
    if (def) {
      await prisma.product.update({
        where: { id: row.id },
        data: {
          name: def.name,
          brand: def.brand ?? null,
          description: def.description,
          shortSpecs: JSON.stringify(def.shortSpecs),
          featured: def.featured ?? false,
          hotDeal: def.hotDeal ?? false
        }
      });
      console.log(`  ↻ copy ${slug}`);
    }
    // Copy-only mode must not wipe photos the provider already set.
    if (!force) return true;
  }

  const uploadImages = row.images.filter((i) => isUploadUrl(i.url));
  const onlyUploads =
    uploadImages.length > 0 && row.images.every((i) => isUploadUrl(i.url));

  if (onlyUploads) {
    console.log(`  skip ${slug} (provider uploads only)`);
    return false;
  }

  if (uploadImages.length > 0 && !force) {
    console.log(`  skip ${slug} (has provider uploads; use --force to mix catalog)`);
    return false;
  }

  // Never silently restore old catalog files over a product that already has photos.
  if (!force && row.images.length > 0) {
    console.log(`  skip ${slug} (already has photos — set --force to replace)`);
    return false;
  }

  const variantNameById = new Map(row.variants.map((v) => [v.id, v.name]));
  const kept: KeptUpload[] = uploadImages.map((i) => ({
    url: i.url,
    alt: i.alt,
    variantName: i.variantId ? variantNameById.get(i.variantId) ?? null : null
  }));

  const def = catalogDefForSlug(slug);

  if (def?.variants && def.variants.length > 0) {
    await prisma.productImage.deleteMany({
      where: {
        productId: row.id,
        NOT: { url: { startsWith: "/api/media/" } }
      }
    });
    await prisma.productVariant.deleteMany({ where: { productId: row.id } });

    let photoCount = 0;
    const createdByName = new Map<string, string>();

    for (let i = 0; i < def.variants.length; i++) {
      const v = def.variants[i];
      const files = existingCatalogFiles(v.files);
      const variant = await prisma.productVariant.create({
        data: {
          productId: row.id,
          name: v.name,
          colorHex: v.colorHex ?? null,
          price: v.price ?? null,
          quantity: v.quantity ?? 8,
          sortOrder: i
        }
      });
      createdByName.set(v.name.toLowerCase(), variant.id);
      if (files.length === 0) continue;
      await prisma.productImage.createMany({
        data: files.map((file, idx) => ({
          productId: row.id,
          variantId: variant.id,
          url: catalogUrl(file),
          alt: `${row.name} — ${v.name}`,
          sortOrder: idx
        }))
      });
      photoCount += files.length;
    }

    const extras = existingCatalogFiles(
      (def.files ?? []).filter(
        (file) => !def.variants?.some((v) => v.files.includes(file))
      )
    );
    if (extras.length > 0) {
      await prisma.productImage.createMany({
        data: extras.map((file, idx) => ({
          productId: row.id,
          url: catalogUrl(file),
          alt: `${row.name} — details`,
          sortOrder: 40 + idx
        }))
      });
      photoCount += extras.length;
    }

    const leftoverUploads = await prisma.productImage.findMany({
      where: { productId: row.id, url: { startsWith: "/api/media/" } }
    });
    for (const img of leftoverUploads) {
      const name = kept.find((k) => k.url === img.url)?.variantName;
      const variantId = name ? createdByName.get(name.toLowerCase()) ?? null : null;
      await prisma.productImage.update({
        where: { id: img.id },
        data: { variantId, sortOrder: 50 }
      });
    }

    const totalQty = def.variants.reduce((n, v) => n + (v.quantity ?? 8), 0);
    await prisma.product.update({
      where: { id: row.id },
      data: {
        stock:
          totalQty === 0
            ? "sold_out"
            : totalQty <= 5
              ? "low_stock"
              : "in_stock"
      }
    });

    console.log(
      `  ✓ ${slug} (${def.variants.length} colours, ${photoCount} catalog photos${kept.length ? `, kept ${kept.length} uploads` : ""})`
    );
    return true;
  }

  const files = existingCatalogFiles(def?.files ?? galleryFilesForSlug(slug));

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
        quantity:
          row.stock === "sold_out" ? 0 : row.stock === "low_stock" ? 3 : 12,
        sortOrder: 0
      }
    });
  }

  if (files.length > 0) {
    await prisma.productImage.createMany({
      data: files.map((file, idx) => ({
        productId: row.id,
        url: catalogUrl(file),
        alt: row.name,
        sortOrder: idx
      }))
    });
  }

  console.log(
    `  ✓ ${slug} (${files.length} photos${kept.length ? `, kept ${kept.length} uploads` : ""})`
  );
  return true;
}

async function main() {
  console.log(
    `Syncing unique catalog photos${force ? " (force)" : ""}${
      refreshCopy ? " + refresh copy" : ""
    }${onlySlugs ? ` · only ${onlySlugs.join(", ")}` : ""}…`
  );
  let updated = 0;

  const list = onlySlugs
    ? products.filter((p) => onlySlugs.includes(p.slug))
    : products;

  for (const p of list) {
    if (await syncProduct(p.slug)) updated++;
  }

  console.log(`Updated ${updated} product(s).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
