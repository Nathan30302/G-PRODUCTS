import type { Product } from "@/lib/types";
import { coverImageForProduct } from "@/lib/product-images";

export type CategoryTile = {
  label: string;
  href: string;
  /** Match product name/brand or category slug */
  match: (p: Product) => boolean;
};

/** Homepage category tiles — aligned with siteConfig.heroCategories. */
export const categoryTiles: CategoryTile[] = [
  {
    label: "Chargers",
    href: "/search?q=charger",
    match: (p) =>
      p.categorySlug === "chargers" ||
      /charger|adapter|power/i.test(p.name)
  },
  {
    label: "Phone cases",
    href: "/search?q=case",
    match: (p) =>
      p.categorySlug === "phone-accessories" ||
      /case|pouch|cover/i.test(p.name)
  },
  {
    label: "Stationery",
    href: "/search?q=book",
    match: (p) => p.categorySlug === "stationery"
  },
  {
    label: "Storage",
    href: "/search?q=memory",
    match: (p) =>
      p.categorySlug === "storage" ||
      /memory|flash|usb|drive/i.test(p.name)
  },
  {
    label: "Audio",
    href: "/search?q=earphone",
    match: (p) => p.categorySlug === "audio"
  }
];

export function resolveCategoryTileCovers(products: Product[]) {
  return categoryTiles.map((tile) => {
    const hit = products.find((p) => tile.match(p) && p.stock !== "sold_out");
    const image = hit
      ? coverImageForProduct(
          hit,
          hit.variants.find((v) => v.available) ?? hit.variants[0] ?? null
        )
      : null;
    return { ...tile, image };
  });
}
