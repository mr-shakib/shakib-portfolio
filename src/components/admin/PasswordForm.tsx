"use client";

import { useActionState } from "react";
import { changePassword, type ActionResult } from "@/lib/admin/actions";
import { inputClass } from "@/components/admin/form/controls";

const FIELDS = [
  { name: "current", label: "Current password", autoComplete: "current-password" },
  { name: "next", label: "New password", autoComplete: "new-password" },
  { name: "confirm", label: "Confirm new password", autoComplete: "new-password" },
] as const;

export function PasswordForm() {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(changePassword, null);
  const fieldErrors = state && !state.ok ? (state.fieldErrors ?? {}) : {};

  return (
    <form action={action} className="mt-6 flex flex-col gap-4">
      {FIELDS.map((f) => (
        <label key={f.name} className="flex flex-col gap-1.5">
          <span className="flex justify-between font-grotesk text-[11px] uppercase tracking-[0.16em] text-white/80">
            {f.label}
            {fieldErrors[f.name] && <span className="normal-case tracking-normal text-error">{fieldErrors[f.name]}</span>}
          </span>
          <input name={f.name} type="password" autoComplete={f.autoComplete} required className={inputClass} />
        </label>
      ))}
      {state && (
        <p role="status" className={state.ok ? "text-sm text-accent" : "text-sm text-error"}>
          {state.ok ? state.message : state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-lg bg-accent px-5 py-2.5 font-grotesk text-xs font-bold uppercase tracking-[0.18em] text-background hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Saving…" : "Change password"}
      </button>
    </form>
  );
}
