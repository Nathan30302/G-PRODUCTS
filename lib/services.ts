export type ServiceSlug = "key-cutting" | "g-loans" | "printing";

export type ServiceDef = {
  id?: string;
  slug: ServiceSlug;
  type: "KEY_CUTTING" | "G_LOANS" | "PRINTING";
  name: string;
  tagline: string;
  description: string;
  icon: string;
  /** Cover image (first gallery photo). */
  image: string;
  /** Swipeable gallery — cover is images[0]. */
  images: string[];
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
  /** Full print / office menu (price per unit) */
  printMenu: { id: string; name: string; price: number }[];
};

export const DEFAULT_PRINT_MENU = [
  { id: "bw-copy", name: "Black & White Photocopying", price: 1 },
  { id: "color-copy", name: "Colour Photocopying", price: 5 },
  { id: "bw-print", name: "Printing (B&W)", price: 1 },
  { id: "color-print", name: "Colour Printing", price: 5 },
  { id: "nrc-copy", name: "NRC Photocopying", price: 3 },
  { id: "scan", name: "Scanning", price: 3 },
  { id: "typing", name: "Typing", price: 5 },
  { id: "laminate", name: "Lamination", price: 10 },
  { id: "binding", name: "Binding", price: 15 },
  { id: "certificate", name: "Certificates Printing", price: 15 }
];

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
  ],
  printMenu: DEFAULT_PRINT_MENU
};

import {
  SERVICE_GALLERIES,
  coverFromImages
} from "@/lib/service-media";

/** Fallback / seed catalog — curated HD workshop galleries */
export const services: ServiceDef[] = [
  {
    slug: "key-cutting",
    type: "KEY_CUTTING",
    name: "Key Cutting",
    tagline: "Vehicle, household & mortise keys",
    description:
      "Bring your key to any G-Products shop (UNZA, Kalingalinga or Balastone), or order online: send your key by Yango, we cut a copy, then we return original + new key.",
    icon: "key",
    images: SERVICE_GALLERIES["key-cutting"],
    image: coverFromImages(SERVICE_GALLERIES["key-cutting"]),
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
    images: SERVICE_GALLERIES["g-loans"],
    image: coverFromImages(SERVICE_GALLERIES["g-loans"]),
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
      "Upload your documents or choose a service (photocopy, print, scan, laminate, bind). Pay with Mobile Money, then pick up at UNZA / Kalingalinga / Balastone or get Yango delivery.",
    icon: "printer",
    images: SERVICE_GALLERIES.printing,
    image: coverFromImages(SERVICE_GALLERIES.printing),
    priceLabel: "From K 1",
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
        : DEFAULT_SETTINGS.loanRates,
      printMenu: Array.isArray(parsed.printMenu) && parsed.printMenu.length
        ? parsed.printMenu
        : DEFAULT_SETTINGS.printMenu
    };
  } catch {
    return { ...DEFAULT_SETTINGS, printMenu: [...DEFAULT_PRINT_MENU] };
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
