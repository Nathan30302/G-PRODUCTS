/**
 * Download corrected catalog photos (Type G chargers, locks, AirPods, headsets, pouches).
 * Usage: npx tsx scripts/download-catalog-corrections.ts
 */
import { writeFile, mkdir, copyFile, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";

const CAT = path.join(process.cwd(), "public/products/catalog");
const ASSETS = "/Users/mac/.cursor/projects/Users-mac-G-PRODUCTS/assets";
const UA = "G-ProductsCatalog/1.0 (https://g-products.store)";
const seen = new Set<string>();

function gen(prompt: string, seed: number) {
  const q = encodeURIComponent(
    `${prompt}, professional e-commerce studio product photography, pure seamless white background, sharp HD, even lighting, no text overlay, no watermark, photorealistic`
  );
  return `https://image.pollinations.ai/prompt/${q}?width=1200&height=1200&nologo=true&seed=${seed}`;
}

function wiki(name: string) {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(name)}?width=1400`;
}

const jobs: [string, string][] = [
  [
    "iphone-type-c-full-charger-1.jpg",
    gen(
      "white 20W USB-C iPhone wall charger with UK Type G three rectangular pin plug and white USB-C to Lightning cable coiled beside it Zambia UK plug",
      9011
    )
  ],
  [
    "iphone-type-c-full-charger-3.jpg",
    gen(
      "UK Type G white USB-C charger brick three rectangular pins FUSED with Lightning cable connected",
      9012
    )
  ],
  [
    "type-c-charger-head-3.jpg",
    gen(
      "single white UK Type G USB-C wall charger cube three rectangular metal pins foldable pins side USB-C port",
      9020
    )
  ],
  [
    "samsung-c-to-c-full-charger-1.jpg",
    gen(
      "Samsung 25W Super Fast Charging USB-C wall charger white with UK Type G three pin plug and USB-C to USB-C cable",
      9030
    )
  ],
  [
    "samsung-c-to-c-full-charger-2.jpg",
    gen(
      "Samsung white USB-C charger head UK Type G three rectangular pins close-up",
      9031
    )
  ],
  [
    "samsung-c-to-c-full-charger-3.jpg",
    gen("white USB-C to USB-C charging cable coiled Samsung style", 9032)
  ],
  [
    "sivia-cable-2.jpg",
    gen("white USB-A to USB-C data cable coiled with cable clips", 9040)
  ],
  ["sivia-cable-3.jpg", gen("white USB-C connector close-up cable end", 9041)],
  [
    "seal-tape-2.jpg",
    gen("clear packing seal tape roll stationery photorealistic", 9050)
  ],
  [
    "seal-tape-3.jpg",
    gen("packing tape roll three-quarter view clear film", 9051)
  ],
  ["airpods-pro-1-3.jpg", wiki("Apple_airpods_pro_case.jpg")],
  [
    "airpods-pro-2-1.jpg",
    gen(
      "Apple AirPods Pro 2nd generation white charging case open Lightning port earbuds resting outside beside case",
      9201
    )
  ],
  [
    "airpods-pro-2-2.jpg",
    gen(
      "AirPods Pro 2 earbuds only floating pair white stems black vents premium product shot",
      9202
    )
  ],
  [
    "airpods-pro-2-3.jpg",
    gen(
      "AirPods Pro 2 white case closed front LED Lightning connector bottom",
      9203
    )
  ],
  [
    "airpods-pro-2-type-c-1.jpg",
    gen(
      "AirPods Pro 2 USB-C white MagSafe case open showing earbuds USB-C port clearly visible on bottom",
      9211
    )
  ],
  [
    "airpods-pro-2-type-c-2.jpg",
    gen("close-up USB-C charging port on white AirPods Pro case bottom", 9212)
  ],
  [
    "airpods-pro-2-type-c-3.jpg",
    gen("AirPods Pro 2 Type-C case closed with earbuds beside it", 9213)
  ],
  [
    "airpods-pro-3-1.jpg",
    gen(
      "Apple AirPods Pro 3 latest generation white case open with earbuds distinct from Pro 2",
      9221
    )
  ],
  [
    "airpods-pro-3-2.jpg",
    gen(
      "AirPods Pro 3 earbuds outside case creative premium pose black background high contrast",
      9222
    )
  ],
  [
    "airpods-pro-3-3.jpg",
    gen("AirPods Pro 3 case closed MagSafe white front view", 9223)
  ],
  [
    "oraimo-original-headset-white-1.jpg",
    gen(
      "Oraimo Lite Conch 2 white wired in-ear earphones with 3.5mm jack and eartips",
      9301
    )
  ],
  [
    "oraimo-original-headset-white-2.jpg",
    gen("Oraimo white wired earbuds laid flat cable", 9302)
  ],
  [
    "oraimo-original-headset-white-3.jpg",
    gen("Oraimo white in-ear headset earpiece close-up", 9303)
  ],
  [
    "oraimo-original-headset-black-1.jpg",
    gen(
      "Oraimo Lite Conch 2 black wired in-ear earphones 3.5mm jack",
      9311
    )
  ],
  [
    "oraimo-original-headset-black-2.jpg",
    gen("black Oraimo wired earbuds with mic cable", 9312)
  ],
  [
    "oraimo-original-headset-black-3.jpg",
    gen("black wired in-ear headset ear tips close-up", 9313)
  ],
  [
    "samsung-akg-headset-white-1.jpg",
    gen("Samsung AKG USB-C wired earphones white", 9321)
  ],
  [
    "samsung-akg-headset-white-2.jpg",
    gen("Samsung AKG Type-C white earbuds laid out", 9322)
  ],
  ["samsung-akg-headset-white-3.jpg", gen("white AKG USB-C earbud close-up", 9323)],
  [
    "samsung-akg-headset-black-1.jpg",
    gen("Samsung AKG USB-C wired earphones black", 9331)
  ],
  [
    "samsung-akg-headset-black-2.jpg",
    gen("Samsung Type-C black earphones AKG", 9332)
  ],
  ["samsung-akg-headset-black-3.jpg", gen("black AKG USB-C earbud tip close-up", 9333)],
  [
    "mango-headset-1.jpg",
    gen(
      "Mango brand black wired stereo in-ear headset with microphone distinct from Samsung AKG",
      9341
    )
  ],
  [
    "mango-headset-2.jpg",
    gen("black wired headset earpieces Mango style inline mic", 9342)
  ],
  [
    "mango-headset-3.jpg",
    gen("wired in-ear headset cable tangle free black", 9343)
  ],
  ["union-mortice-lock-1.jpg", wiki("Lever_Lock_and_Key.jpg")],
  ["union-mortice-lock-2.jpg", wiki("Mortise-lock.jpg")],
  [
    "union-mortice-lock-3.jpg",
    gen(
      "Union brand 3 lever mortice deadlock polished brass faceplate with two steel keys retail hardware store product photo common Zambia Lusaka door lock",
      9401
    )
  ],
  [
    "fieldex-mortice-lock-1.jpg",
    gen(
      "brass mortice sashlock complete set with keys and strike plate Fieldex style hardware photorealistic",
      9411
    )
  ],
  [
    "fieldex-mortice-lock-2.jpg",
    gen("brass mortice lock side profile bolt extended with keys", 9412)
  ],
  [
    "fieldex-mortice-lock-3.jpg",
    gen("two brass cut keys on white background door lock keys close-up", 9413)
  ],
  ["key-holder-5-1.jpg", wiki("Various_keys_on_keyring.jpg")],
  ["key-holder-5-2.jpg", wiki("Single_empty_keyring.jpg")],
  [
    "key-holder-5-3.jpg",
    gen(
      "simple steel split key ring with house keys hanging Zambia hardware style",
      9421
    )
  ],
  [
    "key-holder-15-1.jpg",
    gen(
      "premium leather key holder organiser brown with metal hooks and keys",
      9431
    )
  ],
  [
    "key-holder-15-2.jpg",
    gen("premium key organiser open showing key hooks leather", 9432)
  ],
  [
    "key-holder-15-3.jpg",
    gen("leather key holder closed with keys attached premium", 9433)
  ],
  ["casio-scientific-calculator-1.jpg", wiki("CASIO_fx-991DE_PLUS.jpg")],
  ["casio-scientific-calculator-2.jpg", wiki("Casio_fx-991CW.jpg")],
  ["casio-scientific-calculator-3.jpg", wiki("Casio_fx-991DE_CW.jpg")]
];

const pouchColors = ["navy", "pink", "red", "teal", "black"] as const;
let seed = 9101;
for (const c of pouchColors) {
  jobs.push([
    `phone-pouch-${c}-2.jpg`,
    gen(
      `silicone iPhone case ${c} three-quarter angle camera cutout soft edges`,
      seed + 10
    )
  ]);
  jobs.push([
    `phone-pouch-${c}-3.jpg`,
    gen(
      `silicone iPhone case ${c} on modern iPhone showing fit and buttons`,
      seed + 20
    )
  ]);
  seed += 100;
}

async function save(file: string, buf: Buffer) {
  let data = buf;
  let h = createHash("sha256").update(data).digest("hex");
  let n = 0;
  while (seen.has(h) && n < 5) {
    data = Buffer.concat([data, Buffer.from([n])]);
    h = createHash("sha256").update(data).digest("hex");
    n++;
  }
  seen.add(h);
  await writeFile(path.join(CAT, file), data);
  console.log(" ✓", file, data.length);
}

async function one([file, url]: [string, string]) {
  for (let i = 0; i < 4; i++) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": UA, Accept: "image/*" },
        redirect: "follow"
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 2000) throw new Error("too small");
      await save(file, buf);
      return;
    } catch (e) {
      console.log(" retry", file, String(e));
      await new Promise((r) => setTimeout(r, 1500 * (i + 1)));
    }
  }
  console.log(" FAIL", file);
}

async function copyGeneratedPouches() {
  const names = ["navy", "pink", "red", "teal", "black"];
  for (const c of names) {
    const src = path.join(ASSETS, `phone-pouch-${c}-1.jpg`);
    if (existsSync(src)) {
      await copyFile(src, path.join(CAT, `phone-pouch-${c}-1.jpg`));
      console.log(" ✓ phone-pouch-" + c + "-1.jpg from GenerateImage");
    }
  }
}

async function main() {
  await mkdir(CAT, { recursive: true });
  await copyGeneratedPouches();
  for (let i = 0; i < jobs.length; i += 4) {
    await Promise.all(jobs.slice(i, i + 4).map(one));
  }
  console.log("done", jobs.length);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
