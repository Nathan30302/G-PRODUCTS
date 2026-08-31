import { catalogGroups, hrefForCatalogGroup } from "@/lib/catalog-taxonomy";
import type { Product } from "@/lib/types";
import { coverImageForProduct } from "@/lib/product-images";

export type ExploreTile = {
  id: string;
  badge: string;
  headline: string;
  href: string;
  imageUrl: string | null;
  categorySlug?: string;
  gradient: string;
  badgeClass: string;
  glowClass: string;
};

/** G-Products yellow · green · white mixes — one theme per category tile. */
const TILE_THEMES = [
  {
    gradient: "from-brand/35 via-white to-white",
    badgeClass: "bg-brand text-ink-900 shadow-brand-glow",
    glowClass: "bg-brand/50"
  },
  {
    gradient: "from-white via-accent/15 to-brand/12",
    badgeClass: "bg-accent text-white shadow-sm",
    glowClass: "bg-accent/45"
  },
  {
    gradient: "from-brand/20 via-white to-accent/18",
    badgeClass: "bg-ink-700 text-brand",
    glowClass: "bg-brand/40"
  },
  {
    gradient: "from-accent/22 via-white to-white",
    badgeClass: "bg-gradient-to-r from-accent to-accent-soft text-ink-900",
    glowClass: "bg-accent/40"
  },
  {
    gradient: "from-white via-brand/25 to-accent/12",
    badgeClass: "bg-brand-dark text-ink-950",
    glowClass: "bg-brand/45"
  },
  {
    gradient: "from-brand/12 via-accent/10 to-white",
    badgeClass: "bg-ink-700 text-white",
    glowClass: "bg-accent/35"
  }
] as const;

/** Six G-Products shop groups for the home category grid. */
export const EXPLORE_TOP_TECH_TILES: ExploreTile[] = catalogGroups
  .filter((g) => !g.href)
  .slice(0, 6)
  .map((group, index) => {
    const theme = TILE_THEMES[index % TILE_THEMES.length];
    return {
      id: group.slug,
      badge: group.name,
      headline: group.tagline,
      href: hrefForCatalogGroup(group),
      imageUrl: null,
      categorySlug: group.children[0],
      gradient: theme.gradient,
      badgeClass: theme.badgeClass,
      glowClass: theme.glowClass
    };
  });

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
