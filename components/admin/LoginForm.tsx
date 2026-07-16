"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { loginAction, type LoginState } from "@/app/admin/login/actions";
import { Logo } from "@/components/Logo";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 w-full rounded-pill bg-brand px-6 py-3 text-sm font-bold text-ink-950 hover:bg-brand-soft disabled:opacity-60"
    >
      {pending ? "Signing in..." : "Sign in"}
    </button>
  );
}

export function LoginForm() {
  const [state, formAction] = useActionState<LoginState | undefined, FormData>(
    loginAction,
    undefined
  );

  return (
    <div className="mx-auto mt-16 max-w-sm px-4">
      <div className="mb-8 flex justify-center">
        <Logo />
      </div>
      <div className="rounded-card border border-ink-800 bg-ink-850 p-8">
        <h1 className="text-2xl font-black text-white">Admin sign in</h1>
        <p className="mt-1 text-sm text-white/50">
          Manage products, orders and staff.
        </p>

        <form action={formAction} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm text-white/60">Email</span>
            <input
              name="email"
              type="email"
              autoComplete="email"
              className="mt-1 w-full rounded-xl border border-ink-700 bg-ink-900 px-4 py-3 text-white outline-none focus:border-brand"
              placeholder="you@gproducts.zm"
            />
          </label>
          <label className="block">
            <span className="text-sm text-white/60">Password</span>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              className="mt-1 w-full rounded-xl border border-ink-700 bg-ink-900 px-4 py-3 text-white outline-none focus:border-brand"
              placeholder="••••••••"
            />
          </label>

          {state?.error && (
            <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
              {state.error}
            </p>
          )}

          <SubmitButton />
        </form>
      </div>
    </div>
  );
}
