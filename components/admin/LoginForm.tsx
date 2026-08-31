"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { loginAction, type LoginState } from "@/app/admin/login/actions";
import { Logo } from "@/components/Logo";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="auth-submit mt-2 disabled:translate-y-0 disabled:opacity-60"
    >
      {pending ? "Signing you in…" : "Enter the desk"}
    </button>
  );
}

export function LoginForm() {
  const [state, formAction] = useActionState<LoginState | undefined, FormData>(
    loginAction,
    undefined
  );
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="auth-screen">
      <div className="auth-screen-bg" aria-hidden>
        <div className="auth-orb auth-orb-a" />
        <div className="auth-orb auth-orb-b" />
      </div>

      <div className="auth-screen-inner">
        <header className="auth-brand">
          <Logo size="xl" priority />
          <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.24em] text-gp-text-subtle">
            Provider desk
          </p>
        </header>

        <div className="auth-card">
          <div className="auth-card-header">
            <h1 className="display text-[clamp(1.5rem,1.2rem+1.3vw,1.875rem)] font-extrabold text-gp-text">
              Welcome back
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-gp-text-muted">
              Secure access for owners and staff — products, orders and services.
            </p>
          </div>

          <form action={formAction} className="auth-card-body space-y-4">
            <label className="block">
              <span className="auth-field-label">Email</span>
              <input
                name="email"
                type="email"
                autoComplete="username"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                enterKeyHint="next"
                required
                className="auth-field"
                placeholder="you@gproducts.zm"
              />
            </label>
            <label className="block">
              <span className="auth-field-label">Password</span>
              <span className="relative mt-2 block">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  enterKeyHint="go"
                  required
                  className="auth-field pr-14"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2 top-1/2 z-10 min-h-11 min-w-11 -translate-y-1/2 rounded-xl px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-gp-text-subtle hover:text-ink-700"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </span>
            </label>

            {state?.error ? (
              <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {state.error}
              </p>
            ) : null}

            <SubmitButton />
          </form>
        </div>

        <p className="auth-back">
          <Link href="/profile" className="font-semibold text-ink-700 hover:underline">
            ← Back to Profile
          </Link>
          <span className="mx-2 text-gp-text-subtle">·</span>
          <Link href="/" className="font-medium text-gp-text-muted hover:text-ink-700">
            Live shop
          </Link>
        </p>
      </div>
    </div>
  );
}
