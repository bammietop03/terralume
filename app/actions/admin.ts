"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "./auth";
import { createNotification } from "./notifications";
import { sendEmail } from "@/lib/email";
import { newUpdateEmailHtml } from "@/lib/email-templates";

export async function getAllClients() {
  await requireAdmin();
  return prisma.user.findMany({
    where: { role: "CLIENT" },
    include: {
      engagements: {
        where: { status: "active" },
        take: 1,
        orderBy: { startDate: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getClientsByPM(pmId: string) {
  await requireAdmin();
  return prisma.user.findMany({
    where: {
      role: "CLIENT",
      engagements: { some: { pmId } },
    },
    include: {
      engagements: {
        where: { pmId },
        take: 1,
      },
    },
  });
}

export async function getClientDetail(userId: string) {
  await requireAdmin();
  return prisma.user.findUnique({
    where: { id: userId, role: "CLIENT" },
    include: {
      engagements: {
        include: {
          updates: { orderBy: { publishedAt: "desc" }, take: 5 },
          documents: { orderBy: { uploadedAt: "desc" } },
          payments: { orderBy: { createdAt: "desc" } },
          pendingActions: { orderBy: { createdAt: "desc" } },
        },
      },
      enquiries: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });
}

export async function publishUpdate({
  engagementId,
  content,
  nextSteps,
  pmId,
}: {
  engagementId: string;
  content: string;
  nextSteps?: string;
  pmId: string;
}) {
  await requireAdmin();

  const update = await prisma.update.create({
    data: {
      engagementId,
      pmId,
      content,
      nextSteps: nextSteps ?? null,
      draft: false,
      publishedAt: new Date(),
    },
  });

  // Fetch engagement to get client userId
  const engagement = await prisma.engagement.findUnique({
    where: { id: engagementId },
    include: { user: { select: { id: true, fullName: true, email: true } } },
  });

  if (engagement?.user) {
    const { id: userId, fullName, email } = engagement.user;

    // In-app notification
    await createNotification({
      userId,
      type: "NEW_UPDATE",
      content: `Your PM has posted a new update on your engagement.`,
    });

    // Email notification
    await sendEmail({
      to: email,
      subject: "New update on your property search",
      html: newUpdateEmailHtml({
        clientName: fullName ?? "there",
        content,
        nextSteps: nextSteps ?? null,
        portalUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/client-portal/dashboard`,
      }),
    }).catch(() => {}); // Non-critical
  }

  revalidatePath(`/admin-portal/clients/${engagement?.userId}`);
  return update;
}

export async function createPendingAction({
  engagementId,
  title,
  type,
  dueDate,
}: {
  engagementId: string;
  title: string;
  type: string;
  dueDate?: Date;
}) {
  await requireAdmin();

  const action = await prisma.pendingAction.create({
    data: { engagementId, title, type, dueDate: dueDate ?? null },
  });

  const engagement = await prisma.engagement.findUnique({
    where: { id: engagementId },
    select: { userId: true, user: { select: { fullName: true, email: true } } },
  });

  if (engagement?.user) {
    await createNotification({
      userId: engagement.userId,
      type: "PENDING_ACTION",
      content: `Action required: ${title}`,
    });
  }

  revalidatePath(`/admin-portal/clients/${engagement?.userId}`);
  return action;
}

export async function completePendingAction(actionId: string) {
  await requireAdmin();
  await prisma.pendingAction.update({
    where: { id: actionId },
    data: { completedAt: new Date() },
  });
  revalidatePath("/", "layout");
}

export async function assignPM(engagementId: string, pmId: string) {
  await requireAdmin();
  await prisma.engagement.update({
    where: { id: engagementId },
    data: { pmId },
  });
  revalidatePath("/admin-portal/clients");
}
