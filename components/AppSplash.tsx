"use client";

import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { siteConfig } from "@/config/site";

const SESSION_KEY = "gproducts-splash-seen";

/**
 * Premium opening splash — white / yellow / green sunburst with clean G mark.
 */
export function AppSplash() {
  const [visible, setVisible] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return;
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* private mode */
    }

    setVisible(true);
    const fadeTimer = window.setTimeout(() => setFadeOut(true), 1800);
    const hideTimer = window.setTimeout(() => setVisible(false), 2450);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`app-splash ${fadeOut ? "app-splash-out" : ""}`}
      role="presentation"
      aria-hidden={fadeOut}
    >
      <div className="app-splash-bg" aria-hidden />
      <div className="app-splash-mesh" aria-hidden />
      <div className="app-splash-rays" aria-hidden />
      <div className="app-splash-shine" aria-hidden />
      <div className="app-splash-logo-wrap">
        <Logo size="xl" priority />
        <p className="app-splash-tagline">{siteConfig.tagline}</p>
      </div>
    </div>
  );
}
