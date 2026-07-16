"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";

const STATUSES = [
  "NEW",
  "CONFIRMED",
  "IN_PROGRESS",
  "READY",
  "DELIVERED",
  "CANCELLED"
] as const;

type Status = (typeof STATUSES)[number];

export async function updateServiceStatus(formData: FormData): Promise<void> {
  await requireUser();
  const id = String(formData.get("id") ?? "").trim();
  const status = String(formData.get("status") ?? "");
  if (!id || !STATUSES.includes(status as Status)) return;

  await prisma.serviceRequest.update({
    where: { id },
    data: {
      status: status as Status,
      ...(status === "CONFIRMED" || status === "DELIVERED"
        ? { paymentStatus: "SUCCESS" as const }
        : {}),
      ...(status === "CANCELLED" ? { paymentStatus: "FAILED" as const } : {})
    }
  });

  revalidatePath("/admin/services");
  revalidatePath(`/admin/services/${id}`);
}
