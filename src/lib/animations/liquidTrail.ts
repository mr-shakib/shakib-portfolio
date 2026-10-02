/**
 * Motion-driven liquid cursor trail, shared by everything that draws it.
 *
 * Moving the pointer over `area` pours energy in; the trail (a chain of points
 * chasing the pointer with spring lag) stretches into a ribbon at speed and
 * drains away a moment after the pointer rests — like stirring water, it's
 * only there while you move. Points are emitted in viewport (client)
 * coordinates; each subscriber maps them into its own space.
 */

export interface TrailPoint {
  x: number;
  y: number;
  /** Radius in px; 0 when the trail has drained. */
  r: number;
}

/**
 * Called once per frame with the trail. Read layout here and return the DOM
 * writes as a function: the trail runs every listener's reads before any
 * writes, so a frame costs one style/layout pass, not one per listener.
 */
export type TrailListener = (points: readonly TrailPoint[]) => (() => void) | void;

export interface LiquidTrail {
  readonly count: number;
  subscribe(listener: TrailListener): () => void;
  /** Play a scripted pass along `path` (t: 0→1 → client coords) over `ms`. */
  sweep(path: (t: number) => { x: number; y: number }, ms: number): void;
  destroy(): void;
}

interface Options {
  /** Points in the chain; more = longer ribbon. */
  count?: number;
  /** Lead radius in px for the current area size. */
  radius?: (width: number, height: number) => number;
}

/** Fraction of energy kept per frame — ~0.5s from full to gone. */
const DRAIN = 0.955;
/** Energy gained per pixel of pointer travel, and the most one event can add. */
const GAIN = 0.009;
const MAX_STEP = 60;
const HEAD_FOLLOW = 0.32;
const TRAIL_FOLLOW = 0.42;

export function createLiquidTrail(area: HTMLElement, options: Options = {}): LiquidTrail {
  const count = options.count ?? 14;
  const radiusFor = options.radius ?? ((w, h) => Math.min(96, Math.max(48, Math.min(w, h) * 0.09)));
  const pts = Array.from({ length: count }, () => ({ x: 0, y: 0 }));
  const out: TrailPoint[] = pts.map(() => ({ x: 0, y: 0, r: 0 }));
  const target = { x: 0, y: 0 };
  const listeners = new Set<TrailListener>();
  let energy = 0;
  let raf = 0;
  let last: { x: number; y: number } | null = null;
  let script: { path: (t: number) => { x: number; y: number }; start: number; ms: number } | null =
    null;
  // Layout size, cached so a frame never has to measure the area.
  let width = area.offsetWidth;
  let height = area.offsetHeight;
  const ro = new ResizeObserver(() => {
    width = area.offsetWidth;
    height = area.offsetHeight;
  });
  ro.observe(area);

  const snap = (x: number, y: number) => {
    target.x = x;
    target.y = y;
    for (const p of pts) {
      p.x = x;
      p.y = y;
    }
  };

  const feed = (x: number, y: number) => {
    const prev = last;
    last = { x, y };
    // An idle trail restarts at the pointer instead of sweeping in from afar.
    if (energy < 0.02) snap(x, y);
    // Energy comes from travel since the previous event (capped, so re-entering
    // from far away doesn't burst).
    if (prev)
      energy = Math.min(1, energy + Math.min(MAX_STEP, Math.hypot(x - prev.x, y - prev.y)) * GAIN);
    target.x = x;
    target.y = y;
    kick();
  };

  const tick = (now: number) => {
    raf = 0;
    if (script) {
      const t = (now - script.start) / script.ms;
      if (t >= 1) script = null;
      else {
        const p = script.path(t);
        feed(p.x, p.y);
      }
    }

    pts[0]!.x += (target.x - pts[0]!.x) * HEAD_FOLLOW;
    pts[0]!.y += (target.y - pts[0]!.y) * HEAD_FOLLOW;
    for (let i = 1; i < count; i++) {
      pts[i]!.x += (pts[i - 1]!.x - pts[i]!.x) * TRAIL_FOLLOW;
      pts[i]!.y += (pts[i - 1]!.y - pts[i]!.y) * TRAIL_FOLLOW;
    }
    energy *= DRAIN;
    if (energy < 0.004) energy = 0;

    const R = radiusFor(width, height);
    for (let i = 0; i < count; i++) {
      const o = out[i]!;
      o.x = pts[i]!.x;
      o.y = pts[i]!.y;
      // Ribbon taper: full at the head, thinning toward the tail.
      o.r = R * energy * (1 - i / (count * 1.15));
    }
    const writes = [...listeners].map((fn) => fn(out));
    for (const write of writes) write?.();

    // `feed` above may already have scheduled the next frame; never add a
    // second one, or the ticks per frame would double every frame.
    if (energy > 0 || script) kick();
  };

  function kick() {
    if (!raf) raf = requestAnimationFrame(tick);
  }

  const onMove = (e: PointerEvent) => {
    if (e.pointerType === "touch") return;
    feed(e.clientX, e.clientY);
  };
  // Touch has no hover: a tap pours in a short burst where the finger lands.
  const onDown = (e: PointerEvent) => {
    if (e.pointerType !== "touch") return;
    snap(e.clientX, e.clientY);
    last = { x: e.clientX, y: e.clientY };
    energy = 1;
    kick();
  };

  // Leaving forgets the position, so re-entry measures travel from there.
  const onLeave = () => {
    last = null;
  };

  area.addEventListener("pointermove", onMove);
  area.addEventListener("pointerdown", onDown);
  area.addEventListener("pointerleave", onLeave);

  return {
    count,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    sweep(path, ms) {
      const p = path(0);
      snap(p.x, p.y);
      last = p;
      script = { path, start: performance.now(), ms };
      kick();
    },
    destroy() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      listeners.clear();
      area.removeEventListener("pointermove", onMove);
      area.removeEventListener("pointerdown", onDown);
      area.removeEventListener("pointerleave", onLeave);
    },
  };
}
