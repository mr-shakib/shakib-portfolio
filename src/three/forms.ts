import * as THREE from "three";

/**
 * Parametric point-cloud generators. Each fills a Float32Array(count*3) with a
 * recognizable shape, normalized to roughly fit a ~10-unit box and centered at
 * the origin. These are the "meaningful" forms the background morphs between,
 * one per page section.
 */

type FormFn = (count: number) => Float32Array;

const rnd = () => Math.random() - 0.5;

/** Hero — a wireframe globe (knowledge / the world). */
const globe: FormFn = (count) => {
  const a = new Float32Array(count * 3);
  const r = 5;
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const rad = Math.sqrt(1 - y * y);
    const theta = golden * i;
    a[i * 3] = Math.cos(theta) * rad * r;
    a[i * 3 + 1] = y * r;
    a[i * 3 + 2] = Math.sin(theta) * rad * r;
  }
  return a;
};

/** About — a human-ish silhouette of stacked rings (head + shoulders). */
const figure: FormFn = (count) => {
  const a = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const t = Math.random();
    let y: number, ringR: number;
    if (t < 0.4) {
      // head
      y = 3.4 + rnd() * 1.6;
      ringR = 1.4;
    } else {
      // body taper
      const b = (t - 0.4) / 0.6;
      y = 1.8 - b * 5;
      ringR = 1.6 + b * 2.6;
    }
    const ang = Math.random() * Math.PI * 2;
    a[i * 3] = Math.cos(ang) * ringR;
    a[i * 3 + 1] = y;
    a[i * 3 + 2] = Math.sin(ang) * ringR * 0.5 + rnd();
  }
  return a;
};

/** Stats — a 3D bar chart (growth / metrics). */
const bars: FormFn = (count) => {
  const a = new Float32Array(count * 3);
  const n = 6;
  const heights = [2.5, 4, 3.2, 5.5, 4.6, 6.4];
  for (let i = 0; i < count; i++) {
    const b = i % n;
    const h = heights[b]!;
    const x = (b - (n - 1) / 2) * 1.8;
    a[i * 3] = x + rnd() * 1.1;
    a[i * 3 + 1] = -4 + Math.random() * h;
    a[i * 3 + 2] = rnd() * 1.1;
  }
  return a;
};

/** Research — a DNA double helix (science / discovery). */
const helix: FormFn = (count) => {
  const a = new Float32Array(count * 3);
  const turns = 3;
  const R = 2.2;
  const H = 11;
  for (let i = 0; i < count; i++) {
    const t = i / count;
    const ang = t * Math.PI * 2 * turns;
    const y = (t - 0.5) * H;
    const r = i % 5 === 0 ? Math.random() * R : R; // some rungs across
    const strand = i % 2 === 0 ? 0 : Math.PI;
    a[i * 3] = Math.cos(ang + strand) * r;
    a[i * 3 + 1] = y;
    a[i * 3 + 2] = Math.sin(ang + strand) * r;
  }
  return a;
};

/** Featured publication — a leaf (the eggplant-leaf dataset). */
const leaf: FormFn = (count) => {
  const a = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    // leaf outline via |y| = f(x); fill area under the curve
    const u = Math.random(); // 0..1 along length
    const x = (u - 0.5) * 10;
    const width = Math.sin(u * Math.PI) * 3.2 * (1 - u * 0.25);
    const v = (Math.random() - 0.5) * 2 * width;
    // midrib + veins emphasis: keep some points near center line
    const y = v;
    a[i * 3] = x;
    a[i * 3 + 1] = y;
    a[i * 3 + 2] = rnd() * 0.8;
  }
  return a;
};

/** Projects — a cubic lattice / grid (engineering / structure). */
const lattice: FormFn = (count) => {
  const a = new Float32Array(count * 3);
  const n = 5;
  const gap = 2.2;
  const off = ((n - 1) * gap) / 2;
  for (let i = 0; i < count; i++) {
    const gx = Math.floor(Math.random() * n);
    const gy = Math.floor(Math.random() * n);
    const gz = Math.floor(Math.random() * n);
    a[i * 3] = gx * gap - off + rnd() * 0.5;
    a[i * 3 + 1] = gy * gap - off + rnd() * 0.5;
    a[i * 3 + 2] = gz * gap - off + rnd() * 0.5;
  }
  return a;
};

/** Skills — an atom (orbits around a nucleus). */
const atom: FormFn = (count) => {
  const a = new Float32Array(count * 3);
  const R = 4.4;
  for (let i = 0; i < count; i++) {
    if (i % 7 === 0) {
      // nucleus
      a[i * 3] = rnd() * 1.4;
      a[i * 3 + 1] = rnd() * 1.4;
      a[i * 3 + 2] = rnd() * 1.4;
      continue;
    }
    const orbit = i % 3;
    const t = Math.random() * Math.PI * 2;
    const x = Math.cos(t) * R;
    const y = Math.sin(t) * R;
    const jitter = rnd() * 0.4;
    if (orbit === 0) {
      a[i * 3] = x + jitter;
      a[i * 3 + 1] = y + jitter;
      a[i * 3 + 2] = jitter;
    } else if (orbit === 1) {
      a[i * 3] = x + jitter;
      a[i * 3 + 1] = y * 0.5 + jitter;
      a[i * 3 + 2] = y * 0.86 + jitter;
    } else {
      a[i * 3] = x + jitter;
      a[i * 3 + 1] = y * 0.5 + jitter;
      a[i * 3 + 2] = -y * 0.86 + jitter;
    }
  }
  return a;
};

/** Achievements — an upward growth/trend curve. */
const trend: FormFn = (count) => {
  const a = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const u = Math.random();
    const x = (u - 0.5) * 11;
    // exponential-ish rise with scatter, like a data trend
    const base = Math.pow(u, 1.6) * 9 - 4.5;
    a[i * 3] = x;
    a[i * 3 + 1] = base + rnd() * 1.2;
    a[i * 3 + 2] = rnd() * 1.4;
  }
  return a;
};

/** Contact — an envelope. */
const envelope: FormFn = (count) => {
  const a = new Float32Array(count * 3);
  const W = 8;
  const H = 5;
  for (let i = 0; i < count; i++) {
    const r = Math.random();
    let x: number, y: number;
    if (r < 0.55) {
      // rectangle outline
      const edge = Math.floor(Math.random() * 4);
      if (edge === 0) {
        x = (Math.random() - 0.5) * W;
        y = H / 2;
      } else if (edge === 1) {
        x = (Math.random() - 0.5) * W;
        y = -H / 2;
      } else if (edge === 2) {
        x = -W / 2;
        y = (Math.random() - 0.5) * H;
      } else {
        x = W / 2;
        y = (Math.random() - 0.5) * H;
      }
    } else {
      // the flap (two diagonals from top corners to center)
      const s = Math.random();
      const side = Math.random() < 0.5 ? -1 : 1;
      x = side * (W / 2) * (1 - s);
      y = H / 2 - s * (H / 2 + 0.2);
    }
    a[i * 3] = x;
    a[i * 3 + 1] = y;
    a[i * 3 + 2] = rnd() * 0.7;
  }
  return a;
};

export const FORMS: Record<string, FormFn> = {
  globe,
  figure,
  bars,
  helix,
  leaf,
  lattice,
  atom,
  trend,
  envelope,
};

export type FormName = keyof typeof FORMS;

/** Build (and cache) a form's positions for a given particle count. */
const cache = new Map<string, Float32Array>();
export function getForm(name: string, count: number): Float32Array {
  const key = `${name}:${count}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const fn = FORMS[name] ?? FORMS.globe!;
  const data = fn(count);
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
  void THREE.MathUtils;
  return out;
}
