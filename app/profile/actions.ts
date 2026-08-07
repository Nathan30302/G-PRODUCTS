"use server";

import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { prisma } from "@/lib/db";
import {
  createSession,
  destroySession,
  hashPassword,
  verifyPassword
} from "@/lib/auth";
import {
  createCustomerSession,
  destroyCustomerSession
} from "@/lib/customer-auth";
import { passwordError } from "@/lib/password";
import { normalizePhone, phoneVariants } from "@/lib/phone";
import { isProviderSignupEmail } from "@/lib/provider-emails";
import { siteConfig } from "@/config/site";

export type AuthFormState = { error?: string };

async function findCustomerByIdentifier(identifier: string) {
  const email = identifier.includes("@")
    ? identifier.trim().toLowerCase()
    : null;
  const phone = normalizePhone(identifier);

  if (email) {
    const byEmail = await prisma.customer.findUnique({ where: { email } });
    if (byEmail) return byEmail;
  }

  if (phone) {
    const variants = phoneVariants(phone);
    return prisma.customer.findFirst({
      where: { phone: { in: variants } }
    });
  }

  return null;
}

export async function unifiedLoginAction(
  _prev: AuthFormState | undefined,
  formData: FormData
): Promise<AuthFormState> {
  try {
    const identifier = String(formData.get("identifier") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!identifier || !password) {
      return { error: "Enter your phone or email, and your password." };
    }

    // Desk users (provider + staff) — email
    if (identifier.includes("@")) {
      const email = identifier.toLowerCase();
      const user = await prisma.user.findUnique({ where: { email } });
      if (user && (await verifyPassword(password, user.passwordHash))) {
        await destroyCustomerSession().catch(() => undefined);
        await createSession({
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        });
        redirect(siteConfig.apps.provider.home);
      }
      if (user) {
        return { error: "Wrong password. Try again." };
      }
    }

    // Shop customers — phone or email
    const customer = await findCustomerByIdentifier(identifier);
    if (customer && (await verifyPassword(password, customer.passwordHash))) {
      await destroySession().catch(() => undefined);
      await createCustomerSession({
        id: customer.id,
        email: customer.email,
        name: customer.name,
        phone: customer.phone
      });
      redirect(siteConfig.apps.customer.home);
    }
    if (customer) {
      return { error: "Wrong password. Try again." };
    }

    return {
      error:
        "No account matched that phone/email. Check the details, or Create account."
    };
  } catch (err) {
    if (isRedirectError(err)) throw err;
    console.error("[auth] login failed:", err);
    return {
      error: "Sign in failed unexpectedly. Please try again in a moment."
    };
  }
}

export async function unifiedSignupAction(
  _prev: AuthFormState | undefined,
  formData: FormData
): Promise<AuthFormState> {
  try {
    const name = String(formData.get("name") ?? "").trim();
    const phoneRaw = String(formData.get("phone") ?? "").trim();
    const emailRaw = String(formData.get("email") ?? "")
      .trim()
      .toLowerCase();
    const password = String(formData.get("password") ?? "");
    const confirm = String(formData.get("confirmPassword") ?? "");

    if (!name) return { error: "Please enter your name." };

    const phone = normalizePhone(phoneRaw);
    if (!phone) {
      return { error: "Enter a valid phone number (required)." };
    }

    const email = emailRaw || null;
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { error: "That email doesn’t look valid." };
    }

    const pwErr = passwordError(password);
    if (pwErr) return { error: pwErr };
    if (password !== confirm) {
      return { error: "Passwords don’t match." };
    }

    if (email) {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return {
          error:
            "This email already has a desk login. Use Sign in instead."
        };
      }
    }

    const phoneTakenCustomer = await prisma.customer.findFirst({
      where: { phone: { in: phoneVariants(phone) } }
    });
    if (phoneTakenCustomer) {
      return {
        error: "An account with that phone already exists. Sign in instead."
      };
    }

    if (email) {
      const emailTaken = await prisma.customer.findUnique({ where: { email } });
      if (emailTaken) {
        return {
          error: "An account with that email already exists. Sign in instead."
        };
      }
    }

    const passwordHash = await hashPassword(password);

    // Only ONE provider. Allowlisted email may claim it if none exists yet.
    if (email && isProviderSignupEmail(email)) {
      const ownerCount = await prisma.user.count({ where: { role: "OWNER" } });
      if (ownerCount > 0) {
        return {
          error:
            "The provider account already exists. Use Sign in with gift@gproducts.zm (or your OWNER_EMAIL)."
        };
      }

      const user = await prisma.user.create({
        data: {
          name,
          email,
          phone,
          passwordHash,
          role: "OWNER"
        }
      });

      await destroyCustomerSession().catch(() => undefined);
      await createSession({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      });
      redirect(siteConfig.apps.provider.home);
    }

    if (email && email.endsWith("@gproducts.zm")) {
      return {
        error:
          "Desk staff can’t create their own account. Ask the owner to add you, then Sign in."
      };
    }

    const customer = await prisma.customer.create({
      data: {
        name,
        email,
        phone,
        passwordHash
      }
    });

    await destroySession().catch(() => undefined);
    await createCustomerSession({
      id: customer.id,
      email: customer.email,
      name: customer.name,
      phone: customer.phone
    });
    redirect(siteConfig.apps.customer.home);
  } catch (err) {
    if (isRedirectError(err)) throw err;
    console.error("[auth] signup failed:", err);
    return {
      error: "Could not create the account. Please try again."
    };
  }
}

export async function unifiedLogoutAction(): Promise<void> {
  await Promise.all([
    destroySession().catch(() => undefined),
    destroyCustomerSession().catch(() => undefined)
  ]);
  redirect("/profile");
}

export async function customerLogoutAction(): Promise<void> {
  await unifiedLogoutAction();
}
