import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Icon } from "@/components/Icons";
import type { CustomerSession } from "@/lib/customer-auth";
import { formatPrice, formatDateTime } from "@/lib/format";
import { parseServiceFileUrls } from "@/lib/service-files";
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
  amount: number | null;
  fileUrls: string | null;
  createdAt: Date;
};

export function AccountHome({
  customer,
  orders,
  services,
  defaultLocation = "",
  locationLabel = "",
  rewardPoints = 0,
  referralCode = "",
  referralLink = ""
}: {
  customer: CustomerSession;
  orders: OrderRow[];
  services: ServiceRow[];
  defaultLocation?: string;
  locationLabel?: string;
  rewardPoints?: number;
  referralCode?: string;
  referralLink?: string;
}) {
  const firstName =
    customer.name.split(" ")[0] || customer.name || "there";

  return (
    <div className="container-g py-10 sm:py-14">
      <div className="gp-card shadow-float">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="section-label">Account</p>
            <h1 className="display heading-page mt-2">Hi, {firstName}</h1>
            <p className="text-subtitle mt-2">
              {customer.phone}
              {customer.email ? ` · ${customer.email}` : null}
            </p>
          </div>
          <LogoutButton className="rounded-pill border border-gp-border px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-gp-text-muted transition-colors hover:border-ink-700/30 hover:text-ink-700" />
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
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

      <section className="gp-card mt-12 shadow-card">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-gp-muted text-ink-700 ring-1 ring-gp-border">
              <Icon name="star" className="h-5 w-5" />
            </span>
            <div>
              <h2 className="display heading-section">G-Rewards</h2>
              <p className="text-subtitle mt-1">
                Earn ~1 point per K1 when an order is paid. Share your code for
                a bonus on a friend’s first paid order.
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-extrabold tabular-nums text-ink-700">
              {rewardPoints}
            </p>
            <p className="section-label mt-0.5">points</p>
          </div>
        </div>
        {referralCode ? (
          <div className="gp-card-muted mt-6">
            <p className="section-label">Your referral code</p>
            <p className="mt-2 font-mono text-lg font-bold tracking-wide text-gp-text">
              {referralCode}
            </p>
            {referralLink ? (
              <p className="text-caption mt-2 break-all">
                Invite link:{" "}
                <span className="font-medium text-ink-700">{referralLink}</span>
              </p>
            ) : null}
            <p className="text-caption mt-2">
              Friends enter this code when they create an account.
            </p>
          </div>
        ) : null}
      </section>

      <section className="gp-card mt-12">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-gp-muted text-ink-700 ring-1 ring-gp-border">
            <Icon name="map-pin" className="h-5 w-5" />
          </span>
          <div>
            <h2 className="display heading-section">Delivery location</h2>
            <p className="text-subtitle mt-1">
              Saved for checkout — edit anytime.
            </p>
          </div>
        </div>
        <div className="mt-6">
          <LocationForm
            locationLabel={locationLabel}
            defaultLocation={defaultLocation}
          />
        </div>
      </section>

      <section className="mt-12">
        <div className="flex items-end justify-between gap-3">
          <h2 className="display heading-section">Recent orders</h2>
          {orders.length > 0 ? (
            <span className="text-caption">{orders.length} shown</span>
          ) : null}
        </div>
        {orders.length === 0 ? (
          <div className="mt-5">
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
          <ul className="mt-5 space-y-3">
            {orders.map((o) => (
              <li
                key={o.id}
                className="gp-card flex flex-wrap items-center justify-between gap-3 !p-4 transition-all duration-300 hover:shadow-card-hover sm:!p-5"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-gp-text">{o.ref}</p>
                  <p className="text-caption mt-1">
                    {formatDateTime(o.createdAt)}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <p className="font-bold tabular-nums text-ink-700">
                    {formatPrice(o.total)}
                  </p>
                  <ShopStatusPill status={o.status} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-12">
        <div className="flex items-end justify-between gap-3">
          <h2 className="display heading-section">Service requests</h2>
          {services.length > 0 ? (
            <span className="text-caption">{services.length} shown</span>
          ) : null}
        </div>
        {services.length === 0 ? (
          <div className="mt-5">
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
          <ul className="mt-5 space-y-3">
            {services.map((s) => {
              const n = parseServiceFileUrls(s.fileUrls).length;
              return (
                <li key={s.id}>
                  <Link
                    href={`/services/track/${s.ref}`}
                    className="gp-card flex flex-wrap items-center justify-between gap-3 !p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover sm:!p-5"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-gp-text">{s.ref}</p>
                      <p className="text-caption mt-1 capitalize">
                        {s.serviceType.replace(/_/g, " ").toLowerCase()}
                        {n > 0
                          ? ` · ${n} file${n === 1 ? "" : "s"}`
                          : ""}
                        {typeof s.amount === "number"
                          ? ` · ${formatPrice(s.amount)}`
                          : ""}
                      </p>
                      <p className="text-caption mt-1">
                        {formatDateTime(s.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShopStatusPill status={s.status} />
                      <Icon
                        name="chevron-right"
                        className="h-4 w-4 text-gp-text-subtle"
                      />
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <p className="mt-12 text-center text-sm text-gp-text-subtle">
        <Link href="/" className="font-medium text-ink-700 hover:text-ink-800">
          ← Back to shop
        </Link>
        <span className="mx-2 text-gp-border">·</span>
        <span>{siteConfig.name}</span>
      </p>
    </div>
  );
}
