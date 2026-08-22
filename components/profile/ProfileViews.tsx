import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Icon } from "@/components/Icons";
import type { CustomerSession } from "@/lib/customer-auth";
import { formatPrice, formatDateTime } from "@/lib/format";
import { LocationForm } from "@/components/profile/LocationForm";
import { LogoutButton } from "@/components/LogoutButton";
import {
  ShopEmptyState,
  ShopQuickLink,
  ShopStatusPill
} from "@/components/shop/ui";

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
      <div className="relative overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-gradient-to-br from-ink-900 via-ink-900/90 to-ink-950 p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand/10 blur-3xl" />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-brand">
              Account
            </p>
            <h1 className="display mt-2 text-3xl sm:text-4xl">
              Hi, {firstName}
            </h1>
            <p className="mt-2 text-sm text-white/45">
              {customer.phone}
              {customer.email ? ` · ${customer.email}` : null}
            </p>
          </div>
          <LogoutButton className="rounded-pill border border-white/15 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white/55 transition-colors hover:border-white/30 hover:text-white" />
        </div>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <ShopQuickLink
          href="/search"
          icon="search"
          title="Continue shopping"
          subtitle="Browse the live catalog"
        />
        <ShopQuickLink
          href="/services"
          icon="services"
          title="Services"
          subtitle="Keys, loans & printing"
        />
        <ShopQuickLink
          href="/cart"
          icon="cart"
          title="Your cart"
          subtitle="Checkout when ready"
        />
      </div>

      <section className="mt-12 rounded-[1.35rem] border border-white/[0.08] bg-white/[0.02] p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand/10 text-brand ring-1 ring-brand/20">
            <Icon name="map-pin" className="h-5 w-5" />
          </span>
          <div>
            <h2 className="display text-xl">Delivery location</h2>
            <p className="mt-0.5 text-sm text-white/45">
              Saved for checkout — edit anytime.
            </p>
          </div>
        </div>
        <div className="mt-5">
          <LocationForm
            locationLabel={locationLabel}
            defaultLocation={defaultLocation}
          />
        </div>
      </section>

      <section className="mt-12">
        <div className="flex items-end justify-between gap-3">
          <h2 className="display text-xl">Recent orders</h2>
          {orders.length > 0 ? (
            <span className="text-xs font-medium text-white/35">
              {orders.length} shown
            </span>
          ) : null}
        </div>
        {orders.length === 0 ? (
          <div className="mt-4">
            <ShopEmptyState
              icon="cart"
              title="No orders yet"
              description="Shop with this phone number and your orders will show up here."
              action={
                <Link href="/search" className="btn-brand">
                  Start shopping
                  <Icon name="arrow-right" className="h-4 w-4" />
                </Link>
              }
            />
          </div>
        ) : (
          <ul className="mt-4 space-y-3">
            {orders.map((o) => (
              <li
                key={o.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-[1.15rem] border border-white/[0.08] bg-ink-900/40 px-4 py-4 transition-colors hover:border-white/[0.12]"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-white">{o.ref}</p>
                  <p className="mt-0.5 text-xs text-white/40">
                    {formatDateTime(o.createdAt)}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <p className="font-bold tabular-nums text-brand">
                    {formatPrice(o.total)}
                  </p>
                  <ShopStatusPill status={o.status} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-10">
        <div className="flex items-end justify-between gap-3">
          <h2 className="display text-xl">Service requests</h2>
          {services.length > 0 ? (
            <span className="text-xs font-medium text-white/35">
              {services.length} shown
            </span>
          ) : null}
        </div>
        {services.length === 0 ? (
          <div className="mt-4">
            <ShopEmptyState
              icon="services"
              title="No service jobs yet"
              description="Need keys, printing or a loan? Submit a request from Services."
              action={
                <Link href="/services" className="btn-brand">
                  Browse services
                  <Icon name="arrow-right" className="h-4 w-4" />
                </Link>
              }
            />
          </div>
        ) : (
          <ul className="mt-4 space-y-3">
            {services.map((s) => (
              <li
                key={s.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-[1.15rem] border border-white/[0.08] bg-ink-900/40 px-4 py-4 transition-colors hover:border-white/[0.12]"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-white">{s.ref}</p>
                  <p className="mt-0.5 text-xs capitalize text-white/40">
                    {s.serviceType.replace(/_/g, " ").toLowerCase()}
                  </p>
                </div>
                <ShopStatusPill status={s.status} />
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
