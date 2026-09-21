import Link from "next/link";
import { getAdminAnalytics } from "@/lib/admin-analytics";
import { formatDate, formatDateTime, formatPrice } from "@/lib/format";
import {
  DeskPageHeader,
  DeskStat,
  DeskStatGrid,
  DeskPanel,
  DeskPanelHeader,
  DeskSectionTitle,
  DeskEmpty
} from "@/components/admin/desk";
import { customerWhatsAppLink } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";
export const metadata = { title: "Customers" };

export default async function AdminCustomersPage() {
  const data = await getAdminAnalytics();

  return (
    <div className="space-y-10">
      <DeskPageHeader
        eyebrow="Shop users"
        title="Customers"
        description={
          <>
            {data.customerCount} registered shop account
            {data.customerCount === 1 ? "" : "s"} · {data.registeredWithOrders}{" "}
            with orders · {data.deskUserCount} desk login
            {data.deskUserCount === 1 ? "" : "s"}. Shop accounts are separate
            from provider desk logins.
          </>
        }
      />

      <DeskStatGrid>
        <DeskStat
          label="Registered"
          value={data.customerCount}
          tone="good"
        />
        <DeskStat label="With orders" value={data.registeredWithOrders} />
        <DeskStat label="Top buyers" value={data.topCustomers.length} />
        <DeskStat
          label="Desk users"
          value={data.deskUserCount}
          href="/admin/staff"
        />
      </DeskStatGrid>

      <section>
        <DeskSectionTitle
          eyebrow="Leaderboard"
          title="Top buyers"
          action={
            <p className="text-xs text-gp-text-subtle">
              Includes guest checkouts by phone
            </p>
          }
        />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {data.topCustomers.length === 0 ? (
            <DeskPanel className="sm:col-span-2 xl:col-span-4">
              <DeskEmpty title="No orders yet" description="Top buyers will appear here." />
            </DeskPanel>
          ) : (
            data.topCustomers.map((c, idx) => (
              <div
                key={`${c.phone}-${c.name}`}
                className="rounded-[1.35rem] border border-gp-border/70 bg-gp-surface p-5 shadow-card transition-all hover:border-brand/30"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-brand/15 text-xs font-black text-accent-ink">
                    {idx + 1}
                  </span>
                  <span className="text-sm font-bold tabular-nums text-accent-ink">
                    {formatPrice(c.spent)}
                  </span>
                </div>
                <p className="mt-3 truncate text-base font-bold text-gp-text">
                  {c.name}
                </p>
                <p className="truncate text-xs text-gp-text-subtle">{c.phone}</p>
                <a
                  href={customerWhatsAppLink(
                    c.phone,
                    `Hello ${c.name}, this is G-Products. Thanks for shopping with us — how can we help?`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex min-h-9 items-center rounded-pill bg-[#25D366] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#1ebe5d]"
                >
                  WhatsApp
                </a>
                <p className="mt-2 line-clamp-2 text-xs text-gp-text-muted">
                  {c.location}
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-gp-border/70 pt-3 text-xs text-gp-text-subtle">
                  <span>
                    {c.orders} order{c.orders === 1 ? "" : "s"}
                  </span>
                  <span>
                    {c.lastOrder ? formatDateTime(c.lastOrder) : "—"}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section>
        <DeskSectionTitle eyebrow="Accounts" title="Registered accounts" />
        <DeskPanel>
          {data.customers.length === 0 ? (
            <DeskEmpty title="No customer accounts yet" />
          ) : (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead className="bg-gp-muted/50 text-[11px] uppercase tracking-[0.14em] text-gp-text-subtle">
                    <tr>
                      <th className="px-5 py-3.5 font-semibold">Name</th>
                      <th className="px-5 py-3.5 font-semibold">Contact</th>
                      <th className="px-5 py-3.5 font-semibold">Saved location</th>
                      <th className="px-5 py-3.5 font-semibold">Orders</th>
                      <th className="px-5 py-3.5 font-semibold">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.customers.map((c) => (
                      <tr
                        key={c.id}
                        className="border-t border-gp-border/70 hover:bg-gp-muted/50"
                      >
                        <td className="px-5 py-3.5 font-semibold text-gp-text">
                          {c.name}
                        </td>
                        <td className="px-5 py-3.5 text-gp-text-muted">
                          <a
                            href={customerWhatsAppLink(
                              c.phone,
                              `Hello ${c.name}, this is G-Products. How can we help?`
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-ink-850 underline-offset-2 hover:underline"
                          >
                            {c.phone}
                          </a>
                          <span className="block text-xs text-gp-text-subtle">
                            {c.email}
                          </span>
                        </td>
                        <td className="max-w-[220px] px-5 py-3.5 text-gp-text-muted">
                          {c.locationLabel ? (
                            <span className="block text-xs font-semibold text-accent-ink/80">
                              {c.locationLabel}
                            </span>
                          ) : null}
                          {c.defaultLocation ?? "—"}
                        </td>
                        <td className="px-5 py-3.5 text-gp-text">
                          {c.totalOrders}
                        </td>
                        <td className="px-5 py-3.5 text-gp-text-muted">
                          {formatDate(c.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="grid gap-3 p-4 md:hidden">
                {data.customers.map((c) => (
                  <div
                    key={c.id}
                    className="rounded-2xl border border-gp-border/70 bg-gp-muted/50 p-4"
                  >
                    <p className="font-bold text-gp-text">{c.name}</p>
                    <a
                      href={customerWhatsAppLink(
                        c.phone,
                        `Hello ${c.name}, this is G-Products. How can we help?`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-ink-850 underline-offset-2 hover:underline"
                    >
                      {c.phone}
                    </a>
                    <p className="text-xs text-gp-text-subtle">{c.email}</p>
                    <p className="mt-2 text-xs text-gp-text-muted">
                      {c.defaultLocation ?? "No saved location"}
                    </p>
                    <div className="mt-3 flex justify-between text-xs text-gp-text-subtle">
                      <span>{c.totalOrders} orders</span>
                      <span>{formatDate(c.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </DeskPanel>
      </section>

      <section>
        <DeskSectionTitle
          eyebrow="Team"
          title="Desk staff"
          action={
            <Link
              href="/admin/staff"
              className="text-sm font-semibold text-accent-ink hover:underline"
            >
              Manage staff
            </Link>
          }
        />
        <DeskPanel>
          <DeskPanelHeader title="Staff logins" subtitle="Provider desk access" />
          {data.staff.length === 0 ? (
            <DeskEmpty
              title="No staff accounts"
              description="Add team members from Staff."
              action={
                <Link
                  href="/admin/staff"
                  className="rounded-pill bg-brand px-4 py-2 text-sm font-bold text-ink-950"
                >
                  Open Staff
                </Link>
              }
            />
          ) : (
            <ul className="divide-y divide-gp-border/60">
              {data.staff.map((u) => (
                <li
                  key={u.id}
                  className="flex items-center justify-between gap-3 px-5 py-3.5"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-gp-text">{u.name}</p>
                    <p className="truncate text-xs text-gp-text-subtle">{u.email}</p>
                  </div>
                  <div className="shrink-0 text-right text-xs text-gp-text-subtle">
                    <p>{u.staffTitle?.trim() || "Staff"}</p>
                    <p>{formatDate(u.createdAt)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </DeskPanel>
      </section>
    </div>
  );
}
