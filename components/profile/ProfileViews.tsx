import Link from "next/link";
import { siteConfig, configuredSocialLinks, whatsappHref } from "@/config/site";
import { Icon } from "@/components/Icons";
import type { CustomerSession } from "@/lib/customer-auth";
import { formatDate, formatDateTime, formatPrice } from "@/lib/format";
import { LocationForm } from "@/components/profile/LocationForm";
import { ThemeSettings } from "@/components/profile/ThemeSettings";
import { AccountSettingsForm } from "@/components/profile/AccountSettingsForm";
import { ReferralCard } from "@/components/profile/ReferralCard";
import { ReturnsPortal } from "@/components/profile/ReturnsPortal";
import { RecentViewed } from "@/components/profile/RecentViewed";
import { LogoutButton } from "@/components/LogoutButton";
import { ShopEmptyState, ShopStatusPill } from "@/components/shop/ui";

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

type FavoriteRow = {
  slug: string;
  name: string;
  price: number;
  image: string | null;
  ordered: number;
};

const manageLinks = [
  { href: "#orders", icon: "cart", title: "Orders", subtitle: "See and follow your orders" },
  { href: "#favorites", icon: "star", title: "My favorite", subtitle: "What you order most" },
  { href: "#recent", icon: "clock", title: "Recent viewed", subtitle: "Products and services" },
  { href: "#returns", icon: "refresh", title: "Returns & exchange", subtitle: "Returns, swaps, warranty" }
];

function initials(firstName: string, lastName: string, name: string) {
  const first = (firstName || name.split(" ")[0] || "").trim();
  const last = (lastName || name.split(" ").slice(1)[0] || "").trim();
  const a = first.charAt(0).toUpperCase();
  const b = last.charAt(0).toUpperCase();
  if (a && b) return `${a} ${b}`;
  return a || "G";
}

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-ink-700">
      {children}
    </p>
  );
}

export function AccountHome({
  customer,
  firstName,
  lastName,
  createdAt,
  offersOptIn,
  orders,
  services,
  favorites,
  defaultLocation = "",
  locationLabel = "",
  referralLink = "",
  rewardReady = false
}: {
  customer: CustomerSession;
  firstName: string;
  lastName: string;
  createdAt: Date;
  offersOptIn: boolean;
  orders: OrderRow[];
  services: ServiceRow[];
  favorites: FavoriteRow[];
  defaultLocation?: string;
  locationLabel?: string;
  referralLink?: string;
  rewardReady?: boolean;
}) {
  const fullName =
    [firstName, lastName].filter(Boolean).join(" ") || customer.name;
  const mark = initials(firstName, lastName, customer.name);
  const socials = configuredSocialLinks();

  return (
    <div className="container-g py-8 sm:py-12">
      <section className="gp-card shadow-float">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <span className="grid h-20 min-w-20 place-items-center rounded-full bg-brand px-3 text-xl font-extrabold tracking-wide text-ink-950 ring-4 ring-brand/40">
              {mark}
            </span>
            <div className="min-w-0">
              <h1 className="display heading-page truncate">{fullName}</h1>
              <p className="mt-1 text-sm font-medium text-gp-text-muted">
                Member since {formatDate(createdAt)}
              </p>
            </div>
          </div>
          <LogoutButton variant="prominent" />
        </div>
      </section>

      <section className="gp-card mt-8 shadow-card">
        <SectionLabel>Account</SectionLabel>
        <h2 className="display heading-section mt-2">Your details</h2>
        <p className="text-subtitle mt-2">
          Update your name, number, email, offers, and address.
        </p>
        <AccountSettingsForm
          firstName={firstName}
          lastName={lastName}
          phone={customer.phone}
          email={customer.email ?? ""}
          address={defaultLocation}
          offersOptIn={offersOptIn}
        />
      </section>

      <div className="mt-12">
        <SectionLabel>Manage</SectionLabel>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {manageLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="group gp-card block transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand/25 text-ink-800 ring-1 ring-brand/40">
                <Icon name={item.icon} className="h-5 w-5" />
              </span>
              <p className="mt-4 font-bold text-gp-text">{item.title}</p>
              <p className="text-caption mt-1">{item.subtitle}</p>
            </a>
          ))}
        </div>
      </div>

      <section id="orders" className="mt-10 scroll-mt-28">
        <h2 className="display heading-section">Orders</h2>
        <p className="text-subtitle mt-2">
          Every order on this account, with the same status the shop sees.
        </p>
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
            {orders.map((order) => (
              <li key={order.id}>
                <Link
                  href={`/orders/track?ref=${encodeURIComponent(order.ref)}`}
                  className="gp-card flex flex-wrap items-center justify-between gap-3 !p-4 transition-all hover:shadow-card-hover sm:!p-5"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-gp-text">{order.ref}</p>
                    <p className="text-caption mt-1">
                      {formatDateTime(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <p className="font-bold tabular-nums text-ink-800">
                      {formatPrice(order.total)}
                    </p>
                    <ShopStatusPill status={order.status} kind="order" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section id="favorites" className="mt-12 scroll-mt-28">
        <h2 className="display heading-section">My favorite</h2>
        <p className="text-subtitle mt-2">
          Products you have ordered the most.
        </p>
        {favorites.length === 0 ? (
          <p className="mt-5 text-sm text-gp-text-muted">
            Once you order, the products you buy most will land here.
          </p>
        ) : (
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {favorites.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/product/${item.slug}`}
                  className="gp-card flex items-center gap-3 !p-3 transition-all hover:shadow-card-hover"
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt=""
                      className="h-16 w-16 shrink-0 rounded-xl object-cover"
                    />
                  ) : (
                    <span className="grid h-16 w-16 shrink-0 place-items-center rounded-xl bg-gp-muted text-ink-700">
                      <Icon name="star" className="h-5 w-5" />
                    </span>
                  )}
                  <span className="min-w-0">
                    <span className="block truncate font-semibold text-gp-text">
                      {item.name}
                    </span>
                    <span className="mt-1 block text-xs text-gp-text-muted">
                      Ordered {item.ordered} time{item.ordered === 1 ? "" : "s"}
                    </span>
                    <span className="mt-1 block text-sm font-bold text-ink-800">
                      {formatPrice(item.price)}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section id="recent" className="mt-12 scroll-mt-28">
        <h2 className="display heading-section">Recent viewed</h2>
        <p className="text-subtitle mt-2">
          Products you opened recently, and services you have started.
        </p>
        <RecentViewed services={services} />
      </section>

      <section id="returns" className="gp-card mt-12 scroll-mt-28">
        <h2 className="display heading-section">Returns & exchange</h2>
        <ReturnsPortal contact={customer.email || customer.phone} />
      </section>

      <div className="mt-14">
        <SectionLabel>Info</SectionLabel>
      </div>

      <section id="location" className="gp-card mt-4 scroll-mt-28">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand/25 text-ink-800 ring-1 ring-brand/40">
            <Icon name="map-pin" className="h-5 w-5" />
          </span>
          <div>
            <h2 className="display heading-section">My location</h2>
            <p className="text-subtitle mt-1">
              Set the name of your spot and your direct location.
            </p>
          </div>
        </div>
        <LocationForm
          key={`${locationLabel}|${defaultLocation}`}
          locationLabel={locationLabel}
          defaultLocation={defaultLocation}
        />
      </section>

      <section id="refer" className="gp-card mt-8 scroll-mt-28">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand/25 text-ink-800 ring-1 ring-brand/40">
            <Icon name="share" className="h-5 w-5" />
          </span>
          <div>
            <h2 className="display heading-section">Refer a friend</h2>
            <p className="text-subtitle mt-1">
              Share your link. The offer starts when they place their first
              order.
            </p>
          </div>
        </div>
        <ReferralCard
          name={fullName}
          email={customer.email ?? ""}
          link={referralLink}
          rewardReady={rewardReady}
        />
      </section>

      <ThemeSettings />

      <section className="gp-card mt-8">
        <SectionLabel>Social</SectionLabel>
        <h2 className="display heading-section mt-2">Find G-Products</h2>
        <p className="text-subtitle mt-2">
          Reach the shop, and open the pages we publish.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <a
            href={whatsappHref("Hi G-Products")}
            target="_blank"
            rel="noopener noreferrer"
            className="gp-card flex items-center gap-3 !p-4 transition-all hover:shadow-card-hover"
          >
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand/25 text-ink-800">
              <Icon name="whatsapp" className="h-5 w-5" />
            </span>
            <span>
              <span className="block font-bold text-gp-text">WhatsApp</span>
              <span className="text-caption mt-0.5 block">Chat with the shop</span>
            </span>
          </a>
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="gp-card flex items-center gap-3 !p-4 transition-all hover:shadow-card-hover"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-gp-muted text-ink-800">
                <Icon name="external" className="h-5 w-5" />
              </span>
              <span>
                <span className="block font-bold text-gp-text">{social.label}</span>
                <span className="text-caption mt-0.5 block">G-Products</span>
              </span>
            </a>
          ))}
          {socials.length === 0 ? (
            <div className="gp-card !p-4 text-sm text-gp-text-muted">
              Facebook, Instagram, and TikTok will show here when the shop
              publishes those pages. WhatsApp is the live way to reach us.
            </div>
          ) : null}
        </div>
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
