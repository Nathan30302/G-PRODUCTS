import { Product } from "@/lib/types";
import { catalogUrl, galleryFilesForSlug } from "@/lib/catalog-photos";

// Seed catalog — colour variants are synced via scripts/sync-catalog-photos.ts.
type SeedProduct = Omit<Product, "variants">;

function p(
  partial: Omit<SeedProduct, "images" | "stock" | "shortSpecs" | "description"> & {
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
    images: galleryFilesForSlug(partial.slug).map((file) => ({
      url: catalogUrl(file),
      alt: `${partial.name} — G-Products`
    })),
    shortSpecs: partial.specs ?? [],
    description:
      partial.description ??
      `${partial.name} from G-Products. Genuine stock, fair prices, and pickup or campus delivery where applicable. Message us on WhatsApp to confirm availability.`,
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
    name: "Hardcover Counter Book 192 pages",
    brand: "Aafrin Hyperlux",
    categorySlug: "stationery",
    price: 18,
    specs: ["192 pages", "Premium hardcover", "Proudly Zambian"],
    description:
      "Aafrin Hyperlux hardcover counter book, 192 pages. Name, subject, school and grade lines on the cover. Back-to-school stock at G-Products.",
    featured: true
  }),
  p({
    id: "p-ex-288",
    slug: "exercise-book-288",
    name: "Hardcover Counter Book 288 pages",
    brand: "Professor",
    categorySlug: "stationery",
    price: 40,
    specs: ["288 pages", "Premium hardcover"],
    description:
      "Professor hardcover counter book, 288 pages. Thick hardcover with a red spine — the 288-page option from the back-to-school offer."
  }),
  p({
    id: "p-tipex",
    slug: "tipex",
    name: "Tipex",
    categorySlug: "stationery",
    price: 10,
    specs: ["Correction fluid / tape style as stocked"],
    description:
      "Correction fluid for clean fixes on homework, notes and office paperwork. Everyday stationery staple at G-Products."
  }),
  p({
    id: "p-glue",
    slug: "glue",
    name: "Glue",
    categorySlug: "stationery",
    price: 3,
    specs: ["School & craft use"],
    description:
      "Handy glue stick for school projects, crafts and light office sticking. Affordable everyday stationery at G-Products."
  }),
  p({
    id: "p-corms",
    slug: "corms",
    name: "Corms",
    categorySlug: "stationery",
    price: 3,
    description:
      "Corms as stocked in-store for school and office use. Ask on WhatsApp if you need a specific size."
  }),
  p({
    id: "p-bic-crystal",
    slug: "bic-crystal-pen",
    name: "Bic Crystal Pen",
    brand: "Bic",
    categorySlug: "stationery",
    price: 5,
    specs: ["Classic Bic write", "Reliable everyday ballpoint"],
    description:
      "Classic Bic Crystal ballpoint — smooth everyday writing for class, exams and the office.",
    featured: true
  }),
  p({
    id: "p-bic-fine",
    slug: "bic-fine-pen",
    name: "Bic Fine Pen — pick a colour",
    brand: "Bic",
    categorySlug: "stationery",
    price: 7,
    specs: ["Fine tip", "Colour options"],
    description:
      "Bic fine-tip pen with colour options. Choose your colour on the product page for notes and neat handwriting."
  }),
  p({
    id: "p-nataraj",
    slug: "nataraj-pen",
    name: "Nataraj Pen",
    brand: "Nataraj",
    categorySlug: "stationery",
    price: 3,
    description:
      "Affordable Nataraj ballpoint for everyday school and office writing."
  }),
  p({
    id: "p-pencil",
    slug: "pencil",
    name: "Pencil",
    categorySlug: "stationery",
    price: 3,
    specs: ["HB / standard as stocked"],
    description:
      "Standard HB pencil for school, sketching and exam work. Pair with our sharpeners and erasers at G-Products."
  }),
  p({
    id: "p-ruler",
    slug: "ruler",
    name: "Ruler",
    categorySlug: "stationery",
    price: 8,
    description:
      "Straight edge ruler for maths, technical drawing and classroom work."
  }),
  p({
    id: "p-sharpener",
    slug: "sharpener",
    name: "Sharpener",
    categorySlug: "stationery",
    price: 3,
    description:
      "Compact metal pencil sharpener for school bags and desk drawers — everyday stationery essential."
  }),
  p({
    id: "p-marker",
    slug: "marker",
    name: "Marker",
    categorySlug: "stationery",
    price: 5,
    description:
      "Permanent-style marker for labels, posters and general marking. Check colour options in store or on WhatsApp."
  }),
  p({
    id: "p-keyholder-5",
    slug: "key-holder-5",
    name: "Key Holder",
    categorySlug: "locks",
    price: 5,
    specs: ["Basic key ring"],
    description: "Simple steel key ring — hold your house and shop keys."
  }),
  p({
    id: "p-keyholder-15",
    slug: "key-holder-15",
    name: "Premium Key Holder",
    categorySlug: "locks",
    price: 15,
    specs: ["Leather organiser", "Metal hooks"],
    description:
      "Premium leather key holder / organiser with metal hooks — neater than a plain ring."
  }),
  p({
    id: "p-envelope",
    slug: "envelope",
    name: "Envelope",
    categorySlug: "stationery",
    price: 5,
    description:
      "Plain white envelope for letters, forms and school submissions. Ask for available sizes in store or on WhatsApp."
  }),
  p({
    id: "p-ream",
    slug: "ream-paper",
    name: "Ream Paper",
    categorySlug: "stationery",
    price: 115,
    specs: ["Full ream", "A4 as stocked", "80gsm class as stocked"],
    description:
      "Full ream of A4 printing / photocopy paper — the everyday Zambia office and school pack. Ideal for our print services too. Confirm brand/GSM on WhatsApp if you need a specific pack.",
    featured: true
  }),
  p({
    id: "p-casio",
    slug: "casio-scientific-calculator",
    name: "Scientific Calculator (Casio Original)",
    brand: "Casio",
    categorySlug: "stationery",
    price: 200,
    specs: ["Original Casio", "fx-82MS", "240 functions", "2-line display"],
    description:
      "Original Casio scientific calculator as stocked in the shop (fx-82MS style: 2-line display, 240 functions). Built for school and exam work.",
    featured: true,
    hotDeal: true
  }),
  p({
    id: "p-sharp-calc",
    slug: "sharp-scientific-calculator",
    name: "Sharp EL-531WH Scientific Calculator",
    brand: "Sharp",
    categorySlug: "stationery",
    price: 200,
    specs: ["EL-531WH", "Advanced D.A.L.", "Entry-level scientific"],
    description:
      "Sharp EL-531WH scientific calculator with Advanced D.A.L. An entry-level scientific calculator for high school and university — durable enough for everyday use."
  }),

  // —— Locks ——
  p({
    id: "p-union-mortice",
    slug: "union-mortice-lock",
    name: "Union Mortice Lock",
    brand: "Union",
    categorySlug: "locks",
    price: 140,
    specs: ["3-lever mortice", "Keys included", "Timber doors"],
    description:
      "Union-style 3-lever mortice lock — the familiar hardware-store lock used on timber doors around Lusaka. Supplied with keys.",
    featured: true
  }),
  p({
    id: "p-fieldex-mortice",
    slug: "fieldex-mortice-lock",
    name: "Fieldex Mortice Lock",
    brand: "Fieldex",
    categorySlug: "locks",
    price: 110,
    specs: ["Brass finish", "Mortice set", "Keys included"],
    description:
      "Fieldex brass mortice lock set with keys — a solid everyday door lock for homes and shops."
  }),

  // —— Phone stands ——
  p({
    id: "p-stand-50",
    slug: "phone-stand-50",
    name: "Multi-Function Phone Stand",
    categorySlug: "phone-accessories",
    price: 50,
    specs: [
      "Multi-angle adjustable",
      "Sturdy metal build",
      "Universal compatibility"
    ],
    description:
      "Multi-function metal phone stand with a round base and hinged neck. Multi-angle adjustable, sturdy metal build and universal compatibility for most phones. Pick a finish on the product page.",
    featured: true
  }),
  p({
    id: "p-stand-60",
    slug: "phone-stand-60",
    name: "Phone Stand / Holder (Plus)",
    categorySlug: "phone-accessories",
    price: 60,
    specs: ["Desk / bedside stand", "Holds most phones"],
    description:
      "Sturdy phone stand for desks and bedside tables. Keeps your phone upright for video calls, watching and charging."
  }),
  p({
    id: "p-stand-200",
    slug: "phone-stand-200",
    name: "Phone Stand / Holder (Premium)",
    categorySlug: "phone-accessories",
    price: 200,
    specs: ["Premium build", "Multi-angle"],
    description:
      "Premium phone holder with a more solid build for everyday desk use. Confirm finish options with our team."
  }),
  p({
    id: "p-full-glue",
    slug: "screen-protector-full-glue",
    name: "Screen Protector — Full Glue",
    categorySlug: "phone-accessories",
    price: 50,
    specs: ["Full-glue fit", "Model-specific — confirm your phone"],
    description:
      "Full-glue screen protector for clearer edge-to-edge coverage. Tell us your phone model so we fit the right sheet."
  }),
  p({
    id: "p-privacy",
    slug: "screen-protector-privacy",
    name: "Screen Protector — Privacy",
    categorySlug: "phone-accessories",
    price: 80,
    specs: ["Privacy filter", "Confirm your phone model"],
    description:
      "Privacy screen protector that limits side viewing angles — useful on campus and in public. Share your phone model for the correct size.",
    hotDeal: true
  }),
  p({
    id: "p-pouch",
    slug: "phone-pouch",
    name: "iPhone Silicone Pouch",
    categorySlug: "phone-accessories",
    price: 80,
    specs: [
      "K80 for all colours",
      "Soft liquid silicone",
      "16 colours",
      "iPhone 6 through 16 Pro Max"
    ],
    description:
      "Soft liquid-silicone iPhone pouches — matte, protective and colourful. Pick a colour, then your iPhone model from 6 / 6 Plus through 16 Pro Max. K80 for every colour."
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
  }),
  p({
    id: "p-wireless-mouse",
    slug: "wireless-mouse",
    name: "Logitech M186 Wireless Mouse",
    brand: "Logitech",
    categorySlug: "computers",
    price: 75,
    specs: [
      "M186",
      "Plug-and-play wireless plus comfort",
      "USB nano receiver included"
    ],
    description:
      "Logitech M186 wireless mouse — plug-and-play wireless plus comfort. Compact shape with a USB nano receiver in the pack. Pick black or white.",
    featured: true,
    hotDeal: true
  }),
  p({
    id: "p-wired-kb",
    slug: "wired-keyboard",
    name: "Wired Keyboard",
    categorySlug: "computers",
    price: 250,
  }),
  p({
    id: "p-wireless-kb",
    slug: "wireless-keyboard",
    name: "Wireless Keyboard",
    categorySlug: "computers",
    price: 300,
  }),
  p({
    id: "p-hdd-case-2",
    slug: "hdd-casing-usb-2",
    name: "Hard Drive Casing USB 2.0",
    categorySlug: "computers",
    price: 100,
    specs: ["USB 2.0"]
  }),
  p({
    id: "p-hdd-case-3",
    slug: "hdd-casing-usb-3",
    name: "Hard Drive Casing USB 3.0",
    categorySlug: "computers",
    price: 150,
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
    specs: [
      "UK Type G plug (Zambia)",
      "USB-C wall charger",
      "USB-C to Lightning cable"
    ],
    description:
      "Full iPhone Type-C charger set with a UK Type G wall plug for Zambia sockets, plus USB-C to Lightning cable. Not a US two-pin brick.",
    featured: true
  }),
  p({
    id: "p-typec-head",
    slug: "type-c-charger-head",
    name: "Type-C Charger Head",
    categorySlug: "chargers",
    price: 100,
    specs: ["UK Type G plug", "USB-C port", "Compact foldable pins"],
    description:
      "White USB-C charger head with UK Type G three-pin plug — ready for Zambian wall sockets."
  }),
  p({
    id: "p-oraimo-full",
    slug: "oraimo-normal-full-charger",
    name: "Oraimo Full Charger (Type G)",
    brand: "Oraimo",
    categorySlug: "chargers",
    price: 100,
    specs: [
      "2A Fast-Charging & Stable Performance",
      "UK Type G plug",
      "AniFast™ Technology",
      "Fire-proof & anti-slip build",
      "Multi-protection system"
    ],
    description:
      "Oraimo wall charger with UK Type G plug and cable. 2A fast charging and stable performance, fire-proof anti-slip durable build, multi-protection system for safe charging, AniFast™ technology and a compact portable design.",
    featured: true
  }),
  p({
    id: "p-oraimo-head",
    slug: "oraimo-charger-head",
    name: "Oraimo Charger Head",
    brand: "Oraimo",
    categorySlug: "chargers",
    price: 50,
  }),
  p({
    id: "p-mango-ctc",
    slug: "mango-c-to-c-full-charger",
    name: "Mango 67W PD Super Fast Charger",
    brand: "Mango",
    categorySlug: "chargers",
    price: 150,
    specs: ["67W PD", "MG-NC06", "USB-C to USB-C cable", "UK Type G plug"],
    description:
      "Mango MG-NC06 67W USB-C PD super fast wall charger with USB-C to USB-C cable. UK Type G fused plug. Safe and reliable charge for phones and small laptops."
  }),
  p({
    id: "p-oraimo-cable",
    slug: "oraimo-duraline-2-cable",
    name: "Oraimo Duraline 2 Fast Charging Cable",
    brand: "Oraimo",
    categorySlug: "chargers",
    price: 50,
    specs: [
      "Duraline 2",
      "Micro USB / Lightning",
      "5V 2A Fast Charge & Sync",
      "1 metre",
      "OD4.0 thicker wire"
    ],
    description:
      "Oraimo Duraline 2 fast charging cable (1m). Superior copper varnished core for fast charging and high-speed data. Upgraded OD4.0 thicker wire and stronger joints that withstand twist, tug and tangle. Micro USB / Lightning, 5V 2A Fast Charge & Sync."
  }),
  p({
    id: "p-samsung-ctc",
    slug: "samsung-c-to-c-full-charger",
    name: "Samsung C to C Full Charger",
    brand: "Samsung",
    categorySlug: "chargers",
    price: 150,
    specs: ["UK Type G plug", "USB-C to USB-C cable", "Super Fast Charging"],
    description:
      "Samsung-style USB-C full charger with UK Type G wall plug and USB-C to USB-C cable — correct for Zambia sockets."
  }),
  p({
    id: "p-sivia-cable",
    slug: "sivia-cable",
    name: "SIVIA Cable",
    brand: "Sivia",
    categorySlug: "chargers",
    price: 50,
    specs: ["USB-A to USB-C", "Data sync & charge"],
    description:
      "White USB-A to USB-C charging and data cable — everyday phone and accessory lead."
  }),
  p({
    id: "p-seal-tape",
    slug: "seal-tape",
    name: "Seal Tape",
    categorySlug: "chargers",
    price: 30,
    specs: ["Clear packing tape"],
    description: "Clear seal / packing tape roll for parcels and shop use."
  }),
  p({
    id: "p-oraimo-headset",
    slug: "oraimo-original-headset",
    name: "Oraimo Lite Conch 2 Headset",
    brand: "Oraimo",
    categorySlug: "audio",
    price: 60,
    specs: [
      "OEP-E17 / Conch 2",
      "White or Black",
      "Deeper bass",
      "3.5mm jack"
    ],
    description:
      "Oraimo Lite Conch 2 (OEP-E17) wired in-ear earphones with deeper bass and comfortable eartips. Choose white or black. Standard 3.5mm jack."
  }),
  p({
    id: "p-akg",
    slug: "samsung-akg-headset",
    name: "Samsung AKG Headset",
    brand: "Samsung",
    categorySlug: "audio",
    price: 35,
    specs: ["USB-C", "AKG tuned", "White or Black"],
    description:
      "Samsung AKG USB-C wired earphones. Choose white or black — distinct from the Oraimo 3.5mm headset."
  }),
  p({
    id: "p-mango-hs",
    slug: "mango-headset",
    name: "Mango Headset",
    brand: "Mango",
    categorySlug: "audio",
    price: 50,
    specs: ["Wired in-ear", "Inline mic"],
    description:
      "Mango wired in-ear headset with inline mic — a different look from Samsung AKG and Oraimo Conch."
  }),

  // —— Power ——
  p({
    id: "p-laptop-full",
    slug: "laptop-charger-full-set",
    name: "Laptop Charger Full Set",
    categorySlug: "power",
    price: 250,
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
    specs: ["Power pack only — HP, Dell, Lenovo, Acer, Asus, Toshiba, Samsung"]
  }),
  p({
    id: "p-extension",
    slug: "extension-cable",
    name: "Extension Cable",
    brand: "PK TRUSTS",
    categorySlug: "power",
    price: 50,
    specs: [
      "PK TRUSTS Quality Electrical Products",
      "13A fused sleeved UK Type G plug",
      "3-way · 4-way · 5-way · 6-way",
      "3m or 5m cable",
      "Max load 3000W"
    ],
    description:
      "PK TRUSTS UK Type G extension sockets — the same Quality Electrical Products brand you know in shop. Heavy-duty white strip, 13A fused sleeved plug, up to 3000W. Choose how many ways (3, 4, 5 or 6) and cable length (3m or 5m); price updates with your pick.",
    featured: true
  }),

  // —— Audio / pods ——
  p({
    id: "p-ap-pro3",
    slug: "airpods-pro-3",
    name: "AirPods Pro 3",
    categorySlug: "audio",
    price: 300,
    specs: ["Latest Pro generation", "Case + earbuds"],
    description:
      "AirPods Pro 3 — newest Pro look. Photos show the latest case and buds (distinct from Pro 2).",
    featured: true
  }),
  p({
    id: "p-ap-pro2-c",
    slug: "airpods-pro-2-type-c",
    name: "AirPods Pro 2 (Type-C)",
    categorySlug: "audio",
    price: 350,
    specs: ["USB-C charging case", "2nd generation"],
    description:
      "AirPods Pro 2 with USB-C charging case — the Type-C port is the clear difference from Lightning Pro 2.",
    hotDeal: true
  }),
  p({
    id: "p-ap-pro2",
    slug: "airpods-pro-2",
    name: "AirPods Pro 2",
    categorySlug: "audio",
    price: 300,
    specs: ["Lightning case", "Buds outside case shots"],
    description:
      "AirPods Pro 2 (Lightning). Gallery shows buds outside the case so you can tell them apart from Type-C Pro 2 and Pro 1."
  }),
  p({
    id: "p-ap-pro1",
    slug: "airpods-pro-1",
    name: "AirPods Pro 1",
    categorySlug: "audio",
    price: 280,
    specs: ["1st generation", "Renewed quality-checked"],
    description:
      "AirPods Pro 1st generation (renewed). Premium sound, ANC, and wireless charging case — clearly labelled as Gen 1."
  }),
  p({
    id: "p-oraimo-f9",
    slug: "oraimo-air-f9-pro-3",
    name: "Oraimo Air F9 Pro 3",
    brand: "Oraimo",
    categorySlug: "audio",
    price: 200,
    featured: true
  }),
  p({
    id: "p-sivia-s13",
    slug: "sivia-s13",
    name: "Sivia S13",
    brand: "Sivia",
    categorySlug: "audio",
    price: 150,
  }),
  p({
    id: "p-tws-f9",
    slug: "tws-f9-5",
    name: "TWS F9-5",
    categorySlug: "audio",
    price: 200,
  }),
  p({
    id: "p-ubl",
    slug: "ubl-harman",
    name: "UBL Harman",
    categorySlug: "audio",
    price: 200,
  }),
  p({
    id: "p-vortex",
    slug: "vortex-pods",
    name: "Vortex Pods",
    categorySlug: "audio",
    price: 150,
  }),
  p({
    id: "p-mango-pods",
    slug: "mango-pods",
    name: "Mango Pods",
    brand: "Mango",
    categorySlug: "audio",
    price: 150,
  }),
  p({
    id: "p-tronix",
    slug: "tronix-pods",
    name: "Tronix Pods",
    categorySlug: "audio",
    price: 150,
  }),
  p({
    id: "p-calus-s69",
    slug: "calus-s69-speaker",
    name: "CALUS S69 Bluetooth Speaker",
    brand: "CALUS",
    categorySlug: "audio",
    price: 500,
    featured: true
  }),
  p({
    id: "p-calus-s39",
    slug: "calus-s39-speaker",
    name: "CALUS S39 Bluetooth Speaker",
    brand: "CALUS",
    categorySlug: "audio",
    price: 200,
  }),
  p({
    id: "p-r800",
    slug: "r800-speaker",
    name: "Luvstar / R800 Bluetooth Speaker",
    categorySlug: "audio",
    price: 250,
    specs: ["LED ring controls", "Volume + light modes"],
    description:
      "Portable cylindrical Bluetooth speaker with a top LED control ring (Luvstar-style unit as photographed). Compact party speaker at K250."
  }),

  // —— Watches ——
  p({
    id: "p-t900",
    slug: "t900-ultra",
    name: "T900 Ultra Smart Watch",
    categorySlug: "watches",
    price: 250,
    specs: [
      "2.09 inch HD display",
      "45mm case",
      "Bluetooth calling",
      "Wireless charging",
      "Sports Mode",
      "Health Mode (SpO2 & sleep)"
    ],
    description:
      "T900 Ultra smart watch with a 2.09 inch HD display and 45mm case. Bluetooth calling, wireless charging, Sports Mode and Health Mode including SpO2 and sleep monitoring. Pick Orange, White, Green or Black.",
    featured: true
  }),
  p({
    id: "p-kt8",
    slug: "kt8-ultra-max",
    name: "KT8 Ultra Max Smart Watch",
    categorySlug: "watches",
    price: 300,
    hotDeal: true
  }),
  p({
    id: "p-a58-plus",
    slug: "a58-plus-set",
    name: "A58 Plus Watch & Jewellery Set",
    categorySlug: "watches",
    price: 250,
    specs: ["2.02 inch smartwatch", "Analog watch", "Necklace, ring, earrings, bracelet"],
    description:
      "A58 Plus gift set: 2.02 inch big-screen smartwatch with extra strap, plus a matching analog watch, bracelet, necklace, ring and earrings. Photos show the set in the box."
  }),

  // —— Phones ——
  p({
    id: "p-momofly-v101",
    slug: "momofly-v101",
    name: "Momofly V101 Feature Phone",
    brand: "Momofly",
    categorySlug: "phones",
    price: 150,
    specs: ["Wireless FM", "Physical keypad"],
    description:
      "Momofly V101 candybar feature phone with a physical keypad and wireless FM. Exact unit as on the shop shelf."
  }),
  p({
    id: "p-calus-c3730c",
    slug: "calus-spark-c3730c",
    name: "CALUS SPARK C3730c",
    brand: "CALUS",
    categorySlug: "phones",
    price: 180,
    specs: ["Type-C", "King Voice", "1000 contacts", "400 messages"],
    description:
      "CALUS SPARK C3730c feature phone. Type-C charging, King Voice, 1000 contacts and 400 messages. Triple-camera look on the back as on the box."
  }),
  p({
    id: "p-kgtel-k2160",
    slug: "kgtel-k2160",
    name: "KGTEL K2160 Feature Phone",
    brand: "KGTEL",
    categorySlug: "phones",
    price: 160,
    specs: ["13 days standby", "1150mAh", "Type-C charger"],
    description:
      "KGTEL K2160 new-design feature phone. 13 days standby, 1150mAh battery and Type-C charging."
  }),
  p({
    id: "p-calus-c316",
    slug: "calus-c316",
    name: "CALUS C316 Feature Phone",
    brand: "CALUS",
    categorySlug: "phones",
    price: 140,
    specs: ["Dual SIM", "Type-C", "FM loud speaker", "Camera", "Torch"],
    description:
      "CALUS C316 Smart Live feature phone. Dual SIM, Type-C, FM loud speaker, camera and built-in torch. Photo of the real unit is in the gallery."
  }),

  // —— Home ——
  p({
    id: "p-kettle",
    slug: "winning-star-kettle",
    name: "Winning Star ST-6037 Electric Kettle",
    brand: "Winning Star",
    categorySlug: "home",
    price: 350,
    specs: ["3 litres", "Boil-dry protection", "ST-6037"],
    description:
      "Winning Star ST-6037 3 litre electric kettle with boil-dry protection. Dark blue metal body and black handle. UK-market kettle for home and campus.",
    featured: true
  }),
  p({
    id: "p-clipper",
    slug: "sundar-clipper",
    name: "Sundar SD-8828 Professional Clipper",
    brand: "Sundar",
    categorySlug: "home",
    price: 280,
    specs: ["SD-8828", "Adjustable blade", "Corded clipper"],
    description:
      "Sundar SD-8828 professional clipper. Powerful motor, adjustable blade, full-material safety body. Box lists both corded clipper and cordless-style battery icon — ask in the shop if you need cordless use."
  }),
  p({
    id: "p-heater",
    slug: "water-heating-element",
    name: "Water Heating Element 1500W",
    categorySlug: "home",
    price: 60,
    specs: ["1500W", "Portable immersion heater", "Hook + two-pole plug"],
    description:
      "Portable 1500W immersion water heating element for buckets and basins. Reliable hook and two-pole plug. Home, office and travel."
  }),
  p({
    id: "p-jbl-hp",
    slug: "jbl-headphones",
    name: "JBL Over-Ear Headphones",
    brand: "JBL",
    categorySlug: "audio",
    price: 300,
    specs: [
      "Active Noise Cancelling (ANC)",
      "Fast Pair with Google",
      "30+ hours battery life"
    ],
    description:
      "JBL over-ear headphones with Active Noise Cancelling for immersive listening, Google Fast Pair for seamless connectivity, and over 30 hours of battery life.",
    featured: true
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
