/**
 * Simple promo codes — no DB migration required.
 * Totals are re-validated server-side on checkout.
 */

export type PromoResult =
  | {
      ok: true;
      code: string;
      label: string;
      discountZmw: number;
      /** Percent applied, if percentage-based */
      percent?: number;
    }
  | { ok: false; error: string };

type PromoDef =
  | { code: string; label: string; type: "percent"; value: number; minSubtotal?: number }
  | { code: string; label: string; type: "fixed"; value: number; minSubtotal?: number };

const PROMOS: PromoDef[] = [
  {
    code: "WELCOME50",
    label: "Welcome — K50 off",
    type: "fixed",
    value: 50,
    minSubtotal: 200
  },
  {
    code: "STUDENT10",
    label: "Student — 10% off",
    type: "percent",
    value: 10,
    minSubtotal: 100
  },
  {
    code: "CAMPUS20",
    label: "Campus — K20 off",
    type: "fixed",
    value: 20,
    minSubtotal: 80
  }
];

export function listPublicPromoHints(): string[] {
  return PROMOS.map((p) => p.code);
}

export function applyPromoCode(raw: string | undefined, subtotal: number): PromoResult {
  const code = (raw ?? "").trim().toUpperCase();
  if (!code) return { ok: false, error: "Enter a promo code." };

  const promo = PROMOS.find((p) => p.code === code);
  if (!promo) return { ok: false, error: "That code is not valid." };

  const min = promo.minSubtotal ?? 0;
  if (subtotal < min) {
    return {
      ok: false,
      error: `Spend at least K${min} to use ${promo.code}.`
    };
  }

  let discountZmw = 0;
  if (promo.type === "percent") {
    discountZmw = Math.floor((subtotal * promo.value) / 100);
  } else {
    discountZmw = promo.value;
  }
  discountZmw = Math.min(discountZmw, subtotal);
  if (discountZmw <= 0) {
    return { ok: false, error: "No discount applies to this cart." };
  }

  return {
    ok: true,
    code: promo.code,
    label: promo.label,
    discountZmw,
    percent: promo.type === "percent" ? promo.value : undefined
  };
}
