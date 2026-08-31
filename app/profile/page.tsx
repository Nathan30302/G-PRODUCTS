import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCustomerSession } from "@/lib/customer-auth";
import { getSession } from "@/lib/auth";
import { AuthPanel } from "@/components/profile/AuthPanel";
import { siteConfig } from "@/config/site";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in or create your G-Products account."
};

export default async function ProfilePage({
  searchParams
}: {
  searchParams?: Promise<{ mode?: string; ref?: string }>;
}) {
  let customer = null;
  let provider = null;
  try {
    [customer, provider] = await Promise.all([
      getCustomerSession(),
      getSession()
    ]);
  } catch (err) {
    console.error("[profile] session read failed:", err);
  }

  if (provider) redirect(siteConfig.apps.provider.home);
  if (customer) redirect(siteConfig.apps.customer.home);

  const params = searchParams ? await searchParams : {};
  const initialMode =
    params.mode === "signup" || params.ref ? "signup" : "signin";
  const initialReferralCode = (params.ref ?? "").trim().toUpperCase();

  return (
    <AuthPanel
      initialMode={initialMode}
      initialReferralCode={initialReferralCode}
    />
  );
}
