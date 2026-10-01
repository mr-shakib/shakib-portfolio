"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { navLinks, siteConfig } from "@/config/site";
import type { SectionContent } from "@/lib/sections/registry";
import { stripEmphasis } from "@/components/shared/Emphasis";
import { HoverRoll } from "@/components/shared/HoverRoll";
import { scrollToId } from "@/lib/animations/lenis";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils/cn";

const EASE = [0.16, 1, 0.3, 1] as const;
// Footer shares the site's dark canvas + volt accent so it reads as the page's
// natural conclusion rather than a separate panel.
const FOREGROUND = "var(--color-foreground)";
const ACCENT = "var(--color-accent)";

/** Live clock in Dhaka time — the "where I am right now" detail. */
function LocalTime() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Dhaka",
    });
    const update = () => setTime(fmt.format(new Date()));
    update();
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, []);

  return <span className="tabular-nums">{time ?? "--:--"} GMT+6</span>;
}

/** One word of the statement, rising out of its own mask. */
function StatementWord({
  children,
  serif,
  delay,
  reduced,
}: {
  children: string;
  serif?: boolean;
  delay: number;
  reduced: boolean;
}) {
  return (
    <span className="inline-block overflow-hidden align-bottom">
      <motion.span
        initial={reduced ? false : { y: "115%" }}
        whileInView={reduced ? undefined : { y: "0%" }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 1, delay, ease: EASE }}
        className={cn(
          "inline-block",
          serif ? "px-1 font-serif italic" : "font-display uppercase tracking-[0.01em]",
        )}
        style={{ color: serif ? ACCENT : FOREGROUND }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/** Split the statement into words; *starred* words get the serif treatment. */
function statementWords(text: string) {
  const words: { text: string; serif: boolean; spaced: boolean }[] = [];
  const re = /\*([^*]+)\*|([^\s*]+)/g;
  let last = 0;
  for (let m = re.exec(text); m; m = re.exec(text)) {
    words.push({
      text: m[1] ?? m[2] ?? "",
      serif: m[1] !== undefined,
      spaced: words.length > 0 && /\s/.test(text.slice(last, m.index)),
    });
    last = m.index + m[0].length;
  }
  return words;
}

/**
 * Compact sign-off: a volt glow over a notched olive panel — a mixed-typography
 * statement crossed by the signature, then a tidy brand / pages / connect row
 * and the utility bar. No oversized hero artwork, so it stays the right height.
 */
export function Footer({
  content,
  profile,
}: {
  content: SectionContent<"footer">;
  profile: SectionContent<"profile">;
}) {
  const year = new Date().getFullYear();
  const reduced = useReducedMotion();

  const scrollTop = () => {
    scrollToId("hero");
    window.history.replaceState(null, "", window.location.pathname);
  };

  return (
    <footer className="relative">
      {/* Volt glow peeking over the notched edge (contained to the notch band
          so it reads as a top accent, not a band bleeding into the footer) */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-[#eaffa3] to-accent"
      />

      {/* Notched top edge — flat shoulders, raised center tab. Filled with the
          site's dark so the volt glow only shows through the cutout. */}
      <svg
        viewBox="0 0 1440 56"
        preserveAspectRatio="none"
        className="relative block h-12 w-full"
        aria-hidden
      >
        <path
          d="M0 56 L0 26 L572 26 C604 26 610 4 646 4 L794 4 C830 4 836 26 868 26 L1440 26 L1440 56 Z"
          fill="var(--color-background)"
        />
      </svg>

      <div className="relative -mt-px overflow-hidden">
        {/* ── Statement with signature scrawl ─────────────────────────── */}
        <div className="container-content relative pb-10 pt-10 text-center md:pb-12 md:pt-14">
          <motion.span
            initial={reduced ? false : { opacity: 0, clipPath: "inset(0 100% 0 0)" }}
            whileInView={reduced ? undefined : { opacity: 1, clipPath: "inset(0 0% 0 0)" }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 1.4, delay: 0.5, ease: EASE }}
            aria-hidden
            className="pointer-events-none absolute right-[14%] top-0 z-10 -rotate-12 font-signature text-5xl text-accent md:text-6xl"
          >
            {content.signature}
          </motion.span>

          <h2
            aria-label={stripEmphasis(content.statement)}
            className="relative text-[clamp(2.25rem,6.5vw,5rem)] leading-[0.98]"
          >
            <span aria-hidden>
              {statementWords(content.statement).map((word, i) => (
                <span key={i}>
                  {word.spaced && " "}
                  <StatementWord serif={word.serif} delay={0.05 + i * 0.1} reduced={reduced}>
                    {word.text}
                  </StatementWord>
                </span>
              ))}
            </span>
          </h2>
        </div>

        {/* ── Brand / Pages / Connect ─────────────────────────────────── */}
        <div className="container-content grid gap-10 border-t border-white/10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
          {/* Brand */}
          <div className="flex flex-col items-start gap-4">
            <Link
              href="/"
              onClick={(e) => {
                e.preventDefault();
                scrollTop();
              }}
              className="font-display text-3xl uppercase leading-none text-foreground transition-colors hover:text-accent"
            >
              SH<span className="text-accent">—</span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-foreground/55">{content.blurb}</p>
            <a
              href={`mailto:${profile.email}`}
              className="btn-sweep group mt-1 inline-flex items-center gap-3 border border-white/25 px-5 py-3 font-grotesk text-[11px] uppercase tracking-[0.25em] text-foreground transition-colors duration-300 hover:border-accent hover:text-[#16170f]"
            >
              {profile.email}
              <span
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </a>
          </div>

          {/* Pages */}
          <nav aria-label="Footer" className="flex flex-col items-start gap-1.5">
            <h3 className="mb-2 font-grotesk text-[10px] uppercase tracking-[0.35em] text-foreground/50">
              Pages
            </h3>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "group font-display text-xl uppercase leading-tight",
                  link.label === "Resume" ? "text-accent" : "text-foreground",
                )}
              >
                <HoverRoll incomingClassName={link.label === "Resume" ? "text-foreground" : "text-accent"}>
                  {link.label}
                </HoverRoll>
              </Link>
            ))}
          </nav>

          {/* Connect */}
          <div className="flex flex-col items-start gap-1.5">
            <h3 className="mb-2 font-grotesk text-[10px] uppercase tracking-[0.35em] text-foreground/50">
              Connect
            </h3>
            {profile.socials
              .filter((s) => s.label.toLowerCase() !== "email" && !s.href.startsWith("mailto:"))
              .map((s) => (
                <a
                  key={`${s.label}-${s.href}`}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group font-display text-xl uppercase leading-tight text-foreground"
                >
                  <HoverRoll>{s.label}</HoverRoll>
                </a>
              ))}
          </div>
        </div>

        {/* ── Utility bar ─────────────────────────────────────────────── */}
        <div className="relative z-10 border-t border-white/10">
          <div className="container-content flex flex-col items-center justify-between gap-4 py-5 font-grotesk text-[10px] uppercase tracking-[0.2em] text-foreground/50 sm:flex-row">
            <p>
              © {year} {siteConfig.name} — All rights reserved
            </p>
            <p className="flex items-center gap-3">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              {profile.availability} — {profile.location}, <LocalTime />
            </p>
            <button
              type="button"
              onClick={scrollTop}
              className="group flex items-center gap-2 uppercase tracking-[0.2em] transition-colors hover:text-foreground"
            >
              Back to top
              <span className="relative inline-flex h-6 w-6 items-center justify-center overflow-hidden rounded-full border border-white/20 transition-colors duration-300 group-hover:border-accent">
                <span
                  aria-hidden
                  className="transition-transform duration-300 group-hover:-translate-y-5 group-hover:text-accent"
                >
                  ↑
                </span>
                <span
                  aria-hidden
                  className="absolute translate-y-5 text-accent transition-transform duration-300 group-hover:translate-y-0"
                >
                  ↑
                </span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
