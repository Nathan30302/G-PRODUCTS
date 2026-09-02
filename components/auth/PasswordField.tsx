"use client";

import { useMemo, useState, type ChangeEvent } from "react";
import { passwordChecks } from "@/lib/password";
import { AuthField } from "@/components/auth/AuthField";

export function PasswordField({
  name,
  label,
  autoComplete,
  value,
  onChange,
  showMeter,
  error
}: {
  name: string;
  label: string;
  autoComplete: string;
  value?: string;
  onChange?: (v: string) => void;
  showMeter?: boolean;
  error?: string | null;
}) {
  const [show, setShow] = useState(false);
  const checks = useMemo(() => passwordChecks(value ?? ""), [value]);
  const score = checks.filter((c) => c.ok).length;

  return (
    <div>
      <AuthField
        label={label}
        name={name}
        icon="lock"
        type={show ? "text" : "password"}
        autoComplete={autoComplete}
        required
        enterKeyHint={showMeter ? "next" : "go"}
        placeholder="Enter password"
        error={error}
        {...(onChange
          ? {
              value: value ?? "",
              onChange: (e: ChangeEvent<HTMLInputElement>) =>
                onChange(e.target.value)
            }
          : {})}
        trailing={
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            className="auth-input-action min-h-11 min-w-11"
            aria-label={show ? "Hide password" : "Show password"}
          >
            {show ? "Hide" : "Show"}
          </button>
        }
      />

      {showMeter && value !== undefined ? (
        <div className="mt-3 space-y-2.5">
          <div className="flex gap-1" aria-hidden>
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  i < score
                    ? score <= 2
                      ? "bg-red-400"
                      : score <= 4
                        ? "bg-brand"
                        : "bg-accent"
                    : "bg-gp-border"
                }`}
              />
            ))}
          </div>
          <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            {checks.map((c) => (
              <li
                key={c.id}
                className={`flex items-center gap-1.5 text-[11px] ${
                  c.ok ? "text-accent-dark" : "text-gp-text-subtle"
                }`}
              >
                <span
                  className={`grid h-3.5 w-3.5 place-items-center rounded-full text-[9px] ${
                    c.ok ? "bg-accent/15 text-accent-dark" : "bg-gp-muted"
                  }`}
                >
                  {c.ok ? "✓" : ""}
                </span>
                {c.label}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
