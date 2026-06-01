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

/* ---- Network: fixed node anchors + edges, shared by points and lines ---- */

const NETWORK_RADIUS = FIT * 0.5;
const NETWORK_NODE_COUNT = 34;

/** Deterministic 3D node anchors on a sphere-ish volume (Fibonacci + jitter). */
function buildNetworkNodes(): Array<[number, number, number]> {
  const nodes: Array<[number, number, number]> = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  // seeded-ish pseudo-random for stable jitter
  let seed = 1337;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  for (let i = 0; i < NETWORK_NODE_COUNT; i++) {
    const y = 1 - (i / (NETWORK_NODE_COUNT - 1)) * 2;
    const rad = Math.sqrt(1 - y * y);
    const theta = golden * i;
    const depth = 0.55 + rand() * 0.45; // vary radius so it's a volume, not a shell
    nodes.push([
      Math.cos(theta) * rad * NETWORK_RADIUS * depth,
      y * NETWORK_RADIUS * depth,
      Math.sin(theta) * rad * NETWORK_RADIUS * depth,
    ]);
  }
  return nodes;
}

export const NETWORK_NODES = buildNetworkNodes();

/** Edges between nearby nodes — the connecting lines of the network. */
export const NETWORK_EDGES: Array<[number, number]> = (() => {
  const edges: Array<[number, number]> = [];
  const maxDist = NETWORK_RADIUS * 0.85;
  for (let i = 0; i < NETWORK_NODES.length; i++) {
    for (let j = i + 1; j < NETWORK_NODES.length; j++) {
      const a = NETWORK_NODES[i]!;
      const b = NETWORK_NODES[j]!;
      const dx = a[0] - b[0];
      const dy = a[1] - b[1];
      const dz = a[2] - b[2];
      if (Math.sqrt(dx * dx + dy * dy + dz * dz) < maxDist) edges.push([i, j]);
    }
  }
  return edges;
})();

/**
 * Network form: most particles cluster tightly on the node anchors (so the
 * nodes read as bright dots), the rest scatter along the connecting edges.
 */
function network3D(count: number): Float32Array {
  const a = new Float32Array(count * 3);
  const nodes = NETWORK_NODES;
  const edges = NETWORK_EDGES;
  for (let i = 0; i < count; i++) {
    if (i % 3 === 0 && edges.length > 0) {
      // a point somewhere along a random edge
      const e = edges[(Math.random() * edges.length) | 0]!;
      const n1 = nodes[e[0]]!;
      const n2 = nodes[e[1]]!;
      const k = Math.random();
      a[i * 3] = n1[0] + (n2[0] - n1[0]) * k + (Math.random() - 0.5) * 0.15;
      a[i * 3 + 1] = n1[1] + (n2[1] - n1[1]) * k + (Math.random() - 0.5) * 0.15;
      a[i * 3 + 2] = n1[2] + (n2[2] - n1[2]) * k + (Math.random() - 0.5) * 0.15;
    } else {
      // tight cluster on a node
      const nNode = nodes[(Math.random() * nodes.length) | 0]!;
      a[i * 3] = nNode[0] + (Math.random() - 0.5) * 0.6;
      a[i * 3 + 1] = nNode[1] + (Math.random() - 0.5) * 0.6;
      a[i * 3 + 2] = nNode[2] + (Math.random() - 0.5) * 0.6;
    }
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
  globe: network3D,
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
