import { jwtVerify } from "jose";
import { authSecretRaw } from "@/lib/auth-secret";

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
    const secret = new TextEncoder().encode(authSecretRaw());
    const { payload } = await jwtVerify(token, secret);
    return payload.kind !== "customer";
  } catch {
    return false;
  }
}
