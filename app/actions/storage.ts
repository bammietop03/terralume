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
 *
 * For engagement-docs:
 *  1. Create a private bucket named "engagement-docs".
 *  2. Do NOT enable "Public bucket".
 *  3. Add an INSERT policy for authenticated users.
 */

import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "./auth";
import { logAudit } from "./audit";

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

// ── Engagement document upload ────────────────────────────────────────────
// Requires a private Supabase Storage bucket named "engagement-docs".

const DOC_BUCKET = "engagement-docs";
const DOC_MAX_BYTES = 20 * 1024 * 1024; // 20 MB
const ALLOWED_DOC_MIME = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

const ALLOWED_DOC_EXT = new Set([
  "pdf",
  "doc",
  "docx",
  "xls",
  "xlsx",
  "jpg",
  "jpeg",
  "png",
  "webp",
]);

export async function uploadEngagementDocument(
  formData: FormData,
  engagementId: string,
  category: string,
  isClientVisible = true,
  title?: string,
): Promise<{ ok: true; documentId: string } | { ok: false; error: string }> {
  const admin = await requireAdmin();

  const file = formData.get("file");
  if (!(file instanceof File)) return { ok: false, error: "No file provided." };

  if (!ALLOWED_DOC_MIME.has(file.type)) {
    return { ok: false, error: "Unsupported file type." };
  }
  if (file.size > DOC_MAX_BYTES) {
    return { ok: false, error: "File must be under 20 MB." };
  }

  const rawExt = file.name.split(".").pop()?.toLowerCase() ?? "pdf";
  const ext = ALLOWED_DOC_EXT.has(rawExt) ? rawExt : "pdf";
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const filePath = `${engagementId}/${crypto.randomUUID()}-${safeName}`;

  const supabase = createAdminClient();
  const arrayBuffer = await file.arrayBuffer();

  const { error: uploadError } = await supabase.storage
    .from(DOC_BUCKET)
    .upload(filePath, arrayBuffer, { contentType: file.type, upsert: false });

  if (uploadError) return { ok: false, error: uploadError.message };

  const { prisma } = await import("@/lib/prisma");
  const doc = await prisma.document.create({
    data: {
      engagementId,
      name: file.name,
      title: title?.trim() || null,
      category: category || null,
      filePath,
      uploadedBy: admin.id,
      isClientVisible,
    },
  });

  // Notify the client
  const { createNotification } = await import("./notifications");
  const { sendEmail } = await import("@/lib/email");
  const { newDocumentEmailHtml } = await import("@/lib/email-templates");

  const engagement = await prisma.engagement.findUnique({
    where: { id: engagementId },
    include: { user: true },
  });

  if (engagement && isClientVisible) {
    const client = engagement.user;
    const clientName = client.preferredName ?? client.fullName ?? "there";
    const portalUrl = `${process.env.NEXT_PUBLIC_APP_URL}/client-portal/engagement`;

    await Promise.all([
      createNotification({
        userId: client.id,
        type: "new_document",
        content: `A new document "${file.name}" has been added to your portal.`,
      }),
      sendEmail({
        to: client.email,
        subject: "New Document Added to Your Portal — Terralume",
        html: newDocumentEmailHtml({
          clientName,
          documentName: file.name,
          category,
          portalUrl,
        }),
      }),
    ]);

    // Log activity to timeline
    const { TimelineService } = await import("@/services/TimelineService");
    await TimelineService.logActivity({
      engagementId,
      actorId: admin.id,
      actorRole: admin.role,
      actionType: "DOCUMENT_UPLOADED",
      description: `Document uploaded: ${file.name}`,
      metadata: { documentId: doc.id, category, fileName: file.name },
    });
  }

  const { revalidatePath } = await import("next/cache");
  revalidatePath(`/admin-portal/clients/${engagement?.userId}`);
  revalidatePath("/client-portal/engagement");

  void logAudit(admin.id, "DOCUMENT_UPLOADED", "Document", doc.id, {
    engagementId,
    category,
    fileName: file.name,
  });

  return { ok: true, documentId: doc.id };
}

export async function clientUploadEngagementDocument(
  formData: FormData,
  engagementId: string,
  category: string,
  title?: string,
): Promise<{ ok: true; documentId: string } | { ok: false; error: string }> {
  const { getSessionUser } = await import("./auth");
  const client = await getSessionUser();
  if (!client || client.role !== "CLIENT") {
    return { ok: false, error: "Not authorised." };
  }

  const file = formData.get("file");
  if (!(file instanceof File)) return { ok: false, error: "No file provided." };

  if (!ALLOWED_DOC_MIME.has(file.type)) {
    return { ok: false, error: "Unsupported file type." };
  }
  if (file.size > DOC_MAX_BYTES) {
    return { ok: false, error: "File must be under 20 MB." };
  }

  const { prisma } = await import("@/lib/prisma");

  // Verify ownership
  const engagement = await prisma.engagement.findUnique({
    where: { id: engagementId },
    select: { userId: true, pmId: true },
  });

  if (!engagement || engagement.userId !== client.id) {
    return { ok: false, error: "Not authorised." };
  }

  const rawExt = file.name.split(".").pop()?.toLowerCase() ?? "pdf";
  const ext = ALLOWED_DOC_EXT.has(rawExt) ? rawExt : "pdf";
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const filePath = `${engagementId}/${crypto.randomUUID()}-${safeName}`;

  const supabase = createAdminClient();
  const arrayBuffer = await file.arrayBuffer();

  const { error: uploadError } = await supabase.storage
    .from(DOC_BUCKET)
    .upload(filePath, arrayBuffer, { contentType: file.type, upsert: false });

  if (uploadError) return { ok: false, error: uploadError.message };

  const doc = await prisma.document.create({
    data: {
      engagementId,
      name: file.name,
      title: title?.trim() || null,
      category: category || null,
      filePath,
      uploadedBy: client.id,
      isClientVisible: true,
    },
  });

  // Notify the PM or admins
  const { createNotification } = await import("./notifications");
  
  if (engagement.pmId) {
    await createNotification({
      userId: engagement.pmId,
      type: "new_document",
      content: `A new document "${file.name}" has been uploaded by the client.`,
    });
  }

  const { TimelineService } = await import("@/services/TimelineService");
  await TimelineService.logActivity({
    engagementId,
    actorId: client.id,
    actorRole: client.role,
    actionType: "DOCUMENT_UPLOADED",
    description: `Document uploaded: ${file.name}`,
    metadata: { documentId: doc.id, category, fileName: file.name },
  });

  const { revalidatePath } = await import("next/cache");
  revalidatePath(`/admin-portal/engagements/${engagementId}`);
  revalidatePath("/client-portal/engagement");

  void logAudit(client.id, "DOCUMENT_UPLOADED", "Document", doc.id, {
    engagementId,
    category,
    fileName: file.name,
  });

  return { ok: true, documentId: doc.id };
}

/** Deletes a document record and removes the file from storage */
export async function deleteDocument(
  documentId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const admin = await requireAdmin();
  const { prisma } = await import("@/lib/prisma");

  const doc = await prisma.document.findUnique({ where: { id: documentId } });
  if (!doc) return { ok: false, error: "Document not found." };

  const supabase = createAdminClient();
  const { error: storageError } = await supabase.storage
    .from(DOC_BUCKET)
    .remove([doc.filePath]);

  if (storageError) {
    return { ok: false, error: storageError.message };
  }

  await prisma.document.delete({ where: { id: documentId } });

  const { revalidatePath } = await import("next/cache");
  revalidatePath(`/admin-portal/engagements/${doc.engagementId}`);
  revalidatePath("/client-portal/engagement");

  void logAudit(admin.id, "DOCUMENT_DELETED", "Document", documentId, {
    fileName: doc.name,
  });

  return { ok: true };
}

/** Returns a short-lived signed URL for a private engagement document */
export async function getDocumentSignedUrl(
  filePath: string,
  expiresInSeconds = 300,
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.storage
    .from(DOC_BUCKET)
    .createSignedUrl(filePath, expiresInSeconds);

  if (error || !data?.signedUrl) {
    return { ok: false, error: error?.message ?? "Could not generate URL." };
  }
  return { ok: true, url: data.signedUrl };
}

/** Get all documents for an engagement */
export async function getEngagementDocuments(engagementId: string) {
  const { getSessionUser } = await import("./auth");
  const { prisma } = await import("@/lib/prisma");

  const user = await getSessionUser();
  if (!user) throw new Error("Not authenticated.");

  const engagement = await prisma.engagement.findUnique({
    where: { id: engagementId },
    select: { userId: true, pmId: true },
  });
  if (!engagement) throw new Error("Engagement not found.");

  // Clients can only see their own engagement documents
  // PM can only see engagements they manage
  // Admins can see all
  if (user.role === "CLIENT" && engagement.userId !== user.id) {
    throw new Error("Not authorised.");
  }
  if (user.role === "PM" && engagement.pmId !== user.id) {
    throw new Error("Not authorised.");
  }

  const where =
    user.role === "CLIENT"
      ? { engagementId, isClientVisible: true }
      : { engagementId };

  return prisma.document.findMany({
    where,
    orderBy: { uploadedAt: "desc" },
  });
}
