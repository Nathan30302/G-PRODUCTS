import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatPrice, formatDateTime } from "@/lib/format";

export const dynamic = "force-dynamic";
export const metadata = { title: "Orders" };

const statusStyle: Record<string, string> = {
  PENDING: "border-white/15 text-white/65",
  PAID: "border-accent/30 bg-accent/10 text-accent",
  PREPARING: "border-brand/30 bg-brand/10 text-brand",
  READY: "border-brand/30 bg-brand/10 text-brand",
  DELIVERED: "border-accent/30 bg-accent/10 text-accent",
  CANCELLED: "border-red-400/30 bg-red-500/10 text-red-300"
};

export default async function AdminOrders() {
  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand/80">
          Sales desk
        </p>
        <h1 className="mt-1 text-3xl font-black tracking-tight text-white">
          Orders
        </h1>
        <p className="mt-2 text-sm text-white/50">
          {orders.length} order{orders.length === 1 ? "" : "s"} · update status
          as you prepare and deliver
        </p>
      </div>

      <div className="overflow-hidden rounded-[1.35rem] border border-white/[0.07] bg-ink-900/50 shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-white/[0.02] text-[11px] uppercase tracking-[0.14em] text-white/40">
              <tr>
                <th className="px-5 py-3.5 font-semibold">Ref</th>
                <th className="px-5 py-3.5 font-semibold">Customer</th>
                <th className="px-5 py-3.5 font-semibold">Placed</th>
                <th className="px-5 py-3.5 font-semibold">Items</th>
                <th className="px-5 py-3.5 font-semibold">Total</th>
                <th className="px-5 py-3.5 font-semibold">Payment</th>
                <th className="px-5 py-3.5 font-semibold">Status</th>
                <th className="px-5 py-3.5 font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-12 text-center text-white/40"
                  >
                    No orders yet — they&apos;ll appear here instantly.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr
                    key={o.id}
                    className="border-t border-white/[0.05] transition-colors hover:bg-white/[0.02]"
                  >
                    <td className="px-5 py-3.5 font-mono text-white/80">
                      {o.ref}
                    </td>
                    <td className="px-5 py-3.5 text-white/80">
                      {o.customerName}
                      <span className="block text-xs text-white/40">
                        {o.customerPhone}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-white/45">
                      {formatDateTime(o.createdAt)}
                    </td>
                    <td className="px-5 py-3.5 text-white/60">
                      {o.items.reduce((n, i) => n + i.qty, 0)}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-white">
                      {formatPrice(o.total)}
                    </td>
                    <td className="px-5 py-3.5 text-white/60">
                      {o.paymentMethod.toUpperCase()}
                      <span className="block text-xs text-white/40">
                        {o.paymentStatus}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`rounded-pill border px-2.5 py-1 text-xs font-semibold ${
                          statusStyle[o.status] ??
                          "border-white/15 text-white/65"
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link
                        href={`/admin/orders/${o.id}`}
                        className="text-sm font-semibold text-brand hover:underline"
                      >
                        Open
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
