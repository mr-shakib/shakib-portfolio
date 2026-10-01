import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge only knows Tailwind's built-in scales; unknown `text-*`
 * classes are treated as colors. Register the custom font sizes
 * (tailwind.config.ts) and outline utilities (globals.css) so merging
 * `text-display-xl` with `text-foreground` keeps both.
 */
const twMerge = extendTailwindMerge<"text-stroke">({
  extend: {
    classGroups: {
      "font-size": [{ text: ["display-2xl", "display-xl", "display-lg", "display-md", "heading"] }],
      "text-stroke": ["text-stroke", "text-stroke-accent", "text-stroke-md", "text-stroke-thick"],
    },
  },
});

/** Merge conditional class names with Tailwind conflict resolution. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
