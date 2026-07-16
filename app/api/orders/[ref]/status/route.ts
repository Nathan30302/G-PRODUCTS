import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getPaymentStatus, type PaymentProvider } from "@/lib/payments";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ ref: string }> }
) {
  const { ref } = await params;
  const order = await prisma.order.findUnique({ where: { ref } });
  if (!order) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // If payment is still pending and we have a live provider reference,
  // ask the provider for the latest status and persist it.
  if (order.paymentStatus === "PENDING" && order.paymentRef) {
    const result = await getPaymentStatus(
      order.paymentMethod as PaymentProvider,
      order.paymentRef
    );
    if (result.status !== "PENDING") {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: result.status,
          status: result.status === "SUCCESS" ? "PAID" : order.status
        }
      });
      return NextResponse.json({
        ref,
        paymentStatus: result.status,
        orderStatus: result.status === "SUCCESS" ? "PAID" : order.status
      });
    }
  }

  return NextResponse.json({
    ref,
    paymentStatus: order.paymentStatus,
    orderStatus: order.status
  });
}
