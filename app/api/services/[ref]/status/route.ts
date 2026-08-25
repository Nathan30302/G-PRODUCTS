import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getPaymentStatus, type PaymentProvider } from "@/lib/payments";
import { describeServiceFiles } from "@/lib/service-files";
import { getCustomerSession } from "@/lib/customer-auth";
import { canViewService } from "@/lib/track-access";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ ref: string }> }
) {
  const { ref } = await params;
  const phoneLast4 =
    new URL(req.url).searchParams.get("phoneLast4")?.trim() ?? "";

  const request = await prisma.serviceRequest.findUnique({ where: { ref } });
  if (!request) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const customer = await getCustomerSession();
  if (!canViewService(request, { phoneLast4, customer })) {
    return NextResponse.json(
      {
        error:
          "Enter the last 4 digits of the phone number on this request to view status."
      },
      { status: 403 }
    );
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

  const accessQuery = phoneLast4
    ? `?ref=${encodeURIComponent(ref)}&phoneLast4=${encodeURIComponent(phoneLast4)}`
    : "";
  const files = describeServiceFiles(request.fileUrls).map((f) => ({
    ...f,
    url: `${f.url}${accessQuery}`,
    downloadUrl: `${f.downloadUrl}${f.downloadUrl.includes("?") ? "&" : "?"}ref=${encodeURIComponent(ref)}&phoneLast4=${encodeURIComponent(phoneLast4)}`
  }));

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
