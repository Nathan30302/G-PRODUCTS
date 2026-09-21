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

/** Customer-facing labels for service jobs (maps Prisma service status). */
export const serviceStatusLabels = {
  NEW: { label: "Received", hint: "Just received — review details and files" },
  CONFIRMED: { label: "Confirmed", hint: "Paid or confirmed — start the job" },
  IN_PROGRESS: { label: "In progress", hint: "Working on it" },
  READY: { label: "Ready", hint: "Ready for pickup or delivery" },
  DELIVERED: { label: "Done", hint: "Collected or delivered" },
  CANCELLED: { label: "Cancelled", hint: "This job was cancelled" }
} as const;

export type ServiceStatusKey = keyof typeof serviceStatusLabels;

export function labelForServiceStatus(status: string): {
  label: string;
  hint: string;
} {
  if (status in serviceStatusLabels) {
    return serviceStatusLabels[status as ServiceStatusKey];
  }
  return { label: status, hint: "" };
}

export function labelForOrderStatus(status: string): {
  label: string;
  hint: string;
} {
  if (status in orderStatusLabels) {
    return orderStatusLabels[status as OrderStatusKey];
  }
  return { label: status, hint: "" };
}
