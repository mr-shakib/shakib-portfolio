import { Section } from "@/components/shared/Section";
import { ImageReveal } from "@/components/shared/ImageReveal";
import { Button } from "@/components/ui/Button";
import { CitationActions } from "@/components/publications/CitationActions";
import { formatYear } from "@/lib/utils/format";
import type { PublicationDTO } from "@/lib/validations/content";

const typeLabels: Record<PublicationDTO["type"], string> = {
  JOURNAL: "Journal Article",
  CONFERENCE: "Conference Paper",
  DATASET: "Dataset",
  PREPRINT: "Preprint",
};

export function FeaturedPublicationSection({ publication }: { publication: PublicationDTO | null }) {
  if (!publication) return null;

  return (
    <Section id="featured-publication">
      <div className="flex items-end justify-between gap-6 border-b border-border pb-8">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
            Featured Publication
          </span>
          <h2 className="mt-4 font-display text-display-md font-semibold leading-[0.95] text-foreground">
            Selected work.
          </h2>
        </div>
        <Button href="/publications" variant="link" className="hidden shrink-0 sm:inline-flex">
          All publications →
        </Button>
      </div>

      <ImageReveal className="mt-12">
        <article className="grid gap-10 lg:grid-cols-[260px_1fr] lg:gap-16">
          {/* Metadata sidebar — paper masthead */}
          <aside className="flex flex-col gap-5 lg:border-r lg:border-border lg:pr-10">
            <dl className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <dt className="font-mono text-[0.7rem] uppercase tracking-wider text-muted/50">
                  Type
                </dt>
                <dd className="text-sm text-foreground">{typeLabels[publication.type]}</dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="font-mono text-[0.7rem] uppercase tracking-wider text-muted/50">
                  Venue
                </dt>
                <dd className="text-sm text-foreground">{publication.venue}</dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="font-mono text-[0.7rem] uppercase tracking-wider text-muted/50">
                  Year
                </dt>
                <dd className="text-sm text-foreground">
                  {formatYear(publication.publishedDate)}
                </dd>
              </div>
              {publication.doi && (
                <div className="flex flex-col gap-1">
                  <dt className="font-mono text-[0.7rem] uppercase tracking-wider text-muted/50">
                    DOI
                  </dt>
                  <dd className="break-all font-mono text-xs text-muted">{publication.doi}</dd>
                </div>
              )}
            </dl>

            {publication.keywords.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[0.7rem] uppercase tracking-wider text-muted/50">
                  Keywords
                </span>
                <ul className="flex flex-wrap gap-x-3 gap-y-1">
                  {publication.keywords.slice(0, 6).map((k) => (
                    <li key={k} className="font-mono text-xs text-muted/80">
                      {k}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>

          {/* Main column — title, authors, abstract */}
          <div className="flex flex-col">
            <h3 className="max-w-3xl font-display text-3xl font-semibold leading-tight text-foreground md:text-4xl">
              {publication.title}
            </h3>
            <p className="mt-4 text-muted">{publication.authors.join(", ")}</p>

            <div className="mt-8">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted/60">
                Abstract
              </span>
              <p className="mt-3 max-w-prose leading-relaxed text-muted">{publication.abstract}</p>
            </div>

            {publication.impact && (
              <div className="mt-6 border-l-2 border-accent pl-5">
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
                  Impact
                </span>
                <p className="mt-2 max-w-prose leading-relaxed text-muted">{publication.impact}</p>
              </div>
            )}

            <div className="mt-8 flex flex-col gap-4">
              <CitationActions publication={publication} />
              <Button
                href={`/publications/${publication.slug}`}
                variant="secondary"
                className="self-start"
              >
                Read full publication →
              </Button>
            </div>
          </div>
        </article>
      </ImageReveal>
    </Section>
  );
}
