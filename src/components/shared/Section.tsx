import { cn } from "@/lib/utils/cn";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  id?: string;
  containerClassName?: string;
  fullWidth?: boolean;
}

/** Consistent vertical rhythm + content container for every page section. */
export function Section({
  id,
  className,
  containerClassName,
  fullWidth = false,
  children,
  ...props
}: SectionProps) {
  return (
    <section id={id} className={cn("relative py-section", className)} {...props}>
      <div className={cn(!fullWidth && "container-content", containerClassName)}>{children}</div>
    </section>
  );
}
