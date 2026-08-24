"use server";

import { redirect } from "next/navigation";
import { destroySession } from "@/lib/auth";
import { destroyCustomerSession } from "@/lib/customer-auth";

export async function logoutAction(): Promise<void> {
  await Promise.all([
    destroySession().catch(() => undefined),
    destroyCustomerSession().catch(() => undefined)
  ]);
  redirect("/profile");
}
