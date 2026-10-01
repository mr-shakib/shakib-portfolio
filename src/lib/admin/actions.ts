"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin, createSession, destroySession } from "@/lib/auth/session";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { CONTENT_TAG } from "@/lib/data/cache";
import { issuesToFieldErrors, schemaFor } from "@/lib/admin/fields";
import { isSectionKey, sections } from "@/lib/sections/registry";
import { isResourceName } from "@/lib/admin/resources";
import { deleteRow, saveRow } from "@/lib/admin/resource-db";
import { seedEmptyTables } from "@/lib/admin/seed-content";

/**
 * Every admin mutation. Each one re-checks the session (server actions are
 * public endpoints), validates its input, and clears the content cache so the
 * change is live on the next page view.
 */

export type ActionResult =
  | { ok: true; message?: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

const idSchema = z.string().min(1).max(100);

function contentChanged() {
  revalidateTag(CONTENT_TAG);
  revalidatePath("/", "layout");
}

// ── Sections ──────────────────────────────────────────────────────────────

export async function saveSection(key: string, values: unknown): Promise<ActionResult> {
  await requireAdmin();
  if (!isSectionKey(key)) return { ok: false, error: "Unknown section." };

  const parsed = schemaFor(sections[key].fields).safeParse(values);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: issuesToFieldErrors(parsed.error),
    };
  }
  const data = parsed.data as Prisma.InputJsonValue;
  await prisma.siteSection.upsert({ where: { key }, create: { key, data }, update: { data } });
  contentChanged();
  return { ok: true, message: "Saved — it’s live on the site." };
}

export async function resetSection(key: string): Promise<ActionResult> {
  await requireAdmin();
  if (!isSectionKey(key)) return { ok: false, error: "Unknown section." };
  await prisma.siteSection.deleteMany({ where: { key } });
  contentChanged();
  return { ok: true, message: "Restored the original content." };
}

// ── Collections ───────────────────────────────────────────────────────────

export async function saveResource(
  name: string,
  id: string | null,
  values: unknown,
): Promise<ActionResult> {
  await requireAdmin();
  if (!isResourceName(name) || (id !== null && !idSchema.safeParse(id).success)) {
    return { ok: false, error: "Unknown item." };
  }

  const result = await saveRow(name, id, values);
  if (!result.ok) return result;
  contentChanged();
  if (!id) redirect(`/admin/${name}/${result.id}?created=1`);
  return { ok: true, message: "Saved — it’s live on the site." };
}

export async function deleteResource(name: string, id: string): Promise<void> {
  await requireAdmin();
  if (!isResourceName(name) || !idSchema.safeParse(id).success) return;
  await deleteRow(name, id);
  contentChanged();
  redirect(`/admin/${name}`);
}

export async function importDefaultContent(): Promise<ActionResult> {
  await requireAdmin();
  const imported = await seedEmptyTables(prisma);
  contentChanged();
  const summary = Object.entries(imported)
    .map(([table, count]) => `${count} ${table}`)
    .join(", ");
  return { ok: true, message: summary ? `Imported ${summary}.` : "Every table already has content." };
}

// ── Messages ──────────────────────────────────────────────────────────────

const messageStatusSchema = z.enum(["UNREAD", "READ", "ARCHIVED"]);

export async function setMessageStatus(id: string, status: string): Promise<void> {
  await requireAdmin();
  const parsedId = idSchema.safeParse(id);
  const parsedStatus = messageStatusSchema.safeParse(status);
  if (!parsedId.success || !parsedStatus.success) return;
  await prisma.contactMessage.updateMany({
    where: { id: parsedId.data },
    data: { status: parsedStatus.data },
  });
  revalidatePath("/admin", "layout");
}

export async function deleteMessage(id: string): Promise<void> {
  await requireAdmin();
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) return;
  await prisma.contactMessage.deleteMany({ where: { id: parsedId.data } });
  revalidatePath("/admin", "layout");
}

// ── Account ───────────────────────────────────────────────────────────────

const passwordSchema = z
  .object({
    current: z.string().min(1, "Required"),
    next: z.string().min(10, "Use at least 10 characters").max(200),
    confirm: z.string(),
  })
  .refine((v) => v.next === v.confirm, { path: ["confirm"], message: "Passwords don’t match" });

export async function changePassword(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const admin = await requireAdmin();
  const parsed = passwordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, error: "Please fix the highlighted fields.", fieldErrors: issuesToFieldErrors(parsed.error) };
  }

  const user = await prisma.user.findUniqueOrThrow({ where: { id: admin.id } });
  if (!(await verifyPassword(parsed.data.current, user.passwordHash))) {
    return { ok: false, error: "Your current password is incorrect.", fieldErrors: { current: "Incorrect password" } };
  }

  // Bumping the session version signs out every other browser.
  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await hashPassword(parsed.data.next), sessionVersion: { increment: 1 } },
  });
  await createSession(updated);
  return { ok: true, message: "Password changed. Any other signed-in browsers were signed out." };
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}
