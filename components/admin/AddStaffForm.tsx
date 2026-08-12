"use client";

import { useActionState, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { addStaff, type StaffState } from "@/app/admin/(dashboard)/staff/actions";
import { passwordChecks } from "@/lib/password";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-pill bg-brand px-6 py-2.5 text-sm font-bold text-ink-950 hover:bg-brand-soft disabled:opacity-60"
    >
      {pending ? "Adding..." : "Add staff & set password"}
    </button>
  );
}

export function AddStaffForm() {
  const [state, action] = useActionState<StaffState | undefined, FormData>(
    addStaff,
    undefined
  );
  const [password, setPassword] = useState("");
  const checks = useMemo(() => passwordChecks(password), [password]);

  return (
    <form action={action} className="space-y-4">
      <p className="rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-sm text-white/50">
        Create their login here, then send them the <strong className="text-white/70">email</strong> and{" "}
        <strong className="text-white/70">password</strong>. They sign in on Profile — they
        can’t create their own desk account.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="field-label">Name</span>
          <input name="name" className="field" placeholder="Full name" required />
        </label>
        <label className="block">
          <span className="field-label">Email (username)</span>
          <input
            name="email"
            type="email"
            className="field"
            placeholder="name@gproducts.zm"
            required
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="field-label">Password you’ll share with them</span>
          <input
            name="password"
            type="text"
            className="field font-mono tracking-wide"
            placeholder="Set a strong password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          <span className="field-label">Phone (optional)</span>
          <input name="phone" type="tel" className="field" placeholder="0972…" />
        </label>
        <label className="block sm:col-span-2">
          <span className="field-label">Role on the desk</span>
          <input
            name="staffTitle"
            className="field"
            placeholder="e.g. Orders & uploads, Shop floor, Services desk"
            required
            list="staff-role-suggestions"
          />
          <datalist id="staff-role-suggestions">
            <option value="Orders & sales" />
            <option value="Products & uploads" />
            <option value="Services desk" />
            <option value="Stock & inventory" />
          </datalist>
          <p className="mt-2 text-xs text-white/40">
            Write what this person does — products, orders, services, etc. They
            sign in on Profile with the email and password above.
          </p>
        </label>
      </div>

      {state?.error && (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {state.error}
        </p>
      )}
      {state?.success && (
        <p className="rounded-lg bg-accent/10 px-3 py-2 text-sm text-accent">
          {state.success} Share the email + password so they can Sign in on Profile.
        </p>
      )}

      <Submit />
    </form>
  );
}
