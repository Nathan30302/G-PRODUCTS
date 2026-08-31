"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "@/components/Icons";

const STORAGE_KEY = "gp-notifications-seen";

/** Bell with badge — clears after first visit to profile/orders hub. */
export function NotificationsBell({ className = "" }: { className?: string }) {
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    try {
      const seen = localStorage.getItem(STORAGE_KEY);
      setUnread(seen ? 0 : 1);
    } catch {
      setUnread(0);
    }
  }, []);

  function markSeen() {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setUnread(0);
  }

  return (
    <Link
      href="/profile"
      onClick={markSeen}
      aria-label={unread ? "Notifications — 1 unread" : "Notifications"}
      className={`relative grid h-11 w-11 place-items-center rounded-xl border border-gp-border bg-gp-surface text-gp-text-muted transition-colors hover:border-ink-700/30 hover:text-ink-700 sm:rounded-2xl ${className}`}
    >
      <Icon name="bell" className="h-5 w-5" />
      {unread > 0 ? (
        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-ink-700 ring-2 ring-white" />
      ) : null}
    </Link>
  );
}
