/**
 * Boot-time catalog repair. Used by scripts/start-prod.ts when the product
 * table is empty so the storefront is never blank after deploy.
 *
 * Only reseeds when there are zero products (or zero categories). A small
 * hand-curated catalog must not be wiped on every Railway restart — set
 * FORCE_SEED=1 to reload the official list intentionally.
 */
import { PrismaClient } from "@prisma/client";

/** Health endpoint treats fewer than this as "catalog looks empty". */
const MIN_PRODUCTS = 1;

export async function catalogNeedsSeed(
  prisma: PrismaClient
): Promise<{ needs: boolean; products: number; categories: number }> {
  const [products, categories] = await Promise.all([
    prisma.product.count(),
    prisma.category.count()
  ]);
  return {
    needs: products === 0 || categories === 0,
    products,
    categories
  };
}

export { MIN_PRODUCTS };
