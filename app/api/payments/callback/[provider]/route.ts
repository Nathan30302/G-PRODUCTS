import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { onOrderPaymentSuccess } from "@/lib/rewards";
import { paymentCallbackAuthorized } from "@/lib/access-control";

/**
 * Generic payment callback/webhook receiver.
 *
 * MTN MoMo and Airtel post asynchronous notifications here once a customer
 * approves or declines a prompt. Payload shapes differ per provider, so we
 * look up the order by our own reference (externalId) or the provider's
 * transaction reference, then map the status.
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ provider: string }> }
) {
  await params;

  if (!paymentCallbackAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: Record<string, unknown> = {};
  try {
    payload = await req.json();
  } catch {
    // some providers send form-encoded; ignore body parse errors
  }

  const flat = JSON.stringify(payload).toLowerCase();

  // Try to find our order reference in common fields.
  const ref =
    (payload.externalId as string) ||
    (payload.reference as string) ||
    ((payload as { data?: { transaction?: { id?: string } } }).data?.transaction
      ?.id as string) ||
    "";

  const providerRef =
    (payload.referenceId as string) ||
    (payload.transactionId as string) ||
    "";

  const order = ref
    ? await prisma.order.findUnique({ where: { ref } })
    : providerRef
      ? await prisma.order.findFirst({ where: { paymentRef: providerRef } })
      : null;

  if (!order) {
    return NextResponse.json({ received: true, matched: false });
  }

  const isSuccess = /success|successful|"ts"|completed/.test(flat);
  const isFailed = /fail|failed|"tf"|declined|rejected|cancel/.test(flat);

  if (isSuccess) {
    await prisma.order.update({
      where: { id: order.id },
      data: { paymentStatus: "SUCCESS", status: "PAID" }
    });
    await onOrderPaymentSuccess(order.id).catch((err) =>
      console.warn("[payments/callback] rewards:", err)
    );
  } else if (isFailed) {
    await prisma.order.update({
      where: { id: order.id },
      data: { paymentStatus: "FAILED" }
    });
  }

  return NextResponse.json({ received: true, matched: true });
}
