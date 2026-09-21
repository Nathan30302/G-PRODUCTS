import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatPrice, formatDateTime } from "@/lib/format";
import { requireUser } from "@/lib/auth";
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
  // Guard here too: this page renders in parallel with the layout, so relying
  // on the layout's redirect alone still streamed desk data to signed-out users.
  const session = await requireUser();
  const [
    analytics,
    products,
    orders,
    pending,
    paidAgg,
    recent,
    servicePending,
    stockAlerts,
    lowStock,
    lowStockCount,
    recentReviews
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
    prisma.stockNotify.count(),
    prisma.product.findMany({
      where: {
        OR: [
          { stock: { in: ["low_stock", "sold_out"] } },
          { variants: { some: { quantity: { lte: 5 } } } }
        ]
      },
      orderBy: { name: "asc" },
      take: 6,
      select: {
        id: true,
        name: true,
        stock: true,
        category: { select: { name: true } },
        variants: { select: { quantity: true } }
      }
    }),
    prisma.product.count({
      where: {
        OR: [
          { stock: { in: ["low_stock", "sold_out"] } },
          { variants: { some: { quantity: { lte: 5 } } } }
        ]
      }
    }),
    prisma.productReview.findMany({
      orderBy: { createdAt: "desc" },
      take: 4,
      select: {
        id: true,
        productName: true,
        authorName: true,
        rating: true,
        published: true,
        createdAt: true
      }
    })
  ]);

  const revenue = paidAgg._sum.total ?? 0;
  const firstName = session?.name?.split(" ")[0];
  const hour = new Date().getHours();
  const hello =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const maxProductRevenue = Math.max(
    1,
    ...analytics.topProducts.map((p) => p.revenue)
  );

  return (
    <div className="space-y-8 sm:space-y-10">
      <DeskHero>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-ink-700">
              Provider desk
            </p>
            <h1 className="display mt-2.5 max-w-xl text-[1.85rem] leading-[1.1] sm:mt-3 sm:text-4xl">
              {firstName ? `${hello}, ${firstName}` : hello}
            </h1>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-gp-text-muted sm:text-base">
              Here&apos;s what&apos;s happening with your shop today.
            </p>
            <div className="mt-5 flex flex-wrap gap-2 sm:mt-6">
              <Link
                href="/admin/products/new"
                className="inline-flex min-h-11 items-center justify-center rounded-pill bg-brand px-5 py-2.5 text-sm font-bold text-ink-950 shadow-brand-glow transition-all hover:-translate-y-0.5 hover:bg-brand-soft active:translate-y-0"
              >
                + Add product
              </Link>
              <Link
                href="/admin/orders?status=PENDING"
                className="inline-flex min-h-11 items-center justify-center rounded-pill border border-gp-border bg-gp-surface px-5 py-2.5 text-sm font-semibold text-gp-text hover:border-ink-700/25 hover:bg-gp-muted"
              >
                Orders waiting
              </Link>
            </div>
          </div>
        </div>
      </DeskHero>

      <DeskStatGrid>
        <DeskStat
          label="Sales"
          value={formatPrice(revenue)}
          hint="Paid orders"
          tone="good"
        />
        <DeskStat
          label="Orders"
          value={orders}
          href="/admin/orders"
          hint={pending > 0 ? `${pending} waiting` : "None waiting"}
        />
        <DeskStat
          label="Products"
          value={products}
          href="/admin/products"
        />
        <DeskStat
          label="Low stock"
          value={lowStockCount}
          href="/admin/products?stock=attention"
          tone={lowStockCount > 0 ? "warn" : "default"}
          hint={lowStockCount > 0 ? "Needs a restock" : "Catalogue looks healthy"}
        />
      </DeskStatGrid>

      <section>
        <DeskSectionTitle
          eyebrow="Today"
          title="Recent orders"
          action={
            <Link
              href="/admin/orders"
              className="text-sm font-semibold text-accent-ink hover:underline"
            >
              View all
            </Link>
          }
        />
        <DeskPanel>
          {recent.length === 0 ? (
            <DeskEmpty
              title="No orders yet"
              description="Orders will appear here when customers make purchases."
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

      <section className="grid gap-6 lg:grid-cols-2">
        <DeskPanel>
          <DeskPanelHeader
            title="Low stock"
            subtitle="In stock means more than 5 units"
            action={
              <Link
                href="/admin/products?stock=attention"
                className="text-sm font-semibold text-accent-ink hover:underline"
              >
                Catalogue
              </Link>
            }
          />
          {lowStock.length === 0 ? (
            <DeskEmpty
              title="Nothing low"
              description="Every product has a healthy quantity."
            />
          ) : (
            <ul className="divide-y divide-gp-border/60">
              {lowStock.map((p) => {
                const units = p.variants.reduce((n, v) => n + v.quantity, 0);
                const state =
                  units <= 0 || p.stock === "sold_out"
                    ? "Out of stock"
                    : "Low stock";
                return (
                  <li key={p.id}>
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="flex items-center justify-between gap-3 px-5 py-3.5 hover:bg-gp-muted/40"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-gp-text">
                          {p.name}
                        </span>
                        <span className="block text-xs text-gp-text-subtle">
                          {p.category.name}
                        </span>
                      </span>
                      <span className="shrink-0 text-right">
                        <span className="block text-xs font-bold text-ink-850">
                          {state}
                        </span>
                        <span className="block text-xs tabular-nums text-gp-text-muted">
                          {units} unit{units === 1 ? "" : "s"}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </DeskPanel>

        <div className="space-y-6">
          <DeskPanel>
            <DeskPanelHeader title="Needs you" subtitle="Queues still open" />
            <ul className="divide-y divide-gp-border/60">
              <li>
                <Link
                  href="/admin/orders?status=PENDING"
                  className="flex items-center justify-between gap-3 px-5 py-3.5 hover:bg-gp-muted/40"
                >
                  <span className="text-sm font-semibold text-gp-text">
                    Orders waiting
                  </span>
                  <span className="text-sm font-black tabular-nums text-gp-text">
                    {pending}
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/services?status=NEW"
                  className="flex items-center justify-between gap-3 px-5 py-3.5 hover:bg-gp-muted/40"
                >
                  <span className="text-sm font-semibold text-gp-text">
                    Service queue
                  </span>
                  <span className="text-sm font-black tabular-nums text-gp-text">
                    {servicePending}
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/stock-notify"
                  className="flex items-center justify-between gap-3 px-5 py-3.5 hover:bg-gp-muted/40"
                >
                  <span className="text-sm font-semibold text-gp-text">
                    Customers waiting on stock
                  </span>
                  <span className="text-sm font-black tabular-nums text-gp-text">
                    {stockAlerts}
                  </span>
                </Link>
              </li>
            </ul>
          </DeskPanel>

          <DeskPanel>
            <DeskPanelHeader
              title="Recent reviews"
              action={
                <Link
                  href="/admin/reviews"
                  className="text-sm font-semibold text-accent-ink hover:underline"
                >
                  Moderate
                </Link>
              }
            />
            {recentReviews.length === 0 ? (
              <DeskEmpty title="No reviews yet" />
            ) : (
              <ul className="divide-y divide-gp-border/60">
                {recentReviews.map((r) => (
                  <li key={r.id} className="px-5 py-3.5">
                    <p className="text-sm font-semibold text-gp-text">
                      {r.productName}
                    </p>
                    <p className="mt-0.5 text-xs text-gp-text-muted">
                      {r.authorName} · {r.rating}/5 ·{" "}
                      {r.published ? "On the shop" : "Hidden"}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </DeskPanel>
        </div>
      </section>

      <section>
        <DeskSectionTitle eyebrow="Activity" title="What sells & who buys" />
        <div className="grid gap-6 lg:grid-cols-2">
          <DeskPanel>
            <DeskPanelHeader
              title="Top products"
              subtitle="By units · revenue bar"
            />
            {analytics.topProducts.length === 0 ? (
              <DeskEmpty title="No sales data yet" />
            ) : (
              <ul className="divide-y divide-gp-border/60">
                {analytics.topProducts.map((p) => {
                  const width = Math.round(
                    (p.revenue / maxProductRevenue) * 100
                  );
                  const row = (
                    <>
                      <div className="flex items-center justify-between gap-3">
                        <span className="truncate text-sm text-gp-text group-hover:text-accent-ink">
                          {p.name}
                        </span>
                        <span className="shrink-0 text-xs font-semibold text-gp-text-subtle">
                          {p.qty} sold · {formatPrice(p.revenue)}
                        </span>
                      </div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gp-muted/50">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-brand to-brand-soft"
                          style={{ width: `${Math.max(width, 6)}%` }}
                        />
                      </div>
                    </>
                  );
                  return (
                    <li key={p.name} className="px-5 py-3.5">
                      {p.id ? (
                        <Link
                          href={`/admin/products/${p.id}`}
                          className="group block rounded-xl transition-colors hover:bg-gp-muted/50"
                        >
                          {row}
                        </Link>
                      ) : (
                        row
                      )}
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
                  className="text-sm font-semibold text-accent-ink hover:underline"
                >
                  All
                </Link>
              }
            />
            {analytics.topCustomers.length === 0 ? (
              <DeskEmpty title="No buyers yet" />
            ) : (
              <ul className="divide-y divide-gp-border/60">
                {analytics.topCustomers.slice(0, 5).map((c) => (
                  <li
                    key={`${c.phone}-${c.name}`}
                    className="flex items-center justify-between gap-3 px-5 py-3.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gp-text">
                        {c.name}
                      </p>
                      <p className="truncate text-xs text-gp-text-subtle">
                        {c.location}
                        {c.lastOrder
                          ? ` · ${formatDateTime(c.lastOrder)}`
                          : ""}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-bold tabular-nums text-accent-ink">
                        {formatPrice(c.spent)}
                      </p>
                      <p className="text-xs text-gp-text-subtle">
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
    </div>
  );
}
