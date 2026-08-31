import Link from "next/link";
import { Icon } from "@/components/Icons";
import type { ReactNode } from "react";

/** Reusable campus-packs style hero banner for services, bundles, etc. */
export function CampusBanner({
  eyebrow,
  title,
  description,
  cta,
  footnote,
  bullets
}: {
  eyebrow: string;
  title: string;
  description: string;
  cta?: { href: string; label: string };
  footnote?: string;
  bullets?: { icon: string; text: string }[];
}) {
  return (
    <div className="relative overflow-hidden rounded-[1.35rem] shadow-card sm:rounded-[1.5rem]">
      <div className="campus-packs-bg" aria-hidden>
        <div className="smoke-layer campus-smoke-a" />
        <div className="smoke-layer campus-smoke-b" />
        <div className="smoke-layer campus-smoke-c" />
        <div className="smoke-layer campus-smoke-d" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(6,24,28,0.35)_100%)]" />
      </div>

      <div className="relative px-5 py-7 sm:px-8 sm:py-9">
        <span className="rounded-pill bg-accent px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-ink-950 shadow-sm">
          {eyebrow}
        </span>
        <h1 className="display mt-3 max-w-xl text-[clamp(1.35rem,1rem+1.4vw,2rem)] font-extrabold leading-snug text-white">
          {title}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
          {description}
        </p>

        {bullets && bullets.length > 0 ? (
          <ul className="mt-5 grid gap-2.5 sm:grid-cols-3">
            {bullets.map((b) => (
              <li
                key={b.text}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2.5 text-sm font-medium text-white/80 backdrop-blur-sm"
              >
                <Icon name={b.icon} className="h-4 w-4 shrink-0 text-brand" />
                {b.text}
              </li>
            ))}
          </ul>
        ) : null}

        {cta ? (
          <Link
            href={cta.href}
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-pill bg-white px-6 py-2.5 text-sm font-bold text-ink-850 shadow-float transition-colors hover:bg-brand hover:text-ink-950"
          >
            {cta.label}
            <Icon name="arrow-right" className="h-4 w-4" />
          </Link>
        ) : null}

        {footnote ? (
          <p className="mt-3 text-[11px] font-medium text-white/55">{footnote}</p>
        ) : null}
      </div>
    </div>
  );
}

export function CampusBannerShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-[1.35rem] shadow-card sm:rounded-[1.5rem]">
      <div className="campus-packs-bg" aria-hidden>
        <div className="smoke-layer campus-smoke-a" />
        <div className="smoke-layer campus-smoke-b" />
        <div className="smoke-layer campus-smoke-c" />
        <div className="smoke-layer campus-smoke-d" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(6,24,28,0.35)_100%)]" />
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}
