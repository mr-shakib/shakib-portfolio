"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { navLinks, socialLinks } from "@/config/site";
import { useUIStore } from "@/store/useUIStore";
import { MotionToggle } from "./MotionToggle";

export function MobileMenu() {
  const menuOpen = useUIStore((s) => s.menuOpen);
  const setMenuOpen = useUIStore((s) => s.setMenuOpen);
  const pathname = usePathname();

  return (
    <AnimatePresence>
      {menuOpen && (
        <motion.div
          key="mobile-menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl md:hidden"
        >
          <nav className="container-content flex h-full flex-col justify-center gap-2 pt-16">
            {navLinks.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i + 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block py-2 font-display text-4xl text-gradient"
                  aria-current={pathname === link.href ? "page" : undefined}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}

            <div className="mt-10 flex flex-wrap gap-4">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted hover:text-accent"
                >
                  {s.label}
                </a>
              ))}
            </div>
            <div className="mt-6">
              <MotionToggle />
            </div>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
