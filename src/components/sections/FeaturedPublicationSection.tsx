import { Section } from "@/components/shared/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ImageReveal } from "@/components/shared/ImageReveal";
import { Parallax } from "@/components/shared/Parallax";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CitationActions } from "@/components/publications/CitationActions";
import { formatYear } from "@/lib/utils/format";
import type { PublicationDTO } from "@/lib/validations/content";

export function FeaturedPublicationSection({ publication }: { publication: PublicationDTO | null }) {
  if (!publication) return null;

  return (
    <Section id="featured-publication">
      <SectionHeading eyebrow="Featured Publication" title="Research that contributes." />

      <ImageReveal className="mt-12 rounded-3xl">
        <article className="relative overflow-hidden rounded-3xl border border-border bg-surface p-8 md:p-12">
          <Parallax
            amount={50}
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-radial-accent opacity-40"
          >
            <span className="sr-only">decorative</span>
          </Parallax>

          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="accent">{publication.type}</Badge>
            <span className="text-sm text-muted">{publication.venue}</span>
            <span className="text-sm text-muted">· {formatYear(publication.publishedDate)}</span>
          </div>

          <h3 className="mt-6 max-w-3xl font-display text-display-md leading-tight text-gradient">
            {publication.title}
          </h3>

          <p className="mt-3 text-sm text-muted">{publication.authors.join(", ")}</p>

          <p className="mt-6 max-w-3xl leading-relaxed text-muted">{publication.abstract}</p>

          {publication.impact && (
            <div className="mt-6 rounded-2xl border border-accent/20 bg-accent-soft/30 p-5">
              <p className="text-sm font-medium uppercase tracking-wider text-accent">Impact</p>
              <p className="mt-2 leading-relaxed text-muted">{publication.impact}</p>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-4">
            <CitationActions publication={publication} />
            <Button href={`/publications/${publication.slug}`} variant="secondary" className="self-start">
              Read full publication →
            </Button>
          </div>
        </article>
      </ImageReveal>
    </Section>
  );
}
