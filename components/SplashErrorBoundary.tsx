"use client";

import { Component, type ReactNode } from "react";

/**
 * Isolates splash failures so they cannot blank the entire shop
 * (AppSplash sits in the root layout above every page).
 */
export class SplashErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error) {
    console.error("[AppSplash]", error);
    try {
      document.documentElement.classList.remove("gp-splash-boot");
    } catch {
      /* ignore */
    }
  }

  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}
