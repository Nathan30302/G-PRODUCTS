import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Icon } from "@/components/Icons";
import { customerLogoutAction } from "@/app/profile/actions";
import type { CustomerSession } from "@/lib/customer-auth";
import type { SessionUser } from "@/lib/auth";
import { formatPrice } from "@/lib/format";

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

function whatsappProviderAccess() {
  const text = encodeURIComponent(
    `Hi ${siteConfig.name} — I'd like a Provider desk staff account.`
  );
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${text}`;
}

export function ProfileHub({
  customer,
  provider
}: {
  customer: CustomerSession | null;
  provider: SessionUser | null;
}) {
  return (
    <div className="container-g relative py-10 sm:py-14">
      <div className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-brand/10 blur-[100px]" />
      <div className="pointer-events-none absolute -right-16 top-24 h-56 w-56 rounded-full bg-accent/10 blur-[90px]" />

      <header className="relative mx-auto max-w-2xl text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-brand">
          Profile
        </p>
        <h1 className="display mt-3 text-4xl sm:text-5xl">Who are you?</h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-white/50 sm:text-base">
          Sign in to the Customer shop or the Provider desk — each opens its own
          app.
        </p>
      </header>

      <div className="relative mx-auto mt-10 grid max-w-3xl gap-5 sm:mt-12 sm:grid-cols-2 sm:gap-6">
        {/* Customer door */}
        <section className="group relative overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-gradient-to-b from-white/[0.06] to-transparent p-6 transition-colors hover:border-brand/35 sm:p-7">
          <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-brand/15 text-brand">
            <Icon name="user" className="h-6 w-6" />
          </div>
          <h2 className="display text-2xl">{siteConfig.apps.customer.label}</h2>
          <p className="mt-2 text-sm text-white/45">
            {siteConfig.apps.customer.tagline}
          </p>

          {customer ? (
            <div className="mt-6 space-y-3">
              <p className="text-sm text-white/70">
                Signed in as{" "}
                <span className="font-semibold text-white">{customer.name}</span>
              </p>
              <Link
                href={siteConfig.apps.customer.home}
                className="btn-brand flex w-full items-center justify-center gap-2 py-3.5 text-sm"
              >
                Open Customer app
                <Icon name="arrow-right" className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="mt-6 flex flex-col gap-2.5">
              <Link
                href={siteConfig.apps.customer.login}
                className="btn-brand flex w-full items-center justify-center gap-2 py-3.5 text-sm"
              >
                Log in
              </Link>
              <Link
                href={siteConfig.apps.customer.signup}
                className="flex w-full items-center justify-center rounded-pill border border-white/15 bg-white/[0.03] py-3.5 text-sm font-bold text-white/85 transition-colors hover:border-brand/40 hover:text-brand"
              >
                Sign up
              </Link>
            </div>
          )}
        </section>

        {/* Provider door */}
        <section className="group relative overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-gradient-to-b from-white/[0.06] to-transparent p-6 transition-colors hover:border-accent/40 sm:p-7">
          <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-accent/15 text-accent">
            <Icon name="shield" className="h-6 w-6" />
          </div>
          <h2 className="display text-2xl">{siteConfig.apps.provider.label}</h2>
          <p className="mt-2 text-sm text-white/45">
            {siteConfig.apps.provider.tagline}
          </p>

          {provider ? (
            <div className="mt-6 space-y-3">
              <p className="text-sm text-white/70">
                Desk session:{" "}
                <span className="font-semibold text-white">{provider.name}</span>
              </p>
              <Link
                href={siteConfig.apps.provider.home}
                className="flex w-full items-center justify-center gap-2 rounded-pill bg-accent px-6 py-3.5 text-sm font-bold text-ink-950 transition-transform hover:-translate-y-0.5"
              >
                Open Provider desk
                <Icon name="arrow-right" className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="mt-6 flex flex-col gap-2.5">
              <Link
                href={siteConfig.apps.provider.login}
                className="flex w-full items-center justify-center gap-2 rounded-pill bg-accent px-6 py-3.5 text-sm font-bold text-ink-950 transition-transform hover:-translate-y-0.5"
              >
                Log in
              </Link>
              <a
                href={whatsappProviderAccess()}
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-center rounded-pill border border-white/15 bg-white/[0.03] py-3.5 text-sm font-bold text-white/85 transition-colors hover:border-accent/40 hover:text-accent"
              >
                Request staff access
              </a>
            </div>
          )}
        </section>
      </div>

      <p className="relative mx-auto mt-10 max-w-md text-center text-xs text-white/30">
        Customer accounts stay in the shop. Provider accounts open the desk for
        orders, stock and services.
      </p>
    </div>
  );
}

export function CustomerAppHome({
  customer,
  orders,
  services
}: {
  customer: CustomerSession;
  orders: OrderRow[];
  services: ServiceRow[];
}) {
  return (
    <div className="container-g py-10 sm:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-brand">
            Customer app
          </p>
          <h1 className="display mt-2 text-3xl sm:text-4xl">
            Hi, {customer.name.split(" ")[0]}
          </h1>
          <p className="mt-2 text-sm text-white/45">{customer.email}</p>
        </div>
        <form action={customerLogoutAction}>
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

      <section className="mt-12">
        <h2 className="display text-xl">Recent orders</h2>
        {orders.length === 0 ? (
          <p className="mt-4 text-sm text-white/40">
            No orders linked to your phone yet. Place an order with the same
            number you used at signup.
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
                    {o.createdAt.toLocaleDateString("en-ZM", {
                      day: "numeric",
                      month: "short",
                      year: "numeric"
                    })}
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
          <p className="mt-4 text-sm text-white/40">
            No service jobs on your phone yet.
          </p>
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
        <Link href="/profile" className="hover:text-white/60">
          ← Profile hub
        </Link>
      </p>
    </div>
  );
}
