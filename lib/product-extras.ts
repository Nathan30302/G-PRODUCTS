import type { Product } from "@/lib/types";
import { siteConfig } from "@/config/site";

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

const DEFAULT_DELIVERY = siteConfig.deliveryNote;

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
    deliveryNote: DEFAULT_DELIVERY
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
  "sharp-scientific-calculator": {
    summary: "Sharp scientific calculator as stocked for school work.",
    features: ["Sharp EL-531WH class", "Scientific functions for exams"],
    boxContents: ["1 × Sharp scientific calculator"]
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
    summary: "Full Type-C charging set for compatible iPhones — UK Type G plug.",
    features: [
      "UK Type G wall plug (Zambia sockets)",
      "USB-C charger head",
      "USB-C to Lightning cable"
    ],
    boxContents: ["1 × USB-C wall charger (Type G)", "1 × USB-C to Lightning cable"],
    deliveryNote: DEFAULT_DELIVERY,
    warranty: "Ask on WhatsApp for current accessory cover terms."
  },
  "samsung-c-to-c-full-charger": {
    summary: "USB-C to USB-C full charger set for compatible Samsung phones.",
    features: [
      "UK Type G wall plug",
      "USB-C to USB-C cable",
      "Suitable for many modern Samsung phones"
    ],
    boxContents: ["1 × USB-C wall charger (Type G)", "1 × USB-C to USB-C cable"],
    deliveryNote: DEFAULT_DELIVERY
  },
  "type-c-charger-head": {
    summary: "USB-C charger head with UK Type G plug for Zambia sockets.",
    boxContents: ["1 × USB-C charger head"]
  },
  "oraimo-normal-full-charger": {
    summary: "Oraimo-style full charger set as stocked in-store.",
    boxContents: ["Charger head", "Cable (as packed)"]
  },
  "mango-c-to-c-full-charger": {
    summary: "USB-C to USB-C full charger set as stocked.",
    boxContents: ["Charger head", "USB-C to USB-C cable"]
  },
  "laptop-charger-full-set": {
    summary: "Laptop charger full set — confirm tip / voltage with our team.",
    deliveryNote: DEFAULT_DELIVERY,
    warranty: "Ask before purchase so we match your laptop model."
  },
  "ream-paper": {
    summary: "Full A4 ream for printing, photocopying and school work.",
    features: ["Full ream", "A4 as stocked", "Suitable for printers & copiers"],
    boxContents: ["1 × ream of A4 paper"]
  },
  envelope: {
    summary: "Plain envelopes for letters, forms and school submissions.",
    boxContents: ["Envelope(s) as ordered — confirm size in store if needed"]
  },
  marker: {
    summary: "Marker for labels, posters and general marking.",
    boxContents: ["1 × marker"]
  },
  pencil: {
    summary: "Standard pencil for school, sketching and exams.",
    features: ["HB / standard as stocked"],
    boxContents: ["1 × pencil"]
  },
  sharpener: {
    summary: "Compact pencil sharpener for school bags and desks.",
    boxContents: ["1 × sharpener"]
  },
  glue: {
    summary: "Glue stick for school projects, crafts and light office use.",
    features: ["School & craft use"],
    boxContents: ["1 × glue stick"]
  },
  "bic-crystal-pen": {
    summary: "Classic Bic Crystal ballpoint for everyday writing.",
    features: ["Classic Bic write", "Reliable everyday ballpoint"],
    boxContents: ["1 × Bic Crystal pen (selected colour)"]
  },
  "bic-fine-pen": {
    summary: "Bic fine-point pen for neat notes and forms.",
    boxContents: ["1 × Bic fine pen (selected colour)"]
  },
  "screen-protector-full-glue": {
    summary: "Full-glue screen protector — confirm your phone model with us.",
    features: ["Full-glue fit", "Model-specific — confirm your phone"],
    boxContents: ["1 × screen protector (model as confirmed)"]
  },
  "screen-protector-privacy": {
    summary: "Privacy screen protector that limits side viewing angles.",
    features: ["Privacy filter", "Confirm your phone model"],
    boxContents: ["1 × privacy screen protector"]
  },
  "wireless-mouse": {
    summary: "Wireless mouse for laptops and desktops.",
    boxContents: ["1 × wireless mouse", "Receiver / battery as packed"]
  },
  "wired-mouse": {
    summary: "Wired USB mouse for everyday computer use.",
    boxContents: ["1 × wired mouse"]
  },
  "exercise-book-192": {
    summary: "Hardcover counter book, 192 pages — back-to-school staple.",
    features: ["192 pages", "Premium hardcover"],
    boxContents: ["1 × hardcover counter book"]
  },
  "exercise-book-288": {
    summary: "Thicker hardcover counter book, 288 pages.",
    features: ["288 pages", "Premium hardcover"],
    boxContents: ["1 × hardcover counter book"]
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
