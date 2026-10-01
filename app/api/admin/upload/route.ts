import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/auth/session";
import { MAX_UPLOAD_BYTES, saveUpload, sniff } from "@/lib/uploads";

/** Admin-only file upload. Returns `{ url }` for the stored file. */
export async function POST(request: Request) {
  if (!(await getAdmin())) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  const accept = form?.get("accept");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file received." }, { status: 400 });
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: "Files must be 15 MB or smaller." }, { status: 413 });
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const ext = sniff(bytes);
  const wantsPdf = accept === "pdf";
  if (!ext || (wantsPdf ? ext !== "pdf" : ext === "pdf")) {
    return NextResponse.json(
      { error: wantsPdf ? "That isn’t a PDF." : "Use a JPG, PNG, WebP, AVIF or GIF image." },
      { status: 415 },
    );
  }

  const url = await saveUpload(bytes, ext);
  return NextResponse.json({ url });
}
