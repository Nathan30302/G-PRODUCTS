"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { Icon } from "@/components/Icons";
import { configuredSocialLinks, whatsappHref } from "@/config/site";
import { formatDateTime, formatPrice } from "@/lib/format";
import { LocationForm } from "@/components/profile/LocationForm";
import { ThemeSettings } from "@/components/profile/ThemeSettings";
import { AccountSettingsForm } from "@/components/profile/AccountSettingsForm";
import { ReferralCard } from "@/components/profile/ReferralCard";
import { ReturnsPortal } from "@/components/profile/ReturnsPortal";
import { RecentViewed } from "@/components/profile/RecentViewed";
import { LogoutButton } from "@/components/LogoutButton";
import { ShopEmptyState, ShopStatusPill } from "@/components/shop/ui";

type View =
  | "home"
  | "settings"
  | "location"
  | "refer"
  | "orders"
  | "favorites"
  | "recent"
  | "returns";

type OrderRow = {
  id: string;
  ref: string;
  status: string;
  total: number;
  createdAt: Date | string;
};

type ServiceRow = {
  id: string;
  ref: string;
  serviceType: string;
  status: string;
  createdAt: Date | string;
};

type FavoriteRow = {
  slug: string;
  name: string;
  price: number;
  image: string | null;
  ordered: number;
};

const titles: Record<Exclude<View, "home">, string> = {
  settings: "Account",
  location: "My location",
  refer: "Refer a friend",
  orders: "Orders",
  favorites: "My favorite",
  recent: "Recent viewed",
  returns: "Returns & exchange"
};

function mark(firstName: string, lastName: string, name: string) {
  const first = (firstName || name.split(" ")[0] || "").trim();
  const last = (lastName || name.split(" ").slice(1)[0] || "").trim();
  const a = first.charAt(0).toUpperCase();
  const b = last.charAt(0).toUpperCase();
  return a && b ? `${a}${b}` : a || "G";
}

function BrandGlyph({ name }: { name: string }) {
  const common = "h-[1.15rem] w-[1.15rem]";
  if (name === "TikTok") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M14.5 3c.4 2.4 1.8 4.1 4.2 4.4v2.5c-1.4 0-2.7-.4-3.9-1.2v6.6a5.8 5.8 0 1 1-5.8-5.8c.3 0 .6 0 .9.1v2.7a3.2 3.2 0 1 0 2.2 3V3h2.4Z" />
      </svg>
    );
  }
  if (name === "Instagram") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
        <rect x="4" y="4" width="16" height="16" rx="5" />
        <circle cx="12" cy="12" r="3.5" />
        <circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (name === "Facebook") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M14.2 21v-7.2h2.4l.4-2.8h-2.8V9.2c0-.8.2-1.4 1.4-1.4H17V5.3c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2h-2.4v2.8H11V21h3.2Z" />
      </svg>
    );
  }
  return <Icon name="whatsapp" className={common} />;
}

function Row({
  icon,
  label,
  onClick,
  href
}: {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  href?: string;
}) {
  const className =
    "flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors active:bg-gp-muted/70";
  const body = (
    <>
      <span className="grid h-6 w-6 place-items-center text-ink-850">{icon}</span>
      <span className="min-w-0 flex-1 text-[15px] font-medium text-ink-950">{label}</span>
      <Icon name="chevron-right" className="h-4 w-4 text-gp-text-subtle" />
    </>
  );
  if (href) {
    const external = href.startsWith("http");
    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
          {body}
        </a>
      );
    }
    return (
      <Link href={href} className={className}>
        {body}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={className}>
      {body}
    </button>
  );
}

function Card({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-[1.35rem] border border-black/[0.04] bg-white shadow-[0_10px_30px_-18px_rgba(26,40,52,0.35)]">
      <div className="divide-y divide-gp-border/80">{children}</div>
    </div>
  );
}

export function ProfileHub({
  firstName,
  lastName,
  fullName,
  createdAt,
  phone,
  email,
  offersOptIn,
  orders,
  services,
  favorites,
  defaultLocation,
  locationLabel,
  referralLink,
  rewardReady
}: {
  firstName: string;
  lastName: string;
  fullName: string;
  createdAt: Date | string;
  phone: string;
  email: string;
  offersOptIn: boolean;
  orders: OrderRow[];
  services: ServiceRow[];
  favorites: FavoriteRow[];
  defaultLocation: string;
  locationLabel: string;
  referralLink: string;
  rewardReady: boolean;
}) {
  const [view, setView] = useState<View>("home");
  const year = new Date(createdAt).getFullYear();
  const initials = mark(firstName, lastName, fullName);
  const socials = [
    ...configuredSocialLinks().filter((item) => item.label !== "Facebook"),
    ...configuredSocialLinks().filter((item) => item.label === "Facebook")
  ];
  const socialRows = [
    { label: "TikTok", href: socials.find((s) => s.label === "TikTok")?.href },
    { label: "Instagram", href: socials.find((s) => s.label === "Instagram")?.href },
    { label: "Facebook", href: socials.find((s) => s.label === "Facebook")?.href },
    { label: "WhatsApp", href: whatsappHref("Hi G-Products") }
  ];

  const chat = (
    <a
      href={whatsappHref("Hi G-Products, I need a hand.")}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed right-4 z-40 inline-flex items-center gap-2 rounded-2xl bg-ink-850 px-4 py-3 text-sm font-bold text-white shadow-[0_12px_30px_-12px_rgba(35,55,70,0.7)] md:bottom-6"
      style={{ bottom: "calc(var(--mobile-nav-offset) + 0.85rem)" }}
    >
      <Icon name="whatsapp" className="h-4 w-4" />
      Chat with Us
    </a>
  );

  if (view !== "home") {
    return (
      <div className="mx-auto w-full max-w-lg px-4 pb-28 pt-3 sm:pt-6">
        <button
          type="button"
          onClick={() => setView("home")}
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-850"
        >
          <Icon name="chevron-left" className="h-4 w-4" />
          {titles[view]}
        </button>

        {view === "settings" ? (
          <div className="space-y-4">
            <section className="rounded-[1.35rem] border border-black/[0.04] bg-white p-4 shadow-[0_10px_30px_-18px_rgba(26,40,52,0.35)] sm:p-5">
              <AccountSettingsForm
                firstName={firstName}
                lastName={lastName}
                phone={phone}
                email={email}
                address={defaultLocation}
                offersOptIn={offersOptIn}
              />
            </section>
            <ThemeSettings />
            <LogoutButton variant="prominent" />
          </div>
        ) : null}

        {view === "location" ? (
          <section className="rounded-[1.35rem] border border-black/[0.04] bg-white p-4 shadow-[0_10px_30px_-18px_rgba(26,40,52,0.35)] sm:p-5">
            <p className="text-sm text-gp-text-muted">
              Name your spot and set the direct location used at checkout.
            </p>
            <LocationForm
              key={`${locationLabel}|${defaultLocation}`}
              locationLabel={locationLabel}
              defaultLocation={defaultLocation}
            />
          </section>
        ) : null}

        {view === "refer" ? (
          <section className="rounded-[1.35rem] border border-black/[0.04] bg-white p-4 shadow-[0_10px_30px_-18px_rgba(26,40,52,0.35)] sm:p-5">
            <ReferralCard
              name={fullName}
              email={email}
              link={referralLink}
              rewardReady={rewardReady}
            />
          </section>
        ) : null}

        {view === "orders" ? (
          orders.length === 0 ? (
            <ShopEmptyState
              icon="cart"
              title="No orders yet"
              description="Shop with this phone number and your orders will show up here."
              action={
                <Link href="/search" className="btn-brand">
                  Start shopping
                </Link>
              }
            />
          ) : (
            <ul className="space-y-3">
              {orders.map((order) => (
                <li key={order.id}>
                  <Link
                    href={`/orders/track?ref=${encodeURIComponent(order.ref)}`}
                    className="flex items-center justify-between gap-3 rounded-[1.2rem] border border-black/[0.04] bg-white px-4 py-3.5 shadow-sm"
                  >
                    <span>
                      <span className="block font-semibold text-ink-950">{order.ref}</span>
                      <span className="mt-0.5 block text-xs text-gp-text-muted">
                        {formatDateTime(order.createdAt)}
                      </span>
                    </span>
                    <span className="text-right">
                      <span className="block text-sm font-bold text-ink-850">
                        {formatPrice(order.total)}
                      </span>
                      <span className="mt-1 inline-block">
                        <ShopStatusPill status={order.status} kind="order" />
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )
        ) : null}

        {view === "favorites" ? (
          favorites.length === 0 ? (
            <p className="rounded-[1.2rem] bg-white px-4 py-6 text-sm text-gp-text-muted shadow-sm">
              Once you order, the products you buy most will land here.
            </p>
          ) : (
            <ul className="space-y-3">
              {favorites.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/product/${item.slug}`}
                    className="flex items-center gap-3 rounded-[1.2rem] bg-white p-3 shadow-sm"
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt=""
                        className="h-14 w-14 rounded-xl object-cover"
                      />
                    ) : (
                      <span className="grid h-14 w-14 place-items-center rounded-xl bg-gp-muted text-ink-850">
                        <Icon name="star" className="h-5 w-5" />
                      </span>
                    )}
                    <span className="min-w-0">
                      <span className="block truncate font-semibold text-ink-950">
                        {item.name}
                      </span>
                      <span className="mt-0.5 block text-xs text-gp-text-muted">
                        Ordered {item.ordered} time{item.ordered === 1 ? "" : "s"}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )
        ) : null}

        {view === "recent" ? <RecentViewed services={services} /> : null}

        {view === "returns" ? (
          <section className="rounded-[1.35rem] border border-black/[0.04] bg-white p-4 shadow-[0_10px_30px_-18px_rgba(26,40,52,0.35)] sm:p-5">
            <ReturnsPortal contact={email || phone} />
          </section>
        ) : null}

        {chat}
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-lg px-4 pb-32 pt-4 sm:pt-8">
      <header className="flex items-center gap-3">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#1c3d34] text-sm font-bold tracking-wide text-white">
          {initials}
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[1.05rem] font-bold leading-tight text-ink-950">
            {fullName}
          </h1>
          <p className="mt-0.5 text-sm text-gp-text-muted">Member since {year}</p>
        </div>
        <button
          type="button"
          onClick={() => setView("settings")}
          aria-label="Account settings"
          className="grid h-10 w-10 place-items-center rounded-full text-ink-850"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
            <circle cx="12" cy="12" r="3" />
            <path d="M12 3.5v2.2M12 18.3V21M3.5 12h2.2M18.3 12H21M6.1 6.1l1.6 1.6M16.3 16.3l1.6 1.6M17.9 6.1l-1.6 1.6M7.7 16.3l-1.6 1.6" strokeLinecap="round" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => setView("orders")}
          aria-label="Orders"
          className="grid h-10 w-10 place-items-center rounded-full text-ink-850"
        >
          <Icon name="bell" className="h-5 w-5" />
        </button>
      </header>

      <div className="mt-5">
        <Card>
          <Row
            icon={<Icon name="map-pin" className="h-5 w-5" />}
            label="My location"
            onClick={() => setView("location")}
          />
          <Row
            icon={<Icon name="share" className="h-5 w-5" />}
            label="Refer a friend"
            onClick={() => setView("refer")}
          />
          <Row
            icon={<Icon name="cart" className="h-5 w-5" />}
            label="Orders"
            onClick={() => setView("orders")}
          />
        </Card>
      </div>

      <p className="mb-2 mt-6 text-[13px] font-extrabold tracking-[0.04em] text-[#1c3d34]">
        INFO
      </p>
      <Card>
        <Row
          icon={<Icon name="star" className="h-5 w-5" />}
          label="My favorite"
          onClick={() => setView("favorites")}
        />
        <Row
          icon={<Icon name="clock" className="h-5 w-5" />}
          label="Recent viewed"
          onClick={() => setView("recent")}
        />
        <Row
          icon={<Icon name="refresh" className="h-5 w-5" />}
          label="Returns & exchange"
          onClick={() => setView("returns")}
        />
        <Row
          icon={<Icon name="file" className="h-5 w-5" />}
          label="Policies"
          href="/faq"
        />
        <Row
          icon={<Icon name="user" className="h-5 w-5" />}
          label="Contact"
          href={whatsappHref("Hi G-Products")}
        />
        <Row
          icon={<Icon name="file" className="h-5 w-5" />}
          label="Terms of service"
          href="/terms"
        />
        <Row
          icon={<Icon name="shield" className="h-5 w-5" />}
          label="Privacy policy"
          href="/privacy"
        />
      </Card>

      <p className="mb-2 mt-6 text-[13px] font-extrabold tracking-[0.04em] text-[#1c3d34]">
        SOCIAL
      </p>
      <Card>
        {socialRows.map((item) => (
          <Row
            key={item.label}
            icon={<BrandGlyph name={item.label} />}
            label={item.label}
            href={item.href || whatsappHref(`Hi G-Products, I'm looking for you on ${item.label}.`)}
          />
        ))}
      </Card>

      {chat}
    </div>
  );
}
