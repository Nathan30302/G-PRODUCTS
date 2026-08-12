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

  // 260972… without plus
  if (digits.startsWith("260") && digits.length >= 12) {
    return `+${digits}`;
  }

  // 972… / 977… (9-digit local mobile)
  if (
    digits.length === 9 &&
    (digits.startsWith("9") || digits.startsWith("7"))
  ) {
    return `+260${digits}`;
  }

  // Bare local without leading 0 (972…)
  if (digits.length >= 9 && digits.length <= 10 && !digits.startsWith("260")) {
    return `+260${digits.replace(/^0/, "")}`;
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
    variants.add(`+${digits}`);
  } else if (digits.startsWith("0") && digits.length >= 10) {
    variants.add(`260${digits.slice(1)}`);
    variants.add(`+260${digits.slice(1)}`);
  } else if (digits.length === 9) {
    variants.add(`0${digits}`);
    variants.add(`260${digits}`);
    variants.add(`+260${digits}`);
  }

  return [...variants];
}
