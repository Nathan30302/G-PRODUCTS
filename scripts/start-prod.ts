/**
 * Production start for Railway (and similar hosts).
 * Ensures DB, guarantees Gift's desk login (gift@gproducts.zm), seeds catalog
 * when empty, then boots Next.
 */
import { spawn } from "node:child_process";
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

async function main() {
  if (!process.env.DATABASE_URL) {
    const dataDir = existsSync("/data")
      ? "/data"
      : path.join(process.cwd(), "prisma");
    mkdirSync(dataDir, { recursive: true });
    process.env.DATABASE_URL = `file:${path.join(dataDir, "gproducts.db")}`;
    console.log(`[start] DATABASE_URL not set — using ${process.env.DATABASE_URL}`);
  }

  if (!process.env.AUTH_SECRET || process.env.AUTH_SECRET.length < 16) {
    console.warn(
      "[start] AUTH_SECRET missing or short — using a fallback. Set a long AUTH_SECRET in Railway."
    );
    process.env.AUTH_SECRET = "change-me-in-railway-variables";
  }

  console.log("[start] prisma generate");
  await run("npx", ["prisma", "generate"]);

  console.log("[start] prisma db push");
  await run("npx", ["prisma", "db", "push", "--skip-generate"]);

  try {
    await ensureOwnerAccount();
  } catch (err) {
    console.error("[start] ensure owner FAILED:", err);
  }

  // Photo uploads (products / services) — prefer Railway volume at /data
  try {
    const { ensureUploadsDir } = await import("../lib/uploads");
    ensureUploadsDir("products");
    ensureUploadsDir("services");
    console.log("[start] upload folders ready");
  } catch (err) {
    console.warn("[start] upload folders:", err);
  }

  try {
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();
    const count = await prisma.product.count();
    await prisma.$disconnect();
    if (count === 0) {
      console.log("[start] empty catalog — running seed");
      await run("npx", ["tsx", "prisma/seed.ts"]);
    } else {
      console.log(`[start] catalog has ${count} products — skip catalog seed`);
    }
  } catch (err) {
    console.warn("[start] seed check failed, continuing:", err);
  }

  const port = process.env.PORT || "3000";
  console.log(`[start] next start -H 0.0.0.0 -p ${port}`);
  await run("npx", ["next", "start", "-H", "0.0.0.0", "-p", port]);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
