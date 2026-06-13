import Link from "next/link";
import type { ProjectDTO } from "@/lib/validations/content";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { SplitHeading } from "@/components/shared/SplitHeading";
import { DriftOnScroll } from "@/components/shared/DriftOnScroll";
import { WildRows } from "./WildRows";

/**
 * "Out in the Wild" — the engineering half of the duality: products that left
 * the lab and got adopted by real users.
 */
export function WildSection({ projects }: { projects: ProjectDTO[] }) {
  return (
    <section
      id="projects"
      className="overflow-hidden border-b border-border bg-background py-section"
    >
      <div className="container-content">
        <RevealOnScroll>
          <p className="font-grotesk text-[11px] uppercase tracking-[0.35em] text-accent">
            02 — Engineering
          </p>
        </RevealOnScroll>
        <div className="mt-4">
          <DriftOnScroll x={-60}>
            <SplitHeading
              as="h2"
              lines={[{ text: "Out in", outline: true }]}
              lineClassName="text-display-xl leading-[0.88]"
            />
          </DriftOnScroll>
          <DriftOnScroll x={60}>
            <SplitHeading
              as="h3"
              lines={[{ text: "the Wild" }]}
              lineClassName="text-display-xl text-foreground leading-[0.88]"
              delay={0.1}
            />
          </DriftOnScroll>
        </div>

        <div className="mt-10 flex flex-wrap items-end justify-between gap-6">
          <RevealOnScroll delay={0.1}>
            <p className="max-w-lg text-sm leading-relaxed text-muted md:text-base">
              Research is half the story. These are shipped, production systems — platforms
              adopted by a university community and tools used daily.
            </p>
          </RevealOnScroll>
          <RevealOnScroll delay={0.15}>
            <Link
              href="/projects"
              className="btn-sweep group inline-flex items-center gap-3 border border-foreground/25 px-6 py-3 font-grotesk text-[11px] uppercase tracking-[0.3em] text-foreground transition-colors duration-300 hover:border-accent hover:text-background"
            >
              All projects
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </RevealOnScroll>
        </div>
      </div>

      <WildRows projects={projects} />
    </section>
  );
}
