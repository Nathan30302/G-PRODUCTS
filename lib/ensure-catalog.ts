/**
 * Boot-time catalog repair. Used by scripts/start-prod.ts when the product
 * table is empty (or nearly empty) so the storefront is never blank after deploy.
 */
import { PrismaClient } from "@prisma/client";

const MIN_PRODUCTS = 10;

export async function catalogNeedsSeed(
  prisma: PrismaClient
): Promise<{ needs: boolean; products: number; categories: number }> {
  const [products, categories] = await Promise.all([
    prisma.product.count(),
    prisma.category.count()
  ]);
  return {
    needs: products < MIN_PRODUCTS || categories === 0,
    products,
    categories
  };
}

export { MIN_PRODUCTS };
