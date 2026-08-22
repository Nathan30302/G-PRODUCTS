/**
 * Unique HD catalog photos — 3 angles per product (and per colour).
 * Sources: Wikimedia Commons (free licenses) + unique generated studio shots
 * for items with no distinct free photo. Never reuse one file across products.
 */

export type CatalogVariantDef = {
  name: string;
  colorHex?: string;
  /** Per-option price (ZMW). Used for size/config options like extension leads. */
  price?: number;
  files: string[];
  quantity?: number;
};

export type CatalogProductDef = {
  slug: string;
  files: string[];
  variants?: CatalogVariantDef[];
};

const C = (file: string) => `/products/catalog/${file}`;

export function catalogUrl(file: string): string {
  return C(file);
}

export function wikiFile(name: string, width = 1400): string {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(name)}?width=${width}`;
}

export function generatedPhoto(prompt: string, seed: number): string {
  const q = encodeURIComponent(
    `${prompt}, professional e-commerce studio product photography, pure seamless white background, sharp HD, even lighting, no text overlay, no watermark`
  );
  return `https://image.pollinations.ai/prompt/${q}?width=1200&height=1200&nologo=true&seed=${seed}`;
}

function angles(slug: string, count = 3): string[] {
  return Array.from({ length: count }, (_, i) => `${slug}-${i + 1}.jpg`);
}

function colorAngles(slug: string, color: string, count = 3): string[] {
  const key = color.toLowerCase().replace(/\s+/g, "-");
  return Array.from({ length: count }, (_, i) => `${slug}-${key}-${i + 1}.jpg`);
}

/** Colourways that customers can pick */
const COLOUR_PRODUCTS: Record<
  string,
  { name: string; colorHex: string; quantity: number }[]
> = {
  "t900-ultra": [
    { name: "Orange", colorHex: "#ea580c", quantity: 8 },
    { name: "White", colorHex: "#f5f5f5", quantity: 6 },
    { name: "Green", colorHex: "#166534", quantity: 5 },
    { name: "Black", colorHex: "#111111", quantity: 7 }
  ],
  "kt8-ultra-max": [
    { name: "Black", colorHex: "#111111", quantity: 6 },
    { name: "Orange", colorHex: "#ea580c", quantity: 5 }
  ],
  corms: [
    { name: "Blue", colorHex: "#2563eb", quantity: 12 },
    { name: "Pink", colorHex: "#ec4899", quantity: 12 },
    { name: "Black", colorHex: "#111111", quantity: 12 }
  ],
  "bic-fine-pen": [
    { name: "Blue", colorHex: "#1d4ed8", quantity: 16 },
    { name: "Red", colorHex: "#dc2626", quantity: 12 },
    { name: "Black", colorHex: "#111111", quantity: 12 }
  ],
  "wireless-mouse": [
    { name: "Black", colorHex: "#111111", quantity: 8 },
    { name: "White", colorHex: "#f5f5f5", quantity: 6 }
  ],
  "wired-mouse": [
    { name: "Black", colorHex: "#111111", quantity: 10 }
  ],
  "phone-pouch": [
    { name: "Black", colorHex: "#111111", quantity: 8 },
    { name: "Blue", colorHex: "#1d4ed8", quantity: 6 }
  ],
  "bic-crystal-pen": [
    { name: "Blue", colorHex: "#1d4ed8", quantity: 20 },
    { name: "Black", colorHex: "#111111", quantity: 16 },
    { name: "Red", colorHex: "#dc2626", quantity: 12 }
  ],
  "phone-stand-50": [
    { name: "Black", colorHex: "#111111", quantity: 8 },
    { name: "White", colorHex: "#f5f5f5", quantity: 6 }
  ]
};

/** Size / config options with their own price (reuse existing photo prefixes). */
const OPTION_PRODUCTS: Record<
  string,
  {
    name: string;
    price: number;
    quantity: number;
    /** Existing catalog filename prefix, e.g. extension-3-way-3m */
    filePrefix: string;
  }[]
> = {
  "extension-cable": [
    { name: "3-way · 3m", price: 50, quantity: 12, filePrefix: "extension-3-way-3m" },
    { name: "3-way · 5m", price: 55, quantity: 12, filePrefix: "extension-3-way-5m" },
    { name: "4-way · 3m", price: 60, quantity: 12, filePrefix: "extension-4-way-3m" },
    { name: "4-way · 5m", price: 65, quantity: 12, filePrefix: "extension-4-way-5m" },
    { name: "5-way · 3m", price: 70, quantity: 12, filePrefix: "extension-5-way-3m" },
    { name: "5-way · 5m", price: 75, quantity: 12, filePrefix: "extension-5-way-5m" },
    { name: "6-way · 3m", price: 80, quantity: 12, filePrefix: "extension-6-way-3m" },
    { name: "6-way · 5m", price: 85, quantity: 12, filePrefix: "extension-6-way-5m" }
  ]
};

const ALL_SLUGS = [
  "exercise-book-192",
  "exercise-book-288",
  "tipex",
  "glue",
  "corms",
  "bic-crystal-pen",
  "bic-fine-pen",
  "nataraj-pen",
  "pencil",
  "ruler",
  "sharpener",
  "marker",
  "key-holder-5",
  "key-holder-15",
  "envelope",
  "ream-paper",
  "casio-scientific-calculator",
  "sharp-scientific-calculator",
  "union-mortice-lock",
  "fieldex-mortice-lock",
  "phone-stand-50",
  "phone-stand-60",
  "phone-stand-200",
  "screen-protector-full-glue",
  "screen-protector-privacy",
  "phone-pouch",
  "memory-card-2gb",
  "memory-card-4gb",
  "memory-card-8gb",
  "memory-card-16gb",
  "memory-card-32gb",
  "memory-card-64gb",
  "memory-card-128gb",
  "flash-disk-4gb",
  "flash-disk-8gb",
  "flash-disk-16gb",
  "flash-disk-32gb",
  "flash-disk-64gb",
  "flash-disk-128gb",
  "hard-drive-250gb",
  "hard-drive-320gb",
  "hard-drive-500gb",
  "hard-drive-1tb",
  "hard-drive-2tb",
  "hard-drive-3tb",
  "wired-mouse",
  "wireless-mouse",
  "wired-keyboard",
  "wireless-keyboard",
  "hdd-casing-usb-2",
  "hdd-casing-usb-3",
  "iphone-type-c-full-charger",
  "type-c-charger-head",
  "oraimo-normal-full-charger",
  "oraimo-charger-head",
  "mango-c-to-c-full-charger",
  "samsung-c-to-c-full-charger",
  "sivia-cable",
  "seal-tape",
  "oraimo-original-headset",
  "samsung-akg-headset",
  "mango-headset",
  "laptop-charger-full-set",
  "laptop-power-pack-only",
  "extension-cable",
  "airpods-pro-3",
  "airpods-pro-2-type-c",
  "airpods-pro-2",
  "airpods-pro-1",
  "oraimo-air-f9-pro-3",
  "sivia-s13",
  "tws-f9-5",
  "ubl-harman",
  "vortex-pods",
  "mango-pods",
  "tronix-pods",
  "calus-s69-speaker",
  "calus-s39-speaker",
  "r800-speaker",
  "t900-ultra",
  "kt8-ultra-max",
  "a58-plus-set",
  "momofly-v101",
  "calus-spark-c3730c",
  "kgtel-k2160",
  "calus-c316",
  "winning-star-kettle",
  "sundar-clipper",
  "water-heating-element",
  "jbl-headphones",
  "oraimo-duraline-2-cable"
];

const FLYER_SLUGS = new Set([
  "exercise-book-192",
  "exercise-book-288",
  "sharp-scientific-calculator",
  "phone-stand-50",
  "phone-pouch",
  "wireless-mouse",
  "oraimo-normal-full-charger",
  "mango-c-to-c-full-charger",
  "oraimo-duraline-2-cable",
  "oraimo-original-headset",
  "memory-card-32gb",
  "flash-disk-32gb",
  "extension-cable",
  "t900-ultra",
  "a58-plus-set",
  "momofly-v101",
  "calus-spark-c3730c",
  "kgtel-k2160",
  "calus-c316",
  "winning-star-kettle",
  "sundar-clipper",
  "water-heating-element",
  "jbl-headphones"
]);

export const catalogProducts: CatalogProductDef[] = ALL_SLUGS.map((slug) => {
  const flyer = FLYER_SLUGS.has(slug) ? [`${slug}-flyer.jpg`] : [];
  const options = OPTION_PRODUCTS[slug];
  if (options) {
    return {
      slug,
      files: flyer,
      variants: options.map((o) => ({
        name: o.name,
        price: o.price,
        quantity: o.quantity,
        files: angles(o.filePrefix)
      }))
    };
  }
  const colours = COLOUR_PRODUCTS[slug];
  if (colours) {
    return {
      slug,
      files: flyer,
      variants: colours.map((c) => ({
        ...c,
        files: colorAngles(
          slug,
          c.name,
          slug === "phone-pouch" ? 4 : 3
        )
      }))
    };
  }
  return { slug, files: [...angles(slug), ...flyer] };
});

export function catalogDefForSlug(slug: string): CatalogProductDef | undefined {
  return catalogProducts.find((p) => p.slug === slug);
}

export function galleryFilesForSlug(slug: string): string[] {
  const def = catalogDefForSlug(slug);
  if (!def) return angles(slug);
  if (def.variants?.length) return def.variants[0].files;
  return def.files;
}

/** Unique download URL for every catalog filename */
export const photoSources: Record<string, string> = {};

function addWiki(file: string, commonsName: string) {
  photoSources[file] = wikiFile(commonsName);
}

function addGen(file: string, prompt: string, seed: number) {
  photoSources[file] = generatedPhoto(prompt, seed);
}

/* —— Real manufacturer-style photos from Wikimedia Commons —— */
addWiki("airpods-pro-1-1.jpg", "AirPods_Pro_1.jpg");
addWiki("airpods-pro-1-2.jpg", "Apple_airpods_pro.jpg");
addWiki("airpods-pro-1-3.jpg", "Apple_airpods_pro_case.jpg");

addWiki("airpods-pro-2-1.jpg", "AirPods_Pro_(2nd_generation).jpg");
addWiki("airpods-pro-2-2.jpg", "AirPods_Pro_case.jpg");
addWiki("airpods-pro-2-3.jpg", "AirPods.jpg");

addWiki("bic-crystal-pen-1.jpg", "4_Bic_Cristal_pens_and_caps.jpg");
addWiki("bic-crystal-pen-2.jpg", "BIC_Cristal_Soft_-_Red.jpg");
addWiki("bic-crystal-pen-blue-1.jpg", "BIC_Cristal.jpg");

addWiki("tipex-1.jpg", "Tipp-Ex.jpg");
addWiki("tipex-2.jpg", "Tipp_Ex_Korrekturstift.jpg");
addWiki(
  "tipex-3.jpg",
  "CreativeTools.se_-_PackshotCreator_-_Tipp-Ex_Pocket_Mouse_(5078486344).jpg"
);

addWiki("glue-1.jpg", "FABER-CASTELL_glue_stick.jpg");
addWiki("glue-2.jpg", "Pritt_Sticks.JPG");
addWiki("glue-3.jpg", "Glue_Stick.jpg");

addWiki("exercise-book-192-1.jpg", "School_exercise_book_20180225.jpg");
addWiki(
  "exercise-book-192-2.jpg",
  "Jju_Wikipedia_Outreach_Zonkwa_2025_Exercise_BK_Front_with_Jju_colors.jpg"
);
addWiki(
  "exercise-book-192-3.jpg",
  "Jju_Wikipedia_Outreach_Zonkwa_2025_Exercise_BK_Back.jpg"
);

addWiki("casio-scientific-calculator-1.jpg", "CASIO_fx-991DE_PLUS.jpg");
addWiki("casio-scientific-calculator-2.jpg", "Casio_fx-991CW.jpg");
addWiki("casio-scientific-calculator-3.jpg", "Casio_fx-991DE_CW.jpg");

addWiki("union-mortice-lock-1.jpg", "Einsteckschloss_(1).JPG");
addWiki("union-mortice-lock-2.jpg", "Einsteckschloss_02_(fcm).jpg");
addWiki("union-mortice-lock-3.jpg", "Einsteckschloss_(3).JPG");
addWiki("fieldex-mortice-lock-1.jpg", "Einsteckschloss_06_(fcm).jpg");
addWiki("fieldex-mortice-lock-2.jpg", "Einsteckschloss_(2).JPG");
addWiki("fieldex-mortice-lock-3.jpg", "Schlossfalle_01_(fcm).jpg");
addWiki("key-holder-5-1.jpg", "Single_empty_keyring.jpg");
addWiki("key-holder-5-2.jpg", "Various_keys_on_keyring.jpg");
addWiki(
  "key-holder-5-3.jpg",
  "Schlüsselbrett_Pension_Hindelang_Ravensburg_MHQ.jpg"
);
addWiki("key-holder-15-2.jpg", "Key_chain_4.jpg");

addWiki(
  "memory-card-2gb-1.jpg",
  "MicroSD_card_2GB_focus-stacked.jpg"
);
addWiki("memory-card-4gb-1.jpg", "MicroSD_cards_2GB_4GB_8GB.jpg");
addWiki(
  "memory-card-8gb-1.jpg",
  "2015_Karta_microSD_z_adapterem_SD.jpg"
);

addWiki(
  "flash-disk-32gb-1.jpg",
  "Kingston_Technology_DataTraveler_G4_USB_flash_drive_USB_3.0_32_Gb.jpg"
);
addWiki(
  "flash-disk-16gb-1.jpg",
  "2023_Pendrive'y_Verbatim_Store_‘n’_Click_16_GB_(1).jpg"
);
addWiki("flash-disk-8gb-1.jpg", "Supertalent_USB-Stick.jpg");

addWiki("wired-mouse-black-1.jpg", "Computer_mouse_1_2015-02-28.JPG");
addWiki(
  "wireless-mouse-black-1.jpg",
  "2023_Mysz_komputerowa_Logitech_G903_Lightspeed.jpg"
);

addWiki("wired-keyboard-1.jpg", "Apple-wireless-keyboard.jpg");
addWiki("wireless-keyboard-1.jpg", "Apple-wireless-keyboard-aluminum-2007.jpg");
addWiki("wired-keyboard-2.jpg", "Rii_RT-MWK01_mini_wireless_keyboard_HS4.jpg");
addWiki(
  "wireless-keyboard-2.jpg",
  "Rii_RT-MWK01_mini_wireless_keyboard_HS6.jpg"
);

addWiki("ubl-harman-1.jpg", "JBL_Flip_3_bluetooth_speaker_(DSCF2653).jpg");
photoSources["calus-s69-speaker-1.jpg"] =
  "https://calus-live.com/upfile/prod/091536fe04d14f633874afdce09884bc.jpg";
photoSources["calus-s69-speaker-2.jpg"] =
  "https://calus-live.com/upfile/prod_cover/772721fcfec889884b14fbc4a250203f.jpg";
photoSources["calus-s69-speaker-3.jpg"] =
  "https://calus-live.com/upfile/prod_cover/b8c0b333a0e0ae304fbe0c76e89948f0.jpg";
addWiki("tws-f9-5-2.jpg", "Simsiz_quloqchin.jpg");

addWiki("laptop-charger-full-set-1.jpg", "Notebook-Computer-AC-Adapter.jpg");
addWiki(
  "laptop-charger-full-set-2.jpg",
  "Lenovo_Power_Adapter_AC_135W_20V.jpg"
);
addWiki(
  "laptop-power-pack-only-1.jpg",
  "Lenovo_65W_20V_AC_adapter_(FRU_42T5283)_for_ThinkPad_laptops.jpg"
);
addWiki("laptop-power-pack-only-2.jpg", "Wall-Wart-AC-Adapter.jpg");

addWiki("extension-4-way-3m-1.jpg", "Pikendusjuhe.jpg");
addWiki(
  "extension-4-way-3m-2.jpg",
  "Dornbirn-multiple_(4)_power_strip_CEE_7_3_socket_and_plug-01ASD.jpg"
);

addWiki("iphone-type-c-full-charger-1.jpg", "Silicon_vs_GaN_30W_USB-C_chargers.jpg");
addWiki(
  "iphone-type-c-full-charger-2.jpg",
  "USB_Type-C_Cable_-_iPad_USB-C_Charger_(45640822114).jpg"
);

addWiki("phone-stand-50-1.jpg", "Mini_tripod_and_phone_holder.jpg");
addWiki("phone-pouch-blue-1.jpg", "IPurse_Pouch_Phone_case_13.JPG");

addWiki("pencil-1.jpg", "Wooden_pencils_sharpened_with_knife.jpg");
addWiki("sharpener-1.jpg", "Pencil_sharpener_3.jpg");
addWiki("sharpener-2.jpg", "Wooden_pencil_sharpener.jpg");

/* —— Unique generated studio shots (one distinct prompt+seed per file) —— */
const GEN: [string, string, number][] = [
  ["exercise-book-288-1.jpg", "thick 288-page school exercise book hardcover green, front cover", 101],
  ["exercise-book-288-2.jpg", "thick school exercise book open showing lined pages, white background", 102],
  ["exercise-book-288-3.jpg", "stack of green hardcover exercise books, studio white background", 103],
  ["exercise-book-192-2.jpg", "thin 192-page A5 school exercise book orange cover, front", 104],

  ["corms-pink-1.jpg", "hot pink plastic afro hair pick comb, studio white background", 201],
  ["corms-pink-2.jpg", "hot pink afro pick comb three-quarter angle, white background", 202],
  ["corms-pink-3.jpg", "hot pink afro pick comb lying flat, white background", 203],
  ["corms-blue-1.jpg", "royal blue plastic afro hair pick comb, studio white background", 204],
  ["corms-blue-2.jpg", "royal blue afro pick comb three-quarter angle, white background", 205],
  ["corms-blue-3.jpg", "royal blue afro pick comb lying flat, white background", 206],
  ["corms-black-1.jpg", "black plastic afro hair pick comb, studio white background", 207],
  ["corms-black-2.jpg", "black afro pick comb three-quarter angle, white background", 208],
  ["corms-black-3.jpg", "black afro pick comb lying flat, white background", 209],
  ["corms-1.jpg", "three afro hair picks pink blue and black on white background", 210],
  ["corms-2.jpg", "pink afro pick close-up teeth detail, white background", 211],
  ["corms-3.jpg", "blue afro pick handle close-up, white background", 212],

  ["bic-fine-pen-1.jpg", "BIC Orange Fine ballpoint pen orange hexagonal barrel blue cap, studio white background", 221],
  ["bic-fine-pen-2.jpg", "BIC Orange Fine pen blue cap three-quarter, white background", 222],
  ["bic-fine-pen-3.jpg", "BIC Orange Fine pen blue cap close-up, white background", 223],
  ["bic-fine-pen-blue-1.jpg", "BIC Orange Fine ballpoint pen orange hexagonal barrel blue cap, studio white background", 780],
  ["bic-fine-pen-blue-2.jpg", "BIC Orange Fine blue cap three-quarter view, white background", 781],
  ["bic-fine-pen-blue-3.jpg", "BIC Orange Fine blue cap close-up, white background", 782],
  ["bic-fine-pen-red-1.jpg", "BIC Orange Fine ballpoint pen orange hexagonal barrel red cap, studio white background", 783],
  ["bic-fine-pen-red-2.jpg", "BIC Orange Fine red cap close-up, white background", 784],
  ["bic-fine-pen-red-3.jpg", "BIC Orange Fine red cap three-quarter, white background", 785],
  ["bic-fine-pen-black-1.jpg", "BIC Orange Fine ballpoint pen orange hexagonal barrel black cap, studio white background", 786],
  ["bic-fine-pen-black-2.jpg", "BIC Orange Fine black cap close-up, white background", 787],
  ["bic-fine-pen-black-3.jpg", "BIC Orange Fine black cap three-quarter, white background", 788],
  ["nataraj-pen-1.jpg", "common Nataraj 621 student ballpoint pen blue hexagonal barrel red cap, not SuperX, studio white background", 224],
  ["nataraj-pen-2.jpg", "Nataraj 621 ballpoint pen red cap close-up blue barrel, white background", 225],
  ["nataraj-pen-3.jpg", "Nataraj 621 classic red and blue hexagonal pen, white background", 226],
  ["pencil-2.jpg", "yellow HB wooden pencil sharpened, studio white background", 227],
  ["pencil-3.jpg", "yellow wooden pencil unsharpened with eraser, white background", 228],
  ["ruler-1.jpg", "30cm transparent plastic ruler, studio white background", 229],
  ["ruler-2.jpg", "plastic school ruler angled, white background", 230],
  ["ruler-3.jpg", "plastic ruler centimetre markings close-up, white background", 231],
  ["marker-1.jpg", "black permanent whiteboard marker, studio white background", 232],
  ["marker-2.jpg", "black marker pen cap off showing felt tip, white background", 233],
  ["marker-3.jpg", "black marker lying diagonally, white background", 234],
  ["bic-crystal-pen-3.jpg", "single blue BIC Cristal ballpoint pen vertical, white background", 235],
  ["bic-crystal-pen-blue-2.jpg", "blue BIC Cristal pen three-quarter, white background", 236],
  ["bic-crystal-pen-blue-3.jpg", "blue BIC Cristal pen cap close-up, white background", 237],
  ["bic-crystal-pen-black-1.jpg", "single black BIC Cristal ballpoint pen with black cap, transparent hexagonal barrel, studio white background", 238],
  ["bic-crystal-pen-black-2.jpg", "black BIC Cristal pen three-quarter view, white background", 239],
  ["bic-crystal-pen-black-3.jpg", "black BIC Cristal pen cap close-up with clip, white background", 240],

  ["key-holder-5-1.jpg", "simple metal key ring key holder, studio white background", 241],
  ["key-holder-5-2.jpg", "basic steel keychain ring, white background", 242],
  ["key-holder-5-3.jpg", "plain key holder with keys, white background", 243],
  ["key-holder-15-1.jpg", "premium leather and metal key holder, studio white background", 244],
  ["key-holder-15-2.jpg", "premium key organiser three-quarter, white background", 245],
  ["key-holder-15-3.jpg", "premium key holder open showing hooks, white background", 246],
  ["envelope-1.jpg", "white C6 paper envelope, studio white background", 247],
  ["envelope-2.jpg", "white envelope slightly open, white background", 248],
  ["envelope-3.jpg", "stack of white envelopes, white background", 249],
  ["ream-paper-1.jpg", "ream of A4 white copier paper wrapped, studio white background", 250],
  ["ream-paper-2.jpg", "A4 paper ream three-quarter view, white background", 251],
  ["ream-paper-3.jpg", "open pack of A4 printer paper sheets, white background", 252],

  ["sharp-scientific-calculator-1.jpg", "Sharp EL-W531 scientific calculator, studio white background", 261],
  ["sharp-scientific-calculator-2.jpg", "Sharp scientific calculator angled showing screen, white background", 262],
  ["sharp-scientific-calculator-3.jpg", "Sharp calculator keypad close-up, white background", 263],
  ["fieldex-mortice-lock-1.jpg", "brass mortice door lock set with keys, studio white background", 264],
  ["fieldex-mortice-lock-2.jpg", "brass mortice lock side profile, white background", 265],
  ["fieldex-mortice-lock-3.jpg", "mortice lock keys close-up, white background", 266],

  ["phone-stand-50-2.jpg", "small plastic desktop phone stand, studio white background", 271],
  ["phone-stand-50-3.jpg", "budget phone holder with smartphone, white background", 272],
  ["phone-stand-60-1.jpg", "adjustable aluminium phone stand, studio white background", 273],
  ["phone-stand-60-2.jpg", "aluminium phone stand folded, white background", 274],
  ["phone-stand-60-3.jpg", "aluminium phone stand holding a phone, white background", 275],
  ["phone-stand-200-1.jpg", "premium foldable metal phone tablet stand, studio white background", 276],
  ["phone-stand-200-2.jpg", "premium phone stand side profile, white background", 277],
  ["phone-stand-200-3.jpg", "premium phone stand with tablet, white background", 278],

  ["screen-protector-full-glue-1.jpg", "tempered glass phone screen protector on white background", 281],
  ["screen-protector-full-glue-2.jpg", "full glue tempered glass protector in packaging, white background", 282],
  ["screen-protector-full-glue-3.jpg", "tempered glass protector edge close-up, white background", 283],
  ["screen-protector-privacy-1.jpg", "privacy anti-spy tempered glass screen protector dark tint, white background", 284],
  ["screen-protector-privacy-2.jpg", "privacy screen protector showing black tint angle, white background", 285],
  ["screen-protector-privacy-3.jpg", "privacy glass protector in retail sleeve, white background", 286],
  ["phone-pouch-blue-2.jpg", "blue leather phone pouch, studio white background", 287],
  ["phone-pouch-blue-3.jpg", "blue phone pouch open, white background", 288],
  ["phone-pouch-black-1.jpg", "black leather smartphone belt pouch closed, studio white background", 292],
  ["phone-pouch-black-2.jpg", "black phone pouch three-quarter with belt clip, white background", 293],
  ["phone-pouch-black-3.jpg", "black phone pouch closed, white background", 289],

  ["memory-card-2gb-2.jpg", "microSD memory card labeled 2GB, studio white background", 301],
  ["memory-card-2gb-3.jpg", "2GB microSD card with SD adapter, white background", 302],
  ["memory-card-4gb-2.jpg", "microSD memory card labeled 4GB, studio white background", 303],
  ["memory-card-4gb-3.jpg", "4GB microSD card in adapter, white background", 304],
  ["memory-card-8gb-2.jpg", "microSD memory card labeled 8GB, studio white background", 305],
  ["memory-card-8gb-3.jpg", "8GB microSD card angled, white background", 306],
  ["memory-card-16gb-1.jpg", "microSD memory card labeled 16GB, studio white background", 307],
  ["memory-card-16gb-2.jpg", "16GB microSD with adapter, white background", 308],
  ["memory-card-16gb-3.jpg", "16GB microSD close-up gold contacts, white background", 309],
  ["memory-card-32gb-1.jpg", "microSD memory card labeled 32GB, studio white background", 310],
  ["memory-card-32gb-2.jpg", "32GB microSD with adapter, white background", 311],
  ["memory-card-32gb-3.jpg", "32GB microSD three-quarter, white background", 312],
  ["memory-card-64gb-1.jpg", "microSD memory card labeled 64GB, studio white background", 313],
  ["memory-card-64gb-2.jpg", "64GB microSD with adapter, white background", 314],
  ["memory-card-64gb-3.jpg", "64GB microSD close-up, white background", 315],
  ["memory-card-128gb-1.jpg", "microSD memory card labeled 128GB, studio white background", 316],
  ["memory-card-128gb-2.jpg", "128GB microSD with adapter, white background", 317],
  ["memory-card-128gb-3.jpg", "128GB microSD three-quarter, white background", 318],

  ["flash-disk-4gb-1.jpg", "USB flash drive labeled 4GB silver, studio white background", 331],
  ["flash-disk-4gb-2.jpg", "4GB USB stick cap off showing USB-A, white background", 332],
  ["flash-disk-4gb-3.jpg", "4GB USB flash drive top view, white background", 333],
  ["flash-disk-8gb-2.jpg", "8GB USB flash drive cap off, white background", 334],
  ["flash-disk-8gb-3.jpg", "8GB USB stick three-quarter, white background", 335],
  ["flash-disk-16gb-2.jpg", "16GB USB flash drive cap off, white background", 336],
  ["flash-disk-16gb-3.jpg", "16GB USB stick top view, white background", 337],
  ["flash-disk-32gb-2.jpg", "32GB USB flash drive cap off, white background", 338],
  ["flash-disk-32gb-3.jpg", "32GB USB stick three-quarter, white background", 339],
  ["flash-disk-64gb-1.jpg", "USB flash drive labeled 64GB black, studio white background", 340],
  ["flash-disk-64gb-2.jpg", "64GB USB stick cap off, white background", 341],
  ["flash-disk-64gb-3.jpg", "64GB USB flash drive top view, white background", 342],
  ["flash-disk-128gb-1.jpg", "USB flash drive labeled 128GB metal, studio white background", 343],
  ["flash-disk-128gb-2.jpg", "128GB USB stick cap off, white background", 344],
  ["flash-disk-128gb-3.jpg", "128GB USB flash drive three-quarter, white background", 345],

  ["hard-drive-250gb-1.jpg", "2.5 inch laptop HDD labeled 250GB, studio white background", 351],
  ["hard-drive-250gb-2.jpg", "250GB hard drive SATA connector close-up, white background", 352],
  ["hard-drive-250gb-3.jpg", "250GB hard drive back circuit, white background", 353],
  ["hard-drive-320gb-1.jpg", "2.5 inch HDD labeled 320GB, studio white background", 354],
  ["hard-drive-320gb-2.jpg", "320GB hard drive angled, white background", 355],
  ["hard-drive-320gb-3.jpg", "320GB hard drive connector, white background", 356],
  ["hard-drive-500gb-1.jpg", "2.5 inch HDD labeled 500GB, studio white background", 357],
  ["hard-drive-500gb-2.jpg", "500GB hard drive three-quarter, white background", 358],
  ["hard-drive-500gb-3.jpg", "500GB hard drive label close-up, white background", 359],
  ["hard-drive-1tb-1.jpg", "3.5 inch desktop HDD labeled 1TB, studio white background", 360],
  ["hard-drive-1tb-2.jpg", "1TB hard drive angled, white background", 361],
  ["hard-drive-1tb-3.jpg", "1TB hard drive SATA ports, white background", 362],
  ["hard-drive-2tb-1.jpg", "3.5 inch desktop HDD labeled 2TB, studio white background", 363],
  ["hard-drive-2tb-2.jpg", "2TB hard drive three-quarter, white background", 364],
  ["hard-drive-2tb-3.jpg", "2TB hard drive label, white background", 365],
  ["hard-drive-3tb-1.jpg", "3.5 inch desktop HDD labeled 3TB, studio white background", 366],
  ["hard-drive-3tb-2.jpg", "3TB hard drive angled, white background", 367],
  ["hard-drive-3tb-3.jpg", "3TB hard drive back, white background", 368],

  ["wired-mouse-black-2.jpg", "black wired USB computer mouse, studio white background", 371],
  ["wired-mouse-black-3.jpg", "black wired mouse cable and USB plug, white background", 372],
  ["wired-mouse-1.jpg", "black wired office mouse front, white background", 373],
  ["wired-mouse-2.jpg", "black wired mouse side, white background", 374],
  ["wired-mouse-3.jpg", "black wired mouse bottom sensor, white background", 375],
  ["wireless-mouse-black-2.jpg", "black wireless mouse with USB dongle, white background", 376],
  ["wireless-mouse-black-3.jpg", "black wireless mouse bottom battery cover, white background", 377],
  ["wireless-mouse-white-1.jpg", "white wireless computer mouse, studio white background", 378],
  ["wireless-mouse-white-2.jpg", "white wireless mouse three-quarter, white background", 379],
  ["wireless-mouse-white-3.jpg", "white wireless mouse with nano receiver, white background", 380],
  ["wireless-mouse-1.jpg", "black wireless mouse hero, white background", 381],
  ["wireless-mouse-2.jpg", "black wireless mouse side, white background", 382],
  ["wireless-mouse-3.jpg", "black wireless mouse dongle, white background", 383],
  ["wired-keyboard-3.jpg", "black wired USB keyboard, studio white background", 384],
  ["wireless-keyboard-3.jpg", "compact wireless keyboard with USB dongle, white background", 385],

  ["hdd-casing-usb-2-1.jpg", "2.5 inch USB 2.0 external hard drive enclosure black, white background", 391],
  ["hdd-casing-usb-2-2.jpg", "USB 2.0 HDD casing open showing SATA slot, white background", 392],
  ["hdd-casing-usb-2-3.jpg", "USB 2.0 hard drive enclosure with USB cable, white background", 393],
  ["hdd-casing-usb-3-1.jpg", "2.5 inch USB 3.0 external hard drive enclosure silver, white background", 394],
  ["hdd-casing-usb-3-2.jpg", "USB 3.0 HDD casing blue USB-A connector, white background", 395],
  ["hdd-casing-usb-3-3.jpg", "USB 3.0 hard drive enclosure three-quarter, white background", 396],

  ["iphone-type-c-full-charger-3.jpg", "white 20W USB-C iPhone charger brick and cable set, white background", 401],
  ["type-c-charger-head-1.jpg", "UK Type G USB-C wall charger white cube three rectangular pins FUSED, studio white background", 402],
  ["type-c-charger-head-2.jpg", "UK Type G USB-C charger brick three-quarter USB-C port, white background", 403],
  ["type-c-charger-head-3.jpg", "UK Type G USB-C charger head fused plug close-up, white background", 404],
  ["oraimo-normal-full-charger-1.jpg", "Oraimo green USB phone charger set brick and cable, white background", 405],
  ["oraimo-normal-full-charger-2.jpg", "Oraimo charger brick front logo, white background", 406],
  ["oraimo-normal-full-charger-3.jpg", "Oraimo micro-USB cable coiled, white background", 407],
  ["oraimo-charger-head-1.jpg", "Oraimo USB-A wall charger head UK Type G three rectangular pin fused plug, studio white background", 408],
  ["oraimo-charger-head-2.jpg", "Oraimo charger head USB-A port three-quarter Type G, white background", 409],
  ["oraimo-charger-head-3.jpg", "Oraimo charger Type G fused plug close-up, white background", 410],
  ["mango-c-to-c-full-charger-1.jpg", "USB-C to USB-C charger set UK Type G three-pin brick plus C-to-C cable, studio white background", 411],
  ["mango-c-to-c-full-charger-2.jpg", "white USB-C PD wall charger UK Type G three rectangular pins, white background", 412],
  ["mango-c-to-c-full-charger-3.jpg", "coiled USB-C to USB-C cable both connectors, white background", 413],
  ["samsung-c-to-c-full-charger-1.jpg", "Samsung 25W USB-C charger super fast charging white, white background", 414],
  ["samsung-c-to-c-full-charger-2.jpg", "Samsung USB-C charger brick three-quarter, white background", 415],
  ["samsung-c-to-c-full-charger-3.jpg", "Samsung USB-C to C cable, white background", 416],
  ["sivia-cable-1.jpg", "white USB-A to USB-C flat data cable coiled, studio white background", 417],
  ["sivia-cable-2.jpg", "white USB-C cable connectors close-up, white background", 418],
  ["sivia-cable-3.jpg", "white charging cable uncoiled, white background", 419],
  ["seal-tape-1.jpg", "clear packing seal tape roll, studio white background", 420],
  ["seal-tape-2.jpg", "packing tape roll three-quarter, white background", 421],
  ["seal-tape-3.jpg", "packing tape with dispenser, white background", 422],

  ["oraimo-original-headset-1.jpg", "Oraimo wired in-ear headset with 3.5mm jack black, white background", 431],
  ["oraimo-original-headset-2.jpg", "black wired earbuds laid out, white background", 432],
  ["oraimo-original-headset-3.jpg", "wired headset 3.5mm plug close-up, white background", 433],
  ["samsung-akg-headset-1.jpg", "Samsung AKG USB-C wired earphones black with box, white background", 434],
  ["samsung-akg-headset-2.jpg", "Samsung Type-C earphones laid out, white background", 435],
  ["samsung-akg-headset-3.jpg", "AKG USB-C earbud close-up, white background", 436],
  ["mango-headset-1.jpg", "black wired stereo headset with mic, studio white background", 437],
  ["mango-headset-2.jpg", "wired headset earpieces, white background", 438],
  ["mango-headset-3.jpg", "wired headset inline mic, white background", 439],

  ["laptop-charger-full-set-3.jpg", "laptop charger full set brick plus barrel tip cable, white background", 441],
  ["laptop-power-pack-only-3.jpg", "laptop power brick only no cable, white background", 442],

  ["extension-3-way-3m-1.jpg", "UK Type G 3-way trailing socket extension lead three rectangular-pin sockets 3 metre white cable, studio white background", 451],
  ["extension-3-way-3m-2.jpg", "UK Type G 3-way extension sockets close-up rectangular pin holes, white background", 452],
  ["extension-3-way-3m-3.jpg", "UK Type G 13A fused plug on 3-way extension, white background", 453],
  ["extension-3-way-5m-1.jpg", "UK Type G 3-way trailing socket extension 5 metre long white cable, white background", 454],
  ["extension-3-way-5m-2.jpg", "UK Type G 3-way 5m extension sockets, white background", 455],
  ["extension-3-way-5m-3.jpg", "UK Type G 3-way 5m fused plug close-up, white background", 456],
  ["extension-4-way-3m-3.jpg", "UK Type G 4-way trailing socket 3 metre, white background", 457],
  ["extension-4-way-5m-1.jpg", "UK Type G 4-way trailing socket extension 5 metre white, white background", 458],
  ["extension-4-way-5m-2.jpg", "UK Type G 4-socket extension strip rectangular pins, white background", 459],
  ["extension-4-way-5m-3.jpg", "UK Type G 4-way 5m fused plug, white background", 460],
  ["extension-5-way-3m-1.jpg", "UK Type G 5-way trailing socket extension 3 metre, white background", 461],
  ["extension-5-way-3m-2.jpg", "UK Type G 5-socket strip rectangular pin holes, white background", 462],
  ["extension-5-way-3m-3.jpg", "UK Type G 5-way 13A fused plug, white background", 463],
  ["extension-5-way-5m-1.jpg", "UK Type G 5-way trailing socket extension 5 metre, white background", 464],
  ["extension-5-way-5m-2.jpg", "UK Type G 5-socket 5m strip, white background", 465],
  ["extension-5-way-5m-3.jpg", "UK Type G 5-way 5m fused plug, white background", 466],
  ["extension-6-way-3m-1.jpg", "UK Type G 6-way trailing socket extension 3 metre rectangular-pin sockets, white background", 4670],
  ["extension-6-way-3m-2.jpg", "UK Type G 6-way power strip 3 metre sockets close-up, white background", 467],
  ["extension-6-way-3m-3.jpg", "UK Type G 6-socket extension fused plug, white background", 468],
  ["extension-6-way-5m-1.jpg", "UK Type G 6-way trailing socket extension 5 metre, white background", 469],
  ["extension-6-way-5m-2.jpg", "UK Type G 6-socket 5m strip, white background", 470],
  ["extension-6-way-5m-3.jpg", "UK Type G 6-way 5m fused plug, white background", 471],

  ["airpods-pro-3-1.jpg", "white USB-C wireless earbuds charging case closed, AirPods Pro style, studio white background", 501],
  ["airpods-pro-3-2.jpg", "white wireless earbuds next to open charging case, studio white background", 502],
  ["airpods-pro-3-3.jpg", "white in-ear wireless earbuds pair, studio white background", 503],
  ["airpods-pro-2-type-c-1.jpg", "AirPods Pro 2 white case with USB-C port on bottom, white background", 504],
  ["airpods-pro-2-type-c-2.jpg", "white USB-C charging case open with earbuds, white background", 505],
  ["airpods-pro-2-type-c-3.jpg", "USB-C port close-up on white earbud case, white background", 506],
  ["airpods-pro-2-3.jpg", "AirPods Pro 2 earbuds in open case, white background", 507],

  ["oraimo-air-f9-pro-3-1.jpg", "black Oraimo-style TWS earbud charging case oval, studio white background", 511],
  ["oraimo-air-f9-pro-3-2.jpg", "black TWS earbuds next to black case, white background", 512],
  ["oraimo-air-f9-pro-3-3.jpg", "black powerbank-style earbud case LED display, white background", 513],
  ["sivia-s13-1.jpg", "matte grey TWS earbud case Sivia style, studio white background", 514],
  ["sivia-s13-2.jpg", "grey wireless earbuds and case open, white background", 515],
  ["sivia-s13-3.jpg", "grey TWS case back with ports, white background", 516],
  ["tws-f9-5-1.jpg", "dark grey oval TWS F9-5 charging case, studio white background", 517],
  ["tws-f9-5-2.jpg", "grey TWS F9 case open showing earbuds, white background", 518],
  ["tws-f9-5-3.jpg", "grey TWS case back with 5V 1A label, white background", 519],
  ["vortex-pods-1.jpg", "glossy black Vortex VOLTEX wireless earbud case, studio white background", 520],
  ["vortex-pods-2.jpg", "black glossy TWS case three-quarter, white background", 521],
  ["vortex-pods-3.jpg", "black Vortex earbuds beside case, white background", 522],
  ["mango-pods-1.jpg", "white Mango TWS earbud charging case, studio white background", 523],
  ["mango-pods-2.jpg", "white TWS case open with white earbuds, white background", 524],
  ["mango-pods-3.jpg", "white earbud case side profile, white background", 525],
  ["tronix-pods-1.jpg", "matte black Tronix TWS earbud case, studio white background", 526],
  ["tronix-pods-2.jpg", "black Tronix earbuds and case, white background", 527],
  ["tronix-pods-3.jpg", "black TWS case top view, white background", 528],

  ["ubl-harman-2.jpg", "black cylindrical Bluetooth speaker JBL Flip style upright, white background", 531],
  ["ubl-harman-3.jpg", "black portable speaker mesh texture close-up, white background", 532],
  ["calus-s69-speaker-2.jpg", "large black Bluetooth boombox speaker, studio white background", 533],
  ["calus-s69-speaker-3.jpg", "large Bluetooth speaker control buttons, white background", 534],
  ["calus-s39-speaker-1.jpg", "compact portable Bluetooth mini speaker fabric grille LED ring, no JBL logo, studio white background", 534],
  ["calus-s39-speaker-2.jpg", "compact black Bluetooth mini speaker three-quarter, white background", 535],
  ["calus-s39-speaker-3.jpg", "small speaker side profile charging port, white background", 536],
  ["r800-speaker-1.jpg", "R800 RGB Bluetooth speaker black with lights off, studio white background", 537],
  ["r800-speaker-2.jpg", "portable party speaker three-quarter, white background", 538],
  ["r800-speaker-3.jpg", "Bluetooth speaker handle and ports, white background", 539],

  ["t900-ultra-orange-1.jpg", "Apple Watch Ultra style smartwatch orange ocean band, studio white background three-quarter", 551],
  ["t900-ultra-orange-2.jpg", "rugged smartwatch orange band front face, white background", 552],
  ["t900-ultra-orange-3.jpg", "smartwatch orange band side crown, white background", 553],
  ["t900-ultra-white-1.jpg", "rugged smartwatch white ocean band, studio white background", 554],
  ["t900-ultra-white-2.jpg", "smartwatch white strap front, white background", 555],
  ["t900-ultra-white-3.jpg", "smartwatch white band side, white background", 556],
  ["t900-ultra-green-1.jpg", "rugged smartwatch forest green ocean band, studio white background", 557],
  ["t900-ultra-green-2.jpg", "Apple Watch Ultra style smartwatch green ocean band three-quarter square case, white background", 558],
  ["t900-ultra-green-3.jpg", "smartwatch green band side, white background", 559],
  ["t900-ultra-black-1.jpg", "rugged smartwatch black ocean band, studio white background", 560],
  ["t900-ultra-black-2.jpg", "Apple Watch Ultra style smartwatch black ocean band square case three-quarter, white background", 561],
  ["t900-ultra-black-3.jpg", "smartwatch black band side crown, white background", 562],
  ["t900-ultra-1.jpg", "T900 Ultra smartwatch orange band hero, white background", 563],
  ["t900-ultra-2.jpg", "T900 Ultra smartwatch three-quarter, white background", 564],
  ["t900-ultra-3.jpg", "T900 Ultra smartwatch crown detail, white background", 565],

  ["kt8-ultra-max-black-1.jpg", "KT8 Ultra Max rugged smartwatch black band, studio white background", 571],
  ["kt8-ultra-max-black-2.jpg", "KT8 Ultra Max black ocean band square case three-quarter, white background", 572],
  ["kt8-ultra-max-black-3.jpg", "smartwatch black band side buttons, white background", 573],
  ["kt8-ultra-max-orange-1.jpg", "KT8 Ultra Max smartwatch orange band, studio white background", 574],
  ["kt8-ultra-max-orange-2.jpg", "KT8 Ultra Max orange ocean band square case three-quarter, white background", 575],
  ["kt8-ultra-max-orange-3.jpg", "smartwatch orange strap side, white background", 576],
  ["kt8-ultra-max-1.jpg", "KT8 Ultra Max smartwatch hero, white background", 577],
  ["kt8-ultra-max-2.jpg", "KT8 Ultra Max three-quarter, white background", 578],
  ["kt8-ultra-max-3.jpg", "KT8 Ultra Max crown close-up, white background", 579]
];

for (const [file, prompt, seed] of GEN) {
  if (!photoSources[file]) addGen(file, prompt, seed);
}

export function expectedCatalogFile(slug: string): string {
  return `${slug}-1.jpg`;
}

/** Wikimedia Commons search query per filename prefix (slug or slug-colour) */
export const commonsSearch: Record<string, string> = {
  "exercise-book-192": "school exercise book lined",
  "exercise-book-288": "hardcover notebook school",
  tipex: "Tipp-Ex correction",
  glue: "Pritt glue stick",
  corms: "afro pick comb",
  "corms-pink": "pink afro hair pick comb",
  "corms-blue": "blue afro hair pick comb",
  "corms-black": "black afro hair pick comb",
  "bic-crystal-pen": "BIC Cristal ballpoint pen",
  "bic-crystal-pen-blue": "blue BIC Cristal pen",
  "bic-crystal-pen-black": "black BIC Cristal pen",
  "bic-fine-pen": "BIC Orange Fine ballpoint pen",
  "bic-fine-pen-blue": "BIC Orange Fine blue cap",
  "bic-fine-pen-red": "BIC Orange Fine red cap",
  "bic-fine-pen-black": "BIC Orange Fine black cap",
  "nataraj-pen": "Nataraj 621 ballpoint pen",
  pencil: "yellow HB wooden pencil",
  ruler: "plastic school ruler centimetre",
  sharpener: "pencil sharpener metal",
  marker: "permanent marker pen black",
  "key-holder-5": "metal key ring",
  "key-holder-15": "leather key holder organiser",
  envelope: "white paper envelope",
  "ream-paper": "ream of A4 printer paper",
  "casio-scientific-calculator": "Casio fx-991 scientific calculator",
  "sharp-scientific-calculator": "Sharp scientific calculator",
  "union-mortice-lock": "Union mortice lock",
  "fieldex-mortice-lock": "brass mortise lock set",
  "phone-stand-50": "desktop phone stand holder",
  "phone-stand-50-black": "black phone stand holder",
  "phone-stand-50-white": "white phone stand holder",
  "phone-stand-60": "adjustable aluminium phone stand",
  "phone-stand-200": "foldable metal tablet phone stand",
  "screen-protector-full-glue": "tempered glass screen protector",
  "screen-protector-privacy": "privacy screen protector glass",
  "phone-pouch": "phone pouch case",
  "phone-pouch-black": "black phone pouch leather",
  "phone-pouch-blue": "blue phone pouch case",
  "memory-card-2gb": "microSD card 2GB",
  "memory-card-4gb": "microSD card 4GB",
  "memory-card-8gb": "microSD card 8GB",
  "memory-card-16gb": "microSD card 16GB",
  "memory-card-32gb": "microSD card 32GB",
  "memory-card-64gb": "microSD card 64GB",
  "memory-card-128gb": "microSD card 128GB",
  "flash-disk-4gb": "USB flash drive 4GB",
  "flash-disk-8gb": "USB flash drive 8GB",
  "flash-disk-16gb": "USB flash drive 16GB",
  "flash-disk-32gb": "USB flash drive 32GB Kingston",
  "flash-disk-64gb": "USB flash drive 64GB",
  "flash-disk-128gb": "USB flash drive 128GB",
  "hard-drive-250gb": "laptop hard disk drive 2.5 inch",
  "hard-drive-320gb": "2.5 inch HDD SATA",
  "hard-drive-500gb": "hard disk drive 500GB",
  "hard-drive-1tb": "hard disk drive 1TB 3.5",
  "hard-drive-2tb": "hard disk drive 2TB",
  "hard-drive-3tb": "hard disk drive 3TB",
  "wired-mouse": "wired USB computer mouse",
  "wired-mouse-black": "black wired computer mouse",
  "wireless-mouse": "wireless computer mouse",
  "wireless-mouse-black": "black wireless mouse Logitech",
  "wireless-mouse-white": "white wireless computer mouse",
  "wired-keyboard": "wired computer keyboard",
  "wireless-keyboard": "wireless computer keyboard",
  "hdd-casing-usb-2": "2.5 inch USB external hard drive enclosure",
  "hdd-casing-usb-3": "USB 3.0 hard drive enclosure",
  "iphone-type-c-full-charger": "Apple 20W USB-C charger",
  "type-c-charger-head": "UK Type G USB-C wall charger",
  "oraimo-normal-full-charger": "USB phone charger adapter cable",
  "oraimo-charger-head": "UK Type G USB wall charger Oraimo",
  "mango-c-to-c-full-charger": "UK Type G USB-C to USB-C charger set",
  "samsung-c-to-c-full-charger": "Samsung USB-C charger 25W",
  "sivia-cable": "USB-C charging cable white",
  "seal-tape": "packing tape roll",
  "oraimo-original-headset": "wired in-ear earphones 3.5mm",
  "samsung-akg-headset": "Samsung AKG USB-C earphones",
  "mango-headset": "wired earbuds with microphone",
  "laptop-charger-full-set": "laptop AC adapter charger",
  "laptop-power-pack-only": "laptop power brick adapter",
  "extension-cable": "UK Type G trailing socket extension lead",
  "airpods-pro-3": "AirPods Pro USB-C white earbuds",
  "airpods-pro-2-type-c": "AirPods Pro 2 USB-C charging case",
  "airpods-pro-2": "AirPods Pro 2nd generation",
  "airpods-pro-1": "AirPods Pro first generation",
  "oraimo-air-f9-pro-3": "black TWS wireless earbuds charging case",
  "sivia-s13": "grey wireless earbuds case",
  "tws-f9-5": "TWS F9 wireless earbuds case",
  "ubl-harman": "JBL Flip bluetooth speaker",
  "vortex-pods": "black wireless earbuds charging case",
  "mango-pods": "white TWS earbuds case",
  "tronix-pods": "black true wireless earbuds",
  "calus-s69-speaker": "large bluetooth boombox speaker",
  "calus-s39-speaker": "compact portable bluetooth mini speaker",
  "r800-speaker": "portable bluetooth speaker black",
  "t900-ultra": "Apple Watch Ultra smartwatch",
  "t900-ultra-orange": "Apple Watch Ultra orange ocean band",
  "t900-ultra-white": "Apple Watch white sport band",
  "t900-ultra-green": "Apple Watch green alpine band",
  "t900-ultra-black": "Apple Watch Ultra black band",
  "kt8-ultra-max": "rugged smartwatch digital",
  "kt8-ultra-max-black": "black rugged smartwatch",
  "kt8-ultra-max-orange": "orange strap smartwatch"
};
