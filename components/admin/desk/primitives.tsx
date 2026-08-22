import Link from "next/link";
import { ReactNode } from "react";

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
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand/90">
          {eyebrow}
        </p>
        <h1 className="display mt-1.5 text-3xl tracking-tight text-white sm:text-4xl">
          {title}
        </h1>
        {description ? (
          <div className="mt-2 max-w-2xl text-sm leading-relaxed text-white/50">
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
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/35">
          {eyebrow}
        </p>
        <h2 className="display mt-1 text-xl text-white">{title}</h2>
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
    default: "border-white/[0.06] bg-white/[0.02]",
    warn: "border-brand/25 bg-brand/[0.07]",
    good: "border-accent/25 bg-accent/[0.07]",
    brand: "border-white/[0.08] bg-gradient-to-br from-ink-850 to-ink-900"
  };
  const inner = (
    <div
      className={`rounded-2xl border p-4 transition-all duration-300 ease-out-expo hover:-translate-y-0.5 hover:border-brand/35 sm:p-5 ${tones[tone]}`}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/40">
        {label}
      </p>
      <p className="mt-2 text-2xl font-black tracking-tight text-white">
        {value}
      </p>
      {hint ? (
        <p className="mt-1.5 text-xs text-white/40">{hint}</p>
      ) : null}
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

export function DeskStatGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{children}</div>
  );
}

export function DeskPanel({
  children,
  className = "",
  flush = false
}: {
  children: ReactNode;
  className?: string;
  flush?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[1.35rem] border border-white/[0.07] bg-gradient-to-b from-ink-850/80 to-ink-900/70 shadow-card ${
        flush ? "" : ""
      } ${className}`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/25 to-transparent" />
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
    <div className="flex items-start justify-between gap-3 border-b border-white/[0.06] px-5 py-3.5">
      <div>
        <p className="text-sm font-bold text-white">{title}</p>
        {subtitle ? (
          <p className="mt-0.5 text-xs text-white/40">{subtitle}</p>
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
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-brand">
        <svg
          className="h-5 w-5"
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
      <p className="mt-4 text-base font-bold text-white">{title}</p>
      {description ? (
        <p className="mt-1.5 max-w-sm text-sm text-white/45">{description}</p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export const ORDER_STATUS_STYLE: Record<string, string> = {
  PENDING: "border-brand/30 bg-brand/10 text-brand",
  PAID: "border-accent/30 bg-accent/10 text-accent",
  PREPARING: "border-sky-400/30 bg-sky-400/10 text-sky-300",
  READY: "border-amber-400/30 bg-amber-400/10 text-amber-200",
  DELIVERED: "border-white/15 bg-white/[0.04] text-white/70",
  CANCELLED: "border-red-400/30 bg-red-400/10 text-red-300"
};

export const SERVICE_STATUS_STYLE: Record<string, string> = {
  NEW: "border-brand/30 bg-brand/10 text-brand",
  CONFIRMED: "border-sky-400/30 bg-sky-400/10 text-sky-300",
  IN_PROGRESS: "border-amber-400/30 bg-amber-400/10 text-amber-200",
  READY: "border-accent/30 bg-accent/10 text-accent",
  DELIVERED: "border-white/15 bg-white/[0.04] text-white/70",
  CANCELLED: "border-red-400/30 bg-red-400/10 text-red-300"
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
            SUCCESS: "border-accent/30 bg-accent/10 text-accent",
            PENDING: "border-brand/30 bg-brand/10 text-brand",
            FAILED: "border-red-400/30 bg-red-400/10 text-red-300"
          }
        : ORDER_STATUS_STYLE;
  const cls =
    map[status] ?? "border-white/15 bg-white/[0.04] text-white/65";
  return (
    <span
      className={`inline-flex rounded-pill border px-2.5 py-1 text-xs font-semibold ${cls}`}
    >
      {status}
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
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const isActive =
          (opt.value === "ALL" && !active) || active === opt.value;
        const href = hrefFor(opt.value);
        return (
          <Link
            key={opt.value}
            href={href}
            className={`rounded-pill border px-3.5 py-2 text-xs font-bold transition-all ${
              isActive
                ? "border-brand/50 bg-brand text-ink-950 shadow-brand-glow"
                : "border-white/10 bg-white/[0.03] text-white/65 hover:border-brand/35 hover:text-white"
            }`}
          >
            {opt.label}
            {typeof opt.count === "number" ? (
              <span
                className={`ml-1.5 tabular-nums ${
                  isActive ? "text-ink-950/55" : "text-white/35"
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
      className={`relative overflow-hidden rounded-[1.85rem] border border-white/[0.07] bg-gradient-to-br from-ink-850 via-ink-900 to-ink-950 p-6 shadow-card sm:p-8 ${className}`}
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand/15 blur-[80px]" />
      <div className="pointer-events-none absolute -bottom-20 left-10 h-48 w-48 rounded-full bg-accent/10 blur-[80px]" />
      <div className="relative">{children}</div>
    </section>
  );
}
