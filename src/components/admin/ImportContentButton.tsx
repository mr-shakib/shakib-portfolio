"use client";

import { useState, useTransition } from "react";
import { importDefaultContent } from "@/lib/admin/actions";

export function ImportContentButton() {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div className="flex items-center gap-3">
      {message && <p className="text-sm text-accent">{message}</p>}
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            const result = await importDefaultContent();
            setMessage(result.ok ? (result.message ?? "Imported.") : result.error);
          })
        }
        className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Importing…" : "Import original content"}
      </button>
    </div>
  );
}
