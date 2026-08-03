import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

const sections = [
  {
    href: "/admin/products",
    title: "Products",
    body: "Catalogue, colours, quantities and pricing.",
    tone: "from-brand/20 to-transparent"
  },
  {
    href: "/admin/orders",
    title: "Orders",
    body: "Track payments and prepare deliveries.",
    tone: "from-accent/15 to-transparent"
  },
  {
    href: "/admin/services",
    title: "Service orders",
    body: "Printing, key cutting and G-Loans.",
    tone: "from-white/[0.06] to-transparent"
  },
  {
    href: "/admin/stock-notify",
    title: "Stock alerts",
    body: "Customers waiting for sold-out items.",
    tone: "from-brand/10 to-transparent"
  },
  {
    href: "/admin/service-pages",
    title: "Service pages",
    body: "Photos, copy and service pricing.",
    tone: "from-accent/10 to-transparent"
  },
  {
    href: "/admin/staff",
    title: "Staff",
    body: "Invite your team to help run the desk.",
    tone: "from-white/[0.05] to-transparent",
    ownerOnly: true
  }
] as const;

function Stat({
  label,
  value,
  href
}: {
  label: string;
  value: string | number;
  href?: string;
}) {
  const inner = (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 backdrop-blur transition-all hover:border-brand/25 hover:bg-white/[0.04] sm:p-5">
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
  const [
    products,
    orders,
    pending,
    paidAgg,
    recent,
    servicePending,
    stockAlerts
  ] = await Promise.all([
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
  const menu = sections.filter(
    (s) => !("ownerOnly" in s && s.ownerOnly) || session?.role === "OWNER"
  );

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-[1.75rem] border border-white/[0.07] bg-gradient-to-br from-ink-850 via-ink-900 to-ink-950 p-6 shadow-card sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand/15 blur-[80px]" />
        <div className="pointer-events-none absolute -bottom-20 left-10 h-48 w-48 rounded-full bg-accent/10 blur-[80px]" />
        <div className="relative">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-brand">
            Provider console
          </p>
          <h1 className="mt-3 max-w-xl text-3xl font-black tracking-tight text-white sm:text-4xl">
            Command centre
          </h1>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/55 sm:text-base">
            Welcome back
            {session?.name ? `, ${session.name.split(" ")[0]}` : ""}. Run
            products, orders and services from one polished desk.
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
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/35">
              Navigate
            </p>
            <h2 className="mt-1 text-xl font-black text-white">
              Open a workspace
            </h2>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {menu.map((s, idx) => (
            <Link
              key={s.href}
              href={s.href}
              className={`group relative overflow-hidden rounded-[1.35rem] border border-white/[0.07] bg-gradient-to-br ${s.tone} from-ink-850 to-ink-900 p-5 transition-all duration-300 ease-out-expo hover:-translate-y-1 hover:border-brand/35 hover:shadow-card-hover sm:p-6`}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-xs font-black text-brand">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span className="text-brand opacity-0 transition-opacity group-hover:opacity-100">
                  →
                </span>
              </div>
              <p className="mt-4 text-lg font-bold text-white group-hover:text-brand">
                {s.title}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-white/50">
                {s.body}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/35">
          Pulse
        </p>
        <h2 className="mt-1 text-xl font-black text-white">At a glance</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-3">
          <Stat label="Products" value={products} href="/admin/products" />
          <Stat label="Orders" value={orders} href="/admin/orders" />
          <Stat label="Pending" value={pending} href="/admin/orders" />
          <Stat
            label="Service queue"
            value={servicePending}
            href="/admin/services"
          />
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
            <h2 className="mt-1 text-xl font-black text-white">
              Recent orders
            </h2>
          </div>
          <Link
            href="/admin/orders"
            className="text-sm font-semibold text-brand hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="overflow-hidden rounded-[1.35rem] border border-white/[0.07] bg-ink-900/40 shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="bg-white/[0.02] text-[11px] uppercase tracking-[0.14em] text-white/40">
                <tr>
                  <th className="px-5 py-3.5 font-semibold">Ref</th>
                  <th className="px-5 py-3.5 font-semibold">Customer</th>
                  <th className="px-5 py-3.5 font-semibold">Total</th>
                  <th className="px-5 py-3.5 font-semibold">Status</th>
                  <th className="px-5 py-3.5 font-semibold"></th>
                </tr>
              </thead>
              <tbody>
                {recent.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-10 text-center text-white/40"
                    >
                      No orders yet — your desk is ready when they arrive.
                    </td>
                  </tr>
                ) : (
                  recent.map((o) => (
                    <tr
                      key={o.id}
                      className="border-t border-white/[0.05] transition-colors hover:bg-white/[0.02]"
                    >
                      <td className="px-5 py-3.5 font-mono text-white/80">
                        {o.ref}
                      </td>
                      <td className="px-5 py-3.5 text-white/80">
                        {o.customerName}
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-white">
                        {formatPrice(o.total)}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="rounded-pill border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-white/65">
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
