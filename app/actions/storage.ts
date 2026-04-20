"use server";

/**
 * Supabase Storage helpers for article cover images.
 *
 * One-time setup in Supabase Dashboard → Storage:
 *  1. Create a new bucket named "article-images".
 *  2. Enable "Public bucket" so images are served without auth tokens.
 *  3. Add an INSERT policy so authenticated users can upload:
 *       Bucket ID : article-images
 *       Operation : INSERT
 *       Target    : authenticated
 *       Condition : (bucket_id = 'article-images')
 */

import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "./auth";

const BUCKET = "article-images";
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export async function uploadArticleImage(
  formData: FormData,
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  await requireAdmin();

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { ok: false, error: "No file provided." };
  }

  // Server-side validation (mirrors client-side checks)
  if (!ALLOWED_MIME.has(file.type)) {
    return {
      ok: false,
      error: "Only JPEG, PNG, WebP, and GIF images are allowed.",
    };
  }
  if (file.size > MAX_BYTES) {
    return { ok: false, error: "Image must be under 5 MB." };
  }

  const supabase = createAdminClient();

  // Derive a safe extension from the original filename
  const rawExt = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const ext = ["jpg", "jpeg", "png", "webp", "gif"].includes(rawExt)
    ? rawExt
    : "jpg";

  const filename = `articles/${crypto.randomUUID()}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(filename, arrayBuffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    return { ok: false, error: uploadError.message };
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filename);
  return { ok: true, url: data.publicUrl };
}
