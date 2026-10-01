"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { resetSection } from "@/lib/admin/actions";

export function ResetSectionButton({ sectionKey }: { sectionKey: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!confirm("Discard your edits to this section and restore the original content?")) return;
        startTransition(async () => {
          await resetSection(sectionKey);
          router.refresh();
        });
      }}
      className="rounded-lg border border-white/15 px-3 py-2 text-xs text-muted transition-colors hover:border-error hover:text-error disabled:opacity-50"
    >
      {pending ? "Restoring…" : "Restore original"}
    </button>
  );
}
