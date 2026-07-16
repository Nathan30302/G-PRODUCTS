"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";

const STATUSES = [
  "PENDING",
  "PAID",
  "PREPARING",
  "READY",
  "DELIVERED",
  "CANCELLED"
] as const;
type Status = (typeof STATUSES)[number];

export async function updateOrderStatus(formData: FormData): Promise<void> {
  await requireUser();
  const id = String(formData.get("id") ?? "").trim();
  const status = String(formData.get("status") ?? "");
  if (!id || !STATUSES.includes(status as Status)) return;

  await prisma.order.update({
    where: { id },
    data: {
      status: status as Status,
      // Keep payment status roughly in sync for manual confirmations
      ...(status === "PAID" || status === "DELIVERED"
        ? { paymentStatus: "SUCCESS" as const }
        : {}),
      ...(status === "CANCELLED" ? { paymentStatus: "FAILED" as const } : {})
    }
  });

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
}
