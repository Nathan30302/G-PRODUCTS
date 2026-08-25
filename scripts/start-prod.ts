/**
 * Production start for Railway (and similar hosts).
 * Ensures DB, guarantees Gift's desk login, seeds catalog when empty,
 * then boots Next with clean SIGTERM forwarding for redeploys.
 */
import { spawn, type ChildProcess } from "node:child_process";
import { copyFileSync, cpSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import {
  hasPersistentDataVolume,
  persistenceWarning,
  persistentDbFilePath,
  persistentMountPath
} from "../lib/persist-data";

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
 * which is easy to get wrong across Docker/Nixpacks. On Railway, store the
 * database on a *real* volume (RAILWAY_VOLUME_MOUNT_PATH), not a plain /data
 * directory created by the image — that still wipes on redeploy.
 */
function resolveDatabaseUrl() {
  const mount = persistentMountPath();
  const persistentDb = persistentDbFilePath();

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

  if (mount) {
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
        `[start] using persistent DB on volume ${mount} (was ${configuredAbs})`
      );
    } else {
      console.log(`[start] persistent volume OK at ${mount}`);
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

  const warn = persistenceWarning();
  if (warn) {
    console.error(`[start] ${warn}`);
  }
}

/** WAL + busy_timeout so concurrent signups/orders don't hit "database is locked". */
async function tuneSqlite() {
  if (!process.env.DATABASE_URL?.startsWith("file:")) return;
  try {
    const { PrismaClient } = await import("@prisma/client");
    const p = new PrismaClient();
    // PRAGMAs return a result row — must use $queryRawUnsafe on SQLite.
    await p.$queryRawUnsafe("PRAGMA journal_mode=WAL;");
    await p.$queryRawUnsafe("PRAGMA busy_timeout=8000;");
    await p.$queryRawUnsafe("PRAGMA synchronous=NORMAL;");
    await p.$disconnect();
    console.log("[start] sqlite WAL mode ready");
  } catch (err) {
    console.warn("[start] sqlite tune:", err);
  }
}

/** Move legacy runtime uploads onto the volume so product photos survive redeploys. */
function migrateUploadsToVolume() {
  const mount = persistentMountPath();
  if (!mount) return;

  const target = path.join(mount, "uploads");
  const legacySources = [
    path.join(process.cwd(), ".uploads"),
    path.join(process.cwd(), "public", "uploads"),
    // Old Docker image created an empty /data that was still ephemeral
    ...(mount !== "/data" ? [path.join("/data", "uploads")] : [])
  ];

  mkdirSync(target, { recursive: true });

  for (const legacy of legacySources) {
    if (!existsSync(legacy) || legacy === target) continue;
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

/** Set once at process start so mid-boot SIGTERM also exits 0 (no fake crash). */
let shuttingDown = false;
let nextChild: ChildProcess | null = null;

function installCleanShutdownHandlers() {
  const shutdown = (signal: NodeJS.Signals) => {
    if (shuttingDown) return;
    shuttingDown = true;
    console.log(
      `[start] received ${signal} — clean exit${
        nextChild ? " (stopping Next)" : " (during boot)"
      }`
    );

    const forceTimer = setTimeout(() => {
      console.warn("[start] forced exit 0 after stop timeout");
      process.exit(0);
    }, 8_000);
    forceTimer.unref?.();

    if (nextChild?.pid && !nextChild.killed) {
      try {
        nextChild.kill(signal);
      } catch {
        // child may already be gone
      }
    } else {
      process.exit(0);
    }
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

/** Boot Next without nested npm/npx; exit 0 on Railway stop/redeploy SIGTERM. */
function startNext(port: string): Promise<never> {
  const nextBin = resolveNextBin();
  const args = ["start", "-H", "0.0.0.0", "-p", port];

  console.log(`[start] node ${nextBin} ${args.join(" ")}`);

  nextChild = spawn(process.execPath, [nextBin, ...args], {
    stdio: "inherit",
    env: process.env
  });

  return new Promise((_, reject) => {
    nextChild!.on("error", reject);
    nextChild!.on("exit", (code, signal) => {
      // Railway / platform stop: treat as clean shutdown (never a "crash").
      if (shuttingDown || signal === "SIGTERM" || signal === "SIGINT") {
        console.log("[start] Next stopped cleanly");
        process.exit(0);
      }
      process.exit(code ?? 1);
    });
  });
}

/**
 * Exactly one provider (OWNER). Created as gift@gproducts.zm / changeme123
 * (overridable via OWNER_*). Password is NEVER reset from OWNER_PASSWORD when
 * the owner already exists — set OWNER_SYNC_PASSWORD=1 only for an intentional
 * one-shot recovery, then remove it.
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
    const existing = await prisma.user.findUnique({ where: { email } });

    if (!existing) {
      const passwordHash = await bcrypt.hash(password, 10);
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
      if (!hasPersistentDataVolume()) {
        console.error(
          "[start] owner was created on ephemeral storage — this login will vanish on the next deploy until a volume (or Postgres) is configured"
        );
      }
    } else {
      await prisma.user.update({
        where: { email },
        data: {
          name,
          role: "OWNER",
          ...(ownerPhone && !existing.phone ? { phone: ownerPhone } : {}),
          ...(syncPassword
            ? { passwordHash: await bcrypt.hash(password, 10) }
            : {})
        }
      });
      console.log(
        `[start] provider login ready: ${email}${
          syncPassword
            ? " (password FORCE-synced from OWNER_PASSWORD — unset OWNER_SYNC_PASSWORD after recovery)"
            : " (password unchanged)"
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
  installCleanShutdownHandlers();
  resolveDatabaseUrl();
  await tuneSqlite();

  if (process.env.NODE_ENV === "production") {
    const { assertAuthSecretConfigured } = await import("../lib/auth-secret");
    assertAuthSecretConfigured();
  } else if (!process.env.AUTH_SECRET || process.env.AUTH_SECRET.length < 16) {
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
    ensureUploadsDir("misc");
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
