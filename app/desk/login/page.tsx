import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { LoginForm } from "@/components/admin/LoginForm";
import { siteConfig } from "@/config/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Provider desk · Sign in",
  description: "Sign in to the G-Products provider desk.",
  robots: { index: false, follow: false }
};

export default async function DeskLoginPage() {
  const session = await getSession();
  if (session) redirect(siteConfig.apps.provider.home);
  return <LoginForm />;
}
