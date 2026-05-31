/**
 * Particle form generators.
 *
 * For *perfect* recognizability we don't approximate shapes with math — we draw
 * the real icon glyph to an offscreen canvas, read its alpha channel, and sample
 * particle positions from the opaque pixels. The result is a crisp silhouette of
 * the actual symbol (leaf, DNA, envelope, gear…), mapped into 3D.
 *
 * Sampling is client-only (needs <canvas>); a circle fallback covers SSR.
 */

/** Each named shape maps to the glyph whose silhouette it samples. */
const GLYPHS: Record<string, string> = {
  globe: "🌐",
  figure: "🧍",
  bars: "📊",
  helix: "🧬",
  leaf: "🍃",
  lattice: "⚙️",
  atom: "⚛️",
  trend: "📈",
  envelope: "✉️",
};

const FIT = 11; // target world size the silhouette is scaled to fit
const DEPTH = 0.5; // small z spread so it reads with a little volume

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

/** Draw a glyph, read its alpha mask, and sample `count` points from it. */
function sampleGlyph(glyph: string, count: number): Float32Array {
  if (typeof document === "undefined") return circleFallback(count);

  const SIZE = 240;
  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return circleFallback(count);

  ctx.clearRect(0, 0, SIZE, SIZE);
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `${Math.floor(SIZE * 0.78)}px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", "Twemoji Mozilla", sans-serif`;
  ctx.fillText(glyph, SIZE / 2, SIZE / 2 + SIZE * 0.04);

  const data = ctx.getImageData(0, 0, SIZE, SIZE).data;

  // Collect opaque pixel coordinates.
  const pts: number[] = [];
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      if (data[(y * SIZE + x) * 4 + 3]! > 50) {
        pts.push(x, y);
      }
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
    // jitter within the source pixel so particles don't grid-align
    out[i * 3] = (px - SIZE / 2 + Math.random()) * scale;
    out[i * 3 + 1] = -(py - SIZE / 2 + Math.random()) * scale; // flip Y (screen→world)
    out[i * 3 + 2] = (Math.random() - 0.5) * DEPTH;
  }
  return out;
}

/** Build (and cache) a form's positions for a given particle count. */
const cache = new Map<string, Float32Array>();
export function getForm(name: string, count: number): Float32Array {
  const key = `${name}:${count}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const glyph = GLYPHS[name] ?? GLYPHS.globe!;
  const data = sampleGlyph(glyph, count);
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

export const SHAPE_NAMES = Object.keys(GLYPHS);
