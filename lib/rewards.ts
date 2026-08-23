import { prisma } from "@/lib/db";

export function newReferralCode(): string {
  return "GP-" + Math.random().toString(36).slice(2, 8).toUpperCase();
}

/** Ensure every customer has a referral code (lazy backfill). */
export async function ensureReferralCode(customerId: string): Promise<string> {
  const row = await prisma.customer.findUnique({
    where: { id: customerId },
    select: { referralCode: true }
  });
  if (row?.referralCode) return row.referralCode;
  for (let i = 0; i < 5; i++) {
    const code = newReferralCode();
    try {
      await prisma.customer.update({
        where: { id: customerId },
        data: { referralCode: code }
      });
      return code;
    } catch {
      // unique collision — retry
    }
  }
  throw new Error("Could not allocate referral code");
}

/** Award G-Rewards when an order is paid (idempotent via note marker). */
export async function awardPointsForPaidOrder(orderId: string): Promise<void> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      id: true,
      total: true,
      customerId: true,
      paymentStatus: true,
      note: true
    }
  });
  if (!order?.customerId) return;
  if (order.paymentStatus !== "SUCCESS") return;
  if (order.note?.includes("[rewards:awarded]")) return;

  const points = Math.max(0, Math.floor(order.total));
  await prisma.$transaction([
    prisma.customer.update({
      where: { id: order.customerId },
      data: { rewardPoints: { increment: points } }
    }),
    prisma.order.update({
      where: { id: order.id },
      data: {
        note: [order.note, "[rewards:awarded]"].filter(Boolean).join(" ")
      }
    })
  ]);
}

/**
 * After an order is marked paid — award spend points + first-order referral bonus.
 * Safe to call repeatedly (points award is idempotent via note marker).
 */
export async function onOrderPaymentSuccess(orderId: string): Promise<void> {
  await awardPointsForPaidOrder(orderId);
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { customerId: true }
  });
  if (order?.customerId) {
    await maybeAwardReferralBonus(order.customerId);
  }
}

/** Bonus for referrer when a referred customer places first paid order. */
export async function maybeAwardReferralBonus(customerId: string): Promise<void> {
  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
    select: { referredByCode: true }
  });
  if (!customer?.referredByCode) return;

  const firstPaid = await prisma.order.findFirst({
    where: { customerId, paymentStatus: "SUCCESS" },
    orderBy: { createdAt: "asc" },
    select: { id: true, note: true }
  });
  if (!firstPaid) return;
  if (firstPaid.note?.includes("[referral-bonus:awarded]")) return;

  const paidCount = await prisma.order.count({
    where: { customerId, paymentStatus: "SUCCESS" }
  });
  // First paid order only
  if (paidCount !== 1) return;

  const referrer = await prisma.customer.findFirst({
    where: { referralCode: customer.referredByCode }
  });
  if (!referrer) return;

  const BONUS = 50;
  await prisma.$transaction([
    prisma.customer.update({
      where: { id: referrer.id },
      data: { rewardPoints: { increment: BONUS } }
    }),
    prisma.customer.update({
      where: { id: customerId },
      data: { rewardPoints: { increment: BONUS } }
    }),
    prisma.order.update({
      where: { id: firstPaid.id },
      data: {
        note: [firstPaid.note, "[referral-bonus:awarded]"]
          .filter(Boolean)
          .join(" ")
      }
    })
  ]);
}
