"use client";

import { useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useUIStore } from "@/store/useUIStore";
import { cn } from "@/lib/utils/cn";
import { scrollToId } from "@/lib/animations/lenis";

/**
 * Athletic-brand header: stacked wordmark left, monogram center, volt pill +
 * hamburger card right. Wordmark and monogram use blend-difference so they
 * stay legible over both the cream hero and the dark sections.
 */
export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const toggleMenu = useUIStore((s) => s.toggleMenu);
  const menuOpen = useUIStore((s) => s.menuOpen);

  const goHome = useCallback(
    (e: React.MouseEvent) => {
      if (isHome) {
        e.preventDefault();
        scrollToId("hero");
        history.replaceState(null, "", "/");
      }
    },
    [isHome],
  );

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <nav
        className="relative flex items-start justify-between px-gutter pt-4 md:pt-5"
        aria-label="Primary"
      >
        {/* Stacked wordmark */}
        <Link
          href="/"
          onClick={goHome}
          className="group mix-blend-difference"
          aria-label="Shakib Howlader — home"
        >
          <span className="block font-display text-lg uppercase leading-[0.95] text-white transition-colors duration-300 group-hover:text-accent md:text-xl">
            Shakib
          </span>
          <span className="block font-display text-lg uppercase leading-[0.95] text-white md:text-xl">
            Howlader
          </span>
        </Link>

        {/* Center monogram */}
        <Link
          href="/"
          onClick={goHome}
          aria-label="Home"
          className="absolute left-1/2 top-4 -translate-x-1/2 font-display text-2xl uppercase leading-none text-white mix-blend-difference transition-transform duration-300 hover:scale-110 md:top-5"
        >
          SH
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/resume"
            className="hidden h-11 items-center gap-2 rounded-xl bg-accent px-5 font-grotesk text-[11px] font-bold uppercase tracking-[0.18em] text-[#16170f] shadow-sm transition-transform duration-300 hover:-translate-y-0.5 hover:scale-[1.03] sm:flex"
          >
            <span aria-hidden>↓</span> Resume
          </Link>
          <button
            type="button"
            onClick={toggleMenu}
            aria-expanded={menuOpen}
            aria-label="Toggle menu"
            className="flex h-11 w-11 flex-col items-center justify-center gap-[5px] rounded-xl bg-white shadow-sm transition-transform duration-300 hover:scale-[1.06]"
          >
            <span
              className={cn(
                "h-[2px] w-5 rounded-full bg-[#16170f] transition-all duration-300",
                menuOpen ? "translate-y-[3.5px] rotate-45" : "translate-x-[3px]",
              )}
            />
            <span
              className={cn(
                "h-[2px] w-5 rounded-full bg-[#16170f] transition-all duration-300",
                menuOpen ? "-translate-y-[3.5px] -rotate-45" : "-translate-x-[3px]",
              )}
            />
          </button>
        </div>
      </nav>
    </motion.header>
  );
}
