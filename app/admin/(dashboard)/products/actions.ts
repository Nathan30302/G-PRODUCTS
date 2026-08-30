"use server";

import { redirect } from "next/navigation";
import { revalidatePath, revalidateTag } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { prisma } from "@/lib/db";
import { requireUser, requireOwner } from "@/lib/auth";
import { stockFromQuantity } from "@/lib/types";

export type ProductFormState = { error?: string };

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

type VariantInput = {
  id?: string;
  name: string;
  colorHex?: string;
  price?: number | null;
  quantity: number;
  imageUrls: string[];
  /** True when the provider changed photos for this colour in the form. */
  photosDirty?: boolean;
};

function parseVariants(raw: string): VariantInput[] {
  try {
    const list = JSON.parse(raw) as VariantInput[];
    if (!Array.isArray(list)) return [];
    return list
      .map((v) => {
        const priceRaw = v.price;
        const priceNum =
          priceRaw === null || priceRaw === undefined || priceRaw === ("" as never)
            ? null
            : Math.max(0, Math.round(Number(priceRaw) || 0));
        return {
          id: v.id ? String(v.id).trim() : undefined,
          name: String(v.name ?? "").trim(),
          colorHex: String(v.colorHex ?? "").trim() || undefined,
          price: priceNum && priceNum > 0 ? priceNum : null,
          quantity: Math.max(0, Math.round(Number(v.quantity) || 0)),
          imageUrls: Array.isArray(v.imageUrls)
            ? v.imageUrls.map((u) => String(u).trim()).filter(Boolean)
            : [],
          photosDirty: Boolean(v.photosDirty)
        };
      })
      .filter((v) => v.name);
  } catch {
    return [];
  }
}

export async function saveProduct(
  _prev: ProductFormState | undefined,
  formData: FormData
): Promise<ProductFormState> {
  try {
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

    const variants = parseVariants(String(formData.get("variantsJson") ?? "[]"));
    if (variants.length === 0) {
      variants.push({ name: "Standard", quantity: 0, imageUrls: [] });
    }

    if (!name) return { error: "Product name is required." };
    if (!categorySlug) return { error: "Choose a category." };
    if (price <= 0) return { error: "Enter a price greater than 0." };

    const category = await prisma.category.findUnique({
      where: { slug: categorySlug }
    });
    if (!category) {
      return {
        error: "That category isn’t available. Refresh and try again."
      };
    }

    const totalQty = variants.reduce((n, v) => n + v.quantity, 0);
    const stockValue = stockFromQuantity(totalQty);

    const data = {
      name,
      brand,
      categoryId: category.id,
      price,
      compareAtPrice: compareAtPrice ?? null,
      description: description || name,
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

    const existingVariants = await prisma.productVariant.findMany({
      where: { productId }
    });
    const keptVariantIds: string[] = [];

    for (let idx = 0; idx < variants.length; idx++) {
      const v = variants[idx];
      // New products: any uploaded URLs should persist on first save.
      if (!id && v.imageUrls.length > 0) {
        v.photosDirty = true;
      }
      let variantId = v.id;

      if (variantId && existingVariants.some((ev) => ev.id === variantId)) {
        await prisma.productVariant.update({
          where: { id: variantId },
          data: {
            name: v.name,
            colorHex: v.colorHex ?? null,
            price: v.price ?? null,
            quantity: v.quantity,
            sortOrder: idx
          }
        });
      } else {
        const byName = existingVariants.find(
          (ev) =>
            ev.name.toLowerCase() === v.name.toLowerCase() &&
            !keptVariantIds.includes(ev.id)
        );
        if (byName) {
          variantId = byName.id;
          await prisma.productVariant.update({
            where: { id: variantId },
            data: {
              name: v.name,
              colorHex: v.colorHex ?? null,
              price: v.price ?? null,
              quantity: v.quantity,
              sortOrder: idx
            }
          });
        } else {
          const created = await prisma.productVariant.create({
            data: {
              productId,
              name: v.name,
              colorHex: v.colorHex ?? null,
              price: v.price ?? null,
              quantity: v.quantity,
              sortOrder: idx
            }
          });
          variantId = created.id;
        }
      }

      keptVariantIds.push(variantId!);

      const existingForVariant = await prisma.productImage.count({
        where: { variantId }
      });

      // Sync when photos were edited, on first save with uploads, or when
      // the form has URLs but this colour has none in the database yet.
      const shouldSyncImages =
        v.photosDirty ||
        (!id && v.imageUrls.length > 0) ||
        (v.imageUrls.length > 0 && existingForVariant === 0);

      if (shouldSyncImages) {
        await prisma.productImage.deleteMany({ where: { variantId } });
        if (v.imageUrls.length > 0) {
          await prisma.productImage.createMany({
            data: v.imageUrls.map((url, i) => ({
              productId,
              variantId,
              url,
              alt: `${name} · ${v.name}`,
              sortOrder: i
            }))
          });
        }
      }
    }

    await prisma.productVariant.deleteMany({
      where: {
        productId,
        id: { notIn: keptVariantIds }
      }
    });

    revalidatePath("/admin/products");
    revalidatePath("/");
    revalidatePath("/search");
    revalidatePath(`/category/${categorySlug}`);
    revalidateTag("catalog");

    const saved = await prisma.product.findUnique({
      where: { id: productId },
      select: { slug: true }
    });
    if (saved?.slug) {
      revalidatePath(`/product/${saved.slug}`);
    }

    redirect("/admin/products");
  } catch (err) {
    if (isRedirectError(err)) throw err;
    console.error("[products] save failed:", err);
    return {
      error:
        err instanceof Error
          ? err.message
          : "Could not save the product. Please try again."
    };
  }
}

export async function deleteProduct(formData: FormData): Promise<void> {
  await requireOwner();
  const id = String(formData.get("id") ?? "").trim();
  if (id) {
    await prisma.product.delete({ where: { id } });
  }
  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidateTag("catalog");
  redirect("/admin/products");
}
