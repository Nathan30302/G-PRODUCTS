import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
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

export async function getCustomerSession(): Promise<CustomerSession | null> {
  const store = await cookies();
  const token = store.get(CUSTOMER_COOKIE)?.value;
  if (!token) return null;
  try {
    return await verifyCustomerToken(token);
  } catch {
    return null;
  }
}

export async function requireCustomer(): Promise<CustomerSession> {
  const customer = await getCustomerSession();
  if (!customer) redirect("/profile");
  return customer;
}
