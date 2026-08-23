/**
 * Generate slim Apple-style silicone iPhone CASE photos (NOT leather pouches).
 * Per camera layout + per-model tags. Model files mirror the layout master.
 *
 * Usage:
 *   npx tsx scripts/generate-pouch-model-photos.ts
 *   npx tsx scripts/generate-pouch-model-photos.ts --improve
 *   npx tsx scripts/generate-pouch-model-photos.ts --fresh --improve
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

/** Precise camera cutout language for each layout family. */
const LAYOUT_PROMPT: Record<string, string> = {
  single:
    "one centered rear camera lens cutout with small flash hole beside it, iPhone 7 / 8 style",
  plus:
    "vertical dual camera lenses in a raised oval bump cutout with flash, iPhone 7 Plus / 8 Plus style",
  x: "tall vertical dual camera lenses in an oval module cutout, iPhone X / XS style",
  xr: "one large single camera lens cutout in the upper left, iPhone XR / 11 style",
  "11pro":
    "square camera module cutout with three lenses arranged in a triangle and a flash, iPhone 11 Pro style",
  "12dual":
    "square camera module cutout with two diagonal lenses, iPhone 12 / 13 / 14 non-Pro style",
  "12pro":
    "large square camera module cutout with three diagonal lenses, iPhone 12 Pro / 13 Pro style",
  "14pro":
    "pill-shaped Dynamic Island camera cutout with dual lenses plus a separate circular lens, iPhone 14 Pro style",
  "15dual":
    "vertical dual camera lenses in an elongated rounded rectangle module, iPhone 15 / 16 non-Pro style",
  "15pro":
    "vertical triple camera lenses in an elongated rounded rectangle titanium-style module, iPhone 15 Pro / 16 Pro style",
  "17dual":
    "modern dual camera module cutout for iPhone 17 non-Pro style slim silicone case",
  "17pro":
    "wide horizontal camera plateau bar across the upper back with three camera lens cutouts in a row, iPhone 17 Pro Max style, NOT a vertical island"
};

const FORBIDDEN =
  "not a leather belt pouch, not a wallet case, not a holster, not a flip cover, " +
  "not a rugged armor case, not a thick OtterBox, not a hand holding the phone, " +
  "not front screen view, not Android phone, back of case only";

function seedFor(color: string, layout: string): number {
  let h = 11200;
  for (const ch of `${color}-${layout}-silicone-v2`) {
    h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  }
  return 11000 + (h % 9000);
}

function siliconePrompt(color: string, layout: string): string {
  const colorName = color.replace(/-/g, " ");
  return (
    `slim soft silicone iPhone case protective cover, matte ${colorName} finish, ` +
    `Apple-style liquid silicone, precise camera cutout for ${LAYOUT_PROMPT[layout] ?? layout}, ` +
    `product shot of the BACK of the empty case only, centered, ` +
    `professional e-commerce studio photography, pure seamless white background, ` +
    `sharp HD, even soft lighting, no text, no watermark, no person, no hands, ${FORBIDDEN}`
  );
}

function pollinationsUrl(prompt: string, seed: number): string {
  const q = encodeURIComponent(prompt);
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
  const onlyLayout = process.argv
    .find((a) => a.startsWith("--layout="))
    ?.slice("--layout=".length);

  if (improve) {
    console.log("Generating slim silicone case masters (Apple-style)…");
    const jobs: Array<() => Promise<void>> = [];
    for (const color of COLORS) {
      for (const layout of CAMERA_FAMILIES) {
        if (onlyLayout && layout !== onlyLayout) continue;
        jobs.push(async () => {
          const dest = path.join(CAT, `phone-pouch-${color}-${layout}-1.jpg`);
          if (!fresh && existsSync(dest) && !onlyLayout) {
            // Still regenerate when --improve and file looks like a shared legacy seed
            const legacyPath = path.join(
              CAT,
              `phone-pouch-${color}-${legacyFamilyForLayout(layout)}-1.jpg`
            );
            if (
              existsSync(legacyPath) &&
              !(await sameBytes(dest, legacyPath)) &&
              !process.argv.includes("--force-all")
            ) {
              // keep unique existing unless --force-all
              return;
            }
          }
          const ok = await download(
            pollinationsUrl(siliconePrompt(color, layout), seedFor(color, layout)),
            dest
          );
          if (!ok) {
            console.warn(`  keep existing if any: ${path.basename(dest)}`);
          }
        });
      }
    }
    const concurrency = 1;
    for (let i = 0; i < jobs.length; i += concurrency) {
      await Promise.all(jobs.slice(i, i + concurrency).map((fn) => fn()));
      await new Promise((r) => setTimeout(r, 1500));
    }
  } else {
    console.log("Skip generation (pass --improve to download). Tagging only…");
  }

  console.log("Tagging per-model silicone case files…");
  const models = FITMENT_BY_SLUG["phone-pouch"]?.options ?? [];
  for (const color of COLORS) {
    for (const model of models) {
      const slug = modelSlug(model);
      const layout = cameraFamilyForModel(model);
      if (!slug || !layout) continue;
      if (onlyLayout && layout !== onlyLayout) continue;
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
