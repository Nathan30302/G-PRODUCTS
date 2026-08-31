import Link from "next/link";
import { ReactNode } from "react";
import { Icon } from "@/components/Icons";

export function ShopSectionHeader({
  eyebrow,
  title,
  subtitle,
  action
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        {eyebrow ? <p className="section-label">{eyebrow}</p> : null}
        <h2 className={`display heading-section ${eyebrow ? "mt-2" : ""}`}>
          {title}
        </h2>
        {subtitle ? (
          <p className="text-subtitle mt-2 max-w-xl">{subtitle}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export function ShopEmptyState({
  icon = "cart",
  title,
  description,
  action
}: {
  icon?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="gp-card flex flex-col items-center p-10 text-center sm:p-12">
      <span className="grid h-16 w-16 place-items-center rounded-2xl bg-gp-muted text-ink-700 ring-1 ring-gp-border">
        <Icon name={icon} className="h-7 w-7" />
      </span>
      <p className="mt-5 text-lg font-semibold text-gp-text">{title}</p>
      {description ? (
        <p className="text-subtitle mt-2 max-w-sm">{description}</p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

export function ShopStickyBar({ children }: { children: ReactNode }) {
  return (
    <div
      className="fixed inset-x-0 z-40 border-t border-gp-border bg-white/96 px-4 py-3 shadow-float backdrop-blur-lg md:pb-[max(0.75rem,var(--safe-bottom))] lg:hidden"
      style={{ bottom: "var(--mobile-nav-offset)" }}
    >
      {children}
    </div>
  );
}

const ORDER_STATUS: Record<string, string> = {
  PENDING: "border-brand/40 bg-brand/10 text-ink-800",
  PAID: "border-accent/35 bg-accent/10 text-accent-dark",
  PREPARING: "border-sky-300 bg-sky-50 text-sky-800",
  READY: "border-amber-300 bg-amber-50 text-amber-900",
  DELIVERED: "border-gp-border bg-gp-muted text-gp-text-muted",
  CANCELLED: "border-red-200 bg-red-50 text-red-700",
  NEW: "border-brand/40 bg-brand/10 text-ink-800",
  CONFIRMED: "border-sky-300 bg-sky-50 text-sky-800",
  IN_PROGRESS: "border-amber-300 bg-amber-50 text-amber-900",
  SUCCESS: "border-accent/35 bg-accent/10 text-accent-dark",
  FAILED: "border-red-200 bg-red-50 text-red-700"
};

export function ShopStatusPill({ status }: { status: string }) {
  const cls =
    ORDER_STATUS[status] ?? "border-gp-border bg-gp-muted text-gp-text-muted";
  return (
    <span
      className={`inline-flex rounded-pill border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${cls}`}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}

export function ShopQuickLink({
  href,
  icon,
  title,
  subtitle
}: {
  href: string;
  icon: string;
  title: string;
  subtitle: string;
}) {
  return (
    <Link
      href={href}
      className="group gp-card block transition-all duration-300 ease-out-expo hover:-translate-y-0.5 hover:shadow-card-hover"
    >
      <span className="grid h-11 w-11 place-items-center rounded-xl bg-gp-muted text-ink-700 ring-1 ring-gp-border transition-colors group-hover:bg-ink-700/10">
        <Icon name={icon} className="h-5 w-5" />
      </span>
      <p className="mt-4 font-bold text-gp-text">{title}</p>
      <p className="text-caption mt-1">{subtitle}</p>
    </Link>
  );
}
