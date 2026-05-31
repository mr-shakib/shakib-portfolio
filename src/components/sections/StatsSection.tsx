import { Section } from "@/components/shared/Section";
import { Counter } from "@/components/shared/Counter";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { statsContent } from "@/content/stats";

export function StatsSection() {
  return (
    <Section id="stats" className="border-y border-border bg-surface/40">
      <dl className="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-3 lg:grid-cols-5">
        {statsContent.map((stat, i) => (
          <RevealOnScroll key={stat.label} delay={i * 0.08}>
            <div className="flex flex-col gap-2">
              <dd className="font-display text-display-md text-gradient-accent">
                <Counter value={stat.value} suffix={stat.suffix} />
              </dd>
              <dt className="text-sm uppercase tracking-wider text-muted">{stat.label}</dt>
            </div>
          </RevealOnScroll>
        ))}
      </dl>
    </Section>
  );
}
