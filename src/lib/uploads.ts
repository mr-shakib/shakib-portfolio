import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { env } from "@/lib/env";

/**
 * Admin uploads live on local disk (a Docker volume in production) and are
 * served by app/uploads/[name]/route.ts. The file type is detected from the
 * bytes, never trusted from the browser, and files get random names.
 */

export const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;

const TYPES = {
  jpg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  avif: "image/avif",
  pdf: "application/pdf",
} as const;

export type UploadExt = keyof typeof TYPES;

export const UPLOAD_NAME = /^[a-z0-9]+-[a-f0-9]{8}\.(jpg|png|gif|webp|avif|pdf)$/;

export function uploadDir() {
  return path.resolve(env.UPLOAD_DIR ?? path.join(process.cwd(), "uploads"));
}

export function contentTypeFor(name: string): string {
  const ext = name.split(".").pop() as UploadExt;
  return TYPES[ext] ?? "application/octet-stream";
}

/** Identify the file from its magic bytes. */
export function sniff(bytes: Uint8Array): UploadExt | null {
  const ascii = (start: number, end: number) => String.fromCharCode(...bytes.slice(start, end));
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "jpg";
  if (ascii(1, 4) === "PNG" && bytes[0] === 0x89) return "png";
  if (ascii(0, 4) === "GIF8") return "gif";
  if (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") return "webp";
  if (ascii(4, 8) === "ftyp" && ["avif", "avis"].includes(ascii(8, 12))) return "avif";
  if (ascii(0, 5) === "%PDF-") return "pdf";
  return null;
}

export async function saveUpload(bytes: Uint8Array, ext: UploadExt): Promise<string> {
  const name = `${Date.now().toString(36)}-${randomUUID().slice(0, 8)}.${ext}`;
  const dir = uploadDir();
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), bytes);
  return `/uploads/${name}`;
}

export async function readUpload(name: string): Promise<Buffer | null> {
  if (!UPLOAD_NAME.test(name)) return null;
  try {
    return await readFile(path.join(uploadDir(), name));
  } catch {
    return null;
  }
}
