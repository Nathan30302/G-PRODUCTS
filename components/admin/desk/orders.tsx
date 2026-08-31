import Link from "next/link";
import { formatPrice, formatDateTime } from "@/lib/format";
import { StatusPill } from "@/components/admin/desk/primitives";

export type DeskOrderSummary = {
  id: string;
  ref: string;
  customerName: string;
  customerPhone?: string;
  createdAt: Date;
  total: number;
  status: string;
  paymentMethod?: string;
  paymentStatus?: string;
  itemCount?: number;
};

export function DeskOrderCard({ order }: { order: DeskOrderSummary }) {
  return (
    <Link
      href={`/admin/orders/${order.id}`}
      className="block rounded-[1.25rem] border border-gp-border bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-ink-700/20 hover:shadow-card-hover"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-sm font-semibold text-gp-text">
            {order.ref}
          </p>
          <p className="mt-1 truncate text-sm font-medium text-gp-text">
            {order.customerName}
          </p>
          {order.customerPhone ? (
            <p className="truncate text-xs text-gp-text-muted">
              {order.customerPhone}
            </p>
          ) : null}
        </div>
        <StatusPill status={order.status} />
      </div>
      <div className="mt-3.5 flex items-end justify-between gap-2 border-t border-gp-border/70 pt-3">
        <div className="min-w-0">
          <p className="text-xs text-gp-text-muted">
            {formatDateTime(order.createdAt)}
          </p>
          {typeof order.itemCount === "number" ? (
            <p className="mt-0.5 text-xs text-gp-text-subtle">
              {order.itemCount} item{order.itemCount === 1 ? "" : "s"}
            </p>
          ) : null}
        </div>
        <p className="shrink-0 text-base font-black tabular-nums text-gp-text">
          {formatPrice(order.total)}
        </p>
      </div>
    </Link>
  );
}

export function DeskOrderTable({
  orders,
  compact = false
}: {
  orders: DeskOrderSummary[];
  compact?: boolean;
}) {
  if (orders.length === 0) return null;

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="bg-gp-muted/60 text-[11px] uppercase tracking-[0.14em] text-gp-text-subtle">
          <tr>
            <th className="px-4 py-3.5 font-semibold sm:px-5">Ref</th>
            <th className="px-4 py-3.5 font-semibold sm:px-5">Customer</th>
            <th className="px-4 py-3.5 font-semibold sm:px-5">Placed</th>
            {!compact ? (
              <th className="px-4 py-3.5 font-semibold sm:px-5">Items</th>
            ) : null}
            <th className="px-4 py-3.5 font-semibold sm:px-5">Total</th>
            {!compact ? (
              <th className="px-4 py-3.5 font-semibold sm:px-5">Payment</th>
            ) : null}
            <th className="px-4 py-3.5 font-semibold sm:px-5">Status</th>
            <th className="px-4 py-3.5 font-semibold sm:px-5" />
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr
              key={o.id}
              className="border-t border-gp-border/70 transition-colors hover:bg-gp-muted/40"
            >
              <td className="px-4 py-3.5 font-mono text-gp-text sm:px-5">
                {o.ref}
              </td>
              <td className="px-4 py-3.5 text-gp-text sm:px-5">
                {o.customerName}
                {o.customerPhone ? (
                  <span className="block text-xs text-gp-text-muted">
                    {o.customerPhone}
                  </span>
                ) : null}
              </td>
              <td className="px-4 py-3.5 text-xs text-gp-text-muted sm:px-5">
                {formatDateTime(o.createdAt)}
              </td>
              {!compact ? (
                <td className="px-4 py-3.5 text-gp-text-muted sm:px-5">
                  {o.itemCount ?? "—"}
                </td>
              ) : null}
              <td className="px-4 py-3.5 font-semibold tabular-nums text-gp-text sm:px-5">
                {formatPrice(o.total)}
              </td>
              {!compact ? (
                <td className="px-4 py-3.5 text-gp-text-muted sm:px-5">
                  {(o.paymentMethod ?? "—").toUpperCase()}
                  {o.paymentStatus ? (
                    <span className="block text-xs text-gp-text-subtle">
                      {o.paymentStatus}
                    </span>
                  ) : null}
                </td>
              ) : null}
              <td className="px-4 py-3.5 sm:px-5">
                <StatusPill status={o.status} />
              </td>
              <td className="px-4 py-3.5 text-right sm:px-5">
                <Link
                  href={`/admin/orders/${o.id}`}
                  className="text-sm font-semibold text-ink-700 hover:underline"
                >
                  Open
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Desktop table + mobile cards */
export function DeskOrderList({
  orders,
  compact = false
}: {
  orders: DeskOrderSummary[];
  compact?: boolean;
}) {
  return (
    <>
      <div className="hidden md:block">
        <DeskOrderTable orders={orders} compact={compact} />
      </div>
      <div className="grid gap-2.5 p-3.5 sm:gap-3 sm:p-4 md:hidden">
        {orders.map((o) => (
          <DeskOrderCard key={o.id} order={o} />
        ))}
      </div>
    </>
  );
}
