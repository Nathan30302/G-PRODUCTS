import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword } from "@/lib/auth";
import { findCustomerByIdentifier } from "@/lib/customer-lookup";
import { findDeskUserByIdentifier } from "@/lib/user-lookup";
import {
  CUSTOMER_COOKIE,
  CUSTOMER_MAX_AGE,
  DESK_COOKIE,
  DESK_MAX_AGE,
  sessionCookieOptions,
  signCustomerToken,
  signDeskToken
} from "@/lib/session-cookies";
import { siteConfig } from "@/config/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function resolveDeskUser(identifier: string) {
  let deskUser = await findDeskUserByIdentifier(identifier);
  if (deskUser) return deskUser;

  const ownerEmail =
    process.env.OWNER_EMAIL?.trim().toLowerCase() ?? "gift@gproducts.zm";
  const id = identifier.trim().toLowerCase();
  const providerEmails = new Set([
    ownerEmail,
    ...siteConfig.providerSignupEmails.map((e) => e.toLowerCase())
  ]);

  if (
    id.includes("@") &&
    (providerEmails.has(id) || id.endsWith("@gproducts.zm"))
  ) {
    const owner = await prisma.user.findFirst({ where: { role: "OWNER" } });
    if (owner) return owner;
  }

  return null;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const identifier = String(body.identifier ?? "").trim();
    const password = String(body.password ?? "");

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Enter your phone or email, and your password." },
        { status: 400 }
      );
    }

    const deskUser = await resolveDeskUser(identifier);
    if (deskUser) {
      if (!(await verifyPassword(password, deskUser.passwordHash))) {
        return NextResponse.json(
          {
            error: "Wrong password. Check your details and try again."
          },
          { status: 401 }
        );
      }

      const token = await signDeskToken({
        id: deskUser.id,
        email: deskUser.email,
        name: deskUser.name,
        role: deskUser.role
      });

      const res = NextResponse.json({
        ok: true,
        kind: "desk",
        redirectTo: siteConfig.apps.provider.home,
        name: deskUser.name
      });
      res.cookies.set(CUSTOMER_COOKIE, "", {
        ...sessionCookieOptions(0),
        maxAge: 0
      });
      res.cookies.set(DESK_COOKIE, token, sessionCookieOptions(DESK_MAX_AGE));
      return res;
    }

    const customer = await findCustomerByIdentifier(identifier);
    if (customer) {
      if (!(await verifyPassword(password, customer.passwordHash))) {
        return NextResponse.json(
          {
            error:
              "Wrong password. Try again, or Create account if this is your first time."
          },
          { status: 401 }
        );
      }

      const token = await signCustomerToken({
        id: customer.id,
        email: customer.email,
        name: customer.name,
        phone: customer.phone
      });

      const res = NextResponse.json({
        ok: true,
        kind: "customer",
        redirectTo: siteConfig.apps.customer.home,
        name: customer.name
      });
      res.cookies.set(DESK_COOKIE, "", {
        ...sessionCookieOptions(0),
        maxAge: 0
      });
      res.cookies.set(
        CUSTOMER_COOKIE,
        token,
        sessionCookieOptions(CUSTOMER_MAX_AGE)
      );
      return res;
    }

    return NextResponse.json(
      {
        error:
          "No account matched that phone or email. Use Create account if you have not signed up yet."
      },
      { status: 404 }
    );
  } catch (err) {
    console.error("[api/auth/login]", err);
    return NextResponse.json(
      { error: "Sign in failed unexpectedly. Please try again." },
      { status: 500 }
    );
  }
}
