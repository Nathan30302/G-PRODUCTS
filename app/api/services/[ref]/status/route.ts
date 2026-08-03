import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getPaymentStatus, type PaymentProvider } from "@/lib/payments";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ ref: string }> }
) {
  const { ref } = await params;
  const request = await prisma.serviceRequest.findUnique({ where: { ref } });
  if (!request) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (
    request.paymentStatus === "PENDING" &&
    request.paymentRef &&
    request.paymentMethod
  ) {
    const result = await getPaymentStatus(
      request.paymentMethod as PaymentProvider,
      request.paymentRef
    );
    if (result.status !== "PENDING") {
      await prisma.serviceRequest.update({
        where: { id: request.id },
        data: {
          paymentStatus: result.status,
          ...(result.status === "SUCCESS" ? { status: "CONFIRMED" } : {})
        }
      });
      return NextResponse.json({
        ref: request.ref,
        paymentStatus: result.status,
        status: result.status === "SUCCESS" ? "CONFIRMED" : request.status
      });
    }
  }

  return NextResponse.json({
    ref: request.ref,
    paymentStatus: request.paymentStatus,
    status: request.status
  });
}
