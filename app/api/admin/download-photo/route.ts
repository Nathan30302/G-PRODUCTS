import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { getSession } from "@/lib/auth";
import { resolveUploadPath } from "@/lib/uploads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function safeFilename(name: string): string {
  return name.replace(/[^\w.-]+/g, "-").replace(/^-+|-+$/g, "") || "photo.jpg";
}

function contentTypeFor(url: string, fallback = "application/octet-stream"): string {
  if (/\.png$/i.test(url)) return "image/png";
  if (/\.webp$/i.test(url)) return "image/webp";
  if (/\.gif$/i.test(url)) return "image/gif";
  if (/\.jpe?g$/i.test(url)) return "image/jpeg";
  if (/\.pdf$/i.test(url)) return "application/pdf";
  if (/\.docx$/i.test(url)) {
    return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  }
  if (/\.doc$/i.test(url)) return "application/msword";
  return fallback;
}

async function readCatalogFile(url: string): Promise<Buffer> {
  const base = path.basename(url.split("?")[0] ?? "");
  if (!/^[\w.-]+\.(jpe?g|png|webp|gif)$/i.test(base)) {
    throw new Error("Invalid catalog file.");
  }
  const catalogRoot = path.join(process.cwd(), "public", "products", "catalog");
  const filePath = path.resolve(catalogRoot, base);
  if (!filePath.startsWith(catalogRoot + path.sep)) {
    throw new Error("Invalid catalog path.");
  }
  return readFile(filePath);
}

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const url = String(searchParams.get("url") ?? "").trim();
  const name = safeFilename(String(searchParams.get("name") ?? "product-photo.jpg"));

  if (!url) {
    return NextResponse.json({ error: "Missing photo URL." }, { status: 400 });
  }

  try {
    let body: Buffer;
    let contentType = "image/jpeg";

    if (url.startsWith("/products/catalog/")) {
      body = await readCatalogFile(url);
      contentType = contentTypeFor(url);
    } else if (url.startsWith("/api/media/") || url.startsWith("/uploads/")) {
      const relative = url
        .replace(/^\/api\/media\//, "")
        .replace(/^\/uploads\//, "");
      const filePath = resolveUploadPath(relative);
      body = await readFile(filePath);
      contentType = contentTypeFor(url);
    } else if (url.startsWith("http://") || url.startsWith("https://")) {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Could not fetch photo.");
      body = Buffer.from(await res.arrayBuffer());
      contentType = res.headers.get("content-type") ?? contentType;
    } else {
      return NextResponse.json({ error: "Unsupported photo URL." }, { status: 400 });
    }

    return new NextResponse(body, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${name}"`,
        "Cache-Control": "private, max-age=3600"
      }
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Download failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
