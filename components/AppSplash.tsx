"use client";

import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";

const SESSION_KEY = "gproducts-splash-seen-v2";

/** G-Products opening splash — official lockup on live brand motion (~5s). */
const HOLD_MS = 5000;
const FADE_MS = 600;
const TOTAL_MS = HOLD_MS + FADE_MS;

/** Survives React Strict Mode remounts within one page load. */
let splashHideTimer: number | null = null;

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

function removeBootSplash(): void {
  document.documentElement.classList.remove("gp-splash-boot");
  document.getElementById("gp-splash-boot")?.remove();
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
      removeBootSplash();
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
    removeBootSplash();

    if (splashHideTimer !== null) return;

    splashHideTimer = window.setTimeout(() => {
      setVisible(false);
      markSplashSeen();
      splashHideTimer = null;
    }, TOTAL_MS);
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
      <div className="app-splash-mesh" aria-hidden />
      <div className="app-splash-rays" aria-hidden />
      <div className="app-splash-shine" aria-hidden />
      <div className="app-splash-ring" aria-hidden />
      <div className="app-splash-ring app-splash-ring-b" aria-hidden />
      <div className="app-splash-ring app-splash-ring-c" aria-hidden />

      <div className="app-splash-logo-wrap">
        <Logo variant="lockupNavy" size="splash" priority className="app-splash-lockup" />
      </div>
    </div>
  );
}
