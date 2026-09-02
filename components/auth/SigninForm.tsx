"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { AuthField } from "@/components/auth/AuthField";
import { PasswordField } from "@/components/auth/PasswordField";
import { AuthSubmitButton } from "@/components/auth/AuthSubmitButton";
import { AuthErrorBanner } from "@/components/auth/AuthErrorBanner";
import { validateIdentifier } from "@/lib/auth-validation";
import { hapticTap } from "@/lib/haptics";
import { siteConfig, whatsappHref } from "@/config/site";

export function SigninForm({
  identifier,
  onIdentifierChange,
  onSuccess
}: {
  identifier: string;
  onIdentifierChange: (v: string) => void;
  onSuccess: (redirectTo: string, message: string) => void;
}) {
  const errorRef = useRef<HTMLParagraphElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    identifier?: string;
    password?: string;
  }>({});
  const [pending, setPending] = useState(false);

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

    const form = new FormData(e.currentTarget);
    const id = String(form.get("identifier") ?? "").trim();
    const password = String(form.get("password") ?? "");

    const idErr = validateIdentifier(id);
    const pwErr = !password ? "Password is required." : null;
    setFieldErrors({
      identifier: idErr ?? undefined,
      password: pwErr ?? undefined
    });
    if (idErr || pwErr) {
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
        body: JSON.stringify({ identifier: id, password })
      });
      const data = (await res.json()) as {
        error?: string;
        redirectTo?: string;
      };
      if (!res.ok) {
        showError(data.error ?? "Sign in failed.");
        hapticTap("medium");
        return;
      }
      onSuccess(data.redirectTo ?? "/", "Welcome back!");
      hapticTap("success");
    } catch {
      showError("Network error. Check your connection and try again.");
      hapticTap("medium");
    }
  }

  const forgotHref = whatsappHref(
    "Hi G-Products, I need help signing in to my account / resetting my password."
  );

  return (
    <form
      onSubmit={onLogin}
      className="auth-form-panel space-y-4"
      key="signin"
      autoComplete="on"
      noValidate
    >
      <AuthField
        label="Phone or email"
        name="identifier"
        icon="user"
        type="text"
        autoComplete="username"
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        enterKeyHint="next"
        required
        placeholder="Phone number or email address"
        value={identifier}
        onChange={(e) => {
          onIdentifierChange(e.target.value);
          if (fieldErrors.identifier) {
            setFieldErrors((prev) => ({ ...prev, identifier: undefined }));
          }
        }}
        error={fieldErrors.identifier}
      />
      <PasswordField
        name="password"
        label="Password"
        autoComplete="current-password"
        error={fieldErrors.password}
      />

      <p className="text-right">
        <Link
          href={forgotHref}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold text-ink-700 underline-offset-2 hover:underline"
        >
          Forgot password? WhatsApp us
        </Link>
      </p>

      {error ? <AuthErrorBanner ref={errorRef} message={error} /> : null}

      <AuthSubmitButton pending={pending} pendingLabel="Signing in…" label="Sign in" />

      <p className="text-center text-[11px] leading-relaxed text-gp-text-subtle">
        Pay with {siteConfig.mobileMoney.mtn.label},{" "}
        {siteConfig.mobileMoney.airtel.label} or{" "}
        {siteConfig.mobileMoney.zamtel.label} after you sign in.
      </p>
    </form>
  );
}
