import Link from "next/link";
import { Section } from "@/components/shared/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { Badge } from "@/components/ui/Badge";
import { formatYear } from "@/lib/utils/format";
import type { AchievementDTO } from "@/lib/validations/content";

const typeLabels: Record<AchievementDTO["type"], string> = {
  PUBLICATION: "Publication",
  AWARD: "Recognition",
  CONTEST: "Contest",
  ACADEMIC: "Academic",
};

export function AchievementsSection({ achievements }: { achievements: AchievementDTO[] }) {
  return (
    <Section id="achievements">
      <SectionHeading
        eyebrow="Journey"
        title="Milestones along the way."
        description="Publications, contests and academic moments that shaped the path."
      />

      <ol className="mt-12 flex flex-col gap-6 border-l border-border pl-8">
        {achievements.map((a, i) => (
          <RevealOnScroll key={a.id} delay={i * 0.06}>
            <li className="relative">
              <span
                className="absolute -left-[2.6rem] top-1.5 h-3 w-3 rounded-full border border-accent bg-background"
                aria-hidden
              />
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="accent">{typeLabels[a.type]}</Badge>
                <span className="text-sm text-muted">{formatYear(a.date)}</span>
              </div>
              <h3 className="mt-2 font-display text-xl text-foreground">{a.title}</h3>
              <p className="mt-1 max-w-2xl leading-relaxed text-muted">{a.description}</p>
              {a.link && (
                <Link
                  href={a.link}
                  className="mt-2 inline-block text-sm text-accent hover:underline"
                >
                  Learn more →
                </Link>
              )}
            </li>
          </RevealOnScroll>
        ))}
      </ol>
    </Section>
  );
}
