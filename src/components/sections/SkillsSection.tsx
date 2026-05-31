"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Section } from "@/components/shared/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { skillsContent, skillCategories } from "@/content/skills";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils/cn";

/**
 * Interactive skills graph. Rendered as an accessible SVG network (not WebGL) so
 * it works everywhere, on every device, and is keyboard/screen-reader friendly.
 * Nodes cluster by category around a central hub; hovering/focusing a node
 * reveals its detail.
 */
export function SkillsSection() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState<number | null>(null);

  const layout = useMemo(() => {
    const cx = 50;
    const cy = 50;
    return skillsContent.map((skill, i) => {
      const catIndex = skillCategories.indexOf(skill.category);
      const catCount = skillCategories.length;
      const angle = (catIndex / catCount) * Math.PI * 2 - Math.PI / 2;
      const withinCat = skillsContent
        .filter((s) => s.category === skill.category)
        .indexOf(skill);
      const ring = 22 + withinCat * 7;
      const spread = (withinCat - 1.5) * 0.18;
      return {
        x: cx + Math.cos(angle + spread) * ring,
        y: cy + Math.sin(angle + spread) * ring,
        skill,
        i,
      };
    });
  }, []);

  const activeSkill = active !== null ? skillsContent[active] : null;

  return (
    <Section id="skills">
      <SectionHeading
        eyebrow="Skills"
        title="A connected toolkit."
        description="From research and machine learning to full-stack engineering and the cloud."
        align="center"
      />

      <div className="mt-14 grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div className="relative mx-auto aspect-square w-full max-w-xl">
          <svg
            viewBox="0 0 100 100"
            className="h-full w-full"
            role="img"
            aria-label="Interactive graph of technical skills grouped by category"
          >
            {/* connection lines to hub */}
            {layout.map(({ x, y, i }) => (
              <line
                key={`l-${i}`}
                x1="50"
                y1="50"
                x2={x}
                y2={y}
                stroke="currentColor"
                strokeWidth={0.15}
                className={cn(
                  "text-border transition-opacity",
                  active === i ? "text-accent opacity-100" : "opacity-40",
                )}
              />
            ))}

            {/* hub */}
            <circle cx="50" cy="50" r="2.4" className="fill-accent" />

            {/* nodes */}
            {layout.map(({ x, y, skill, i }) => (
              <g
                key={`n-${i}`}
                tabIndex={0}
                role="button"
                aria-label={`${skill.name}, ${skill.category}, proficiency ${skill.level} percent`}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                className="cursor-pointer focus:outline-none"
              >
                <motion.circle
                  cx={x}
                  cy={y}
                  r={active === i ? 2.6 : 1.4 + (skill.level / 100) * 1.2}
                  className={cn(active === i ? "fill-accent" : "fill-foreground")}
                  initial={reduced ? false : { scale: 0, opacity: 0 }}
                  whileInView={reduced ? undefined : { scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.02, type: "spring", stiffness: 200 }}
                />
              </g>
            ))}
          </svg>
        </div>

        <div className="min-h-[140px]">
          {activeSkill ? (
            <div className="rounded-2xl border border-accent/30 bg-surface p-6">
              <p className="text-sm uppercase tracking-wider text-accent">{activeSkill.category}</p>
              <h3 className="mt-1 font-display text-2xl text-foreground">{activeSkill.name}</h3>
              {activeSkill.description && (
                <p className="mt-2 text-sm text-muted">{activeSkill.description}</p>
              )}
              <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-surface-elevated">
                <div
                  className="h-full rounded-full bg-accent transition-all"
                  style={{ width: `${activeSkill.level}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-surface p-6">
              <p className="text-muted">Hover or focus a node to explore each skill.</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {skillCategories.map((c) => (
                  <li
                    key={c}
                    className="rounded-full border border-border px-3 py-1 text-xs text-muted"
                  >
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Accessible plain-text fallback for assistive tech / no-JS */}
      <ul className="sr-only">
        {skillsContent.map((s) => (
          <li key={s.name}>
            {s.name} — {s.category} — {s.level}%
          </li>
        ))}
      </ul>
    </Section>
  );
}
