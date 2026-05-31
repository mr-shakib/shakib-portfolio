import { Inter, Space_Grotesk } from "next/font/google";
import localFont from "next/font/local";

/**
 * Inter (body) and Space Grotesk (sub-headers) are served via next/font/google
 * with self-hosting + `display: swap` for zero layout shift.
 *
 * Clash Display (premium display headers) is loaded locally from
 * /public/fonts/ClashDisplay-Variable.woff2.
 */

export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
});

export const clashDisplay = localFont({
  src: "../../public/fonts/ClashDisplay-Variable.woff2",
  weight: "200 700",
  display: "swap",
  variable: "--font-clash-display",
});

export const fontVariables =
  `${inter.variable} ${spaceGrotesk.variable} ${clashDisplay.variable}`.trim();
