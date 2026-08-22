import { NextResponse } from "next/server";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { resolveUploadFile } from "@/lib/upload-resolve";
import {
  attachmentContentDisposition,
  displayFilenameFromUrl
} from "@/lib/service-files";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx":
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
};

export async function GET(
  req: Request,
  ctx: { params: Promise<{ path: string[] }> }
) {
  const { path: parts } = await ctx.params;
  if (!parts?.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const relative = parts.join("/");
  const absolute = resolveUploadFile(relative);

  if (!absolute) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const info = await stat(absolute);
    if (!info.isFile()) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const buf = await readFile(absolute);
    const ext = path.extname(absolute).toLowerCase();
    const contentType = TYPES[ext] ?? "application/octet-stream";

    const { searchParams } = new URL(req.url);
    const forceDownload =
      searchParams.get("download") === "1" ||
      searchParams.get("download") === "true";

    const headers: Record<string, string> = {
      "Content-Type": contentType,
      "Cache-Control": forceDownload
        ? "private, max-age=3600"
        : "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff"
    };

    if (forceDownload) {
      const requested = String(searchParams.get("name") ?? "").trim();
      const safeRequested = requested.replace(/[/\\]/g, "").slice(0, 180);
      const filename =
        safeRequested ||
        displayFilenameFromUrl(relative) ||
        path.basename(absolute);
      headers["Content-Disposition"] = attachmentContentDisposition(filename);
    }

    return new NextResponse(buf, { headers });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
