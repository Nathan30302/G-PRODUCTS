"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/Icons";
import { AuthSuccessOverlay } from "@/components/auth/AuthSuccessOverlay";
import { SigninForm } from "@/components/auth/SigninForm";

const SignupForm = dynamic(
  () =>
    import("@/components/auth/SignupForm").then((m) => ({
      default: m.SignupForm
    })),
  {
    loading: () => (
      <div className="auth-form-skeleton" aria-busy="true" aria-label="Loading signup form">
        <div className="auth-form-skeleton-bar" />
        <div className="auth-form-skeleton-bar auth-form-skeleton-bar-short" />
        <div className="auth-form-skeleton-bar" />
      </div>
    )
  }
);

type Mode = "signin" | "signup";

function hardNavigate(path: string) {
  window.location.assign(path);
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
  const [identifier, setIdentifier] = useState("");
  const [success, setSuccess] = useState<string | null>(null);

  function switchMode(next: Mode) {
    setMode(next);
    router.replace(next === "signup" ? "/profile?mode=signup" : "/profile", {
      scroll: false
    });
  }

  function handleSuccess(redirectTo: string, message: string) {
    setSuccess(message);
    window.setTimeout(() => hardNavigate(redirectTo), 480);
  }

  return (
    <div className="auth-card-wrap relative">
      {success ? <AuthSuccessOverlay message={success} /> : null}

      <div className="auth-card">
        <div className="auth-card-accent" aria-hidden />
        <div className="auth-card-header">
          <h1 className="display text-[clamp(1.5rem,1.2rem+1.2vw,1.875rem)] font-extrabold text-gp-text">
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-gp-text-muted">
            {mode === "signin"
              ? "Sign in with your phone or email — you'll stay signed in."
              : "Three quick steps — you'll be signed in right after."}
          </p>
        </div>

        <div className="auth-tabs" role="tablist" aria-label="Account mode">
          <button
            type="button"
            role="tab"
            id="auth-tab-signin"
            aria-selected={mode === "signin"}
            aria-controls="auth-panel-signin"
            onClick={() => switchMode("signin")}
            className={mode === "signin" ? "auth-tab auth-tab-active" : "auth-tab"}
          >
            Sign in
          </button>
          <button
            type="button"
            role="tab"
            id="auth-tab-signup"
            aria-selected={mode === "signup"}
            aria-controls="auth-panel-signup"
            onClick={() => switchMode("signup")}
            className={mode === "signup" ? "auth-tab auth-tab-active" : "auth-tab"}
          >
            Create account
          </button>
        </div>

        <div className="auth-card-body">
          <div
            id="auth-panel-signin"
            role="tabpanel"
            aria-labelledby="auth-tab-signin"
            hidden={mode !== "signin"}
            className={mode === "signin" ? "auth-tab-panel auth-tab-panel-active" : "auth-tab-panel"}
          >
            {mode === "signin" ? (
              <SigninForm
                identifier={identifier}
                onIdentifierChange={setIdentifier}
                onSuccess={handleSuccess}
              />
            ) : null}
          </div>

          <div
            id="auth-panel-signup"
            role="tabpanel"
            aria-labelledby="auth-tab-signup"
            hidden={mode !== "signup"}
            className={mode === "signup" ? "auth-tab-panel auth-tab-panel-active" : "auth-tab-panel"}
          >
            {mode === "signup" ? (
              <SignupForm
                initialReferralCode={initialReferralCode}
                onSuccess={handleSuccess}
              />
            ) : null}
          </div>
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
    </div>
  );
}
