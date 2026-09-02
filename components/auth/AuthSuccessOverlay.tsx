"use client";

import { Icon } from "@/components/Icons";

export function AuthSuccessOverlay({ message }: { message: string }) {
  return (
    <div className="auth-success-overlay" role="status" aria-live="polite">
      <span className="auth-success-icon" aria-hidden>
        <Icon name="check" className="h-7 w-7" />
      </span>
      <p className="mt-3 text-sm font-bold text-gp-text">{message}</p>
    </div>
  );
}
