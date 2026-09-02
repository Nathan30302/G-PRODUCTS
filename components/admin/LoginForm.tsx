"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { loginAction, type LoginState } from "@/app/admin/login/actions";
import { AuthScreenShell } from "@/components/profile/AuthScreenShell";
import { AuthErrorBanner } from "@/components/auth/AuthErrorBanner";
import { AuthSubmitButton } from "@/components/auth/AuthSubmitButton";

function DeskSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <AuthSubmitButton
      pending={pending}
      pendingLabel="Signing you in…"
      label="Enter the desk"
    />
  );
}

export function LoginForm() {
  const [state, formAction] = useActionState<LoginState | undefined, FormData>(
    loginAction,
    undefined
  );
  const [showPassword, setShowPassword] = useState(false);

  return (
    <AuthScreenShell
      tagline="Provider desk"
      footer={
        <p className="auth-back">
          <Link href="/profile" className="font-semibold text-ink-700 hover:underline">
            ← Back to Profile
          </Link>
          <span className="mx-2 text-gp-text-subtle">·</span>
          <Link href="/" className="font-medium text-gp-text-muted hover:text-ink-700">
            Live shop
          </Link>
        </p>
      }
    >
      <div className="auth-card">
        <div className="auth-card-accent" aria-hidden />
        <div className="auth-card-header">
          <h1 className="display text-[clamp(1.5rem,1.2rem+1.3vw,1.875rem)] font-extrabold text-gp-text">
            Welcome back
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-gp-text-muted">
            Secure access for owners and staff — products, orders and services.
          </p>
        </div>

        <form action={formAction} className="auth-card-body space-y-4" noValidate>
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
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </span>
          </label>

          {state?.error ? <AuthErrorBanner message={state.error} /> : null}

          <DeskSubmitButton />
        </form>
      </div>
    </AuthScreenShell>
  );
}
