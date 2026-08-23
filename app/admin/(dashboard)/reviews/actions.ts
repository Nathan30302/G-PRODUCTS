"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";

export type ReviewActionState = { error?: string; success?: string };

export async function toggleReviewPublished(
  _prev: ReviewActionState | undefined,
  formData: FormData
): Promise<ReviewActionState> {
  await requireUser();

  const id = String(formData.get("id") ?? "").trim();
  const published = String(formData.get("published") ?? "") === "1";

  if (!id) return { error: "Missing review." };

  const existing = await prisma.productReview.findUnique({
    where: { id },
    select: { id: true }
  });
  if (!existing) return { error: "Review not found." };

  await prisma.productReview.update({
    where: { id },
    data: { published }
  });

  revalidatePath("/admin/reviews");
  revalidatePath("/");
  revalidatePath("/product", "layout");

  return {
    success: published ? "Review published." : "Review hidden from storefront."
  };
}

export async function deleteReview(
  _prev: ReviewActionState | undefined,
  formData: FormData
): Promise<ReviewActionState> {
  await requireUser();

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { error: "Missing review." };

  await prisma.productReview.delete({ where: { id } }).catch(() => null);

  revalidatePath("/admin/reviews");
  revalidatePath("/");
  revalidatePath("/product", "layout");

  return { success: "Review deleted." };
}
