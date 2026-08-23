/** Canonical public site URL for SEO, OG, and absolute links. */
export function siteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_BASE_URL?.trim().replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  return "https://www.g-products.store";
}
