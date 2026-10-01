"use client";

import { useEffect, useState, useTransition } from "react";
import type { Field, FormValues } from "@/lib/admin/fields";
import type { ActionResult } from "@/lib/admin/actions";
import { FieldGrid } from "./controls";
import { cn } from "@/lib/utils/cn";

interface SchemaFormProps {
  fields: readonly Field[];
  initial: FormValues;
  /** Server action (usually pre-bound with the section key or item id). */
  action: (values: FormValues) => Promise<ActionResult | void>;
  submitLabel?: string;
  /** Message shown on first render, e.g. after creating an item. */
  notice?: string;
  /** Extra controls rendered on the left of the save bar (reset, delete…). */
  secondary?: React.ReactNode;
}

/**
 * Renders any field list as an editable form and saves it through a server
 * action. Errors from the server come back keyed by field path and appear
 * inline; leaving with unsaved changes asks for confirmation.
 */
export function SchemaForm({
  fields,
  initial,
  action,
  submitLabel = "Save changes",
  notice,
  secondary,
}: SchemaFormProps) {
  const [values, setValues] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(
    notice ? { ok: true, text: notice } : null,
  );
  const [pending, startTransition] = useTransition();
  const dirty = JSON.stringify(values) !== JSON.stringify(saved);

  // Re-sync when the server sends fresh initial values (e.g. after "Reset").
  const initialKey = JSON.stringify(initial);
  useEffect(() => {
    const next = JSON.parse(initialKey) as FormValues;
    setValues(next);
    setSaved(next);
    setErrors({});
  }, [initialKey]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const snapshot = values;
    startTransition(async () => {
      const result = await action(snapshot);
      if (!result) return; // the action redirected
      if (result.ok) {
        setSaved(snapshot);
        setErrors({});
        setStatus({ ok: true, text: result.message ?? "Saved." });
      } else {
        setErrors(result.fieldErrors ?? {});
        setStatus({ ok: false, text: result.error });
      }
    });
  };

  return (
    <form onSubmit={submit} noValidate>
      <FieldGrid
        fields={fields}
        values={values}
        onChange={(name, v) => {
          setValues((prev) => ({ ...prev, [name]: v }));
          if (status?.ok) setStatus(null);
        }}
        path=""
        errors={errors}
      />

      <div className="sticky bottom-0 z-10 -mx-5 mt-10 flex flex-wrap items-center gap-3 border-t border-white/10 bg-background px-5 py-4 backdrop-blur md:-mx-8 md:px-8">
        {secondary}
        <p
          role="status"
          className={cn(
            "mr-auto text-sm",
            status ? (status.ok ? "text-accent" : "text-error") : "text-muted",
          )}
        >
          {status?.text ?? (dirty ? "Unsaved changes" : "")}
        </p>
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-accent px-5 py-2.5 font-grotesk text-xs font-bold uppercase tracking-[0.18em] text-background transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {pending ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
