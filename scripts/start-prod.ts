/**
 * Production start for Railway (and similar hosts).
 * Ensures DB, guarantees Gift's desk login, seeds catalog when empty,
 * then boots Next with clean SIGTERM forwarding for redeploys.
 */
import { spawn, type ChildProcess } from "node:child_process";
import { copyFileSync, cpSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";

function run(cmd: string, args: string[]) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(cmd, args, {
      stdio: "inherit",
      env: process.env,
      shell: process.platform === "win32"
    });
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} ${args.join(" ")} exited with ${code}`));
    });
  });
}

/**
 * Prisma resolves relative SQLite paths against the schema directory (prisma/),
 * which is easy to get wrong across Docker/Nixpacks. On Railway, always store
 * the database on the /data volume so redeploys keep products, customers, and orders.
 */
function resolveDatabaseUrl() {
  const hasDataVolume = existsSync("/data");
  const persistentDb = hasDataVolume
    ? path.join("/data", "gproducts.db")
    : path.join(process.cwd(), "prisma", "gproducts.db");

  let url = process.env.DATABASE_URL?.trim();
  let configuredAbs: string | null = null;

  if (url?.startsWith("file:")) {
    let filePath = url.slice("file:".length).split("?")[0];
    if (filePath.startsWith("///")) filePath = filePath.slice(2);
    configuredAbs = path.isAbsolute(filePath)
      ? filePath
      : path.resolve(path.join(process.cwd(), "prisma"), filePath);
  }

  mkdirSync(path.dirname(persistentDb), { recursive: true });

  if (hasDataVolume) {
    if (
      !existsSync(persistentDb) &&
      configuredAbs &&
      existsSync(configuredAbs) &&
      configuredAbs !== persistentDb
    ) {
      copyFileSync(configuredAbs, persistentDb);
      console.log(`[start] copied existing DB → ${persistentDb}`);
    }
    url = `file:${persistentDb}`;
    if (configuredAbs && configuredAbs !== persistentDb) {
      console.log(
        `[start] using persistent DB on volume (was ${configuredAbs})`
      );
    }
  } else if (!url) {
    url = `file:${persistentDb}`;
    console.log(`[start] DATABASE_URL not set — using ${url}`);
  } else if (configuredAbs) {
    mkdirSync(path.dirname(configuredAbs), { recursive: true });
    url = `file:${configuredAbs}`;
  }

  process.env.DATABASE_URL = url;
  console.log(`[start] DATABASE_URL → ${url}`);
}

/** WAL + busy_timeout so concurrent signups/orders don't hit "database is locked". */
async function tuneSqlite() {
  if (!process.env.DATABASE_URL?.startsWith("file:")) return;
  try {
    const { PrismaClient } = await import("@prisma/client");
    const p = new PrismaClient();
    await p.$executeRawUnsafe("PRAGMA journal_mode=WAL;");
    await p.$executeRawUnsafe("PRAGMA busy_timeout=8000;");
    await p.$executeRawUnsafe("PRAGMA synchronous=NORMAL;");
    await p.$disconnect();
    console.log("[start] sqlite WAL mode ready");
  } catch (err) {
    console.warn("[start] sqlite tune:", err);
  }
}

/** Move legacy runtime uploads onto /data so product photos survive redeploys. */
function migrateUploadsToVolume() {
  if (!existsSync("/data")) return;

  const target = path.join("/data", "uploads");
  const legacySources = [
    path.join(process.cwd(), ".uploads"),
    path.join(process.cwd(), "public", "uploads")
  ];

  mkdirSync(target, { recursive: true });

  for (const legacy of legacySources) {
    if (!existsSync(legacy)) continue;
    try {
      cpSync(legacy, target, { recursive: true, force: false });
      console.log(`[start] merged ${legacy} → ${target}`);
    } catch {
      // target may already contain files — that's fine
    }
  }
}

function resolveNextBin() {
  const candidates = [
    path.join(process.cwd(), "node_modules", "next", "dist", "bin", "next"),
    path.join(process.cwd(), "node_modules", "next", "dist", "bin", "next.js")
  ];
  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate;
  }
  throw new Error("Could not find next binary under node_modules/next");
}

/** Boot Next without nested npx, and forward stop signals for clean Railway redeploys. */
function startNext(port: string): Promise<never> {
  const nextBin = resolveNextBin();
  const args = ["start", "-H", "0.0.0.0", "-p", port];

  console.log(`[start] node ${nextBin} ${args.join(" ")}`);

  const child: ChildProcess = spawn(process.execPath, [nextBin, ...args], {
    stdio: "inherit",
    env: process.env
  });

  const forward = (signal: NodeJS.Signals) => {
    if (child.pid && !child.killed) {
      try {
        child.kill(signal);
      } catch {
        // child may already be gone
      }
    }
  };

  process.on("SIGTERM", () => forward("SIGTERM"));
  process.on("SIGINT", () => forward("SIGINT"));

  return new Promise((_, reject) => {
    child.on("error", reject);
    child.on("exit", (code, signal) => {
      if (signal) {
        process.kill(process.pid, signal);
        return;
      }
      process.exit(code ?? 1);
    });
  });
}

/**
 * Exactly one provider (OWNER). Created as gift@gproducts.zm / changeme123
 * (overridable via OWNER_*). Password is only reset from OWNER_PASSWORD when
 * OWNER_SYNC_PASSWORD=1 — otherwise in-app password changes stick across deploys.
 */
async function ensureOwnerAccount() {
  const { PrismaClient } = await import("@prisma/client");
  const bcrypt = await import("bcryptjs");
  const { normalizePhone } = await import("../lib/phone");
  const prisma = new PrismaClient();

  const email = (process.env.OWNER_EMAIL ?? "gift@gproducts.zm")
    .trim()
    .toLowerCase();
  const name = (process.env.OWNER_NAME ?? "Gift Mbumwae").trim();
  const ownerPhone =
    normalizePhone(process.env.OWNER_PHONE ?? "0972500209") ?? null;
  const password = process.env.OWNER_PASSWORD ?? "changeme123";
  const syncPassword = process.env.OWNER_SYNC_PASSWORD === "1";

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const existing = await prisma.user.findUnique({ where: { email } });

    if (!existing) {
      await prisma.user.create({
        data: {
          email,
          name,
          phone: ownerPhone,
          passwordHash,
          role: "OWNER"
        }
      });
      console.log(`[start] created provider login: ${email}`);
    } else {
      await prisma.user.update({
        where: { email },
        data: {
          name,
          role: "OWNER",
          ...(ownerPhone && !existing.phone ? { phone: ownerPhone } : {}),
          ...(syncPassword ? { passwordHash } : {})
        }
      });
      console.log(
        `[start] provider login ready: ${email}${
          syncPassword ? " (password synced from OWNER_PASSWORD)" : ""
        }`
      );
    }

    // Demote any other OWNER so there is only one provider
    const demoted = await prisma.user.updateMany({
      where: { role: "OWNER", NOT: { email } },
      data: { role: "STAFF" }
    });
    if (demoted.count > 0) {
      console.log(
        `[start] demoted ${demoted.count} extra OWNER account(s) to STAFF`
      );
    }
  } finally {
    await prisma.$disconnect();
  }
}

async function repairBrokenCatalogImages() {
  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient();
  // Unsplash sometimes retires photo IDs — rewrite known-dead URLs in place.
  const replacements: [string, string][] = [
    [
      "photo-1452860606245-482548ac56cd",
      "photo-1586075010923-2dd4570fb338"
    ],
    [
      "photo-1583485088034-697b5bc36b56",
      "photo-1517842645767-c639042777db"
    ]
  ];

  try {
    let fixed = 0;
    for (const [from, to] of replacements) {
      const rows = await prisma.productImage.findMany({
        where: { url: { contains: from } }
      });
      for (const row of rows) {
        await prisma.productImage.update({
          where: { id: row.id },
          data: { url: row.url.replace(from, to) }
        });
        fixed += 1;
      }
    }
    if (fixed > 0) {
      console.log(`[start] repaired ${fixed} broken catalog image URL(s)`);
    }
  } finally {
    await prisma.$disconnect();
  }
}

async function ensureCatalog() {
  const { PrismaClient } = await import("@prisma/client");
  const { catalogNeedsSeed, MIN_PRODUCTS } = await import(
    "../lib/ensure-catalog"
  );
  const force = process.env.FORCE_SEED === "1";

  const prisma = new PrismaClient();
  try {
    const status = await catalogNeedsSeed(prisma);
    console.log(
      `[start] catalog status: ${status.products} products, ${status.categories} categories (min products ${MIN_PRODUCTS})`
    );

    if (!force && !status.needs) {
      console.log("[start] catalog OK — skip seed");
      return;
    }

    console.log(
      force
        ? "[start] FORCE_SEED=1 — running seed"
        : "[start] catalog incomplete — running seed"
    );
  } finally {
    await prisma.$disconnect();
  }

  await run("npx", ["tsx", "prisma/seed.ts"]);

  const verify = new PrismaClient();
  try {
    const after = await catalogNeedsSeed(verify);
    console.log(
      `[start] catalog after seed: ${after.products} products, ${after.categories} categories`
    );
    if (after.needs) {
      throw new Error(
        `Seed finished but catalog still incomplete (${after.products} products). Check seed logs.`
      );
    }
  } finally {
    await verify.$disconnect();
  }
}

async function main() {
  resolveDatabaseUrl();
  await tuneSqlite();

  if (!process.env.AUTH_SECRET || process.env.AUTH_SECRET.length < 16) {
    console.warn(
      "[start] AUTH_SECRET missing or short — using a fallback. Set a long AUTH_SECRET in Railway."
    );
    process.env.AUTH_SECRET = "change-me-in-railway-variables";
  }

  console.log("[start] prisma generate");
  await run("npx", ["prisma", "generate"]);

  try {
    const { prepareCustomerSchema } = await import(
      "../lib/migrate-customers"
    );
    await prepareCustomerSchema();
  } catch (err) {
    console.warn("[start] customer pre-migration:", err);
  }

  console.log("[start] prisma db push");
  await run("npx", ["prisma", "db", "push", "--skip-generate"]);

  try {
    const { linkOrdersToCustomers } = await import("../lib/migrate-customers");
    await linkOrdersToCustomers();
  } catch (err) {
    console.warn("[start] link orders to customers:", err);
  }

  try {
    const { canonicalizeCustomerPhones } = await import(
      "../lib/customer-lookup"
    );
    const fixed = await canonicalizeCustomerPhones();
    if (fixed > 0) {
      console.log(`[start] canonicalized ${fixed} customer phone(s)`);
    }
  } catch (err) {
    console.warn("[start] customer phone canonicalization:", err);
  }

  try {
    await ensureOwnerAccount();
  } catch (err) {
    console.error("[start] ensure owner FAILED:", err);
  }

  // Photo uploads — always via /api/media (survives next start + Railway /data)
  try {
    migrateUploadsToVolume();
    const { ensureUploadsDir } = await import("../lib/uploads");
    ensureUploadsDir("products");
    ensureUploadsDir("services");
    console.log("[start] upload folders ready");
  } catch (err) {
    console.warn("[start] upload folders:", err);
  }

  try {
    await ensureCatalog();
  } catch (err) {
    console.error("[start] catalog seed FAILED:", err);
    // Retry once — transient volume / lock issues on Railway
    try {
      console.log("[start] retrying catalog seed once…");
      await ensureCatalog();
    } catch (err2) {
      console.error(
        "[start] catalog seed FAILED again — storefront may have no products:",
        err2
      );
    }
  }

  try {
    await repairBrokenCatalogImages();
  } catch (err) {
    console.warn("[start] image URL repair:", err);
  }

  try {
    console.log("[start] syncing HD catalog photos (fill missing only)");
    await run("npx", ["tsx", "scripts/sync-catalog-photos.ts"]);
    // Refresh pouches + extensions catalog files when the desk has not uploaded
    // custom photos — never overwrite /api/media uploads.
    await run("npx", [
      "tsx",
      "scripts/sync-catalog-photos.ts",
      "--force-if-catalog-only",
      "--refresh-copy",
      "--only=phone-pouch,extension-cable"
    ]);
  } catch (err) {
    console.warn("[start] catalog photo sync:", err);
  }

  const port = process.env.PORT || "3000";
  await startNext(port);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
