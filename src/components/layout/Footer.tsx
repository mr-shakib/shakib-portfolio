"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { navLinks, socialLinks, siteConfig } from "@/config/site";
import { HoverRoll } from "@/components/shared/HoverRoll";
import { scrollToId } from "@/lib/animations/lenis";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils/cn";

const EASE = [0.16, 1, 0.3, 1] as const;
const OLIVE = "#272921";
const CREAM = "#f1efe9";
const SAGE = "#b4ba7c";

const TECH_STRIP = [
  "PyTorch",
  "TensorFlow",
  "OpenCV",
  "Next.js",
  "React",
  "FastAPI",
  "PostgreSQL",
  "Docker",
];

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
          serif
            ? "px-1 font-serif italic"
            : "font-display uppercase tracking-[0.01em]",
        )}
        style={{ color: serif ? SAGE : CREAM }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/**
 * The grand sign-off: a volt glow over a notched olive panel with
 * topographic texture, an oversized mixed-typography statement crossed by the
 * handwritten signature, symmetric link columns around the portrait rising
 * from the bottom edge, a tool strip and the utility bar.
 */
export function Footer() {
  const year = new Date().getFullYear();
  const reduced = useReducedMotion();

  const scrollTop = () => {
    scrollToId("hero");
    window.history.replaceState(null, "", window.location.pathname);
  };

  return (
    <footer className="relative">
      {/* Volt glow peeking over the notched edge */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#eaffa3] via-accent to-accent"
      />

      {/* Notched top edge — flat shoulders, raised center tab */}
      <svg
        viewBox="0 0 1440 56"
        preserveAspectRatio="none"
        className="relative block h-14 w-full"
        aria-hidden
      >
        <path
          d="M0 56 L0 26 L572 26 C604 26 610 4 646 4 L794 4 C830 4 836 26 868 26 L1440 26 L1440 56 Z"
          fill={OLIVE}
        />
      </svg>

      <div className="bg-topo-dark relative -mt-px overflow-hidden" style={{ backgroundColor: OLIVE }}>
        {/* ── Statement with signature scrawl ─────────────────────────── */}
        <div className="container-content relative pt-10 text-center md:pt-16">
          <motion.span
            initial={reduced ? false : { opacity: 0, clipPath: "inset(0 100% 0 0)" }}
            whileInView={reduced ? undefined : { opacity: 1, clipPath: "inset(0 0% 0 0)" }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 1.4, delay: 0.6, ease: EASE }}
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 z-10 -translate-x-[20%] -rotate-12 font-signature text-6xl text-accent md:text-8xl"
          >
            Shakib
          </motion.span>

          <h2
            aria-label="Always chasing the signal."
            className="relative text-[clamp(2.75rem,8.5vw,7.5rem)] leading-[0.98]"
          >
            <span className="block" aria-hidden>
              <StatementWord delay={0.05} reduced={reduced}>
                Always
              </StatementWord>{" "}
              <StatementWord serif delay={0.15} reduced={reduced}>
                chasing
              </StatementWord>
            </span>
            <span className="block" aria-hidden>
              <StatementWord delay={0.25} reduced={reduced}>
                the
              </StatementWord>{" "}
              <StatementWord serif delay={0.35} reduced={reduced}>
                signal
              </StatementWord>
              <StatementWord delay={0.45} reduced={reduced}>
                .
              </StatementWord>
            </span>
          </h2>
        </div>

        {/* ── Columns flanking the rising portrait ────────────────────── */}
        <div className="relative mt-14 md:mt-20">
          {/* Portrait rising from the bottom, like the helmet on the shelf */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 110 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-5%" }}
            transition={{ duration: 1.4, ease: EASE }}
            className="pointer-events-none absolute bottom-0 left-1/2 z-0 h-[24rem] w-[min(78vw,400px)] -translate-x-1/2 md:h-[30rem]"
            aria-hidden
          >
            <Image
              src="/images/portrait-cutout.png"
              alt=""
              fill
              sizes="(max-width: 768px) 78vw, 400px"
              className="object-contain object-bottom [filter:saturate(0.5)_brightness(0.86)_contrast(1.05)]"
            />
          </motion.div>

          <div className="container-content relative z-10 flex justify-between gap-8 pb-[18rem] pt-4 md:pb-[20rem]">
            {/* Pages */}
            <nav aria-label="Footer" className="flex flex-col items-start gap-2 md:items-center md:text-center md:[flex-basis:33%]">
              <h3 className="mb-3 font-grotesk text-[10px] uppercase tracking-[0.35em] text-[#f1efe9]/50">
                Pages
              </h3>
              {navLinks
                .filter((l) => l.label !== "Resume")
                .map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group font-display text-2xl uppercase leading-tight text-[#f1efe9] md:text-3xl"
                  >
                    <HoverRoll>{link.label}</HoverRoll>
                  </Link>
                ))}
              <Link
                href="/resume"
                className="group mt-4 font-display text-2xl uppercase leading-tight text-accent md:text-3xl"
              >
                <HoverRoll incomingClassName="text-[#f1efe9]">Resume</HoverRoll>
              </Link>
            </nav>

            {/* center space is held by the portrait */}
            <div className="hidden md:block md:[flex-basis:33%]" />

            {/* Follow on */}
            <div className="flex flex-col items-end gap-2 md:items-center md:text-center md:[flex-basis:33%]">
              <h3 className="mb-3 font-grotesk text-[10px] uppercase tracking-[0.35em] text-[#f1efe9]/50">
                Follow on
              </h3>
              {socialLinks
                .filter((s) => s.label !== "Email")
                .map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group font-display text-2xl uppercase leading-tight text-[#f1efe9] md:text-3xl"
                  >
                    <HoverRoll>{s.label}</HoverRoll>
                  </a>
                ))}
              <a
                href={`mailto:${siteConfig.email}`}
                className="group mt-4 font-display text-2xl uppercase leading-tight text-accent md:text-3xl"
              >
                <HoverRoll incomingClassName="text-[#f1efe9]">Email</HoverRoll>
              </a>
            </div>
          </div>
        </div>

        {/* ── Tool strip (the partner wall) ───────────────────────────── */}
        <div className="relative z-10 border-t border-white/10">
          <ul className="container-content flex flex-wrap items-center justify-between gap-x-8 gap-y-3 py-7">
            {TECH_STRIP.map((tech) => (
              <li
                key={tech}
                className="font-display text-lg uppercase text-[#f1efe9]/40 transition-all duration-300 hover:-translate-y-0.5 hover:text-accent md:text-xl"
              >
                {tech}
              </li>
            ))}
          </ul>
        </div>

        {/* ── Utility bar ─────────────────────────────────────────────── */}
        <div className="relative z-10 border-t border-white/10">
          <div className="container-content flex flex-col items-center justify-between gap-4 py-6 font-grotesk text-[10px] uppercase tracking-[0.2em] text-[#f1efe9]/50 sm:flex-row">
            <p>
              © {year} {siteConfig.name} — All rights reserved
            </p>
            <p className="flex items-center gap-3">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              Open to collaboration — Dhaka, <LocalTime />
            </p>
            <button
              type="button"
              onClick={scrollTop}
              className="group flex items-center gap-2 uppercase tracking-[0.2em] transition-colors hover:text-[#f1efe9]"
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
