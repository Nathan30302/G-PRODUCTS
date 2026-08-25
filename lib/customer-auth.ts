import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/auth";
import {
  CUSTOMER_COOKIE,
  CUSTOMER_MAX_AGE,
  DESK_COOKIE,
  clearSessionCookie,
  setSessionCookie,
  signCustomerToken,
  verifyCustomerToken
} from "@/lib/session-cookies";

export type CustomerSession = {
  id: string;
  email: string | null;
  name: string;
  phone: string;
};

export { hashPassword, verifyPassword };

export async function createCustomerSession(
  customer: CustomerSession
): Promise<void> {
  const token = await signCustomerToken(customer);
  const store = await cookies();
  clearSessionCookie(store, DESK_COOKIE);
  setSessionCookie(store, CUSTOMER_COOKIE, token, CUSTOMER_MAX_AGE);
}

export async function destroyCustomerSession(): Promise<void> {
  const store = await cookies();
  clearSessionCookie(store, CUSTOMER_COOKIE);
}

/** Live DB check — session must match an existing customer row. */
export async function getCustomerSession(): Promise<CustomerSession | null> {
  const store = await cookies();
  const token = store.get(CUSTOMER_COOKIE)?.value;
  if (!token) return null;
  try {
    const payload = await verifyCustomerToken(token);
    if (!payload) return null;
    const customer = await prisma.customer.findUnique({
      where: { id: payload.id },
      select: { id: true, email: true, name: true, phone: true }
    });
    if (!customer) return null;
    return customer;
  } catch {
    return null;
  }
}

export async function requireCustomer(): Promise<CustomerSession> {
  const customer = await getCustomerSession();
  if (!customer) redirect("/profile");
  return customer;
}
