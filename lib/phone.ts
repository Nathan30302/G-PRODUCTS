/** Normalize Zambian-style phone numbers for storage + lookup */

export function normalizePhone(raw: string): string | null {
  const trimmed = raw.replace(/[^\d+]/g, "").trim();
  if (!trimmed) return null;

  let digits = trimmed.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);

  // 0972… → 260972…
  if (digits.startsWith("0") && digits.length >= 10) {
    digits = `260${digits.slice(1)}`;
  }

  // Already 260…
  if (digits.startsWith("260") && digits.length >= 12) {
    return `+${digits}`;
  }

  // Bare local without leading 0 (972…)
  if (digits.length >= 9 && digits.length <= 10 && !digits.startsWith("260")) {
    return `+260${digits}`;
  }

  if (digits.length >= 10) return `+${digits}`;
  return null;
}

/** All common variants so order lookups still match */
export function phoneVariants(phone: string): string[] {
  const digits = phone.replace(/\D/g, "");
  const variants = new Set<string>([phone, digits, `+${digits}`]);

  if (digits.startsWith("260") && digits.length >= 12) {
    variants.add(`0${digits.slice(3)}`);
    variants.add(digits.slice(3));
  } else if (digits.startsWith("0") && digits.length >= 10) {
    variants.add(`260${digits.slice(1)}`);
    variants.add(`+260${digits.slice(1)}`);
  }

  return [...variants];
}
