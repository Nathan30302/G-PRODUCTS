"use client";

import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { passwordChecks } from "@/lib/password";
import { Logo } from "@/components/Logo";
import { Icon } from "@/components/Icons";

type Mode = "signin" | "signup";

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
  const checks = useMemo(() => passwordChecks(value ?? ""), [value]);
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

export function AuthPanel({
  initialMode = "signin",
  initialReferralCode = ""
}: {
  initialMode?: Mode;
  initialReferralCode?: string;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [referralCode, setReferralCode] = useState(initialReferralCode);

  function switchMode(next: Mode) {
    setMode(next);
    setPassword("");
    setError(null);
    router.replace(next === "signup" ? "/profile?mode=signup" : "/profile", {
      scroll: false
    });
  }

  async function onLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          identifier: String(form.get("identifier") ?? "").trim(),
          password: String(form.get("password") ?? "")
        })
      });
      const data = (await res.json()) as {
        error?: string;
        redirectTo?: string;
      };
      if (!res.ok) {
        setError(data.error ?? "Sign in failed.");
        setPending(false);
        return;
      }
      router.push(data.redirectTo ?? "/");
      router.refresh();
    } catch {
      setError("Network error. Check your connection and try again.");
      setPending(false);
    }
  }

  async function onSignup(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          firstName: String(form.get("firstName") ?? "").trim(),
          lastName: String(form.get("lastName") ?? "").trim(),
          phone: String(form.get("phone") ?? "").trim(),
          email: String(form.get("email") ?? "").trim(),
          password: String(form.get("password") ?? ""),
          confirmPassword: String(form.get("confirmPassword") ?? ""),
          referralCode: String(form.get("referralCode") ?? "").trim()
        })
      });
      const data = (await res.json()) as {
        error?: string;
        redirectTo?: string;
      };
      if (!res.ok) {
        setError(data.error ?? "Could not create account.");
        setPending(false);
        return;
      }
      // Account created + session cookie set — go straight in
      router.push(data.redirectTo ?? "/profile/account");
      router.refresh();
    } catch {
      setError("Network error. Check your connection and try again.");
      setPending(false);
    }
  }

  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="pointer-events-none absolute -left-16 -top-10 h-48 w-48 rounded-full bg-brand/15 blur-[90px]" />
      <div className="pointer-events-none absolute -right-10 top-32 h-40 w-40 rounded-full bg-accent/10 blur-[80px]" />

      <div className="relative mb-8 flex flex-col items-center text-center">
        <Logo size="lg" priority />
        <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.28em] text-brand">
          Your account
        </p>
        <h1 className="display mt-2 text-3xl sm:text-4xl">
          {mode === "signin" ? "Welcome back" : "Create account"}
        </h1>
        <p className="mt-2 max-w-xs text-sm text-white/45">
          {mode === "signin"
            ? "Sign in with your phone or email — you’ll stay signed in."
            : "All fields required. You’ll be signed in right after signup."}
        </p>
        <ul className="mt-5 flex flex-wrap justify-center gap-2">
          {[
            { icon: "truck", label: "Track orders" },
            { icon: "map-pin", label: "Saved address" },
            { icon: "wallet", label: "Faster checkout" }
          ].map((b) => (
            <li
              key={b.label}
              className="inline-flex items-center gap-1.5 rounded-pill border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] font-medium text-white/50"
            >
              <Icon name={b.icon} className="h-3 w-3 text-brand" />
              {b.label}
            </li>
          ))}
        </ul>
      </div>

      <div className="relative overflow-hidden rounded-[1.85rem] border border-white/[0.08] bg-gradient-to-b from-ink-850/95 to-ink-900/95 p-1.5 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)] ring-1 ring-white/[0.04]">
        <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent" />
        <div className="relative grid grid-cols-2 gap-1 rounded-[1.35rem] bg-ink-950/60 p-1">
          <button
            type="button"
            onClick={() => switchMode("signin")}
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
            onClick={() => switchMode("signup")}
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
            <form onSubmit={onLogin} className="space-y-4" key="signin">
              <label className="block">
                <span className="field-label">Phone or email</span>
                <input
                  name="identifier"
                  type="text"
                  autoComplete="username"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
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

              {error ? (
                <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={pending}
                className="btn-brand mt-1 w-full py-3.5 text-sm disabled:opacity-60"
              >
                {pending ? "Signing in…" : "Sign in"}
              </button>
            </form>
          ) : (
            <form onSubmit={onSignup} className="space-y-4" key="signup">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="field-label">First name</span>
                  <input
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    required
                    className="field"
                    placeholder="Gift"
                  />
                </label>
                <label className="block">
                  <span className="field-label">Last name</span>
                  <input
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    required
                    className="field"
                    placeholder="Mbumwae"
                  />
                </label>
              </div>

              <label className="block">
                <span className="field-label">Phone</span>
                <input
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  required
                  className="field"
                  placeholder="0972 500 209"
                />
              </label>

              <label className="block">
                <span className="field-label">Email</span>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  autoCapitalize="none"
                  required
                  className="field"
                  placeholder="you@email.com"
                />
              </label>

              <label className="block">
                <span className="field-label">
                  Referral code{" "}
                  <span className="font-normal text-white/35">(optional)</span>
                </span>
                <input
                  name="referralCode"
                  type="text"
                  autoCapitalize="characters"
                  autoCorrect="off"
                  spellCheck={false}
                  value={referralCode}
                  onChange={(e) =>
                    setReferralCode(e.target.value.toUpperCase())
                  }
                  className="field uppercase"
                  placeholder="GP-XXXXXX"
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

              {error ? (
                <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={pending}
                className="btn-brand mt-1 w-full py-3.5 text-sm disabled:opacity-60"
              >
                {pending ? "Creating…" : "Create account"}
              </button>

              <p className="text-center text-[11px] leading-relaxed text-white/30">
                Password needs 8+ characters, upper, lower, a number and a
                symbol (e.g. Shop2026!).
              </p>
            </form>
          )}
        </div>
      </div>

      <p className="relative mt-7 text-center text-sm text-white/35">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 hover:text-white/60"
        >
          <Icon name="chevron-left" className="h-3.5 w-3.5" />
          Back to shop
        </Link>
      </p>
    </div>
  );
}
