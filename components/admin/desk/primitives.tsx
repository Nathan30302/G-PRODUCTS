import Link from "next/link";
import { ReactNode } from "react";
import {
  labelForOrderStatus,
  labelForServiceStatus,
  orderStatusLabels,
  serviceStatusLabels
} from "@/lib/commerce-hooks";

export function DeskPageHeader({
  eyebrow,
  title,
  description,
  actions
}: {
  eyebrow: string;
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-ink-700">
          {eyebrow}
        </p>
        <h1 className="display mt-1.5 text-[1.85rem] leading-[1.1] tracking-tight text-gp-text sm:text-4xl">
          {title}
        </h1>
        {description ? (
          <div className="mt-2.5 max-w-2xl text-sm leading-relaxed text-gp-text-muted">
            {description}
          </div>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}

export function DeskSectionTitle({
  eyebrow,
  title,
  action
}: {
  eyebrow: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-3">
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gp-text-subtle">
          {eyebrow}
        </p>
        <h2 className="display mt-1 text-lg text-gp-text sm:text-xl">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export type DeskStatTone = "default" | "warn" | "good" | "brand";

export function DeskStat({
  label,
  value,
  href,
  tone = "default",
  hint
}: {
  label: string;
  value: string | number;
  href?: string;
  tone?: DeskStatTone;
  hint?: string;
}) {
  const tones: Record<DeskStatTone, string> = {
    default: "border-gp-border bg-gp-surface",
    warn: "border-brand/45 bg-brand/[0.14]",
    good: "border-accent/40 bg-accent/[0.14]",
    brand: "border-ink-700/20 bg-gradient-to-br from-brand/20 to-accent/[0.14]"
  };
  // Tinted cards need a darker label than plain white ones or it washes out.
  const labelTone =
    tone === "default" ? "text-gp-text-subtle" : "text-gp-text-muted";

  const inner = (
    <div
      className={`relative overflow-hidden rounded-[1.35rem] border p-5 shadow-card shadow-lit transition-all duration-300 ease-out-expo sm:p-6 ${
        href
          ? "hover:-translate-y-0.5 hover:shadow-card-hover active:translate-y-0 active:scale-[0.99]"
          : ""
      } ${tones[tone]}`}
    >
      <p
        className={`text-[10px] font-semibold uppercase tracking-[0.16em] sm:text-[11px] ${labelTone}`}
      >
        {label}
      </p>
      <p className="mt-3 text-2xl font-black tabular-nums tracking-tight text-gp-text sm:text-[1.75rem]">
        {value}
      </p>
      {hint ? (
        <p className="mt-1.5 text-xs leading-snug text-gp-text-muted">{hint}</p>
      ) : href ? (
        <p className="mt-1.5 text-[11px] font-semibold text-ink-700">Open</p>
      ) : null}
    </div>
  );
  return href ? (
    <Link href={href} className="block">
      {inner}
    </Link>
  ) : (
    inner
  );
}

export function DeskStatGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {children}
    </div>
  );
}

export function DeskPanel({
  children,
  className = ""
}: {
  children: ReactNode;
  className?: string;
  flush?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[1.35rem] border border-gp-border/70 bg-gp-surface shadow-card shadow-lit ${className}`}
    >
      {children}
    </div>
  );
}

export function DeskPanelHeader({
  title,
  subtitle,
  action
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-gp-border/70 bg-gp-muted/40 px-4 py-3.5 sm:px-5">
      <div className="min-w-0">
        <p className="text-sm font-bold text-gp-text">{title}</p>
        {subtitle ? (
          <p className="mt-0.5 text-xs text-gp-text-muted">{subtitle}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export function DeskEmpty({
  title,
  description,
  action
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center sm:py-16">
      <div className="grid h-14 w-14 place-items-center rounded-2xl border border-brand/25 bg-brand/10 text-ink-700">
        <svg
          className="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
        >
          <rect x="4" y="4" width="16" height="16" rx="3" />
          <path d="M8 12h8M12 8v8" />
        </svg>
      </div>
      <p className="mt-5 text-base font-bold text-gp-text sm:text-lg">{title}</p>
      {description ? (
        <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-gp-text-muted">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export const ORDER_STATUS_STYLE: Record<string, string> = {
  PENDING: "border-brand/35 bg-brand/15 text-ink-850",
  PAID: "border-accent/35 bg-accent/15 text-ink-850",
  PREPARING: "border-sky-300/50 bg-sky-50 text-sky-800",
  READY: "border-amber-300/50 bg-amber-50 text-amber-900",
  DELIVERED: "border-gp-border bg-gp-muted text-gp-text-muted",
  CANCELLED: "border-red-200 bg-red-50 text-red-700"
};

export const SERVICE_STATUS_STYLE: Record<string, string> = {
  NEW: "border-brand/35 bg-brand/15 text-ink-850",
  CONFIRMED: "border-sky-300/50 bg-sky-50 text-sky-800",
  IN_PROGRESS: "border-amber-300/50 bg-amber-50 text-amber-900",
  READY: "border-accent/35 bg-accent/15 text-ink-850",
  DELIVERED: "border-gp-border bg-gp-muted text-gp-text-muted",
  CANCELLED: "border-red-200 bg-red-50 text-red-700"
};

export function StatusPill({
  status,
  kind = "order"
}: {
  status: string;
  kind?: "order" | "service" | "payment";
}) {
  const map =
    kind === "service"
      ? SERVICE_STATUS_STYLE
      : kind === "payment"
        ? {
            SUCCESS: "border-accent/35 bg-accent/15 text-ink-850",
            PENDING: "border-brand/35 bg-brand/15 text-ink-850",
            FAILED: "border-red-200 bg-red-50 text-red-700"
          }
        : ORDER_STATUS_STYLE;
  const cls =
    map[status] ?? "border-gp-border bg-gp-muted text-gp-text-muted";
  const label =
    kind === "order" && status in orderStatusLabels
      ? labelForOrderStatus(status).label
      : kind === "service" && status in serviceStatusLabels
        ? labelForServiceStatus(status).label
        : status
            .toLowerCase()
            .replace(/_/g, " ")
            .replace(/^\w/, (c) => c.toUpperCase());
  return (
    <span
      className={`inline-flex rounded-pill border px-2.5 py-1 text-[11px] font-bold tracking-wide ${cls}`}
    >
      {label}
    </span>
  );
}

export function DeskFilterBar({
  param = "status",
  basePath,
  active,
  options
}: {
  param?: string;
  basePath: string;
  active: string | null;
  options: { value: string; label: string; count?: number }[];
}) {
  function hrefFor(value: string): string {
    const [path, existing = ""] = basePath.split("?");
    const q = new URLSearchParams(existing);
    if (value === "ALL") q.delete(param);
    else q.set(param, value);
    const s = q.toString();
    return s ? `${path}?${s}` : path;
  }

  return (
    <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 no-scrollbar sm:flex-wrap sm:overflow-visible">
      {options.map((opt) => {
        const isActive =
          (opt.value === "ALL" && !active) || active === opt.value;
        const href = hrefFor(opt.value);
        return (
          <Link
            key={opt.value}
            href={href}
            className={`shrink-0 rounded-pill border px-3.5 py-2 text-xs font-bold transition-all duration-200 ease-out-expo active:scale-[0.97] ${
              isActive
                ? "border-ink-850 bg-ink-850 text-white shadow-float"
                : "border-gp-border bg-gp-surface text-gp-text-muted shadow-sm hover:-translate-y-px hover:border-ink-700/25 hover:text-gp-text hover:shadow-card"
            }`}
          >
            {opt.label}
            {typeof opt.count === "number" ? (
              <span
                className={`ml-1.5 tabular-nums ${
                  isActive ? "text-white/80" : "text-gp-text-subtle"
                }`}
              >
                {opt.count}
              </span>
            ) : null}
          </Link>
        );
      })}
    </div>
  );
}

export function DeskHero({
  children,
  className = ""
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`relative overflow-hidden rounded-[1.5rem] border border-gp-border/70 bg-gp-surface p-5 shadow-card shadow-lit sm:rounded-[1.65rem] sm:p-8 ${className}`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand/[0.07] via-transparent to-accent/[0.05]" />
      <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-brand/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 left-6 h-36 w-36 rounded-full bg-accent/20 blur-3xl" />
      <div className="relative">{children}</div>
    </section>
  );
}
