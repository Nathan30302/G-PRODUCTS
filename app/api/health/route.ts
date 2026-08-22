import { NextResponse } from "next/server";
import { existsSync, statfsSync } from "node:fs";
import { prisma, tuneSqliteForConcurrency } from "@/lib/db";
import { MIN_PRODUCTS } from "@/lib/ensure-catalog";
import { uploadsRoot } from "@/lib/uploads";
import { legacyUploadRoots } from "@/lib/upload-resolve";

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
          ? "Under 1 GB free — expand the Railway volume soon."
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

    const ok = products >= MIN_PRODUCTS && categories > 0;
    const dbPath = process.env.DATABASE_URL?.startsWith("file:")
      ? process.env.DATABASE_URL.slice("file:".length).split("?")[0]
      : null;
    const uploadRoots = legacyUploadRoots();
    const hasDataVolume = existsSync("/data");
    const disk = hasDataVolume
      ? diskReport("/data")
      : diskReport(process.cwd());

    return NextResponse.json(
      {
        ok: ok && (disk.ok !== false || !hasDataVolume),
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
        uploads: {
          activeRoot: uploadsRoot(),
          hasDataVolume,
          roots: uploadRoots
        },
        disk,
        readiness: {
          accounts: "Customer signup uses unique email+phone; concurrent signups are safe.",
          database: hasDataVolume
            ? "SQLite on /data volume with WAL mode — fine for thousands of accounts and typical shop traffic."
            : "WARNING: no /data volume — DB/uploads may reset on redeploy. Attach a Railway volume at /data.",
          storageAdvice:
            "Keep the Railway volume at ≥5 GB for photos+DB. Grow to 10–20 GB before heavy catalog photo uploads. Switch to Postgres + object storage if you outgrow one server."
        }
      },
      { status: ok ? 200 : 503 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "db error";
    return NextResponse.json(
      { ok: false, error: message },
      { status: 503 }
    );
  }
}
