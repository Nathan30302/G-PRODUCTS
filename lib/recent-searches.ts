const STORAGE_KEY = "gproducts-recent-searches";
const MAX = 6;

export function getRecentSearches(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((v): v is string => typeof v === "string").slice(0, MAX);
  } catch {
    return [];
  }
}

export function pushRecentSearch(query: string) {
  const trimmed = query.trim();
  if (trimmed.length < 2) return;
  try {
    const prev = getRecentSearches().filter(
      (q) => q.toLowerCase() !== trimmed.toLowerCase()
    );
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([trimmed, ...prev].slice(0, MAX))
    );
  } catch {
    /* ignore quota / private mode */
  }
}
