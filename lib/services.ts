export type ServiceSlug = "key-cutting" | "g-loans" | "printing";

export type ServiceDef = {
  id?: string;
  slug: ServiceSlug;
  type: "KEY_CUTTING" | "G_LOANS" | "PRINTING";
  name: string;
  tagline: string;
  description: string;
  icon: string;
  image: string;
  priceLabel?: string;
  payable: boolean;
  settings: ServiceSettings;
};

export type ServiceSettings = {
  keyCuttingPrice: number;
  yangoLegFee: number;
  printBw: number;
  printColor: number;
  loanMin: number;
  loanRates: { weeks: number; rate: number }[];
};

export const DEFAULT_SETTINGS: ServiceSettings = {
  keyCuttingPrice: 50,
  yangoLegFee: 60,
  printBw: 2,
  printColor: 5,
  loanMin: 500,
  loanRates: [
    { weeks: 1, rate: 15 },
    { weeks: 2, rate: 20 },
    { weeks: 3, rate: 25 },
    { weeks: 4, rate: 30 }
  ]
};

/** Fallback / seed catalog — high-quality Unsplash photos */
export const services: ServiceDef[] = [
  {
    slug: "key-cutting",
    type: "KEY_CUTTING",
    name: "Key Cutting",
    tagline: "Vehicle, household & mortise keys",
    description:
      "Bring your key to our Kalingalinga store, or order online: send your key by Yango, we cut a copy, then we send the original and new key back by Yango.",
    icon: "key",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80",
    priceLabel: "From K 50",
    payable: true,
    settings: { ...DEFAULT_SETTINGS }
  },
  {
    slug: "g-loans",
    type: "G_LOANS",
    name: "G-Loans",
    tagline: "Collateral-based loans that gladden hearts",
    description:
      "Short-term collateral-based loans from K 500. Submit a request and we'll follow up on WhatsApp.",
    icon: "wallet",
    image:
      "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=1200&q=80",
    priceLabel: "From K 500",
    payable: false,
    settings: { ...DEFAULT_SETTINGS }
  },
  {
    slug: "printing",
    type: "PRINTING",
    name: "Printing",
    tagline: "Upload documents, pay & print",
    description:
      "Upload your documents, choose colour or black & white, pay with Mobile Money, then pick up at Kalingalinga or get them delivered by Yango.",
    icon: "printer",
    image:
      "https://images.unsplash.com/photo-1562564055-71e051d33c19?auto=format&fit=crop&w=1200&q=80",
    priceLabel: "From K 2 / page",
    payable: true,
    settings: { ...DEFAULT_SETTINGS }
  }
];

export function getService(slug: string): ServiceDef | undefined {
  return services.find((s) => s.slug === slug);
}

export function parseSettings(raw: string | null | undefined): ServiceSettings {
  try {
    const parsed = raw ? JSON.parse(raw) : {};
    return {
      keyCuttingPrice:
        Number(parsed.keyCuttingPrice) || DEFAULT_SETTINGS.keyCuttingPrice,
      yangoLegFee: Number(parsed.yangoLegFee) || DEFAULT_SETTINGS.yangoLegFee,
      printBw: Number(parsed.printBw) || DEFAULT_SETTINGS.printBw,
      printColor: Number(parsed.printColor) || DEFAULT_SETTINGS.printColor,
      loanMin: Number(parsed.loanMin) || DEFAULT_SETTINGS.loanMin,
      loanRates: Array.isArray(parsed.loanRates)
        ? parsed.loanRates
        : DEFAULT_SETTINGS.loanRates
    };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

/** @deprecated use settings.keyCuttingPrice from DB */
export const KEY_CUTTING_PRICE = DEFAULT_SETTINGS.keyCuttingPrice;
export const YANGO_LEG_FEE = DEFAULT_SETTINGS.yangoLegFee;
export const PRINT_PRICE_BW = DEFAULT_SETTINGS.printBw;
export const PRINT_PRICE_COLOR = DEFAULT_SETTINGS.printColor;
export const LOAN_MIN = DEFAULT_SETTINGS.loanMin;
export const LOAN_RATES = DEFAULT_SETTINGS.loanRates;

export const KEY_TYPES = [
  { id: "vehicle", label: "Vehicle keys" },
  { id: "household", label: "Household keys" },
  { id: "mortise", label: "Mortise keys" }
] as const;

export type KeyFlow = "IN_STORE" | "YANGO_ROUNDTRIP";
