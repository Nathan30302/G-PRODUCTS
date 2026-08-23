/**
 * Seed-friendly reviews foundation.
 * Only genuine reviews should live here — leave empty until real feedback exists.
 * Product pages and the homepage render a clean empty state when none match.
 */

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

/** Populate with real customer reviews only. Do not invent testimonials. */
export const reviews: Review[] = [];

export function getStoreReviews(): Review[] {
  return reviews.filter((r) => !r.productSlug);
}

export function getProductReviews(productSlug: string): Review[] {
  return reviews.filter((r) => r.productSlug === productSlug);
}

export function averageRating(list: Review[]): number | null {
  if (list.length === 0) return null;
  const sum = list.reduce((n, r) => n + r.rating, 0);
  return Math.round((sum / list.length) * 10) / 10;
}
