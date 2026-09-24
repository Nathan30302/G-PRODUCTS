import "server-only";
import { unlink } from "node:fs/promises";
import { prisma } from "@/lib/db";
import { parseServiceFileUrls } from "@/lib/service-files";
import {
  resolveUploadFile,
  uploadRelativeFromPublicUrl
} from "@/lib/upload-resolve";

/** Print and loan uploads stay long enough to download, then leave the disk. */
export const SERVICE_FILE_KEEP_HOURS = 12;

export function filesKeptUntil(from = new Date()): string {
  return new Date(
    from.getTime() + SERVICE_FILE_KEEP_HOURS * 60 * 60 * 1000
  ).toISOString();
}

/** Drop expired upload bytes. The request row (who, what, status) stays. */
export async function expireOldServiceFiles(): Promise<number> {
  const cutoff = Date.now() - SERVICE_FILE_KEEP_HOURS * 60 * 60 * 1000;
  const rows = await prisma.serviceRequest.findMany({
    where: { fileUrls: { not: null } },
    select: { id: true, fileUrls: true, details: true, createdAt: true }
  });

  let cleared = 0;
  for (const row of rows) {
    if (row.createdAt.getTime() > cutoff) continue;
    const urls = parseServiceFileUrls(row.fileUrls);
    for (const url of urls) {
      const relative = uploadRelativeFromPublicUrl(url.split("?")[0] ?? url);
      if (!relative || !relative.startsWith("services/")) continue;
      const absolute = resolveUploadFile(relative);
      if (absolute) await unlink(absolute).catch(() => undefined);
    }

    let details: Record<string, unknown> = {};
    try {
      details = JSON.parse(row.details);
    } catch {
      details = {};
    }
    details.filesCleared = true;

    await prisma.serviceRequest.update({
      where: { id: row.id },
      data: {
        fileUrls: null,
        details: JSON.stringify(details)
      }
    });
    cleared += 1;
  }
  return cleared;
}
