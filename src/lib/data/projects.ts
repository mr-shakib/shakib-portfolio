import "server-only";
import { cache } from "react";
import { features } from "@/lib/env";
import { projectSchema, type ProjectDTO } from "@/lib/validations/content";
import { projectsContent } from "@/content/projects";

/**
 * Returns published projects. Uses the database when configured, otherwise the
 * static content fallback — so the site runs with zero infrastructure in dev.
 * `cache` dedupes calls within a single request.
 */
export const getProjects = cache(async (): Promise<ProjectDTO[]> => {
  if (!features.database) {
    return [...projectsContent].sort((a, b) => a.order - b.order);
  }
  const { prisma } = await import("@/lib/prisma");
  const rows = await prisma.project.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { order: "asc" },
  });
  return rows.map((r) => projectSchema.parse(r));
});

export const getFeaturedProjects = cache(async (): Promise<ProjectDTO[]> => {
  const all = await getProjects();
  return all.filter((p) => p.featured);
});

export const getProjectBySlug = cache(async (slug: string): Promise<ProjectDTO | null> => {
  const all = await getProjects();
  return all.find((p) => p.slug === slug) ?? null;
});
