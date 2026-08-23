import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  sqliteTuned?: boolean;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"]
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * SQLite handles many readers well in WAL mode, and busy_timeout stops
 * "database is locked" crashes when signups/orders hit at once.
 * Safe no-op on non-SQLite if the provider is ever switched.
 */
export async function tuneSqliteForConcurrency() {
  if (globalForPrisma.sqliteTuned) return;
  const url = process.env.DATABASE_URL ?? "";
  if (!url.startsWith("file:")) {
    globalForPrisma.sqliteTuned = true;
    return;
  }
  try {
    // PRAGMAs return a result row — must use $queryRawUnsafe on SQLite.
    await prisma.$queryRawUnsafe("PRAGMA journal_mode=WAL;");
    await prisma.$queryRawUnsafe("PRAGMA busy_timeout=8000;");
    await prisma.$queryRawUnsafe("PRAGMA synchronous=NORMAL;");
    await prisma.$queryRawUnsafe("PRAGMA foreign_keys=ON;");
    globalForPrisma.sqliteTuned = true;
  } catch (err) {
    console.warn("[db] sqlite tune skipped:", err);
  }
}

// Fire-and-forget on module load (Node runtime only)
void tuneSqliteForConcurrency();
