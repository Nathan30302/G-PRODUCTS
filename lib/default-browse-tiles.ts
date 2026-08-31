import { categories } from "@/lib/categories";
import type { Product } from "@/lib/types";
import { coverImageForProduct } from "@/lib/product-images";

export type BrowseTileView = {
  id: string;
  label: string;
  href: string;
  imageUrl: string | null;
  isPromo: boolean;
};

/** Full shop stack — hot deals + every G-Products leaf category. */
export function buildCatalogBrowseTiles(): BrowseTileView[] {
  return [
    {
      id: "promo-deals",
      label: "Hot Deals",
      href: "/search?deals=1",
      imageUrl: null,
      isPromo: true
    },
    ...categories.map((cat) => ({
      id: `cat-${cat.slug}`,
      label: cat.name,
      href: `/category/${cat.slug}`,
      imageUrl: null,
      isPromo: false
    }))
  ];
}

export const DEFAULT_BROWSE_TILES: BrowseTileView[] = buildCatalogBrowseTiles();

const LEGACY_TILE_LABEL =
  /back to school|shop ipads|shop macbooks|android phones|^iphones$/i;

export function isLegacyBrowseTile(label: string): boolean {
  return LEGACY_TILE_LABEL.test(label.trim());
}

function productCoverScore(p: Product): number {
  return (
    (p.featured ? 8 : 0) +
    (p.hotDeal ? 4 : 0) +
    (p.compareAtPrice && p.compareAtPrice > p.price ? 2 : 0) +
    (p.images.length > 0 ? 2 : 0)
  );
}

export function coverForCategory(
  slug: string,
  products: Product[]
): string | null {
  const candidates = products
    .filter((p) => p.categorySlug === slug && p.stock !== "sold_out")
    .sort((a, b) => productCoverScore(b) - productCoverScore(a));

  for (const p of candidates) {
    const url = coverImageForProduct(
      p,
      p.variants.find((v) => v.available) ?? p.variants[0] ?? null
    );
    if (url) return url;
  }
  return null;
}

export function coverForDeals(products: Product[]): string | null {
  const candidates = products
    .filter(
      (p) =>
        p.stock !== "sold_out" &&
        (p.hotDeal || (p.compareAtPrice && p.compareAtPrice > p.price))
    )
    .sort((a, b) => productCoverScore(b) - productCoverScore(a));

  for (const p of candidates) {
    const url = coverImageForProduct(
      p,
      p.variants.find((v) => v.available) ?? p.variants[0] ?? null
    );
    if (url) return url;
  }
  return null;
}

/** Fill tile backgrounds from the best catalogue product photo per category. */
export function enrichBrowseTilesWithFallbacks(
  tiles: BrowseTileView[],
  products: Product[]
): BrowseTileView[] {
  return tiles.map((tile) => {
    if (tile.imageUrl) return tile;

    if (tile.href.includes("deals=1")) {
      const dealUrl = coverForDeals(products);
      if (dealUrl) return { ...tile, imageUrl: dealUrl };
    }

    const catMatch = tile.href.match(/\/category\/([^/?#]+)/);
    if (catMatch) {
      const url = coverForCategory(catMatch[1], products);
      if (url) return { ...tile, imageUrl: url };
    }

    const hit = products.find((p) => tileMatchesProduct(tile, p));
    if (!hit) return tile;
    const url = coverImageForProduct(
      hit,
      hit.variants.find((v) => v.available) ?? hit.variants[0] ?? null
    );
    return url ? { ...tile, imageUrl: url } : tile;
  });
}

function tileMatchesProduct(tile: BrowseTileView, p: Product): boolean {
  if (p.stock === "sold_out") return false;
  try {
    const path = tile.href.startsWith("http")
      ? new URL(tile.href).pathname + new URL(tile.href).search
      : tile.href;
    const u = new URL(path, "https://g-products.store");
    const catMatch = u.pathname.match(/\/category\/([^/]+)/);
    if (catMatch && p.categorySlug === catMatch[1]) return true;
    if (u.searchParams.get("deals") === "1" && (p.hotDeal || p.compareAtPrice))
      return true;
  } catch {
    /* ignore */
  }
  return false;
}
