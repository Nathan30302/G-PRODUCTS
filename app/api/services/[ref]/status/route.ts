import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getPaymentStatus, type PaymentProvider } from "@/lib/payments";
import { describeServiceFiles } from "@/lib/service-files";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ ref: string }> }
) {
  const { ref } = await params;
  const request = await prisma.serviceRequest.findUnique({ where: { ref } });
  if (!request) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let status = request.status;
  let paymentStatus = request.paymentStatus;

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
      status = result.status === "SUCCESS" ? "CONFIRMED" : request.status;
      paymentStatus = result.status;
      await prisma.serviceRequest.update({
        where: { id: request.id },
        data: {
          paymentStatus: result.status,
          ...(result.status === "SUCCESS" ? { status: "CONFIRMED" } : {})
        }
      });
    }
  }

  let details: Record<string, unknown> = {};
  try {
    details = JSON.parse(request.details);
  } catch {
    details = {};
  }

  const files = describeServiceFiles(request.fileUrls);

  return NextResponse.json({
    ref: request.ref,
    serviceType: request.serviceType,
    paymentStatus,
    status,
    amount: request.amount,
    deliveryMethod: request.deliveryMethod,
    address: request.address,
    customerName: request.customerName,
    createdAt: request.createdAt,
    details,
    files: files.map((f) => ({
      filename: f.filename,
      kind: f.kind,
      url: f.url,
      downloadUrl: f.downloadUrl
    }))
  });
}
