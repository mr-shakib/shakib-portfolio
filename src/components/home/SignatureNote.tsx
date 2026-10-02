"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { WordFill } from "@/components/shared/WordFill";
import { ParallaxImage } from "@/components/shared/ParallaxImage";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Emphasis } from "@/components/shared/Emphasis";
import type { SectionContent } from "@/lib/sections/registry";

/**
 * Personal message — the quiet, human beat between the loud display sections.
 * With motion on, the quote and signature have just played in the hero's
 * scroll sequence, so this leads with the bio, brightening word by word. With
 * reduced motion (no sequence) it shows the quote, bio and signature itself.
 * The portrait drifts in parallax inside its frame either way.
 */
export function SignatureNote({
  content,
  name,
}: {
  content: SectionContent<"about">;
  /** Alt text for the portrait. */
  name: string;
}) {
  const reduced = useReducedMotion();

  return (
    <section id="about" className="relative border-b border-border bg-transparent py-section">
      <div className="container-content grid items-center gap-12 md:grid-cols-[1fr_auto]">
        <div className="max-w-3xl">
          <RevealOnScroll>
            <Eyebrow number="01">{content.eyebrow}</Eyebrow>
          </RevealOnScroll>

          {!reduced ? (
            <div className="mt-8">
              <WordFill
                text={content.bio}
                emphasisClassName="text-accent"
                className="text-2xl font-medium leading-snug text-foreground md:text-4xl"
              />
            </div>
          ) : (
            <>
              <div className="mt-8">
                <WordFill
                  as="blockquote"
                  text={content.quote}
                  className="text-2xl font-medium leading-snug text-foreground md:text-4xl"
                />
              </div>
              <p className="mt-8 max-w-xl text-sm leading-relaxed text-muted md:text-base">
                <Emphasis text={content.bio} className="text-foreground" />
              </p>
            </>
          )}

          {reduced && (
            <motion.p
              initial={reduced ? false : { clipPath: "inset(0 100% 0 0)", opacity: 0 }}
              whileInView={reduced ? undefined : { clipPath: "inset(0 0% 0 0)", opacity: 1 }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ duration: 1.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="mt-10 font-signature text-5xl text-accent md:text-6xl"
              aria-hidden
            >
              {content.signature}
            </motion.p>
          )}

          {/* Small inline portrait keeps the human element below md, where the
              full parallax frame is hidden. */}
          {content.portrait && (
            <RevealOnScroll delay={0.2} className="mt-8 md:hidden">
              <div className="relative inline-block">
                <Image
                  src={content.portrait}
                  alt={name}
                  width={112}
                  height={140}
                  className="img-cinematic h-36 w-28 object-cover object-top"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 border border-border"
                />
              </div>
            </RevealOnScroll>
          )}
        </div>

        {content.portrait && (
          <RevealOnScroll delay={0.15} className="hidden md:block">
            <div className="relative">
              <ParallaxImage
                src={content.portrait}
                alt={name}
                strength={0.18}
                sizes="(max-width: 1024px) 16rem, 18rem"
                imageClassName="img-cinematic object-top"
                className="h-80 w-64 lg:h-96 lg:w-72"
              />
              <div className="pointer-events-none absolute inset-0 border border-border" />
              <p className="absolute bottom-3 left-3 font-grotesk text-[10px] uppercase tracking-[0.3em] text-foreground/80">
                {content.caption}
              </p>
            </div>
          </RevealOnScroll>
        )}
      </div>
    </section>
  );
}
