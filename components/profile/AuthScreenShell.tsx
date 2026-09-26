"use client";

import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Icon } from "@/components/Icons";
import type { ReactNode } from "react";

const shopPhotos = [
  "/products/catalog/jbl-headphones-1.jpg",
  "/products/catalog/airpods-pro-2-type-c-1.jpg",
  "/products/catalog/calus-s69-speaker-1.jpg",
  "/products/catalog/extension-6-way-5m-1.jpg",
  "/products/catalog/flash-disk-32gb-1.jpg",
  "/products/catalog/hard-drive-500gb-1.jpg",
  "/products/catalog/casio-scientific-calculator-1.jpg"
];

/** Full-screen sign-in chrome. Customer and admin never share a door. */
export function AuthScreenShell({
  children,
  tone = "customer",
  tagline,
  headline,
  points,
  footer
}: {
  children: ReactNode;
  tone?: "customer" | "admin";
  tagline?: string;
  headline?: string;
  points?: string[];
  footer?: ReactNode;
}) {
  const isAdmin = tone === "admin";

  if (tone === "customer") {
    return (
      <div className="auth-screen auth-screen--customer">
        <div className="auth-customer-layout">
          <aside className="auth-gallery" aria-label="G-Products">
            {shopPhotos.map((src) => (
              // eslint-disable-next-line @next/next/no-img-element -- real catalogue photos
              <img key={src} src={src} alt="" />
            ))}
            <div className="auth-gallery-mark">
              <Logo variant="lockupNavy" size="lg" priority />
            </div>
          </aside>
          <div className="auth-customer-form">
            {children}
            {footer ?? (
              <p className="auth-back">
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 font-semibold text-ink-700 hover:text-ink-850"
                >
                  <Icon name="chevron-left" className="h-3.5 w-3.5" />
                  Back to the shop
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`auth-screen auth-screen--${tone}`}>
      <div className="auth-screen-bg" aria-hidden>
        <div className="auth-orb auth-orb-a" />
        <div className="auth-orb auth-orb-b" />
        <div className="auth-grid" />
      </div>

      <div className="auth-screen-inner auth-split">
        <aside className="auth-aside">
            <Logo size="xl" priority />
            <p className="auth-aside-kicker">{tagline}</p>
            <h2 className="auth-aside-title">{headline}</h2>
            {points && points.length > 0 ? (
              <ul className="auth-aside-points">
                {points.map((point) => (
                  <li key={point}>
                    <span className="auth-aside-dot" aria-hidden />
                    {point}
                  </li>
                ))}
              </ul>
            ) : null}
          </aside>

        <div className="auth-split-main">
          {children}
          {footer ??
            (isAdmin ? (
              <p className="auth-back">Admin access only.</p>
            ) : (
              <p className="auth-back">
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 font-semibold text-ink-700 hover:text-ink-850"
                >
                  <Icon name="chevron-left" className="h-3.5 w-3.5" />
                  Back to the shop
                </Link>
              </p>
            ))}
        </div>
      </div>
    </div>
  );
}
