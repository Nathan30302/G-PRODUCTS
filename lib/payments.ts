import "server-only";

export type PaymentProvider = "mtn" | "airtel" | "zamtel";
export type PayStatus = "PENDING" | "SUCCESS" | "FAILED";

export type InitiateInput = {
  provider: PaymentProvider;
  amount: number; // ZMW
  phone: string; // customer MSISDN
  orderRef: string;
  description: string;
};

export type InitiateResult = {
  ok: boolean;
  mode: "live" | "manual";
  reference?: string;
  status: PayStatus;
  message?: string;
};

export type StatusResult = { status: PayStatus; message?: string };

function env(name: string): string {
  return process.env[name]?.trim() ?? "";
}

/** Normalise a Zambian number to msisdn without +, e.g. 260971234567 */
function normalizeMsisdn(phone: string): string {
  let p = phone.replace(/[^0-9]/g, "");
  if (p.startsWith("0")) p = "26" + p; // 097... -> 2609...  (260 + 9...)
  if (p.startsWith("9") || p.startsWith("7")) p = "260" + p;
  return p;
}

// ----------------------------- MTN MoMo -----------------------------

function mtnConfigured(): boolean {
  return Boolean(
    env("MTN_MOMO_SUBSCRIPTION_KEY") &&
      env("MTN_MOMO_API_USER") &&
      env("MTN_MOMO_API_KEY")
  );
}

async function mtnToken(): Promise<string> {
  const base = env("MTN_MOMO_BASE_URL");
  const basic = Buffer.from(
    `${env("MTN_MOMO_API_USER")}:${env("MTN_MOMO_API_KEY")}`
  ).toString("base64");
  const res = await fetch(`${base}/collection/token/`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Ocp-Apim-Subscription-Key": env("MTN_MOMO_SUBSCRIPTION_KEY")
    },
    cache: "no-store"
  });
  if (!res.ok) throw new Error(`MTN token failed: ${res.status}`);
  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

async function mtnInitiate(input: InitiateInput): Promise<InitiateResult> {
  const base = env("MTN_MOMO_BASE_URL");
  const reference = crypto.randomUUID();
  const token = await mtnToken();
  const res = await fetch(`${base}/collection/v1_0/requesttopay`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Reference-Id": reference,
      "X-Target-Environment": env("MTN_MOMO_ENV") || "sandbox",
      "Ocp-Apim-Subscription-Key": env("MTN_MOMO_SUBSCRIPTION_KEY"),
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      amount: String(input.amount),
      currency: env("MTN_MOMO_CURRENCY") || "EUR",
      externalId: input.orderRef,
      payer: { partyIdType: "MSISDN", partyId: normalizeMsisdn(input.phone) },
      payerMessage: input.description,
      payeeNote: input.orderRef
    }),
    cache: "no-store"
  });
  if (res.status !== 202) {
    const text = await res.text();
    throw new Error(`MTN requesttopay failed: ${res.status} ${text}`);
  }
  return { ok: true, mode: "live", reference, status: "PENDING" };
}

async function mtnStatus(reference: string): Promise<StatusResult> {
  const base = env("MTN_MOMO_BASE_URL");
  const token = await mtnToken();
  const res = await fetch(
    `${base}/collection/v1_0/requesttopay/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Target-Environment": env("MTN_MOMO_ENV") || "sandbox",
        "Ocp-Apim-Subscription-Key": env("MTN_MOMO_SUBSCRIPTION_KEY")
      },
      cache: "no-store"
    }
  );
  if (!res.ok) return { status: "PENDING" };
  const data = (await res.json()) as { status: string; reason?: string };
  if (data.status === "SUCCESSFUL") return { status: "SUCCESS" };
  if (data.status === "FAILED")
    return { status: "FAILED", message: data.reason };
  return { status: "PENDING" };
}

// ----------------------------- Airtel Money -----------------------------

function airtelConfigured(): boolean {
  return Boolean(env("AIRTEL_CLIENT_ID") && env("AIRTEL_CLIENT_SECRET"));
}

async function airtelToken(): Promise<string> {
  const base = env("AIRTEL_BASE_URL");
  const res = await fetch(`${base}/auth/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: env("AIRTEL_CLIENT_ID"),
      client_secret: env("AIRTEL_CLIENT_SECRET"),
      grant_type: "client_credentials"
    }),
    cache: "no-store"
  });
  if (!res.ok) throw new Error(`Airtel token failed: ${res.status}`);
  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

async function airtelInitiate(input: InitiateInput): Promise<InitiateResult> {
  const base = env("AIRTEL_BASE_URL");
  const token = await airtelToken();
  const country = env("AIRTEL_COUNTRY") || "ZM";
  const currency = env("AIRTEL_CURRENCY") || "ZMW";
  const res = await fetch(`${base}/merchant/v1/payments/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Country": country,
      "X-Currency": currency,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      reference: input.orderRef,
      subscriber: {
        country,
        currency,
        msisdn: normalizeMsisdn(input.phone)
      },
      transaction: {
        amount: input.amount,
        country,
        currency,
        id: input.orderRef
      }
    }),
    cache: "no-store"
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Airtel payment failed: ${res.status} ${text}`);
  }
  const data = (await res.json()) as {
    data?: { transaction?: { id?: string } };
  };
  const reference = data?.data?.transaction?.id ?? input.orderRef;
  return { ok: true, mode: "live", reference, status: "PENDING" };
}

async function airtelStatus(reference: string): Promise<StatusResult> {
  const base = env("AIRTEL_BASE_URL");
  const token = await airtelToken();
  const res = await fetch(`${base}/standard/v1/payments/${reference}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Country": env("AIRTEL_COUNTRY") || "ZM",
      "X-Currency": env("AIRTEL_CURRENCY") || "ZMW"
    },
    cache: "no-store"
  });
  if (!res.ok) return { status: "PENDING" };
  const data = (await res.json()) as {
    data?: { transaction?: { status?: string } };
  };
  const status = data?.data?.transaction?.status;
  if (status === "TS" || status === "SUCCESS") return { status: "SUCCESS" };
  if (status === "TF" || status === "FAILED") return { status: "FAILED" };
  return { status: "PENDING" };
}

// ----------------------------- Zamtel (pending API) -----------------------------

function zamtelConfigured(): boolean {
  return Boolean(env("ZAMTEL_BASE_URL") && env("ZAMTEL_API_KEY"));
}

// ----------------------------- Public API -----------------------------

export function isConfigured(provider: PaymentProvider): boolean {
  if (provider === "mtn") return mtnConfigured();
  if (provider === "airtel") return airtelConfigured();
  return zamtelConfigured();
}

/**
 * Initiate a payment. If the provider has no credentials configured, we fall
 * back to "manual" mode: the order is recorded and confirmed over WhatsApp.
 */
export async function initiatePayment(
  input: InitiateInput
): Promise<InitiateResult> {
  try {
    if (input.provider === "mtn" && mtnConfigured())
      return await mtnInitiate(input);
    if (input.provider === "airtel" && airtelConfigured())
      return await airtelInitiate(input);
    // zamtel or unconfigured -> manual
    return {
      ok: true,
      mode: "manual",
      status: "PENDING",
      message: "Awaiting manual confirmation"
    };
  } catch (err) {
    return {
      ok: false,
      mode: "manual",
      status: "PENDING",
      message: err instanceof Error ? err.message : "Payment init failed"
    };
  }
}

export async function getPaymentStatus(
  provider: PaymentProvider,
  reference: string
): Promise<StatusResult> {
  try {
    if (provider === "mtn" && mtnConfigured()) return await mtnStatus(reference);
    if (provider === "airtel" && airtelConfigured())
      return await airtelStatus(reference);
    return { status: "PENDING" };
  } catch {
    return { status: "PENDING" };
  }
}
