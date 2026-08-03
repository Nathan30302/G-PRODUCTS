"use client";

import { useActionState } from "react";
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
      className="mt-1 w-full rounded-pill bg-brand px-6 py-3.5 text-sm font-bold text-ink-950 shadow-brand-glow transition-all duration-300 ease-out-expo hover:-translate-y-0.5 hover:bg-brand-soft disabled:translate-y-0 disabled:opacity-60"
    >
      {pending ? "Signing you in…" : "Enter provider console"}
    </button>
  );
}

export function LoginForm() {
  const [state, formAction] = useActionState<LoginState | undefined, FormData>(
    loginAction,
    undefined
  );

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-16">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-ink-950" />
        <div className="absolute left-1/2 top-0 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-brand/12 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-accent/10 blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)",
            backgroundSize: "48px 48px"
          }}
        />
      </div>

      <div className="relative w-full max-w-md animate-fade-up">
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo />
          <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.28em] text-brand">
            Provider access
          </p>
          <p className="mt-2 max-w-xs text-sm text-white/45">
            A private desk for owners and staff — products, orders and services.
          </p>
        </div>

        <div className="overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-gradient-to-b from-ink-850/95 to-ink-900/95 p-7 shadow-card backdrop-blur-xl sm:p-8">
          <h1 className="text-2xl font-black tracking-tight text-white">
            Sign in
          </h1>
          <p className="mt-1.5 text-sm text-white/50">
            Secure access to the G-Products business console.
          </p>

          <form action={formAction} className="mt-7 space-y-4">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
                Email
              </span>
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-2 w-full rounded-2xl border border-white/10 bg-ink-950/70 px-4 py-3.5 text-white outline-none transition-colors focus:border-brand"
                placeholder="you@gproducts.zm"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
                Password
              </span>
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-2 w-full rounded-2xl border border-white/10 bg-ink-950/70 px-4 py-3.5 text-white outline-none transition-colors focus:border-brand"
                placeholder="••••••••"
              />
            </label>

            {state?.error && (
              <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {state.error}
              </p>
            )}

            <SubmitButton />
          </form>
        </div>

        <p className="mt-7 text-center text-sm text-white/40">
          <Link href="/" className="font-medium text-brand hover:underline">
            ← Return to the live shop
          </Link>
        </p>
      </div>
    </div>
  );
}
