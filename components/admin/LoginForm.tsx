"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { AuthScreenShell } from "@/components/profile/AuthScreenShell";
import { AuthErrorBanner } from "@/components/auth/AuthErrorBanner";
import { AuthSubmitButton } from "@/components/auth/AuthSubmitButton";
import { AuthSuccessOverlay } from "@/components/auth/AuthSuccessOverlay";
import { Icon } from "@/components/Icons";
import { hapticTap } from "@/lib/haptics";
import { siteConfig } from "@/config/site";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pending) return;
    setError(null);

    const form = new FormData(e.currentTarget);
    const identifier = String(form.get("identifier") ?? "").trim();
    const password = String(form.get("password") ?? "");

    if (!identifier || !password) {
      setError("Please enter your email or phone, and password.");
      hapticTap("medium");
      return;
    }

    setPending(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        cache: "no-store",
        body: JSON.stringify({ identifier, password, scope: "desk" })
      });
      const data = (await res.json()) as {
        error?: string;
        redirectTo?: string;
        name?: string;
      };
      if (!res.ok) {
        setError(data.error ?? "Sign in failed.");
        setPending(false);
        hapticTap("medium");
        return;
      }
      setSuccess(data.name ? `Welcome, ${data.name}` : "Welcome back");
      hapticTap("success");
      window.setTimeout(() => {
        window.location.assign(
          data.redirectTo ?? siteConfig.apps.provider.home
        );
      }, 420);
    } catch {
      setError("Network error. Check your connection and try again.");
      setPending(false);
      hapticTap("medium");
    }
  }

  return (
    <AuthScreenShell
      tagline="Provider desk"
      footer={
        <p className="auth-back flex flex-col items-center gap-3 text-center text-sm text-gp-text-subtle">
          <Link
            href={siteConfig.apps.provider.gate}
            className="inline-flex items-center gap-1.5 font-semibold text-ink-700 hover:text-ink-850"
          >
            <Icon name="chevron-left" className="h-3.5 w-3.5" />
            Back to desk home
          </Link>
          <span>Owners and staff only · Separate from the customer shop</span>
        </p>
      }
    >
      <div className="auth-card-wrap relative">
        {success ? <AuthSuccessOverlay message={success} /> : null}

        <div className="auth-card">
          <div className="auth-card-accent" aria-hidden />
          <div className="auth-card-header">
            <h1 className="display text-[clamp(1.5rem,1.2rem+1.3vw,1.875rem)] font-extrabold text-gp-text">
              Sign in to the desk
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-gp-text-muted">
              Products, orders, and services — for the G-Products team.
            </p>
          </div>

          <form onSubmit={onSubmit} className="auth-card-body space-y-4" noValidate>
            <label className="block">
              <span className="auth-field-label">Email or phone</span>
              <input
                name="identifier"
                type="text"
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

            {error ? <AuthErrorBanner message={error} /> : null}

            <AuthSubmitButton
              pending={pending}
              pendingLabel="Signing you in…"
              label="Enter the desk"
            />
          </form>
        </div>
      </div>
    </AuthScreenShell>
  );
}
