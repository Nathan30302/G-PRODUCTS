import type { Product } from "@/lib/types";

/**
 * Optional richer copy for PDP sections.
 * Only include facts we can stand behind — no invented specs.
 */
export type ProductExtras = {
  /** Short one-liner under the title when description is long */
  summary?: string;
  features?: string[];
  boxContents?: string[];
  warranty?: string;
  deliveryNote?: string;
};

const bySlug: Record<string, ProductExtras> = {
  "phone-pouch": {
    summary:
      "Soft liquid-silicone iPhone case — pick colour and model to match your phone.",
    features: [
      "Soft liquid silicone with a matte finish",
      "Colour options across the range",
      "Model fitments from iPhone 6 through recent Pro Max sizes",
      "Protective everyday cover for campus and commute"
    ],
    boxContents: ["1 × silicone pouch (selected colour & model)"],
    warranty: "Check with our team on WhatsApp for current cover details.",
    deliveryNote:
      "Free campus delivery where applicable · Pickup at UNZA, Kalingalinga or Balastone"
  },
  "casio-scientific-calculator": {
    summary: "Original Casio scientific calculator for school and exams.",
    features: [
      "Original Casio stocked in-store",
      "Scientific functions for high school and university",
      "2-line display style (fx-82MS class)"
    ],
    boxContents: ["1 × Casio scientific calculator"],
    warranty: "Manufacturer warranty as supplied with original Casio units."
  },
  "union-mortice-lock": {
    summary: "Familiar 3-lever mortice lock for timber doors.",
    features: ["3-lever mortice", "Keys included", "Suitable for timber doors"],
    boxContents: ["Mortice lock set", "Keys"]
  },
  "fieldex-mortice-lock": {
    summary: "Everyday brass mortice lock set with keys.",
    features: ["Brass finish", "Mortice set", "Keys included"],
    boxContents: ["Mortice lock set", "Keys"]
  },
  "iphone-type-c-full-charger": {
    summary: "Full Type-C charging set for compatible iPhones.",
    deliveryNote:
      "Free campus delivery where applicable · Pickup at our Lusaka locations"
  },
  "samsung-c-to-c-full-charger": {
    summary: "USB-C to USB-C full charger set for compatible Samsung phones."
  }
};

export function getProductExtras(product: Product): ProductExtras {
  const known = bySlug[product.slug] ?? {};
  const features =
    known.features ??
    (product.shortSpecs.length > 0 ? product.shortSpecs : undefined);
  return {
    summary: known.summary,
    features,
    boxContents: known.boxContents,
    warranty: known.warranty,
    deliveryNote: known.deliveryNote
  };
}
