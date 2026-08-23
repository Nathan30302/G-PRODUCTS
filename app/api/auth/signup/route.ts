import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { passwordError } from "@/lib/password";
import { normalizePhone, phoneVariants } from "@/lib/phone";
import { isProviderSignupEmail } from "@/lib/provider-emails";
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
import {
  newReferralCode,
  maybeAwardReferralBonus
} from "@/lib/rewards";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const firstName = String(body.firstName ?? "").trim();
    const lastName = String(body.lastName ?? "").trim();
    const phoneRaw = String(body.phone ?? "").trim();
    const emailRaw = String(body.email ?? "")
      .trim()
      .toLowerCase();
    const password = String(body.password ?? "");
    const confirm = String(body.confirmPassword ?? "");
    const referralFromBody = String(
      body.referralCode ?? body.referredBy ?? ""
    )
      .trim()
      .toUpperCase();

    if (!firstName) {
      return NextResponse.json(
        { error: "Please enter your first name." },
        { status: 400 }
      );
    }
    if (!lastName) {
      return NextResponse.json(
        { error: "Please enter your last name." },
        { status: 400 }
      );
    }

    const name = `${firstName} ${lastName}`.trim();
    const phone = normalizePhone(phoneRaw);
    if (!phone) {
      return NextResponse.json(
        { error: "Enter a valid phone number." },
        { status: 400 }
      );
    }

    if (!emailRaw || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailRaw)) {
      return NextResponse.json(
        { error: "Enter a valid email address." },
        { status: 400 }
      );
    }

    const pwErr = passwordError(password);
    if (pwErr) {
      return NextResponse.json({ error: pwErr }, { status: 400 });
    }
    if (password !== confirm) {
      return NextResponse.json(
        { error: "Passwords don’t match." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findFirst({
      where: { email: { equals: emailRaw } }
    });
    if (existingUser) {
      return NextResponse.json(
        {
          error: "This email already has a desk login. Use Sign in instead."
        },
        { status: 409 }
      );
    }

    const phoneTaken = await prisma.customer.findFirst({
      where: { phone: { in: phoneVariants(phone) } }
    });
    if (phoneTaken) {
      return NextResponse.json(
        {
          error: "An account with that phone already exists. Sign in instead."
        },
        { status: 409 }
      );
    }

    const emailTaken = await prisma.customer.findFirst({
      where: { email: { equals: emailRaw } }
    });
    if (emailTaken) {
      return NextResponse.json(
        {
          error: "An account with that email already exists. Sign in instead."
        },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    if (isProviderSignupEmail(emailRaw)) {
      const ownerCount = await prisma.user.count({ where: { role: "OWNER" } });
      if (ownerCount > 0) {
        return NextResponse.json(
          {
            error: "The provider account already exists. Sign in instead."
          },
          { status: 409 }
        );
      }

      const user = await prisma.user.create({
        data: {
          name,
          email: emailRaw,
          phone,
          passwordHash,
          role: "OWNER"
        }
      });

      const token = await signDeskToken({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      });

      const res = NextResponse.json({
        ok: true,
        kind: "desk",
        redirectTo: siteConfig.apps.provider.home,
        name: user.name
      });
      res.cookies.set(CUSTOMER_COOKIE, "", {
        ...sessionCookieOptions(0),
        maxAge: 0
      });
      res.cookies.set(DESK_COOKIE, token, sessionCookieOptions(DESK_MAX_AGE));
      return res;
    }

    if (emailRaw.endsWith("@gproducts.zm")) {
      return NextResponse.json(
        {
          error:
            "Desk staff can’t create their own account. Ask the owner to add you."
        },
        { status: 403 }
      );
    }

    const customer = await prisma.customer.create({
      data: {
        firstName,
        lastName,
        name,
        email: emailRaw,
        phone,
        passwordHash,
        referralCode: await allocateReferralCode(),
        referredByCode: await resolveReferredBy(referralFromBody)
      }
    });

    // No-op until first paid order; keeps referral wiring in one place
    await maybeAwardReferralBonus(customer.id).catch(() => undefined);

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
      name: customer.name,
      customerId: customer.id
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
  } catch (err) {
    console.error("[api/auth/signup]", err);
    const code =
      err && typeof err === "object" && "code" in err
        ? String((err as { code?: string }).code)
        : "";
    if (code === "P2002") {
      return NextResponse.json(
        {
          error:
            "An account with that phone or email already exists. Sign in instead."
        },
        { status: 409 }
      );
    }
    const message =
      err instanceof Error ? err.message : "Could not create the account.";
    return NextResponse.json(
      { error: `Could not create the account. ${message}` },
      { status: 500 }
    );
  }
}

async function allocateReferralCode(): Promise<string> {
  for (let i = 0; i < 8; i++) {
    const code = newReferralCode();
    const clash = await prisma.customer.findUnique({
      where: { referralCode: code },
      select: { id: true }
    });
    if (!clash) return code;
  }
  throw new Error("Could not allocate referral code");
}

async function resolveReferredBy(code: string): Promise<string | null> {
  if (!code) return null;
  const referrer = await prisma.customer.findFirst({
    where: { referralCode: code },
    select: { referralCode: true }
  });
  return referrer?.referralCode ?? null;
}
