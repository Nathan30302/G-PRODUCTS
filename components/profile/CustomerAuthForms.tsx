"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import {
  customerLoginAction,
  customerSignupAction,
  type AuthFormState
} from "@/app/profile/actions";
import { siteConfig } from "@/config/site";

function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-brand mt-2 w-full py-3.5 text-sm disabled:opacity-60"
    >
      {pending ? pendingLabel : label}
    </button>
  );
}

function PasswordField({ autoComplete = "current-password" }: { autoComplete?: string }) {
  const [show, setShow] = useState(false);
  return (
    <label className="block">
      <span className="field-label">Password</span>
      <span className="relative mt-2 block">
        <input
          name="password"
          type={show ? "text" : "password"}
          autoComplete={autoComplete}
          required
          minLength={6}
          className="field pr-14"
          placeholder="••••••••"
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-white/40 hover:text-brand"
        >
          {show ? "Hide" : "Show"}
        </button>
      </span>
    </label>
  );
}

export function CustomerLoginForm() {
  const [state, formAction] = useActionState<AuthFormState | undefined, FormData>(
    customerLoginAction,
    undefined
  );

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-8 text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-brand">
          Customer app
        </p>
        <h1 className="display mt-3 text-3xl">Welcome back</h1>
        <p className="mt-2 text-sm text-white/45">
          Log in to track orders and pick up where you left off.
        </p>
      </div>

      <form action={formAction} className="space-y-4 rounded-[1.75rem] border border-white/[0.08] bg-white/[0.03] p-6 sm:p-8">
        <label className="block">
          <span className="field-label">Email</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            className="field"
            placeholder="you@email.com"
          />
        </label>
        <PasswordField />
        {state?.error ? (
          <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {state.error}
          </p>
        ) : null}
        <SubmitButton label="Log in" pendingLabel="Signing in…" />
      </form>

      <p className="mt-6 text-center text-sm text-white/45">
        New here?{" "}
        <Link
          href={siteConfig.apps.customer.signup}
          className="font-semibold text-brand hover:underline"
        >
          Create a customer account
        </Link>
      </p>
      <p className="mt-3 text-center text-sm text-white/35">
        <Link href="/profile" className="hover:text-white/60">
          ← Back to Profile
        </Link>
      </p>
    </div>
  );
}

export function CustomerSignupForm() {
  const [state, formAction] = useActionState<AuthFormState | undefined, FormData>(
    customerSignupAction,
    undefined
  );

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-8 text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-brand">
          Customer app
        </p>
        <h1 className="display mt-3 text-3xl">Create account</h1>
        <p className="mt-2 text-sm text-white/45">
          Sign up to shop faster and track your orders.
        </p>
      </div>

      <form action={formAction} className="space-y-4 rounded-[1.75rem] border border-white/[0.08] bg-white/[0.03] p-6 sm:p-8">
        <label className="block">
          <span className="field-label">Full name</span>
          <input
            name="name"
            type="text"
            autoComplete="name"
            required
            className="field"
            placeholder="Your name"
          />
        </label>
        <label className="block">
          <span className="field-label">Email</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            className="field"
            placeholder="you@email.com"
          />
        </label>
        <label className="block">
          <span className="field-label">Phone (optional)</span>
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            className="field"
            placeholder="0972…"
          />
        </label>
        <PasswordField autoComplete="new-password" />
        {state?.error ? (
          <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {state.error}
          </p>
        ) : null}
        <SubmitButton label="Sign up" pendingLabel="Creating account…" />
      </form>

      <p className="mt-6 text-center text-sm text-white/45">
        Already have an account?{" "}
        <Link
          href={siteConfig.apps.customer.login}
          className="font-semibold text-brand hover:underline"
        >
          Log in
        </Link>
      </p>
      <p className="mt-3 text-center text-sm text-white/35">
        <Link href="/profile" className="hover:text-white/60">
          ← Back to Profile
        </Link>
      </p>
    </div>
  );
}
