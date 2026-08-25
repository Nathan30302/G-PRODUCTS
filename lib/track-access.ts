import "server-only";
import type { CustomerSession } from "@/lib/customer-auth";
import { phoneLast4Matches, phonesMatch } from "@/lib/access-control";

type OrderLike = {
  customerId: string | null;
  customerPhone: string;
};

type ServiceLike = {
  customerPhone: string;
};

export function orderBelongsToCustomer(
  order: OrderLike,
  customer: CustomerSession
): boolean {
  if (order.customerId && order.customerId === customer.id) return true;
  return phonesMatch(order.customerPhone, customer.phone);
}

export function canViewOrder(
  order: OrderLike,
  opts: { phoneLast4?: string; customer?: CustomerSession | null }
): boolean {
  if (opts.customer && orderBelongsToCustomer(order, opts.customer)) {
    return true;
  }
  const last4 = opts.phoneLast4?.trim();
  if (!last4) return false;
  return phoneLast4Matches(order.customerPhone, last4);
}

export function canViewService(
  request: ServiceLike,
  opts: { phoneLast4?: string; customer?: CustomerSession | null }
): boolean {
  if (opts.customer && phonesMatch(request.customerPhone, opts.customer.phone)) {
    return true;
  }
  const last4 = opts.phoneLast4?.trim();
  if (!last4) return false;
  return phoneLast4Matches(request.customerPhone, last4);
}
