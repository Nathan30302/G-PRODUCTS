import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCustomerSession } from "@/lib/customer-auth";
import { CustomerLoginForm } from "@/components/profile/CustomerAuthForms";
import { siteConfig } from "@/config/site";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Customer log in",
  description: "Log in to your G-Products customer account."
};

export default async function CustomerLoginPage() {
  const session = await getCustomerSession();
  if (session) redirect(siteConfig.apps.customer.home);

  return (
    <div className="container-g py-12 sm:py-16">
      <CustomerLoginForm />
    </div>
  );
}
