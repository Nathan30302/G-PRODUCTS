"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireUser, requireOwner } from "@/lib/auth";
import { stockFromQuantity } from "@/lib/types";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

async function uniqueSlug(base: string, ignoreId?: string): Promise<string> {
  let slug = base || "product";
  let n = 1;
  while (true) {
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (!existing || existing.id === ignoreId) return slug;
    n += 1;
    slug = `${base}-${n}`;
  }
}

function toInt(value: FormDataEntryValue | null): number | null {
  if (value === null) return null;
  const s = String(value).replace(/[^0-9]/g, "");
  if (!s) return null;
  return parseInt(s, 10);
}

type VariantInput = { name: string; colorHex?: string; quantity: number };

function parseVariants(raw: string): VariantInput[] {
  try {
    const list = JSON.parse(raw) as VariantInput[];
    if (!Array.isArray(list)) return [];
    return list
      .map((v) => ({
        name: String(v.name ?? "").trim(),
        colorHex: String(v.colorHex ?? "").trim() || undefined,
        quantity: Math.max(0, Math.round(Number(v.quantity) || 0))
      }))
      .filter((v) => v.name);
  } catch {
    return [];
  }
}

export async function saveProduct(formData: FormData): Promise<void> {
  await requireUser();

  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const categorySlug = String(formData.get("categorySlug") ?? "").trim();
  const brand = String(formData.get("brand") ?? "").trim() || null;
  const description = String(formData.get("description") ?? "").trim();
  const price = toInt(formData.get("price")) ?? 0;
  const compareAtPrice = toInt(formData.get("compareAtPrice"));
  const featured = formData.get("featured") === "on";
  const hotDeal = formData.get("hotDeal") === "on";

  const specs = String(formData.get("shortSpecs") ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const imageUrls = String(formData.get("imageUrls") ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const variants = parseVariants(String(formData.get("variantsJson") ?? "[]"));
  if (variants.length === 0) {
    variants.push({ name: "Standard", quantity: 0 });
  }

  if (!name || !categorySlug) {
    throw new Error("Name and category are required.");
  }

  const category = await prisma.category.findUnique({
    where: { slug: categorySlug }
  });
  if (!category) throw new Error("Unknown category.");

  const totalQty = variants.reduce((n, v) => n + v.quantity, 0);
  const stockValue = stockFromQuantity(totalQty);

  const data = {
    name,
    brand,
    categoryId: category.id,
    price,
    compareAtPrice: compareAtPrice ?? null,
    description,
    shortSpecs: JSON.stringify(specs),
    stock: stockValue,
    featured,
    hotDeal
  };

  let productId = id;

  if (id) {
    await prisma.product.update({ where: { id }, data });
  } else {
    const slug = await uniqueSlug(slugify(name));
    const created = await prisma.product.create({
      data: { ...data, slug }
    });
    productId = created.id;
  }

  if (imageUrls.length > 0) {
    await prisma.productImage.deleteMany({ where: { productId } });
    await prisma.productImage.createMany({
      data: imageUrls.map((url, idx) => ({
        productId,
        url,
        alt: name,
        sortOrder: idx
      }))
    });
  }

  // Replace variants
  await prisma.productVariant.deleteMany({ where: { productId } });
  await prisma.productVariant.createMany({
    data: variants.map((v, idx) => ({
      productId,
      name: v.name,
      colorHex: v.colorHex ?? null,
      quantity: v.quantity,
      sortOrder: idx
    }))
  });

  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath(`/product`);
  redirect("/admin/products");
}

export async function deleteProduct(formData: FormData): Promise<void> {
  await requireOwner();
  const id = String(formData.get("id") ?? "").trim();
  if (id) {
    await prisma.product.delete({ where: { id } });
  }
  revalidatePath("/admin/products");
  revalidatePath("/");
  redirect("/admin/products");
}
