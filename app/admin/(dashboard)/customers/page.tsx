import Link from "next/link";
import { getAdminAnalytics } from "@/lib/admin-analytics";
import { formatDate, formatDateTime, formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";
export const metadata = { title: "Customers" };

export default async function AdminCustomersPage() {
  const data = await getAdminAnalytics();

  return (
    <div className="space-y-10">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand/80">
          Shop users
        </p>
        <h1 className="mt-1 text-3xl font-black tracking-tight text-white">
          Customers
        </h1>
        <p className="mt-2 text-sm text-white/50">
          {data.customerCount} registered shop account
          {data.customerCount === 1 ? "" : "s"} ·{" "}
          {data.registeredWithOrders} with orders · {data.deskUserCount} desk
          login{data.deskUserCount === 1 ? "" : "s"} (staff + owner). Shop
          accounts are separate from provider desk logins.
        </p>
      </div>

      <section>
        <h2 className="display text-xl">Top buyers</h2>
        <p className="mt-1 text-sm text-white/45">
          By order count — includes guest checkouts matched by phone.
        </p>
        <div className="mt-4 overflow-hidden rounded-[1.35rem] border border-white/[0.07] bg-ink-900/50 shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-white/[0.02] text-[11px] uppercase tracking-[0.14em] text-white/40">
                <tr>
                  <th className="px-5 py-3.5 font-semibold">Customer</th>
                  <th className="px-5 py-3.5 font-semibold">Location</th>
                  <th className="px-5 py-3.5 font-semibold">Orders</th>
                  <th className="px-5 py-3.5 font-semibold">Spent</th>
                  <th className="px-5 py-3.5 font-semibold">Last order</th>
                </tr>
              </thead>
              <tbody>
                {data.topCustomers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-10 text-center text-white/40"
                    >
                      No orders yet — top buyers will appear here.
                    </td>
                  </tr>
                ) : (
                  data.topCustomers.map((c) => (
                    <tr
                      key={`${c.phone}-${c.name}`}
                      className="border-t border-white/[0.05]"
                    >
                      <td className="px-5 py-3.5">
                        <p className="font-semibold text-white">{c.name}</p>
                        <p className="text-xs text-white/40">{c.phone}</p>
                      </td>
                      <td className="max-w-[200px] truncate px-5 py-3.5 text-white/60">
                        {c.location}
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-white">
                        {c.orders}
                      </td>
                      <td className="px-5 py-3.5 text-brand">
                        {formatPrice(c.spent)}
                      </td>
                      <td className="px-5 py-3.5 text-white/50">
                        {c.lastOrder ? formatDateTime(c.lastOrder) : "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section>
        <h2 className="display text-xl">Registered accounts</h2>
        <div className="mt-4 overflow-hidden rounded-[1.35rem] border border-white/[0.07] bg-ink-900/50 shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-white/[0.02] text-[11px] uppercase tracking-[0.14em] text-white/40">
                <tr>
                  <th className="px-5 py-3.5 font-semibold">Name</th>
                  <th className="px-5 py-3.5 font-semibold">Contact</th>
                  <th className="px-5 py-3.5 font-semibold">Saved location</th>
                  <th className="px-5 py-3.5 font-semibold">Orders</th>
                  <th className="px-5 py-3.5 font-semibold">Joined</th>
                </tr>
              </thead>
              <tbody>
                {data.customers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-10 text-center text-white/40"
                    >
                      No customer accounts yet.
                    </td>
                  </tr>
                ) : (
                  data.customers.map((c) => (
                    <tr
                      key={c.id}
                      className="border-t border-white/[0.05] hover:bg-white/[0.02]"
                    >
                      <td className="px-5 py-3.5 font-semibold text-white">
                        {c.name}
                      </td>
                      <td className="px-5 py-3.5 text-white/70">
                        {c.phone}
                        <span className="block text-xs text-white/40">
                          {c.email}
                        </span>
                      </td>
                      <td className="max-w-[220px] px-5 py-3.5 text-white/55">
                        {c.locationLabel ? (
                          <span className="block text-xs font-semibold text-brand/80">
                            {c.locationLabel}
                          </span>
                        ) : null}
                        {c.defaultLocation ?? "—"}
                      </td>
                      <td className="px-5 py-3.5 text-white/80">
                        {c.totalOrders}
                      </td>
                      <td className="px-5 py-3.5 text-white/50">
                        {formatDate(c.createdAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="display text-xl">Desk staff</h2>
          <Link
            href="/admin/staff"
            className="text-sm font-semibold text-brand hover:underline"
          >
            Manage staff
          </Link>
        </div>
        <div className="overflow-hidden rounded-[1.35rem] border border-white/[0.07] bg-ink-900/50 shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="bg-white/[0.02] text-[11px] uppercase tracking-[0.14em] text-white/40">
                <tr>
                  <th className="px-5 py-3.5 font-semibold">Name</th>
                  <th className="px-5 py-3.5 font-semibold">Email</th>
                  <th className="px-5 py-3.5 font-semibold">Role</th>
                  <th className="px-5 py-3.5 font-semibold">Since</th>
                </tr>
              </thead>
              <tbody>
                {data.staff.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-5 py-10 text-center text-white/40"
                    >
                      No staff accounts — add team members from Staff.
                    </td>
                  </tr>
                ) : (
                  data.staff.map((u) => (
                    <tr
                      key={u.id}
                      className="border-t border-white/[0.05]"
                    >
                      <td className="px-5 py-3.5 font-semibold text-white">
                        {u.name}
                      </td>
                      <td className="px-5 py-3.5 text-white/70">{u.email}</td>
                      <td className="px-5 py-3.5 text-white/60">
                        {u.staffTitle?.trim() || "Staff"}
                      </td>
                      <td className="px-5 py-3.5 text-white/50">
                        {formatDate(u.createdAt)}
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
