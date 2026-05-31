import { AnimatedText } from "@/components/shared/AnimatedText";
import { Parallax } from "@/components/shared/Parallax";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
}

/** Standard hero header for routed content pages — clean, editorial, spacious. */
export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <header className="container-content pb-16 pt-40">
      {eyebrow && (
        <span className="flex items-center gap-3 text-sm uppercase tracking-[0.25em] text-accent">
          <span className="h-px w-10 bg-accent/60" aria-hidden />
          {eyebrow}
        </span>
      )}
      <Parallax amount={18}>
        <h1 className="mt-5 max-w-5xl font-display text-display-lg font-semibold leading-[0.9] text-foreground">
          <AnimatedText text={title} mode="word" />
        </h1>
      </Parallax>
      {description && (
        <p className="mt-7 max-w-prose text-lg leading-relaxed text-muted">{description}</p>
      )}
    </header>
  );
}
