/**
 * Detect whether SQLite / uploads will survive a redeploy.
 *
 * Important: `existsSync("/data")` is NOT enough — the Dockerfile used to
 * `mkdir /data`, so every container looked "persistent" while the disk was
 * still ephemeral. Prefer Railway's volume env, then Linux mountinfo.
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const DEFAULT_MOUNT = "/data";

/** Absolute mount path for durable disk, or null if none detected. */
export function persistentMountPath(): string | null {
  if (process.env.PERSIST_DATA === "1") {
    return (
      process.env.PERSIST_DATA_PATH?.trim() ||
      process.env.RAILWAY_VOLUME_MOUNT_PATH?.trim() ||
      DEFAULT_MOUNT
    );
  }

  const railwayMount = process.env.RAILWAY_VOLUME_MOUNT_PATH?.trim();
  if (railwayMount) return railwayMount;

  try {
    const mounts = readFileSync("/proc/self/mountinfo", "utf8");
    for (const line of mounts.split("\n")) {
      const mountPoint = line.split(" ")[4];
      if (mountPoint === DEFAULT_MOUNT) return DEFAULT_MOUNT;
    }
  } catch {
    // Non-Linux (local Mac) or no /proc — fine
  }

  return null;
}

export function hasPersistentDataVolume(): boolean {
  return persistentMountPath() !== null;
}

/** Prefer volume path; fall back to cwd only when no durable disk is attached. */
export function persistentDbFilePath(): string {
  const mount = persistentMountPath();
  if (mount) return path.join(mount, "gproducts.db");
  return path.join(process.cwd(), "prisma", "gproducts.db");
}

export function persistentUploadsRoot(): string {
  const mount = persistentMountPath();
  if (mount) return path.join(mount, "uploads");
  return path.join(process.cwd(), ".uploads");
}

/** True when DATABASE_URL is SQLite and there is no durable volume. */
export function isEphemeralSqlite(databaseUrl = process.env.DATABASE_URL): boolean {
  const url = databaseUrl?.trim() ?? "";
  if (!url.startsWith("file:")) return false;
  return !hasPersistentDataVolume();
}

export function persistenceWarning(): string | null {
  if (!isEphemeralSqlite()) return null;
  return (
    "CRITICAL: SQLite is on ephemeral disk (no volume). Customer accounts, " +
    "orders, and the owner password will RESET on every deploy. " +
    "Attach a persistent volume at /data (Railway: Settings → Volumes) and set " +
    'DATABASE_URL=file:/data/gproducts.db — or switch DATABASE_URL to managed Postgres/Neon. ' +
    "Do NOT set OWNER_SYNC_PASSWORD=1 unless you intentionally want env to overwrite the desk password."
  );
}

/** Whether /data exists as a plain directory (not necessarily a volume). */
export function dataDirExists(): boolean {
  return existsSync(DEFAULT_MOUNT);
}
