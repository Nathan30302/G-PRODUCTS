/**
 * Official catalog product photos — local HD assets under /public/products/catalog/.
 * Unsplash IDs are Unsplash License (free for commercial use).
 */

export type CatalogVariantDef = {
  name: string;
  colorHex: string;
  /** Filename under public/products/catalog/ (without leading slash) */
  file: string;
  quantity?: number;
};

export type CatalogProductDef = {
  slug: string;
  /** Single-image products */
  file?: string;
  /** Multi-colour products */
  variants?: CatalogVariantDef[];
  unsplashId?: string;
};

const C = (file: string) => `/products/catalog/${file}`;

/** Curated Unsplash photo IDs — clean product / white-background style */
export const UNSPLASH_BY_CATEGORY: Record<string, string> = {
  stationery: "photo-1586281380349-632531db7ed4",
  pens: "photo-1517842645767-c639042777db",
  glue: "photo-1615485290382-441e4d049cb5",
  paper: "photo-1586075010923-2dd4570fb338",
  calculator: "photo-1611532736597-de2d4265fba3",
  locks: "photo-1558618666-fcd25c85cd64",
  stand: "photo-1512941937669-90a1b58e7e9c",
  protector: "photo-1592890288564-76628a30a657",
  pouch: "photo-1601784551446-20c9e07cdbdb",
  storage: "photo-1597872200969-2b65d56bd16b",
  usb: "photo-1625948515291-69613efd103f",
  hdd: "photo-1597872200969-2b65d56bd16b",
  mouse: "photo-1527864550417-7fd91d9e4f4c",
  keyboard: "photo-1587829741301-dc798b83add3",
  casing: "photo-1531492746076-161ca9bcad58",
  iphoneCharger: "photo-1625948515291-69613efd103f",
  samsungCharger: "photo-1625948515291-69613efd103f",
  oraimoCharger: "photo-1609091839311-6775c81d4669",
  laptopCharger: "photo-1588872657578-7efd1f1555ed",
  extension: "photo-1588872657578-7efd1f1555ed",
  airpods: "photo-1606220588916-b3aac4be582d",
  headset: "photo-1484704849700-f032a568e944",
  speaker: "photo-1608043152269-423dbba4e7e1",
  watch: "photo-1546868871-7041f2a55e12"
};

export function unsplashUrl(id: string, w = 1200): string {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=90`;
}

export function catalogUrl(file: string): string {
  return C(file);
}

/** Products with real photos from Gift + per-colour assets */
export const catalogProducts: CatalogProductDef[] = [
  {
    slug: "t900-ultra",
    variants: [
      {
        name: "Orange",
        colorHex: "#ea580c",
        file: "t900-ultra-orange.jpg",
        quantity: 8
      },
      {
        name: "White",
        colorHex: "#f5f5f5",
        file: "t900-ultra-white.jpg",
        quantity: 6
      },
      {
        name: "Green",
        colorHex: "#166534",
        file: "t900-ultra-green.jpg",
        quantity: 5
      },
      {
        name: "Black",
        colorHex: "#111111",
        file: "t900-ultra-black.jpg",
        quantity: 7
      }
    ]
  },
  {
    slug: "kt8-ultra-max",
    file: "kt8-ultra-max.jpg",
    unsplashId: UNSPLASH_BY_CATEGORY.watch
  },
  {
    slug: "vortex-pods",
    file: "vortex-pods.jpg"
  },
  {
    slug: "tws-f9-5",
    file: "tws-f9-5.jpg"
  },
  {
    slug: "mango-pods",
    file: "mango-pods.jpg",
    unsplashId: UNSPLASH_BY_CATEGORY.airpods
  },
  {
    slug: "oraimo-air-f9-pro-3",
    file: "oraimo-air-f9-pro-3.jpg",
    unsplashId: UNSPLASH_BY_CATEGORY.airpods
  },
  {
    slug: "sivia-s13",
    file: "sivia-s13.jpg",
    unsplashId: UNSPLASH_BY_CATEGORY.airpods
  },
  {
    slug: "tronix-pods",
    file: "tronix-pods.jpg",
    unsplashId: UNSPLASH_BY_CATEGORY.airpods
  },
  {
    slug: "ubl-harman",
    file: "ubl-harman.jpg"
  },
  {
    slug: "calus-s39-speaker",
    file: "calus-s39-speaker.jpg",
    unsplashId: UNSPLASH_BY_CATEGORY.speaker
  },
  {
    slug: "calus-s69-speaker",
    file: "calus-s69-speaker.jpg",
    unsplashId: UNSPLASH_BY_CATEGORY.speaker
  },
  {
    slug: "r800-speaker",
    file: "r800-speaker.jpg",
    unsplashId: UNSPLASH_BY_CATEGORY.speaker
  },
  {
    slug: "samsung-akg-headset",
    file: "samsung-akg-headset.jpg"
  },
  {
    slug: "sivia-cable",
    file: "sivia-cable.jpg"
  },
  {
    slug: "bic-crystal-pen",
    file: "bic-crystal-pen.jpg"
  },
  {
    slug: "corms",
    file: "corms.jpg",
    variants: [
      { name: "Pink", colorHex: "#ec4899", file: "corms.jpg", quantity: 12 },
      { name: "Blue", colorHex: "#2563eb", file: "corms.jpg", quantity: 12 },
      { name: "Black", colorHex: "#111111", file: "corms.jpg", quantity: 12 }
    ]
  }
];

/** Default Unsplash source per slug for products without a custom file yet */
export const slugUnsplashDefaults: Record<string, string> = {
  "exercise-book-192": UNSPLASH_BY_CATEGORY.stationery,
  "exercise-book-288": UNSPLASH_BY_CATEGORY.stationery,
  tipex: UNSPLASH_BY_CATEGORY.glue,
  glue: UNSPLASH_BY_CATEGORY.glue,
  "bic-fine-pen": UNSPLASH_BY_CATEGORY.pens,
  "nataraj-pen": UNSPLASH_BY_CATEGORY.pens,
  pencil: UNSPLASH_BY_CATEGORY.pens,
  ruler: UNSPLASH_BY_CATEGORY.stationery,
  sharpener: UNSPLASH_BY_CATEGORY.stationery,
  marker: UNSPLASH_BY_CATEGORY.pens,
  "key-holder-5": UNSPLASH_BY_CATEGORY.locks,
  "key-holder-15": UNSPLASH_BY_CATEGORY.locks,
  envelope: UNSPLASH_BY_CATEGORY.paper,
  "ream-paper": UNSPLASH_BY_CATEGORY.paper,
  "casio-scientific-calculator": UNSPLASH_BY_CATEGORY.calculator,
  "sharp-scientific-calculator": UNSPLASH_BY_CATEGORY.calculator,
  "union-mortice-lock": UNSPLASH_BY_CATEGORY.locks,
  "fieldex-mortice-lock": UNSPLASH_BY_CATEGORY.locks,
  "phone-stand-50": UNSPLASH_BY_CATEGORY.stand,
  "phone-stand-60": UNSPLASH_BY_CATEGORY.stand,
  "phone-stand-200": UNSPLASH_BY_CATEGORY.stand,
  "screen-protector-full-glue": UNSPLASH_BY_CATEGORY.protector,
  "screen-protector-privacy": UNSPLASH_BY_CATEGORY.protector,
  "phone-pouch": UNSPLASH_BY_CATEGORY.pouch,
  "wired-mouse": UNSPLASH_BY_CATEGORY.mouse,
  "wireless-mouse": UNSPLASH_BY_CATEGORY.mouse,
  "wired-keyboard": UNSPLASH_BY_CATEGORY.keyboard,
  "wireless-keyboard": UNSPLASH_BY_CATEGORY.keyboard,
  "hdd-casing-usb-2": UNSPLASH_BY_CATEGORY.casing,
  "hdd-casing-usb-3": UNSPLASH_BY_CATEGORY.casing,
  "iphone-type-c-full-charger": UNSPLASH_BY_CATEGORY.iphoneCharger,
  "type-c-charger-head": UNSPLASH_BY_CATEGORY.samsungCharger,
  "oraimo-normal-full-charger": UNSPLASH_BY_CATEGORY.oraimoCharger,
  "oraimo-charger-head": UNSPLASH_BY_CATEGORY.oraimoCharger,
  "mango-c-to-c-full-charger": UNSPLASH_BY_CATEGORY.usb,
  "samsung-c-to-c-full-charger": UNSPLASH_BY_CATEGORY.samsungCharger,
  "seal-tape": UNSPLASH_BY_CATEGORY.glue,
  "oraimo-original-headset": UNSPLASH_BY_CATEGORY.headset,
  "mango-headset": UNSPLASH_BY_CATEGORY.headset,
  "laptop-charger-full-set": UNSPLASH_BY_CATEGORY.laptopCharger,
  "laptop-power-pack-only": UNSPLASH_BY_CATEGORY.laptopCharger,
  "airpods-pro-3": UNSPLASH_BY_CATEGORY.airpods,
  "airpods-pro-2-type-c": UNSPLASH_BY_CATEGORY.airpods,
  "airpods-pro-2": UNSPLASH_BY_CATEGORY.airpods,
  "airpods-pro-1": UNSPLASH_BY_CATEGORY.airpods
};

/** Memory / flash / HDD / extension slugs share category images */
export function unsplashForSlug(slug: string): string {
  if (slugUnsplashDefaults[slug]) return slugUnsplashDefaults[slug];
  if (slug.startsWith("memory-card-")) return UNSPLASH_BY_CATEGORY.storage;
  if (slug.startsWith("flash-disk-")) return UNSPLASH_BY_CATEGORY.usb;
  if (slug.startsWith("hard-drive-")) return UNSPLASH_BY_CATEGORY.hdd;
  if (slug.startsWith("extension-")) return UNSPLASH_BY_CATEGORY.extension;
  return UNSPLASH_BY_CATEGORY.stationery;
}

export function catalogDefForSlug(slug: string): CatalogProductDef | undefined {
  return catalogProducts.find((p) => p.slug === slug);
}

export function expectedCatalogFile(slug: string): string {
  return `${slug}.jpg`;
}
