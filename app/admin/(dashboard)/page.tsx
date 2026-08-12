import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatPrice, formatDateTime } from "@/lib/format";
import { getSession } from "@/lib/auth";
import { getAdminAnalytics } from "@/lib/admin-analytics";

export const dynamic = "force-dynamic";

const statusStyle: Record<string, string> = {
  PENDING: "border-brand/30 bg-brand/10 text-brand",
  PAID: "border-accent/30 bg-accent/10 text-accent",
  PREPARING: "border-sky-400/30 bg-sky-400/10 text-sky-300",
  READY: "border-violet-400/30 bg-violet-400/10 text-violet-300",
  DELIVERED: "border-white/15 bg-white/[0.04] text-white/70",
  CANCELLED: "border-red-400/30 bg-red-400/10 text-red-300"
};

function Stat({
  label,
  value,
  href,
  tone = "default"
}: {
  label: string;
  value: string | number;
  href?: string;
  tone?: "default" | "warn" | "good" | "brand";
}) {
  const tones = {
    default: "border-white/[0.06] bg-white/[0.02]",
    warn: "border-brand/25 bg-brand/[0.07]",
    good: "border-accent/25 bg-accent/[0.07]",
    brand: "border-white/[0.08] bg-gradient-to-br from-ink-850 to-ink-900"
  };
  const inner = (
    <div
      className={`rounded-2xl border p-4 transition-all hover:border-brand/30 sm:p-5 ${tones[tone]}`}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/40">
        {label}
      </p>
      <p className="mt-2 text-2xl font-black tracking-tight text-white">
        {value}
      </p>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

export default async function AdminDashboard() {
  const session = await getSession();
  const [analytics, products, orders, pending, paidAgg, recent, servicePending, stockAlerts] =
    await Promise.all([
      getAdminAnalytics(),
      prisma.product.count(),
      prisma.order.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { paymentStatus: "SUCCESS" }
      }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 6
      }),
      prisma.serviceRequest.count({
        where: { status: { in: ["NEW", "CONFIRMED"] } }
      }),
      prisma.stockNotify.count()
    ]);

  const revenue = paidAgg._sum.total ?? 0;
  const firstName = session?.name?.split(" ")[0];

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-[1.85rem] border border-white/[0.07] bg-gradient-to-br from-ink-850 via-ink-900 to-ink-950 p-6 shadow-card sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand/15 blur-[80px]" />
        <div className="pointer-events-none absolute -bottom-20 left-10 h-48 w-48 rounded-full bg-accent/10 blur-[80px]" />
        <div className="relative">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-brand">
            Provider desk
          </p>
          <h1 className="display mt-3 max-w-xl text-3xl sm:text-4xl">
            {firstName ? `Welcome back, ${firstName}` : "Welcome back"}
          </h1>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/55 sm:text-base">
            Here’s what’s moving today — clear the queue, restock fast, keep
            customers happy.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link
              href="/admin/products/new"
              className="rounded-pill bg-brand px-5 py-2.5 text-sm font-bold text-ink-950 shadow-brand-glow transition-all hover:bg-brand-soft"
            >
              + Add product
            </Link>
            <Link
              href="/admin/orders"
              className="rounded-pill border border-white/15 bg-white/[0.03] px-5 py-2.5 text-sm font-semibold text-white/80 hover:border-brand/40 hover:text-white"
            >
              Review orders
            </Link>
          </div>
        </div>
      </section>

      <section>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/35">
          Needs attention
        </p>
        <h2 className="display mt-1 text-xl">Pulse</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Stat
            label="Shop customers"
            value={analytics.customerCount}
            href="/admin/customers"
            tone="good"
          />
          <Stat
            label="Desk users"
            value={analytics.deskUserCount}
            href="/admin/staff"
          />
          <Stat
            label="Pending orders"
            value={pending}
            href="/admin/orders"
            tone="warn"
          />
          <Stat
            label="Service queue"
            value={servicePending}
            href="/admin/services"
            tone="brand"
          />
        </div>
      </section>

      <section>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/35">
          Insights
        </p>
        <h2 className="display mt-1 text-xl">What sells & who buys</h2>
        <div className="mt-4 grid gap-6 lg:grid-cols-2">
          <div className="overflow-hidden rounded-[1.35rem] border border-white/[0.07] bg-ink-900/50 shadow-card">
            <div className="border-b border-white/[0.06] px-5 py-3.5">
              <p className="text-sm font-bold text-white">Top products</p>
              <p className="text-xs text-white/40">By units ordered</p>
            </div>
            <ul className="divide-y divide-white/[0.05]">
              {analytics.topProducts.length === 0 ? (
                <li className="px-5 py-8 text-center text-sm text-white/40">
                  No sales data yet.
                </li>
              ) : (
                analytics.topProducts.map((p) => (
                  <li
                    key={p.name}
                    className="flex items-center justify-between gap-3 px-5 py-3"
                  >
                    <span className="truncate text-sm text-white/80">
                      {p.name}
                    </span>
                    <span className="shrink-0 text-sm font-semibold text-brand">
                      {p.qty} sold
                    </span>
                  </li>
                ))
              )}
            </ul>
          </div>

          <div className="overflow-hidden rounded-[1.35rem] border border-white/[0.07] bg-ink-900/50 shadow-card">
            <div className="border-b border-white/[0.06] px-5 py-3.5">
              <p className="text-sm font-bold text-white">Best customers</p>
              <p className="text-xs text-white/40">Most orders</p>
            </div>
            <ul className="divide-y divide-white/[0.05]">
              {analytics.topCustomers.length === 0 ? (
                <li className="px-5 py-8 text-center text-sm text-white/40">
                  No buyers yet.
                </li>
              ) : (
                analytics.topCustomers.slice(0, 5).map((c) => (
                  <li
                    key={`${c.phone}-${c.name}`}
                    className="flex items-center justify-between gap-3 px-5 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">
                        {c.name}
                      </p>
                      <p className="truncate text-xs text-white/40">
                        {c.location}
                      </p>
                    </div>
                    <span className="shrink-0 text-sm font-semibold text-accent">
                      {c.orders} orders
                    </span>
                  </li>
                ))
              )}
            </ul>
            <div className="border-t border-white/[0.06] px-5 py-3 text-right">
              <Link
                href="/admin/customers"
                className="text-sm font-semibold text-brand hover:underline"
              >
                All customers
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/35">
          Catalogue
        </p>
        <h2 className="display mt-1 text-xl">At a glance</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Stat label="Products" value={products} href="/admin/products" />
          <Stat label="Orders" value={orders} href="/admin/orders" />
          <Stat
            label="Stock alerts"
            value={stockAlerts}
            href="/admin/stock-notify"
          />
          <Stat label="Paid revenue" value={formatPrice(revenue)} />
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/35">
              Activity
            </p>
            <h2 className="display mt-1 text-xl">Recent orders</h2>
          </div>
          <Link
            href="/admin/orders"
            className="text-sm font-semibold text-brand hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="overflow-hidden rounded-[1.35rem] border border-white/[0.07] bg-ink-900/50 shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="bg-white/[0.02] text-[11px] uppercase tracking-[0.14em] text-white/40">
                <tr>
                  <th className="px-5 py-3.5 font-semibold">Ref</th>
                  <th className="px-5 py-3.5 font-semibold">Customer</th>
                  <th className="px-5 py-3.5 font-semibold">Placed</th>
                  <th className="px-5 py-3.5 font-semibold">Total</th>
                  <th className="px-5 py-3.5 font-semibold">Status</th>
                  <th className="px-5 py-3.5 font-semibold" />
                </tr>
              </thead>
              <tbody>
                {recent.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-12 text-center text-white/40"
                    >
                      No orders yet — your desk is ready when they arrive.
                    </td>
                  </tr>
                ) : (
                  recent.map((o) => (
                    <tr
                      key={o.id}
                      className="border-t border-white/[0.05] transition-colors hover:bg-white/[0.025]"
                    >
                      <td className="px-5 py-3.5 font-mono text-white/80">
                        {o.ref}
                      </td>
                      <td className="px-5 py-3.5 text-white/80">
                        {o.customerName}
                      </td>
                      <td className="px-5 py-3.5 text-xs text-white/45">
                        {formatDateTime(o.createdAt)}
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-white">
                        {formatPrice(o.total)}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`rounded-pill border px-2.5 py-1 text-xs font-semibold ${
                            statusStyle[o.status] ?? statusStyle.PENDING
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
      </section>
    </div>
  );
}
