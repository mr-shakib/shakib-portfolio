import { Counter } from "@/components/shared/Counter";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import type { SectionContent } from "@/lib/sections/registry";
import { cn } from "@/lib/utils/cn";

/**
 * Columns per item count (numbers are edited in /admin), chosen so rows
 * always come out full: 6 → 3×2, 8 → 4×2, 4 → 2×2 then 4×1.
 */
function columnsFor(count: number) {
  if (count <= 1) return "";
  if (count === 2) return "md:grid-cols-2";
  if (count === 4) return "md:grid-cols-2 lg:grid-cols-4";
  if (count === 7 || count === 8) return "md:grid-cols-4";
  return "md:grid-cols-3";
}

/**
 * Career-numbers board — a hairline grid like the research cards: small index
 * up top, an oversized condensed numeral with a volt superscript suffix and
 * its label at the foot of each cell.
 */
export function NumbersBand({ content }: { content: SectionContent<"stats"> }) {
  return (
    <section id="stats" className="border-b border-border">
      <div className="container-content py-16 md:py-24">
        <RevealOnScroll>
          <Eyebrow number="02" className="text-muted">
            {content.eyebrow} <span className="text-accent">{content.eyebrowAccent}</span>
          </Eyebrow>
        </RevealOnScroll>

        <div
          className={cn(
            "mt-10 grid grid-cols-2 border-l border-t border-border",
            columnsFor(content.items.length),
          )}
        >
          {content.items.map((stat, i) => (
            <RevealOnScroll
              key={`${stat.label}-${i}`}
              delay={(i % 3) * 0.08}
              y={40}
              className="group flex min-h-48 flex-col justify-between gap-8 border-b border-r border-border p-5 transition-colors duration-300 hover:bg-foreground/[0.03] md:min-h-60 md:p-8"
            >
              <span className="font-grotesk text-[10px] uppercase tracking-[0.3em] text-muted">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="whitespace-nowrap font-display text-[clamp(2.75rem,7.5vw,7rem)] uppercase leading-[0.85] text-foreground transition-colors duration-300 group-hover:text-accent">
                  <Counter value={stat.value} duration={2.4} />
                  {stat.suffix.trim() && (
                    <span
                      className={cn(
                        "ml-1 inline-block align-top leading-none text-accent",
                        // A lone "+" or "%" reads as a speck at fraction size.
                        stat.suffix.trim().length <= 2 ? "text-[0.55em]" : "text-[0.36em]",
                      )}
                    >
                      {stat.suffix.trim()}
                    </span>
                  )}
                </p>
                <p className="mt-4 max-w-[16rem] font-grotesk text-[10px] uppercase leading-relaxed tracking-[0.25em] text-muted transition-colors duration-300 group-hover:text-foreground md:text-[11px]">
                  {stat.label}
                </p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
