import { forwardRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "link";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-medium tracking-tight transition-all duration-300 ease-out-expo focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "rounded-full bg-foreground text-background hover:bg-accent",
  secondary: "rounded-full border border-border bg-transparent text-foreground hover:bg-surface",
  outline: "rounded-full border border-border text-foreground hover:border-foreground/40",
  ghost: "rounded-full text-muted hover:text-foreground",
  // Norris-style underlined text link
  link: "px-0 text-foreground underline decoration-accent decoration-2 underline-offset-[6px] hover:decoration-foreground",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-5 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-[3.25rem] px-8 text-base",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
}

type ButtonAsButton = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type ButtonAsLink = CommonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href: string };

export const Button = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonAsButton | ButtonAsLink
>(({ variant = "primary", size = "md", className, ...props }, ref) => {
  const classes = cn(base, variants[variant], variant !== "link" && sizes[size], className);

  if ("href" in props && props.href !== undefined) {
    const { href, ...rest } = props as ButtonAsLink;
    const isExternal = href.startsWith("http") || href.startsWith("mailto:");
    if (isExternal) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
          {...rest}
        />
      );
    }
    return (
      <Link ref={ref as React.Ref<HTMLAnchorElement>} href={href} className={classes} {...rest} />
    );
  }

  return (
    <button ref={ref as React.Ref<HTMLButtonElement>} className={classes} {...(props as ButtonAsButton)} />
  );
});

Button.displayName = "Button";
