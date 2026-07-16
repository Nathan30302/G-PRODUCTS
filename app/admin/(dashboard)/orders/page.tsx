import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";
export const metadata = { title: "Orders" };

const statusColor: Record<string, string> = {
  PENDING: "text-white/60",
  PAID: "text-accent",
  PREPARING: "text-brand",
  READY: "text-brand",
  DELIVERED: "text-accent",
  CANCELLED: "text-red-400"
};

export default async function AdminOrders() {
  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div>
      <h1 className="text-2xl font-black text-white">Orders</h1>
      <p className="mt-1 text-sm text-white/50">
        {orders.length} order{orders.length === 1 ? "" : "s"}
      </p>

      <div className="mt-6 overflow-hidden rounded-card border border-ink-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-ink-900 text-white/50">
            <tr>
              <th className="px-4 py-3 font-medium">Ref</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Items</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Payment</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-white/40">
                  No orders yet.
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id} className="border-t border-ink-800 bg-ink-850">
                  <td className="px-4 py-3 font-mono text-white/80">{o.ref}</td>
                  <td className="px-4 py-3 text-white/80">
                    {o.customerName}
                    <span className="block text-xs text-white/40">
                      {o.customerPhone}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-white/60">
                    {o.items.reduce((n, i) => n + i.qty, 0)}
                  </td>
                  <td className="px-4 py-3 text-white">
                    {formatPrice(o.total)}
                  </td>
                  <td className="px-4 py-3 text-white/60">
                    {o.paymentMethod.toUpperCase()}
                    <span className="block text-xs text-white/40">
                      {o.paymentStatus}
                    </span>
                  </td>
                  <td
                    className={`px-4 py-3 font-semibold ${
                      statusColor[o.status] ?? "text-white/60"
                    }`}
                  >
                    {o.status}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="text-sm font-semibold text-brand hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
