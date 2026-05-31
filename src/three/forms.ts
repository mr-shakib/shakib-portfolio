/**
 * Particle form generators.
 *
 * For *perfect*, device-independent recognizability we sample particles from
 * hand-authored SVG path silhouettes (src/three/shapePaths.ts) — not system
 * emoji, which render as tofu rectangles when a glyph is unavailable. Each path
 * is filled to an offscreen canvas; particles are scattered over the opaque
 * pixels, giving a crisp silhouette of the symbol.
 *
 * Sampling is client-only (needs <canvas>); a circle fallback covers SSR.
 */
import { SHAPE_PATHS } from "@/three/shapePaths";

const FIT = 11; // world size the silhouette is scaled to fit
const DEPTH = 0.5; // small z spread so it reads with a little volume
const VIEWBOX = 100; // SVG path coordinate space

function circleFallback(count: number): Float32Array {
  const a = new Float32Array(count * 3);
  const r = FIT / 2;
  for (let i = 0; i < count; i++) {
    const t = Math.random();
    const ang = Math.random() * Math.PI * 2;
    const rr = Math.sqrt(t) * r;
    a[i * 3] = Math.cos(ang) * rr;
    a[i * 3 + 1] = Math.sin(ang) * rr;
    a[i * 3 + 2] = (Math.random() - 0.5) * DEPTH;
  }
  return a;
}

/** Fill an SVG path to a canvas, read its mask, and sample `count` points. */
function samplePath(pathData: string, count: number): Float32Array {
  if (typeof document === "undefined" || typeof Path2D === "undefined") {
    return circleFallback(count);
  }

  const SIZE = 256;
  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return circleFallback(count);

  ctx.clearRect(0, 0, SIZE, SIZE);
  ctx.fillStyle = "#ffffff";
  const s = SIZE / VIEWBOX;
  ctx.setTransform(s, 0, 0, s, 0, 0);
  ctx.fill(new Path2D(pathData), "evenodd");
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  const data = ctx.getImageData(0, 0, SIZE, SIZE).data;

  const pts: number[] = [];
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      if (data[(y * SIZE + x) * 4 + 3]! > 50) pts.push(x, y);
    }
  }
  const n = pts.length / 2;
  if (n === 0) return circleFallback(count);

  const scale = FIT / SIZE;
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const p = (Math.random() * n) | 0;
    const px = pts[p * 2]!;
    const py = pts[p * 2 + 1]!;
    out[i * 3] = (px - SIZE / 2 + Math.random()) * scale;
    out[i * 3 + 1] = -(py - SIZE / 2 + Math.random()) * scale; // flip Y (screen→world)
    out[i * 3 + 2] = (Math.random() - 0.5) * DEPTH;
  }
  return out;
}

/* ---------------------------------------------------------------------------
 * Procedural 3D forms — for shapes that only read correctly with real volume
 * (a sphere, a double helix). These override the flat path-sampled silhouettes.
 * ------------------------------------------------------------------------- */

/** A true 3D sphere shell (Fibonacci distribution) — the globe. */
function globe3D(count: number): Float32Array {
  const a = new Float32Array(count * 3);
  const r = FIT * 0.46;
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2; // -1..1
    const rad = Math.sqrt(1 - y * y);
    const theta = golden * i;
    a[i * 3] = Math.cos(theta) * rad * r;
    a[i * 3 + 1] = y * r;
    a[i * 3 + 2] = Math.sin(theta) * rad * r;
  }
  return a;
}

/** A real 3D double helix: two strands spiralling around the Y axis + rungs. */
function helix3D(count: number): Float32Array {
  const a = new Float32Array(count * 3);
  const turns = 3.2;
  const radius = FIT * 0.22;
  const height = FIT * 0.95;
  const rungEvery = 9; // every Nth particle becomes part of a connecting rung
  for (let i = 0; i < count; i++) {
    const t = i / count; // 0..1 up the helix
    const ang = t * Math.PI * 2 * turns;
    const y = (t - 0.5) * height;
    if (i % rungEvery === 0) {
      // rung: interpolate straight across between the two strands
      const k = ((i / rungEvery) % 1) || Math.random();
      const x1 = Math.cos(ang) * radius;
      const z1 = Math.sin(ang) * radius;
      const x2 = Math.cos(ang + Math.PI) * radius;
      const z2 = Math.sin(ang + Math.PI) * radius;
      a[i * 3] = x1 + (x2 - x1) * k;
      a[i * 3 + 1] = y;
      a[i * 3 + 2] = z1 + (z2 - z1) * k;
    } else {
      // strand A or B (offset by PI)
      const strand = i % 2 === 0 ? 0 : Math.PI;
      a[i * 3] = Math.cos(ang + strand) * radius;
      a[i * 3 + 1] = y;
      a[i * 3 + 2] = Math.sin(ang + strand) * radius;
    }
  }
  return a;
}

const PROCEDURAL: Record<string, (count: number) => Float32Array> = {
  globe: globe3D,
  helix: helix3D,
};

/** Build (and cache) a form's positions for a given particle count. */
const cache = new Map<string, Float32Array>();
export function getForm(name: string, count: number): Float32Array {
  const key = `${name}:${count}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const proc = PROCEDURAL[name];
  const data = proc ? proc(count) : samplePath(SHAPE_PATHS[name] ?? SHAPE_PATHS.globe!, count);
  cache.set(key, data);
  return data;
}

/** Recenter a form so its centroid sits at the origin (keeps morphs stable). */
export function center(arr: Float32Array): Float32Array {
  let cx = 0,
    cy = 0,
    cz = 0;
  const n = arr.length / 3;
  for (let i = 0; i < n; i++) {
    cx += arr[i * 3]!;
    cy += arr[i * 3 + 1]!;
    cz += arr[i * 3 + 2]!;
  }
  cx /= n;
  cy /= n;
  cz /= n;
  const out = new Float32Array(arr.length);
  for (let i = 0; i < n; i++) {
    out[i * 3] = arr[i * 3]! - cx;
    out[i * 3 + 1] = arr[i * 3 + 1]! - cy;
    out[i * 3 + 2] = arr[i * 3 + 2]! - cz;
  }
  return out;
}

export { SHAPE_NAMES } from "@/three/shapePaths";
