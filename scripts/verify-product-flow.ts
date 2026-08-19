/**
 * End-to-end check: upload file → save in DB → resolve on disk → storefront cover URL.
 * Run: npx tsx scripts/verify-product-flow.ts
 */
import { readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { saveImageUpload } from "../lib/uploads";
import { resolveUploadFile, uploadRelativeFromPublicUrl } from "../lib/upload-resolve";
import { coverImageForProduct } from "../lib/product-images";
import type { Product } from "../lib/types";

const prisma = new PrismaClient();

async function main() {
  const errors: string[] = [];

  // 1) Tiny PNG upload
  const png = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
    "base64"
  );
  const tmp = path.join(process.cwd(), ".verify-upload.png");
  await writeFile(tmp, png);
  const file = new File([png], "verify.png", { type: "image/png" });
  const saved = await saveImageUpload(file, "products");
  await unlink(tmp).catch(() => {});

  console.log(`✓ uploaded → ${saved.url}`);

  const relative = uploadRelativeFromPublicUrl(saved.url);
  if (!relative) errors.push("Could not parse upload URL");
  const onDisk = relative ? resolveUploadFile(relative) : null;
  if (!onDisk) errors.push(`Upload file missing on disk for ${saved.url}`);
  else console.log(`✓ file on disk → ${onDisk}`);

  // 2) Create temp product with variant + image
  const category =
    (await prisma.category.findFirst()) ??
    (await prisma.category.create({
      data: {
        slug: "verify-cat",
        name: "Verify",
        tagline: "Test",
        icon: "grid",
        sortOrder: 99
      }
    }));

  const slug = `verify-${Date.now()}`;
  const product = await prisma.product.create({
    data: {
      slug,
      name: "Verify Photo Product",
      categoryId: category.id,
      price: 100,
      description: "Verification product",
      shortSpecs: "[]",
      stock: "in_stock",
      variants: {
        create: {
          name: "Black",
          colorHex: "#111111",
          quantity: 3,
          sortOrder: 0
        }
      }
    },
    include: { variants: true, images: true, category: true }
  });

  const variantId = product.variants[0]!.id;
  await prisma.productImage.create({
    data: {
      productId: product.id,
      variantId,
      url: saved.url,
      alt: "Verify",
      sortOrder: 0
    }
  });

  const row = await prisma.product.findUnique({
    where: { id: product.id },
    include: { images: true, variants: true, category: true }
  });

  if (!row) errors.push("Product not found after create");

  const storefront: Product = {
    id: row!.id,
    slug: row!.slug,
    name: row!.name,
    categorySlug: row!.category.slug,
    price: row!.price,
    images: row!.images.map((i) => ({
      url: i.url,
      alt: i.alt,
      variantId: i.variantId ?? undefined
    })),
    shortSpecs: [],
    description: row!.description,
    stock: row!.stock,
    featured: row!.featured,
    hotDeal: row!.hotDeal,
    variants: row!.variants.map((v) => ({
      id: v.id,
      name: v.name,
      colorHex: v.colorHex ?? undefined,
      quantity: v.quantity,
      available: v.quantity > 0
    }))
  };

  const cover = coverImageForProduct(storefront, storefront.variants[0]);
  if (cover !== saved.url) {
    errors.push(`coverImageForProduct mismatch: ${cover} !== ${saved.url}`);
  } else {
    console.log(`✓ storefront cover URL matches upload`);
  }

  // cleanup
  await prisma.product.delete({ where: { id: product.id } });
  if (relative) {
    const abs = resolveUploadFile(relative);
    if (abs) await unlink(abs).catch(() => {});
  }

  await prisma.$disconnect();

  if (errors.length) {
    console.error("\nFAILED:");
    for (const e of errors) console.error(" -", e);
    process.exit(1);
  }

  console.log("\nAll product photo flow checks passed.");
}

main().catch(async (err) => {
  console.error(err);
  await prisma.$disconnect();
  process.exit(1);
});
