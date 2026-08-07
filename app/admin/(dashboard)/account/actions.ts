"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import {
  requireUser,
  hashPassword,
  verifyPassword
} from "@/lib/auth";
import { passwordError } from "@/lib/password";

export type PasswordState = { error?: string; success?: string };

export async function changeDeskPassword(
  _prev: PasswordState | undefined,
  formData: FormData
): Promise<PasswordState> {
  const user = await requireUser();
  const current = String(formData.get("currentPassword") ?? "");
  const next = String(formData.get("newPassword") ?? "");
  const confirm = String(formData.get("confirmPassword") ?? "");

  if (!current || !next) {
    return { error: "Enter your current and new password." };
  }

  const record = await prisma.user.findUnique({ where: { id: user.id } });
  if (!record || !(await verifyPassword(current, record.passwordHash))) {
    return { error: "Current password is wrong." };
  }

  const pwErr = passwordError(next);
  if (pwErr) return { error: pwErr };
  if (next !== confirm) return { error: "New passwords don’t match." };

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await hashPassword(next) }
  });

  revalidatePath("/admin/account");
  return {
    success:
      "Password updated. Tip: set OWNER_SYNC_PASSWORD=0 in Railway (or update OWNER_PASSWORD) so the next deploy doesn’t reset it."
  };
}
