/**
 * Download unique pollinations studio shots for missing catalog slots only.
 * Never overwrites Gift WhatsApp overlays. Optionally regenerates known junk files.
 *
 * Usage: npx tsx scripts/fill-missing-catalog-photos.ts
 */
import { existsSync, mkdirSync, statSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import {
  catalogProducts,
  generatedPhoto,
  photoSources
} from "../lib/catalog-photos";

const ROOT = path.join(process.cwd(), "public", "products", "catalog");

const GIFT_OVERLAYS = new Set([
  "t900-ultra-orange-1.jpg",
  "t900-ultra-black-1.jpg",
  "kt8-ultra-max-black-1.jpg",
  "tws-f9-5-1.jpg",
  "vortex-pods-1.jpg",
  "ubl-harman-1.jpg",
  "corms-1.jpg",
  "sivia-cable-1.jpg",
  "samsung-akg-headset-1.jpg",
  "bic-crystal-pen-blue-1.jpg"
]);

/** Wrong Wikimedia hits — regenerate even if a file already exists */
const FORCE_REGEN = new Set([
  "corms-2.jpg",
  "corms-3.jpg",
  "corms-black-3.jpg",
  "bic-crystal-pen-black-1.jpg",
  "bic-crystal-pen-black-2.jpg",
  "bic-crystal-pen-black-3.jpg",
  "phone-pouch-black-1.jpg",
  "phone-pouch-black-2.jpg"
]);

function allPriorityFiles(): string[] {
  const files: string[] = [];
  for (const p of catalogProducts) {
    if (p.variants?.length) {
      for (const v of p.variants) files.push(...v.files);
    } else {
      files.push(...p.files);
    }
  }
  return files;
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function sourceUrl(file: string): string | undefined {
  const src = photoSources[file];
  if (src?.includes("pollinations.ai")) return src;
  if (FORCE_REGEN.has(file) || !src) {
    const stem = file.replace(/-\d+\.jpg$/, "").replace(/-/g, " ");
    const angle = file.match(/-(\d)\.jpg$/)?.[1] ?? "1";
    const extra =
      angle === "2" ? "three-quarter angle" : angle === "3" ? "close-up detail" : "hero front view";
    return generatedPhoto(`${stem} ${extra}`, 8000 + file.length * 17 + Number(angle));
  }
  return undefined;
}

async function download(url: string, dest: string): Promise<void> {
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch(url, {
      headers: { Accept: "image/*" },
      redirect: "follow",
      signal: AbortSignal.timeout(35000)
    });
    if (res.status === 429 || res.status === 503) {
      await sleep(2500 * (attempt + 1));
      continue;
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 8000) throw new Error(`too small (${buf.length}b)`);
    await writeFile(dest, buf);
    return;
  }
  throw new Error("rate limited");
}

async function mapPool<T>(
  items: T[],
  concurrency: number,
  worker: (item: T) => Promise<void>
) {
  let i = 0;
  async function run() {
    while (i < items.length) {
      const item = items[i++];
      await worker(item);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, () => run()));
}

async function main() {
  mkdirSync(ROOT, { recursive: true });
  const wanted = allPriorityFiles();
  const todo = wanted.filter((file) => {
    if (GIFT_OVERLAYS.has(file)) return false;
    const dest = path.join(ROOT, file);
    if (FORCE_REGEN.has(file)) return true;
    return !(existsSync(dest) && statSync(dest).size >= 8000);
  });

  console.log(`Filling ${todo.length} catalog slots (${wanted.length} priority)…`);
  let ok = 0;
  let fail = 0;

  await mapPool(todo, 6, async (file) => {
    const dest = path.join(ROOT, file);
    const url = sourceUrl(file);
    if (!url) {
      console.warn(`  no source ${file}`);
      fail++;
      return;
    }
    try {
      await download(url, dest);
      ok++;
      console.log(`  ✓ ${file}`);
    } catch (err) {
      fail++;
      console.warn(`  ✗ ${file}: ${err instanceof Error ? err.message : err}`);
    }
  });

  console.log(`Done. filled=${ok} failed=${fail}`);
  if (fail > 0) process.exitCode = 1;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
