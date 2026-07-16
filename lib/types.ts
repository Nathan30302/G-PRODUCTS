export type Category = {
  slug: string;
  name: string;
  tagline: string;
  icon: string;
};

export type ProductImage = {
  url: string;
  alt: string;
};

export type StockStatus = "in_stock" | "low_stock" | "sold_out";

export type ProductVariant = {
  id: string;
  name: string;
  colorHex?: string;
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
