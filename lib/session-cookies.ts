import "server-only";
import { SignJWT, jwtVerify } from "jose";
import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

const ALG = "HS256";
const FALLBACK_SECRET = "change-me-in-railway-variables";

/** Historical Domain= values that can shadow host-only cookies on Safari. */
const LEGACY_COOKIE_DOMAINS = [".g-products.store", "g-products.store"] as const;

export const DESK_COOKIE = "gp_session";
export const CUSTOMER_COOKIE = "gp_customer";
export const DESK_MAX_AGE = 60 * 60 * 24 * 7;
export const CUSTOMER_MAX_AGE = 60 * 60 * 24 * 30;

type CookieJar = {
  set: (
    name: string,
    value: string,
    options?: Partial<ResponseCookie>
  ) => unknown;
};

export function authSecret(): Uint8Array {
  const raw = process.env.AUTH_SECRET?.trim();
  const s = raw && raw.length >= 16 ? raw : FALLBACK_SECRET;
  return new TextEncoder().encode(s);
}

/**
 * Host-only cookies by default (most reliable on mobile Safari).
 * Set COOKIE_DOMAIN only if you intentionally need a shared parent domain.
 * Apex → www middleware already keeps a single hostname.
 */
export function sessionCookieOptions(maxAge: number): Partial<ResponseCookie> {
  const opts: Partial<ResponseCookie> = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge
  };

  const domain = process.env.COOKIE_DOMAIN?.trim();
  if (domain) {
    opts.domain = domain;
  }

  return opts;
}

/** Host-only + any configured/legacy Domain scopes to clear. */
function cookieDomainScopes(): (string | undefined)[] {
  const scopes = new Set<string | undefined>([undefined]);
  const configured = process.env.COOKIE_DOMAIN?.trim();
  if (configured) scopes.add(configured);
  for (const d of LEGACY_COOKIE_DOMAINS) scopes.add(d);
  return [...scopes];
}

function clearCookieAllScopes(jar: CookieJar, name: string): void {
  for (const domain of cookieDomainScopes()) {
    // Build options without inheriting Domain — host-only clear must omit it.
    const opts: Partial<ResponseCookie> = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0
    };
    if (domain) opts.domain = domain;
    jar.set(name, "", opts);
  }
}

/** Set a session cookie after wiping host-only + legacy Domain copies. */
export function setSessionCookie(
  jar: CookieJar,
  name: string,
  value: string,
  maxAge: number
): void {
  clearCookieAllScopes(jar, name);
  jar.set(name, value, sessionCookieOptions(maxAge));
}

/** Clear a session cookie across host-only + legacy Domain scopes. */
export function clearSessionCookie(jar: CookieJar, name: string): void {
  clearCookieAllScopes(jar, name);
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
