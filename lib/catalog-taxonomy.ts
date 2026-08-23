import { Category } from "@/lib/types";
import { categories, getCategory } from "@/lib/categories";

/**
 * Top-level shop groups for homepage / nav.
 * Leaf category slugs (and product data) are unchanged — groups only organise them.
 */
export type CatalogGroup = {
  slug: string;
  name: string;
  tagline: string;
  icon: string;
  /** Leaf category slugs under this group */
  children: string[];
  /** Optional external href (e.g. services) instead of /category/[slug] */
  href?: string;
};

export const catalogGroups: CatalogGroup[] = [
  {
    slug: "phones-accessories",
    name: "Phones & Accessories",
    tagline: "Phones, cases, chargers, cables & protectors",
    icon: "phone",
    children: ["phones", "phone-accessories", "chargers"]
  },
  {
    slug: "computers-storage",
    name: "Computers & Storage",
    tagline: "Mice, keyboards, memory cards & drives",
    icon: "laptop",
    children: ["computers", "storage"]
  },
  {
    slug: "audio",
    name: "Audio",
    tagline: "Earbuds, headsets & speakers",
    icon: "headphones",
    children: ["audio"]
  },
  {
    slug: "smart-devices",
    name: "Smart Devices",
    tagline: "Smart watches and connected gear",
    icon: "sparkles",
    children: ["watches"]
  },
  {
    slug: "stationery-school",
    name: "Stationery & School",
    tagline: "Books, pens, paper, calculators & craft",
    icon: "sparkles",
    children: ["stationery"]
  },
  {
    slug: "home-electrical",
    name: "Home & Electrical",
    tagline: "Home extras, laptop power & extensions",
    icon: "home",
    children: ["home", "power"]
  },
  {
    slug: "locks-security",
    name: "Locks & Security",
    tagline: "Mortice locks & key holders",
    icon: "key",
    children: ["locks"]
  },
  {
    slug: "services",
    name: "Services",
    tagline: "Upload & Print, key cutting & G-Loans",
    icon: "services",
    children: [],
    href: "/services"
  }
];

export function getCatalogGroup(slug: string): CatalogGroup | undefined {
  return catalogGroups.find((g) => g.slug === slug);
}

/** Resolve a group or leaf category into a Category-shaped object for UI. */
export function resolveShopCategory(slug: string): Category | null {
  const group = getCatalogGroup(slug);
  if (group && !group.href) {
    return {
      slug: group.slug,
      name: group.name,
      tagline: group.tagline,
      icon: group.icon
    };
  }
  return getCategory(slug) ?? null;
}

export function childCategoriesForGroup(group: CatalogGroup): Category[] {
  return group.children
    .map((s) => getCategory(s))
    .filter((c): c is Category => Boolean(c));
}

/** Leaf slugs to query when viewing a group or leaf page. */
export function productCategorySlugsFor(slug: string): string[] {
  const group = getCatalogGroup(slug);
  if (group?.children.length) return group.children;
  if (getCategory(slug)) return [slug];
  return [];
}

/** Homepage / footer shop list — groups first. */
export function shopNavCategories(): Category[] {
  return catalogGroups.map((g) => ({
    slug: g.slug,
    name: g.name,
    tagline: g.tagline,
    icon: g.icon
  }));
}

export function hrefForCatalogGroup(group: CatalogGroup): string {
  return group.href ?? `/category/${group.slug}`;
}

/** Flat leaf list still used by admin / seed. */
export { categories };
