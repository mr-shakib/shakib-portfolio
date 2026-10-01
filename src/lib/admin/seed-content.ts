import type { PrismaClient } from "@prisma/client";
import { projectsContent } from "@/content/projects";
import { publicationsContent } from "@/content/publications";
import { researchAreasContent, researchEntriesContent } from "@/content/research";
import { achievementsContent } from "@/content/achievements";
import { skillsContent } from "@/content/skills";

/**
 * Copy the built-in static content into the database — but only into tables
 * that are still empty, so it can never overwrite edits made in /admin.
 * Shared by `npm run db:seed` and the dashboard's import button, which is why
 * it takes the client as an argument instead of importing the server singleton.
 */
export async function seedEmptyTables(prisma: PrismaClient): Promise<Record<string, number>> {
  const imported: Record<string, number> = {};

  if ((await prisma.project.count()) === 0) {
    const { count } = await prisma.project.createMany({ data: projectsContent });
    imported.projects = count;
  }

  if ((await prisma.publication.count()) === 0) {
    const { count } = await prisma.publication.createMany({ data: publicationsContent });
    imported.publications = count;
  }

  if ((await prisma.researchArea.count()) === 0) {
    const { count } = await prisma.researchArea.createMany({ data: researchAreasContent });
    imported["research areas"] = count;
  }

  if ((await prisma.researchEntry.count()) === 0) {
    const { count } = await prisma.researchEntry.createMany({
      data: researchEntriesContent.map((e) => ({ ...e, links: e.links ?? undefined })),
    });
    imported["research entries"] = count;
  }

  if ((await prisma.skill.count()) === 0) {
    const { count } = await prisma.skill.createMany({
      data: skillsContent.map((s, i) => ({ ...s, order: i + 1 })),
    });
    imported.skills = count;
  }

  if ((await prisma.achievement.count()) === 0) {
    const { count } = await prisma.achievement.createMany({ data: achievementsContent });
    imported.achievements = count;
  }

  return imported;
}
