"use client";

import { useFormStatus } from "react-dom";
import { Icon } from "@/components/Icons";

function LogoutSubmit({
  className,
  label,
  pendingLabel,
  variant
}: {
  className?: string;
  label: string;
  pendingLabel: string;
  variant: "text" | "icon" | "prominent";
}) {
  const { pending } = useFormStatus();
  const text = pending ? pendingLabel : label;
  return (
    <button
      type="submit"
      disabled={pending}
      className={`disabled:opacity-60 ${className ?? ""}`}
      aria-label={label}
      title={label}
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

export function LogoutButton({
  className,
  label = "Sign out",
  pendingLabel = "Signing out…",
  variant = "text"
}: {
  className?: string;
  label?: string;
  pendingLabel?: string;
  variant?: "text" | "icon" | "prominent";
}) {
  const defaultClass =
    variant === "prominent"
      ? "inline-flex items-center justify-center gap-2 rounded-pill border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-bold text-red-700 transition-colors hover:border-red-300 hover:bg-red-100"
      : "";

  return (
    <form action="/api/auth/logout" method="post" className="contents">
      <LogoutSubmit
        className={className ?? defaultClass}
        label={label}
        pendingLabel={pendingLabel}
        variant={variant}
      />
    </form>
  );
}
