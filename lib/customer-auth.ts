import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { hashPassword, verifyPassword } from "@/lib/auth";
import {
  CUSTOMER_COOKIE,
  CUSTOMER_MAX_AGE,
  sessionCookieOptions,
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
  store.set(CUSTOMER_COOKIE, token, sessionCookieOptions(CUSTOMER_MAX_AGE));
}

export async function destroyCustomerSession(): Promise<void> {
  const store = await cookies();
  store.set(CUSTOMER_COOKIE, "", {
    ...sessionCookieOptions(0),
    maxAge: 0
  });
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
