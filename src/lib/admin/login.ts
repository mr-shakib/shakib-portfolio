"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { env, features } from "@/lib/env";
import { checkRateLimit, clientIp, hashIp } from "@/lib/rate-limit";
import { createSession } from "@/lib/auth/session";
import { hashPassword, safeEqual, verifyPassword } from "@/lib/auth/password";

export interface LoginState {
  error?: string;
  /** Echoed back so the field survives React's post-action form reset. */
  email?: string;
}

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1).max(200),
  next: z.string().optional(),
});

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  if (!features.admin) {
    return { error: "The admin panel isn’t configured yet — set DATABASE_URL and AUTH_SECRET." };
  }

  const hdrs = await headers();
  const { success } = checkRateLimit(`login:${await hashIp(clientIp(hdrs))}`, { limit: 5, windowMs: 15 * 60_000 });
  const email = String(formData.get("email") ?? "").slice(0, 200);
  if (!success) return { error: "Too many attempts. Try again in 15 minutes.", email };

  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Enter your email and password.", email };

  const user = await authenticate(parsed.data.email, parsed.data.password);
  if (!user) return { error: "Incorrect email or password.", email };

  await createSession(user);
  const next = parsed.data.next;
  redirect(next?.startsWith("/admin") ? next : "/admin");
}

async function authenticate(email: string, password: string) {
  const { prisma } = await import("@/lib/prisma");
  const user = await prisma.user.findUnique({ where: { email } });
  if (user) return (await verifyPassword(password, user.passwordHash)) ? user : null;

  // First sign-in on a fresh database: ADMIN_EMAIL / ADMIN_PASSWORD create the
  // account. From then on the hashed password in the database is used.
  if ((await prisma.user.count()) > 0) return null;
  if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD || env.ADMIN_PASSWORD.length < 8) return null;
  if (email !== env.ADMIN_EMAIL.toLowerCase() || !safeEqual(password, env.ADMIN_PASSWORD)) return null;
  return prisma.user.create({
    data: { email, passwordHash: await hashPassword(password), name: "Admin" },
  });
}
