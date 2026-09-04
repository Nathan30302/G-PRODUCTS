"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";

const SESSION_KEY = "gproducts-splash-seen-v3";

/** Reference splash — 5s branded hold, then 0.6s fade into the shop. */
const HOLD_MS = 5000;
const FADE_MS = 600;
const TOTAL_MS = HOLD_MS + FADE_MS;

function shouldForceSplash(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return new URLSearchParams(window.location.search).get("splash") === "1";
  } catch {
    return false;
  }
}

function hasSeenSplash(): boolean {
  if (shouldForceSplash()) return false;
  try {
    return !!sessionStorage.getItem(SESSION_KEY);
  } catch {
    return false;
  }
}

function markSplashSeen(): void {
  try {
    sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    /* private mode */
  }
}

/** Hide the pre-React boot layer via CSS only — never remove the DOM node (React owns it). */
function hideBootSplash(): void {
  document.documentElement.classList.remove("gp-splash-boot");
}

function shouldShowSplash(): boolean {
  if (typeof window === "undefined") return false;
  if (shouldForceSplash()) return true;
  if (document.documentElement.classList.contains("gp-splash-boot")) return true;
  return !hasSeenSplash();
}

export function AppSplash() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!shouldShowSplash()) {
      hideBootSplash();
      return;
    }

    if (shouldForceSplash()) {
      try {
        sessionStorage.removeItem(SESSION_KEY);
      } catch {
        /* private mode */
      }
    }

    setVisible(true);
    hideBootSplash();

    const timer = window.setTimeout(() => {
      setVisible(false);
      markSplashSeen();
    }, TOTAL_MS);

    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="app-splash"
      role="presentation"
      aria-hidden={false}
      style={
        {
          "--app-splash-hold-ms": `${HOLD_MS}ms`,
          "--app-splash-fade-ms": `${FADE_MS}ms`
        } as React.CSSProperties
      }
    >
      <div className="app-splash-bg" aria-hidden />
      <div className="app-splash-rays" aria-hidden />
      <div className="app-splash-vignette" aria-hidden />

      <div className="app-splash-brand">
        <div className="app-splash-mark-wrap">
          <span className="app-splash-mark-glow" aria-hidden />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={siteConfig.logoMark}
            alt=""
            width={168}
            height={168}
            decoding="async"
            className="app-splash-mark"
          />
        </div>
        <p className="app-splash-name">G-PRODUCTS</p>
        <p className="app-splash-tag">AND SERVICES</p>
      </div>

      <p className="app-splash-footer">g-products.store</p>
    </div>
  );
}
