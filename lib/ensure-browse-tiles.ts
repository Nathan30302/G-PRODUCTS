import { PrismaClient } from "@prisma/client";
import {
  DEFAULT_BROWSE_TILES,
  isLegacyBrowseTile
} from "@/lib/default-browse-tiles";

/** Sync shop tiles with the full G-Products catalogue; remove legacy entries. */
export async function ensureBrowseTiles(prisma?: PrismaClient) {
  const client = prisma ?? new PrismaClient();
  const ownsClient = !prisma;

  try {
    const existing = await client.shopBrowseTile.findMany({
      orderBy: { sortOrder: "asc" }
    });

    const legacy = existing.filter((t) => isLegacyBrowseTile(t.label));
    if (legacy.length > 0) {
      await client.shopBrowseTile.deleteMany({
        where: { id: { in: legacy.map((t) => t.id) } }
      });
      console.log(`[browse-tiles] removed ${legacy.length} legacy tile(s)`);
    }

    const byHref = new Map(
      (await client.shopBrowseTile.findMany()).map((t) => [t.href, t])
    );

    for (let i = 0; i < DEFAULT_BROWSE_TILES.length; i++) {
      const tile = DEFAULT_BROWSE_TILES[i];
      const row = byHref.get(tile.href);
      if (row) {
        await client.shopBrowseTile.update({
          where: { id: row.id },
          data: {
            label: tile.label,
            isPromo: tile.isPromo,
            sortOrder: i * 10,
            enabled: true
          }
        });
      } else {
        await client.shopBrowseTile.create({
          data: {
            label: tile.label,
            href: tile.href,
            imageUrl: tile.imageUrl,
            isPromo: tile.isPromo,
            sortOrder: i * 10,
            enabled: true
          }
        });
      }
    }

    const validHrefs = new Set(DEFAULT_BROWSE_TILES.map((t) => t.href));
    const stale = (await client.shopBrowseTile.findMany()).filter(
      (t) => !validHrefs.has(t.href)
    );
    if (stale.length > 0) {
      await client.shopBrowseTile.deleteMany({
        where: { id: { in: stale.map((t) => t.id) } }
      });
      console.log(`[browse-tiles] removed ${stale.length} stale tile(s)`);
    }

    const count = await client.shopBrowseTile.count();
    console.log(`[browse-tiles] synced ${count} tile(s)`);
    return count;
  } finally {
    if (ownsClient) await client.$disconnect();
  }
}
