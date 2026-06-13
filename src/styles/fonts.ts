import { Anton, Archivo, Caveat, Space_Grotesk } from "next/font/google";
import localFont from "next/font/local";

/**
 * Type system for the athletic-brand identity:
 *  - Anton        — towering condensed uppercase display headlines
 *  - Archivo      — body copy and UI text
 *  - Space Grotesk — eyebrows, labels and technical metadata
 *  - Caveat       — handwritten signature moments
 * All served via next/font/google with self-hosting + `display: swap`.
 */

export const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-anton",
});

export const archivo = Archivo({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-archivo",
});

export const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
});

export const caveat = Caveat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-caveat",
});

/** Self-hosted (OFL) — elegant serif for the mixed-typography statements. */
export const instrumentSerif = localFont({
  src: [
    {
      path: "../../public/fonts/InstrumentSerif-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/InstrumentSerif-Italic.woff2",
      weight: "400",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--font-instrument-serif",
});

export const fontVariables =
  `${anton.variable} ${archivo.variable} ${spaceGrotesk.variable} ${caveat.variable} ${instrumentSerif.variable}`.trim();
