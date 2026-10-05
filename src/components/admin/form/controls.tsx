"use client";

import { useId, useRef, useState } from "react";
import type { Field, FileField, ListField } from "@/lib/admin/fields";
import { emptyValues } from "@/lib/admin/fields";
import { cn } from "@/lib/utils/cn";
import { DistrictPicker } from "./DistrictPicker";

export const inputClass =
  "w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground placeholder:text-white/30 transition-colors hover:border-white/20 focus:border-accent focus:outline-none";

type Errors = Record<string, string>;

interface ControlProps {
  field: Field;
  value: unknown;
  onChange: (value: unknown) => void;
  path: string;
  errors: Errors;
}

const WIDE = new Set<Field["kind"]>(["textarea", "lines", "tags", "districts", "list", "group", "file"]);

/** Lays out a field list as a responsive two-column grid. */
export function FieldGrid({
  fields,
  values,
  onChange,
  path,
  errors,
}: {
  fields: readonly Field[];
  values: Record<string, unknown>;
  onChange: (name: string, value: unknown) => void;
  path: string;
  errors: Errors;
}) {
  return (
    <div className="grid gap-x-5 gap-y-6 md:grid-cols-2">
      {fields.map((field) => (
        <div key={field.name} className={cn(WIDE.has(field.kind) && "md:col-span-2")}>
          <FieldControl
            field={field}
            value={values[field.name]}
            onChange={(v) => onChange(field.name, v)}
            path={path ? `${path}.${field.name}` : field.name}
            errors={errors}
          />
        </div>
      ))}
    </div>
  );
}

function Label({ htmlFor, field, error }: { htmlFor?: string; field: Field; error?: string }) {
  return (
    <div className="mb-1.5 flex items-baseline justify-between gap-3">
      <label
        htmlFor={htmlFor}
        className="font-grotesk text-[11px] font-medium uppercase tracking-[0.16em] text-white/80"
      >
        {field.label}
        {"required" in field && field.required && <span className="text-accent"> *</span>}
      </label>
      {error && <span className="text-xs text-error">{error}</span>}
    </div>
  );
}

function Help({ text }: { text?: string }) {
  return text ? <p className="mt-1.5 text-xs leading-relaxed text-muted">{text}</p> : null;
}

export function FieldControl({ field, value, onChange, path, errors }: ControlProps) {
  const id = useId();
  const error = errors[path];
  const invalid = error ? "border-[#ff5a5a]/70 hover:border-error" : undefined;

  switch (field.kind) {
    case "text":
      return (
        <div>
          <Label htmlFor={id} field={field} error={error} />
          <input
            id={id}
            type={field.format === "email" ? "email" : "text"}
            value={String(value ?? "")}
            placeholder={field.placeholder}
            list={field.suggestions ? `${id}-list` : undefined}
            onChange={(e) => onChange(e.target.value)}
            className={cn(inputClass, invalid)}
            aria-invalid={Boolean(error)}
          />
          {field.suggestions && (
            <datalist id={`${id}-list`}>
              {field.suggestions.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
          )}
          <Help text={field.help} />
        </div>
      );

    case "textarea":
      return (
        <div>
          <Label htmlFor={id} field={field} error={error} />
          <textarea
            id={id}
            rows={field.rows ?? 4}
            value={String(value ?? "")}
            onChange={(e) => onChange(e.target.value)}
            className={cn(inputClass, "resize-y leading-relaxed", invalid)}
            aria-invalid={Boolean(error)}
          />
          <Help text={field.help} />
        </div>
      );

    case "number":
      return (
        <div>
          <Label htmlFor={id} field={field} error={error} />
          <input
            id={id}
            type="number"
            inputMode="decimal"
            step={field.step ?? (field.int ? 1 : "any")}
            min={field.min}
            max={field.max}
            value={value === null || value === undefined ? "" : String(value)}
            onChange={(e) => onChange(e.target.value)}
            className={cn(inputClass, "tabular-nums", invalid)}
            aria-invalid={Boolean(error)}
          />
          <Help text={field.help} />
        </div>
      );

    case "boolean":
      return (
        <div className="flex h-full flex-col justify-end">
          <label className="flex cursor-pointer items-center gap-3 py-2">
            <input
              type="checkbox"
              checked={Boolean(value)}
              onChange={(e) => onChange(e.target.checked)}
              className="peer sr-only"
            />
            <span
              aria-hidden
              className="relative h-6 w-11 shrink-0 rounded-full bg-white/10 transition-colors after:absolute after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-foreground after:transition-transform peer-checked:bg-accent peer-checked:after:translate-x-5 peer-checked:after:bg-background peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent"
            />
            <span className="text-sm text-foreground">{field.label}</span>
          </label>
          <Help text={field.help} />
        </div>
      );

    case "select":
      return (
        <div>
          <Label htmlFor={id} field={field} error={error} />
          <select
            id={id}
            value={String(value ?? "")}
            onChange={(e) => onChange(e.target.value)}
            className={cn(inputClass, "appearance-none bg-surface", invalid)}
          >
            {field.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <Help text={field.help} />
        </div>
      );

    case "date":
      return (
        <div>
          <Label htmlFor={id} field={field} error={error} />
          <input
            id={id}
            type="date"
            value={String(value ?? "")}
            onChange={(e) => onChange(e.target.value)}
            className={cn(inputClass, "[color-scheme:dark]", invalid)}
          />
          <Help text={field.help} />
        </div>
      );

    case "lines": {
      const lines = Array.isArray(value) ? (value as string[]) : [];
      return (
        <div>
          <Label htmlFor={id} field={field} error={error} />
          <textarea
            id={id}
            rows={field.rows ?? Math.min(Math.max(lines.length + 1, 3), 10)}
            value={lines.join("\n")}
            onChange={(e) => onChange(e.target.value.split("\n"))}
            className={cn(inputClass, "resize-y leading-relaxed", invalid)}
          />
          <Help text={field.help} />
        </div>
      );
    }

    case "tags":
      return (
        <div>
          <Label htmlFor={id} field={field} error={error} />
          <TagsInput id={id} value={Array.isArray(value) ? (value as string[]) : []} onChange={onChange} />
          <Help text={field.help ?? "Press Enter or comma to add."} />
        </div>
      );

    case "districts":
      return (
        <div>
          <Label field={field} error={error} />
          <Help text={field.help} />
          <div className="mt-3">
            <DistrictPicker value={Array.isArray(value) ? (value as string[]) : []} onChange={onChange} />
          </div>
        </div>
      );

    case "file":
      return (
        <div>
          <Label htmlFor={id} field={field} error={error} />
          <FileInput id={id} field={field} value={String(value ?? "")} onChange={onChange} />
          <Help text={field.help} />
        </div>
      );

    case "list":
      return (
        <ListInput
          field={field}
          value={Array.isArray(value) ? (value as Record<string, unknown>[]) : []}
          onChange={onChange}
          path={path}
          errors={errors}
        />
      );

    case "group":
      return (
        <fieldset className="rounded-xl border border-white/10 p-5">
          <legend className="px-2 font-grotesk text-[11px] uppercase tracking-[0.2em] text-accent">
            {field.label}
          </legend>
          <FieldGrid
            fields={field.fields}
            values={(value ?? {}) as Record<string, unknown>}
            onChange={(name, v) => onChange({ ...(value as object), [name]: v })}
            path={path}
            errors={errors}
          />
        </fieldset>
      );
  }
}

function TagsInput({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const [draft, setDraft] = useState("");

  const add = (raw: string) => {
    const next = raw
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s && !value.includes(s));
    if (next.length) onChange([...value, ...next]);
    setDraft("");
  };

  return (
    <div className={cn(inputClass, "flex flex-wrap items-center gap-1.5 py-1.5 focus-within:border-accent")}>
      {value.map((tag, i) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 rounded-md bg-white/[0.07] py-0.5 pl-2 pr-1 text-xs text-foreground"
        >
          {tag}
          <button
            type="button"
            onClick={() => onChange(value.filter((_, j) => j !== i))}
            className="rounded px-1 text-muted hover:bg-white/10 hover:text-foreground"
            aria-label={`Remove ${tag}`}
          >
            ×
          </button>
        </span>
      ))}
      <input
        id={id}
        value={draft}
        onChange={(e) => {
          if (e.target.value.includes(",")) add(e.target.value);
          else setDraft(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            add(draft);
          } else if (e.key === "Backspace" && !draft && value.length) {
            onChange(value.slice(0, -1));
          }
        }}
        onBlur={() => draft && add(draft)}
        className="min-w-[8rem] flex-1 bg-transparent py-0.5 text-sm text-foreground outline-none placeholder:text-white/30"
        placeholder={value.length ? "" : "Add…"}
      />
    </div>
  );
}

function FileInput({
  id,
  field,
  value,
  onChange,
}: {
  id: string;
  field: FileField;
  value: string;
  onChange: (v: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isImage = field.accept === "image";

  const upload = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const body = new FormData();
      body.set("file", file);
      body.set("accept", field.accept);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const json = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
      if (!res.ok || !json.url) throw new Error(json.error ?? "Upload failed.");
      onChange(json.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
      {isImage && (
        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-white/[0.03]">
          {value ? (
            // Plain <img>: previews arbitrary URLs without next/image host config.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="text-[10px] uppercase tracking-widest text-muted">None</span>
          )}
        </div>
      )}
      <div className="flex-1">
        <input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={isImage ? "/uploads/… or https://…" : "/uploads/….pdf"}
          className={inputClass}
        />
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-foreground transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
          >
            {uploading ? "Uploading…" : isImage ? "Upload image" : "Upload PDF"}
          </button>
          {value && (
            <>
              <a
                href={value}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg px-2 py-1.5 text-xs text-muted hover:text-foreground"
              >
                Open ↗
              </a>
              <button
                type="button"
                onClick={() => onChange("")}
                className="rounded-lg px-2 py-1.5 text-xs text-muted hover:text-error"
              >
                Remove
              </button>
            </>
          )}
          {error && <span className="text-xs text-error">{error}</span>}
        </div>
        <input
          ref={fileRef}
          type="file"
          hidden
          accept={isImage ? "image/jpeg,image/png,image/webp,image/avif,image/gif" : "application/pdf"}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void upload(file);
          }}
        />
      </div>
    </div>
  );
}

function ListInput({
  field,
  value,
  onChange,
  path,
  errors,
}: {
  field: ListField;
  value: Record<string, unknown>[];
  onChange: (v: Record<string, unknown>[]) => void;
  path: string;
  errors: Errors;
}) {
  const max = field.max ?? 50;
  const listError = errors[path];

  const move = (from: number, to: number) => {
    const next = [...value];
    const [item] = next.splice(from, 1);
    if (item) next.splice(to, 0, item);
    onChange(next);
  };

  // First non-empty text value gives each collapsed item a recognizable title.
  const preview = (item: Record<string, unknown>) => {
    const first = field.fields.find((f) => f.kind === "text" && typeof item[f.name] === "string" && item[f.name]);
    return first ? String(item[first.name]) : "";
  };

  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <p className="font-grotesk text-[11px] font-medium uppercase tracking-[0.16em] text-white/80">
          {field.label} <span className="text-muted">({value.length})</span>
        </p>
        {listError && <span className="text-xs text-error">{listError}</span>}
      </div>
      <Help text={field.help} />

      <ol className="mt-3 flex flex-col gap-3">
        {value.map((item, i) => (
          <li key={i} className="rounded-xl border border-white/10 bg-white/[0.02]">
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
              <span className="font-grotesk text-[10px] uppercase tracking-[0.2em] text-accent">
                {field.itemLabel} {i + 1}
              </span>
              <span className="min-w-0 flex-1 truncate text-xs text-muted">{preview(item)}</span>
              <IconButton label="Move up" disabled={i === 0} onClick={() => move(i, i - 1)}>
                ↑
              </IconButton>
              <IconButton label="Move down" disabled={i === value.length - 1} onClick={() => move(i, i + 1)}>
                ↓
              </IconButton>
              <IconButton label={`Remove ${field.itemLabel.toLowerCase()}`} danger onClick={() => onChange(value.filter((_, j) => j !== i))}>
                ×
              </IconButton>
            </div>
            <div className="p-4">
              <FieldGrid
                fields={field.fields}
                values={item}
                onChange={(name, v) => onChange(value.map((it, j) => (j === i ? { ...it, [name]: v } : it)))}
                path={`${path}.${i}`}
                errors={errors}
              />
            </div>
          </li>
        ))}
      </ol>

      <button
        type="button"
        onClick={() => onChange([...value, emptyValues(field.fields)])}
        disabled={value.length >= max}
        className="mt-3 w-full rounded-xl border border-dashed border-white/15 py-2.5 text-sm text-muted transition-colors hover:border-accent hover:text-accent disabled:pointer-events-none disabled:opacity-40"
      >
        + Add {field.itemLabel.toLowerCase()}
        {value.length >= max && ` (max ${max})`}
      </button>
    </div>
  );
}

function IconButton({
  label,
  onClick,
  disabled,
  danger,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={cn(
        "flex h-7 w-7 items-center justify-center rounded-md text-sm text-muted transition-colors hover:bg-white/10 disabled:pointer-events-none disabled:opacity-30",
        danger ? "hover:text-error" : "hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
