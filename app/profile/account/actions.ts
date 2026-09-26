"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getCustomerSession } from "@/lib/customer-auth";
import { normalizePhone, phoneVariants } from "@/lib/phone";

export type LocationFormState = { error?: string; ok?: boolean };
export type AccountFormState = { error?: string; ok?: boolean };
export type AftercareFormState = { error?: string; ok?: boolean; ref?: string };

export type RecentProductCard = {
  slug: string;
  name: string;
  price: number;
  image: string | null;
  alt: string;
};

export async function updateCustomerLocationAction(
  _prev: LocationFormState | undefined,
  formData: FormData
): Promise<LocationFormState> {
  const session = await getCustomerSession();
  if (!session) return { error: "Sign in to save your delivery location." };

  const locationLabel = String(formData.get("locationLabel") ?? "").trim();
  const defaultLocation = String(formData.get("defaultLocation") ?? "").trim();

  if (!defaultLocation) {
    return { error: "Enter where we should deliver — room, hostel, or home address." };
  }

  await prisma.customer.update({
    where: { id: session.id },
    data: {
      defaultLocation,
      locationLabel: locationLabel || null
    }
  });

  revalidatePath("/profile/account");
  revalidatePath("/checkout");
  return { ok: true };
}

export async function updateCustomerAccountAction(
  _prev: AccountFormState | undefined,
  formData: FormData
): Promise<AccountFormState> {
  const session = await getCustomerSession();
  if (!session) return { error: "Sign in to update your account." };

  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const phoneRaw = String(formData.get("phone") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const offersOptIn = formData.get("offersOptIn") === "on";

  if (firstName.length < 2) return { error: "Enter your first name." };
  if (lastName.length < 2) return { error: "Enter your last name." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Enter a valid email address." };
  }
  const phone = normalizePhone(phoneRaw);
  if (!phone) return { error: "Enter a valid phone number." };

  const phoneTaken = await prisma.customer.findFirst({
    where: { phone: { in: phoneVariants(phone) }, NOT: { id: session.id } },
    select: { id: true }
  });
  if (phoneTaken) {
    return { error: "That number is already on another account." };
  }

  const emailTaken = await prisma.customer.findFirst({
    where: { email, NOT: { id: session.id } },
    select: { id: true }
  });
  if (emailTaken) {
    return { error: "That email is already on another account." };
  }

  await prisma.customer.update({
    where: { id: session.id },
    data: {
      firstName,
      lastName,
      name: `${firstName} ${lastName}`,
      email,
      phone,
      defaultLocation: address || null,
      offersOptIn
    }
  });

  revalidatePath("/profile/account");
  revalidatePath("/checkout");
  return { ok: true };
}

export async function lookupRecentProducts(
  slugs: string[]
): Promise<RecentProductCard[]> {
  const clean = [...new Set(slugs.map((s) => s.trim()).filter(Boolean))].slice(
    0,
    8
  );
  if (clean.length === 0) return [];

  const rows = await prisma.product.findMany({
    where: { slug: { in: clean } },
    select: {
      slug: true,
      name: true,
      price: true,
      images: {
        orderBy: { sortOrder: "asc" },
        take: 1,
        select: { url: true, alt: true }
      }
    }
  });
  const bySlug = new Map(rows.map((row) => [row.slug, row]));
  return clean.flatMap((slug) => {
    const row = bySlug.get(slug);
    if (!row) return [];
    return [
      {
        slug: row.slug,
        name: row.name,
        price: row.price,
        image: row.images[0]?.url ?? null,
        alt: row.images[0]?.alt ?? row.name
      }
    ];
  });
}

function newClaimRef() {
  return "AC-" + Math.random().toString(36).slice(2, 8).toUpperCase();
}

function contactMatches(
  contact: string,
  orderPhone: string,
  accountEmail: string | null
) {
  if (contact.includes("@")) {
    return (
      accountEmail != null &&
      contact.toLowerCase() === accountEmail.toLowerCase()
    );
  }
  const phone = normalizePhone(contact);
  if (!phone) return false;
  const given = new Set(phoneVariants(phone));
  return phoneVariants(orderPhone).some((variant) => given.has(variant));
}

export async function submitAftercareAction(
  _prev: AftercareFormState | undefined,
  formData: FormData
): Promise<AftercareFormState> {
  const session = await getCustomerSession();
  if (!session) return { error: "Sign in to start a return or exchange." };

  const intent = String(formData.get("intent") ?? "start");
  const kindRaw = String(formData.get("kind") ?? "return");
  const kind =
    intent === "gift"
      ? "gift"
      : kindRaw === "exchange" || kindRaw === "warranty"
        ? kindRaw
        : "return";
  const orderRef = String(formData.get("orderRef") ?? "")
    .trim()
    .toUpperCase();
  const contact = String(formData.get("contact") ?? "").trim();

  if (!orderRef) return { error: "Enter the order number." };
  if (!contact) return { error: "Enter the email or phone on the order." };

  const order = await prisma.order.findUnique({
    where: { ref: orderRef },
    select: { ref: true, customerPhone: true, customerId: true }
  });
  if (!order) {
    return {
      error:
        "We couldn't find that order. Returns, exchanges, and warranty claims are only for items bought from G-Products."
    };
  }

  const account = await prisma.customer.findUnique({
    where: { id: session.id },
    select: { email: true, phone: true }
  });

  const ownsOrder =
    order.customerId === session.id ||
    (account?.phone
      ? phoneVariants(account.phone).some((variant) =>
          phoneVariants(order.customerPhone).includes(variant)
        )
      : false);

  if (kind !== "gift" && !ownsOrder) {
    return {
      error:
        "That order isn't on this account. Use Return a gift if someone bought it for you."
    };
  }

  if (
    kind !== "gift" &&
    !contactMatches(contact, order.customerPhone, account?.email ?? null)
  ) {
    return {
      error: "That email or phone doesn't match the order."
    };
  }

  if (kind === "gift" && !contact.includes("@") && !normalizePhone(contact)) {
    return { error: "Enter a valid email or phone number." };
  }

  const existing = await prisma.aftercareClaim.findFirst({
    where: { orderRef: order.ref, kind, customerId: session.id, status: "NEW" },
    select: { ref: true }
  });
  if (existing) {
    return { ok: true, ref: existing.ref };
  }

  const claim = await prisma.aftercareClaim.create({
    data: {
      ref: newClaimRef(),
      kind,
      orderRef: order.ref,
      contact,
      customerId: session.id
    }
  });

  revalidatePath("/profile/account");
  revalidatePath("/admin/aftercare");
  return { ok: true, ref: claim.ref };
}
