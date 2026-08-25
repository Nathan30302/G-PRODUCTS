"use server";

import { redirect } from "next/navigation";
import {
  verifyPassword,
  createSession,
  OWNER_ONLY_DESK_MESSAGE
} from "@/lib/auth";
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
  if (!user || user.role !== "OWNER") {
    return {
      error: user?.role === "STAFF" ? OWNER_ONLY_DESK_MESSAGE : "Invalid email or password."
    };
  }
  if (!(await verifyPassword(password, user.passwordHash))) {
    return { error: "Invalid email or password." };
  }

  await createSession({
    id: user.id,
    email: user.email,
    name: user.name,
    role: "OWNER"
  });

  redirect("/admin");
}
