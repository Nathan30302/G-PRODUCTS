/**
 * Production start for Railway (and similar hosts).
 * Ensures the SQLite file exists, syncs schema, seeds when empty, then boots Next
 * as a child with signal forwarding (so redeploys shut down cleanly).
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

function resolveNextBin() {
  // Prefer the installed package binary (no npx wrapper / nested SIGTERM)
  const candidates = [
    path.join(process.cwd(), "node_modules", "next", "dist", "bin", "next"),
    path.join(process.cwd(), "node_modules", "next", "dist", "bin", "next.js")
  ];
  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate;
  }
  throw new Error("Could not find next binary under node_modules/next");
}

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
        // ignore — child may already be gone
      }
    }
  };

  process.on("SIGTERM", () => forward("SIGTERM"));
  process.on("SIGINT", () => forward("SIGINT"));

  return new Promise((_, reject) => {
    child.on("error", reject);
    child.on("exit", (code, signal) => {
      if (signal) {
        // Re-raise so the container exit matches the shutdown signal
        process.kill(process.pid, signal);
        return;
      }
      process.exit(code ?? 1);
    });
  });
}

async function main() {
  if (!process.env.DATABASE_URL) {
    // Persist under /data when a Railway volume is mounted there; otherwise local prisma/
    const dataDir = existsSync("/data") ? "/data" : path.join(process.cwd(), "prisma");
    mkdirSync(dataDir, { recursive: true });
    process.env.DATABASE_URL = `file:${path.join(dataDir, "gproducts.db")}`;
    console.log(`[start] DATABASE_URL not set — using ${process.env.DATABASE_URL}`);
  }

  if (!process.env.AUTH_SECRET) {
    console.warn(
      "[start] AUTH_SECRET is not set. Admin login sessions will be insecure. Set it in Railway Variables."
    );
    process.env.AUTH_SECRET =
      process.env.AUTH_SECRET || "change-me-in-railway-variables";
  }

  console.log("[start] prisma generate");
  await run("npx", ["prisma", "generate"]);

  console.log("[start] prisma db push");
  await run("npx", ["prisma", "db", "push", "--skip-generate"]);

  // Seed only when the catalog is empty (first boot)
  try {
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();
    const count = await prisma.product.count();
    await prisma.$disconnect();
    if (count === 0) {
      console.log("[start] empty catalog — running seed");
      await run("npx", ["tsx", "prisma/seed.ts"]);
    } else {
      console.log(`[start] catalog has ${count} products — skip seed`);
    }
  } catch (err) {
    console.warn("[start] seed check failed, continuing:", err);
  }

  const port = process.env.PORT || "3000";
  await startNext(port);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
