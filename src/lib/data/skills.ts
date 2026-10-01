import "server-only";
import { cache } from "react";
import { features } from "@/lib/env";
import { cachedQuery } from "@/lib/data/cache";
import { skillSchema, type SkillDTO } from "@/lib/validations/content";
import { skillsContent } from "@/content/skills";

export const getSkills = cache(async (): Promise<SkillDTO[]> => {
  if (!features.database) return skillsContent;
  const rows = await cachedQuery("skills", async () => {
    const { prisma } = await import("@/lib/prisma");
    return prisma.skill.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
  })();
  return rows.map((r) => skillSchema.parse(r));
});
