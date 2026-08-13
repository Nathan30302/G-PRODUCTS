"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LogoutButton({
  className,
  label = "Sign out"
}: {
  className?: string;
  label?: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function logout() {
    setPending(true);
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "same-origin"
      });
    } catch {
      // still leave
    }
    router.push("/profile");
    router.refresh();
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
