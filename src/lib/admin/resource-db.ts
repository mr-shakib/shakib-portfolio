import "server-only";
import { Prisma } from "@prisma/client";
import type { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { issuesToFieldErrors, schemaFor } from "@/lib/admin/fields";
import { resources, type ResourceName, type Row } from "@/lib/admin/resources";

export type SaveResult =
  | { ok: true; id: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

export async function listRows(name: ResourceName): Promise<Row[]> {
  switch (name) {
    case "projects":
      return prisma.project.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
    case "publications":
      return prisma.publication.findMany({ orderBy: { publishedDate: "desc" } });
    case "research-areas":
      return prisma.researchArea.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
    case "research-entries":
      return prisma.researchEntry.findMany({ orderBy: [{ type: "asc" }, { order: "asc" }] });
    case "skills":
      return prisma.skill.findMany({ orderBy: [{ category: "asc" }, { order: "asc" }] });
  }
}

export async function getRow(name: ResourceName, id: string): Promise<Row | null> {
  switch (name) {
    case "projects":
      return prisma.project.findUnique({ where: { id } });
    case "publications":
      return prisma.publication.findUnique({ where: { id } });
    case "research-areas":
      return prisma.researchArea.findUnique({ where: { id } });
    case "research-entries":
      return prisma.researchEntry.findUnique({ where: { id } });
    case "skills":
      return prisma.skill.findUnique({ where: { id } });
  }
}

/** Validate form values and create (id = null) or update a row. */
export async function saveRow(name: ResourceName, id: string | null, input: unknown): Promise<SaveResult> {
  try {
    switch (name) {
      case "projects": {
        const p = schemaFor(resources.projects.fields).safeParse(input);
        if (!p.success) return invalid(p.error);
        const row = id
          ? await prisma.project.update({ where: { id }, data: p.data })
          : await prisma.project.create({ data: p.data });
        return { ok: true, id: row.id };
      }
      case "publications": {
        const p = schemaFor(resources.publications.fields).safeParse(input);
        if (!p.success) return invalid(p.error);
        const row = id
          ? await prisma.publication.update({ where: { id }, data: p.data })
          : await prisma.publication.create({ data: p.data });
        return { ok: true, id: row.id };
      }
      case "research-areas": {
        const p = schemaFor(resources["research-areas"].fields).safeParse(input);
        if (!p.success) return invalid(p.error);
        const row = id
          ? await prisma.researchArea.update({ where: { id }, data: p.data })
          : await prisma.researchArea.create({ data: p.data });
        return { ok: true, id: row.id };
      }
      case "research-entries": {
        const p = schemaFor(resources["research-entries"].fields).safeParse(input);
        if (!p.success) return invalid(p.error);
        const row = id
          ? await prisma.researchEntry.update({ where: { id }, data: p.data })
          : await prisma.researchEntry.create({ data: p.data });
        return { ok: true, id: row.id };
      }
      case "skills": {
        const p = schemaFor(resources.skills.fields).safeParse(input);
        if (!p.success) return invalid(p.error);
        const row = id
          ? await prisma.skill.update({ where: { id }, data: p.data })
          : await prisma.skill.create({ data: p.data });
        return { ok: true, id: row.id };
      }
    }
  } catch (error) {
    return knownError(error);
  }
}

export async function deleteRow(name: ResourceName, id: string): Promise<void> {
  switch (name) {
    case "projects":
      await prisma.project.delete({ where: { id } });
      return;
    case "publications":
      await prisma.publication.delete({ where: { id } });
      return;
    case "research-areas":
      await prisma.researchArea.delete({ where: { id } });
      return;
    case "research-entries":
      await prisma.researchEntry.delete({ where: { id } });
      return;
    case "skills":
      await prisma.skill.delete({ where: { id } });
      return;
  }
}

function invalid(error: ZodError): SaveResult {
  return { ok: false, error: "Please fix the highlighted fields.", fieldErrors: issuesToFieldErrors(error) };
}

function knownError(error: unknown): SaveResult {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      const target = error.meta?.target;
      const field = (Array.isArray(target) ? target[0] : String(target ?? "")) as string;
      return {
        ok: false,
        error: `Another item already uses this ${field || "value"}.`,
        fieldErrors: field ? { [field]: "Already in use" } : undefined,
      };
    }
    if (error.code === "P2025") return { ok: false, error: "This item no longer exists." };
  }
  throw error;
}
