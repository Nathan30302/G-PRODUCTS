import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

function StatCard({
  label,
  value,
  href
}: {
  label: string;
  value: string | number;
  href?: string;
}) {
  const inner = (
    <div className="rounded-card border border-ink-800 bg-ink-850 p-5">
      <p className="text-sm text-white/50">{label}</p>
      <p className="mt-2 text-2xl font-black text-white">{value}</p>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

export default async function AdminDashboard() {
  const [products, categories, orders, pending, paidAgg, recent] =
    await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.order.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { paymentStatus: "SUCCESS" }
      }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 6
      })
    ]);

  const revenue = paidAgg._sum.total ?? 0;

  return (
    <div>
      <h1 className="text-2xl font-black text-white">Dashboard</h1>
      <p className="mt-1 text-sm text-white/50">
        Overview of your shop.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Products" value={products} href="/admin/products" />
        <StatCard label="Categories" value={categories} />
        <StatCard label="Orders" value={orders} href="/admin/orders" />
        <StatCard label="Pending orders" value={pending} href="/admin/orders" />
      </div>

      <div className="mt-4">
        <StatCard label="Paid revenue" value={formatPrice(revenue)} />
      </div>

      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Recent orders</h2>
          <Link href="/admin/orders" className="text-sm text-brand">
            View all
          </Link>
        </div>
        <div className="overflow-hidden rounded-card border border-ink-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-ink-900 text-white/50">
              <tr>
                <th className="px-4 py-3 font-medium">Ref</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-white/40">
                    No orders yet.
                  </td>
                </tr>
              ) : (
                recent.map((o) => (
                  <tr key={o.id} className="border-t border-ink-800 bg-ink-850">
                    <td className="px-4 py-3 font-mono text-white/80">
                      {o.ref}
                    </td>
                    <td className="px-4 py-3 text-white/80">{o.customerName}</td>
                    <td className="px-4 py-3 text-white">
                      {formatPrice(o.total)}
                    </td>
                    <td className="px-4 py-3 text-white/60">{o.status}</td>
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
