import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { env, features } from "@/lib/env";
import { SESSION_COOKIE, SESSION_MAX_AGE, signSession, verifySession } from "@/lib/auth/token";

export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
}

export async function createSession(user: { id: string; sessionVersion: number }) {
  if (!env.AUTH_SECRET) throw new Error("AUTH_SECRET is not set");
  const token = await signSession({ sub: user.id, ver: user.sessionVersion }, env.AUTH_SECRET);
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function destroySession() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}

/**
 * The signed-in admin, or null. Verifies the token signature *and* that the
 * user still exists with the same session version, so deleted accounts and
 * password changes take effect immediately.
 */
export const getAdmin = cache(async (): Promise<AdminUser | null> => {
  if (!features.admin) return null;
  const jar = await cookies();
  const session = await verifySession(jar.get(SESSION_COOKIE)?.value, env.AUTH_SECRET);
  if (!session) return null;

  const { prisma } = await import("@/lib/prisma");
  const user = await prisma.user.findUnique({
    where: { id: session.sub },
    select: { id: true, email: true, name: true, sessionVersion: true },
  });
  if (!user || user.sessionVersion !== session.ver) return null;
  return { id: user.id, email: user.email, name: user.name };
});

/** Gate for admin pages and server actions — redirects to the login page. */
export async function requireAdmin(): Promise<AdminUser> {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
