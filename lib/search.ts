import { Product } from "@/lib/types";

const ALIASES: [RegExp, string][] = [
  [/\bf9[\s-]*5\b/g, "tws f9"],
  [/\bf95\b/g, "tws f9"],
  [/\bkalas\b/g, "calus"],
  [/\bara[\s-]*800\b/g, "r800"],
  [/\bfedex\b/g, "fieldex"],
  [/\bfedlock\b/g, "fieldex"],
  [/\bmortis\b/g, "mortice"],
  [/\bair ?pods?\b/g, "airpods"],
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
export type SortMode = "match" | "price-asc" | "price-desc";

export function filterCatalog(
  products: Product[],
  opts: {
    query: string;
    category: string;
    stock: StockFilter;
    sort: SortMode;
  }
): Product[] {
  let list = products.filter((p) => {
    const cat = opts.category === "all" || p.categorySlug === opts.category;
    const q = productMatchesQuery(p, opts.query);
    const stock =
      opts.stock === "all" ||
      (opts.stock === "sold_out"
        ? p.stock === "sold_out"
        : p.stock !== "sold_out");
    return cat && q && stock;
  });

  if (opts.sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
  if (opts.sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
  return list;
}
