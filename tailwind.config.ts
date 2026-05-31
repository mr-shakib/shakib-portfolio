import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./src/**/*.{ts,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        surface: "var(--color-surface)",
        "surface-elevated": "var(--color-surface-elevated)",
        foreground: "var(--color-foreground)",
        muted: "var(--color-muted)",
        accent: {
          DEFAULT: "var(--color-accent)",
          soft: "var(--color-accent-soft)",
        },
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        error: "var(--color-error)",
        border: "var(--color-border)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        grotesk: ["var(--font-space-grotesk)", "var(--font-inter)", "sans-serif"],
        display: ["var(--font-clash-display)", "var(--font-space-grotesk)", "sans-serif"],
      },
      fontSize: {
        "display-2xl": ["clamp(3.5rem, 14vw, 13rem)", { lineHeight: "0.85", letterSpacing: "-0.04em" }],
        "display-xl": ["clamp(3rem, 11vw, 10.5rem)", { lineHeight: "0.9", letterSpacing: "-0.035em" }],
        "display-lg": ["clamp(2.5rem, 8vw, 7rem)", { lineHeight: "0.95", letterSpacing: "-0.03em" }],
        "display-md": ["clamp(2rem, 5.5vw, 4.5rem)", { lineHeight: "1", letterSpacing: "-0.025em" }],
        "heading": ["clamp(1.5rem, 3vw, 2.75rem)", { lineHeight: "1.05", letterSpacing: "-0.015em" }],
      },
      spacing: {
        section: "clamp(5rem, 12vh, 10rem)",
        gutter: "clamp(1.25rem, 5vw, 6rem)",
      },
      maxWidth: {
        content: "1440px",
        prose: "68ch",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "in-out-expo": "cubic-bezier(0.87, 0, 0.13, 1)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(1.5rem)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "spin-slow": {
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.6s ease-out forwards",
        "fade-up": "fade-up 0.7s var(--ease-out-expo) forwards",
        shimmer: "shimmer 2s infinite",
        "spin-slow": "spin-slow 8s linear infinite",
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(to right, var(--color-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)",
        "radial-accent":
          "radial-gradient(circle at 50% 0%, var(--color-accent-soft), transparent 60%)",
      },
    },
  },
  plugins: [],
};

export default config;
