import "server-only";
import { cache } from "react";
import { features } from "@/lib/env";
import { publicationSchema, type PublicationDTO } from "@/lib/validations/content";
import { publicationsContent } from "@/content/publications";

export const getPublications = cache(async (): Promise<PublicationDTO[]> => {
  if (!features.database) {
    return [...publicationsContent].sort(
      (a, b) => b.publishedDate.getTime() - a.publishedDate.getTime(),
    );
  }
  const { prisma } = await import("@/lib/prisma");
  const rows = await prisma.publication.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedDate: "desc" },
  });
  return rows.map((r) => publicationSchema.parse(r));
});

export const getFeaturedPublication = cache(async (): Promise<PublicationDTO | null> => {
  const all = await getPublications();
  return all.find((p) => p.featured) ?? all[0] ?? null;
});

export const getPublicationBySlug = cache(
  async (slug: string): Promise<PublicationDTO | null> => {
    const all = await getPublications();
    return all.find((p) => p.slug === slug) ?? null;
  },
);
