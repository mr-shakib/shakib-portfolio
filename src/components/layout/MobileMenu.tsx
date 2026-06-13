"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { navLinks, socialLinks } from "@/config/site";
import { useUIStore } from "@/store/useUIStore";
import { scrollToId } from "@/lib/animations/lenis";
import { MotionToggle } from "./MotionToggle";

/**
 * Full-screen menu overlay (all viewports), opened from the header hamburger.
 * Olive panel with topographic texture and oversized index-numbered links.
 */
export function MobileMenu() {
  const menuOpen = useUIStore((s) => s.menuOpen);
  const setMenuOpen = useUIStore((s) => s.setMenuOpen);
  const pathname = usePathname();
  const isHome = pathname === "/";

  const handleNav = (e: React.MouseEvent, link: (typeof navLinks)[number]) => {
    setMenuOpen(false);
    if (isHome && link.section) {
      e.preventDefault();
      // Wait for the overlay to close before scrolling.
      setTimeout(() => scrollToId(link.section!), 320);
      history.replaceState(null, "", link.section === "hero" ? "/" : `/#${link.section}`);
    }
  };

  return (
    <AnimatePresence>
      {menuOpen && (
        <motion.div
          key="menu-overlay"
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.6, ease: [0.87, 0, 0.13, 1] }}
          className="bg-topo-dark fixed inset-0 z-40 overflow-y-auto bg-[#23241a]"
        >
          <nav className="container-content flex min-h-full flex-col justify-center gap-1 py-24">
            {navLinks.map((link, i) => (
              <motion.div
                key={link.href + link.label}
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * i + 0.25, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  href={link.href}
                  onClick={(e) => handleNav(e, link)}
                  className="group flex items-baseline gap-4 py-1"
                  aria-current={pathname === link.href ? "page" : undefined}
                >
                  <span className="font-grotesk text-[10px] uppercase tracking-[0.3em] text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display text-5xl uppercase leading-[1.05] text-[#f1efe9] transition-all duration-300 group-hover:translate-x-3 group-hover:text-accent md:text-7xl">
                    {link.label}
                  </span>
                </Link>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-10 flex flex-wrap items-center gap-6 border-t border-white/10 pt-6"
            >
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-grotesk text-[11px] uppercase tracking-[0.25em] text-[#f1efe9]/60 transition-colors hover:text-accent"
                >
                  {s.label}
                </a>
              ))}
              <MotionToggle className="ml-auto" />
            </motion.div>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
