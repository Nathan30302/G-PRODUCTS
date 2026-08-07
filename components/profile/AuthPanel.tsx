"use client";

import { useActionState, useMemo, useState, type ChangeEvent } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import {
  unifiedLoginAction,
  unifiedSignupAction,
  type AuthFormState
} from "@/app/profile/actions";
import { passwordChecks } from "@/lib/password";
import { Logo } from "@/components/Logo";
import { Icon } from "@/components/Icons";

type Mode = "signin" | "signup";

function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-brand mt-1 w-full py-3.5 text-sm disabled:opacity-60"
    >
      {pending ? pendingLabel : label}
    </button>
  );
}

function PasswordInput({
  name,
  label,
  autoComplete,
  value,
  onChange,
  showMeter
}: {
  name: string;
  label: string;
  autoComplete: string;
  value?: string;
  onChange?: (v: string) => void;
  showMeter?: boolean;
}) {
  const [show, setShow] = useState(false);
  const checks = useMemo(
    () => passwordChecks(value ?? ""),
    [value]
  );
  const score = checks.filter((c) => c.ok).length;

  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <span className="relative mt-2 block">
        <input
          name={name}
          type={show ? "text" : "password"}
          autoComplete={autoComplete}
          required
          {...(onChange
            ? {
                value: value ?? "",
                onChange: (e: ChangeEvent<HTMLInputElement>) =>
                  onChange(e.target.value)
              }
            : {})}
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

      {showMeter && value !== undefined ? (
        <div className="mt-3 space-y-2.5">
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  i < score
                    ? score <= 2
                      ? "bg-red-400"
                      : score <= 4
                        ? "bg-brand"
                        : "bg-accent"
                    : "bg-white/10"
                }`}
              />
            ))}
          </div>
          <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            {checks.map((c) => (
              <li
                key={c.id}
                className={`flex items-center gap-1.5 text-[11px] ${
                  c.ok ? "text-accent" : "text-white/35"
                }`}
              >
                <span
                  className={`grid h-3.5 w-3.5 place-items-center rounded-full text-[9px] ${
                    c.ok ? "bg-accent/20" : "bg-white/5"
                  }`}
                >
                  {c.ok ? "✓" : ""}
                </span>
                {c.label}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </label>
  );
}

export function AuthPanel({ initialMode = "signin" }: { initialMode?: Mode }) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [password, setPassword] = useState("");

  const [loginState, loginAction] = useActionState<
    AuthFormState | undefined,
    FormData
  >(unifiedLoginAction, undefined);

  const [signupState, signupAction] = useActionState<
    AuthFormState | undefined,
    FormData
  >(unifiedSignupAction, undefined);

  const state = mode === "signin" ? loginState : signupState;

  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="pointer-events-none absolute -left-16 -top-10 h-48 w-48 rounded-full bg-brand/15 blur-[90px]" />
      <div className="pointer-events-none absolute -right-10 top-32 h-40 w-40 rounded-full bg-accent/10 blur-[80px]" />

      <div className="relative mb-8 flex flex-col items-center text-center">
        <div
          className="overflow-hidden rounded-[1.35rem]"
          style={{ backgroundColor: "#1a3344" }}
        >
          <Logo size="md" priority />
        </div>
        <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.28em] text-brand">
          Your account
        </p>
        <h1 className="display mt-2 text-3xl sm:text-4xl">
          {mode === "signin" ? "Welcome back" : "Create account"}
        </h1>
        <p className="mt-2 max-w-xs text-sm text-white/45">
          {mode === "signin"
            ? "Sign in with your phone or email — we’ll take you to the right place."
            : "One account for the shop. Phone is required; email is optional."}
        </p>
        {mode === "signin" ? (
          <p className="mt-3 max-w-sm text-[11px] leading-relaxed text-white/30">
            Provider desk:{" "}
            <span className="text-white/50">gift@gproducts.zm</span> · password
            from Railway <span className="text-white/45">OWNER_PASSWORD</span>{" "}
            (default <span className="text-white/50">changeme123</span>). Staff
            use the email + password the owner shared.
          </p>
        ) : null}
      </div>

      <div className="relative overflow-hidden rounded-[1.85rem] border border-white/[0.08] bg-gradient-to-b from-ink-850/95 to-ink-900/95 p-1.5 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]">
        <div className="grid grid-cols-2 gap-1 rounded-[1.35rem] bg-ink-950/60 p-1">
          <button
            type="button"
            onClick={() => setMode("signin")}
            className={`rounded-pill py-2.5 text-sm font-bold transition-all ${
              mode === "signin"
                ? "bg-brand text-ink-950 shadow-brand-glow"
                : "text-white/45 hover:text-white"
            }`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`rounded-pill py-2.5 text-sm font-bold transition-all ${
              mode === "signup"
                ? "bg-brand text-ink-950 shadow-brand-glow"
                : "text-white/45 hover:text-white"
            }`}
          >
            Create account
          </button>
        </div>

        <div className="p-5 sm:p-7">
          {mode === "signin" ? (
            <form action={loginAction} className="space-y-4" key="signin">
              <label className="block">
                <span className="field-label">Phone or email</span>
                <input
                  name="identifier"
                  type="text"
                  autoComplete="username"
                  required
                  className="field"
                  placeholder="0972… or you@email.com"
                />
              </label>
              <PasswordInput
                name="password"
                label="Password"
                autoComplete="current-password"
              />

              {state?.error ? (
                <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {state.error}
                </p>
              ) : null}

              <SubmitButton label="Sign in" pendingLabel="Signing in…" />
            </form>
          ) : (
            <form
              action={signupAction}
              className="space-y-4"
              key="signup"
              onChange={() => undefined}
            >
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
                <span className="field-label">
                  Phone <span className="text-brand">*</span>
                </span>
                <input
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  className="field"
                  placeholder="0972 500 209"
                />
                <span className="mt-1.5 block text-[11px] text-white/30">
                  Used for orders, delivery and signing in.
                </span>
              </label>

              <label className="block">
                <span className="field-label">Email (optional)</span>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="field"
                  placeholder="you@email.com"
                />
              </label>

              <PasswordInput
                name="password"
                label="Password"
                autoComplete="new-password"
                value={password}
                onChange={setPassword}
                showMeter
              />

              <PasswordInput
                name="confirmPassword"
                label="Confirm password"
                autoComplete="new-password"
              />

              {state?.error ? (
                <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {state.error}
                </p>
              ) : null}

              <SubmitButton
                label="Create account"
                pendingLabel="Creating…"
              />

              <p className="text-center text-[11px] leading-relaxed text-white/30">
                Desk staff are added by the owner — they only need Sign in.
              </p>
            </form>
          )}
        </div>
      </div>

      <p className="relative mt-7 text-center text-sm text-white/35">
        <Link href="/" className="inline-flex items-center gap-1.5 hover:text-white/60">
          <Icon name="chevron-left" className="h-3.5 w-3.5" />
          Back to shop
        </Link>
      </p>
    </div>
  );
}
