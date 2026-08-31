import type { Product } from "@/lib/types";
import { coverImageForProduct } from "@/lib/product-images";

export type ExploreTile = {
  id: string;
  /** Uppercase pill label, e.g. SHOP PHONES */
  badge: string;
  /** Marketing headline on the card */
  headline: string;
  href: string;
  imageUrl: string | null;
  categorySlug?: string;
  /** Tailwind gradient classes for card background */
  gradient: string;
};

/** Static 6-tile grid for home — mapped to real catalogue categories. */
export const EXPLORE_TOP_TECH_TILES: ExploreTile[] = [
  {
    id: "phones",
    badge: "Shop Phones",
    headline: "Find your next phone",
    href: "/category/phones",
    imageUrl: null,
    categorySlug: "phones",
    gradient: "from-[#e8f5e9] via-white to-[#f1f8e9]"
  },
  {
    id: "tablets",
    badge: "Shop iPads",
    headline: "Discover your next tablet",
    href: "/search?q=tablet",
    imageUrl: null,
    categorySlug: "computers",
    gradient: "from-[#e3f2fd] via-white to-[#f5f5f5]"
  },
  {
    id: "android",
    badge: "Shop Android",
    headline: "Power meets value",
    href: "/search?q=android",
    imageUrl: null,
    categorySlug: "phones",
    gradient: "from-[#e8eaf6] via-white to-[#f3e5f5]"
  },
  {
    id: "macbooks",
    badge: "Shop MacBooks",
    headline: "Laptops built for work",
    href: "/category/computers",
    imageUrl: null,
    categorySlug: "computers",
    gradient: "from-[#fff8e1] via-white to-[#e8f5e9]"
  },
  {
    id: "watches",
    badge: "Shop Smartwatches",
    headline: "Tech for your wrist",
    href: "/category/watches",
    imageUrl: null,
    categorySlug: "watches",
    gradient: "from-[#fce4ec] via-white to-[#f3e5f5]"
  },
  {
    id: "audio",
    badge: "Shop Audio",
    headline: "Find your sound",
    href: "/category/audio",
    imageUrl: null,
    categorySlug: "audio",
    gradient: "from-[#e0f7fa] via-white to-[#e8f5e9]"
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
