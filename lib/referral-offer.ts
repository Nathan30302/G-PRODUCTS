import { prisma } from "@/lib/db";
import { REFERRAL_MIN_ZMW, REFERRAL_PERCENT } from "@/lib/referral-terms";

export { REFERRAL_MIN_ZMW, REFERRAL_PERCENT };

const USED = "[referrer-20:used]";
const RESTORED = "[referrer-20:restored]";
const UNLOCKED = "[referrer-unlocked]";

export type ReferralQuote = {
  discount: number;
  note: string | null;
  consumePending: boolean;
};

export async function quoteReferralDiscount(
  customerId: string | null,
  subtotal: number
): Promise<ReferralQuote> {
  const none: ReferralQuote = {
    discount: 0,
    note: null,
    consumePending: false
  };
  if (!customerId || subtotal <= 0) return none;

  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
    select: { referredByCode: true, pendingDiscountPercent: true }
  });
  if (!customer) return none;

  if (customer.pendingDiscountPercent >= REFERRAL_PERCENT) {
    const discount = Math.round(
      (subtotal * customer.pendingDiscountPercent) / 100
    );
    return {
      discount,
      note: `Referral reward: ${customer.pendingDiscountPercent}% off this order ${USED}`,
      consumePending: true
    };
  }

  if (!customer.referredByCode || subtotal < REFERRAL_MIN_ZMW) return none;

  const earlier = await prisma.order.count({
    where: { customerId, status: { not: "CANCELLED" } }
  });
  if (earlier > 0) return none;

  return {
    discount: Math.round((subtotal * REFERRAL_PERCENT) / 100),
    note: `Referral: ${REFERRAL_PERCENT}% off first order of K${REFERRAL_MIN_ZMW}+ [friend-20:applied]`,
    consumePending: false
  };
}

export async function consumeReferrerDiscount(customerId: string) {
  await prisma.customer.update({
    where: { id: customerId },
    data: { pendingDiscountPercent: 0 }
  });
}

/** After a referred friend's first K800+ order is delivered, the referrer earns 20% off next. */
export async function unlockReferrerDiscount(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: { select: { price: true, qty: true } },
      customer: { select: { id: true, referredByCode: true } }
    }
  });
  if (!order || order.status !== "DELIVERED") return;
  if (!order.customer?.referredByCode) return;
  if (order.note?.includes(UNLOCKED)) return;

  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.qty, 0);
  if (subtotal < REFERRAL_MIN_ZMW) return;

  const earlier = await prisma.order.count({
    where: {
      customerId: order.customer.id,
      status: "DELIVERED",
      id: { not: order.id }
    }
  });
  if (earlier > 0) return;

  const referrer = await prisma.customer.findFirst({
    where: { referralCode: order.customer.referredByCode },
    select: { id: true }
  });
  if (!referrer || referrer.id === order.customer.id) return;

  await prisma.$transaction([
    prisma.customer.update({
      where: { id: referrer.id },
      data: { pendingDiscountPercent: REFERRAL_PERCENT }
    }),
    prisma.order.update({
      where: { id: order.id },
      data: {
        note: [order.note, UNLOCKED].filter(Boolean).join(" ")
      }
    })
  ]);
}

export async function restoreReferrerDiscountIfCancelled(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { note: true, customerId: true, status: true }
  });
  if (!order?.customerId || order.status !== "CANCELLED") return;
  if (!order.note?.includes(USED) || order.note.includes(RESTORED)) return;

  await prisma.$transaction([
    prisma.customer.update({
      where: { id: order.customerId },
      data: { pendingDiscountPercent: REFERRAL_PERCENT }
    }),
    prisma.order.update({
      where: { id: orderId },
      data: { note: `${order.note} ${RESTORED}` }
    })
  ]);
}
