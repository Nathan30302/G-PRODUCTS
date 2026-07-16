import { prisma } from "@/lib/db";
import { Category, Product } from "@/lib/types";
import type {
  Product as DbProduct,
  ProductImage as DbImage,
  Category as DbCategory
} from "@prisma/client";

type DbProductWithRelations = DbProduct & {
  images: DbImage[];
  category: DbCategory;
};

function toProduct(p: DbProductWithRelations): Product {
  let specs: string[] = [];
  try {
    specs = JSON.parse(p.shortSpecs);
    if (!Array.isArray(specs)) specs = [];
  } catch {
    specs = [];
  }
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
    stock: p.stock,
    featured: p.featured,
    hotDeal: p.hotDeal
  };
}

function toCategory(c: DbCategory): Category {
  return { slug: c.slug, name: c.name, tagline: c.tagline, icon: c.icon };
}

const withRelations = { images: true, category: true } as const;

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
