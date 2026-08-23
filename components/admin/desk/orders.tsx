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
      className="block rounded-[1.25rem] border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-white/[0.015] p-4 transition-all duration-300 ease-out-expo hover:-translate-y-0.5 hover:border-brand/35 hover:shadow-[0_16px_40px_-24px_rgba(0,0,0,0.55)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-sm font-semibold text-white/90">
            {order.ref}
          </p>
          <p className="mt-1 truncate text-sm font-medium text-white/80">
            {order.customerName}
          </p>
          {order.customerPhone ? (
            <p className="truncate text-xs text-white/40">{order.customerPhone}</p>
          ) : null}
        </div>
        <StatusPill status={order.status} />
      </div>
      <div className="mt-3.5 flex items-end justify-between gap-2 border-t border-white/[0.06] pt-3">
        <div className="min-w-0">
          <p className="text-xs text-white/40">
            {formatDateTime(order.createdAt)}
          </p>
          {typeof order.itemCount === "number" ? (
            <p className="mt-0.5 text-xs text-white/45">
              {order.itemCount} item{order.itemCount === 1 ? "" : "s"}
            </p>
          ) : null}
        </div>
        <p className="shrink-0 text-base font-black tabular-nums text-white">
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
        <thead className="bg-white/[0.02] text-[11px] uppercase tracking-[0.14em] text-white/40">
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
              className="border-t border-white/[0.05] transition-colors hover:bg-white/[0.03]"
            >
              <td className="px-4 py-3.5 font-mono text-white/85 sm:px-5">
                {o.ref}
              </td>
              <td className="px-4 py-3.5 text-white/80 sm:px-5">
                {o.customerName}
                {o.customerPhone ? (
                  <span className="block text-xs text-white/40">
                    {o.customerPhone}
                  </span>
                ) : null}
              </td>
              <td className="px-4 py-3.5 text-xs text-white/45 sm:px-5">
                {formatDateTime(o.createdAt)}
              </td>
              {!compact ? (
                <td className="px-4 py-3.5 text-white/60 sm:px-5">
                  {o.itemCount ?? "—"}
                </td>
              ) : null}
              <td className="px-4 py-3.5 font-semibold tabular-nums text-white sm:px-5">
                {formatPrice(o.total)}
              </td>
              {!compact ? (
                <td className="px-4 py-3.5 text-white/60 sm:px-5">
                  {(o.paymentMethod ?? "—").toUpperCase()}
                  {o.paymentStatus ? (
                    <span className="block text-xs text-white/40">
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
                  className="text-sm font-semibold text-brand hover:underline"
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
