import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import {
  DEFAULT_BROWSE_TILES,
  enrichBrowseTilesWithFallbacks,
  isLegacyBrowseTile,
  type BrowseTileView
} from "@/lib/default-browse-tiles";
import type { Product } from "@/lib/types";

export type { BrowseTileView } from "@/lib/default-browse-tiles";
export {
  DEFAULT_BROWSE_TILES,
  enrichBrowseTilesWithFallbacks,
  isLegacyBrowseTile
} from "@/lib/default-browse-tiles";

const CACHE_TAG = "browse-tiles";

const getBrowseTilesFromDb = unstable_cache(
  async (): Promise<BrowseTileView[]> => {
    try {
      const rows = await prisma.shopBrowseTile.findMany({
        where: { enabled: true },
        orderBy: { sortOrder: "asc" }
      });
      return rows
        .map((r) => ({
          id: r.id,
          label: r.label,
          href: r.href,
          imageUrl: r.imageUrl,
          isPromo: r.isPromo
        }))
        .filter((tile) => !isLegacyBrowseTile(tile.label));
    } catch (err) {
      console.error("[browse-tiles] fetch failed:", err);
      return [];
    }
  },
  ["shop-browse-tiles-v3"],
  { revalidate: 60, tags: [CACHE_TAG] }
);

/** Admin-managed tiles, or built-in G-Products defaults when DB is empty. */
export async function getBrowseTiles(): Promise<BrowseTileView[]> {
  const rows = await getBrowseTilesFromDb();
  return rows.length > 0 ? rows : DEFAULT_BROWSE_TILES;
}

/** Tiles for the Shop browse screen — G-Products categories with catalog photos. */
export async function resolveShopBrowseTiles(
  products: Product[]
): Promise<BrowseTileView[]> {
  const tiles = await getBrowseTiles();
  const enriched = enrichBrowseTilesWithFallbacks(tiles, products);
  return enriched.length > 0 ? enriched : enrichBrowseTilesWithFallbacks(DEFAULT_BROWSE_TILES, products);
}

export { CACHE_TAG as BROWSE_TILES_CACHE_TAG };
