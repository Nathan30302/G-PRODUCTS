import type { Product } from "@/lib/types";

export type BundleItemRef = {
  slug: string;
  qty: number;
  note?: string;
};

export type BundleDef = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  /** Marketing compare total (sum of typical singles) */
  compareHint?: number;
  /** Highlight badge */
  badge?: string;
  items: BundleItemRef[];
};

/**
 * Curated multi-item packs. Prices are computed live from catalogue products.
 */
export const bundles: BundleDef[] = [
  {
    slug: "student-starter-pack",
    name: "Student Starter Pack",
    tagline: "Books, pens & paper for the semester",
    description:
      "A practical starter set for UNZA and campus life — exercise books, pens, pencil and a ream of A4 for assignments.",
    badge: "Campus favourite",
    items: [
      { slug: "exercise-book-192", qty: 2, note: "192-page books" },
      { slug: "bic-crystal-pen", qty: 1, note: "Pack / colour as available" },
      { slug: "pencil", qty: 2 },
      { slug: "ream-paper", qty: 1 }
    ]
  },
  {
    slug: "phone-essentials-bundle",
    name: "Phone Essentials Bundle",
    tagline: "Protect, power & listen",
    description:
      "Pair your phone with a silicone case, full-glue screen protector, charger set and earphones — ready for everyday use.",
    badge: "Best with a new phone",
    items: [
      { slug: "phone-pouch", qty: 1, note: "Choose model & colour at checkout note / WhatsApp" },
      { slug: "screen-protector-full-glue", qty: 1 },
      { slug: "iphone-type-c-full-charger", qty: 1 },
      { slug: "oraimo-original-headset", qty: 1 }
    ]
  },
  {
    slug: "laptop-essentials-bundle",
    name: "Laptop Essentials Bundle",
    tagline: "Mouse, storage & power",
    description:
      "Core laptop companions — wireless mouse, flash storage and a reliable charger path for study and work.",
    items: [
      { slug: "wireless-mouse", qty: 1 },
      { slug: "flash-disk-32gb", qty: 1, note: "32GB flash disk" },
      { slug: "oraimo-normal-full-charger", qty: 1 }
    ]
  },
  {
    slug: "assignment-printing-bundle",
    name: "Assignment / Printing Bundle",
    tagline: "Paper + print-ready setup",
    description:
      "Stock up on A4 paper and get ready to upload & print. Pair with Upload & Print for black & white or colour jobs.",
    badge: "Print ready",
    items: [
      { slug: "ream-paper", qty: 1 },
      { slug: "bic-crystal-pen", qty: 1 },
      { slug: "exercise-book-192", qty: 1 }
    ]
  }
];

export function getBundle(slug: string): BundleDef | undefined {
  return bundles.find((b) => b.slug === slug);
}

export function bundleLineTotal(
  bundle: BundleDef,
  productsBySlug: Map<string, Product>
): { total: number; missing: string[]; lines: { product: Product; qty: number }[] } {
  const lines: { product: Product; qty: number }[] = [];
  const missing: string[] = [];
  for (const item of bundle.items) {
    const product = productsBySlug.get(item.slug);
    if (!product) {
      missing.push(item.slug);
      continue;
    }
    lines.push({ product, qty: item.qty });
  }
  const total = lines.reduce((sum, l) => sum + l.product.price * l.qty, 0);
  return { total, missing, lines };
}
