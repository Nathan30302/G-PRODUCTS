import { Category } from "@/lib/types";

/**
 * Leaf categories stored in the DB / product.categorySlug.
 * Display names refined for a clearer catalogue; slugs stay stable.
 */
export const categories: Category[] = [
  {
    slug: "stationery",
    name: "Stationery & School",
    tagline: "Books, pens, paper, calculators & office supplies",
    icon: "sparkles"
  },
  {
    slug: "storage",
    name: "Storage",
    tagline: "Memory cards, flash disks & hard drives",
    icon: "storage"
  },
  {
    slug: "computers",
    name: "Computers",
    tagline: "Mice, keyboards & drive casings",
    icon: "laptop"
  },
  {
    slug: "chargers",
    name: "Chargers & Cables",
    tagline: "Phone chargers, cables & tape",
    icon: "bolt"
  },
  {
    slug: "power",
    name: "Power & Extensions",
    tagline: "Laptop chargers & extension cables",
    icon: "battery"
  },
  {
    slug: "audio",
    name: "Audio",
    tagline: "Earbuds, headsets & speakers",
    icon: "headphones"
  },
  {
    slug: "phone-accessories",
    name: "Phone Accessories",
    tagline: "Cases, stands, protectors & pouches",
    icon: "sparkles"
  },
  {
    slug: "phones",
    name: "Phones",
    tagline: "Feature phones for everyday use",
    icon: "phone"
  },
  {
    slug: "home",
    name: "Home & Personal",
    tagline: "Kettles, clippers and household extras",
    icon: "home"
  },
  {
    slug: "watches",
    name: "Smart Watches",
    tagline: "T900, KT8, A58 Plus and more",
    icon: "sparkles"
  },
  {
    slug: "locks",
    name: "Locks & Security",
    tagline: "Mortice locks & key holders",
    icon: "key"
  }
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
