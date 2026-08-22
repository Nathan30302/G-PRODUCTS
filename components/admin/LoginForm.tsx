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
      className="mt-2 w-full rounded-pill bg-brand px-6 py-3.5 text-sm font-bold text-ink-950 shadow-brand-glow transition-all duration-300 ease-out-expo hover:-translate-y-0.5 hover:bg-brand-soft disabled:translate-y-0 disabled:opacity-60"
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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-16">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-ink-950" />
        <div className="absolute left-1/2 top-[-10%] h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-brand/14 blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-80 w-80 rounded-full bg-accent/12 blur-[110px]" />
      </div>

      <div className="relative w-full max-w-md animate-fade-up">
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo size="lg" priority />
          <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.28em] text-brand">
            Provider desk
          </p>
          <h1 className="display mt-3 text-3xl">Welcome back</h1>
          <p className="mt-2 max-w-xs text-sm text-white/45">
            Secure access for owners and staff — products, orders and services.
          </p>
        </div>

        <div className="overflow-hidden rounded-[1.85rem] border border-white/[0.08] bg-gradient-to-b from-ink-850/95 to-ink-900/95 p-7 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)] sm:p-8">
          <form action={formAction} className="space-y-4">
            <label className="block">
              <span className="field-label">Email</span>
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                className="field"
                placeholder="you@gproducts.zm"
              />
            </label>
            <label className="block">
              <span className="field-label">Password</span>
              <span className="relative mt-2 block">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="field pr-14"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-white/40 hover:text-brand"
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

        <p className="mt-7 text-center text-sm text-white/40">
          <Link href="/profile" className="font-medium text-brand hover:underline">
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
