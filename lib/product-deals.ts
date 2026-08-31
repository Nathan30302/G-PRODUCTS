import type { Product } from "@/lib/types";
import { hasPricedOptions } from "@/lib/types";

/** True when the product has a visible deal (compare-at or hot-deal flag). */
export function isProductDeal(p: Product): boolean {
  if (p.hotDeal) return true;
  if (hasPricedOptions(p)) return false;
  return Boolean(p.compareAtPrice && p.compareAtPrice > p.price);
}

export function productDiscountPercent(p: Product): number | null {
  if (hasPricedOptions(p)) return null;
  if (p.compareAtPrice && p.compareAtPrice > p.price) {
    return Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100);
  }
  if (p.hotDeal) return 20;
  return null;
}

/** Badge copy for deal products — e.g. "Extra 25% off". */
export function productDealBadgeLabel(p: Product): string | null {
  const percent = productDiscountPercent(p);
  if (percent == null) return null;
  return `Extra ${percent}% off`;
}

export function dealSortScore(p: Product): number {
  return (
    (p.hotDeal ? 4 : 0) +
    (p.compareAtPrice && p.compareAtPrice > p.price ? 2 : 0) +
    (p.featured ? 1 : 0)
  );
}

export function sortByDealScore(list: Product[]): Product[] {
  return [...list].sort(
    (a, b) =>
      dealSortScore(b) - dealSortScore(a) || a.name.localeCompare(b.name)
  );
}
