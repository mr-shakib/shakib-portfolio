import "server-only";
import { cache } from "react";
import { features } from "@/lib/env";
import {
  researchAreaSchema,
  researchEntrySchema,
  type ResearchAreaDTO,
  type ResearchEntryDTO,
} from "@/lib/validations/content";
import { researchAreasContent, researchEntriesContent } from "@/content/research";

export const getResearchAreas = cache(async (): Promise<ResearchAreaDTO[]> => {
  if (!features.database) {
    return [...researchAreasContent].sort((a, b) => a.order - b.order);
  }
  const { prisma } = await import("@/lib/prisma");
  const rows = await prisma.researchArea.findMany({ orderBy: { order: "asc" } });
  return rows.map((r) => researchAreaSchema.parse(r));
});

export const getResearchEntries = cache(async (): Promise<ResearchEntryDTO[]> => {
  if (!features.database) {
    return [...researchEntriesContent].sort((a, b) => a.order - b.order);
  }
  const { prisma } = await import("@/lib/prisma");
  const rows = await prisma.researchEntry.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { order: "asc" },
  });
  return rows.map((r) =>
    researchEntrySchema.parse({
      ...r,
      links: r.links ?? null,
    }),
  );
});
