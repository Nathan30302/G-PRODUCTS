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
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2 className={`display heading-section ${eyebrow ? "mt-1.5" : ""}`}>
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-2 max-w-xl text-sm text-gp-text-muted">{subtitle}</p>
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
    <div className="flex flex-col items-center rounded-[1.35rem] border border-gp-border bg-gp-surface p-10 text-center shadow-card sm:p-12">
      <span className="grid h-16 w-16 place-items-center rounded-2xl bg-accent/10 text-accent ring-1 ring-accent/20">
        <Icon name={icon} className="h-7 w-7" />
      </span>
      <p className="mt-5 text-lg font-semibold text-gp-text">{title}</p>
      {description ? (
        <p className="mt-1.5 max-w-sm text-sm text-gp-text-muted">{description}</p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

export function ShopStickyBar({ children }: { children: ReactNode }) {
  return (
    <div
      className="fixed inset-x-0 z-40 border-t border-gp-border bg-gp-surface/95 px-4 py-3 backdrop-blur-lg md:pb-[max(0.75rem,var(--safe-bottom))] lg:hidden"
      style={{ bottom: "var(--mobile-nav-offset)" }}
    >
      {children}
    </div>
  );
}

const ORDER_STATUS: Record<string, string> = {
  PENDING: "border-brand/30 bg-brand/10 text-brand",
  PAID: "border-accent/30 bg-accent/10 text-accent",
  PREPARING: "border-sky-400/30 bg-sky-400/10 text-sky-300",
  READY: "border-amber-400/30 bg-amber-400/10 text-amber-200",
  DELIVERED: "border-white/15 bg-white/[0.04] text-white/70",
  CANCELLED: "border-red-400/30 bg-red-400/10 text-red-300",
  NEW: "border-brand/30 bg-brand/10 text-brand",
  CONFIRMED: "border-sky-400/30 bg-sky-400/10 text-sky-300",
  IN_PROGRESS: "border-amber-400/30 bg-amber-400/10 text-amber-200",
  SUCCESS: "border-accent/30 bg-accent/10 text-accent",
  FAILED: "border-red-400/30 bg-red-400/10 text-red-300"
};

export function ShopStatusPill({ status }: { status: string }) {
  const cls =
    ORDER_STATUS[status] ?? "border-white/15 bg-white/[0.04] text-white/65";
  return (
    <span
      className={`inline-flex rounded-pill border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${cls}`}
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
      className="group rounded-[1.25rem] border border-white/[0.08] bg-white/[0.03] px-5 py-4 transition-all duration-300 ease-out-expo hover:-translate-y-0.5 hover:border-brand/40 hover:bg-white/[0.05]"
    >
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand/10 text-brand ring-1 ring-brand/20 transition-colors group-hover:bg-brand/15">
        <Icon name={icon} className="h-5 w-5" />
      </span>
      <p className="mt-3 font-bold text-white">{title}</p>
      <p className="mt-1 text-xs text-white/40">{subtitle}</p>
    </Link>
  );
}
