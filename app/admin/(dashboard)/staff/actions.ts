"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireOwner, hashPassword } from "@/lib/auth";
import { passwordError } from "@/lib/password";
import { normalizePhone } from "@/lib/phone";

export type StaffState = { error?: string; success?: string };

const STAFF_TITLE_MAX = 80;

function cleanStaffTitle(raw: string): string {
  return raw.trim().slice(0, STAFF_TITLE_MAX);
}

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
  const phone = normalizePhone(String(formData.get("phone") ?? ""));
  const staffTitle = cleanStaffTitle(String(formData.get("staffTitle") ?? ""));

  if (!email || !name || !password) {
    return { error: "Name, email and password are required." };
  }
  if (!staffTitle) {
    return { error: "Write a role for this staff member (e.g. Orders & uploads)." };
  }

  const pwErr = passwordError(password);
  if (pwErr) return { error: pwErr };

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "A user with that email already exists." };
  }

  await prisma.user.create({
    data: {
      email,
      name,
      phone,
      passwordHash: await hashPassword(password),
      role: "STAFF",
      staffTitle
    }
  });

  revalidatePath("/admin/staff");
  return {
    success: `${name} was added as “${staffTitle}”. Send them ${email} and the password you set.`
  };
}

export async function updateStaffTitle(
  _prev: StaffState | undefined,
  formData: FormData
): Promise<StaffState> {
  await requireOwner();

  const id = String(formData.get("id") ?? "").trim();
  const staffTitle = cleanStaffTitle(String(formData.get("staffTitle") ?? ""));

  if (!id) return { error: "Missing staff member." };
  if (!staffTitle) return { error: "Role cannot be empty." };

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user || user.role === "OWNER") {
    return { error: "You can only edit roles for staff members." };
  }

  await prisma.user.update({
    where: { id },
    data: { staffTitle }
  });

  revalidatePath("/admin/staff");
  return { success: "Role updated." };
}

export async function deleteStaff(formData: FormData): Promise<void> {
  const owner = await requireOwner();
  const id = String(formData.get("id") ?? "").trim();
  if (!id || id === owner.id) return;
  await prisma.user.delete({ where: { id } });
  revalidatePath("/admin/staff");
}
