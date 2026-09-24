"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { serviceStatusLabels } from "@/lib/commerce-hooks";

const STATUSES = [
  "NEW",
  "CONFIRMED",
  "IN_PROGRESS",
  "READY",
  "DELIVERED",
  "CANCELLED"
] as const;

type Status = (typeof STATUSES)[number];

export type ServiceStatusState = { error?: string; success?: string };

export async function updateServiceStatus(
  _prev: ServiceStatusState | undefined,
  formData: FormData
): Promise<ServiceStatusState> {
  await requireUser();
  const id = String(formData.get("id") ?? "").trim();
  const status = String(formData.get("status") ?? "");

  if (!id) return { error: "Missing service request." };
  if (!STATUSES.includes(status as Status)) {
    return { error: "Invalid status." };
  }

  const existing = await prisma.serviceRequest.findUnique({
    where: { id },
    select: { id: true, status: true }
  });
  if (!existing) return { error: "Service request not found." };
  if (existing.status === status) {
    return { success: "Status already up to date." };
  }

  try {
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
  } catch (err) {
    console.error("[admin/services] status update:", err);
    return { error: "Could not save status. Please try again." };
  }

  revalidatePath("/admin/services");
  revalidatePath(`/admin/services/${id}`);

  const label =
    serviceStatusLabels[status as Status]?.label ?? status;
  return { success: `Saved — customers now see “${label}”.` };
}
