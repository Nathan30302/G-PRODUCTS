import type { Product } from "@/lib/types";

export function productStockCount(product: Product): number {
  if (product.variants.length === 0) {
    return product.stock === "sold_out" ? 0 : 1;
  }
  return product.variants.reduce((sum, v) => sum + Math.max(0, v.quantity), 0);
}

/** Reference-style stock row — e.g. In stock (12) */
export function productStockLabel(product: Product): string {
  const count = productStockCount(product);
  if (product.stock === "sold_out" || count <= 0) return "Sold out (0)";
  if (product.stock === "low_stock") return `Low stock (${count})`;
  return `In stock (${count})`;
}
