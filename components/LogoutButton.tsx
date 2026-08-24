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
  variant: "text" | "icon";
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
  variant?: "text" | "icon";
}) {
  return (
    <form action="/api/auth/logout" method="post" className="contents">
      <LogoutSubmit
        className={className}
        label={label}
        pendingLabel={pendingLabel}
        variant={variant}
      />
    </form>
  );
}
