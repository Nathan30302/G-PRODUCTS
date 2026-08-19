/**
 * Download unique HD catalog photos from Wikimedia Commons (free licenses).
 * Never reuses the same source file across products. 3 angles per product/colour.
 *
 * Usage: npx tsx scripts/fetch-catalog-photos.ts
 */
import {
  existsSync,
  mkdirSync,
  copyFileSync,
  unlinkSync,
  readdirSync,
  statSync
} from "node:fs";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import {
  catalogProducts,
  commonsSearch,
  photoSources,
  wikiFile
} from "../lib/catalog-photos";

const ROOT = path.join(process.cwd(), "public", "products", "catalog");
const UA =
  "G-ProductsCatalog/1.0 (https://g-products.store; catalog photo sourcing)";

const usedTitles = new Set<string>();
const usedUrls = new Set<string>();

function allFilenames(): string[] {
  const files = new Set<string>();
  for (const p of catalogProducts) {
    p.files.forEach((f) => files.add(f));
    p.variants?.forEach((v) => v.files.forEach((f) => files.add(f)));
  }
  return [...files].sort();
}

function prefixOf(file: string): string {
  return file.replace(/-\d+\.jpg$/, "");
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function isProductLike(title: string, query: string): boolean {
  const t = title.toLowerCase();
  if (
    /portrait|selfie|person|people|crowd|\.svg$|logo|flag|map|chart|diagram|signature|young\.|mccormic|cormac|cormier/i.test(
      t
    )
  ) {
    return false;
  }
  const tokens = query
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 3 && !["with", "from", "white", "studio"].includes(w));
  if (tokens.length === 0) return true;
  return tokens.some((tok) => t.includes(tok));
}

async function searchCommons(query: string): Promise<string[]> {
  const url =
    "https://commons.wikimedia.org/w/api.php?" +
    new URLSearchParams({
      action: "query",
      list: "search",
      srsearch: `${query} filetype:bitmap`,
      srnamespace: "6",
      srlimit: "30",
      format: "json"
    }).toString();

  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (res.status === 429) {
    await sleep(4000);
    return searchCommons(query);
  }
  if (!res.ok) throw new Error(`search HTTP ${res.status}`);
  const data = (await res.json()) as {
    query?: { search?: { title: string }[] };
  };
  return (data.query?.search ?? [])
    .map((s) => s.title)
    .filter((t) => /\.(jpe?g|png|webp)$/i.test(t))
    .filter((t) => isProductLike(t, query));
}

function titleToFilePath(title: string): string {
  return wikiFile(title.replace(/^File:/i, ""), 1400);
}

async function download(url: string, dest: string): Promise<void> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "image/*" },
      redirect: "follow"
    });
    if (res.status === 429 || res.status === 503) {
      await sleep(3000 * (attempt + 1));
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

async function pickUnusedTitle(queries: string[]): Promise<string | null> {
  for (const query of queries) {
    let titles: string[] = [];
    try {
      titles = await searchCommons(query);
    } catch {
      continue;
    }
    await sleep(400);
    for (const title of titles) {
      const key = title.toLowerCase();
      if (usedTitles.has(key)) continue;
      usedTitles.add(key);
      return title;
    }
  }
  return null;
}

async function fillFromWiki(file: string): Promise<boolean> {
  const dest = path.join(ROOT, file);
  const explicit = photoSources[file];
  if (explicit?.includes("wikimedia.org") && !usedUrls.has(explicit)) {
    try {
      await download(explicit, dest);
      usedUrls.add(explicit);
      console.log(`  ✓ ${file} (mapped)`);
      return true;
    } catch (err) {
      console.warn(
        `  mapped fail ${file}: ${err instanceof Error ? err.message : err}`
      );
    }
  }

  const prefix = prefixOf(file);
  const angle = file.match(/-(\d)\.jpg$/)?.[1] ?? "1";
  const base = commonsSearch[prefix];
  if (!base) {
    console.warn(`  no search query for ${file}`);
    return false;
  }
  const extras =
    angle === "2" ? "side view" : angle === "3" ? "close-up detail" : "product photo";

  const generic = base
    .split(" ")
    .filter((w) => w.length > 4)
    .slice(0, 3)
    .join(" ");

  const title = await pickUnusedTitle([
    base,
    `${base} ${extras}`,
    `${base} white background`,
    generic
  ]);
  if (!title) return false;

  const url = titleToFilePath(title);
  if (usedUrls.has(url)) return false;
  try {
    await download(url, dest);
    usedUrls.add(url);
    console.log(`  ✓ ${file} ← ${title.replace(/^File:/i, "")}`);
    return true;
  } catch (err) {
    console.warn(`  ✗ ${file}: ${err instanceof Error ? err.message : err}`);
    usedTitles.delete(title.toLowerCase());
    return false;
  }
}

function overlayUserSamples() {
  const assets =
    "/Users/mac/.cursor/projects/Users-mac-G-PRODUCTS/assets";
  const map: [string, string][] = [
    [
      "WhatsApp_Image_2026-08-19_at_17.40.44-a69ff0aa-5be8-4e91-b693-29a6be9aab24.png",
      "t900-ultra-orange-1.jpg"
    ],
    [
      "WhatsApp_Image_2026-08-19_at_17.40.44__1_-d8dfe20f-5a7f-48ba-9dc1-b56b2e6c2770.png",
      "t900-ultra-black-1.jpg"
    ],
    [
      "WhatsApp_Image_2026-08-19_at_17.40.44__2_-95737210-1ead-49d5-8ed0-fca1c0e18dbe.png",
      "t900-ultra-1.jpg"
    ],
    [
      "WhatsApp_Image_2026-08-19_at_17.40.44__1_-d8dfe20f-5a7f-48ba-9dc1-b56b2e6c2770.png",
      "kt8-ultra-max-black-1.jpg"
    ],
    [
      "WhatsApp_Image_2026-08-19_at_17.40.46-26bf71d8-94de-441a-b904-7049b5a58b4a.png",
      "tws-f9-5-1.jpg"
    ],
    [
      "WhatsApp_Image_2026-08-19_at_17.40.45-693202db-aab4-458e-a066-c22f5a912113.png",
      "vortex-pods-1.jpg"
    ],
    [
      "WhatsApp_Image_2026-08-19_at_17.40.39-58064ef5-3f14-45da-8a4c-e9d2174e8bc3.png",
      "ubl-harman-1.jpg"
    ],
    [
      "WhatsApp_Image_2026-08-19_at_17.40.30-47510c40-36e3-4946-82fd-1d96d8105ca8.png",
      "corms-1.jpg"
    ],
    [
      "WhatsApp_Image_2026-08-19_at_17.40.36__2_-6a87fa03-8e36-43c5-b01e-5fc7214f135d.png",
      "sivia-cable-1.jpg"
    ],
    [
      "WhatsApp_Image_2026-08-19_at_17.40.38-c059ca79-f9df-41ab-9d36-18721edfe3d6.png",
      "samsung-akg-headset-1.jpg"
    ],
    [
      "WhatsApp_Image_2026-08-19_at_17.40.34-f3fff315-00fb-43e7-84d6-ded464d88b90.png",
      "bic-crystal-pen-blue-1.jpg"
    ]
  ];
  for (const [srcName, destName] of map) {
    const src = path.join(assets, srcName);
    if (!existsSync(src)) continue;
    copyFileSync(src, path.join(ROOT, destName));
    console.log(`  overlay ${destName}`);
  }
}

function removeLegacyDuplicates() {
  const keep = new Set(allFilenames());
  for (const name of readdirSync(ROOT)) {
    if (!keep.has(name) && /\.(jpe?g|png|webp)$/i.test(name)) {
      unlinkSync(path.join(ROOT, name));
      console.log(`  removed legacy ${name}`);
    }
  }
}

async function main() {
  mkdirSync(ROOT, { recursive: true });
  const files = allFilenames();
  console.log(`Fetching unique photos for ${files.length} catalog slots…`);

  let ok = 0;
  let skip = 0;
  let fail = 0;

  for (const file of files) {
    const dest = path.join(ROOT, file);
    try {
      if (existsSync(dest) && statSync(dest).size >= 8000) {
        skip++;
        continue;
      }
      if (existsSync(dest)) unlinkSync(dest);
      const filled = await fillFromWiki(file);
      if (filled) ok++;
      else {
        fail++;
        console.warn(`  missing ${file}`);
      }
    } catch (err) {
      fail++;
      console.warn(`  error ${file}: ${err instanceof Error ? err.message : err}`);
    }
    await sleep(450);
  }

  overlayUserSamples();
  removeLegacyDuplicates();
  console.log(`Done. fetched=${ok} existed=${skip} failed=${fail}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
