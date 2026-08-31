"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { BROWSE_TILES_CACHE_TAG } from "@/lib/browse-tiles";

export type BrowseTileActionState = { error?: string; success?: string };

function revalidateBrowseTiles() {
  revalidateTag(BROWSE_TILES_CACHE_TAG);
  revalidatePath("/");
  revalidatePath("/search");
  revalidatePath("/admin/browse-tiles");
}

export async function createBrowseTile(
  _prev: BrowseTileActionState | undefined,
  formData: FormData
): Promise<BrowseTileActionState> {
  await requireUser();

  const label = String(formData.get("label") ?? "").trim();
  const href = String(formData.get("href") ?? "").trim();
  const imageUrl = String(formData.get("imageUrl") ?? "").trim() || null;
  const isPromo = String(formData.get("isPromo") ?? "") === "1";
  const sortOrder = Number(formData.get("sortOrder") ?? 0);

  if (!label) return { error: "Label is required." };
  if (!href || !href.startsWith("/")) {
    return { error: "Link must start with / (e.g. /search?q=charger)." };
  }

  await prisma.shopBrowseTile.create({
    data: {
      label,
      href,
      imageUrl,
      isPromo,
      sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
      enabled: true
    }
  });

  revalidateBrowseTiles();
  return { success: "Browse tile added." };
}

export async function updateBrowseTile(
  _prev: BrowseTileActionState | undefined,
  formData: FormData
): Promise<BrowseTileActionState> {
  await requireUser();

  const id = String(formData.get("id") ?? "").trim();
  const label = String(formData.get("label") ?? "").trim();
  const href = String(formData.get("href") ?? "").trim();
  const imageUrl = String(formData.get("imageUrl") ?? "").trim() || null;
  const isPromo = String(formData.get("isPromo") ?? "") === "1";
  const sortOrder = Number(formData.get("sortOrder") ?? 0);
  const enabled = String(formData.get("enabled") ?? "") === "1";

  if (!id) return { error: "Missing tile." };
  if (!label) return { error: "Label is required." };
  if (!href || !href.startsWith("/")) {
    return { error: "Link must start with /." };
  }

  await prisma.shopBrowseTile.update({
    where: { id },
    data: {
      label,
      href,
      imageUrl,
      isPromo,
      sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
      enabled
    }
  });

  revalidateBrowseTiles();
  return { success: "Tile saved." };
}

export async function deleteBrowseTile(
  _prev: BrowseTileActionState | undefined,
  formData: FormData
): Promise<BrowseTileActionState> {
  await requireUser();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { error: "Missing tile." };

  await prisma.shopBrowseTile.delete({ where: { id } }).catch(() => null);
  revalidateBrowseTiles();
  return { success: "Tile removed." };
}
