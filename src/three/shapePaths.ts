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
    // head
    "M50 6a9 9 0 100 18 9 9 0 000-18z " +
    // torso
    "M42 26h16l-2 30H44z " +
    // arms (down the sides)
    "M42 28l-12 24 5 2 11-22z M58 28l12 24-5 2-11-22z " +
    // legs
    "M44 54h5l-1 38h-6z M51 54h5l2 38h-6z",

  // Bar chart — four bars of increasing height on a baseline
  bars:
    "M14 84h72v6H14z " +
    "M20 58h12v24H20z M38 44h12v38H38z M56 32h12v50H56z M74 20h12v62H74z",

  // DNA double helix — two strands of dots that cross, joined by rungs
  helix:
    // strand A nodes (r=4)
    "M46 10a4 4 0 108 0 4 4 0 00-8 0z M64 17a4 4 0 108 0 4 4 0 00-8 0z " +
    "M46 23a4 4 0 108 0 4 4 0 00-8 0z M28 30a4 4 0 108 0 4 4 0 00-8 0z " +
    "M46 37a4 4 0 108 0 4 4 0 00-8 0z M64 43a4 4 0 108 0 4 4 0 00-8 0z " +
    "M46 50a4 4 0 108 0 4 4 0 00-8 0z M28 57a4 4 0 108 0 4 4 0 00-8 0z " +
    "M46 63a4 4 0 108 0 4 4 0 00-8 0z M64 70a4 4 0 108 0 4 4 0 00-8 0z " +
    "M46 77a4 4 0 108 0 4 4 0 00-8 0z M28 83a4 4 0 108 0 4 4 0 00-8 0z " +
    "M46 90a4 4 0 108 0 4 4 0 00-8 0z " +
    // strand B nodes (mirror)
    "M28 17a4 4 0 108 0 4 4 0 00-8 0z M64 30a4 4 0 108 0 4 4 0 00-8 0z " +
    "M28 43a4 4 0 108 0 4 4 0 00-8 0z M64 57a4 4 0 108 0 4 4 0 00-8 0z " +
    "M28 70a4 4 0 108 0 4 4 0 00-8 0z M64 83a4 4 0 108 0 4 4 0 00-8 0z " +
    // rungs joining the strands at the wide rows
    "M32 15h36v4H32z M32 28h36v4H32z M32 41h36v4H32z " +
    "M32 55h36v4H32z M32 68h36v4H32z M32 81h36v4H32z",

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

  // Trend — bold upward arrow (achievements / growth)
  trend:
    // thick diagonal shaft from lower-left to upper-right
    "M14 80L72 22l7 7L21 87z " +
    // solid arrowhead at the top-right tip
    "M82 18L54 22l22 24z",

  // Envelope — rectangle with flap
  envelope:
    "M14 26h72v48H14z M14 26l36 28 36-28v8L50 62 14 34z",
};

export const SHAPE_NAMES = Object.keys(SHAPE_PATHS);
