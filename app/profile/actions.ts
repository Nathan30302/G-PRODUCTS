"use server";

import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { prisma } from "@/lib/db";
import {
  createSession,
  destroySession,
  hashPassword,
  OWNER_ONLY_DESK_MESSAGE,
  verifyPassword
} from "@/lib/auth";
import {
  createCustomerSession,
  destroyCustomerSession
} from "@/lib/customer-auth";
import { passwordError } from "@/lib/password";
import { normalizePhone, phoneVariants } from "@/lib/phone";
import { findCustomerByIdentifier } from "@/lib/customer-lookup";
import { findDeskUserByIdentifier } from "@/lib/user-lookup";
import { isProviderSignupEmail } from "@/lib/provider-emails";
import { siteConfig } from "@/config/site";

export type AuthFormState = { error?: string };

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

    // Provider desk — owner only
    const deskUser = await findDeskUserByIdentifier(identifier);
    if (deskUser) {
      if (deskUser.role !== "OWNER") {
        return { error: OWNER_ONLY_DESK_MESSAGE };
      }
      if (await verifyPassword(password, deskUser.passwordHash)) {
        await destroyCustomerSession().catch(() => undefined);
        await createSession({
          id: deskUser.id,
          email: deskUser.email,
          name: deskUser.name,
          role: "OWNER"
        });
        redirect(siteConfig.apps.provider.home);
      }
      return {
        error: "Wrong password. Check your details and try again."
      };
    }

    // Shop customers — phone or email
    const customer = await findCustomerByIdentifier(identifier);
    if (customer) {
      if (await verifyPassword(password, customer.passwordHash)) {
        await destroySession().catch(() => undefined);
        await createCustomerSession({
          id: customer.id,
          email: customer.email,
          name: customer.name,
          phone: customer.phone
        });
        redirect(siteConfig.apps.customer.home);
      }
      return {
        error:
          "Wrong password. Try again, or use Create account if you have not signed up on this site yet."
      };
    }

    return {
      error:
        "No account matched that phone or email. Use Create account if you have not signed up yet."
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
    const firstName = String(formData.get("firstName") ?? "").trim();
    const lastName = String(formData.get("lastName") ?? "").trim();
    const phoneRaw = String(formData.get("phone") ?? "").trim();
    const emailRaw = String(formData.get("email") ?? "")
      .trim()
      .toLowerCase();
    const password = String(formData.get("password") ?? "");
    const confirm = String(formData.get("confirmPassword") ?? "");

    if (!firstName) return { error: "Please enter your first name." };
    if (!lastName) return { error: "Please enter your last name." };

    const name = `${firstName} ${lastName}`.trim();

    const phone = normalizePhone(phoneRaw);
    if (!phone) {
      return { error: "Enter a valid phone number." };
    }

    if (!emailRaw) {
      return { error: "Email is required." };
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailRaw)) {
      return { error: "That email doesn’t look valid." };
    }
    const email = emailRaw;

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

    const emailTaken = await prisma.customer.findUnique({ where: { email } });
    if (emailTaken) {
      return {
        error: "An account with that email already exists. Sign in instead."
      };
    }

    const passwordHash = await hashPassword(password);

    // Only ONE provider. Allowlisted email may claim it if none exists yet.
    if (isProviderSignupEmail(email)) {
      const ownerCount = await prisma.user.count({ where: { role: "OWNER" } });
      if (ownerCount > 0) {
        return {
          error: "The provider account already exists. Use Sign in instead."
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

    if (email.endsWith("@gproducts.zm")) {
      return {
        error:
          "Desk staff can’t create their own account. Ask the owner to add you, then Sign in."
      };
    }

    const customer = await prisma.customer.create({
      data: {
        firstName,
        lastName,
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
