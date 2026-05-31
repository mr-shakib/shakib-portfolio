import { Section } from "@/components/shared/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { Button } from "@/components/ui/Button";
import type { ResearchAreaDTO } from "@/lib/validations/content";

export function ResearchAreasSection({ areas }: { areas: ResearchAreaDTO[] }) {
  return (
    <Section id="research-areas">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <SectionHeading
          eyebrow="Research Areas"
          title="Where my curiosity concentrates."
          description="Six intersecting domains where I focus my research and engineering."
        />
        <Button href="/research" variant="outline" className="shrink-0">
          Explore research →
        </Button>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {areas.map((area, i) => (
          <RevealOnScroll key={area.id} delay={i * 0.06}>
            <div className="group h-full rounded-2xl border border-border bg-surface p-6 transition-colors duration-300 hover:border-accent/40 hover:bg-surface-elevated">
              <div
                className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-accent/30 text-accent"
                aria-hidden
              >
                <span className="font-display text-lg">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="font-display text-xl text-foreground transition-colors group-hover:text-accent">
                {area.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{area.description}</p>
            </div>
          </RevealOnScroll>
        ))}
      </div>
    </Section>
  );
}
