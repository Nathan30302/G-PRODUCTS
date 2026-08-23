import { Product } from "@/lib/types";

/**
 * Cross-sell families: phone gear ↔ chargers/cases/protectors;
 * laptop accessories ↔ mice/flash/chargers; stationery kits; etc.
 */
const FAMILIES: string[][] = [
  [
    "airpods",
    "tws",
    "pods",
    "earbuds",
    "oraimo-air",
    "sivia-s13",
    "mango-pods",
    "tronix",
    "vortex",
    "headset",
    "akg"
  ],
  ["speaker", "calus", "r800", "ubl", "harman"],
  ["mortice", "lock", "key-holder", "union", "fieldex"],
  [
    "extension",
    "charger",
    "oraimo",
    "type-c",
    "sivia-cable",
    "laptop-charger",
    "seal-tape"
  ],
  ["t900", "kt8", "ultra", "watch", "a58"],
  ["pouch", "stand", "protector", "screen", "phone"],
  ["hard-drive", "hdd", "flash", "memory", "ssd", "card"],
  ["mouse", "keyboard", "casing"],
  [
    "casio",
    "sharp",
    "calculator",
    "pen",
    "bic",
    "book",
    "paper",
    "pencil",
    "glue",
    "marker",
    "envelope",
    "sharpener",
    "ruler",
    "tipex"
  ]
];

/** Complementary category pairs for cross-sell beyond the same shelf. */
const COMPLEMENTARY: Record<string, string[]> = {
  phones: ["phone-accessories", "chargers", "audio"],
  "phone-accessories": ["chargers", "phones", "audio"],
  chargers: ["phone-accessories", "phones", "power", "computers"],
  power: ["chargers", "computers", "home"],
  computers: ["storage", "chargers", "power", "audio"],
  storage: ["computers", "phones", "chargers"],
  audio: ["phones", "phone-accessories", "chargers"],
  watches: ["chargers", "phone-accessories"],
  stationery: ["stationery", "locks"],
  locks: ["locks", "stationery"],
  home: ["power", "home"]
};

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

export function relatedProducts(
  current: Product,
  pool: Product[],
  limit = 8
): Product[] {
  const fam = familyIndex(current);
  const curTokens = new Set(tokens(current));
  const complements = new Set(COMPLEMENTARY[current.categorySlug] ?? []);

  return pool
    .filter((p) => p.id !== current.id)
    .map((p) => {
      let score = 0;
      if (p.categorySlug === current.categorySlug) score += 3;
      if (complements.has(p.categorySlug)) score += 6;
      const pf = familyIndex(p);
      if (fam >= 0 && pf === fam) score += 10;
      for (const t of tokens(p)) {
        if (curTokens.has(t)) score += 1;
      }
      if (p.hotDeal) score += 0.2;
      if (p.featured) score += 0.1;
      return { p, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.p);
}
