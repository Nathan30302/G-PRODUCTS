import { NextResponse } from "next/server";
import { existsSync, statfsSync } from "node:fs";
import { prisma, tuneSqliteForConcurrency } from "@/lib/db";
import { MIN_PRODUCTS } from "@/lib/ensure-catalog";
import { uploadsRoot } from "@/lib/uploads";
import { legacyUploadRoots } from "@/lib/upload-resolve";
import {
  hasPersistentDataVolume,
  isEphemeralSqlite,
  persistenceWarning,
  persistentMountPath
} from "@/lib/persist-data";

export const dynamic = "force-dynamic";

function maskEmail(email: string): string {
  const [user, domain] = email.split("@");
  if (!domain) return "***";
  const keep = Math.min(2, user.length);
  return `${user.slice(0, keep)}***@${domain}`;
}

function diskReport(target: string) {
  try {
    if (!existsSync(target)) {
      return { path: target, ok: false, error: "missing" };
    }
    const s = statfsSync(target);
    const block = Number(s.bsize);
    const totalBytes = Number(s.blocks) * block;
    const freeBytes = Number(s.bavail) * block;
    const usedBytes = totalBytes - freeBytes;
    const freeGb = freeBytes / 1024 ** 3;
    const totalGb = totalBytes / 1024 ** 3;
    const usedPct =
      totalBytes > 0 ? Math.round((usedBytes / totalBytes) * 100) : 0;
    return {
      path: target,
      ok: freeGb >= 0.5,
      freeGb: Math.round(freeGb * 100) / 100,
      totalGb: Math.round(totalGb * 100) / 100,
      usedPct,
      warn:
        freeGb < 1
          ? "Under 1 GB free — expand the volume soon."
          : freeGb < 2
            ? "Under 2 GB free — monitor photo uploads."
            : null
    };
  } catch (err) {
    return {
      path: target,
      ok: false,
      error: err instanceof Error ? err.message : "statfs failed"
    };
  }
}

/** Lightweight public probe — no secrets. */
export async function GET() {
  try {
    await tuneSqliteForConcurrency();

    const [products, categories, services, users, customers, owner] =
      await Promise.all([
        prisma.product.count(),
        prisma.category.count(),
        prisma.serviceOffer.count(),
        prisma.user.count(),
        prisma.customer.count(),
        prisma.user.findFirst({
          where: { role: "OWNER" },
          select: { email: true }
        })
      ]);

    const catalogOk = products >= MIN_PRODUCTS && categories > 0;
    const dbPath = process.env.DATABASE_URL?.startsWith("file:")
      ? process.env.DATABASE_URL.slice("file:".length).split("?")[0]
      : null;
    const uploadRoots = legacyUploadRoots();
    const mount = persistentMountPath();
    const hasVolume = hasPersistentDataVolume();
    const ephemeral = isEphemeralSqlite();
    const disk = mount ? diskReport(mount) : diskReport(process.cwd());
    const persistWarn = persistenceWarning();

    return NextResponse.json(
      {
        // Keep HTTP 200 when catalog is fine so deploys don't flap — persistence
        // issues are surfaced in `persistentStorage` / `readiness` for operators.
        ok: catalogOk && (disk.ok !== false || !hasVolume),
        products,
        categories,
        services,
        users,
        customers,
        ownerEmail: owner ? maskEmail(owner.email) : null,
        configuredOwner: maskEmail(
          process.env.OWNER_EMAIL?.trim() || "gift@gproducts.zm"
        ),
        dbPath,
        minProducts: MIN_PRODUCTS,
        persistentStorage: !ephemeral,
        volumeMount: mount,
        uploads: {
          activeRoot: uploadsRoot(),
          hasDataVolume: hasVolume,
          roots: uploadRoots
        },
        disk,
        readiness: {
          accounts:
            "Customer signup uses unique email+phone; concurrent signups are safe.",
          database: ephemeral
            ? persistWarn
            : hasVolume
              ? `SQLite on volume ${mount} with WAL mode — survives redeploys.`
              : "Non-SQLite DATABASE_URL — assumed durable (Postgres/Neon).",
          ownerPassword:
            "OWNER_PASSWORD only applies when the owner account is first created. Set OWNER_SYNC_PASSWORD=1 only for intentional recovery.",
          storageAdvice:
            "Attach a Volume at /data (≥5 GB), set DATABASE_URL=file:/data/gproducts.db, keep AUTH_SECRET stable. Or use managed Postgres. Grow to 10–20 GB before heavy photo uploads."
        }
      },
      { status: catalogOk ? 200 : 503 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "db error";
    return NextResponse.json(
      { ok: false, error: message },
      { status: 503 }
    );
  }
}
