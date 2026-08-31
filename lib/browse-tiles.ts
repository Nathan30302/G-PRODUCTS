import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import type { Product } from "@/lib/types";
import { coverImageForProduct } from "@/lib/product-images";

export type BrowseTileView = {
  id: string;
  label: string;
  href: string;
  imageUrl: string | null;
  isPromo: boolean;
};

const CACHE_TAG = "browse-tiles";

export const getBrowseTiles = unstable_cache(
  async (): Promise<BrowseTileView[]> => {
    try {
      const rows = await prisma.shopBrowseTile.findMany({
        where: { enabled: true },
        orderBy: { sortOrder: "asc" }
      });
      return rows.map((r) => ({
        id: r.id,
        label: r.label,
        href: r.href,
        imageUrl: r.imageUrl,
        isPromo: r.isPromo
      }));
    } catch (err) {
      console.error("[browse-tiles] fetch failed:", err);
      return [];
    }
  },
  ["shop-browse-tiles"],
  { revalidate: 60, tags: [CACHE_TAG] }
);

/** Fill missing tile backgrounds from catalogue photos (until admin uploads). */
export function enrichBrowseTilesWithFallbacks(
  tiles: BrowseTileView[],
  products: Product[]
): BrowseTileView[] {
  return tiles.map((tile) => {
    if (tile.imageUrl) return tile;
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
    const q = u.searchParams.get("q")?.toLowerCase();
    if (q) {
      const blob = [p.name, p.brand ?? "", p.categorySlug].join(" ").toLowerCase();
      if (blob.includes(q.split(" ")[0] ?? q)) return true;
    }
    const catMatch = u.pathname.match(/\/category\/([^/]+)/);
    if (catMatch && p.categorySlug === catMatch[1]) return true;
    if (u.searchParams.get("deals") === "1" && (p.hotDeal || p.compareAtPrice))
      return true;
  } catch {
    /* ignore */
  }
  const label = tile.label.toLowerCase();
  if (label.includes("charger") && p.categorySlug === "chargers") return true;
  if (label.includes("stationery") && p.categorySlug === "stationery") return true;
  if (label.includes("audio") && p.categorySlug === "audio") return true;
  if (label.includes("storage") && p.categorySlug === "storage") return true;
  return false;
}

export { CACHE_TAG as BROWSE_TILES_CACHE_TAG };
