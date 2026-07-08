"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "./auth";
import { createNotification } from "./notifications";
import { revalidatePath } from "next/cache";
import { logAudit } from "./audit";
import { TimelineService } from "@/services";

export type UpdateInput = {
  engagementId: string;
  content: string;
  nextSteps?: string;
  publish?: boolean;
};

/**
 * Create or save a project update
 */
export async function createUpdate(input: UpdateInput) {
  const pm = await requireAdmin();

  if (!input.content?.trim()) {
    throw new Error("Update content is required.");
  }

  const engagement = await prisma.engagement.findUnique({
    where: { id: input.engagementId },
    include: { user: true },
  });

  if (!engagement) {
    throw new Error("Engagement not found.");
  }

  // Create the update
  const update = await prisma.update.create({
    data: {
      engagementId: input.engagementId,
      pmId: pm.id,
      content: input.content,
      nextSteps: input.nextSteps?.trim() || null,
      draft: !input.publish,
      publishedAt: input.publish ? new Date() : null,
    },
  });

  // If published, notify the client and log activity
  if (input.publish) {
    const client = engagement.user;
    await createNotification({
      userId: client.id,
      type: "project_update",
      content: `New project update: ${input.content.substring(0, 100)}${input.content.length > 100 ? "..." : ""}`,
    });

    // Log to timeline
    await TimelineService.logActivity({
      engagementId: input.engagementId,
      actorId: pm.id,
      actorRole: pm.role,
      actionType: "MANUAL_UPDATE",
      description: input.content,
      metadata: { updateId: update.id },
    });

    void logAudit(pm.id, "UPDATE_PUBLISHED", "Update", update.id, {
      engagementId: input.engagementId,
    });
  }

  revalidatePath(`/admin-portal/engagements/${input.engagementId}`);
  revalidatePath("/client-portal/dashboard");

  return { success: true, updateId: update.id };
}

/**
 * Publish a draft update
 */
export async function publishUpdate(updateId: string) {
  const pm = await requireAdmin();

  const update = await prisma.update.findUnique({
    where: { id: updateId },
    include: { engagement: { include: { user: true } } },
  });

  if (!update) {
    throw new Error("Update not found.");
  }

  if (!update.draft) {
    throw new Error("Update is already published.");
  }

  const published = await prisma.update.update({
    where: { id: updateId },
    data: {
      draft: false,
      publishedAt: new Date(),
    },
  });

  // Notify client
  const client = update.engagement.user;
  await createNotification({
    userId: client.id,
    type: "project_update",
    content: `New project update: ${update.content.substring(0, 100)}${update.content.length > 100 ? "..." : ""}`,
  });

  // Log to timeline
  await TimelineService.logActivity({
    engagementId: update.engagementId,
    actorId: pm.id,
    actorRole: pm.role,
    actionType: "MANUAL_UPDATE",
    description: update.content,
    metadata: { updateId },
  });

  revalidatePath(`/admin-portal/engagements/${update.engagementId}`);
  revalidatePath("/client-portal/dashboard");

  void logAudit(pm.id, "UPDATE_PUBLISHED", "Update", updateId);

  return { success: true };
}

/**
 * Get updates for an engagement (including drafts for admins)
 */
export async function getEngagementUpdates(engagementId: string) {
  const { getSessionUser } = await import("./auth");
  const user = await getSessionUser();

  if (!user) throw new Error("Not authenticated.");

  const engagement = await prisma.engagement.findUnique({
    where: { id: engagementId },
    select: { userId: true, pmId: true },
  });

  if (!engagement) throw new Error("Engagement not found.");

  // Check authorization
  if (user.role === "CLIENT" && engagement.userId !== user.id) {
    throw new Error("Not authorised.");
  }
  if (user.role === "PM" && engagement.pmId !== user.id) {
    throw new Error("Not authorised.");
  }

  // Clients only see published updates
  const whereClause: any = { engagementId };
  if (user.role === "CLIENT") {
    whereClause.draft = false;
  }

  return prisma.update.findMany({
    where: whereClause,
    include: {
      pm: {
        select: {
          id: true,
          fullName: true,
          preferredName: true,
          photoUrl: true,
        },
      },
    },
    orderBy: { publishedAt: "desc" },
  });
}
