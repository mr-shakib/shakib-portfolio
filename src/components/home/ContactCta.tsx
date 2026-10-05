import Link from "next/link";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { MagneticButton } from "@/components/shared/MagneticButton";
import { SplitHeading } from "@/components/shared/SplitHeading";
import { DriftOnScroll } from "@/components/shared/DriftOnScroll";
import type { SectionContent } from "@/lib/sections/registry";

/**
 * Closing call-to-action: a near-viewport-height typographic billboard with a
 * single magnetic volt button.
 */
export function ContactCta({
  content,
  profile,
  number,
}: {
  content: SectionContent<"contactCta">;
  profile: SectionContent<"profile">;
  number: string;
}) {
  return (
    <section
      id="contact"
      className="relative flex min-h-[80svh] flex-col justify-center overflow-hidden bg-transparent py-section"
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
          <Eyebrow number={number}>{content.eyebrow}</Eyebrow>
        </RevealOnScroll>
        <div className="mt-4">
          <SplitHeading
            as="h2"
            charStagger={0.04}
            lines={[
              { text: content.headingTop, className: "text-foreground" },
              { text: content.headingBottom, serif: true },
            ]}
            lineClassName="text-display-2xl leading-[0.88]"
          />
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-8">
          <RevealOnScroll delay={0.2}>
            <MagneticButton>
              <a
                href={`mailto:${profile.email}`}
                className="btn-sweep btn-sweep-dark inline-flex items-center gap-3 bg-accent px-6 py-4 font-grotesk text-xs uppercase tracking-[0.3em] text-background transition-colors duration-300 hover:text-accent sm:px-8"
              >
                <span className="hidden sm:inline">{profile.email}</span>
                <span className="sm:hidden">Say hello</span>
              </a>
            </MagneticButton>
            <p className="mt-3 text-xs tracking-wide text-muted sm:hidden">{profile.email}</p>
          </RevealOnScroll>
          <RevealOnScroll delay={0.3}>
            <p className="max-w-xs text-sm leading-relaxed text-muted">
              {content.blurb}{" "}
              <Link href="/contact" className="text-foreground underline underline-offset-4 hover:text-accent">
                {content.formLinkLabel}
              </Link>
              .
            </p>
          </RevealOnScroll>
        </div>

        <RevealOnScroll delay={0.35}>
          <ul className="mt-16 flex flex-wrap gap-x-8 gap-y-3 border-t border-border pt-6">
            {profile.socials.map((social) => (
              <li key={`${social.label}-${social.href}`}>
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
