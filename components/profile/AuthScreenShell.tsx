"use client";

import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Icon } from "@/components/Icons";
import { siteConfig } from "@/config/site";
import type { ReactNode } from "react";

/** Static auth chrome — SSR-friendly shell around the interactive card. */
export function AuthScreenShell({
  children,
  tagline,
  footer
}: {
  children: ReactNode;
  tagline?: string;
  footer?: ReactNode;
}) {
  return (
    <div className="auth-screen">
      <div className="auth-screen-bg" aria-hidden>
        <div className="auth-orb auth-orb-a" />
        <div className="auth-orb auth-orb-b" />
        <div className="auth-ambient-glow" />
      </div>

      <div className="auth-screen-inner">
        <header className="auth-brand">
          <Logo variant="lockupNavy" size="xl" priority />
          <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.24em] text-gp-text-subtle">
            {tagline ?? siteConfig.tagline}
          </p>
        </header>

        {children}

        {footer ?? (
          <p className="auth-back">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 font-semibold text-ink-700 hover:text-ink-850"
            >
              <Icon name="chevron-left" className="h-3.5 w-3.5" />
              Back to shop
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
