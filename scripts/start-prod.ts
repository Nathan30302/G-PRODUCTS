/**
 * Production start for Railway (and similar hosts).
 * Ensures DB, guarantees Gift's desk login, seeds catalog when empty,
 * then boots Next with clean SIGTERM forwarding for redeploys.
 */
import { spawn, type ChildProcess } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
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
 * which is easy to get wrong across Docker/Nixpacks. Always use an absolute file: URL.
 */
function resolveDatabaseUrl() {
  let url = process.env.DATABASE_URL?.trim();

  if (!url) {
    const dataDir = existsSync("/data")
      ? "/data"
      : path.join(process.cwd(), "prisma");
    mkdirSync(dataDir, { recursive: true });
    url = `file:${path.join(dataDir, "gproducts.db")}`;
    console.log(`[start] DATABASE_URL not set — using ${url}`);
  } else if (url.startsWith("file:")) {
    let filePath = url.slice("file:".length).split("?")[0];
    // file:///abs → /abs
    if (filePath.startsWith("///")) filePath = filePath.slice(2);
    const abs = path.isAbsolute(filePath)
      ? filePath
      : path.resolve(path.join(process.cwd(), "prisma"), filePath);
    mkdirSync(path.dirname(abs), { recursive: true });
    url = `file:${abs}`;
    console.log(`[start] DATABASE_URL → ${url}`);
  }

  process.env.DATABASE_URL = url;
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
 * (overridable via OWNER_*). Password is synced from OWNER_PASSWORD on boot
 * unless OWNER_SYNC_PASSWORD=0 (so in-app password changes can stick).
 */
async function ensureOwnerAccount() {
  const { PrismaClient } = await import("@prisma/client");
  const bcrypt = await import("bcryptjs");
  const prisma = new PrismaClient();

  const email = (process.env.OWNER_EMAIL ?? "gift@gproducts.zm")
    .trim()
    .toLowerCase();
  const name = (process.env.OWNER_NAME ?? "Gift Mbumwae").trim();
  const password = process.env.OWNER_PASSWORD ?? "changeme123";
  // Default: keep Railway password in sync so Gift can always sign in.
  // Set OWNER_SYNC_PASSWORD=0 after changing password in the desk if you
  // don't want redeploys to reset it.
  const syncPassword = process.env.OWNER_SYNC_PASSWORD !== "0";

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const existing = await prisma.user.findUnique({ where: { email } });

    if (!existing) {
      await prisma.user.create({
        data: {
          email,
          name,
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
          ...(syncPassword ? { passwordHash } : {})
        }
      });
      console.log(
        `[start] provider login ready: ${email}${
          syncPassword ? " (password from OWNER_PASSWORD)" : ""
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

  if (!process.env.AUTH_SECRET || process.env.AUTH_SECRET.length < 16) {
    console.warn(
      "[start] AUTH_SECRET missing or short — using a fallback. Set a long AUTH_SECRET in Railway."
    );
    process.env.AUTH_SECRET = "change-me-in-railway-variables";
  }

  console.log("[start] prisma generate");
  await run("npx", ["prisma", "generate"]);

  try {
    const { prepareCustomerSchemaForPush } = await import(
      "../lib/migrate-customers"
    );
    prepareCustomerSchemaForPush();
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
    await ensureOwnerAccount();
  } catch (err) {
    console.error("[start] ensure owner FAILED:", err);
  }

  // Photo uploads — always via /api/media (survives next start + Railway /data)
  try {
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

  const port = process.env.PORT || "3000";
  await startNext(port);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
