"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { AnimatedText } from "@/components/shared/AnimatedText";
import { Parallax } from "@/components/shared/Parallax";
import { heroRoles } from "@/content/stats";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function HeroSection() {
  const reduced = useReducedMotion();
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setRoleIndex((i) => (i + 1) % heroRoles.length), 2600);
    return () => clearInterval(id);
  }, [reduced]);

  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden"
    >
      <div className="container-content flex flex-col gap-8 pt-24">
        <Parallax amount={14}>
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex items-center gap-3 text-sm uppercase tracking-[0.25em] text-accent"
          >
            <span className="h-px w-10 bg-accent/50" aria-hidden />
            Computer Science · Research · AI
          </motion.span>
        </Parallax>

        <Parallax amount={40} className="origin-left">
          <h1 className="font-display text-display-2xl font-semibold leading-[0.85] text-foreground">
            <span className="block">
              <AnimatedText text="Shakib" mode="char" />
            </span>
            <span className="block">
              <AnimatedText text="Howlader" mode="char" delay={0.2} />
            </span>
          </h1>
        </Parallax>

        <Parallax amount={26}>
          <div className="flex h-10 items-center text-xl text-muted md:text-2xl" aria-live="polite">
            <span className="mr-3 text-foreground">I’m a</span>
            {reduced ? (
              <span className="text-accent">{heroRoles.join(" · ")}</span>
            ) : (
              <AnimatePresence mode="wait">
                <motion.span
                  key={heroRoles[roleIndex]}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="font-grotesk font-medium text-accent"
                >
                  {heroRoles[roleIndex]}
                </motion.span>
              </AnimatePresence>
            )}
          </div>
        </Parallax>

        <Parallax amount={16}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-wrap items-center gap-4 pt-4"
          >
            <Button href="/research" size="lg">
              View Research
            </Button>
            <Button href="/projects" size="lg" variant="outline">
              View Projects
            </Button>
            <Button href="/resume" variant="link" className="ml-2">
              Download CV ↓
            </Button>
          </motion.div>
        </Parallax>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="pointer-events-none absolute bottom-8 right-[clamp(1.25rem,5vw,6rem)] hidden items-center gap-3 text-xs uppercase tracking-widest text-muted md:flex"
      >
        <span className="h-8 w-px animate-pulse bg-accent/60" aria-hidden />
        Scroll to explore
      </motion.div>
    </section>
  );
}
