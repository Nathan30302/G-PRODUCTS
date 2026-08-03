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

function toVariants(rows: DbVariant[]): ProductVariant[] {
  return rows
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((v) => ({
      id: v.id,
      name: v.name,
      colorHex: v.colorHex ?? undefined,
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
      .map((i) => ({ url: i.url, alt: i.alt })),
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

export async function getAllCategories(): Promise<Category[]> {
  const cats = await prisma.category.findMany({ orderBy: { sortOrder: "asc" } });
  return cats.map(toCategory);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const c = await prisma.category.findUnique({ where: { slug } });
  return c ? toCategory(c) : null;
}

export async function getAllProducts(): Promise<Product[]> {
  const items = await prisma.product.findMany({
    include: withRelations,
    orderBy: { createdAt: "desc" }
  });
  return items.map(toProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const p = await prisma.product.findUnique({
    where: { slug },
    include: withRelations
  });
  return p ? toProduct(p) : null;
}

export async function getProductsByCategory(
  categorySlug: string
): Promise<Product[]> {
  const items = await prisma.product.findMany({
    where: { category: { slug: categorySlug } },
    include: withRelations,
    orderBy: { createdAt: "desc" }
  });
  return items.map(toProduct);
}

export async function getFeatured(): Promise<Product[]> {
  const items = await prisma.product.findMany({
    where: { featured: true },
    include: withRelations,
    orderBy: { createdAt: "desc" }
  });
  return items.map(toProduct);
}

export async function getHotDeals(): Promise<Product[]> {
  const items = await prisma.product.findMany({
    where: { hotDeal: true },
    include: withRelations,
    orderBy: { createdAt: "desc" }
  });
  return items.map(toProduct);
}

export async function getNewest(limit = 8): Promise<Product[]> {
  const items = await prisma.product.findMany({
    include: withRelations,
    orderBy: { createdAt: "desc" },
    take: limit
  });
  return items.map(toProduct);
}

export { stockFromQuantity };
