import "server-only";
import { cache } from "react";
import { features } from "@/lib/env";
import { achievementSchema, type AchievementDTO } from "@/lib/validations/content";
import { achievementsContent } from "@/content/achievements";

export const getAchievements = cache(async (): Promise<AchievementDTO[]> => {
  if (!features.database) {
    return [...achievementsContent].sort((a, b) => b.date.getTime() - a.date.getTime());
  }
  const { prisma } = await import("@/lib/prisma");
  const rows = await prisma.achievement.findMany({ orderBy: { date: "desc" } });
  return rows.map((r) => achievementSchema.parse(r));
});
