import Link from "next/link";
import type { PublicationDTO } from "@/lib/validations/content";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { ClipReveal } from "@/components/shared/ClipReveal";

/**
 * Featured publication — the full-bleed accent-inverted section. Black type on
 * the signature volt panel, dataset facts rendered like a spec sheet.
 */
export function PublicationSpotlight({ publication }: { publication: PublicationDTO | null }) {
  if (!publication) return null;

  const year = publication.publishedDate?.getFullYear() ?? "";
  const facts = [
    { value: "4,089", label: "Labelled images" },
    { value: "6", label: "Disease classes" },
    { value: "Open", label: "Access dataset" },
  ];

  return (
    <section id="featured-publication" className="bg-background">
      <ClipReveal>
        <div className="bg-accent text-background">
          <div className="container-content py-section">
        <RevealOnScroll>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="font-grotesk text-[11px] uppercase tracking-[0.35em]">
              Featured publication — first author
            </p>
            <p className="font-grotesk text-[11px] uppercase tracking-[0.35em]">
              {publication.venue} · Elsevier · {year}
            </p>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={0.1}>
          <h2 className="mt-10 max-w-5xl font-display text-display-md uppercase leading-[0.95]">
            {publication.title}
          </h2>
        </RevealOnScroll>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_auto]">
          <RevealOnScroll delay={0.15}>
            <p className="max-w-2xl text-sm leading-relaxed text-background/80 md:text-base">
              {publication.impact}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              {publication.url && (
                <a
                  href={publication.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 bg-background px-6 py-3 font-grotesk text-[11px] uppercase tracking-[0.3em] text-foreground transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_8px_0_rgba(10,10,10,0.35)]"
                >
                  Read the paper{" "}
                  <span
                    aria-hidden
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  >
                    ↗
                  </span>
                </a>
              )}
              <Link
                href="/publications"
                className="btn-sweep btn-sweep-dark inline-flex items-center gap-3 border border-background/40 px-6 py-3 font-grotesk text-[11px] uppercase tracking-[0.3em] transition-colors duration-300 hover:border-background hover:text-accent"
              >
                All publications
              </Link>
            </div>
          </RevealOnScroll>

          <div className="flex gap-10 lg:flex-col lg:gap-6 lg:border-l lg:border-background/25 lg:pl-10">
            {facts.map((fact, i) => (
              <RevealOnScroll key={fact.label} delay={0.2 + i * 0.08}>
                <p className="font-display text-5xl uppercase leading-none md:text-6xl">
                  {fact.value}
                </p>
                <p className="mt-2 font-grotesk text-[10px] uppercase tracking-[0.25em] text-background/70">
                  {fact.label}
                </p>
              </RevealOnScroll>
            ))}
          </div>
        </div>

            <RevealOnScroll delay={0.25}>
              <p className="mt-12 border-t border-background/25 pt-6 font-grotesk text-[10px] uppercase tracking-[0.25em] text-background/70">
                DOI {publication.doi}
              </p>
            </RevealOnScroll>
          </div>
        </div>
      </ClipReveal>
    </section>
  );
}
