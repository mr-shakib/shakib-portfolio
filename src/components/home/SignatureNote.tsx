"use client";

import { motion } from "framer-motion";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { WordFill } from "@/components/shared/WordFill";
import { ParallaxImage } from "@/components/shared/ParallaxImage";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Personal message — the quiet, human beat between the loud display sections.
 * The quote brightens word-by-word as you read/scroll, the portrait drifts in
 * parallax inside its frame, and the signature wipes in as if being written.
 */
export function SignatureNote() {
  const reduced = useReducedMotion();

  return (
    <section id="about" className="relative border-b border-border bg-transparent py-section">
      <div className="container-content grid items-center gap-12 md:grid-cols-[1fr_auto]">
        <div className="max-w-3xl">
          <RevealOnScroll>
            <p className="font-grotesk text-[11px] uppercase tracking-[0.35em] text-accent">
              A note from Shakib
            </p>
          </RevealOnScroll>

          <div className="mt-8">
            <WordFill
              as="blockquote"
              text={
                "“The bottleneck in applied AI is rarely the architecture — it’s the data. So I build both: open datasets the community can trust, and the software that puts them to work.”"
              }
              className="text-2xl font-medium leading-snug text-foreground md:text-4xl"
            />
          </div>

          <RevealOnScroll delay={0.15}>
            <p className="mt-8 max-w-xl text-sm leading-relaxed text-muted md:text-base">
              Computer Science &amp; Engineering graduate (3.92 CGPA, Daffodil International
              University). First-author publication in Elsevier&rsquo;s{" "}
              <span className="text-foreground">Data in Brief</span>. Now heading toward an
              MSc — and eventually a PhD — in AI and machine learning.
            </p>
          </RevealOnScroll>

          <motion.p
            initial={reduced ? false : { clipPath: "inset(0 100% 0 0)", opacity: 0 }}
            whileInView={
              reduced ? undefined : { clipPath: "inset(0 0% 0 0)", opacity: 1 }
            }
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 1.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 font-signature text-5xl text-accent md:text-6xl"
            aria-hidden
          >
            Shakib
          </motion.p>
        </div>

        <RevealOnScroll delay={0.15} className="hidden md:block">
          <div className="relative">
            <ParallaxImage
              src="/images/portrait.jpg"
              alt="Shakib Howlader"
              strength={0.18}
              sizes="(max-width: 1024px) 16rem, 18rem"
              imageClassName="img-cinematic object-top"
              className="h-80 w-64 lg:h-96 lg:w-72"
            />
            <div className="pointer-events-none absolute inset-0 border border-border" />
            <p className="absolute bottom-3 left-3 font-grotesk text-[10px] uppercase tracking-[0.3em] text-foreground/80">
              SH — Portfolio &rsquo;26
            </p>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
