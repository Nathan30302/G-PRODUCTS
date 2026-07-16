"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireOwner, hashPassword } from "@/lib/auth";

export type StaffState = { error?: string; success?: string };

export async function addStaff(
  _prev: StaffState | undefined,
  formData: FormData
): Promise<StaffState> {
  await requireOwner();

  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const name = String(formData.get("name") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const role = formData.get("role") === "OWNER" ? "OWNER" : "STAFF";

  if (!email || !name || !password) {
    return { error: "All fields are required." };
  }
  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "A user with that email already exists." };
  }

  await prisma.user.create({
    data: { email, name, passwordHash: await hashPassword(password), role }
  });

  revalidatePath("/admin/staff");
  return { success: `${name} was added.` };
}

export async function deleteStaff(formData: FormData): Promise<void> {
  const owner = await requireOwner();
  const id = String(formData.get("id") ?? "").trim();
  if (!id || id === owner.id) return; // never delete yourself
  await prisma.user.delete({ where: { id } });
  revalidatePath("/admin/staff");
}
