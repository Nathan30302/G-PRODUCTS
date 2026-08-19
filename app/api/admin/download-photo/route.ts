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

async function readCatalogFile(relative: string): Promise<Buffer> {
  const clean = relative.replace(/^\/+/, "").replace(/\.\./g, "");
  const filePath = path.join(process.cwd(), "public", clean);
  if (!filePath.startsWith(path.join(process.cwd(), "public", "products", "catalog"))) {
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
      if (url.endsWith(".png")) contentType = "image/png";
      else if (url.endsWith(".webp")) contentType = "image/webp";
    } else if (url.startsWith("/api/media/")) {
      const relative = url.replace(/^\/api\/media\//, "");
      const filePath = resolveUploadPath(relative);
      body = await readFile(filePath);
      if (url.endsWith(".png")) contentType = "image/png";
      else if (url.endsWith(".webp")) contentType = "image/webp";
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
