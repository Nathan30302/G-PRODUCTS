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
  buildCatalogBrowseTiles,
  enrichBrowseTilesWithFallbacks
} from "@/lib/default-browse-tiles";

const CACHE_TAG = "browse-tiles";

const getBrowseTileOverrides = unstable_cache(
  async (): Promise<Map<string, string | null>> => {
    try {
      const rows = await prisma.shopBrowseTile.findMany({
        where: { enabled: true, imageUrl: { not: null } }
      });
      return new Map(rows.map((r) => [r.href, r.imageUrl]));
    } catch (err) {
      console.error("[browse-tiles] override fetch failed:", err);
      return new Map();
    }
  },
  ["shop-browse-tile-overrides-v1"],
  { revalidate: 60, tags: [CACHE_TAG] }
);

function mergeCatalogWithOverrides(
  overrides: Map<string, string | null>
): BrowseTileView[] {
  return DEFAULT_BROWSE_TILES.map((tile) => {
    const custom = overrides.get(tile.href);
    return custom ? { ...tile, imageUrl: custom } : tile;
  });
}

/** Tiles for the Shop tab — full catalogue with admin photo overrides. */
export async function resolveShopBrowseTiles(
  products: Product[]
): Promise<BrowseTileView[]> {
  const overrides = await getBrowseTileOverrides();
  const tiles = mergeCatalogWithOverrides(overrides);
  return enrichBrowseTilesWithFallbacks(tiles, products);
}

export { CACHE_TAG as BROWSE_TILES_CACHE_TAG };
