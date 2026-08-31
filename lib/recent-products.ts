const STORAGE_KEY = "gproducts-recent-products";
const MAX = 12;

export type RecentProductRef = {
  slug: string;
  viewedAt: number;
};

export function getRecentProductSlugs(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (item): item is RecentProductRef =>
          typeof item === "object" &&
          item !== null &&
          typeof (item as RecentProductRef).slug === "string"
      )
      .sort((a, b) => b.viewedAt - a.viewedAt)
      .map((item) => item.slug)
      .slice(0, MAX);
  } catch {
    return [];
  }
}

export function pushRecentProduct(slug: string) {
  const trimmed = slug.trim();
  if (!trimmed) return;
  try {
    const prev = getRecentProductSlugs().filter((s) => s !== trimmed);
    const next: RecentProductRef[] = [
      { slug: trimmed, viewedAt: Date.now() },
      ...prev.map((s) => ({ slug: s, viewedAt: Date.now() - 1 }))
    ].slice(0, MAX);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* ignore quota / private mode */
  }
}
