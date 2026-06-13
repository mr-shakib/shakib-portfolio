import Link from "next/link";
import type { ResearchAreaDTO } from "@/lib/validations/content";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { SplitHeading } from "@/components/shared/SplitHeading";
import { DriftOnScroll } from "@/components/shared/DriftOnScroll";
import { TiltCard } from "@/components/shared/TiltCard";

/**
 * "In the Lab" — the research half of the site's duality. The two heading
 * lines drift in opposite directions as you scroll; cards tilt toward the
 * cursor and invert to volt on hover.
 */
export function LabSection({ areas }: { areas: ResearchAreaDTO[] }) {
  return (
    <section
      id="research-areas"
      className="overflow-hidden border-b border-border bg-background py-section"
    >
      <div className="container-content">
        <RevealOnScroll>
          <p className="font-grotesk text-[11px] uppercase tracking-[0.35em] text-accent">
            01 — Research
          </p>
        </RevealOnScroll>
        <div className="mt-4">
          <DriftOnScroll x={60}>
            <SplitHeading
              as="h2"
              lines={[{ text: "In the" }]}
              lineClassName="text-display-xl text-foreground leading-[0.88]"
            />
          </DriftOnScroll>
          <DriftOnScroll x={-60}>
            <SplitHeading
              as="h3"
              lines={[{ text: "Lab", outline: true }]}
              lineClassName="text-display-xl leading-[0.88]"
              delay={0.1}
            />
          </DriftOnScroll>
        </div>

        <div className="mt-10 flex flex-wrap items-end justify-between gap-6">
          <RevealOnScroll delay={0.1}>
            <p className="max-w-lg text-sm leading-relaxed text-muted md:text-base">
              Computer vision and machine learning for high-stakes, data-scarce domains.
              Robust models, honest evaluation, and datasets released in the open.
            </p>
          </RevealOnScroll>
          <RevealOnScroll delay={0.15}>
            <Link
              href="/research"
              className="btn-sweep group inline-flex items-center gap-3 border border-foreground/25 px-6 py-3 font-grotesk text-[11px] uppercase tracking-[0.3em] text-foreground transition-colors duration-300 hover:border-accent hover:text-background"
            >
              Full research statement
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </RevealOnScroll>
        </div>

        <div className="mt-16 grid border-l border-t border-border sm:grid-cols-2 lg:grid-cols-3">
          {areas.map((area, i) => (
            <RevealOnScroll key={area.id} delay={(i % 3) * 0.08} y={40}>
              <TiltCard>
                <Link
                  href="/research"
                  className="group relative flex h-full min-h-56 flex-col justify-between border-b border-r border-border p-6 transition-colors duration-300 hover:bg-accent md:p-8"
                >
                  <span className="font-display text-2xl uppercase text-muted transition-colors group-hover:text-background/60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-3xl uppercase leading-none text-foreground transition-colors group-hover:text-background md:text-4xl">
                      {area.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted transition-colors group-hover:text-background/75">
                      {area.description}
                    </p>
                  </div>
                  <span
                    aria-hidden
                    className="absolute right-6 top-6 text-accent opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:text-background group-hover:opacity-100"
                  >
                    ↗
                  </span>
                </Link>
              </TiltCard>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
