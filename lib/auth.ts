import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import {
  CUSTOMER_COOKIE,
  DESK_COOKIE,
  DESK_MAX_AGE,
  clearSessionCookie,
  setSessionCookie,
  signDeskToken,
  verifyDeskToken
} from "@/lib/session-cookies";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: "OWNER" | "STAFF";
};

export const OWNER_ONLY_DESK_MESSAGE =
  "Provider desk sign-in is owner-only. Use your customer account for the shop.";

export function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export async function createSession(user: SessionUser): Promise<void> {
  if (user.role !== "OWNER") {
    throw new Error(OWNER_ONLY_DESK_MESSAGE);
  }
  const token = await signDeskToken(user);
  const store = await cookies();
  clearSessionCookie(store, CUSTOMER_COOKIE);
  setSessionCookie(store, DESK_COOKIE, token, DESK_MAX_AGE);
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  clearSessionCookie(store, DESK_COOKIE);
}

/** Live DB check — only the owner may hold a desk session. */
export async function getSession(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(DESK_COOKIE)?.value;
  if (!token) return null;
  try {
    const payload = await verifyDeskToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: { id: true, email: true, name: true, role: true }
    });
    if (!user || user.role !== "OWNER") return null;
    return user;
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
  return requireUser();
}
