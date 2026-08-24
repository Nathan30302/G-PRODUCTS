"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";

export type TeamActionState = { error?: string; success?: string };

export async function createTeamMember(
  _prev: TeamActionState | undefined,
  formData: FormData
): Promise<TeamActionState> {
  await requireUser();

  const name = String(formData.get("name") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const sortOrder = Number(formData.get("sortOrder") ?? 0);

  if (!name) return { error: "Name is required." };
  if (!title) return { error: "Title / role is required." };

  await prisma.shopTeamMember.create({
    data: {
      name,
      title,
      photoUrl: null,
      sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
      published: true
    }
  });

  revalidatePath("/admin/shop-team");
  revalidatePath("/about");
  revalidatePath("/");

  return { success: "Team member added." };
}

export async function updateTeamMember(
  _prev: TeamActionState | undefined,
  formData: FormData
): Promise<TeamActionState> {
  await requireUser();

  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const sortOrder = Number(formData.get("sortOrder") ?? 0);
  const published = String(formData.get("published") ?? "") === "1";

  if (!id) return { error: "Missing member." };
  if (!name) return { error: "Name is required." };
  if (!title) return { error: "Title / role is required." };

  await prisma.shopTeamMember.update({
    where: { id },
    data: {
      name,
      title,
      sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
      published
    }
  });

  revalidatePath("/admin/shop-team");
  revalidatePath("/about");
  revalidatePath("/");

  return { success: "Team member updated." };
}

export async function deleteTeamMember(
  _prev: TeamActionState | undefined,
  formData: FormData
): Promise<TeamActionState> {
  await requireUser();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { error: "Missing member." };

  await prisma.shopTeamMember.delete({ where: { id } }).catch(() => null);

  revalidatePath("/admin/shop-team");
  revalidatePath("/about");
  revalidatePath("/");

  return { success: "Removed." };
}

export async function toggleTeamPublished(
  _prev: TeamActionState | undefined,
  formData: FormData
): Promise<TeamActionState> {
  await requireUser();
  const id = String(formData.get("id") ?? "").trim();
  const published = String(formData.get("published") ?? "") === "1";
  if (!id) return { error: "Missing member." };

  await prisma.shopTeamMember.update({
    where: { id },
    data: { published }
  });

  revalidatePath("/admin/shop-team");
  revalidatePath("/about");
  revalidatePath("/");

  return {
    success: published ? "Published on About." : "Hidden from About."
  };
}
