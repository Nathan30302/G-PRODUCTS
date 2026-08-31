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
    <div className="auth-screen bg-ink-950 text-white">
      <div className="auth-screen-bg" aria-hidden>
        <div className="auth-orb auth-orb-a opacity-60" />
        <div className="auth-orb auth-orb-b opacity-60" />
      </div>

      <div className="auth-screen-inner">
        <header className="auth-brand">
          <Logo size="xl" priority />
          <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/45">
            Provider desk
          </p>
        </header>

        <div className="overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-gradient-to-b from-ink-850/95 to-ink-900/95 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]">
          <div className="border-b border-white/[0.06] px-6 pb-5 pt-7 sm:px-8 sm:pt-8">
            <h1 className="display text-[clamp(1.5rem,1.2rem+1.2vw,1.875rem)] font-extrabold text-white">
              Welcome back
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-white/45">
              Secure access for owners and staff — products, orders and services.
            </p>
          </div>

          <form action={formAction} className="space-y-4 px-6 py-6 sm:px-8 sm:py-7">
            <label className="block">
              <span className="auth-field-label text-white/50">Email</span>
              <input
                name="email"
                type="email"
                autoComplete="username"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                enterKeyHint="next"
                required
                className="auth-field border-white/10 bg-white/[0.04] text-white placeholder:text-white/30 focus:border-brand/40 focus:shadow-[0_0_0_4px_rgba(229,243,79,0.12)]"
                placeholder="you@gproducts.zm"
              />
            </label>
            <label className="block">
              <span className="auth-field-label text-white/50">Password</span>
              <span className="relative mt-2 block">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  enterKeyHint="go"
                  required
                  className="auth-field border-white/10 bg-white/[0.04] pr-14 text-white placeholder:text-white/30 focus:border-brand/40 focus:shadow-[0_0_0_4px_rgba(229,243,79,0.12)]"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2 top-1/2 z-10 min-h-11 min-w-11 -translate-y-1/2 rounded-xl px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-white/40 hover:text-brand"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </span>
            </label>

            {state?.error ? (
              <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {state.error}
              </p>
            ) : null}

            <SubmitButton />
          </form>
        </div>

        <p className="auth-back text-white/40">
          <Link href="/profile" className="font-semibold text-brand hover:underline">
            ← Back to Profile
          </Link>
          <span className="mx-2 text-white/20">·</span>
          <Link href="/" className="font-medium text-white/50 hover:text-white/80">
            Live shop
          </Link>
        </p>
      </div>
    </div>
  );
}
