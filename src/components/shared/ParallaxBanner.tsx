"use client";

import { ParallaxImage } from "@/components/shared/ParallaxImage";
import { Parallax } from "@/components/shared/Parallax";
import { Button } from "@/components/ui/Button";

interface ParallaxBannerProps {
  image: string;
  eyebrow?: string;
  headline: string;
  subtext?: string;
  cta?: { label: string; href: string };
}

/**
 * Full-bleed cinematic interstitial: a deep parallax image with an overlaid
 * headline that drifts at a different rate — the "stunning parallax" moment.
 */
export function ParallaxBanner({ image, eyebrow, headline, subtext, cta }: ParallaxBannerProps) {
  return (
    <section className="relative flex min-h-[80vh] items-center overflow-hidden">
      <ParallaxImage
        src={image}
        alt=""
        strength={0.45}
        priority={false}
        overlay
        className="absolute inset-0 -z-10"
        imageClassName="grayscale brightness-[0.45]"
        sizes="100vw"
      />

      <div className="container-content">
        <Parallax amount={36} className="max-w-3xl">
          {eyebrow && (
            <span className="mb-5 flex items-center gap-3 text-sm uppercase tracking-[0.25em] text-accent">
              <span className="h-px w-10 bg-accent/60" aria-hidden />
              {eyebrow}
            </span>
          )}
          <h2 className="font-display text-display-md font-semibold leading-[0.95] text-foreground">
            {headline}
          </h2>
          {subtext && (
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">{subtext}</p>
          )}
          {cta && (
            <Button href={cta.href} size="lg" className="mt-8">
              {cta.label}
            </Button>
          )}
        </Parallax>
      </div>
    </section>
  );
}
