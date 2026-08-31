import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { saveImageUpload } from "@/lib/uploads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { error: "Sign in required. Open the provider desk again, then retry the upload." },
      { status: 401 }
    );
  }

  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No photo attached." }, { status: 400 });
    }

    const folderRaw = String(form.get("folder") ?? "products");
    const folder =
      folderRaw === "services" ||
      folderRaw === "service-pages" ||
      folderRaw === "misc" ||
      folderRaw === "browse-tiles"
        ? folderRaw
        : "products";

    const saved = await saveImageUpload(file, folder);
    return NextResponse.json({ ok: true, url: saved.url });
  } catch (err) {
    console.error("[admin/upload]", err);
    const message =
      err instanceof Error ? err.message : "Could not upload the photo.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
