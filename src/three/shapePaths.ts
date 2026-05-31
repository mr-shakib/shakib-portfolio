/**
 * Hand-authored SVG path data for each background form, in a 100×100 viewBox.
 * These are filled to an offscreen canvas and sampled — device-independent and
 * tofu-proof (unlike system emoji, which render as rectangles when missing).
 *
 * Paths are deliberately solid/filled silhouettes so the particle mask reads
 * clearly. Multiple subpaths are allowed (evenodd holes are fine).
 */
export const SHAPE_PATHS: Record<string, string> = {
  // Globe — circle with meridian/parallел lines as a filled ring set
  globe:
    "M50 6a44 44 0 100 88 44 44 0 000-88zm0 8a36 36 0 110 72 36 36 0 010-72z " +
    "M46 14h8v72h-8z M14 46h72v8H14z " +
    "M50 14c14 8 22 22 22 36s-8 28-22 36c-14-8-22-22-22-36s8-28 22-36zm0 11c-9 7-14 16-14 25s5 18 14 25c9-7 14-16 14-25s-5-18-14-25z",

  // Person — head + shoulders silhouette
  figure:
    "M50 12a14 14 0 100 28 14 14 0 000-28z " +
    "M50 44c-16 0-26 11-28 27-1 6 3 11 9 11h38c6 0 10-5 9-11-2-16-12-27-28-27z",

  // Bar chart — four bars of increasing height on a baseline
  bars:
    "M14 84h72v6H14z " +
    "M20 58h12v24H20z M38 44h12v38H38z M56 32h12v50H56z M74 20h12v62H74z",

  // DNA double helix — two sine strands + rungs
  helix:
    "M30 8c0 14 40 18 40 34S30 78 30 92h6c0-12 40-16 40-34S36 22 36 8z " +
    "M70 8c0 14-40 18-40 34s40 20 40 34h-6c0-12-40-16-40-34S64 22 64 8z " +
    "M34 24h32v5H34z M30 40h40v5H30z M30 56h40v5H30z M34 72h32v5H34z",

  // Leaf — teardrop blade with a midrib
  leaf:
    "M78 16C44 16 20 38 20 70c0 6 1 11 3 16 30-2 55-26 55-58 0-4 0-8 0-12z " +
    "M30 80C44 60 60 44 76 30l4 4C64 50 48 66 36 86z",

  // Gear — cog with teeth and a center hole (projects/engineering)
  lattice:
    "M50 8l6 10 11-3 1 11 11 4-5 10 8 8-8 8 5 10-11 4-1 11-11-3-6 10-6-10-11 3-1-11-11-4 5-10-8-8 8-8-5-10 11-4 1-11 11 3z " +
    "M50 36a14 14 0 100 28 14 14 0 000-28zm0 8a6 6 0 110 12 6 6 0 010-12z",

  // Atom — nucleus + three elliptical orbits
  atom:
    "M50 44a6 6 0 100 12 6 6 0 000-12z " +
    "M50 14C32 14 18 30 18 50s14 36 32 36 32-16 32-36S68 14 50 14zm0 6c14 0 26 13 26 30S64 80 50 80 24 67 24 50 36 20 50 20z " +
    "M22 32c14-8 42-8 56 0l-3 5c-12-7-38-7-50 0z " +
    "M22 68c14 8 42 8 56 0l-3-5c-12 7-38 7-50 0z",

  // Trend — upward arrow line with arrowhead (achievements)
  trend:
    "M16 78L40 52l14 12 22-30 6 5-26 35-14-12-22 23z " +
    "M64 30h20v6H70v14h-6z",

  // Envelope — rectangle with flap
  envelope:
    "M14 26h72v48H14z M14 26l36 28 36-28v8L50 62 14 34z",
};

export const SHAPE_NAMES = Object.keys(SHAPE_PATHS);
