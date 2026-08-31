import type { Product } from "@/lib/types";
import { coverImageForProduct } from "@/lib/product-images";

export type ExploreTile = {
  id: string;
  label: string;
  href: string;
  imageUrl: string | null;
  categorySlug?: string;
};

/** Static 6-tile grid for home — mapped to real catalogue categories. */
export const EXPLORE_TOP_TECH_TILES: ExploreTile[] = [
  {
    id: "phones",
    label: "Shop Phones",
    href: "/category/phones",
    imageUrl: null,
    categorySlug: "phones"
  },
  {
    id: "tablets",
    label: "Shop iPads",
    href: "/search?q=tablet",
    imageUrl: null,
    categorySlug: "computers"
  },
  {
    id: "android",
    label: "Shop Android",
    href: "/search?q=android",
    imageUrl: null,
    categorySlug: "phones"
  },
  {
    id: "macbooks",
    label: "Shop MacBooks",
    href: "/category/computers",
    imageUrl: null,
    categorySlug: "computers"
  },
  {
    id: "watches",
    label: "Shop Smartwatches",
    href: "/category/watches",
    imageUrl: null,
    categorySlug: "watches"
  },
  {
    id: "audio",
    label: "Shop Audio",
    href: "/category/audio",
    imageUrl: null,
    categorySlug: "audio"
  }
];

export function enrichExploreTiles(
  tiles: ExploreTile[],
  products: Product[]
): ExploreTile[] {
  return tiles.map((tile) => {
    if (tile.imageUrl) return tile;

    const byCategory = tile.categorySlug
      ? products.find(
          (p) =>
            p.categorySlug === tile.categorySlug &&
            p.stock !== "sold_out" &&
            coverImageForProduct(
              p,
              p.variants.find((v) => v.available) ?? p.variants[0] ?? null
            )
        )
      : null;

    if (byCategory) {
      const url = coverImageForProduct(
        byCategory,
        byCategory.variants.find((v) => v.available) ??
          byCategory.variants[0] ??
          null
      );
      if (url) return { ...tile, imageUrl: url };
    }

    const q = tile.href.includes("q=")
      ? decodeURIComponent(tile.href.split("q=")[1]?.split("&")[0] ?? "")
      : "";
    if (q) {
      const hit = products.find(
        (p) =>
          p.stock !== "sold_out" &&
          [p.name, p.brand ?? ""].join(" ").toLowerCase().includes(q.toLowerCase())
      );
      if (hit) {
        const url = coverImageForProduct(
          hit,
          hit.variants.find((v) => v.available) ?? hit.variants[0] ?? null
        );
        if (url) return { ...tile, imageUrl: url };
      }
    }

    return tile;
  });
}
