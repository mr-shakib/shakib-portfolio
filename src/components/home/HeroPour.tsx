"use client";

import { useId } from "react";

/**
 * Drops as [cx, cy, r, delay ms] in a 160×100 field, sliced to cover the stage
 * (phones see roughly the middle third, so a few sit on the centre column).
 * Satellites bloom out past `cx, cy` and are drawn back in as they grow; the
 * first drop floods the whole field, swallowing them nearest-first.
 */
// Opens a little above centre, where the face sits on phones; big enough to reach every corner.
const FLOOD = [80, 46, 104] as const;
const DROPS: readonly (readonly [number, number, number, number])[] = [
  [54, 31, 14, 100],
  [107, 64, 16, 160],
  [80, 13, 10, 220],
  [77, 88, 11, 260],
  [122, 27, 13, 300],
  [35, 70, 12, 340],
  [145, 70, 12, 400],
  [17, 37, 11, 440],
];
/** How far out (share of the distance from the centre) a drop starts. */
const DRIFT = 0.3;

/**
 * First-load entrance. The stage opens as a flat volt pool and the poster
 * pours in through it: drops bloom, bridge into one another with the same
 * blur + alpha-threshold goo as the cursor's liquid trail, then flood the
 * frame. Pure CSS (keyframes in globals.css), so it starts on first paint
 * instead of waiting for hydration; it never blocks the page, and `onDone`
 * unmounts it once the flood ends.
 */
export function HeroPour({ onDone }: { onDone: () => void }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");

  return (
    <svg
      aria-hidden
      viewBox="0 0 160 100"
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 z-[15] h-full w-full"
      onAnimationEnd={(e) => {
        if (e.animationName === "pour-flood") onDone();
      }}
    >
      <defs>
        {/* Region = the field, and no smoothing pass: this runs over the
            whole stage every frame, and the threshold's slope already
            antialiases the edge at this blur. */}
        <filter
          id={`pour-goo-${uid}`}
          filterUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="160"
          height="100"
        >
          <feGaussianBlur in="SourceGraphic" stdDeviation="3.2" />
          <feColorMatrix mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10" />
        </filter>
        <mask
          id={`pour-mask-${uid}`}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="160"
          height="100"
        >
          <rect width="160" height="100" fill="white" />
          <g filter={`url(#pour-goo-${uid})`} fill="black">
            <circle className="pour-flood" cx={FLOOD[0]} cy={FLOOD[1]} r={FLOOD[2]} />
            {DROPS.map(([cx, cy, r, delay], i) => (
              <circle
                key={i}
                className="pour-drop"
                cx={cx}
                cy={cy}
                r={r}
                style={
                  {
                    animationDelay: `${delay}ms`,
                    "--dx": `${((cx - FLOOD[0]) * DRIFT).toFixed(1)}px`,
                    "--dy": `${((cy - FLOOD[1]) * DRIFT).toFixed(1)}px`,
                  } as React.CSSProperties
                }
              />
            ))}
          </g>
        </mask>
      </defs>
      <rect width="160" height="100" className="fill-volt" mask={`url(#pour-mask-${uid})`} />
    </svg>
  );
}
