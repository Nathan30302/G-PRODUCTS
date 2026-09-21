import { fromPrice, type Product } from "@/lib/types";
import { discountPercent } from "@/lib/format";

const ALIASES: [RegExp, string][] = [
  [/\bf9[\s-]*5\b/g, "tws f9"],
  [/\bf95\b/g, "tws f9"],
  [/\bkalas\b/g, "calus"],
  [/\bara[\s-]*800\b/g, "r800"],
  [/\bfedex\b/g, "fieldex"],
  [/\bfedlock\b/g, "fieldex"],
  [/\bmortis\b/g, "mortice"],
  [/\bair ?pods?\b/g, "airpods"],
  [/\bconch\b/g, "oraimo"],
  [/\bmomofly\b/g, "momofly"],
  [/\bkgtel\b/g, "kgtel"],
  [/\ba58\b/g, "a58 plus"],
  [/\bextention\b/g, "extension"]
];

export function normalizeQuery(raw: string): string {
  let q = raw.trim().toLowerCase();
  q = q.replace(/[^a-z0-9\s.-]+/g, " ");
  for (const [re, to] of ALIASES) q = q.replace(re, to);
  return q.replace(/\s+/g, " ").trim();
}

export function productMatchesQuery(product: Product, raw: string): boolean {
  const q = normalizeQuery(raw);
  if (!q) return true;
  const hay = normalizeQuery(
    [
      product.name,
      product.brand ?? "",
      product.slug.replace(/-/g, " "),
      product.categorySlug.replace(/-/g, " "),
      ...(product.shortSpecs ?? []),
      product.description ?? "",
      ...product.variants.map((v) => v.name)
    ].join(" ")
  );
  return q.split(" ").every((token) => hay.includes(token));
}

export type StockFilter = "all" | "in_stock" | "sold_out";
export type SortMode = "match" | "price-asc" | "price-desc" | "newest" | "deals";

export const sortModeLabels: Record<SortMode, string> = {
  match: "Best match",
  "price-asc": "Lowest price",
  "price-desc": "Highest price",
  newest: "Newest",
  deals: "Biggest deals"
};

/** Higher means the product should appear first for this query. */
function matchScore(product: Product, raw: string): number {
  const q = normalizeQuery(raw);
  const name = normalizeQuery(product.name);
  const brand = normalizeQuery(product.brand ?? "");
  let score = 0;
  if (q) {
    if (name.startsWith(q)) score += 120;
    else if (name.includes(q)) score += 70;
    if (brand && (brand.startsWith(q) || brand.includes(q))) score += 40;
    for (const token of q.split(" ")) {
      if (name.startsWith(token)) score += 12;
    }
  }
  if (product.featured) score += 8;
  if (product.hotDeal) score += 6;
  if (product.stock === "sold_out") score -= 80;
  else if (product.stock === "low_stock") score -= 4;
  return score;
}

function dealScore(product: Product): number {
  return discountPercent(fromPrice(product), product.compareAtPrice) ?? (product.hotDeal ? 1 : 0);
}

export function sortProducts(
  products: Product[],
  sort: SortMode,
  query = ""
): Product[] {
  const list = [...products];
  const byName = (a: Product, b: Product) => a.name.localeCompare(b.name);

  if (sort === "price-asc") {
    list.sort((a, b) => fromPrice(a) - fromPrice(b) || byName(a, b));
  } else if (sort === "price-desc") {
    list.sort((a, b) => fromPrice(b) - fromPrice(a) || byName(a, b));
  } else if (sort === "newest") {
    list.sort(
      (a, b) =>
        (b.createdAt ?? "").localeCompare(a.createdAt ?? "") || byName(a, b)
    );
  } else if (sort === "deals") {
    list.sort(
      (a, b) => dealScore(b) - dealScore(a) || fromPrice(a) - fromPrice(b) || byName(a, b)
    );
  } else {
    list.sort((a, b) => matchScore(b, query) - matchScore(a, query) || byName(a, b));
  }
  return list;
}

export function filterCatalog(
  products: Product[],
  opts: {
    query: string;
    category: string;
    stock: StockFilter;
    sort: SortMode;
  }
): Product[] {
  const list = products.filter((p) => {
    const cat = opts.category === "all" || p.categorySlug === opts.category;
    const q = productMatchesQuery(p, opts.query);
    const stock =
      opts.stock === "all" ||
      (opts.stock === "sold_out"
        ? p.stock === "sold_out"
        : p.stock !== "sold_out");
    return cat && q && stock;
  });

  return sortProducts(list, opts.sort, opts.query);
}
