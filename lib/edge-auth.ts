import { jwtVerify } from "jose";

const FALLBACK_SECRET = "change-me-in-railway-variables";

function secret(): Uint8Array {
  const raw = process.env.AUTH_SECRET?.trim();
  const value = raw && raw.length >= 16 ? raw : FALLBACK_SECRET;
  return new TextEncoder().encode(value);
}

/**
 * Signature-only desk check for Edge middleware.
 * Blocks unauthenticated /admin requests before any page renders — layout
 * redirects alone still stream page output, which leaked desk analytics.
 * Full identity checks stay in requireUser() on the server.
 */
export async function hasValidDeskToken(
  token: string | undefined
): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload.kind !== "customer";
  } catch {
    return false;
  }
}
