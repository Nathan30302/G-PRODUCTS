/**
 * Download missing catalog JPEGs from Unsplash and verify Gift's photos exist.
 * Usage: npx tsx scripts/fetch-catalog-photos.ts
 */
import { existsSync, copyFileSync, mkdirSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { products } from "../lib/products";
import {
  catalogDefForSlug,
  catalogProducts,
  expectedCatalogFile,
  unsplashForSlug,
  unsplashUrl
} from "../lib/catalog-photos";

const ROOT = path.join(process.cwd(), "public", "products", "catalog");

async function download(url: string, dest: string): Promise<void> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(dest, buf);
}

async function ensureFile(filename: string, unsplashId: string): Promise<void> {
  const dest = path.join(ROOT, filename);
  if (existsSync(dest)) {
    console.log(`  skip (exists) ${filename}`);
    return;
  }
  const url = unsplashUrl(unsplashId);
  console.log(`  fetch ${filename}`);
  try {
    await download(url, dest);
  } catch (err) {
    console.warn(`  failed ${filename}:`, err instanceof Error ? err.message : err);
  }
}

async function main() {
  mkdirSync(ROOT, { recursive: true });

  const neededFiles = new Set<string>();

  for (const def of catalogProducts) {
    if (def.file) neededFiles.add(def.file);
    def.variants?.forEach((v) => neededFiles.add(v.file));
  }

  for (const p of products) {
    const def = catalogDefForSlug(p.slug);
    if (def?.file) neededFiles.add(def.file);
    else if (def?.variants) {
      def.variants.forEach((v) => neededFiles.add(v.file));
    } else {
      neededFiles.add(expectedCatalogFile(p.slug));
    }
  }

  console.log(`Catalog folder: ${ROOT}`);
  console.log(`Ensuring ${neededFiles.size} unique files…`);

  for (const p of products) {
    const def = catalogDefForSlug(p.slug);
    if (def?.variants) continue;
    const file = def?.file ?? expectedCatalogFile(p.slug);
    if (existsSync(path.join(ROOT, file))) continue;
    const unsplashId = def?.unsplashId ?? unsplashForSlug(p.slug);
    await ensureFile(file, unsplashId);
  }

  // Shared storage images — copy from one master if individual slugs differ
  const storageMaster = path.join(ROOT, "memory-card-32gb.jpg");
  if (existsSync(storageMaster)) {
    for (const p of products) {
      if (!p.slug.startsWith("memory-card-")) continue;
      const dest = path.join(ROOT, `${p.slug}.jpg`);
      if (!existsSync(dest)) {
        copyFileSync(storageMaster, dest);
        console.log(`  copy storage → ${p.slug}.jpg`);
      }
    }
  }

  const flashMaster = path.join(ROOT, "flash-disk-32gb.jpg");
  if (existsSync(flashMaster)) {
    for (const p of products) {
      if (!p.slug.startsWith("flash-disk-")) continue;
      const dest = path.join(ROOT, `${p.slug}.jpg`);
      if (!existsSync(dest)) {
        copyFileSync(flashMaster, dest);
        console.log(`  copy flash → ${p.slug}.jpg`);
      }
    }
  }

  const hddMaster = path.join(ROOT, "hard-drive-1tb.jpg");
  if (existsSync(hddMaster)) {
    for (const p of products) {
      if (!p.slug.startsWith("hard-drive-")) continue;
      const dest = path.join(ROOT, `${p.slug}.jpg`);
      if (!existsSync(dest)) {
        copyFileSync(hddMaster, dest);
        console.log(`  copy hdd → ${p.slug}.jpg`);
      }
    }
  }

  const extMaster = path.join(ROOT, "extension-4-way-3m.jpg");
  if (existsSync(extMaster)) {
    for (const p of products) {
      if (!p.slug.startsWith("extension-")) continue;
      const dest = path.join(ROOT, `${p.slug}.jpg`);
      if (!existsSync(dest)) {
        copyFileSync(extMaster, dest);
        console.log(`  copy extension → ${p.slug}.jpg`);
      }
    }
  }

  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
