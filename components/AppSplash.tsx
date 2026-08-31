"use client";

import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";

const SESSION_KEY = "gproducts-splash-seen";

/**
 * Premium opening splash — G mark on brand sunburst, once per browser session.
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
    const fadeTimer = window.setTimeout(() => setFadeOut(true), 1600);
    const hideTimer = window.setTimeout(() => setVisible(false), 2200);

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
      <div className="app-splash-bg" />
      <div className="app-splash-rays" aria-hidden />
      <div className="app-splash-glow" aria-hidden />
      <div className="app-splash-logo">
        <Logo size="xl" priority />
      </div>
    </div>
  );
}
