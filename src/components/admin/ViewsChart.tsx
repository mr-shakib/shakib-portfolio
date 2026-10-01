"use client";

import { useEffect, useRef, useState } from "react";
import type { DailyViews } from "@/lib/views";

// Bar fill at rest is a deeper step of the brand volt (validated for dark
// surfaces); the hovered/focused bar lifts to the brand volt itself.
const BAR = "#7c9e12";
const BAR_ACTIVE = "var(--color-accent)";
const HEIGHT = 220;
const PAD = { top: 12, right: 4, bottom: 26, left: 40 };

const dayLabel = new Intl.DateTimeFormat("en", { month: "short", day: "numeric", timeZone: "UTC" });
const longDay = new Intl.DateTimeFormat("en", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" });
const num = new Intl.NumberFormat("en");

/** Smallest 1/2/5×10^k step that splits `max` into at most ~4 intervals. */
function niceScale(max: number) {
  if (max <= 0) return { top: 4, step: 1 };
  const raw = max / 4;
  const pow = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 5, 10].map((m) => m * pow).find((s) => s >= raw) ?? raw;
  const niceStep = Math.max(1, step);
  return { top: Math.ceil(max / niceStep) * niceStep, step: niceStep };
}

/** Column path with 4px rounded data-end and a square baseline. */
function barPath(x: number, y: number, w: number, base: number) {
  const h = base - y;
  const r = Math.min(4, w / 2, h);
  return `M${x},${base}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${base}Z`;
}

export function ViewsChart({ data }: { data: DailyViews[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(720);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => entry && setWidth(Math.max(280, entry.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const n = data.length;
  const plotW = width - PAD.left - PAD.right;
  const base = HEIGHT - PAD.bottom;
  const plotH = base - PAD.top;
  const { top, step } = niceScale(Math.max(...data.map((d) => d.views), 0));
  const slot = plotW / n;
  const barW = Math.max(1, Math.min(24, slot - 2));
  const y = (v: number) => base - (v / top) * plotH;
  const ticks = Array.from({ length: Math.floor(top / step) + 1 }, (_, i) => i * step);
  const xLabels = [0, Math.floor((n - 1) / 2), n - 1];
  const empty = data.every((d) => d.views === 0);

  const current = active !== null ? data[active] : null;
  const tipX = active !== null ? PAD.left + slot * active + slot / 2 : 0;

  const onKey = (e: React.KeyboardEvent) => {
    const keys: Record<string, number> = {
      ArrowLeft: (active ?? n) - 1,
      ArrowRight: (active ?? -1) + 1,
      Home: 0,
      End: n - 1,
    };
    if (!(e.key in keys)) return;
    e.preventDefault();
    setActive(Math.min(n - 1, Math.max(0, keys[e.key]!)));
  };

  return (
    <div>
      <div
        ref={wrapRef}
        className="relative rounded-lg"
        tabIndex={0}
        role="group"
        aria-label={`Daily views over the last ${n} days. Use the arrow keys to read each day.`}
        onKeyDown={onKey}
        onFocus={() => setActive((a) => a ?? n - 1)}
        onBlur={() => setActive(null)}
        onPointerLeave={() => setActive(null)}
      >
        <svg width={width} height={HEIGHT} className="block" aria-hidden>
          {ticks.map((t) => (
            <g key={t}>
              <line x1={PAD.left} x2={width - PAD.right} y1={y(t)} y2={y(t)} stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
              <text x={PAD.left - 8} y={y(t)} dy="0.32em" textAnchor="end" className="fill-muted text-[10px] tabular-nums">
                {num.format(t)}
              </text>
            </g>
          ))}

          {data.map((d, i) => {
            const x = PAD.left + slot * i + (slot - barW) / 2;
            return d.views > 0 ? (
              <path key={d.day} d={barPath(x, y(d.views), barW, base)} fill={active === i ? BAR_ACTIVE : BAR} />
            ) : null;
          })}

          {xLabels.map((i, k) => {
            const d = data[i];
            if (!d) return null;
            return (
              <text
                key={`${d.day}-${k}`}
                x={PAD.left + slot * i + slot / 2}
                y={HEIGHT - 6}
                textAnchor={k === 0 ? "start" : k === 2 ? "end" : "middle"}
                className="fill-muted text-[10px]"
              >
                {dayLabel.format(new Date(d.day))}
              </text>
            );
          })}

          {/* Hit targets: the whole column slot, not just the painted bar. */}
          {data.map((d, i) => (
            <rect
              key={`hit-${d.day}`}
              x={PAD.left + slot * i}
              y={PAD.top}
              width={slot}
              height={plotH}
              fill="transparent"
              onPointerEnter={() => setActive(i)}
              onPointerMove={() => active !== i && setActive(i)}
            />
          ))}
        </svg>

        {empty && (
          <p className="pointer-events-none absolute inset-x-0 top-1/3 text-center text-sm text-muted">
            No views recorded in this period yet.
          </p>
        )}

        {current && (
          <div
            className="pointer-events-none absolute top-0 z-10 min-w-[8.5rem] -translate-x-1/2 rounded-lg border border-white/10 bg-surface-elevated px-3 py-2 shadow-xl"
            style={{ left: Math.min(Math.max(tipX, 70), width - 70) }}
          >
            <p className="text-base font-semibold tabular-nums text-foreground">
              {num.format(current.views)} <span className="text-xs font-normal text-muted">views</span>
            </p>
            <p className="text-xs tabular-nums text-white/80">
              {num.format(current.visitors)} <span className="text-muted">new visits</span>
            </p>
            <p className="mt-1 text-[11px] text-muted">{longDay.format(new Date(current.day))}</p>
          </div>
        )}
      </div>

      <details className="mt-3 text-sm">
        <summary className="cursor-pointer text-xs text-muted hover:text-foreground">View as table</summary>
        <div className="mt-2 max-h-64 overflow-y-auto rounded-lg border border-white/10">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-surface text-muted">
              <tr>
                <th className="px-3 py-2 font-normal">Day (UTC)</th>
                <th className="px-3 py-2 text-right font-normal">Views</th>
                <th className="px-3 py-2 text-right font-normal">New visits</th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {[...data].reverse().map((d) => (
                <tr key={d.day} className="border-t border-white/5">
                  <td className="px-3 py-1.5 text-white/80">{longDay.format(new Date(d.day))}</td>
                  <td className="px-3 py-1.5 text-right text-foreground">{num.format(d.views)}</td>
                  <td className="px-3 py-1.5 text-right text-white/80">{num.format(d.visitors)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
