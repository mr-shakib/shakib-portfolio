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
        sans: ["var(--font-archivo)", "system-ui", "sans-serif"],
        grotesk: ["var(--font-space-grotesk)", "var(--font-archivo)", "sans-serif"],
        display: ["var(--font-anton)", "var(--font-archivo)", "sans-serif"],
        signature: ["var(--font-caveat)", "cursive"],
        serif: ["var(--font-instrument-serif)", "Georgia", "serif"],
      },
      fontSize: {
        // Anton is a condensed display face — tight leading, no negative tracking.
        "display-2xl": ["clamp(4rem, 16vw, 15rem)", { lineHeight: "0.86", letterSpacing: "0.005em" }],
        "display-xl": ["clamp(3.25rem, 12vw, 11.5rem)", { lineHeight: "0.88", letterSpacing: "0.005em" }],
        "display-lg": ["clamp(2.75rem, 9vw, 8rem)", { lineHeight: "0.9", letterSpacing: "0.005em" }],
        "display-md": ["clamp(2rem, 6vw, 5rem)", { lineHeight: "0.95", letterSpacing: "0.01em" }],
        "heading": ["clamp(1.5rem, 3vw, 2.75rem)", { lineHeight: "1.05", letterSpacing: "0.01em" }],
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
        "topo-drift": {
          "0%": { backgroundPosition: "0px 0px" },
          "100%": { backgroundPosition: "760px 0px" },
        },
        "float-y": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" },
        },
        blob: {
          "0%, 100%": { transform: "rotate(0deg) scale(1)" },
          "50%": { transform: "rotate(7deg) scale(1.06)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.9)", opacity: "0.5" },
          "100%": { transform: "scale(1.35)", opacity: "0" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.6s ease-out forwards",
        "fade-up": "fade-up 0.7s var(--ease-out-expo) forwards",
        shimmer: "shimmer 2s infinite",
        "spin-slow": "spin-slow 8s linear infinite",
        "topo-drift": "topo-drift 70s linear infinite",
        "float-y": "float-y 6s ease-in-out infinite",
        blob: "blob 18s ease-in-out infinite",
        "pulse-ring": "pulse-ring 2.6s var(--ease-out-expo) infinite",
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
