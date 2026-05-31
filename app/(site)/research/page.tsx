import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { Section } from "@/components/shared/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { getResearchAreas, getResearchEntries } from "@/lib/data/research";
import { buildMetadata } from "@/lib/seo/metadata";
import type { ResearchEntryDTO, ResearchEntryType } from "@/lib/validations/content";

export const metadata: Metadata = buildMetadata({
  title: "Research",
  description:
    "Research interests, current and past work, datasets, future directions and collaboration opportunities of Shakib Howlader.",
  path: "/research",
});

export const revalidate = 3600;

const groups: { type: ResearchEntryType; title: string; eyebrow: string }[] = [
  { type: "INTEREST", title: "Research interests", eyebrow: "Focus" },
  { type: "CURRENT", title: "Current work", eyebrow: "Now" },
  { type: "PAST", title: "Past work", eyebrow: "Foundations" },
  { type: "FUTURE", title: "Future directions", eyebrow: "Next" },
  { type: "DATASET", title: "Datasets", eyebrow: "Open data" },
  { type: "COLLABORATION", title: "Collaboration", eyebrow: "Together" },
];

function EntryList({ entries }: { entries: ResearchEntryDTO[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {entries.map((entry, i) => (
        <RevealOnScroll key={entry.id} delay={i * 0.05}>
          <div className="h-full rounded-2xl border border-border bg-surface p-6">
            <h3 className="font-display text-xl text-foreground">{entry.title}</h3>
            <p className="mt-2 leading-relaxed text-muted">{entry.body}</p>
            {entry.links && entry.links.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-4">
                {entry.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-accent hover:underline"
                  >
                    {link.label} →
                  </Link>
                ))}
              </div>
            )}
          </div>
        </RevealOnScroll>
      ))}
    </div>
  );
}

export default async function ResearchPage() {
  const [areas, entries] = await Promise.all([getResearchAreas(), getResearchEntries()]);

  return (
    <>
      <PageHeader
        eyebrow="Research"
        title="Research interests & direction."
        description="Building robust, trustworthy machine-learning systems for agriculture and healthcare — and the open datasets that make them reproducible."
      />

      <Section>
        <SectionHeading eyebrow="Areas" title="Domains I work across." />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {areas.map((area) => (
            <div key={area.id} className="rounded-2xl border border-border bg-surface p-6">
              <h3 className="font-display text-lg text-foreground">{area.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{area.description}</p>
            </div>
          ))}
        </div>
      </Section>

      {groups.map((group) => {
        const groupEntries = entries.filter((e) => e.type === group.type);
        if (groupEntries.length === 0) return null;
        return (
          <Section key={group.type} className="border-t border-border">
            <SectionHeading eyebrow={group.eyebrow} title={group.title} />
            <div className="mt-10">
              <EntryList entries={groupEntries} />
            </div>
          </Section>
        );
      })}
    </>
  );
}
