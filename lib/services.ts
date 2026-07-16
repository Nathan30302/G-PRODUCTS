export type ServiceSlug = "key-cutting" | "g-loans" | "printing";

export type ServiceDef = {
  slug: ServiceSlug;
  type: "KEY_CUTTING" | "G_LOANS" | "PRINTING";
  name: string;
  tagline: string;
  description: string;
  icon: string;
  image: string;
  priceLabel?: string;
  payable: boolean;
};

export const services: ServiceDef[] = [
  {
    slug: "key-cutting",
    type: "KEY_CUTTING",
    name: "Key Cutting",
    tagline: "Vehicle, household & mortise keys",
    description:
      "We cut vehicle keys, household keys and mortise keys. Order online, pick up at Kalingalinga or get delivery via Yango.",
    icon: "key",
    image: "/services/key-cutting.png",
    priceLabel: "From K 50",
    payable: true
  },
  {
    slug: "g-loans",
    type: "G_LOANS",
    name: "G-Loans",
    tagline: "Collateral-based loans that gladden hearts",
    description:
      "Short-term collateral-based loans from K 500. Submit a request and we'll follow up on WhatsApp.",
    icon: "wallet",
    image: "/services/g-loans.png",
    priceLabel: "From K 500",
    payable: false
  },
  {
    slug: "printing",
    type: "PRINTING",
    name: "Printing",
    tagline: "Upload documents, pay & print",
    description:
      "Upload or attach your documents, choose colour or black & white, pay with Mobile Money, then pick up or get them delivered by Yango.",
    icon: "printer",
    image: "", // icon-led until a print flyer is provided
    priceLabel: "From K 2 / page",
    payable: true
  }
];

export function getService(slug: string): ServiceDef | undefined {
  return services.find((s) => s.slug === slug);
}

/** Key cutting price per key (ZMW) */
export const KEY_CUTTING_PRICE = 50;

/** Printing rates (ZMW per page) */
export const PRINT_PRICE_BW = 2;
export const PRINT_PRICE_COLOR = 5;

export const LOAN_RATES = [
  { weeks: 1, rate: 15 },
  { weeks: 2, rate: 20 },
  { weeks: 3, rate: 25 },
  { weeks: 4, rate: 30 }
] as const;

export const LOAN_MIN = 500;

export const KEY_TYPES = [
  { id: "vehicle", label: "Vehicle keys" },
  { id: "household", label: "Household keys" },
  { id: "mortise", label: "Mortise keys" }
] as const;
