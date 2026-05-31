"use client";

import { usePreferencesStore } from "@/store/usePreferencesStore";
import { cn } from "@/lib/utils/cn";

/** Lets any visitor disable heavy motion/3D — an accessibility escape hatch. */
export function MotionToggle({ className }: { className?: string }) {
  const liteMode = usePreferencesStore((s) => s.liteMode);
  const toggle = usePreferencesStore((s) => s.toggleLiteMode);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={liteMode}
      aria-label={liteMode ? "Enable animations" : "Reduce animations"}
      title={liteMode ? "Animations off (lite mode)" : "Animations on"}
      className={cn(
        "inline-flex h-9 items-center gap-2 rounded-full border border-border px-3 text-xs text-muted transition-colors hover:text-foreground",
        className,
      )}
    >
      <span
        className={cn(
          "h-2 w-2 rounded-full transition-colors",
          liteMode ? "bg-muted" : "bg-accent",
        )}
        aria-hidden
      />
      {liteMode ? "Lite" : "Motion"}
    </button>
  );
}
