import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import {
  DESK_COOKIE,
  DESK_MAX_AGE,
  sessionCookieOptions,
  signDeskToken,
  verifyDeskToken
} from "@/lib/session-cookies";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: "OWNER" | "STAFF";
};

export function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export async function createSession(user: SessionUser): Promise<void> {
  const token = await signDeskToken(user);
  const store = await cookies();
  store.set(DESK_COOKIE, token, sessionCookieOptions(DESK_MAX_AGE));
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.set(DESK_COOKIE, "", { ...sessionCookieOptions(0), maxAge: 0 });
}

export async function getSession(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(DESK_COOKIE)?.value;
  if (!token) return null;
  try {
    return await verifyDeskToken(token);
  } catch {
    return null;
  }
}

export async function requireUser(): Promise<SessionUser> {
  const user = await getSession();
  if (!user) redirect("/profile");
  return user;
}

export async function requireOwner(): Promise<SessionUser> {
  const user = await requireUser();
  if (user.role !== "OWNER") redirect("/admin");
  return user;
}
