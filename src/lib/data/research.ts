import "server-only";
import { cache } from "react";
import { features } from "@/lib/env";
import { cachedQuery } from "@/lib/data/cache";
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
  const rows = await cachedQuery("research-areas", async () => {
    const { prisma } = await import("@/lib/prisma");
    return prisma.researchArea.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
  })();
  return rows.map((r) => researchAreaSchema.parse(r));
});

export const getResearchEntries = cache(async (): Promise<ResearchEntryDTO[]> => {
  if (!features.database) {
    return [...researchEntriesContent].sort((a, b) => a.order - b.order);
  }
  const rows = await cachedQuery("research-entries", async () => {
    const { prisma } = await import("@/lib/prisma");
    return prisma.researchEntry.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
  })();
  return rows.map((r) =>
    researchEntrySchema.parse({
      ...r,
      links: r.links ?? null,
    }),
  );
});
