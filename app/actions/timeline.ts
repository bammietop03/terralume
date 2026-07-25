"use server";

import { requireAdmin, getSessionUser } from "./auth";
import { TimelineService } from "@/services";
import { logAudit } from "./audit";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

// ── Get engagement timeline ───────────────────────────────────────────────

export async function getEngagementTimeline(
  engagementId: string,
  limit?: number,
) {
  const sessionUser = await getSessionUser();
  if (!sessionUser) return [];

  // Authorization check would go here (check if user has access to this engagement)

  return TimelineService.getEngagementTimeline(engagementId, limit);
}

// ── Get recent updates for client dashboard ───────────────────────────────

export async function getRecentUpdates(engagementId: string, limit = 5) {
  return TimelineService.getRecentUpdates(engagementId, limit);
}

// ── PM: Log manual update ─────────────────────────────────────────────────

export async function logManualUpdate(params: {
  engagementId: string;
  description: string;
  metadata?: Record<string, unknown>;
}) {
  const pm = await requireAdmin();

  try {
    const activity = await TimelineService.logManualUpdate({
      engagementId: params.engagementId,
      pmId: pm.id,
      description: params.description,
      metadata: params.metadata,
    });

    revalidatePath(`/admin-portal/engagements/${params.engagementId}`);
    revalidatePath("/client-portal/dashboard");

    void logAudit(pm.id, "MANUAL_UPDATE", "ActivityLog", activity?.id, {
      description: params.description,
    });

    return { success: true, activityId: activity?.id };
  } catch (error) {
    console.error("Error logging manual update:", error);
    return { success: false, error: "Failed to log update" };
  }
}

// ── Get stage history ─────────────────────────────────────────────────────

export async function getStageHistory(engagementId: string) {
  return TimelineService.getStageHistory(engagementId);
}

// ── Get document history ──────────────────────────────────────────────────

export async function getDocumentHistory(engagementId: string) {
  return TimelineService.getDocumentHistory(engagementId);
}

// ── Get task timeline ─────────────────────────────────────────────────────

export async function getTaskTimeline(engagementId: string) {
  return TimelineService.getTaskTimeline(engagementId);
}

// ── Get progress summary ──────────────────────────────────────────────────

export async function getProgressSummary(engagementId: string) {
  const sessionUser = await getSessionUser();
  if (!sessionUser) return null;

  try {
    return await TimelineService.getProgressSummary(engagementId);
  } catch (error) {
    console.error("Error getting progress summary:", error);
    return null;
  }
}

// ── Internal notes (PM/Admin only) ───────────────────────────────────────

export type InternalNote = {
  id: string;
  note: string;
  timestamp: Date;
  authorId: string;
  authorName: string;
  authorRole: "PM" | "ADMIN";
};

export async function createInternalNote(params: {
  engagementId: string;
  note: string;
}) {
  const staff = await requireAdmin();
  const note = params.note.trim();

  if (!note) {
    return { success: false, error: "Note cannot be empty." } as const;
  }

  const engagement = await prisma.engagement.findUnique({
    where: { id: params.engagementId },
    select: { id: true, pmId: true },
  });

  if (!engagement) {
    return { success: false, error: "Engagement not found." } as const;
  }

  if (staff.role === "PM" && engagement.pmId !== staff.id) {
    return {
      success: false,
      error: "You can only add notes to your assigned engagements.",
    } as const;
  }

  const activity = await prisma.activityLog.create({
    data: {
      engagementId: engagement.id,
      actorId: staff.id,
      actorRole: staff.role,
      actionType: "MANUAL_UPDATE",
      description: note,
      metadata: {
        internalOnly: true,
        entryType: "INTERNAL_NOTE",
      },
    },
  });

  revalidatePath(`/admin-portal/engagements/${engagement.id}`);

  void logAudit(staff.id, "INTERNAL_NOTE_CREATED", "ActivityLog", activity.id, {
    engagementId: engagement.id,
  });

  return { success: true, noteId: activity.id } as const;
}

export async function getInternalNotes(
  engagementId: string,
): Promise<InternalNote[]> {
  const staff = await requireAdmin();

  const engagement = await prisma.engagement.findUnique({
    where: { id: engagementId },
    select: { id: true, pmId: true },
  });

  if (!engagement) return [];

  if (staff.role === "PM" && engagement.pmId !== staff.id) {
    return [];
  }

  const notes = await prisma.activityLog.findMany({
    where: {
      engagementId,
      metadata: {
        path: ["internalOnly"],
        equals: true,
      },
    },
    include: {
      actor: {
        select: {
          id: true,
          fullName: true,
          preferredName: true,
          role: true,
        },
      },
    },
    orderBy: { timestamp: "desc" },
  });

  return notes.map((entry) => ({
    id: entry.id,
    note: entry.description,
    timestamp: entry.timestamp,
    authorId: entry.actor.id,
    authorName: entry.actor.preferredName || entry.actor.fullName || "Staff",
    authorRole: entry.actor.role as "PM" | "ADMIN",
  }));
}
