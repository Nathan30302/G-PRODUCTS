"use client";

import { useMemo, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { passwordChecks } from "@/lib/password";
import { Logo } from "@/components/Logo";
import { Icon } from "@/components/Icons";
import { hapticTap } from "@/lib/haptics";
import { siteConfig } from "@/config/site";

type Mode = "signin" | "signup";

function hardNavigate(path: string) {
  window.location.assign(path);
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
  const checks = useMemo(() => passwordChecks(value ?? ""), [value]);
  const score = checks.filter((c) => c.ok).length;

  return (
    <label className="block">
      <span className="auth-field-label">{label}</span>
      <span className="relative mt-2 block">
        <span className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-gp-text-subtle">
          <Icon name="lock" className="h-4 w-4" />
        </span>
        <input
          name={name}
          type={show ? "text" : "password"}
          autoComplete={autoComplete}
          required
          enterKeyHint={showMeter ? "next" : "go"}
          {...(onChange
            ? {
                value: value ?? "",
                onChange: (e: ChangeEvent<HTMLInputElement>) =>
                  onChange(e.target.value)
              }
            : {})}
          className="auth-field pl-11 pr-14"
          placeholder="••••••••"
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="absolute right-2 top-1/2 z-10 min-h-11 min-w-11 -translate-y-1/2 rounded-xl px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-gp-text-subtle transition-colors hover:text-ink-700"
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
                    : "bg-gp-border"
                }`}
              />
            ))}
          </div>
          <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            {checks.map((c) => (
              <li
                key={c.id}
                className={`flex items-center gap-1.5 text-[11px] ${
                  c.ok ? "text-accent-dark" : "text-gp-text-subtle"
                }`}
              >
                <span
                  className={`grid h-3.5 w-3.5 place-items-center rounded-full text-[9px] ${
                    c.ok ? "bg-accent/15 text-accent-dark" : "bg-gp-muted"
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
  const errorRef = useRef<HTMLParagraphElement>(null);
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

  function showError(message: string) {
    setError(message);
    setPending(false);
    requestAnimationFrame(() => {
      errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
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
        credentials: "include",
        cache: "no-store",
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
        showError(data.error ?? "Sign in failed.");
        return;
      }
      hardNavigate(data.redirectTo ?? "/");
      hapticTap("success");
    } catch {
      showError("Network error. Check your connection and try again.");
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
        credentials: "include",
        cache: "no-store",
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
        showError(data.error ?? "Could not create account.");
        return;
      }
      hardNavigate(data.redirectTo ?? "/profile/account");
      hapticTap("success");
    } catch {
      showError("Network error. Check your connection and try again.");
    }
  }

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
            {siteConfig.tagline}
          </p>
        </header>

        <div className="auth-card">
          <div className="auth-card-header">
            <h1 className="display text-[clamp(1.5rem,1.2rem+1.2vw,1.875rem)] font-extrabold text-gp-text">
              {mode === "signin" ? "Welcome back" : "Create your account"}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-gp-text-muted">
              {mode === "signin"
                ? "Sign in with your phone or email — you'll stay signed in."
                : "All fields required. You'll be signed in right after signup."}
            </p>
          </div>

          <div className="auth-tabs" role="tablist" aria-label="Account mode">
            <button
              type="button"
              role="tab"
              aria-selected={mode === "signin"}
              onClick={() => switchMode("signin")}
              className={mode === "signin" ? "auth-tab auth-tab-active" : "auth-tab"}
            >
              Sign in
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "signup"}
              onClick={() => switchMode("signup")}
              className={mode === "signup" ? "auth-tab auth-tab-active" : "auth-tab"}
            >
              Create account
            </button>
          </div>

          <div className="auth-card-body">
            {mode === "signin" ? (
              <form onSubmit={onLogin} className="space-y-4" key="signin">
                <label className="block">
                  <span className="auth-field-label">Phone or email</span>
                  <span className="relative mt-2 block">
                    <span className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-gp-text-subtle">
                      <Icon name="user" className="h-4 w-4" />
                    </span>
                    <input
                      name="identifier"
                      type="text"
                      autoComplete="username"
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck={false}
                      inputMode="email"
                      enterKeyHint="next"
                      required
                      className="auth-field pl-11"
                      placeholder="0972… or you@email.com"
                    />
                  </span>
                </label>
                <PasswordInput
                  name="password"
                  label="Password"
                  autoComplete="current-password"
                />

                {error ? (
                  <p
                    ref={errorRef}
                    className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                  >
                    {error}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={pending}
                  className="auth-submit mt-1 disabled:opacity-60"
                >
                  {pending ? "Signing in…" : "Sign in"}
                </button>
              </form>
            ) : (
              <form onSubmit={onSignup} className="space-y-4" key="signup">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="auth-field-label">First name</span>
                    <input
                      name="firstName"
                      type="text"
                      autoComplete="given-name"
                      enterKeyHint="next"
                      required
                      className="auth-field"
                      placeholder="Gift"
                    />
                  </label>
                  <label className="block">
                    <span className="auth-field-label">Last name</span>
                    <input
                      name="lastName"
                      type="text"
                      autoComplete="family-name"
                      enterKeyHint="next"
                      required
                      className="auth-field"
                      placeholder="Mbumwae"
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="auth-field-label">Phone</span>
                  <span className="relative mt-2 block">
                    <span className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-gp-text-subtle">
                      <Icon name="phone" className="h-4 w-4" />
                    </span>
                    <input
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      inputMode="tel"
                      enterKeyHint="next"
                      required
                      className="auth-field pl-11"
                      placeholder="0972 500 209"
                    />
                  </span>
                </label>

                <label className="block">
                  <span className="auth-field-label">Email</span>
                  <span className="relative mt-2 block">
                    <span className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-gp-text-subtle">
                      <Icon name="mail" className="h-4 w-4" />
                    </span>
                    <input
                      name="email"
                      type="email"
                      autoComplete="email"
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck={false}
                      enterKeyHint="next"
                      required
                      className="auth-field pl-11"
                      placeholder="you@email.com"
                    />
                  </span>
                </label>

                <label className="block">
                  <span className="auth-field-label">
                    Referral code{" "}
                    <span className="font-normal normal-case tracking-normal text-gp-text-subtle">
                      (optional)
                    </span>
                  </span>
                  <input
                    name="referralCode"
                    type="text"
                    autoCapitalize="characters"
                    autoCorrect="off"
                    spellCheck={false}
                    enterKeyHint="next"
                    value={referralCode}
                    onChange={(e) =>
                      setReferralCode(e.target.value.toUpperCase())
                    }
                    className="auth-field uppercase"
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
                  <p
                    ref={errorRef}
                    className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                  >
                    {error}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={pending}
                  className="auth-submit mt-1 disabled:opacity-60"
                >
                  {pending ? "Creating…" : "Create account"}
                </button>

                <p className="text-center text-caption leading-relaxed">
                  Password needs 8+ characters, upper, lower, a number and a
                  symbol (e.g. Shop2026!).
                </p>
              </form>
            )}
          </div>

          <div className="auth-perks">
            {[
              { icon: "truck" as const, label: "Track orders" },
              { icon: "map-pin" as const, label: "Saved address" },
              { icon: "wallet" as const, label: "Faster checkout" }
            ].map((b) => (
              <span key={b.label} className="auth-perk">
                <Icon name={b.icon} className="h-3.5 w-3.5 text-ink-700" />
                {b.label}
              </span>
            ))}
          </div>
        </div>

        <p className="auth-back">
          <Link href="/" className="inline-flex items-center gap-1.5 font-semibold text-ink-700 hover:text-ink-850">
            <Icon name="chevron-left" className="h-3.5 w-3.5" />
            Back to shop
          </Link>
        </p>
      </div>
    </div>
  );
}
