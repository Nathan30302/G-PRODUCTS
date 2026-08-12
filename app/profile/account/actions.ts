"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getCustomerSession } from "@/lib/customer-auth";

export type LocationFormState = { error?: string; ok?: boolean };

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
