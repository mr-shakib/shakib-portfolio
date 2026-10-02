"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { navLinks, siteConfig } from "@/config/site";
import type { SectionContent } from "@/lib/sections/registry";
import { emphasisWords, stripEmphasis } from "@/components/shared/Emphasis";
import { HoverRoll } from "@/components/shared/HoverRoll";
import { getLenis } from "@/lib/animations/lenis";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils/cn";

const EASE = [0.16, 1, 0.3, 1] as const;

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

/** One word of the statement, rising out of its own mask once `show` is set. */
function StatementWord({
  children,
  serif,
  delay,
  reduced,
  show,
}: {
  children: string;
  serif?: boolean;
  delay: number;
  reduced: boolean;
  show: boolean;
}) {
  return (
    <span className="inline-block overflow-hidden align-bottom">
      <motion.span
        initial={reduced ? false : { y: "115%" }}
        animate={reduced || !show ? undefined : { y: "0%" }}
        transition={{ duration: 1, delay, ease: EASE }}
        className={cn(
          "inline-block",
          // Serif scaled to share Anton's cap height (see SplitHeading).
          serif
            ? "font-serif text-[1.18em] leading-[0.9] text-accent"
            : "font-display tracking-[0.01em] text-foreground",
        )}
      >
        {children}
      </motion.span>
    </span>
  );
}

function ColumnLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 font-grotesk text-[10px] uppercase tracking-[0.35em] text-foreground/45">
      {children}
    </p>
  );
}

const linkClass =
  "group block font-display text-[clamp(1.35rem,1.9vw,1.9rem)] uppercase leading-[1.08]";

/**
 * Closing poster: an ink panel set into a volt field with the site's notched
 * tab, topographic lines behind. A giant mixed-type statement crossed by the
 * signature tops it; pages and socials flank a head-and-shoulders portrait;
 * an affiliations strip runs along the foot, split by the hello button.
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
  // Observe the heading: each word starts clipped by its own mask, so an
  // observer on the words themselves would never fire.
  const statementRef = useRef<HTMLHeadingElement>(null);
  const statementInView = useInView(statementRef, { once: true, margin: "-10%" });

  const words = emphasisWords(content.statement);
  const socials = profile.socials.filter(
    (s) => s.label.toLowerCase() !== "email" && !s.href.startsWith("mailto:"),
  );
  const pages = navLinks.filter((l) => l.label !== "Resume");
  const half = Math.ceil(content.credits.length / 2);

  const scrollTop = () => {
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <footer data-theme="dark" className="relative">
      {/* The page warms into the volt field the panel sits in. Split at the
          midpoint so the header reads the darker half as dark and the
          brighter half as volt. */}
      <div aria-hidden className="h-10 bg-gradient-to-b from-transparent to-volt/50 md:h-14" />
      <div aria-hidden data-nav="volt" className="h-10 bg-gradient-to-b from-volt/50 to-volt md:h-14" />

      <div data-nav="volt" className="bg-volt px-2 pb-3 pt-12 sm:px-3 md:px-4 md:pt-14">
        <div className="relative">
          {/* Notched tab rising from the panel — the site's notch, centered. */}
          <svg
            aria-hidden
            viewBox="0 0 360 44"
            preserveAspectRatio="none"
            className="absolute bottom-full left-1/2 -mb-px h-8 w-[240px] -translate-x-1/2 md:h-11 md:w-[360px]"
          >
            <path
              d="M0 44 C46 44 56 0 104 0 L256 0 C304 0 314 44 360 44 Z"
              fill="currentColor"
              className="text-background"
            />
          </svg>

          <div
            data-nav="dark"
            className="bg-topo-dark relative overflow-hidden rounded-[1.75rem] bg-background md:flex md:min-h-[42rem] md:flex-col md:rounded-[2.5rem]"
          >
            {/* Faint volt bloom behind the portrait. */}
            <div
              aria-hidden
              className="pointer-events-none absolute bottom-0 left-1/2 h-[70%] w-[60%] -translate-x-1/2 rounded-full bg-volt/[0.06] blur-3xl"
            />

            {/* ── Statement ─────────────────────────────────────────── */}
            <div className="relative z-20 px-5 pt-16 text-center md:pt-20">
              <div className="relative mx-auto inline-block max-w-5xl">
                <motion.span
                  initial={reduced ? false : { opacity: 0, clipPath: "inset(0 100% 0 0)" }}
                  whileInView={reduced ? undefined : { opacity: 1, clipPath: "inset(0 0% 0 0)" }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 1.4, delay: 0.6, ease: EASE }}
                  aria-hidden
                  className="pointer-events-none absolute -top-[0.55em] left-[18%] z-10 -rotate-[10deg] font-signature text-[clamp(3rem,6.5vw,6.5rem)] leading-none text-volt"
                >
                  {content.signature}
                </motion.span>

                <h2
                  ref={statementRef}
                  aria-label={stripEmphasis(content.statement)}
                  className="text-balance font-display text-[clamp(2.75rem,6.6vw,6.75rem)] uppercase leading-[0.92]"
                >
                  <span aria-hidden>
                    {words.map((word, i) => (
                      <span key={i}>
                        {word.spaced && " "}
                        <StatementWord
                          serif={word.em}
                          delay={0.05 + i * 0.08}
                          reduced={reduced}
                          show={statementInView}
                        >
                          {word.text}
                        </StatementWord>
                      </span>
                    ))}
                  </span>
                </h2>
              </div>

              <p className="mt-6 flex items-center justify-center gap-3 font-grotesk text-[10px] uppercase tracking-[0.25em] text-foreground/60">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-volt opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-volt" />
                </span>
                <span>
                  {profile.availability} — {profile.location}, <LocalTime />
                </span>
              </p>
            </div>

            {/* ── Portrait + flanking columns ───────────────────────── */}
            <div className="relative z-10 mt-10 grid grid-cols-2 gap-x-6 gap-y-10 px-6 md:mt-12 md:flex-1 md:grid-cols-[1fr_minmax(15rem,22rem)_1fr] md:px-10 md:pb-28">
              {/* Explicit columns: the portrait is absolutely positioned on
                  desktop, so it doesn't hold the middle cell by itself. */}
              <nav
                aria-label="Footer"
                className="order-2 md:col-start-1 md:row-start-1 md:pt-4 md:text-center"
              >
                <ColumnLabel>Pages</ColumnLabel>
                {pages.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(linkClass, "text-foreground")}
                  >
                    <HoverRoll>{link.label}</HoverRoll>
                  </Link>
                ))}
                <Link href="/resume" className={cn(linkClass, "mt-4 text-volt")}>
                  <HoverRoll incomingClassName="text-foreground">Resume</HoverRoll>
                </Link>
              </nav>

              {content.portrait ? (
                <div
                  aria-hidden
                  className="relative order-1 col-span-2 mx-auto h-72 w-56 md:absolute md:bottom-0 md:left-1/2 md:order-2 md:col-span-1 md:h-[30rem] md:w-[22rem] md:-translate-x-1/2"
                >
                  <Image
                    src={content.portrait}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 14rem, 22rem"
                    className="portrait-fade object-cover object-top"
                  />
                </div>
              ) : null}

              <div className="order-3 md:col-start-3 md:row-start-1 md:pt-4 md:text-center">
                <ColumnLabel>Connect</ColumnLabel>
                {socials.map((s) => (
                  <a
                    key={`${s.label}-${s.href}`}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(linkClass, "text-foreground")}
                  >
                    <HoverRoll>{s.label}</HoverRoll>
                  </a>
                ))}
              </div>
            </div>

            {/* ── Affiliations strip split by the hello button ─────── */}
            <div className="relative z-20 mt-12 flex flex-col items-center gap-6 border-t border-border px-6 py-6 md:absolute md:inset-x-0 md:bottom-0 md:mt-0 md:flex-row md:justify-between md:border-t-0 md:px-10 md:py-8">
              <Credits names={content.credits.slice(0, half)} className="md:justify-start" />
              <a
                href={`mailto:${profile.email}`}
                className="btn-sweep btn-sweep-dark group inline-flex shrink-0 items-center gap-3 rounded-xl bg-volt px-6 py-3.5 font-grotesk text-[11px] font-bold uppercase tracking-[0.2em] text-ink transition-colors duration-300 hover:text-volt"
              >
                {content.ctaLabel}
                <span
                  aria-hidden
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                >
                  ↗
                </span>
              </a>
              <Credits names={content.credits.slice(half)} className="md:justify-end" />
            </div>
          </div>
        </div>

        {/* ── Utility row on the volt ─────────────────────────────── */}
        <div className="flex flex-col items-center justify-between gap-3 px-2 pt-4 font-grotesk text-[10px] font-medium uppercase tracking-[0.2em] text-ink sm:flex-row md:px-4">
          <p>
            © {year} {siteConfig.name} — All rights reserved
          </p>
          <button
            type="button"
            onClick={scrollTop}
            className="group flex items-center gap-2 uppercase tracking-[0.2em] text-ink"
          >
            Back to top
            <span className="relative inline-flex h-6 w-6 items-center justify-center overflow-hidden rounded-full border border-ink/30 transition-colors duration-300 group-hover:border-ink">
              <span
                aria-hidden
                className="transition-transform duration-300 group-hover:-translate-y-5"
              >
                ↑
              </span>
              <span
                aria-hidden
                className="absolute translate-y-5 transition-transform duration-300 group-hover:translate-y-0"
              >
                ↑
              </span>
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}

function Credits({ names, className }: { names: string[]; className?: string }) {
  if (names.length === 0) return <span className="hidden flex-1 md:block" />;
  return (
    <ul
      className={cn(
        "flex flex-1 flex-wrap items-center justify-center gap-x-8 gap-y-2 font-grotesk text-[10px] uppercase tracking-[0.28em] text-foreground/45",
        className,
      )}
    >
      {names.map((name) => (
        <li key={name}>{name}</li>
      ))}
    </ul>
  );
}
