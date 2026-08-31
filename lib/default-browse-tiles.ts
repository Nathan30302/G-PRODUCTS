import type { Product } from "@/lib/types";
import { coverImageForProduct } from "@/lib/product-images";

export type BrowseTileView = {
  id: string;
  label: string;
  href: string;
  imageUrl: string | null;
  isPromo: boolean;
};

/** Shown on Shop when admin tiles are missing — matches seed defaults. */
export const DEFAULT_BROWSE_TILES: BrowseTileView[] = [
  {
    id: "default-promo-school",
    label: "Back to School 🔥",
    href: "/search?q=book",
    imageUrl: null,
    isPromo: true
  },
  {
    id: "default-chargers",
    label: "Chargers & Cables",
    href: "/category/chargers",
    imageUrl: null,
    isPromo: false
  },
  {
    id: "default-phone-accessories",
    label: "Phone Accessories",
    href: "/category/phone-accessories",
    imageUrl: null,
    isPromo: false
  },
  {
    id: "default-stationery",
    label: "Stationery & School",
    href: "/category/stationery",
    imageUrl: null,
    isPromo: false
  },
  {
    id: "default-storage",
    label: "Storage",
    href: "/category/storage",
    imageUrl: null,
    isPromo: false
  },
  {
    id: "default-audio",
    label: "Audio",
    href: "/category/audio",
    imageUrl: null,
    isPromo: false
  },
  {
    id: "default-phones",
    label: "Phones",
    href: "/category/phones",
    imageUrl: null,
    isPromo: false
  },
  {
    id: "default-watches",
    label: "Smart Watches",
    href: "/category/watches",
    imageUrl: null,
    isPromo: false
  }
];

export function coverForCategory(
  slug: string,
  products: Product[]
): string | null {
  for (const p of products) {
    if (p.categorySlug !== slug || p.stock === "sold_out") continue;
    const url = coverImageForProduct(
      p,
      p.variants.find((v) => v.available) ?? p.variants[0] ?? null
    );
    if (url) return url;
  }
  return null;
}

/** Fill missing tile backgrounds from catalogue photos (until admin uploads). */
export function enrichBrowseTilesWithFallbacks(
  tiles: BrowseTileView[],
  products: Product[]
): BrowseTileView[] {
  return tiles.map((tile) => {
    if (tile.imageUrl) return tile;

    const catMatch = tile.href.match(/\/category\/([^/?#]+)/);
    if (catMatch) {
      const url = coverForCategory(catMatch[1], products);
      if (url) return { ...tile, imageUrl: url };
    }

    const hit = products.find((p) => tileMatchesProduct(tile, p));
    if (!hit) return tile;
    const url = coverImageForProduct(
      hit,
      hit.variants.find((v) => v.available) ?? hit.variants[0] ?? null
    );
    return url ? { ...tile, imageUrl: url } : tile;
  });
}

function tileMatchesProduct(tile: BrowseTileView, p: Product): boolean {
  if (p.stock === "sold_out") return false;
  try {
    const path = tile.href.startsWith("http")
      ? new URL(tile.href).pathname + new URL(tile.href).search
      : tile.href;
    const u = new URL(path, "https://g-products.store");
    const q = u.searchParams.get("q")?.toLowerCase();
    if (q) {
      const blob = [p.name, p.brand ?? "", p.categorySlug].join(" ").toLowerCase();
      const term = q.split(" ")[0] ?? q;
      if (blob.includes(term)) return true;
    }
    const catMatch = u.pathname.match(/\/category\/([^/]+)/);
    if (catMatch && p.categorySlug === catMatch[1]) return true;
    if (u.searchParams.get("deals") === "1" && (p.hotDeal || p.compareAtPrice))
      return true;
  } catch {
    /* ignore */
  }
  const label = tile.label.toLowerCase();
  if (label.includes("charger") && p.categorySlug === "chargers") return true;
  if (label.includes("phone") && p.categorySlug === "phone-accessories") return true;
  if (label.includes("stationery") && p.categorySlug === "stationery") return true;
  if (label.includes("school") && p.categorySlug === "stationery") return true;
  if (label.includes("storage") && p.categorySlug === "storage") return true;
  if (label.includes("audio") && p.categorySlug === "audio") return true;
  if (label.includes("watch") && p.categorySlug === "watches") return true;
  return false;
}
