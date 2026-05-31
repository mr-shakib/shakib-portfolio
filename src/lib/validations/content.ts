import { z } from "zod";

/**
 * Zod is the single source of truth for content shapes. The DAL validates
 * everything it returns against these schemas, and TS types are inferred from
 * them — so DB models, static fallback content and components never drift.
 */

export const projectCategorySchema = z.enum([
  "WEB",
  "MOBILE",
  "AI_ML",
  "RESEARCH",
  "SYSTEM",
  "OTHER",
]);

export const publicationTypeSchema = z.enum(["JOURNAL", "CONFERENCE", "DATASET", "PREPRINT"]);

export const researchEntryTypeSchema = z.enum([
  "INTEREST",
  "CURRENT",
  "PAST",
  "FUTURE",
  "DATASET",
  "COLLABORATION",
]);

export const achievementTypeSchema = z.enum(["PUBLICATION", "AWARD", "CONTEST", "ACADEMIC"]);

export const projectSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  summary: z.string(),
  description: z.string(),
  category: projectCategorySchema,
  techStack: z.array(z.string()),
  tags: z.array(z.string()),
  githubUrl: z.string().url().nullable().optional(),
  demoUrl: z.string().url().nullable().optional(),
  coverImage: z.string().nullable().optional(),
  screenshots: z.array(z.string()).default([]),
  features: z.array(z.string()).default([]),
  challenges: z.string().nullable().optional(),
  results: z.string().nullable().optional(),
  featured: z.boolean().default(false),
  order: z.number().int().default(0),
});

export const publicationSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  authors: z.array(z.string()),
  venue: z.string(),
  type: publicationTypeSchema,
  doi: z.string().nullable().optional(),
  url: z.string().url().nullable().optional(),
  abstract: z.string(),
  keywords: z.array(z.string()),
  citationCount: z.number().int().nullable().optional(),
  bibtex: z.string().nullable().optional(),
  datasetUrl: z.string().url().nullable().optional(),
  impact: z.string().nullable().optional(),
  featured: z.boolean().default(false),
  publishedDate: z.coerce.date(),
});

export const researchAreaSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  icon: z.string().nullable().optional(),
  order: z.number().int().default(0),
});

export const researchEntrySchema = z.object({
  id: z.string(),
  type: researchEntryTypeSchema,
  title: z.string(),
  body: z.string(),
  links: z.array(z.object({ label: z.string(), href: z.string() })).nullable().optional(),
  icon: z.string().nullable().optional(),
  order: z.number().int().default(0),
});

export const achievementSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  type: achievementTypeSchema,
  date: z.coerce.date(),
  link: z.string().nullable().optional(),
  order: z.number().int().default(0),
});

export const skillSchema = z.object({
  name: z.string(),
  category: z.enum(["Programming", "Frontend", "Backend", "AI/ML", "Research", "Cloud"]),
  level: z.number().min(0).max(100),
  description: z.string().optional(),
});

export const statSchema = z.object({
  label: z.string(),
  value: z.number(),
  suffix: z.string().default(""),
});

export type ProjectDTO = z.infer<typeof projectSchema>;
export type PublicationDTO = z.infer<typeof publicationSchema>;
export type ResearchAreaDTO = z.infer<typeof researchAreaSchema>;
export type ResearchEntryDTO = z.infer<typeof researchEntrySchema>;
export type AchievementDTO = z.infer<typeof achievementSchema>;
export type SkillDTO = z.infer<typeof skillSchema>;
export type StatDTO = z.infer<typeof statSchema>;
export type ProjectCategory = z.infer<typeof projectCategorySchema>;
export type PublicationType = z.infer<typeof publicationTypeSchema>;
export type ResearchEntryType = z.infer<typeof researchEntryTypeSchema>;
export type AchievementType = z.infer<typeof achievementTypeSchema>;
