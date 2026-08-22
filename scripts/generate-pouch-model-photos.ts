/**
 * Generate silicone pouch photos per camera layout + per iPhone model tag.
 * Model-tagged files are copies of the matching layout master so each phone
 * resolves to the correct cutout (and can be replaced with unique shots later).
 *
 * Usage:
 *   npx tsx scripts/generate-pouch-model-photos.ts
 *   npx tsx scripts/generate-pouch-model-photos.ts --improve
 */
import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import {
  CAMERA_FAMILIES,
  FITMENT_BY_SLUG,
  cameraFamilyForModel,
  legacyFamilyForLayout,
  modelSlug
} from "../lib/fitment";

const CAT = path.join(process.cwd(), "public", "products", "catalog");

const COLORS = [
  "black",
  "navy",
  "midnight",
  "pink",
  "hot-pink",
  "red",
  "coral",
  "orange",
  "yellow",
  "mint",
  "teal",
  "green",
  "purple",
  "lilac",
  "white",
  "grey"
];

const LAYOUT_PROMPT: Record<string, string> = {
  single:
    "single centered rear camera lens with flash beside it, classic home-button era iPhone 7 style cutout",
  plus:
    "vertical dual camera lenses with flash, iPhone 7 Plus style camera bump cutout",
  x: "vertical dual camera lenses in tall oval module, iPhone X style cutout",
  xr: "large single rear camera lens upper left, iPhone XR style cutout",
  "11pro":
    "square camera module with three lenses and flash, iPhone 11 Pro style cutout",
  "12dual":
    "diagonal dual camera lenses in square module, iPhone 13 style cutout",
  "12pro":
    "diagonal triple camera lenses in square module, iPhone 13 Pro style cutout",
  "14pro":
    "pill-shaped camera island with two lenses and separate circle lens, iPhone 14 Pro style cutout",
  "15dual":
    "vertical dual camera lenses in elongated module, iPhone 15 style cutout",
  "15pro":
    "vertical triple camera lenses in elongated titanium module, iPhone 15 Pro Max style cutout",
  "17dual":
    "modern vertical dual camera module for iPhone 17 style silicone case cutout",
  "17pro":
    "modern triple camera plateau module for iPhone 17 Pro Max style silicone case cutout"
};

function seedFor(color: string, layout: string): number {
  let h = 9200;
  for (const ch of `${color}-${layout}`) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return 9000 + (h % 8000);
}

function pollinationsUrl(prompt: string, seed: number): string {
  const q = encodeURIComponent(
    `${prompt}, professional e-commerce studio product photography, pure seamless white background, sharp HD, even soft lighting, no text, no watermark, no person, no hands`
  );
  return `https://image.pollinations.ai/prompt/${q}?width=1200&height=1200&nologo=true&seed=${seed}`;
}

async function sameBytes(a: string, b: string): Promise<boolean> {
  if (!existsSync(a) || !existsSync(b)) return false;
  const [ba, bb] = await Promise.all([readFile(a), readFile(b)]);
  return ba.equals(bb);
}

async function download(url: string, dest: string): Promise<boolean> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "G-Products-catalog/1.0" }
    });
    if (!res.ok) {
      console.warn(`  ✗ HTTP ${res.status} ${path.basename(dest)}`);
      return false;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 4000) {
      console.warn(`  ✗ tiny file ${path.basename(dest)}`);
      return false;
    }
    await mkdir(path.dirname(dest), { recursive: true });
    await writeFile(dest, buf);
    console.log(`  ✓ ${path.basename(dest)}`);
    return true;
  } catch (e) {
    console.warn(`  ✗ ${path.basename(dest)}`, e);
    return false;
  }
}

async function main() {
  await mkdir(CAT, { recursive: true });
  const fresh = process.argv.includes("--fresh");
  const improve = process.argv.includes("--improve") || fresh;

  console.log("Seeding layout files from legacy cutouts…");
  for (const color of COLORS) {
    for (const layout of CAMERA_FAMILIES) {
      const dest = path.join(CAT, `phone-pouch-${color}-${layout}-1.jpg`);
      if (existsSync(dest) && !fresh) continue;
      const legacyPath = path.join(
        CAT,
        `phone-pouch-${color}-${legacyFamilyForLayout(layout)}-1.jpg`
      );
      if (existsSync(legacyPath)) {
        await copyFile(legacyPath, dest);
        console.log(`  ↳ ${path.basename(dest)}`);
      }
    }
  }

  if (improve) {
    console.log("Generating layout-accurate masters…");
    const jobs: Array<() => Promise<void>> = [];
    for (const color of COLORS) {
      for (const layout of CAMERA_FAMILIES) {
        if (layout === "single" || layout === "plus") continue;
        jobs.push(async () => {
          const dest = path.join(CAT, `phone-pouch-${color}-${layout}-1.jpg`);
          const legacyPath = path.join(
            CAT,
            `phone-pouch-${color}-${legacyFamilyForLayout(layout)}-1.jpg`
          );
          if (
            !fresh &&
            existsSync(dest) &&
            !(await sameBytes(dest, legacyPath))
          ) {
            return;
          }
          const prompt = `soft matte ${color.replace(/-/g, " ")} silicone iPhone case back view showing ${LAYOUT_PROMPT[layout] ?? "accurate camera cutout"}, slim protective cover product shot`;
          await download(
            pollinationsUrl(prompt, seedFor(color, layout)),
            dest
          );
        });
      }
    }
    const concurrency = 1;
    for (let i = 0; i < jobs.length; i += concurrency) {
      await Promise.all(jobs.slice(i, i + concurrency).map((fn) => fn()));
      await new Promise((r) => setTimeout(r, 1200));
    }
  }

  console.log("Tagging per-model files…");
  const models = FITMENT_BY_SLUG["phone-pouch"]?.options ?? [];
  for (const color of COLORS) {
    for (const model of models) {
      const slug = modelSlug(model);
      const layout = cameraFamilyForModel(model);
      if (!slug || !layout) continue;
      const dest = path.join(CAT, `phone-pouch-${color}-${slug}-1.jpg`);
      const master = path.join(CAT, `phone-pouch-${color}-${layout}-1.jpg`);
      const legacy = path.join(
        CAT,
        `phone-pouch-${color}-${legacyFamilyForLayout(layout)}-1.jpg`
      );
      const src = existsSync(master)
        ? master
        : existsSync(legacy)
          ? legacy
          : null;
      if (!src) continue;
      // Model tags always mirror the current layout master
      await copyFile(src, dest);
    }
  }
  console.log(`Tagged ${COLORS.length * models.length} model×colour slots.`);
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
