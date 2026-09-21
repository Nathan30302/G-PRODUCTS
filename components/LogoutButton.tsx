"use client";

import { useState } from "react";
import { Icon } from "@/components/Icons";

const SAFE_NEXT = new Set([
  "/profile",
  "/desk",
  "/desk/login",
  "/admin/login"
]);

export function LogoutButton({
  className,
  label = "Sign out",
  pendingLabel = "Signing out…",
  variant = "text",
  next = "/profile"
}: {
  className?: string;
  label?: string;
  pendingLabel?: string;
  variant?: "text" | "icon" | "prominent";
  /** Where to land after logout — desk uses /desk */
  next?: "/profile" | "/desk" | "/desk/login" | "/admin/login";
}) {
  const [pending, setPending] = useState(false);
  const dest = SAFE_NEXT.has(next) ? next : "/profile";
  const text = pending ? pendingLabel : label;

  const defaultClass =
    variant === "prominent"
      ? "inline-flex items-center justify-center gap-2 rounded-pill border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-bold text-red-700 transition-colors hover:border-red-300 hover:bg-red-100"
      : "";

  async function handleClick() {
    if (pending) return;
    setPending(true);
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({ next: dest }),
        credentials: "same-origin",
        cache: "no-store"
      });
    } catch {
      /* still leave the page */
    }
    // Hard navigation — clears RSC cache so the desk cannot stick on screen.
    window.location.replace(dest);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className={`disabled:opacity-60 ${className ?? defaultClass}`}
      aria-label={label}
      title={label}
      aria-busy={pending}
    >
      {variant === "icon" ? (
        <Icon name="logout" className="h-5 w-5" />
      ) : variant === "prominent" ? (
        <>
          <Icon name="logout" className="h-4 w-4" />
          {text}
        </>
      ) : (
        text
      )}
    </button>
  );
}
