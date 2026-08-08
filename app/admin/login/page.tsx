import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin sign in" };

/** Desk login now lives on the unified Profile auth screen. */
export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect("/admin");
  redirect("/profile");
}
