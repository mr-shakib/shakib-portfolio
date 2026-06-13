import { Counter } from "@/components/shared/Counter";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { statsContent } from "@/content/stats";

/**
 * Career-numbers band — oversized condensed numerals separated by hairlines,
 * in the style of a season stats board.
 */
export function NumbersBand() {
  return (
    <section id="stats" className="border-b border-border bg-surface/40">
      <div className="container-content py-16 md:py-20">
        <RevealOnScroll>
          <p className="font-grotesk text-[11px] uppercase tracking-[0.35em] text-muted">
            Career numbers <span className="text-accent">— so far</span>
          </p>
        </RevealOnScroll>

        <div className="mt-10 grid grid-cols-2 gap-y-12 md:grid-cols-5">
          {statsContent.map((stat, i) => (
            <RevealOnScroll
              key={stat.label}
              delay={i * 0.08}
              y={56}
              className="group border-l border-border pl-5 transition-colors duration-300 hover:border-accent md:pl-6"
            >
              <p className="font-display text-6xl uppercase leading-none text-foreground transition-all duration-300 group-hover:-translate-y-1 group-hover:text-accent md:text-7xl lg:text-8xl">
                <Counter value={stat.value} duration={2.4} />
                <span className="text-accent">{stat.suffix}</span>
              </p>
              <p className="mt-3 font-grotesk text-[11px] uppercase tracking-[0.25em] text-muted transition-colors duration-300 group-hover:text-foreground">
                {stat.label}
              </p>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
