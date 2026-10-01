import "server-only";
import { cache } from "react";
import type { z } from "zod";
import { features } from "@/lib/env";
import { cachedQuery } from "@/lib/data/cache";
import { schemaFor } from "@/lib/admin/fields";
import { sections, type SectionContent, type SectionKey } from "@/lib/sections/registry";

/** Every stored section in one query, keyed by section id. */
const getStoredSections = cache(async (): Promise<Record<string, unknown>> => {
  const rows = await cachedQuery("sections", async () => {
    const { prisma } = await import("@/lib/prisma");
    return prisma.siteSection.findMany({ select: { key: true, data: true } });
  })();
  return Object.fromEntries(rows.map((r) => [r.key, r.data]));
});

/**
 * A section's content: the saved version from the database, or its built-in
 * defaults. Stored data is merged over the defaults, so fields added to the
 * registry later show their default until edited.
 */
export const getSection = cache(async <K extends SectionKey>(key: K): Promise<SectionContent<K>> => {
  const def = sections[key];
  const defaults = def.defaults as SectionContent<K>;
  if (!features.database) return defaults;

  const stored = (await getStoredSections())[key];
  if (!stored || typeof stored !== "object") return defaults;

  // TS can't narrow `sections[K]` per key, so the generic schema is retyped here.
  const schema = schemaFor(def.fields) as unknown as z.ZodType<SectionContent<K>>;
  const parsed = schema.safeParse({ ...defaults, ...stored });
  if (parsed.success) return parsed.data;
  console.warn(`Section "${key}" failed validation — showing defaults.`, parsed.error.flatten());
  return defaults;
});
