import { VelocityMarquee } from "@/components/shared/VelocityMarquee";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { SplitHeading } from "@/components/shared/SplitHeading";
import { DriftOnScroll } from "@/components/shared/DriftOnScroll";
import type { SkillDTO } from "@/lib/validations/content";
import type { SectionContent } from "@/lib/sections/registry";

/**
 * "The Stack" — the partner-wall moment, rebuilt as three counter-drifting
 * bands of oversized tool wordmarks.
 */
// Alternating drift speeds/directions, cycled across however many bands exist.
const VELOCITIES = [2, -1.6, 2.4];

export function StackSection({
  content,
  skills,
}: {
  content: SectionContent<"stack">;
  skills: SkillDTO[];
}) {
  const rows = content.rows
    .map((row, i) => ({
      label: row.label,
      items: skills.filter((s) => row.categories.includes(s.category)).map((s) => s.name),
      velocity: VELOCITIES[i % VELOCITIES.length]!,
    }))
    .filter((row) => row.items.length > 0);

  return (
    <section id="skills" className="border-b border-border bg-transparent py-section">
      <div className="container-content">
        <RevealOnScroll>
          <Eyebrow number="07">{content.eyebrow}</Eyebrow>
        </RevealOnScroll>
        <DriftOnScroll x={40} className="mt-4">
          <SplitHeading
            as="h2"
            lines={[{ text: content.heading }]}
            lineClassName="text-display-xl text-foreground leading-[0.88]"
          />
        </DriftOnScroll>
      </div>

      {/* Each band gets its own label strip so the category never collides
          with the drifting wordmarks. */}
      <div className="mt-16 border-t border-border">
        {rows.map((row) => (
          <div key={row.label} className="border-b border-border">
            <p className="container-content pt-4 font-grotesk text-[10px] uppercase tracking-[0.3em] text-accent">
              {row.label}
            </p>
            <VelocityMarquee
              items={row.items}
              baseVelocity={row.velocity}
              className="border-y-0 py-4"
              textClassName="font-display text-5xl uppercase text-foreground/40 md:text-7xl"
              itemClassName="transition-all duration-300 hover:-translate-y-1 hover:text-accent"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
