import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import {
  DEFAULT_BROWSE_TILES,
  enrichBrowseTilesWithFallbacks,
  type BrowseTileView
} from "@/lib/default-browse-tiles";
import type { Product } from "@/lib/types";

export type { BrowseTileView } from "@/lib/default-browse-tiles";
export {
  DEFAULT_BROWSE_TILES,
  enrichBrowseTilesWithFallbacks
} from "@/lib/default-browse-tiles";

const CACHE_TAG = "browse-tiles";

const getBrowseTilesFromDb = unstable_cache(
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
  ["shop-browse-tiles-v2"],
  { revalidate: 60, tags: [CACHE_TAG] }
);

/** Admin-managed tiles, or built-in defaults when DB is empty. */
export async function getBrowseTiles(): Promise<BrowseTileView[]> {
  const rows = await getBrowseTilesFromDb();
  return rows.length > 0 ? rows : DEFAULT_BROWSE_TILES;
}

/** Tiles for the Shop browse screen — always returns at least the default stack. */
export async function resolveShopBrowseTiles(
  products: Product[]
): Promise<BrowseTileView[]> {
  const tiles = await getBrowseTiles();
  return enrichBrowseTilesWithFallbacks(tiles, products);
}

export { CACHE_TAG as BROWSE_TILES_CACHE_TAG };
