/** Shared auth secret checks (safe for start-prod.ts and Next server routes). */

const FALLBACK_AUTH_SECRET = "change-me-in-railway-variables";

export function authSecretRaw(): string {
  const raw = process.env.AUTH_SECRET?.trim() ?? "";
  return raw && raw.length >= 16 ? raw : FALLBACK_AUTH_SECRET;
}

/** Reject weak session signing secrets in production. */
export function assertAuthSecretConfigured(): void {
  if (process.env.NODE_ENV !== "production") return;
  const raw = process.env.AUTH_SECRET?.trim() ?? "";
  if (raw.length < 16 || raw === FALLBACK_AUTH_SECRET) {
    throw new Error(
      "AUTH_SECRET must be a long random string (16+ chars) in production."
    );
  }
}
