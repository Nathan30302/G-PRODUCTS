/** Shared password rules for signup + staff invites */

export type PasswordCheck = {
  id: string;
  label: string;
  ok: boolean;
};

export function passwordChecks(password: string): PasswordCheck[] {
  return [
    {
      id: "length",
      label: "At least 8 characters",
      ok: password.length >= 8
    },
    {
      id: "lower",
      label: "One lowercase letter",
      ok: /[a-z]/.test(password)
    },
    {
      id: "upper",
      label: "One uppercase letter",
      ok: /[A-Z]/.test(password)
    },
    {
      id: "number",
      label: "One number",
      ok: /\d/.test(password)
    },
    {
      id: "symbol",
      label: "One symbol (!@#$…)",
      ok: /[^A-Za-z0-9]/.test(password)
    }
  ];
}

export function isStrongPassword(password: string): boolean {
  return passwordChecks(password).every((c) => c.ok);
}

export function passwordError(password: string): string | null {
  if (!password) return "Password is required.";
  if (!isStrongPassword(password)) {
    return "Use 8+ characters with upper, lower, a number, and a symbol.";
  }
  return null;
}
