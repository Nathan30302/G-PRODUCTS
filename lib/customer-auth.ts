import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import { hashPassword, verifyPassword } from "@/lib/auth";

const COOKIE = "gp_customer";
const ALG = "HS256";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export type CustomerSession = {
  id: string;
  email: string;
  name: string;
  phone: string | null;
};

function secret(): Uint8Array {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 16) {
    throw new Error("AUTH_SECRET is missing or too short");
  }
  return new TextEncoder().encode(s);
}

export { hashPassword, verifyPassword };

export async function createCustomerSession(
  customer: CustomerSession
): Promise<void> {
  const token = await new SignJWT({
    email: customer.email,
    name: customer.name,
    phone: customer.phone,
    kind: "customer"
  })
    .setProtectedHeader({ alg: ALG })
    .setSubject(customer.id)
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret());

  const store = await cookies();
  store.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE
  });
}

export async function destroyCustomerSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}

export async function getCustomerSession(): Promise<CustomerSession | null> {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    if (payload.kind !== "customer") return null;
    return {
      id: String(payload.sub),
      email: String(payload.email),
      name: String(payload.name),
      phone: payload.phone ? String(payload.phone) : null
    };
  } catch {
    return null;
  }
}

export async function requireCustomer(): Promise<CustomerSession> {
  const customer = await getCustomerSession();
  if (!customer) redirect("/profile/customer/login");
  return customer;
}
