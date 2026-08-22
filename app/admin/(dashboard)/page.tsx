import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatPrice, formatDateTime } from "@/lib/format";
import { getSession } from "@/lib/auth";
import { getAdminAnalytics } from "@/lib/admin-analytics";
import {
  DeskHero,
  DeskSectionTitle,
  DeskStat,
  DeskStatGrid,
  DeskPanel,
  DeskPanelHeader,
  DeskEmpty,
  DeskOrderList
} from "@/components/admin/desk";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const session = await getSession();
  const [
    analytics,
    products,
    orders,
    pending,
    paidAgg,
    recent,
    servicePending,
    stockAlerts
  ] = await Promise.all([
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
      take: 6,
      include: { items: true }
    }),
    prisma.serviceRequest.count({
      where: { status: { in: ["NEW", "CONFIRMED"] } }
    }),
    prisma.stockNotify.count()
  ]);

  const revenue = paidAgg._sum.total ?? 0;
  const firstName = session?.name?.split(" ")[0];
  const maxProductRevenue = Math.max(
    1,
    ...analytics.topProducts.map((p) => p.revenue)
  );

  return (
    <div className="space-y-10">
      <DeskHero>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-brand">
              Provider desk
            </p>
            <h1 className="display mt-3 max-w-xl text-3xl sm:text-4xl">
              {firstName ? `Welcome back, ${firstName}` : "Welcome back"}
            </h1>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/55 sm:text-base">
              Clear the queue, restock fast, keep customers happy — here&apos;s
              what needs you today.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link
                href="/admin/products/new"
                className="rounded-pill bg-brand px-5 py-2.5 text-sm font-bold text-ink-950 shadow-brand-glow transition-all hover:bg-brand-soft"
              >
                + Add product
              </Link>
              <Link
                href="/admin/orders?status=PENDING"
                className="rounded-pill border border-white/15 bg-white/[0.03] px-5 py-2.5 text-sm font-semibold text-white/80 hover:border-brand/40 hover:text-white"
              >
                Review pending
              </Link>
            </div>
          </div>
          <div className="grid w-full max-w-sm grid-cols-2 gap-3">
            <div className="rounded-2xl border border-brand/25 bg-brand/[0.08] p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand/80">
                Paid revenue
              </p>
              <p className="mt-2 text-xl font-black tabular-nums text-white">
                {formatPrice(revenue)}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">
                Pending queue
              </p>
              <p className="mt-2 text-xl font-black tabular-nums text-white">
                {pending}
              </p>
            </div>
          </div>
        </div>
      </DeskHero>

      <section>
        <DeskSectionTitle eyebrow="Needs attention" title="Pulse" />
        <DeskStatGrid>
          <DeskStat
            label="Shop customers"
            value={analytics.customerCount}
            href="/admin/customers"
            tone="good"
          />
          <DeskStat
            label="Desk users"
            value={analytics.deskUserCount}
            href="/admin/staff"
          />
          <DeskStat
            label="Pending orders"
            value={pending}
            href="/admin/orders?status=PENDING"
            tone="warn"
          />
          <DeskStat
            label="Service queue"
            value={servicePending}
            href="/admin/services?status=NEW"
            tone="brand"
          />
        </DeskStatGrid>
      </section>

      <section>
        <DeskSectionTitle eyebrow="Insights" title="What sells & who buys" />
        <div className="grid gap-6 lg:grid-cols-2">
          <DeskPanel>
            <DeskPanelHeader
              title="Top products"
              subtitle="By units · revenue bar"
            />
            {analytics.topProducts.length === 0 ? (
              <DeskEmpty title="No sales data yet" />
            ) : (
              <ul className="divide-y divide-white/[0.05]">
                {analytics.topProducts.map((p) => {
                  const width = Math.round(
                    (p.revenue / maxProductRevenue) * 100
                  );
                  return (
                    <li key={p.name} className="px-5 py-3.5">
                      <div className="flex items-center justify-between gap-3">
                        <span className="truncate text-sm text-white/85">
                          {p.name}
                        </span>
                        <span className="shrink-0 text-xs font-semibold text-white/45">
                          {p.qty} sold · {formatPrice(p.revenue)}
                        </span>
                      </div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-brand to-brand-soft"
                          style={{ width: `${Math.max(width, 6)}%` }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </DeskPanel>

          <DeskPanel>
            <DeskPanelHeader
              title="Best customers"
              subtitle="Spend · last order"
              action={
                <Link
                  href="/admin/customers"
                  className="text-sm font-semibold text-brand hover:underline"
                >
                  All
                </Link>
              }
            />
            {analytics.topCustomers.length === 0 ? (
              <DeskEmpty title="No buyers yet" />
            ) : (
              <ul className="divide-y divide-white/[0.05]">
                {analytics.topCustomers.slice(0, 5).map((c) => (
                  <li
                    key={`${c.phone}-${c.name}`}
                    className="flex items-center justify-between gap-3 px-5 py-3.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">
                        {c.name}
                      </p>
                      <p className="truncate text-xs text-white/40">
                        {c.location}
                        {c.lastOrder
                          ? ` · ${formatDateTime(c.lastOrder)}`
                          : ""}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-bold tabular-nums text-brand">
                        {formatPrice(c.spent)}
                      </p>
                      <p className="text-xs text-white/40">
                        {c.orders} order{c.orders === 1 ? "" : "s"}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </DeskPanel>
        </div>
      </section>

      <section>
        <DeskSectionTitle eyebrow="Catalogue" title="At a glance" />
        <DeskStatGrid>
          <DeskStat label="Products" value={products} href="/admin/products" />
          <DeskStat label="Orders" value={orders} href="/admin/orders" />
          <DeskStat
            label="Stock alerts"
            value={stockAlerts}
            href="/admin/stock-notify"
            tone={stockAlerts > 0 ? "warn" : "default"}
          />
          <DeskStat label="Paid revenue" value={formatPrice(revenue)} tone="good" />
        </DeskStatGrid>
      </section>

      <section>
        <DeskSectionTitle
          eyebrow="Activity"
          title="Recent orders"
          action={
            <Link
              href="/admin/orders"
              className="text-sm font-semibold text-brand hover:underline"
            >
              View all
            </Link>
          }
        />
        <DeskPanel>
          {recent.length === 0 ? (
            <DeskEmpty
              title="No orders yet"
              description="Your desk is ready when they arrive."
            />
          ) : (
            <DeskOrderList
              compact
              orders={recent.map((o) => ({
                id: o.id,
                ref: o.ref,
                customerName: o.customerName,
                customerPhone: o.customerPhone,
                createdAt: o.createdAt,
                total: o.total,
                status: o.status,
                itemCount: o.items.reduce((n, i) => n + i.qty, 0)
              }))}
            />
          )}
        </DeskPanel>
      </section>
    </div>
  );
}
