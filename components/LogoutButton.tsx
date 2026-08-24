"use client";

import { useState } from "react";

export function LogoutButton({
  className,
  label = "Sign out"
}: {
  className?: string;
  label?: string;
}) {
  const [pending, setPending] = useState(false);

  async function logout() {
    setPending(true);
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
        cache: "no-store"
      });
    } catch {
      // still leave
    }
    window.location.assign("/profile");
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={pending}
      className={className}
    >
      {pending ? "Signing out…" : label}
    </button>
  );
}
