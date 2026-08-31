import { PrismaClient } from "@prisma/client";
import {
  DEFAULT_BROWSE_TILES,
  isLegacyBrowseTile
} from "@/lib/default-browse-tiles";

/** Seed defaults when empty; remove legacy Plug-style tiles from production. */
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

    const count = await client.shopBrowseTile.count();
    if (count > 0) {
      console.log(`[browse-tiles] ${count} tile(s) already configured`);
      return count;
    }

    for (let i = 0; i < DEFAULT_BROWSE_TILES.length; i++) {
      const tile = DEFAULT_BROWSE_TILES[i];
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

    console.log(`[browse-tiles] seeded ${DEFAULT_BROWSE_TILES.length} default tiles`);
    return DEFAULT_BROWSE_TILES.length;
  } finally {
    if (ownsClient) await client.$disconnect();
  }
}
