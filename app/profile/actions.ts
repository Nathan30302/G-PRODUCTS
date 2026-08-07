"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import {
  createCustomerSession,
  destroyCustomerSession,
  hashPassword,
  verifyPassword
} from "@/lib/customer-auth";
import { siteConfig } from "@/config/site";

export type AuthFormState = { error?: string };

function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/[^\d+]/g, "").trim();
  if (!digits) return null;
  if (digits.length < 9) return null;
  return digits;
}

export async function customerSignupAction(
  _prev: AuthFormState | undefined,
  formData: FormData
): Promise<AuthFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const phone = normalizePhone(String(formData.get("phone") ?? ""));
  const password = String(formData.get("password") ?? "");

  if (!name || !email || !password) {
    return { error: "Name, email and password are required." };
  }
  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }

  const existing = await prisma.customer.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with that email already exists. Log in instead." };
  }

  const customer = await prisma.customer.create({
    data: {
      name,
      email,
      phone,
      passwordHash: await hashPassword(password)
    }
  });

  await createCustomerSession({
    id: customer.id,
    email: customer.email,
    name: customer.name,
    phone: customer.phone
  });

  redirect(siteConfig.apps.customer.home);
}

export async function customerLoginAction(
  _prev: AuthFormState | undefined,
  formData: FormData
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Please enter your email and password." };
  }

  const customer = await prisma.customer.findUnique({ where: { email } });
  if (
    !customer ||
    !(await verifyPassword(password, customer.passwordHash))
  ) {
    return { error: "Invalid email or password." };
  }

  await createCustomerSession({
    id: customer.id,
    email: customer.email,
    name: customer.name,
    phone: customer.phone
  });

  redirect(siteConfig.apps.customer.home);
}

export async function customerLogoutAction(): Promise<void> {
  await destroyCustomerSession();
  redirect("/profile");
}
