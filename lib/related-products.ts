import { Product } from "@/lib/types";

const FAMILIES: string[][] = [
  ["airpods", "tws", "pods", "earbuds", "oraimo-air", "sivia-s13", "mango-pods", "tronix", "vortex"],
  ["speaker", "calus", "r800", "ubl", "harman"],
  ["mortice", "lock", "key-holder", "union", "fieldex"],
  ["extension", "charger", "oraimo", "type-c", "sivia-cable", "laptop"],
  ["t900", "kt8", "ultra", "watch"],
  ["pouch", "stand", "protector", "screen"],
  ["hard-drive", "hdd", "flash", "memory", "ssd"],
  ["mouse", "keyboard"],
  ["casio", "sharp", "calculator", "pen", "bic", "book", "paper"]
];

function hay(p: Product): string {
  return `${p.slug} ${p.name} ${p.brand ?? ""}`.toLowerCase();
}

function familyIndex(p: Product): number {
  const t = hay(p);
  return FAMILIES.findIndex((keys) => keys.some((k) => t.includes(k)));
}

function tokens(p: Product): string[] {
  return hay(p)
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 2);
}

export function relatedProducts(current: Product, pool: Product[], limit = 8): Product[] {
  const fam = familyIndex(current);
  const curTokens = new Set(tokens(current));

  return pool
    .filter((p) => p.id !== current.id)
    .map((p) => {
      let score = 0;
      if (p.categorySlug === current.categorySlug) score += 3;
      const pf = familyIndex(p);
      if (fam >= 0 && pf === fam) score += 10;
      for (const t of tokens(p)) {
        if (curTokens.has(t)) score += 1;
      }
      if (p.hotDeal) score += 0.2;
      return { p, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.p);
}
