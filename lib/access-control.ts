import "server-only";
import { phoneVariants } from "@/lib/phone";
import { assertAuthSecretConfigured } from "@/lib/auth-secret";

export { assertAuthSecretConfigured };

export function phoneLast4(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.slice(-4);
}

export function phoneLast4Matches(
  storedPhone: string,
  providedLast4: string
): boolean {
  const last4 = providedLast4.replace(/\D/g, "").slice(-4);
  if (last4.length !== 4) return false;
  return phoneLast4(storedPhone) === last4;
}

export function phonesMatch(a: string, b: string): boolean {
  const variantsA = new Set(phoneVariants(a));
  return phoneVariants(b).some((v) => variantsA.has(v));
}

type RateBucket = { count: number; resetAt: number };

const rateBuckets = new Map<string, RateBucket>();

/** Lightweight in-process rate limit for auth endpoints. */
export function rateLimitAuth(
  key: string,
  maxAttempts = 12,
  windowMs = 15 * 60 * 1000
): { ok: true } | { ok: false; retryAfterSec: number } {
  const now = Date.now();
  const bucket = rateBuckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    rateBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }
  if (bucket.count >= maxAttempts) {
    return {
      ok: false,
      retryAfterSec: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000))
    };
  }
  bucket.count += 1;
  return { ok: true };
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

export function paymentCallbackAuthorized(request: Request): boolean {
  const secret = process.env.PAYMENT_CALLBACK_SECRET?.trim();
  if (!secret) {
    return process.env.NODE_ENV !== "production";
  }
  const header = request.headers.get("x-payment-callback-secret")?.trim();
  const url = new URL(request.url);
  const query = url.searchParams.get("secret")?.trim();
  return header === secret || query === secret;
}
