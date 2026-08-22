export type Category = {
  slug: string;
  name: string;
  tagline: string;
  icon: string;
};

export type ProductImage = {
  url: string;
  alt: string;
  variantId?: string | null;
};

export type StockStatus = "in_stock" | "low_stock" | "sold_out";

export type ProductVariant = {
  id: string;
  name: string;
  colorHex?: string;
  /** Per-option price in ZMW. When missing, use the product price. */
  price?: number;
  quantity: number;
  available: boolean;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  brand?: string;
  categorySlug: string;
  price: number; // ZMW
  compareAtPrice?: number; // original price for showing a deal
  images: ProductImage[];
  shortSpecs: string[];
  description: string;
  stock: StockStatus;
  featured?: boolean;
  hotDeal?: boolean;
  variants: ProductVariant[];
};

/** Unit price for a chosen variant (falls back to product price). */
export function unitPrice(
  product: Pick<Product, "price">,
  variant?: Pick<ProductVariant, "price"> | null
): number {
  return variant?.price ?? product.price;
}

/** Lowest sellable price — for cards when options have different prices. */
export function fromPrice(product: Product): number {
  const priced = product.variants
    .map((v) => v.price)
    .filter((p): p is number => typeof p === "number" && p > 0);
  if (priced.length === 0) return product.price;
  return Math.min(product.price, ...priced);
}

export function hasPricedOptions(product: Product): boolean {
  return product.variants.some(
    (v) => typeof v.price === "number" && v.price > 0
  );
}

export function stockFromQuantity(qty: number): StockStatus {
  if (qty <= 0) return "sold_out";
  if (qty <= 3) return "low_stock";
  return "in_stock";
}

export function overallStock(variants: ProductVariant[]): StockStatus {
  if (variants.length === 0) return "sold_out";
  const total = variants.reduce((n, v) => n + v.quantity, 0);
  return stockFromQuantity(total);
}
