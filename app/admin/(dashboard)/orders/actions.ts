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

export type OrderStatusState = { error?: string; success?: string };

export async function updateOrderStatus(
  _prev: OrderStatusState | undefined,
  formData: FormData
): Promise<OrderStatusState> {
  await requireUser();

  const id = String(formData.get("id") ?? "").trim();
  const status = String(formData.get("status") ?? "");

  if (!id) return { error: "Missing order." };
  if (!STATUSES.includes(status as Status)) {
    return { error: "Invalid status." };
  }

  const existing = await prisma.order.findUnique({
    where: { id },
    select: { id: true, status: true }
  });
  if (!existing) return { error: "Order not found." };
  if (existing.status === status) {
    return { success: "Status already up to date." };
  }

  await prisma.order.update({
    where: { id },
    data: {
      status: status as Status,
      ...(status === "PAID" || status === "DELIVERED"
        ? { paymentStatus: "SUCCESS" as const }
        : {}),
      ...(status === "CANCELLED" ? { paymentStatus: "FAILED" as const } : {})
    }
  });

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);

  return { success: `Status saved: ${status}.` };
}
