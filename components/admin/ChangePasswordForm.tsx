"use client";

import { useActionState, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  changeDeskPassword,
  type PasswordState
} from "@/app/admin/(dashboard)/account/actions";
import { passwordChecks } from "@/lib/password";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-brand px-6 py-2.5 text-sm disabled:opacity-60"
    >
      {pending ? "Saving…" : "Update password"}
    </button>
  );
}

export function ChangePasswordForm() {
  const [state, action] = useActionState<PasswordState | undefined, FormData>(
    changeDeskPassword,
    undefined
  );
  const [next, setNext] = useState("");
  const checks = useMemo(() => passwordChecks(next), [next]);

  return (
    <form action={action} className="max-w-lg space-y-4">
      <label className="block">
        <span className="field-label">Current password</span>
        <input
          name="currentPassword"
          type="password"
          autoComplete="current-password"
          required
          className="field"
        />
      </label>
      <label className="block">
        <span className="field-label">New password</span>
        <input
          name="newPassword"
          type="password"
          autoComplete="new-password"
          required
          className="field"
          value={next}
          onChange={(e) => setNext(e.target.value)}
        />
        <ul className="mt-2 grid grid-cols-1 gap-1 sm:grid-cols-2">
          {checks.map((c) => (
            <li
              key={c.id}
              className={`text-[11px] ${c.ok ? "text-accent" : "text-white/30"}`}
            >
              {c.ok ? "✓" : "·"} {c.label}
            </li>
          ))}
        </ul>
      </label>
      <label className="block">
        <span className="field-label">Confirm new password</span>
        <input
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          className="field"
        />
      </label>

      {state?.error ? (
        <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {state.error}
        </p>
      ) : null}
      {state?.success ? (
        <p className="rounded-2xl border border-accent/20 bg-accent/10 px-4 py-3 text-sm text-accent">
          {state.success}
        </p>
      ) : null}

      <Submit />
    </form>
  );
}
