/**
 * Commerce feature flags / labels.
 * Promo codes are live via lib/promo-codes.ts + checkout.
 * Loyalty remains opt-in for a later launch.
 */

/** Future loyalty programme points / tiers. */
export type LoyaltyHook = {
  enabled: boolean;
  pointsPerKwacha: number;
};

export const loyaltyHook: LoyaltyHook = {
  enabled: false,
  pointsPerKwacha: 1
};

/** Promo codes are active at checkout. */
export type PromoCodeHook = {
  enabled: true;
  fieldName: "promoCode";
};

export const promoCodeHook: PromoCodeHook = {
  enabled: true,
  fieldName: "promoCode"
};

/** Customer-facing labels for order tracking (maps Prisma OrderStatus). */
export const orderStatusLabels = {
  PENDING: { label: "Order received", hint: "Waiting for payment confirmation" },
  PAID: { label: "Paid", hint: "Payment confirmed — preparing your order" },
  PREPARING: { label: "Preparing", hint: "Packing or printing your order" },
  READY: { label: "Ready for pickup", hint: "Collect at your chosen location" },
  DELIVERED: { label: "Delivered", hint: "Order completed" },
  CANCELLED: { label: "Cancelled", hint: "This order was cancelled" }
} as const;

export type OrderStatusKey = keyof typeof orderStatusLabels;

export function labelForOrderStatus(status: string): {
  label: string;
  hint: string;
} {
  if (status in orderStatusLabels) {
    return orderStatusLabels[status as OrderStatusKey];
  }
  return { label: status, hint: "" };
}
