import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCustomerSession } from "@/lib/customer-auth";
import { AuthPanel } from "@/components/profile/AuthPanel";
import { AuthScreenShell } from "@/components/profile/AuthScreenShell";
import { siteConfig } from "@/config/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Customer sign in",
  description: "Sign in or create your G-Products shop account.",
  robots: { index: false, follow: false }
};

export default async function CustomerGuardPage({
  searchParams
}: {
  searchParams?: Promise<{ mode?: string; ref?: string }>;
}) {
  const customer = await getCustomerSession().catch(() => null);
  if (customer) redirect(siteConfig.apps.customer.home);

  const params = searchParams ? await searchParams : {};
  const initialMode =
    params.mode === "signup" || params.ref ? "signup" : "signin";
  const initialReferralCode = (params.ref ?? "").trim().toUpperCase();

  return (
    <AuthScreenShell
      tone="customer"
      tagline="Customer"
      headline="Your shop account"
      points={["Track orders", "Saved address", "Faster checkout"]}
    >
      <AuthPanel
        initialMode={initialMode}
        initialReferralCode={initialReferralCode}
      />
    </AuthScreenShell>
  );
}
