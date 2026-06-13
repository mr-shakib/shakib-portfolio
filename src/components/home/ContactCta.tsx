import Link from "next/link";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { MagneticButton } from "@/components/shared/MagneticButton";
import { SplitHeading } from "@/components/shared/SplitHeading";
import { DriftOnScroll } from "@/components/shared/DriftOnScroll";
import { siteConfig, socialLinks } from "@/config/site";

/**
 * Closing call-to-action: a near-viewport-height typographic billboard with a
 * single magnetic volt button.
 */
export function ContactCta() {
  return (
    <section
      id="contact"
      className="relative flex min-h-[80svh] flex-col justify-center overflow-hidden bg-background py-section"
    >
      {/* Oversized ghost monogram backdrop, drifting against scroll */}
      <DriftOnScroll
        x={-120}
        className="pointer-events-none absolute -right-10 top-1/2 -translate-y-1/2"
      >
        <span
          aria-hidden
          className="text-stroke block font-display text-[40vw] uppercase leading-none opacity-[0.07]"
        >
          SH
        </span>
      </DriftOnScroll>

      <div className="container-content relative">
        <RevealOnScroll>
          <p className="font-grotesk text-[11px] uppercase tracking-[0.35em] text-accent">
            05 — Contact
          </p>
        </RevealOnScroll>
        <div className="mt-4">
          <SplitHeading
            as="h2"
            charStagger={0.04}
            lines={[
              { text: "Let's", className: "text-foreground" },
              { text: "Build It", outline: true },
            ]}
            lineClassName="text-display-2xl leading-[0.88]"
          />
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-8">
          <RevealOnScroll delay={0.2}>
            <MagneticButton>
              <a
                href={`mailto:${siteConfig.email}`}
                className="inline-flex items-center gap-3 bg-accent px-8 py-4 font-grotesk text-xs uppercase tracking-[0.3em] text-background transition-transform hover:scale-[1.03]"
              >
                {siteConfig.email}
              </a>
            </MagneticButton>
          </RevealOnScroll>
          <RevealOnScroll delay={0.3}>
            <p className="max-w-xs text-sm leading-relaxed text-muted">
              Open to research collaboration, MSc supervision and engineering work — or{" "}
              <Link href="/contact" className="text-foreground underline underline-offset-4 hover:text-accent">
                use the contact form
              </Link>
              .
            </p>
          </RevealOnScroll>
        </div>

        <RevealOnScroll delay={0.35}>
          <ul className="mt-16 flex flex-wrap gap-x-8 gap-y-3 border-t border-border pt-6">
            {socialLinks.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-grotesk text-[11px] uppercase tracking-[0.3em] text-muted transition-colors hover:text-accent"
                >
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </RevealOnScroll>
      </div>
    </section>
  );
}
