/**
 * Light architecture hooks for future commerce features.
 * Not wired into checkout yet — safe placeholders for loyalty,
 * discount codes, and customer-facing order status labels.
 */

/** Future loyalty programme points / tiers (not active). */
export type LoyaltyHook = {
  enabled: false;
  /** Points per ZMW spent once launched */
  pointsPerKwacha: number;
};

export const loyaltyHook: LoyaltyHook = {
  enabled: false,
  pointsPerKwacha: 1
};

/** Future discount / promo code validation (not active). */
export type PromoCodeHook = {
  enabled: false;
  /** Reserved code field name for checkout forms */
  fieldName: "promoCode";
};

export const promoCodeHook: PromoCodeHook = {
  enabled: false,
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
