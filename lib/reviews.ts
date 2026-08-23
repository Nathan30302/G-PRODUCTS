/**
 * Review helpers — DB-backed published reviews only.
 * Static seed list stays empty; never invent testimonials.
 */

import { prisma } from "@/lib/db";

export type Review = {
  id: string;
  /** Omit for store-wide reviews shown on the homepage */
  productSlug?: string;
  author: string;
  /** 1–5 */
  rating: number;
  title?: string;
  body: string;
  /** ISO date string */
  date: string;
  verifiedPurchase?: boolean;
};

/** @deprecated Prefer getStoreReviews / getProductReviews — kept empty on purpose */
export const reviews: Review[] = [];

function mapRow(r: {
  id: string;
  productSlug: string;
  authorName: string;
  rating: number;
  title: string | null;
  body: string;
  createdAt: Date;
  verifiedPurchase: boolean;
}): Review {
  return {
    id: r.id,
    productSlug: r.productSlug,
    author: r.authorName,
    rating: r.rating,
    title: r.title ?? undefined,
    body: r.body,
    date: r.createdAt.toISOString(),
    verifiedPurchase: r.verifiedPurchase
  };
}

export async function getPublishedReviewsForProduct(
  productSlug: string
): Promise<Review[]> {
  const rows = await prisma.productReview.findMany({
    where: { productSlug, published: true },
    orderBy: { createdAt: "desc" },
    take: 40
  });
  return rows.map(mapRow);
}

export async function getPublishedStoreReviews(): Promise<Review[]> {
  const rows = await prisma.productReview.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 12
  });
  return rows.map(mapRow);
}

export async function getStoreReviews(): Promise<Review[]> {
  return getPublishedStoreReviews();
}

export async function getProductReviews(
  productSlug: string
): Promise<Review[]> {
  return getPublishedReviewsForProduct(productSlug);
}

export function averageRating(list: Review[]): number | null {
  if (list.length === 0) return null;
  const sum = list.reduce((n, r) => n + r.rating, 0);
  return Math.round((sum / list.length) * 10) / 10;
}
