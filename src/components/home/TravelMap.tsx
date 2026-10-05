import { Eyebrow } from "@/components/shared/Eyebrow";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { SplitHeading } from "@/components/shared/SplitHeading";
import { BD_GEO, BD_GEO_CREDIT } from "@/lib/maps/bangladesh";
import { DISTRICTS, DISTRICT_BY_ID, DIVISIONS } from "@/lib/maps/districts";
import type { SectionContent } from "@/lib/sections/registry";
import { TravelMapFrame } from "./TravelMapFrame";

/** Milliseconds of fill-in delay per map unit of distance from the home district. */
const RIPPLE_MS = 1.8;

/**
 * Bangladesh with every visited district lit in volt — the stats on the left,
 * the map on the right. Rendered on the server so the outlines stay out of the
 * JS bundle; TravelMapFrame only adds the tooltip and the fill-in.
 */
export function TravelMap({
  content,
  number,
}: {
  content: SectionContent<"travelMap">;
  number: string;
}) {
  const home = DISTRICT_BY_ID.get(content.home);
  const visited = new Set<string>(content.visited);
  if (home) visited.add(home.id);

  const total = DISTRICTS.length;
  const pct = Math.round((visited.size / total) * 100);
  const divisions = DIVISIONS.map((name) => {
    const list = DISTRICTS.filter((d) => d.division === name);
    return { name, total: list.length, visited: list.filter((d) => visited.has(d.id)).length };
  });
  const divisionsVisited = divisions.filter((d) => d.visited > 0).length;
  const visitedNames = DISTRICTS.filter((d) => visited.has(d.id)).map((d) => d.name);

  // Fill in outward from home, or top to bottom when there's no home district.
  const origin = home ? BD_GEO.districts[home.id].c : ([BD_GEO.width / 2, 0] as const);
  const delayOf = ([x, y]: readonly [number, number]) =>
    `${Math.round(Math.hypot(x - origin[0], y - origin[1]) * RIPPLE_MS)}ms`;

  return (
    <section
      id="travel"
      className="overflow-hidden border-b border-border bg-transparent py-section"
    >
      <div className="container-content grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <RevealOnScroll>
            <Eyebrow number={number}>{content.eyebrow}</Eyebrow>
          </RevealOnScroll>
          <div className="mt-4">
            <SplitHeading
              as="h2"
              lines={[
                { text: content.headingTop, className: "text-foreground" },
                { text: content.headingBottom, serif: true },
              ]}
              lineClassName="text-display-md leading-[0.9]"
            />
          </div>
          {content.intro && (
            <RevealOnScroll delay={0.1}>
              <p className="mt-6 max-w-md text-base leading-relaxed text-muted">{content.intro}</p>
            </RevealOnScroll>
          )}

          <RevealOnScroll delay={0.15}>
            <div className="mt-10 flex items-end gap-4">
              <span className="font-display text-[clamp(4rem,9vw,7.5rem)] leading-[0.8] text-volt">
                {visited.size}
              </span>
              <span className="pb-1 font-grotesk text-[11px] uppercase leading-relaxed tracking-[0.25em] text-muted">
                / {total} districts
                <br />
                {divisionsVisited} of {DIVISIONS.length} divisions
              </span>
            </div>
            <div
              className="mt-6 h-1 w-full bg-foreground/10"
              role="progressbar"
              aria-label="Share of districts visited"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div className="h-full bg-volt" style={{ width: `${pct}%` }} />
            </div>
            <p className="mt-2 text-right font-grotesk text-[11px] uppercase tracking-[0.25em] text-muted">
              {pct}% of the country
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={0.2}>
            <ul className="mt-10 grid grid-cols-2 gap-x-8 gap-y-5">
              {divisions.map((d) => (
                <li key={d.name}>
                  <div className="flex items-baseline justify-between gap-2 font-grotesk text-[11px] uppercase tracking-[0.2em]">
                    <span className={d.visited ? "text-foreground" : "text-muted"}>{d.name}</span>
                    <span className="tabular-nums text-muted">
                      {d.visited}/{d.total}
                    </span>
                  </div>
                  <div className="mt-2 h-px bg-foreground/15">
                    <div
                      className="h-px bg-volt"
                      style={{ width: `${(d.visited / d.total) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </RevealOnScroll>
        </div>

        <div className="lg:col-span-7">
          <TravelMapFrame className="mx-auto w-full max-w-[560px]">
            <svg
              viewBox={`0 0 ${BD_GEO.width} ${BD_GEO.height}`}
              role="img"
              aria-label={`Map of Bangladesh: ${visited.size} of ${total} districts visited${visitedNames.length ? ` — ${visitedNames.join(", ")}` : ""}.`}
              className="h-auto w-full"
            >
              {DISTRICTS.map((d) => {
                const { d: path, c } = BD_GEO.districts[d.id];
                const on = visited.has(d.id);
                return (
                  <path
                    key={d.id}
                    d={path}
                    data-name={d.name}
                    data-state={d.id === home?.id ? "Home" : on ? "Visited" : "Not yet"}
                    strokeWidth={1.2}
                    strokeLinejoin="round"
                    style={on ? ({ "--delay": delayOf(c) } as React.CSSProperties) : undefined}
                    className={
                      on
                        ? "map-visited fill-volt stroke-background transition-[fill] duration-300 hover:fill-volt/75"
                        : "fill-foreground/[0.07] stroke-background transition-[fill] duration-300 hover:fill-foreground/20"
                    }
                  />
                );
              })}
              {home && (
                <g
                  transform={`translate(${BD_GEO.districts[home.id].c.join(" ")})`}
                  className="pointer-events-none"
                >
                  <circle
                    r={13}
                    strokeWidth={2}
                    className="origin-center fill-none stroke-background [transform-box:fill-box] motion-safe:animate-pulse-ring"
                  />
                  <circle r={5.5} className="fill-background" />
                </g>
              )}
            </svg>
          </TravelMapFrame>
          <p className="mt-5 text-center font-grotesk text-[10px] uppercase tracking-[0.2em] text-muted/70">
            <a
              href={BD_GEO_CREDIT.href}
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground"
            >
              {BD_GEO_CREDIT.text}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
