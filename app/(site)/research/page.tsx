import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/shared/Section";
import { ResearchToc, type TocItem } from "@/components/research/ResearchToc";
import { ResearchSection } from "@/components/research/ResearchSection";
import { ReferenceItem } from "@/components/research/ReferenceItem";
import { getResearchAreas, getResearchEntries } from "@/lib/data/research";
import { getPublications } from "@/lib/data/publications";
import { researchStatement, researchMeta } from "@/content/research";
import { buildMetadata } from "@/lib/seo/metadata";
import type { ResearchEntryDTO } from "@/lib/validations/content";

export const metadata: Metadata = buildMetadata({
  title: "Research",
  description:
    "Research statement, interests, current and past work, datasets, future directions and collaboration opportunities of Shakib Howlader.",
  path: "/research",
});

export const revalidate = 3600;

const toc: TocItem[] = [
  { id: "interests", index: "01", label: "Research Interests" },
  { id: "current", index: "02", label: "Current Work" },
  { id: "publications", index: "03", label: "Selected Publications" },
  { id: "datasets", index: "04", label: "Datasets" },
  { id: "past", index: "05", label: "Past Work" },
  { id: "future", index: "06", label: "Future Directions" },
  { id: "collaboration", index: "07", label: "Collaboration" },
];

/** Academic prose entry: a hanging label + body, hairline-separated. */
function EntryRows({ entries }: { entries: ResearchEntryDTO[] }) {
  return (
    <div className="flex flex-col">
      {entries.map((entry) => (
        <article
          key={entry.id}
          className="grid gap-3 border-b border-border py-6 last:border-0 md:grid-cols-[1fr_2fr] md:gap-10"
        >
          <h3 className="font-display text-lg leading-snug text-foreground">{entry.title}</h3>
          <div>
            <p className="leading-relaxed text-muted">{entry.body}</p>
            {entry.links && entry.links.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-4">
                {entry.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="font-mono text-sm text-accent underline-offset-4 hover:underline"
                  >
                    {link.label} →
                  </Link>
                ))}
              </div>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}

export default async function ResearchPage() {
  const [areas, entries, publications] = await Promise.all([
    getResearchAreas(),
    getResearchEntries(),
    getPublications(),
  ]);

  const byType = (t: ResearchEntryDTO["type"]) => entries.filter((e) => e.type === t);
  const interests = byType("INTEREST");
  const current = byType("CURRENT");
  const past = byType("PAST");
  const future = byType("FUTURE");
  const collaboration = byType("COLLABORATION");

  return (
    <>
      {/* Title block */}
      <header className="container-content pb-12 pt-40">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
          Research Profile
        </span>
        <h1 className="mt-5 max-w-4xl font-display text-display-lg font-semibold leading-[0.9] text-foreground">
          Research statement &amp; programme
        </h1>
      </header>

      {/* Abstract */}
      <Section className="pt-0">
        <div className="grid gap-10 border-y border-border py-10 lg:grid-cols-[1fr_2.4fr] lg:gap-16">
          <div className="flex flex-col gap-4">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted/60">
              Abstract
            </span>
            <dl className="flex flex-col gap-3">
              {researchMeta.map((m) => (
                <div key={m.label} className="flex flex-col">
                  <dt className="font-mono text-[0.7rem] uppercase tracking-wider text-muted/50">
                    {m.label}
                  </dt>
                  <dd className="text-sm text-foreground">{m.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <p className="max-w-prose text-lg leading-relaxed text-muted">{researchStatement}</p>
        </div>
      </Section>

      {/* Body: sticky index + sections */}
      <Section className="pt-0">
        <div className="grid gap-12 lg:grid-cols-[220px_1fr] lg:gap-16">
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <ResearchToc items={toc} />
            </div>
          </aside>

          <div className="flex flex-col gap-16">
            {/* §01 Interests — academic taxonomy */}
            <ResearchSection id="interests" index="01" title="Research Interests" className="border-t-0 pt-0">
              <EntryRows entries={interests} />
              <div className="mt-10">
                <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-muted/60">
                  Areas of focus
                </p>
                <ol className="grid gap-x-10 gap-y-2 sm:grid-cols-2">
                  {areas.map((area, i) => (
                    <li
                      key={area.id}
                      className="flex items-baseline gap-3 border-b border-border py-3"
                    >
                      <span className="font-mono text-xs text-accent">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <span className="text-foreground">{area.title}</span>
                        <p className="mt-0.5 text-sm leading-relaxed text-muted/70">
                          {area.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </ResearchSection>

            {/* §02 Current */}
            <ResearchSection id="current" index="02" title="Current Work">
              <EntryRows entries={current} />
            </ResearchSection>

            {/* §03 Publications — reference style */}
            <ResearchSection id="publications" index="03" title="Selected Publications">
              {publications.length > 0 ? (
                <ol className="flex flex-col gap-8">
                  {publications.map((pub, i) => (
                    <ReferenceItem key={pub.id} publication={pub} index={i + 1} />
                  ))}
                </ol>
              ) : (
                <p className="text-muted">Publications forthcoming.</p>
              )}
              <Link
                href="/publications"
                className="mt-8 inline-block font-mono text-sm text-accent underline-offset-4 hover:underline"
              >
                View all publications →
              </Link>
            </ResearchSection>

            {/* §04 Datasets */}
            <ResearchSection id="datasets" index="04" title="Datasets">
              <EntryRows entries={byType("DATASET")} />
            </ResearchSection>

            {/* §05 Past */}
            <ResearchSection id="past" index="05" title="Past Work">
              <EntryRows entries={past} />
            </ResearchSection>

            {/* §06 Future */}
            <ResearchSection id="future" index="06" title="Future Directions">
              <EntryRows entries={future} />
            </ResearchSection>

            {/* §07 Collaboration */}
            <ResearchSection id="collaboration" index="07" title="Collaboration">
              <EntryRows entries={collaboration} />
              <div className="mt-8 rounded-2xl border border-accent/30 bg-accent-soft/30 p-8">
                <p className="max-w-prose leading-relaxed text-foreground">
                  I am actively seeking MSc supervision and research collaborations in computer
                  vision, agricultural AI and healthcare AI.
                </p>
                <Link
                  href="/contact"
                  className="mt-5 inline-flex h-11 items-center rounded-full bg-foreground px-6 text-sm font-medium text-background transition-colors hover:bg-accent"
                >
                  Get in touch →
                </Link>
              </div>
            </ResearchSection>
          </div>
        </div>
      </Section>
    </>
  );
}
