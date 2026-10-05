/**
 * Builds src/lib/maps/bangladesh-geo.json: the 64 district outlines as SVG
 * path strings, already projected (Web Mercator) into a 600-unit-wide box, plus
 * an interior anchor point per district for pins.
 *
 *   npx tsx scripts/build-bd-map.ts
 *
 * Source: geoBoundaries BGD ADM2 (Bangladesh Bureau of Statistics / OCHA),
 * CC BY 3.0 IGO — the site credits it under the map. Simplification runs
 * through mapshaper (fetched by npx), which simplifies shared borders once so
 * neighbouring districts still meet exactly.
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { DISTRICTS, type DistrictId } from "../src/lib/maps/districts";

const SOURCE =
  "https://github.com/wmgeolab/geoBoundaries/raw/9469f09/releaseData/gbOpen/BGD/ADM2/geoBoundaries-BGD-ADM2_simplified.geojson";
const OUT = join(import.meta.dirname, "../src/lib/maps/bangladesh-geo.json");
const WIDTH = 600;
const PAD = 4;
/** Share of vertices kept, and the smallest island kept. */
const SIMPLIFY = "8%";
const MIN_ISLAND = "15km2";

/** Source spellings that differ from the current official names. */
const RENAMED: Record<string, DistrictId> = {
  Barisal: "barishal",
  Bogra: "bogura",
  Brahamanbaria: "brahmanbaria",
  Chittagong: "chattogram",
  Comilla: "cumilla",
  "Cox's Bazar": "coxs-bazar",
  Jessore: "jashore",
  Jhalokati: "jhalokathi",
  Maulvibazar: "moulvibazar",
  Nawabganj: "chapai-nawabganj",
  Netrakona: "netrokona",
};

type Ring = [number, number][];
type Polygon = Ring[];
interface Feature {
  properties: { shapeName: string };
  geometry:
    | { type: "Polygon"; coordinates: Polygon }
    | { type: "MultiPolygon"; coordinates: Polygon[] };
}

async function main() {
  const dir = mkdtempSync(join(tmpdir(), "bd-map-"));
  const raw = join(dir, "source.geojson");
  const simplified = join(dir, "simplified.geojson");

  console.log("Downloading boundaries…");
  const res = await fetch(SOURCE);
  if (!res.ok) throw new Error(`Download failed: ${res.status}`);
  writeFileSync(raw, Buffer.from(await res.arrayBuffer()));

  console.log("Simplifying…");
  execFileSync(
    "npx",
    [
      "-y",
      "mapshaper@0.6",
      raw,
      "-simplify",
      SIMPLIFY,
      "keep-shapes",
      "-filter-islands",
      `min-area=${MIN_ISLAND}`,
      "remove-empty",
      "-o",
      "format=geojson",
      "precision=0.0001",
      simplified,
    ],
    { stdio: "inherit" },
  );

  const features = (JSON.parse(readFileSync(simplified, "utf8")) as { features: Feature[] })
    .features;
  const shapes = new Map<DistrictId, Polygon[]>();
  for (const f of features) {
    const name = f.properties.shapeName;
    const id = RENAMED[name] ?? (name.toLowerCase().replace(/[^a-z]+/g, "-") as DistrictId);
    if (!DISTRICTS.some((d) => d.id === id)) throw new Error(`Unknown district in source: ${name}`);
    shapes.set(
      id,
      f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates,
    );
  }
  const missing = DISTRICTS.filter((d) => !shapes.has(d.id)).map((d) => d.name);
  if (missing.length) throw new Error(`Missing from source: ${missing.join(", ")}`);

  // Web Mercator, then fit the whole country into WIDTH with PAD on each side.
  const merc = ([lon, lat]: [number, number]): [number, number] => [
    lon,
    (-Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360)) * 180) / Math.PI,
  ];
  const all = [...shapes.values()].flat(3).map(merc);
  const minX = Math.min(...all.map((p) => p[0]));
  const maxX = Math.max(...all.map((p) => p[0]));
  const minY = Math.min(...all.map((p) => p[1]));
  const maxY = Math.max(...all.map((p) => p[1]));
  const k = (WIDTH - 2 * PAD) / (maxX - minX);
  const height = Math.ceil((maxY - minY) * k + 2 * PAD);
  const round = (v: number) => Math.round(v * 10) / 10;
  const project = (p: [number, number]): [number, number] => {
    const [x, y] = merc(p);
    return [round((x - minX) * k + PAD), round((y - minY) * k + PAD)];
  };

  const districts: Record<string, { d: string; c: [number, number] }> = {};
  for (const { id } of DISTRICTS) {
    const polygons = shapes.get(id)!.map((poly) => poly.map((ring) => dedupe(ring.map(project))));
    const d = polygons
      .flat()
      .filter((ring) => ring.length >= 4)
      .map((ring) => {
        const pts = ring.slice(0, -1); // Z closes the ring
        return `M${pts[0]!.join(",")}L${pts
          .slice(1)
          .map((p) => p.join(","))
          .join(" ")}Z`;
      })
      .join("");
    const largest = polygons.reduce((a, b) =>
      Math.abs(area(b[0]!)) > Math.abs(area(a[0]!)) ? b : a,
    );
    districts[id] = { d, c: interiorPoint(largest) };
  }

  writeFileSync(OUT, JSON.stringify({ width: WIDTH, height, districts }) + "\n");
  const kb = (readFileSync(OUT).length / 1024).toFixed(1);
  console.log(`Wrote ${OUT} (${kb} KB, ${WIDTH}×${height})`);
}

function dedupe(ring: Ring): Ring {
  return ring.filter((p, i) => i === 0 || p[0] !== ring[i - 1]![0] || p[1] !== ring[i - 1]![1]);
}

function area(ring: Ring): number {
  let s = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    s += (ring[j]![0] - ring[i]![0]) * (ring[j]![1] + ring[i]![1]);
  }
  return s / 2;
}

function inside([x, y]: [number, number], ring: Ring): boolean {
  let hit = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i]!;
    const [xj, yj] = ring[j]!;
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
}

function edgeDistance([x, y]: [number, number], rings: Ring[]): number {
  let best = Infinity;
  for (const ring of rings) {
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const [ax, ay] = ring[j]!;
      const [bx, by] = ring[i]!;
      const dx = bx - ax;
      const dy = by - ay;
      const t =
        dx || dy
          ? Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy)))
          : 0;
      best = Math.min(best, Math.hypot(x - (ax + t * dx), y - (ay + t * dy)));
    }
  }
  return best;
}

/** The point deepest inside the polygon (grid search) — always inside, unlike a centroid. */
function interiorPoint([outer, ...holes]: Polygon): [number, number] {
  const xs = outer!.map((p) => p[0]);
  const ys = outer!.map((p) => p[1]);
  let best: [number, number] = outer![0]!;
  let bestD = -1;
  for (let x = Math.min(...xs); x <= Math.max(...xs); x += 0.5) {
    for (let y = Math.min(...ys); y <= Math.max(...ys); y += 0.5) {
      const p: [number, number] = [x, y];
      if (!inside(p, outer!) || holes.some((h) => inside(p, h))) continue;
      const d = edgeDistance(p, [outer!, ...holes]);
      if (d > bestD) [best, bestD] = [p, d];
    }
  }
  return [Math.round(best[0] * 10) / 10, Math.round(best[1] * 10) / 10];
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
