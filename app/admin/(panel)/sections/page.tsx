import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { sectionGroups, sections } from "@/lib/sections/registry";
import { AdminHeader, Badge } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Sections" };

const dateFormat = new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric" });

export default async function SectionsPage() {
  const stored = await prisma.siteSection.findMany({ select: { key: true, updatedAt: true } });
  const updated = new Map(stored.map((s) => [s.key, s.updatedAt]));
  const entries = Object.entries(sections);

  return (
    <>
      <AdminHeader
        eyebrow="Site"
        title="Sections"
        description="Every block of copy on the site. Sections you haven’t edited show their original content."
      />
      <div className="flex flex-col gap-10">
        {sectionGroups.map((group) => (
          <section key={group}>
            <h2 className="mb-3 font-grotesk text-[11px] uppercase tracking-[0.25em] text-muted">{group}</h2>
            <ul className="grid gap-3 md:grid-cols-2">
              {entries
                .filter(([, def]) => def.group === group)
                .map(([key, def]) => {
                  const at = updated.get(key);
                  return (
                    <li key={key}>
                      <Link
                        href={`/admin/sections/${key}`}
                        className="group flex h-full flex-col rounded-xl border border-white/10 bg-surface p-4 transition-colors hover:border-volt/50"
                      >
                        <span className="flex items-center justify-between gap-3">
                          <span className="font-medium text-foreground group-hover:text-accent">{def.label}</span>
                          {at ? <Badge tone="accent">Edited {dateFormat.format(at)}</Badge> : <Badge>Original</Badge>}
                        </span>
                        <span className="mt-1.5 text-sm leading-relaxed text-muted">{def.description}</span>
                      </Link>
                    </li>
                  );
                })}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
