import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Icon } from "@/components/Icons";
import { unifiedLogoutAction } from "@/app/profile/actions";
import type { CustomerSession } from "@/lib/customer-auth";
import { formatPrice, formatDateTime } from "@/lib/format";
import { LocationForm } from "@/components/profile/LocationForm";

type OrderRow = {
  id: string;
  ref: string;
  status: string;
  total: number;
  createdAt: Date;
};

type ServiceRow = {
  id: string;
  ref: string;
  serviceType: string;
  status: string;
  createdAt: Date;
};

export function AccountHome({
  customer,
  orders,
  services,
  defaultLocation = "",
  locationLabel = ""
}: {
  customer: CustomerSession;
  orders: OrderRow[];
  services: ServiceRow[];
  defaultLocation?: string;
  locationLabel?: string;
}) {
  const firstName =
    customer.name.split(" ")[0] || customer.name || "there";

  return (
    <div className="container-g py-10 sm:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-brand">
            Account
          </p>
          <h1 className="display mt-2 text-3xl sm:text-4xl">Hi, {firstName}</h1>
          <p className="mt-2 text-sm text-white/45">
            {customer.phone}
            {customer.email ? ` · ${customer.email}` : null}
          </p>
        </div>
        <form action={unifiedLogoutAction}>
          <button
            type="submit"
            className="rounded-pill border border-white/15 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white/55 transition-colors hover:border-white/30 hover:text-white"
          >
            Sign out
          </button>
        </form>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <Link
          href="/search"
          className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-5 py-4 transition-colors hover:border-brand/35"
        >
          <Icon name="search" className="h-5 w-5 text-brand" />
          <p className="mt-3 font-bold">Continue shopping</p>
          <p className="mt-1 text-xs text-white/40">Browse the live catalog</p>
        </Link>
        <Link
          href="/services"
          className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-5 py-4 transition-colors hover:border-brand/35"
        >
          <Icon name="services" className="h-5 w-5 text-brand" />
          <p className="mt-3 font-bold">Services</p>
          <p className="mt-1 text-xs text-white/40">Keys, loans & printing</p>
        </Link>
        <Link
          href="/cart"
          className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-5 py-4 transition-colors hover:border-brand/35"
        >
          <Icon name="cart" className="h-5 w-5 text-brand" />
          <p className="mt-3 font-bold">Your cart</p>
          <p className="mt-1 text-xs text-white/40">Checkout when ready</p>
        </Link>
      </div>

      <section className="mt-12 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 sm:p-6">
        <h2 className="display text-xl">Delivery location</h2>
        <p className="mt-2 text-sm text-white/45">
          Save your UNZA room or home address — checkout fills this in
          automatically.
        </p>
        <LocationForm
          locationLabel={locationLabel}
          defaultLocation={defaultLocation}
        />
      </section>

      <section className="mt-12">
        <h2 className="display text-xl">Recent orders</h2>
        {orders.length === 0 ? (
          <p className="mt-4 text-sm text-white/40">
            No orders on this phone yet. Shop with the same number and they’ll
            show up here.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-white/[0.06] rounded-2xl border border-white/[0.08]">
            {orders.map((o) => (
              <li
                key={o.id}
                className="flex flex-wrap items-center justify-between gap-2 px-4 py-3.5"
              >
                <div>
                  <p className="font-semibold">{o.ref}</p>
                  <p className="text-xs text-white/40">
                    {formatDateTime(o.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-brand">{formatPrice(o.total)}</p>
                  <p className="text-xs uppercase tracking-wide text-white/40">
                    {o.status}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-10">
        <h2 className="display text-xl">Service requests</h2>
        {services.length === 0 ? (
          <p className="mt-4 text-sm text-white/40">No service jobs yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-white/[0.06] rounded-2xl border border-white/[0.08]">
            {services.map((s) => (
              <li
                key={s.id}
                className="flex flex-wrap items-center justify-between gap-2 px-4 py-3.5"
              >
                <div>
                  <p className="font-semibold">{s.ref}</p>
                  <p className="text-xs text-white/40">
                    {s.serviceType.replace(/_/g, " ")}
                  </p>
                </div>
                <p className="text-xs uppercase tracking-wide text-white/40">
                  {s.status}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="mt-10 text-center text-sm text-white/35">
        <Link href="/" className="hover:text-white/60">
          ← Back to shop
        </Link>
        <span className="mx-2 text-white/15">·</span>
        <span className="text-white/25">{siteConfig.name}</span>
      </p>
    </div>
  );
}
