import "server-only";
import { SignJWT, jwtVerify } from "jose";
import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

const ALG = "HS256";
const FALLBACK_SECRET = "change-me-in-railway-variables";

export const DESK_COOKIE = "gp_session";
export const CUSTOMER_COOKIE = "gp_customer";
export const DESK_MAX_AGE = 60 * 60 * 24 * 7;
export const CUSTOMER_MAX_AGE = 60 * 60 * 24 * 30;

export function authSecret(): Uint8Array {
  const raw = process.env.AUTH_SECRET?.trim();
  const s = raw && raw.length >= 16 ? raw : FALLBACK_SECRET;
  return new TextEncoder().encode(s);
}

/** Cookie options that survive mobile browsers + www/apex host mixups. */
export function sessionCookieOptions(maxAge: number): Partial<ResponseCookie> {
  const opts: Partial<ResponseCookie> = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge
  };

  // Share session across www and apex if we're on the live domain
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "";
  if (base.includes("g-products.store") || process.env.COOKIE_DOMAIN) {
    opts.domain = process.env.COOKIE_DOMAIN?.trim() || ".g-products.store";
  }

  return opts;
}

export async function signDeskToken(user: {
  id: string;
  email: string;
  name: string;
  role: "OWNER" | "STAFF";
}): Promise<string> {
  return new SignJWT({
    email: user.email,
    name: user.name,
    role: user.role
  })
    .setProtectedHeader({ alg: ALG })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${DESK_MAX_AGE}s`)
    .sign(authSecret());
}

export async function signCustomerToken(customer: {
  id: string;
  email: string | null;
  name: string;
  phone: string;
}): Promise<string> {
  return new SignJWT({
    email: customer.email,
    name: customer.name,
    phone: customer.phone,
    kind: "customer"
  })
    .setProtectedHeader({ alg: ALG })
    .setSubject(customer.id)
    .setIssuedAt()
    .setExpirationTime(`${CUSTOMER_MAX_AGE}s`)
    .sign(authSecret());
}

export async function verifyDeskToken(token: string) {
  const { payload } = await jwtVerify(token, authSecret());
  return {
    id: String(payload.sub),
    email: String(payload.email),
    name: String(payload.name),
    role: (payload.role === "OWNER" ? "OWNER" : "STAFF") as "OWNER" | "STAFF"
  };
}

export async function verifyCustomerToken(token: string) {
  const { payload } = await jwtVerify(token, authSecret());
  if (payload.kind !== "customer") return null;
  return {
    id: String(payload.sub),
    email: payload.email ? String(payload.email) : null,
    name: String(payload.name),
    phone: String(payload.phone ?? "")
  };
}
