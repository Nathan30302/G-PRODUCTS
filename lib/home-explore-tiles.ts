import { catalogGroups, hrefForCatalogGroup } from "@/lib/catalog-taxonomy";
import type { Product } from "@/lib/types";
import { coverImageForProduct } from "@/lib/product-images";

export type ExploreTile = {
  id: string;
  /** Category name shown on the pill badge */
  badge: string;
  /** Short supporting line on the card */
  headline: string;
  href: string;
  imageUrl: string | null;
  categorySlug?: string;
  /** Tailwind gradient classes for card background */
  gradient: string;
};

const GP_GRADIENTS = [
  "from-ink-700/[0.06] via-white to-brand/[0.08]",
  "from-accent/[0.08] via-white to-ink-700/[0.04]",
  "from-brand/[0.1] via-white to-accent/[0.06]",
  "from-ink-700/[0.05] via-white to-brand/[0.12]",
  "from-accent/[0.06] via-white to-brand/[0.08]",
  "from-brand/[0.08] via-white to-ink-700/[0.05]"
];

/** Six G-Products shop groups for the home category grid. */
export const EXPLORE_TOP_TECH_TILES: ExploreTile[] = catalogGroups
  .filter((g) => !g.href)
  .slice(0, 6)
  .map((group, index) => ({
    id: group.slug,
    badge: group.name,
    headline: group.tagline,
    href: hrefForCatalogGroup(group),
    imageUrl: null,
    categorySlug: group.children[0],
    gradient: GP_GRADIENTS[index % GP_GRADIENTS.length]
  }));

export function enrichExploreTiles(
  tiles: ExploreTile[],
  products: Product[]
): ExploreTile[] {
  return tiles.map((tile) => {
    if (tile.imageUrl) return tile;

    const slugs = tile.categorySlug ? [tile.categorySlug] : [];
    const byCategory = slugs.length
      ? products.find(
          (p) =>
            slugs.includes(p.categorySlug) &&
            p.stock !== "sold_out" &&
            coverImageForProduct(
              p,
              p.variants.find((v) => v.available) ?? p.variants[0] ?? null
            )
        )
      : null;

    if (byCategory) {
      const url = coverImageForProduct(
        byCategory,
        byCategory.variants.find((v) => v.available) ??
          byCategory.variants[0] ??
          null
      );
      if (url) return { ...tile, imageUrl: url };
    }

    return tile;
  });
}
