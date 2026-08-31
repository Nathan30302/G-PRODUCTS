"use client";

import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { siteConfig } from "@/config/site";

const SESSION_KEY = "gproducts-splash-seen";

/** G-Products opening splash — logo first, brand colors bloom around it (~4s). */
const HOLD_MS = 4200;
const FADE_MS = 600;

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
    const fadeTimer = window.setTimeout(() => setFadeOut(true), HOLD_MS);
    const hideTimer = window.setTimeout(
      () => setVisible(false),
      HOLD_MS + FADE_MS
    );

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
      <div className="app-splash-ring" aria-hidden />
      <div className="app-splash-ring app-splash-ring-b" aria-hidden />
      <div className="app-splash-ring app-splash-ring-c" aria-hidden />

      <div className="app-splash-logo-wrap">
        <div className="app-splash-logo-stage">
          <Logo size="xl" priority presentation="splash" />
        </div>
        <p className="app-splash-tagline">{siteConfig.tagline}</p>
      </div>
    </div>
  );
}
