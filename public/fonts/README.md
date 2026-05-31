# Fonts

- **Inter** and **Space Grotesk** are loaded automatically via `next/font/google`.
- **Clash Display** (display headers) must be added manually:
  1. Download `ClashDisplay-Variable.woff2` from
     https://www.fontshare.com/fonts/clash-display (free license).
  2. Place the file in this directory.
  3. Uncomment the `localFont` block in `src/styles/fonts.ts`.

Until Clash Display is added, display headings gracefully fall back to Space Grotesk.
