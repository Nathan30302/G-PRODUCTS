import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getPaymentStatus, type PaymentProvider } from "@/lib/payments";
import { getCustomerSession } from "@/lib/customer-auth";
import { canViewOrder } from "@/lib/track-access";
import {
  labelForOrderStatus,
  type OrderStatusKey
} from "@/lib/commerce-hooks";
import { onOrderPaymentSuccess } from "@/lib/rewards";

export const dynamic = "force-dynamic";

const FLOW: OrderStatusKey[] = [
  "PENDING",
  "PAID",
  "PREPARING",
  "READY",
  "DELIVERED"
];

export async function GET(
  req: Request,
  { params }: { params: Promise<{ ref: string }> }
) {
  const { ref: raw } = await params;
  const ref = raw.trim().toUpperCase();
  const phoneLast4 =
    new URL(req.url).searchParams.get("phoneLast4")?.trim() ?? "";

  const order = await prisma.order.findUnique({
    where: { ref },
    include: { items: true }
  });
  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  const customer = await getCustomerSession();
  if (!canViewOrder(order, { phoneLast4, customer })) {
    return NextResponse.json(
      {
        error:
          "Enter the last 4 digits of the phone number used at checkout to view this order."
      },
      { status: 403 }
    );
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
