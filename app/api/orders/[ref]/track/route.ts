import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getPaymentStatus, type PaymentProvider } from "@/lib/payments";
import {
  labelForOrderStatus,
  type OrderStatusKey
} from "@/lib/commerce-hooks";
import { onOrderPaymentSuccess } from "@/lib/rewards";

const FLOW: OrderStatusKey[] = [
  "PENDING",
  "PAID",
  "PREPARING",
  "READY",
  "DELIVERED"
];

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ ref: string }> }
) {
  const { ref: raw } = await params;
  const ref = raw.trim().toUpperCase();
  const order = await prisma.order.findUnique({
    where: { ref },
    include: { items: true }
  });
  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  let paymentStatus = order.paymentStatus;
  let orderStatus = order.status;

  if (order.paymentStatus === "PENDING" && order.paymentRef) {
    const result = await getPaymentStatus(
      order.paymentMethod as PaymentProvider,
      order.paymentRef
    );
    if (result.status !== "PENDING") {
      const updated = await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: result.status,
          status: result.status === "SUCCESS" ? "PAID" : order.status
        }
      });
      paymentStatus = updated.paymentStatus;
      orderStatus = updated.status;
      if (result.status === "SUCCESS") {
        await onOrderPaymentSuccess(order.id).catch((err) =>
          console.warn("[orders/track] rewards:", err)
        );
      }
    }
  }

  const cancelled = orderStatus === "CANCELLED";
  const idx = FLOW.indexOf(orderStatus as OrderStatusKey);
  const timeline = FLOW.map((key, my) => ({
    key,
    label: labelForOrderStatus(key).label,
    hint: labelForOrderStatus(key).hint,
    done: !cancelled && idx >= 0 && my <= idx,
    current: !cancelled && key === orderStatus
  }));

  return NextResponse.json({
    ref: order.ref,
    paymentStatus,
    orderStatus,
    customerName: order.customerName,
    total: order.total,
    createdAt: order.createdAt.toISOString(),
    items: order.items.map((i) => ({
      name: i.name,
      qty: i.qty,
      price: i.price
    })),
    timeline
  });
}
