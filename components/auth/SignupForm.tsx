"use client";

import { useRef, useState, type FormEvent } from "react";
import { AuthField } from "@/components/auth/AuthField";
import { PasswordField } from "@/components/auth/PasswordField";
import { AuthSubmitButton } from "@/components/auth/AuthSubmitButton";
import { AuthErrorBanner } from "@/components/auth/AuthErrorBanner";
import {
  formatPhoneDisplay,
  validateEmail,
  validateName,
  validatePasswordMatch,
  validatePhone
} from "@/lib/auth-validation";
import { isStrongPassword } from "@/lib/password";
import { hapticTap } from "@/lib/haptics";

const STEPS = ["About you", "Contact", "Security"] as const;

type FieldErrors = Record<string, string | undefined>;

export function SignupForm({
  initialReferralCode = "",
  onSuccess
}: {
  initialReferralCode?: string;
  onSuccess: (redirectTo: string, message: string) => void;
}) {
  const errorRef = useRef<HTMLParagraphElement>(null);
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [pending, setPending] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [referralCode, setReferralCode] = useState(initialReferralCode);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function showError(message: string) {
    setError(message);
    setPending(false);
    requestAnimationFrame(() => {
      errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  function validateStep(index: number): boolean {
    const next: FieldErrors = {};
    if (index === 0) {
      const fn = validateName(firstName, "First name");
      const ln = validateName(lastName, "Last name");
      const ph = validatePhone(phone);
      if (fn) next.firstName = fn;
      if (ln) next.lastName = ln;
      if (ph) next.phone = ph;
    } else if (index === 1) {
      const em = validateEmail(email);
      if (em) next.email = em;
    } else {
      if (!isStrongPassword(password)) {
        next.password = "Use 8+ characters with upper, lower, a number, and a symbol.";
      }
      const match = validatePasswordMatch(password, confirmPassword);
      if (match) next.confirmPassword = match;
    }
    setFieldErrors(next);
    if (Object.keys(next).length > 0) {
      hapticTap("medium");
      return false;
    }
    return true;
  }

  function goNext() {
    setError(null);
    if (!validateStep(step)) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function goBack() {
    setError(null);
    setFieldErrors({});
    setStep((s) => Math.max(s - 1, 0));
  }

  async function onSignup(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!validateStep(2)) return;

    setPending(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        cache: "no-store",
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          phone: phone.trim(),
          email: email.trim(),
          password,
          confirmPassword,
          referralCode: referralCode.trim()
        })
      });
      const data = (await res.json()) as {
        error?: string;
        redirectTo?: string;
      };
      if (!res.ok) {
        showError(data.error ?? "Could not create account.");
        hapticTap("medium");
        return;
      }
      onSuccess(data.redirectTo ?? "/profile/account", "Account created!");
      hapticTap("success");
    } catch {
      showError("Network error. Check your connection and try again.");
      hapticTap("medium");
    }
  }

  return (
    <form
      onSubmit={onSignup}
      className="auth-form-panel space-y-4"
      key="signup"
      autoComplete="on"
      noValidate
    >
      <div className="auth-steps" aria-label="Signup progress">
        {STEPS.map((label, i) => (
          <div
            key={label}
            className={`auth-step ${i === step ? "auth-step-active" : i < step ? "auth-step-done" : ""}`}
          >
            <span className="auth-step-dot" aria-hidden>
              {i < step ? "✓" : i + 1}
            </span>
            <span className="auth-step-label">{label}</span>
          </div>
        ))}
      </div>

      <div
        className="auth-form-step"
        role="tabpanel"
        aria-label={STEPS[step]}
      >
        {step === 0 ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <AuthField
                label="First name"
                name="firstName"
                type="text"
                autoComplete="given-name"
                enterKeyHint="next"
                required
                placeholder="First name"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  if (fieldErrors.firstName) {
                    setFieldErrors((p) => ({ ...p, firstName: undefined }));
                  }
                }}
                error={fieldErrors.firstName}
              />
              <AuthField
                label="Last name"
                name="lastName"
                type="text"
                autoComplete="family-name"
                enterKeyHint="next"
                required
                placeholder="Last name"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  if (fieldErrors.lastName) {
                    setFieldErrors((p) => ({ ...p, lastName: undefined }));
                  }
                }}
                error={fieldErrors.lastName}
              />
            </div>
            <AuthField
              label="Phone"
              name="phone"
              icon="phone"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              enterKeyHint="next"
              required
              placeholder="0972 500 209"
              value={phone}
              onChange={(e) => {
                setPhone(formatPhoneDisplay(e.target.value));
                if (fieldErrors.phone) {
                  setFieldErrors((p) => ({ ...p, phone: undefined }));
                }
              }}
              error={fieldErrors.phone}
            />
          </>
        ) : null}

        {step === 1 ? (
          <>
            <AuthField
              label="Email"
              name="email"
              icon="mail"
              type="email"
              autoComplete="email"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              enterKeyHint="next"
              required
              placeholder="you@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) {
                  setFieldErrors((p) => ({ ...p, email: undefined }));
                }
              }}
              hint="Used for order updates — not shown publicly."
              error={fieldErrors.email}
            />
            <AuthField
              label="Referral code"
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
              inputClassName="uppercase"
              placeholder="GP-XXXXXX"
              labelExtra={
                <span className="font-normal normal-case tracking-normal text-gp-text-subtle">
                  {" "}
                  (optional)
                </span>
              }
            />
          </>
        ) : null}

        {step === 2 ? (
          <>
            <PasswordField
              name="password"
              label="Password"
              autoComplete="new-password"
              value={password}
              onChange={(v) => {
                setPassword(v);
                if (fieldErrors.password) {
                  setFieldErrors((p) => ({ ...p, password: undefined }));
                }
              }}
              showMeter
              error={fieldErrors.password}
            />
            <PasswordField
              name="confirmPassword"
              label="Confirm password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(v) => {
                setConfirmPassword(v);
                if (fieldErrors.confirmPassword) {
                  setFieldErrors((p) => ({ ...p, confirmPassword: undefined }));
                }
              }}
              error={fieldErrors.confirmPassword}
            />
          </>
        ) : null}
      </div>

      {error ? <AuthErrorBanner ref={errorRef} message={error} /> : null}

      <div className="flex flex-col gap-2 sm:flex-row">
        {step > 0 ? (
          <button
            type="button"
            onClick={goBack}
            className="auth-secondary-btn sm:max-w-[40%]"
          >
            Back
          </button>
        ) : null}
        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={goNext}
            className="auth-submit flex-1"
          >
            Continue
          </button>
        ) : (
          <div className="flex-1">
            <AuthSubmitButton
              pending={pending}
              pendingLabel="Creating…"
              label="Create account"
            />
          </div>
        )}
      </div>
    </form>
  );
}
