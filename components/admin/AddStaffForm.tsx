"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { addStaff, type StaffState } from "@/app/admin/(dashboard)/staff/actions";

const field =
  "mt-1 w-full rounded-xl border border-ink-700 bg-ink-900 px-4 py-2.5 text-white outline-none focus:border-brand";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-pill bg-brand px-6 py-2.5 text-sm font-bold text-ink-950 hover:bg-brand-soft disabled:opacity-60"
    >
      {pending ? "Adding..." : "Add user"}
    </button>
  );
}

export function AddStaffForm() {
  const [state, action] = useActionState<StaffState | undefined, FormData>(
    addStaff,
    undefined
  );

  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm text-white/60">Name</span>
          <input name="name" className={field} placeholder="Full name" />
        </label>
        <label className="block">
          <span className="text-sm text-white/60">Email</span>
          <input
            name="email"
            type="email"
            className={field}
            placeholder="name@gproducts.zm"
          />
        </label>
        <label className="block">
          <span className="text-sm text-white/60">Password</span>
          <input
            name="password"
            type="text"
            className={field}
            placeholder="At least 6 characters"
          />
        </label>
        <label className="block">
          <span className="text-sm text-white/60">Role</span>
          <select name="role" defaultValue="STAFF" className={field}>
            <option value="STAFF">Staff</option>
            <option value="OWNER">Owner</option>
          </select>
        </label>
      </div>

      {state?.error && (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {state.error}
        </p>
      )}
      {state?.success && (
        <p className="rounded-lg bg-accent/10 px-3 py-2 text-sm text-accent">
          {state.success}
        </p>
      )}

      <Submit />
    </form>
  );
}
