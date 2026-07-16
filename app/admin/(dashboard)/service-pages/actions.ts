"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { DEFAULT_SETTINGS } from "@/lib/services";

function toInt(value: FormDataEntryValue | null, fallback: number): number {
  const n = parseInt(String(value ?? "").replace(/[^0-9]/g, ""), 10);
  return Number.isFinite(n) ? n : fallback;
}

export async function saveServiceOffer(formData: FormData): Promise<void> {
  await requireUser();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) throw new Error("Missing service id");

  const name = String(formData.get("name") ?? "").trim();
  const tagline = String(formData.get("tagline") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();
  const priceLabel = String(formData.get("priceLabel") ?? "").trim() || null;
  const enabled = formData.get("enabled") === "on";

  const settings = {
    keyCuttingPrice: toInt(
      formData.get("keyCuttingPrice"),
      DEFAULT_SETTINGS.keyCuttingPrice
    ),
    yangoLegFee: toInt(formData.get("yangoLegFee"), DEFAULT_SETTINGS.yangoLegFee),
    printBw: toInt(formData.get("printBw"), DEFAULT_SETTINGS.printBw),
    printColor: toInt(formData.get("printColor"), DEFAULT_SETTINGS.printColor),
    loanMin: toInt(formData.get("loanMin"), DEFAULT_SETTINGS.loanMin),
    loanRates: DEFAULT_SETTINGS.loanRates
  };

  await prisma.serviceOffer.update({
    where: { id },
    data: {
      name,
      tagline,
      description,
      imageUrl,
      priceLabel,
      enabled,
      settings: JSON.stringify(settings)
    }
  });

  revalidatePath("/services");
  revalidatePath("/admin/service-pages");
  revalidatePath("/");
  redirect("/admin/service-pages");
}
