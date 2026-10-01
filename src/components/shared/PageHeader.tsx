import { Eyebrow } from "@/components/shared/Eyebrow";
import { Parallax } from "@/components/shared/Parallax";
import { SplitHeading } from "@/components/shared/SplitHeading";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
}

/**
 * Standard hero header for routed content pages — same kicker + character-mask
 * display treatment as the home sections, so route pages read as one site.
 */
export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <header className="container-content pb-16 pt-40">
      {eyebrow && (
        <Eyebrow className="flex items-center gap-3">
          <span className="h-px w-10 bg-accent/60" aria-hidden />
          {eyebrow}
        </Eyebrow>
      )}
      <Parallax amount={18}>
        <SplitHeading
          as="h1"
          lines={[{ text: title }]}
          className="mt-5 max-w-5xl"
          lineClassName="text-display-lg leading-[0.9] text-foreground"
        />
      </Parallax>
      {description && (
        <p className="mt-7 max-w-prose text-lg leading-relaxed text-muted">{description}</p>
      )}
    </header>
  );
}
