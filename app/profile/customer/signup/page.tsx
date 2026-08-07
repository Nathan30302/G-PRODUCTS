import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCustomerSession } from "@/lib/customer-auth";
import { CustomerSignupForm } from "@/components/profile/CustomerAuthForms";
import { siteConfig } from "@/config/site";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Customer sign up",
  description: "Create a G-Products customer account."
};

export default async function CustomerSignupPage() {
  const session = await getCustomerSession();
  if (session) redirect(siteConfig.apps.customer.home);

  return (
    <div className="container-g py-12 sm:py-16">
      <CustomerSignupForm />
    </div>
  );
}
