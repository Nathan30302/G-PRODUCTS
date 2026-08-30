import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import {
  Category,
  Product,
  ProductVariant,
  overallStock,
  stockFromQuantity
} from "@/lib/types";
import type {
  Product as DbProduct,
  ProductImage as DbImage,
  ProductVariant as DbVariant,
  Category as DbCategory
} from "@prisma/client";

type DbProductWithRelations = DbProduct & {
  images: DbImage[];
  category: DbCategory;
  variants: DbVariant[];
};

const CATALOG_REVALIDATE = 60;

function toVariants(rows: DbVariant[]): ProductVariant[] {
  return rows
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((v) => ({
      id: v.id,
      name: v.name,
      colorHex: v.colorHex ?? undefined,
      price: v.price ?? undefined,
      quantity: v.quantity,
      available: v.quantity > 0
    }));
}

function toProduct(p: DbProductWithRelations): Product {
  let specs: string[] = [];
  try {
    specs = JSON.parse(p.shortSpecs);
    if (!Array.isArray(specs)) specs = [];
  } catch {
    specs = [];
  }

  const variants = toVariants(p.variants);
  const stock =
    variants.length > 0 ? overallStock(variants) : p.stock;

  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    brand: p.brand ?? undefined,
    categorySlug: p.category.slug,
    price: p.price,
    compareAtPrice: p.compareAtPrice ?? undefined,
    images: p.images
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((i) => ({
        url: i.url,
        alt: i.alt,
        variantId: i.variantId ?? undefined
      })),
    shortSpecs: specs,
    description: p.description,
    stock,
    featured: p.featured,
    hotDeal: p.hotDeal,
    variants
  };
}

function toCategory(c: DbCategory): Category {
  return { slug: c.slug, name: c.name, tagline: c.tagline, icon: c.icon };
}

const withRelations = {
  images: true,
  category: true,
  variants: true
} as const;

export const getAllCategories = unstable_cache(
  async (): Promise<Category[]> => {
    try {
      const cats = await prisma.category.findMany({
        orderBy: { sortOrder: "asc" }
      });
      return cats.map(toCategory);
    } catch (err) {
      console.error("[queries] getAllCategories failed:", err);
      return [];
    }
  },
  ["catalog-categories"],
  { revalidate: CATALOG_REVALIDATE, tags: ["catalog"] }
);

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const { resolveShopCategory } = await import("@/lib/catalog-taxonomy");
    const virtual = resolveShopCategory(slug);
    const c = await prisma.category.findUnique({ where: { slug } });
    if (c) return toCategory(c);
    return virtual;
  } catch (err) {
    console.error("[queries] getCategoryBySlug failed:", err);
    return null;
  }
}

export const getAllProducts = unstable_cache(
  async (): Promise<Product[]> => {
    try {
      const items = await prisma.product.findMany({
        include: withRelations,
        orderBy: { createdAt: "desc" }
      });
      return items.map(toProduct);
    } catch (err) {
      console.error("[queries] getAllProducts failed:", err);
      return [];
    }
  },
  ["catalog-products"],
  { revalidate: CATALOG_REVALIDATE, tags: ["catalog"] }
);

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const p = await prisma.product.findUnique({
      where: { slug },
      include: withRelations
    });
    return p ? toProduct(p) : null;
  } catch (err) {
    console.error("[queries] getProductBySlug failed:", err);
    return null;
  }
}

export async function getProductsByCategory(
  categorySlug: string
): Promise<Product[]> {
  try {
    const { productCategorySlugsFor } = await import("@/lib/catalog-taxonomy");
    const slugs = productCategorySlugsFor(categorySlug);
    if (slugs.length === 0) return [];
    const items = await prisma.product.findMany({
      where: { category: { slug: { in: slugs } } },
      include: withRelations,
      orderBy: { createdAt: "desc" }
    });
    return items.map(toProduct);
  } catch (err) {
    console.error("[queries] getProductsByCategory failed:", err);
    return [];
  }
}

/** Derived from cached catalogue — avoids extra DB round-trips on the homepage. */
export async function getFeatured(): Promise<Product[]> {
  const all = await getAllProducts();
  return all.filter((p) => p.featured);
}

/** Derived from cached catalogue — avoids extra DB round-trips on the homepage. */
export async function getHotDeals(): Promise<Product[]> {
  const all = await getAllProducts();
  return all.filter((p) => p.hotDeal);
}

export { stockFromQuantity };
