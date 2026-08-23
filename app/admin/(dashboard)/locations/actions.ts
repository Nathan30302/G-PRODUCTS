"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { siteConfig } from "@/config/site";
import { serializePhotoUrls } from "@/lib/shop-content";

export type LocationActionState = { error?: string; success?: string };

export async function saveLocationPhotos(
  _prev: LocationActionState | undefined,
  formData: FormData
): Promise<LocationActionState> {
  await requireUser();

  const locationId = String(formData.get("locationId") ?? "").trim();
  const valid = siteConfig.locations.some((l) => l.id === locationId);
  if (!valid) return { error: "Unknown location." };

  const raw = String(formData.get("photoUrls") ?? "");
  const urls = raw
    .split(/[\n,]+/)
    .map((u) => u.trim())
    .filter(Boolean);

  await prisma.shopLocationMedia.upsert({
    where: { locationId },
    create: {
      locationId,
      photoUrls: serializePhotoUrls(urls)
    },
    update: {
      photoUrls: serializePhotoUrls(urls)
    }
  });

  revalidatePath("/admin/locations");
  revalidatePath("/");
  revalidatePath("/about");

  return { success: "Location photos saved." };
}
