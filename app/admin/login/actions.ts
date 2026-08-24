"use server";

import { redirect } from "next/navigation";
import { verifyPassword, createSession } from "@/lib/auth";
import { findDeskUserByIdentifier } from "@/lib/user-lookup";

export type LoginState = { error?: string };

export async function loginAction(
  _prev: LoginState | undefined,
  formData: FormData
): Promise<LoginState> {
  const identifier = String(
    formData.get("email") ?? formData.get("identifier") ?? ""
  ).trim();
  const password = String(formData.get("password") ?? "");

  if (!identifier || !password) {
    return { error: "Please enter your email or phone, and password." };
  }

  const user = await findDeskUserByIdentifier(identifier);
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return { error: "Invalid email or password." };
  }

  await createSession({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  });

  redirect("/admin");
}
