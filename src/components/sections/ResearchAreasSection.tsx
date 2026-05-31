import { Section } from "@/components/shared/Section";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { Button } from "@/components/ui/Button";
import type { ResearchAreaDTO } from "@/lib/validations/content";

export function ResearchAreasSection({ areas }: { areas: ResearchAreaDTO[] }) {
  return (
    <Section id="research-areas">
      {/* Academic-style section header */}
      <div className="flex flex-col gap-6 border-b border-border pb-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
            Research Areas
          </span>
          <h2 className="mt-4 font-display text-display-md font-semibold leading-[0.95] text-foreground">
            Fields of inquiry.
          </h2>
          <p className="mt-4 max-w-prose leading-relaxed text-muted">
            Intersecting domains where I focus my research — from the methods of machine learning to
            their application in agriculture and healthcare.
          </p>
        </div>
        <Button href="/research" variant="link" className="shrink-0">
          Full research profile →
        </Button>
      </div>

      {/* Numbered index list — reads like a paper's taxonomy */}
      <ol className="mt-4">
        {areas.map((area, i) => (
          <RevealOnScroll key={area.id} delay={i * 0.04}>
            <li className="group grid grid-cols-[auto_1fr] items-baseline gap-x-6 gap-y-1 border-b border-border py-7 transition-colors hover:bg-surface/40 md:grid-cols-[auto_minmax(0,1fr)_minmax(0,1.4fr)] md:gap-x-10">
              <span className="font-mono text-sm text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display text-2xl text-foreground transition-colors group-hover:text-accent">
                {area.title}
              </h3>
              <p className="col-start-2 max-w-prose text-sm leading-relaxed text-muted md:col-start-3 md:text-base">
                {area.description}
              </p>
            </li>
          </RevealOnScroll>
        ))}
      </ol>
    </Section>
  );
}
