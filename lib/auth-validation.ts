/** Client-side auth field validation for sign-in / sign-up forms. */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizePhoneDigits(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("260") && digits.length >= 12) {
    return digits.slice(3, 12);
  }
  if (digits.startsWith("0") && digits.length >= 10) {
    return digits.slice(1, 10);
  }
  return digits.slice(0, 9);
}

/** Light formatting while typing: 0972 500 209 */
export function formatPhoneDisplay(phone: string): string {
  const d = normalizePhoneDigits(phone);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)} ${d.slice(3)}`;
  return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}`;
}

export function validatePhone(phone: string): string | null {
  const trimmed = phone.trim();
  if (!trimmed) return "Phone number is required.";
  const d = normalizePhoneDigits(trimmed);
  if (d.length !== 9 || !/^9\d{8}$/.test(d)) {
    return "Enter a valid Zambia mobile number (e.g. 0972 500 209).";
  }
  return null;
}

export function validateEmail(email: string): string | null {
  const trimmed = email.trim();
  if (!trimmed) return "Email is required.";
  if (!EMAIL_RE.test(trimmed)) return "Enter a valid email address.";
  return null;
}

export function validateIdentifier(identifier: string): string | null {
  const trimmed = identifier.trim();
  if (!trimmed) return "Enter your phone number or email.";
  if (trimmed.includes("@")) return validateEmail(trimmed);
  return validatePhone(trimmed);
}

export function validateName(name: string, label: string): string | null {
  const trimmed = name.trim();
  if (!trimmed) return `${label} is required.`;
  if (trimmed.length < 2) return `${label} must be at least 2 characters.`;
  return null;
}

export function validatePasswordMatch(
  password: string,
  confirm: string
): string | null {
  if (!confirm) return "Confirm your password.";
  if (password !== confirm) return "Passwords do not match.";
  return null;
}
