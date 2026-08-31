"use client";

import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { siteConfig } from "@/config/site";

const SESSION_KEY = "gproducts-splash-seen";

/** Logo-first splash — crisp mark, subtle brand rings, fast exit. */
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
    const fadeTimer = window.setTimeout(() => setFadeOut(true), 950);
    const hideTimer = window.setTimeout(() => setVisible(false), 1250);

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
      <div className="app-splash-ring" aria-hidden />
      <div className="app-splash-ring app-splash-ring-b" aria-hidden />
      <div className="app-splash-logo-wrap">
        <div className="app-splash-logo-stage">
          <Logo size="xl" priority presentation="splash" />
        </div>
        <p className="app-splash-tagline">{siteConfig.tagline}</p>
      </div>
    </div>
  );
}
