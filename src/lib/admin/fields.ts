import { z } from "zod";
import { isDistrictId, type DistrictId } from "@/lib/maps/districts";

/**
 * Field definitions are the single source of truth for every editable thing
 * in the admin: they render the form, build the Zod schema the server
 * validates against, and (via `ValuesOf`) type the data components receive.
 * Shared by server and client — keep this module free of server-only imports.
 */

interface BaseField {
  name: string;
  label: string;
  help?: string;
}

export interface TextField extends BaseField {
  kind: "text";
  /** `url`: absolute http(s). `link`: http(s), mailto: or a site path like /projects/x. */
  format?: "url" | "link" | "slug" | "email";
  required?: boolean;
  /** Empty input is stored as null. */
  nullable?: boolean;
  placeholder?: string;
  suggestions?: readonly string[];
  max?: number;
}

export interface TextareaField extends BaseField {
  kind: "textarea";
  rows?: number;
  required?: boolean;
  nullable?: boolean;
  max?: number;
}

export interface NumberField extends BaseField {
  kind: "number";
  int?: boolean;
  min?: number;
  max?: number;
  step?: number;
  nullable?: boolean;
}

export interface BooleanField extends BaseField {
  kind: "boolean";
}

export interface SelectField extends BaseField {
  kind: "select";
  options: readonly { value: string; label: string }[];
}

export interface DateField extends BaseField {
  kind: "date";
}

export interface FileField extends BaseField {
  kind: "file";
  accept: "image" | "pdf";
  nullable?: boolean;
}

/** Short values entered as chips (tech stack, keywords). */
export interface TagsField extends BaseField {
  kind: "tags";
  suggestions?: readonly string[];
}

/** One value per line (features, roles, marquee items). */
export interface LinesField extends BaseField {
  kind: "lines";
  rows?: number;
}

/** Bangladesh districts, picked on a clickable map. Stored as district ids. */
export interface DistrictsField extends BaseField {
  kind: "districts";
}

/** Repeatable group of sub-fields (stats, timeline items, links). */
export interface ListField extends BaseField {
  kind: "list";
  itemLabel: string;
  fields: readonly Field[];
  max?: number;
}

/** Nested object rendered as a titled fieldset. */
export interface GroupField extends BaseField {
  kind: "group";
  fields: readonly Field[];
}

export type Field =
  | TextField
  | TextareaField
  | NumberField
  | BooleanField
  | SelectField
  | DateField
  | FileField
  | TagsField
  | LinesField
  | DistrictsField
  | ListField
  | GroupField;

type Nullable<F, T> = F extends { nullable: true } ? T | null : T;

export type FieldValue<F extends Field> = F extends { kind: "text" | "textarea" | "file" }
  ? Nullable<F, string>
  : F extends { kind: "number" }
    ? Nullable<F, number>
    : F extends { kind: "boolean" }
      ? boolean
      : F extends { kind: "select"; options: readonly { value: infer V }[] }
        ? V
        : F extends { kind: "date" }
          ? Date
          : F extends { kind: "tags" | "lines" }
            ? string[]
            : F extends { kind: "districts" }
              ? DistrictId[]
              : F extends { kind: "list"; fields: infer S extends readonly Field[] }
                ? ValuesOf<S>[]
                : F extends { kind: "group"; fields: infer S extends readonly Field[] }
                  ? ValuesOf<S>
                  : never;

/** The validated data shape described by a field list. */
export type ValuesOf<FS extends readonly Field[]> = {
  [F in FS[number] as F["name"]]: FieldValue<F>;
};

// ── Validation ────────────────────────────────────────────────────────────

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function isHttpUrl(v: string) {
  try {
    const u = new URL(v);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function isLink(v: string) {
  if (v.startsWith("/") && !v.startsWith("//")) return true;
  if (v.startsWith("mailto:")) return v.length > 7;
  return isHttpUrl(v);
}

function stringSchema(f: TextField | TextareaField | FileField): z.ZodTypeAny {
  const max = "max" in f && f.max ? f.max : f.kind === "textarea" ? 20_000 : 1_000;
  let s = z.string({ invalid_type_error: "Required" }).trim().max(max, `Keep it under ${max} characters`);
  if ("required" in f && f.required) s = s.min(1, "Required");
  if (f.kind === "text" && f.format === "slug") {
    s = s.regex(SLUG_RE, "Lowercase letters, numbers and single dashes only");
  }
  if (f.kind === "text" && f.format === "email") s = s.email("Enter a valid email");

  let out: z.ZodTypeAny = s;
  const format = f.kind === "text" ? f.format : f.kind === "file" ? "link" : undefined;
  if (format === "url") {
    out = s.refine((v) => v === "" || isHttpUrl(v), "Enter a full URL starting with https://");
  } else if (format === "link") {
    out = s.refine((v) => v === "" || isLink(v), "Enter a URL, mailto: link or a path like /projects");
  }
  return f.nullable ? out.transform((v: string) => (v === "" ? null : v)) : out;
}

function fieldSchema(f: Field): z.ZodTypeAny {
  switch (f.kind) {
    case "text":
    case "textarea":
    case "file":
      return stringSchema(f);
    case "number": {
      let n = z.number({ invalid_type_error: "Enter a number", required_error: "Required" }).finite();
      if (f.int) n = n.int("Whole numbers only");
      if (f.min !== undefined) n = n.min(f.min, `Minimum is ${f.min}`);
      if (f.max !== undefined) n = n.max(f.max, `Maximum is ${f.max}`);
      return z.preprocess(
        (v) => (v === "" || v === null || v === undefined ? (f.nullable ? null : undefined) : Number(v)),
        f.nullable ? n.nullable() : n,
      );
    }
    case "boolean":
      return z.boolean();
    case "select": {
      const values = f.options.map((o) => o.value) as [string, ...string[]];
      return z.enum(values, { errorMap: () => ({ message: "Pick one of the options" }) });
    }
    case "date":
      return z.coerce.date({ errorMap: () => ({ message: "Enter a valid date" }) });
    case "tags":
    case "lines":
      return z
        .array(z.string())
        .transform((items) => items.map((s) => s.trim()).filter(Boolean))
        .pipe(z.array(z.string().max(1_000)).max(100, "Too many items"));
    case "districts":
      // Unknown ids are dropped rather than rejected, so a renamed district
      // can't knock a whole saved section back to its defaults.
      return z
        .array(z.string())
        .transform((ids) => [...new Set(ids)].filter(isDistrictId));
    case "list":
      return z.array(objectSchema(f.fields)).max(f.max ?? 50, `At most ${f.max ?? 50} items`);
    case "group":
      return objectSchema(f.fields);
  }
}

function objectSchema(fields: readonly Field[]) {
  return z.object(Object.fromEntries(fields.map((f) => [f.name, fieldSchema(f)])));
}

/** Zod schema whose parsed output is exactly `ValuesOf<F>`. */
export function schemaFor<const F extends readonly Field[]>(fields: F) {
  return objectSchema(fields) as unknown as z.ZodType<ValuesOf<F>, z.ZodTypeDef, unknown>;
}

/** Flatten Zod issues to `{ "items.2.label": "Required" }` for inline form errors. */
export function issuesToFieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    if (!(key in out)) out[key] = issue.message;
  }
  return out;
}

// ── Form values ───────────────────────────────────────────────────────────

/** Form state is plain JSON: strings for text/dates, "" for empty numbers. */
export type FormValues = Record<string, unknown>;

export function emptyValue(f: Field): unknown {
  switch (f.kind) {
    case "text":
    case "textarea":
    case "file":
      return "";
    case "number":
      return f.nullable ? "" : (f.min ?? 0);
    case "boolean":
      return false;
    case "select":
      return f.options[0]?.value ?? "";
    case "date":
      return new Date().toISOString().slice(0, 10);
    case "tags":
    case "lines":
    case "districts":
    case "list":
      return [];
    case "group":
      return emptyValues(f.fields);
  }
}

export function emptyValues(fields: readonly Field[]): FormValues {
  return Object.fromEntries(fields.map((f) => [f.name, emptyValue(f)]));
}

/** Convert stored data (DB row or section JSON) into editable form values. */
export function toFormValues(fields: readonly Field[], data: Record<string, unknown>): FormValues {
  return Object.fromEntries(
    fields.map((f) => {
      const v = data[f.name];
      if (v === undefined) return [f.name, emptyValue(f)];
      switch (f.kind) {
        case "text":
        case "textarea":
        case "file":
          return [f.name, v ?? ""];
        case "number":
          return [f.name, v ?? ""];
        case "date": {
          const d = v instanceof Date ? v : new Date(String(v));
          return [f.name, Number.isNaN(d.getTime()) ? emptyValue(f) : d.toISOString().slice(0, 10)];
        }
        case "list":
          return [
            f.name,
            Array.isArray(v)
              ? v.map((item) => toFormValues(f.fields, (item ?? {}) as Record<string, unknown>))
              : [],
          ];
        case "group":
          return [f.name, toFormValues(f.fields, (v ?? {}) as Record<string, unknown>)];
        default:
          return [f.name, v ?? emptyValue(f)];
      }
    }),
  );
}
