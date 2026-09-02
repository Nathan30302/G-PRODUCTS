"use client";

import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { siteConfig } from "@/config/site";

const SESSION_KEY = "gproducts-splash-seen";

/** G-Products opening splash — logo first, live brand motion (~5s). */
const HOLD_MS = 5000;
const FADE_MS = 600;
const TOTAL_MS = HOLD_MS + FADE_MS;

/** Survives React Strict Mode remounts within one page load. */
let splashHideTimer: number | null = null;

function hasSeenSplash(): boolean {
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

export function AppSplash() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (hasSeenSplash()) return;

    setVisible(true);

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
        <div className="app-splash-logo-stage">
          <Logo variant="mark" size="xxl" priority />
        </div>
        <p className="app-splash-tagline">{siteConfig.tagline}</p>
      </div>
    </div>
  );
}
