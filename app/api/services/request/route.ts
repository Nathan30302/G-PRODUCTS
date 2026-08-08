import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/db";
import { initiatePayment, type PaymentProvider } from "@/lib/payments";
import { DEFAULT_SETTINGS, parseSettings } from "@/lib/services";
import { ensureUploadsDir, publicUploadUrl } from "@/lib/uploads";

export const runtime = "nodejs";

const PROVIDERS: PaymentProvider[] = ["mtn", "airtel", "zamtel"];

function newRef(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

async function loadSettings(slug: string) {
  const offer = await prisma.serviceOffer.findUnique({ where: { slug } });
  return offer ? parseSettings(offer.settings) : { ...DEFAULT_SETTINGS };
}

async function saveUploads(files: File[]): Promise<string[]> {
  if (files.length === 0) return [];
  const dir = ensureUploadsDir("services");
  const urls: string[] = [];

  for (const file of files) {
    if (!file || file.size === 0) continue;
    if (file.size > 12 * 1024 * 1024) {
      throw new Error(`File ${file.name} is too large (max 12MB).`);
    }
    const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80);
    const filename = `${Date.now()}-${randomBytes(3).toString("hex")}-${safe}`;
    const buf = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(dir, filename), buf);
    urls.push(publicUploadUrl(`services/${filename}`));
  }
  return urls;
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const serviceType = String(form.get("serviceType") ?? "");
    const customerName = String(form.get("customerName") ?? "").trim();
    const customerPhone = String(form.get("customerPhone") ?? "").trim();
    const deliveryMethod =
      String(form.get("deliveryMethod") ?? "PICKUP") === "YANGO"
        ? "YANGO"
        : "PICKUP";
    const address = String(form.get("address") ?? "").trim() || null;
    const paymentMethod = (String(form.get("paymentMethod") ?? "mtn") ||
      "mtn") as PaymentProvider;
    const detailsRaw = String(form.get("details") ?? "{}");

    if (!customerName || !customerPhone) {
      return NextResponse.json(
        { error: "Name and phone are required." },
        { status: 400 }
      );
    }
    if (deliveryMethod === "YANGO" && !address) {
      return NextResponse.json(
        { error: "Please enter a delivery address for Yango." },
        { status: 400 }
      );
    }

    let details: Record<string, unknown> = {};
    try {
      details = JSON.parse(detailsRaw);
    } catch {
      return NextResponse.json({ error: "Invalid details." }, { status: 400 });
    }

    // ---- G-Loans (request only, no payment) ----
    if (serviceType === "G_LOANS") {
      const settings = await loadSettings("g-loans");
      const amount = Math.round(Number(details.amount) || 0);
      const weeks = Math.round(Number(details.weeks) || 1);
      if (amount < settings.loanMin) {
        return NextResponse.json(
          { error: `Minimum loan amount is K ${settings.loanMin}.` },
          { status: 400 }
        );
      }
      const ref = newRef("GL");
      const request = await prisma.serviceRequest.create({
        data: {
          ref,
          serviceType: "G_LOANS",
          customerName,
          customerPhone,
          deliveryMethod: "PICKUP",
          address: null,
          details: JSON.stringify({
            ...details,
            amount,
            weeks,
            collateral: details.collateral ?? "",
            hasNrc: Boolean(details.hasNrc)
          }),
          amount,
          status: "NEW",
          paymentStatus: null
        }
      });
      return NextResponse.json({
        ref: request.ref,
        mode: "request",
        message: "Loan request received. We'll contact you on WhatsApp."
      });
    }

    // ---- Key cutting ----
    if (serviceType === "KEY_CUTTING") {
      const settings = await loadSettings("key-cutting");
      const keyType = String(details.keyType ?? "household");
      const qty = Math.max(1, Math.round(Number(details.qty) || 1));
      const flow =
        String(details.flow ?? "") === "YANGO_ROUNDTRIP"
          ? "YANGO_ROUNDTRIP"
          : "IN_STORE";
      const cutFee = settings.keyCuttingPrice * qty;
      const yangoToStore =
        flow === "YANGO_ROUNDTRIP" ? settings.yangoLegFee : 0;
      const yangoReturn =
        flow === "YANGO_ROUNDTRIP" ? settings.yangoLegFee : 0;
      const total = cutFee + yangoToStore + yangoReturn;
      const method = flow === "YANGO_ROUNDTRIP" ? "YANGO" : "PICKUP";

      if (flow === "YANGO_ROUNDTRIP" && !address) {
        return NextResponse.json(
          { error: "Please enter your address for Yango pickup and return." },
          { status: 400 }
        );
      }
      if (!PROVIDERS.includes(paymentMethod)) {
        return NextResponse.json(
          { error: "Invalid payment method." },
          { status: 400 }
        );
      }

      const lineItems = [
        {
          name: `Key cutting (${keyType})`,
          price: settings.keyCuttingPrice,
          qty
        },
        ...(flow === "YANGO_ROUNDTRIP"
          ? [
              {
                name: "Yango to G-Products (collect key)",
                price: settings.yangoLegFee,
                qty: 1
              },
              {
                name: "Yango return (original + new key)",
                price: settings.yangoLegFee,
                qty: 1
              }
            ]
          : [])
      ];

      const ref = newRef("KC");
      const order = await prisma.order.create({
        data: {
          ref,
          customerName,
          customerPhone,
          address,
          total,
          status: "PENDING",
          paymentMethod,
          paymentStatus: "PENDING",
          note: `Key cutting · ${keyType} · ${flow}`,
          items: { create: lineItems }
        }
      });

      const payment = await initiatePayment({
        provider: paymentMethod,
        amount: total,
        phone: customerPhone,
        orderRef: ref,
        description: `G-Products key cutting ${ref}`
      });

      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentRef: payment.reference ?? null,
          paymentStatus: payment.status,
          note: payment.message ?? order.note
        }
      });

      await prisma.serviceRequest.create({
        data: {
          ref,
          serviceType: "KEY_CUTTING",
          customerName,
          customerPhone,
          deliveryMethod: method,
          address,
          details: JSON.stringify({
            keyType,
            qty,
            notes: details.notes ?? "",
            flow,
            cutFee,
            yangoToStore,
            yangoReturn
          }),
          amount: total,
          status: "NEW",
          paymentMethod,
          paymentStatus: payment.status,
          paymentRef: payment.reference ?? null,
          orderId: order.id
        }
      });

      return NextResponse.json({
        ref,
        mode: payment.mode,
        paymentStatus: payment.status,
        message: payment.message,
        total
      });
    }

    // ---- Printing ----
    if (serviceType === "PRINTING") {
      const settings = await loadSettings("printing");
      const jobId = String(details.jobId ?? "");
      const menuItem = settings.printMenu?.find((m) => m.id === jobId);
      const pages = Math.max(1, Math.round(Number(details.pages) || 1));
      const copies = Math.max(1, Math.round(Number(details.copies) || 1));
      const unit =
        menuItem?.price ??
        (String(details.colour ?? "bw") === "color"
          ? settings.printColor
          : settings.printBw);
      const jobName =
        menuItem?.name ??
        (String(details.colour ?? "bw") === "color"
          ? "Colour Printing"
          : "Printing (B&W)");
      const total = Math.max(1, Math.round(unit * pages * copies));

      const uploadFiles = form
        .getAll("files")
        .filter((f): f is File => typeof f !== "string" && f instanceof File);
      const fileUrls = await saveUploads(uploadFiles);
      const needsFile = [
        "bw-copy",
        "color-copy",
        "bw-print",
        "color-print",
        "nrc-copy",
        "certificate"
      ].includes(jobId);
      if (needsFile && fileUrls.length === 0) {
        return NextResponse.json(
          { error: "Please upload at least one document." },
          { status: 400 }
        );
      }
      if (!PROVIDERS.includes(paymentMethod)) {
        return NextResponse.json(
          { error: "Invalid payment method." },
          { status: 400 }
        );
      }

      const ref = newRef("PR");
      const order = await prisma.order.create({
        data: {
          ref,
          customerName,
          customerPhone,
          address,
          total,
          status: "PENDING",
          paymentMethod,
          paymentStatus: "PENDING",
          note: `Printing · ${jobName} · ${pages} × ${copies} · ${deliveryMethod}`,
          items: {
            create: [
              {
                name: `${jobName} (${pages} × ${copies})`,
                price: total,
                qty: 1
              }
            ]
          }
        }
      });

      const payment = await initiatePayment({
        provider: paymentMethod,
        amount: total,
        phone: customerPhone,
        orderRef: ref,
        description: `G-Products printing ${ref}`
      });

      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentRef: payment.reference ?? null,
          paymentStatus: payment.status
        }
      });

      await prisma.serviceRequest.create({
        data: {
          ref,
          serviceType: "PRINTING",
          customerName,
          customerPhone,
          deliveryMethod,
          address,
          details: JSON.stringify({
            jobId,
            jobName,
            unitPrice: unit,
            pages,
            copies,
            notes: details.notes ?? ""
          }),
          fileUrls: JSON.stringify(fileUrls),
          amount: total,
          status: "NEW",
          paymentMethod,
          paymentStatus: payment.status,
          paymentRef: payment.reference ?? null,
          orderId: order.id
        }
      });

      return NextResponse.json({
        ref,
        mode: payment.mode,
        paymentStatus: payment.status,
        message: payment.message,
        total,
        files: fileUrls.length
      });
    }

    return NextResponse.json({ error: "Unknown service." }, { status: 400 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Request failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
