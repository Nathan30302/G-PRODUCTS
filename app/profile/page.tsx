import type { Metadata } from "next";
import { getCustomerSession } from "@/lib/customer-auth";
import { getSession } from "@/lib/auth";
import { ProfileHub } from "@/components/profile/ProfileViews";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Profile",
  description: "Sign in as a customer or open the Provider desk."
};

export default async function ProfilePage() {
  const [customer, provider] = await Promise.all([
    getCustomerSession(),
    getSession()
  ]);

  return <ProfileHub customer={customer} provider={provider} />;
}
