import { Product } from "@/lib/types";

// Seed catalog — colour variants are created in prisma/seed.ts.
type SeedProduct = Omit<Product, "variants">;

// Official G-Products price list (Aug 2026). Prices in ZMW.

const U = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`;

const IMG = {
  stationery: U("photo-1586075010923-2dd4570fb338"),
  pens: U("photo-1517842645767-c639042777db"),
  paper: U("photo-1586281380349-632531db7ed4"),
  calculator: U("photo-1611532736597-de2d4265fba3"),
  storage: "/products/memory-flash.png",
  hdd: U("photo-1597872200969-2b65d56bd16b"),
  mouse: "/products/wireless-mouse.png",
  keyboard: U("photo-1587829741301-dc798b83add3"),
  casing: U("photo-1531492746076-161ca9bcad58"),
  oraimo: "/products/oraimo-charger.png",
  iphone: "/products/iphone-chargers.png",
  samsung: "/products/samsung-45w-charger.png",
  cable: U("photo-1625948515291-69613efd103f"),
  laptopCharger: U("photo-1588872657578-7efd1f1555ed"),
  extension: "/products/top-plug-adaptor.png",
  airpods: "/products/mango-airpods.png",
  headset: U("photo-1484704849700-f032a568e944"),
  speaker: U("photo-1608043152269-423dbba4e7e1"),
  stand: U("photo-1512941937669-90a1b58e7e9c"),
  protector: U("photo-1592890288564-76628a30a657"),
  pouch: U("photo-1601784551446-20c9e07cdbdb"),
  watch: U("photo-1546868871-7041f2a55e12"),
  lock: U("photo-1558618666-fcd25c85cd64"),
  glue: U("photo-1615485290382-441e4d049cb5")
};

function p(
  partial: Omit<SeedProduct, "images" | "stock" | "shortSpecs" | "description"> & {
    image: string;
    specs?: string[];
    description?: string;
    stock?: SeedProduct["stock"];
    featured?: boolean;
    hotDeal?: boolean;
  }
): SeedProduct {
  return {
    id: partial.id,
    slug: partial.slug,
    name: partial.name,
    brand: partial.brand,
    categorySlug: partial.categorySlug,
    price: partial.price,
    compareAtPrice: partial.compareAtPrice,
    images: [{ url: partial.image, alt: partial.name }],
    shortSpecs: partial.specs ?? [],
    description:
      partial.description ??
      `${partial.name} — available at G-Products. Heart gladdening products.`,
    stock: partial.stock ?? "in_stock",
    featured: partial.featured,
    hotDeal: partial.hotDeal
  };
}

export const products: SeedProduct[] = [
  // —— Stationery ——
  p({
    id: "p-ex-192",
    slug: "exercise-book-192",
    name: "Exercise Book 192 pages",
    categorySlug: "stationery",
    price: 16,
    image: IMG.stationery,
    specs: ["192 pages"],
    featured: true
  }),
  p({
    id: "p-ex-288",
    slug: "exercise-book-288",
    name: "Exercise Book 288 pages",
    categorySlug: "stationery",
    price: 40,
    image: IMG.stationery,
    specs: ["288 pages"]
  }),
  p({
    id: "p-tipex",
    slug: "tipex",
    name: "Tipex",
    categorySlug: "stationery",
    price: 10,
    image: IMG.glue
  }),
  p({
    id: "p-glue",
    slug: "glue",
    name: "Glue",
    categorySlug: "stationery",
    price: 3,
    image: IMG.glue
  }),
  p({
    id: "p-corms",
    slug: "corms",
    name: "Corms",
    categorySlug: "stationery",
    price: 3,
    image: IMG.glue
  }),
  p({
    id: "p-bic-crystal",
    slug: "bic-crystal-pen",
    name: "Bic Crystal Pen",
    brand: "Bic",
    categorySlug: "stationery",
    price: 5,
    image: IMG.pens,
    featured: true
  }),
  p({
    id: "p-bic-fine",
    slug: "bic-fine-pen",
    name: "Bic Fine Pen",
    brand: "Bic",
    categorySlug: "stationery",
    price: 7,
    image: IMG.pens
  }),
  p({
    id: "p-nataraj",
    slug: "nataraj-pen",
    name: "Nataraj Pen",
    brand: "Nataraj",
    categorySlug: "stationery",
    price: 3,
    image: IMG.pens
  }),
  p({
    id: "p-pencil",
    slug: "pencil",
    name: "Pencil",
    categorySlug: "stationery",
    price: 3,
    image: IMG.pens
  }),
  p({
    id: "p-ruler",
    slug: "ruler",
    name: "Ruler",
    categorySlug: "stationery",
    price: 8,
    image: IMG.stationery
  }),
  p({
    id: "p-sharpener",
    slug: "sharpener",
    name: "Sharpener",
    categorySlug: "stationery",
    price: 3,
    image: IMG.stationery
  }),
  p({
    id: "p-marker",
    slug: "marker",
    name: "Marker",
    categorySlug: "stationery",
    price: 5,
    image: IMG.pens
  }),
  p({
    id: "p-keyholder-5",
    slug: "key-holder-5",
    name: "Key Holder",
    categorySlug: "locks",
    price: 5,
    image: IMG.lock,
    specs: ["Standard"]
  }),
  p({
    id: "p-keyholder-15",
    slug: "key-holder-15",
    name: "Key Holder (Premium)",
    categorySlug: "locks",
    price: 15,
    image: IMG.lock
  }),
  p({
    id: "p-envelope",
    slug: "envelope",
    name: "Envelope",
    categorySlug: "stationery",
    price: 5,
    image: IMG.paper
  }),
  p({
    id: "p-ream",
    slug: "ream-paper",
    name: "Ream Paper",
    categorySlug: "stationery",
    price: 115,
    image: IMG.paper,
    specs: ["Full ream"],
    featured: true
  }),
  p({
    id: "p-casio",
    slug: "casio-scientific-calculator",
    name: "Scientific Calculator (Casio Original)",
    brand: "Casio",
    categorySlug: "stationery",
    price: 200,
    image: IMG.calculator,
    specs: ["Original Casio"],
    featured: true,
    hotDeal: true
  }),
  p({
    id: "p-sharp-calc",
    slug: "sharp-scientific-calculator",
    name: "Scientific Calculator (Sharp Original)",
    brand: "Sharp",
    categorySlug: "stationery",
    price: 200,
    image: IMG.calculator,
    specs: ["Original Sharp"]
  }),

  // —— Locks ——
  p({
    id: "p-union-mortice",
    slug: "union-mortice-lock",
    name: "Union Mortice Lock",
    brand: "Union",
    categorySlug: "locks",
    price: 140,
    image: IMG.lock,
    featured: true
  }),
  p({
    id: "p-fieldex-mortice",
    slug: "fieldex-mortice-lock",
    name: "Fieldex Mortice Lock",
    brand: "Fieldex",
    categorySlug: "locks",
    price: 110,
    image: IMG.lock
  }),

  // —— Phone stands ——
  p({
    id: "p-stand-50",
    slug: "phone-stand-50",
    name: "Phone Stand / Holder",
    categorySlug: "phone-accessories",
    price: 50,
    image: IMG.stand,
    featured: true
  }),
  p({
    id: "p-stand-60",
    slug: "phone-stand-60",
    name: "Phone Stand / Holder (Plus)",
    categorySlug: "phone-accessories",
    price: 60,
    image: IMG.stand
  }),
  p({
    id: "p-stand-200",
    slug: "phone-stand-200",
    name: "Phone Stand / Holder (Premium)",
    categorySlug: "phone-accessories",
    price: 200,
    image: IMG.stand
  }),
  p({
    id: "p-full-glue",
    slug: "screen-protector-full-glue",
    name: "Screen Protector — Full Glue",
    categorySlug: "phone-accessories",
    price: 50,
    image: IMG.protector
  }),
  p({
    id: "p-privacy",
    slug: "screen-protector-privacy",
    name: "Screen Protector — Privacy",
    categorySlug: "phone-accessories",
    price: 80,
    image: IMG.protector,
    hotDeal: true
  }),
  p({
    id: "p-pouch",
    slug: "phone-pouch",
    name: "Phone Pouch",
    categorySlug: "phone-accessories",
    price: 80,
    image: IMG.pouch
  }),

  // —— Memory cards ——
  ...([
    [2, 45],
    [4, 55],
    [8, 70],
    [16, 85],
    [32, 115],
    [64, 140],
    [128, 210]
  ] as const).map(([gb, price]) =>
    p({
      id: `p-sd-${gb}`,
      slug: `memory-card-${gb}gb`,
      name: `Memory Card ${gb}GB`,
      categorySlug: "storage",
      price,
      image: IMG.storage,
      specs: [
        `${gb}GB`,
        "Optional FREE loading: movies, games, music & school materials"
      ],
      featured: gb === 32 || gb === 64
    })
  ),

  // —— Flash disks ——
  ...([
    [4, 60],
    [8, 75],
    [16, 90],
    [32, 120],
    [64, 150],
    [128, 210]
  ] as const).map(([gb, price]) =>
    p({
      id: `p-usb-${gb}`,
      slug: `flash-disk-${gb}gb`,
      name: `Flash Disk ${gb}GB`,
      categorySlug: "storage",
      price,
      image: IMG.storage,
      specs: [
        `${gb}GB`,
        "Optional FREE loading: movies, games, music & school materials"
      ],
      featured: gb === 32
    })
  ),

  // —— Hard drives ——
  ...([
    ["250GB", 200],
    ["320GB", 300],
    ["500GB", 400],
    ["1TB", 600],
    ["2TB", 1390],
    ["3TB", 1850]
  ] as const).map(([size, price]) =>
    p({
      id: `p-hdd-${size}`,
      slug: `hard-drive-${size.toLowerCase()}`,
      name: `Hard Drive ${size}`,
      categorySlug: "storage",
      price,
      image: IMG.hdd,
      specs: [size, "Optional FREE loading available"],
      featured: size === "1TB",
      hotDeal: size === "1TB"
    })
  ),

  // —— Computers ——
  p({
    id: "p-wired-mouse",
    slug: "wired-mouse",
    name: "Wired Mouse",
    categorySlug: "computers",
    price: 60,
    image: IMG.mouse
  }),
  p({
    id: "p-wireless-mouse",
    slug: "wireless-mouse",
    name: "Wireless Mouse",
    categorySlug: "computers",
    price: 75,
    image: IMG.mouse,
    featured: true,
    hotDeal: true
  }),
  p({
    id: "p-wired-kb",
    slug: "wired-keyboard",
    name: "Wired Keyboard",
    categorySlug: "computers",
    price: 250,
    image: IMG.keyboard
  }),
  p({
    id: "p-wireless-kb",
    slug: "wireless-keyboard",
    name: "Wireless Keyboard",
    categorySlug: "computers",
    price: 300,
    image: IMG.keyboard
  }),
  p({
    id: "p-hdd-case-2",
    slug: "hdd-casing-usb-2",
    name: "Hard Drive Casing USB 2.0",
    categorySlug: "computers",
    price: 100,
    image: IMG.casing,
    specs: ["USB 2.0"]
  }),
  p({
    id: "p-hdd-case-3",
    slug: "hdd-casing-usb-3",
    name: "Hard Drive Casing USB 3.0",
    categorySlug: "computers",
    price: 150,
    image: IMG.casing,
    specs: ["USB 3.0"]
  }),

  // —— Chargers & cables ——
  p({
    id: "p-iphone-c-full",
    slug: "iphone-type-c-full-charger",
    name: "iPhone Type-C Full Charger",
    brand: "Apple-compatible",
    categorySlug: "chargers",
    price: 150,
    image: IMG.iphone,
    featured: true
  }),
  p({
    id: "p-typec-head",
    slug: "type-c-charger-head",
    name: "Type-C Charger Head",
    categorySlug: "chargers",
    price: 100,
    image: IMG.samsung
  }),
  p({
    id: "p-oraimo-full",
    slug: "oraimo-normal-full-charger",
    name: "Oraimo Normal Full Charger",
    brand: "Oraimo",
    categorySlug: "chargers",
    price: 100,
    image: IMG.oraimo,
    featured: true
  }),
  p({
    id: "p-oraimo-head",
    slug: "oraimo-charger-head",
    name: "Oraimo Charger Head",
    brand: "Oraimo",
    categorySlug: "chargers",
    price: 50,
    image: IMG.oraimo
  }),
  p({
    id: "p-mango-ctc",
    slug: "mango-c-to-c-full-charger",
    name: "Mango C to C Full Charger",
    brand: "Mango",
    categorySlug: "chargers",
    price: 150,
    image: IMG.cable
  }),
  p({
    id: "p-samsung-ctc",
    slug: "samsung-c-to-c-full-charger",
    name: "Samsung C to C Full Charger",
    brand: "Samsung",
    categorySlug: "chargers",
    price: 150,
    image: IMG.samsung
  }),
  p({
    id: "p-sivia-cable",
    slug: "sivia-cable",
    name: "SIVIA Cable",
    brand: "Sivia",
    categorySlug: "chargers",
    price: 50,
    image: IMG.cable
  }),
  p({
    id: "p-seal-tape",
    slug: "seal-tape",
    name: "Seal Tape",
    categorySlug: "chargers",
    price: 30,
    image: IMG.glue
  }),
  p({
    id: "p-oraimo-headset",
    slug: "oraimo-original-headset",
    name: "Oraimo Original Headset",
    brand: "Oraimo",
    categorySlug: "audio",
    price: 60,
    image: IMG.headset
  }),
  p({
    id: "p-akg",
    slug: "samsung-akg-headset",
    name: "Samsung AKG Headset",
    brand: "Samsung",
    categorySlug: "audio",
    price: 35,
    image: IMG.headset
  }),
  p({
    id: "p-mango-hs",
    slug: "mango-headset",
    name: "Mango Headset",
    brand: "Mango",
    categorySlug: "audio",
    price: 50,
    image: IMG.headset
  }),

  // —— Power ——
  p({
    id: "p-laptop-full",
    slug: "laptop-charger-full-set",
    name: "Laptop Charger Full Set",
    categorySlug: "power",
    price: 250,
    image: IMG.laptopCharger,
    specs: ["HP, Dell, Lenovo, Acer, Asus, Toshiba, Samsung"],
    description:
      "Laptop charger full set for HP, Dell, Lenovo, Acer, Asus, Toshiba and Samsung. Tell us your laptop model when ordering.",
    featured: true
  }),
  p({
    id: "p-laptop-pack",
    slug: "laptop-power-pack-only",
    name: "Laptop Power Pack Only",
    categorySlug: "power",
    price: 200,
    image: IMG.laptopCharger,
    specs: ["Power pack only — HP, Dell, Lenovo, Acer, Asus, Toshiba, Samsung"]
  }),
  ...([
    ["3-way", "3m", 50],
    ["3-way", "5m", 55],
    ["4-way", "3m", 60],
    ["4-way", "5m", 65],
    ["5-way", "3m", 70],
    ["5-way", "5m", 75],
    ["6-way", "3m", 80],
    ["6-way", "5m", 85]
  ] as const).map(([ways, len, price]) =>
    p({
      id: `p-ext-${ways}-${len}`,
      slug: `extension-${ways}-${len}`,
      name: `Extension Cable ${ways} (${len})`,
      categorySlug: "power",
      price,
      image: IMG.extension,
      specs: [ways, len]
    })
  ),

  // —— Audio / pods ——
  p({
    id: "p-ap-pro3",
    slug: "airpods-pro-3",
    name: "AirPods Pro 3",
    categorySlug: "audio",
    price: 300,
    image: IMG.airpods,
    featured: true
  }),
  p({
    id: "p-ap-pro2-c",
    slug: "airpods-pro-2-type-c",
    name: "AirPods Pro 2 (Type-C)",
    categorySlug: "audio",
    price: 350,
    image: IMG.airpods,
    hotDeal: true
  }),
  p({
    id: "p-ap-pro2",
    slug: "airpods-pro-2",
    name: "AirPods Pro 2",
    categorySlug: "audio",
    price: 300,
    image: IMG.airpods
  }),
  p({
    id: "p-ap-pro1",
    slug: "airpods-pro-1",
    name: "AirPods Pro 1",
    categorySlug: "audio",
    price: 280,
    image: IMG.airpods
  }),
  p({
    id: "p-oraimo-f9",
    slug: "oraimo-air-f9-pro-3",
    name: "Oraimo Air F9 Pro 3",
    brand: "Oraimo",
    categorySlug: "audio",
    price: 200,
    image: IMG.airpods,
    featured: true
  }),
  p({
    id: "p-sivia-s13",
    slug: "sivia-s13",
    name: "Sivia S13",
    brand: "Sivia",
    categorySlug: "audio",
    price: 150,
    image: IMG.airpods
  }),
  p({
    id: "p-tws-f9",
    slug: "tws-f9-5",
    name: "TWS F9-5",
    categorySlug: "audio",
    price: 200,
    image: IMG.airpods
  }),
  p({
    id: "p-ubl",
    slug: "ubl-harman",
    name: "UBL Harman",
    categorySlug: "audio",
    price: 200,
    image: IMG.speaker
  }),
  p({
    id: "p-vortex",
    slug: "vortex-pods",
    name: "Vortex Pods",
    categorySlug: "audio",
    price: 150,
    image: IMG.airpods
  }),
  p({
    id: "p-mango-pods",
    slug: "mango-pods",
    name: "Mango Pods",
    brand: "Mango",
    categorySlug: "audio",
    price: 150,
    image: IMG.airpods
  }),
  p({
    id: "p-tronix",
    slug: "tronix-pods",
    name: "Tronix Pods",
    categorySlug: "audio",
    price: 150,
    image: IMG.airpods
  }),
  p({
    id: "p-calus-s69",
    slug: "calus-s69-speaker",
    name: "CALUS S69 Bluetooth Speaker",
    brand: "CALUS",
    categorySlug: "audio",
    price: 500,
    image: IMG.speaker,
    featured: true
  }),
  p({
    id: "p-calus-s39",
    slug: "calus-s39-speaker",
    name: "CALUS S39 Bluetooth Speaker",
    brand: "CALUS",
    categorySlug: "audio",
    price: 200,
    image: IMG.speaker
  }),
  p({
    id: "p-r800",
    slug: "r800-speaker",
    name: "R800 Bluetooth Speaker",
    categorySlug: "audio",
    price: 250,
    image: IMG.speaker
  }),

  // —— Watches ——
  p({
    id: "p-t900",
    slug: "t900-ultra",
    name: "T900 Ultra Smart Watch",
    categorySlug: "watches",
    price: 250,
    image: IMG.watch,
    featured: true
  }),
  p({
    id: "p-kt8",
    slug: "kt8-ultra-max",
    name: "KT8 Ultra Max Smart Watch",
    categorySlug: "watches",
    price: 300,
    image: IMG.watch,
    hotDeal: true
  })
];

function withVariants(p: SeedProduct): Product {
  return { ...p, variants: [] };
}

export function getProduct(slug: string): Product | undefined {
  const found = products.find((x) => x.slug === slug);
  return found ? withVariants(found) : undefined;
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products
    .filter((p) => p.categorySlug === categorySlug)
    .map(withVariants);
}

export function getFeatured(): Product[] {
  return products.filter((p) => p.featured).map(withVariants);
}

export function getHotDeals(): Product[] {
  return products.filter((p) => p.hotDeal).map(withVariants);
}
