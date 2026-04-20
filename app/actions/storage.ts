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

// ── Avatar upload ─────────────────────────────────────────────────────────
// Requires a Supabase Storage bucket named "avatars" with public read access.

const AVATAR_BUCKET = "avatars";
const AVATAR_MAX_BYTES = 3 * 1024 * 1024; // 3 MB

export async function uploadAvatar(
  formData: FormData,
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  const { getSessionUser } = await import("./auth");
  const sessionUser = await getSessionUser();
  if (!sessionUser) return { ok: false, error: "Not authenticated." };

  const file = formData.get("file");
  if (!(file instanceof File)) return { ok: false, error: "No file provided." };

  if (!ALLOWED_MIME.has(file.type)) {
    return { ok: false, error: "Only JPEG, PNG, WebP, and GIF are allowed." };
  }
  if (file.size > AVATAR_MAX_BYTES) {
    return { ok: false, error: "Avatar must be under 3 MB." };
  }

  const supabase = createAdminClient();
  const rawExt = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const ext = ["jpg", "jpeg", "png", "webp"].includes(rawExt) ? rawExt : "jpg";
  const filename = `${sessionUser.id}/avatar.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const { error: uploadError } = await supabase.storage
    .from(AVATAR_BUCKET)
    .upload(filename, arrayBuffer, { contentType: file.type, upsert: true });

  if (uploadError) return { ok: false, error: uploadError.message };

  const { data } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(filename);

  // Bust CDN cache by appending a timestamp query param
  const url = `${data.publicUrl}?t=${Date.now()}`;

  // Persist to DB
  const { prisma } = await import("@/lib/prisma");
  await prisma.user.update({
    where: { id: sessionUser.id },
    data: { photoUrl: url },
  });

  const { revalidatePath } = await import("next/cache");
  revalidatePath("/client-portal/profile");
  revalidatePath("/admin-portal/settings");

  return { ok: true, url };
}
