import { VelocityMarquee } from "@/components/shared/VelocityMarquee";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { SplitHeading } from "@/components/shared/SplitHeading";
import { DriftOnScroll } from "@/components/shared/DriftOnScroll";
import { skillsContent } from "@/content/skills";

const pick = (categories: string[]) =>
  skillsContent.filter((s) => categories.includes(s.category)).map((s) => s.name);

/**
 * "The Stack" — the partner-wall moment, rebuilt as three counter-drifting
 * bands of oversized tool wordmarks.
 */
export function StackSection() {
  const rows: { label: string; items: string[]; velocity: number }[] = [
    { label: "Languages & Backend", items: pick(["Programming", "Backend"]), velocity: 2 },
    { label: "AI / ML & Research", items: pick(["AI/ML", "Research"]), velocity: -1.6 },
    { label: "Frontend & Cloud", items: pick(["Frontend", "Cloud"]), velocity: 2.4 },
  ];

  return (
    <section id="skills" className="border-b border-border bg-transparent py-section">
      <div className="container-content">
        <RevealOnScroll>
          <p className="font-grotesk text-[11px] uppercase tracking-[0.35em] text-accent">
            04 — Toolkit
          </p>
        </RevealOnScroll>
        <DriftOnScroll x={40} className="mt-4">
          <SplitHeading
            as="h2"
            lines={[{ text: "The Stack" }]}
            lineClassName="text-display-xl text-foreground leading-[0.88]"
          />
        </DriftOnScroll>
      </div>

      <div className="mt-16">
        {rows.map((row) => (
          <div key={row.label} className="relative">
            <VelocityMarquee
              items={row.items}
              baseVelocity={row.velocity}
              className="border-b border-t-0 py-4 first:border-t"
              textClassName="font-display text-5xl uppercase text-foreground/25 md:text-7xl"
              itemClassName="transition-all duration-300 hover:-translate-y-1 hover:text-accent"
            />
            <span className="pointer-events-none absolute left-gutter top-2 font-grotesk text-[10px] uppercase tracking-[0.3em] text-accent">
              {row.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
