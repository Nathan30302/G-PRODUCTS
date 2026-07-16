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
};
