"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin, requireSuperAdmin } from "./auth";
import { createNotification } from "./notifications";
import { sendEmail } from "@/lib/email";
import {
  newUpdateEmailHtml,
  engagementActivatedEmailHtml,
} from "@/lib/email-templates";
import { logAudit } from "./audit";

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
          invoices: {
            orderBy: { createdAt: "desc" as const },
            select: {
              id: true,
              invoiceNumber: true,
              description: true,
              amount: true,
              currency: true,
              status: true,
              dueDate: true,
              issuedAt: true,
              paidAt: true,
            },
          },
          agreement: { select: { status: true } },
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

  void logAudit(pmId, "UPDATE_PUBLISHED", "Update", update.id, {
    engagementId,
  });

  return update;
}

export async function assignPM(engagementId: string, pmId: string) {
  await requireAdmin();
  await prisma.engagement.update({
    where: { id: engagementId },
    data: { pmId },
  });
  revalidatePath("/admin-portal/clients");
}


export async function getAllEngagements() {
  const admin = await requireAdmin();
  const where =
    admin.role === "PM"
      ? { status: "active", pmId: admin.id }
      : { status: "active" };
  return prisma.engagement.findMany({
    where,
    orderBy: { startDate: "desc" },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
          onboardingComplete: true,
        },
      },
      pm: { select: { id: true, fullName: true } },
      agreement: { select: { status: true } },
      invoices: { select: { id: true, status: true } },
    },
  });
}

export async function getEngagementDetail(engagementId: string) {
  await requireAdmin();
  return prisma.engagement.findUnique({
    where: { id: engagementId },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          preferredName: true,
          email: true,
          phone: true,
          nationality: true,
          location: true,
          idType: true,
          idNumber: true,
          onboardingComplete: true,
          photoUrl: true,
          createdAt: true,
          lastLogin: true,
        },
      },
      pm: { select: { id: true, fullName: true, email: true } },
      agreement: true,
      invoices: { orderBy: { createdAt: "desc" } },
      documents: { orderBy: { uploadedAt: "desc" } },
      strategyMeetings: {
        include: { pm: { select: { id: true, fullName: true } } },
        orderBy: { scheduledAt: "asc" },
      },
      updates: {
        orderBy: { publishedAt: "desc" },
        include: { pm: { select: { fullName: true } } },
      },
    },
  });
}

// ─── Client portal helpers ────────────────────────────────────────────────────

export async function getClientDocuments(clientUserId: string) {
  const { getSessionUser } = await import("./auth");
  const sessionUser = await getSessionUser();
  if (!sessionUser) throw new Error("Not authenticated.");

  // Clients may only see their own documents
  if (sessionUser.role === "CLIENT" && sessionUser.id !== clientUserId) {
    throw new Error("Not authorised.");
  }

  const engagement = await prisma.engagement.findFirst({
    where: { userId: clientUserId },
    include: {
      documents: {
        where: { isClientVisible: true },
        orderBy: { uploadedAt: "desc" },
      },
    },
  });

  return engagement?.documents ?? [];
}

/**
 * Returns total unread message count for the current user across all accessible engagements.
 * - ADMIN/PM: messages sent by others (not them) with readAt = null
 * - CLIENT: messages sent by others with readAt = null on their engagement
 */
export async function getUnreadMessageCount(): Promise<number> {
  const { getSessionUser } = await import("./auth");
  const user = await getSessionUser();
  if (!user) return 0;

  if (user.role === "CLIENT") {
    const engagement = await prisma.engagement.findFirst({
      where: { userId: user.id },
      select: { id: true },
    });
    if (!engagement) return 0;
    return prisma.message.count({
      where: {
        engagementId: engagement.id,
        senderId: { not: user.id },
        readAt: null,
      },
    });
  }

  // ADMIN / PM
  const where = user.role === "PM" ? { pmId: user.id } : {};
  const engagements = await prisma.engagement.findMany({
    where,
    select: { id: true },
  });
  const ids = engagements.map((e) => e.id);
  if (!ids.length) return 0;
  return prisma.message.count({
    where: {
      engagementId: { in: ids },
      senderId: { not: user.id },
      readAt: null,
    },
  });
}

export async function getClientMessages(clientUserId: string) {
  const { getSessionUser } = await import("./auth");
  const sessionUser = await getSessionUser();
  if (!sessionUser) throw new Error("Not authenticated.");

  if (sessionUser.role === "CLIENT" && sessionUser.id !== clientUserId) {
    throw new Error("Not authorised.");
  }

  const engagement = await prisma.engagement.findFirst({
    where: { userId: clientUserId },
    include: {
      messages: {
        include: {
          sender: {
            select: {
              id: true,
              fullName: true,
              preferredName: true,
              photoUrl: true,
              role: true,
            },
          },
        },
        orderBy: { sentAt: "asc" },
      },
      pm: {
        select: {
          id: true,
          fullName: true,
          preferredName: true,
          photoUrl: true,
          role: true,
        },
      },
    },
  });

  return {
    messages: engagement?.messages ?? [],
    engagementId: engagement?.id ?? null,
    pmInfo: engagement?.pm ?? null,
  };
}

export async function sendMessage({
  engagementId,
  body,
}: {
  engagementId: string;
  body: string;
}) {
  const { getSessionUser } = await import("./auth");
  const sessionUser = await getSessionUser();
  if (!sessionUser) throw new Error("Not authenticated.");

  const trimmedBody = body?.trim();
  if (!trimmedBody) throw new Error("Message body is required.");

  const engagement = await prisma.engagement.findUnique({
    where: { id: engagementId },
    select: { userId: true, pmId: true },
  });
  if (!engagement) throw new Error("Engagement not found.");

  // Client, assigned PM, or ADMIN may send
  const isClient =
    sessionUser.role === "CLIENT" && sessionUser.id === engagement.userId;
  const isPmOrAdmin =
    sessionUser.role !== "CLIENT" &&
    (engagement.pmId === sessionUser.id || sessionUser.role === "ADMIN");
  if (!isClient && !isPmOrAdmin) throw new Error("Not authorised.");

  const message = await prisma.message.create({
    data: { engagementId, senderId: sessionUser.id, body: trimmedBody },
    include: {
      sender: {
        select: {
          id: true,
          fullName: true,
          preferredName: true,
          photoUrl: true,
          role: true,
        },
      },
    },
  });

  revalidatePath("/client-portal/messages");
  revalidatePath(`/admin-portal/messages/${engagementId}`);
  revalidatePath("/admin-portal/messages");
  revalidatePath(`/admin-portal/clients/${engagement.userId}`);

  void logAudit(sessionUser.id, "MESSAGE_SENT", "Message", message.id, {
    engagementId,
  });

  return message;
}

// ── Super-admin: delete an engagement ─────────────────────────────────────

export async function deleteEngagement(
  id: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const admin = await requireSuperAdmin();

  const engagement = await prisma.engagement.findUnique({
    where: { id },
    select: { id: true, userId: true },
  });
  if (!engagement) return { ok: false, error: "Engagement not found." };

  await prisma.engagement.delete({ where: { id } });

  void logAudit(admin.id, "ENGAGEMENT_DELETED", "Engagement", id, {
    userId: engagement.userId,
  });

  revalidatePath("/admin-portal/engagements");
  revalidatePath(`/admin-portal/clients/${engagement.userId}`);
  return { ok: true };
}

// ─── Admin messaging ──────────────────────────────────────────────────────────

/**
 * Returns all engagements that have messages, scoped by role:
 * - ADMIN: all engagements
 * - PM: only engagements where they are the assigned PM
 * Each record includes the last message and basic client/PM info.
 */
export async function getAdminConversations() {
  const actor = await requireAdmin();

  const where =
    actor.role === "PM"
      ? { pmId: actor.id, messages: { some: {} } }
      : { messages: { some: {} } };

  return prisma.engagement
    .findMany({
      where,
      orderBy: { startDate: "desc" },
      select: {
        id: true,
        stage: true,
        status: true,
        pmId: true,
        user: {
          select: {
            id: true,
            fullName: true,
            preferredName: true,
            email: true,
            photoUrl: true,
          },
        },
        pm: {
          select: {
            id: true,
            fullName: true,
            preferredName: true,
            photoUrl: true,
          },
        },
        messages: {
          orderBy: { sentAt: "desc" },
          take: 1,
          select: {
            id: true,
            body: true,
            sentAt: true,
            sender: {
              select: {
                id: true,
                fullName: true,
                preferredName: true,
                role: true,
              },
            },
          },
        },
        _count: {
          select: {
            messages: true,
          },
        },
      },
    })
    .then((engagements) =>
      // Annotate each with unread count (messages sent by others with no readAt)
      Promise.all(
        engagements.map(async (e) => ({
          ...e,
          unreadCount: await prisma.message.count({
            where: {
              engagementId: e.id,
              senderId: { not: actor.id },
              readAt: null,
            },
          }),
        })),
      ),
    );
}

/**
 * Returns the full message thread for an engagement.
 * - ADMIN: can fetch any engagement (read-only unless they are the PM)
 * - PM: can only fetch engagements they are assigned to
 */
export async function getAdminEngagementMessages(engagementId: string) {
  const actor = await requireAdmin();

  const engagement = await prisma.engagement.findUnique({
    where: { id: engagementId },
    select: {
      id: true,
      pmId: true,
      status: true,
      stage: true,
      user: {
        select: {
          id: true,
          fullName: true,
          preferredName: true,
          email: true,
          photoUrl: true,
          role: true,
        },
      },
      pm: {
        select: {
          id: true,
          fullName: true,
          preferredName: true,
          email: true,
          photoUrl: true,
          role: true,
        },
      },
      messages: {
        include: {
          sender: {
            select: {
              id: true,
              fullName: true,
              preferredName: true,
              photoUrl: true,
              role: true,
            },
          },
        },
        orderBy: { sentAt: "asc" },
      },
    },
  });

  if (!engagement) throw new Error("Engagement not found.");

  // PM role: must be the assigned PM
  if (actor.role === "PM" && engagement.pmId !== actor.id) {
    throw new Error("Not authorised.");
  }

  // ADMIN can always send; PM only if assigned to this engagement
  const canSend = actor.role === "ADMIN" || engagement.pmId === actor.id;

  return { engagement, canSend };
}

/**
 * Returns the message thread for an engagement.
 * Works for CLIENT (own engagement), PM (assigned), and ADMIN.
 */
export async function getEngagementMessageThread(engagementId: string) {
  const { getSessionUser } = await import("./auth");
  const sessionUser = await getSessionUser();
  if (!sessionUser) throw new Error("Not authenticated.");

  const engagement = await prisma.engagement.findUnique({
    where: { id: engagementId },
    select: {
      id: true,
      userId: true,
      pmId: true,
      user: {
        select: {
          id: true,
          fullName: true,
          preferredName: true,
          photoUrl: true,
          role: true,
        },
      },
      pm: {
        select: {
          id: true,
          fullName: true,
          preferredName: true,
          photoUrl: true,
          role: true,
        },
      },
      messages: {
        include: {
          sender: {
            select: {
              id: true,
              fullName: true,
              preferredName: true,
              photoUrl: true,
              role: true,
            },
          },
        },
        orderBy: { sentAt: "asc" },
      },
    },
  });

  if (!engagement) throw new Error("Engagement not found.");

  const isClient =
    sessionUser.role === "CLIENT" && sessionUser.id === engagement.userId;
  const isPm =
    sessionUser.role === "PM" && engagement.pmId === sessionUser.id;
  const isAdmin = sessionUser.role === "ADMIN";

  if (!isClient && !isPm && !isAdmin) {
    throw new Error("Not authorised.");
  }

  const canSend =
    isClient ||
    isAdmin ||
    (sessionUser.role === "PM" && engagement.pmId === sessionUser.id);

  return {
    messages: engagement.messages,
    engagementId: engagement.id,
    pmInfo: engagement.pm,
    clientInfo: engagement.user,
    canSend,
  };
}

/**
 * Returns all active engagements the current user may initiate a conversation with:
 * - ADMIN: all active engagements
 * - PM: only engagements where they are the assigned PM
 */
export async function getAccessibleClientsForChat() {
  const actor = await requireAdmin();

  const where =
    actor.role === "PM"
      ? { pmId: actor.id, status: "active" }
      : { status: "active" };

  return prisma.engagement.findMany({
    where,
    orderBy: { startDate: "desc" },
    select: {
      id: true,
      stage: true,
      user: {
        select: {
          id: true,
          fullName: true,
          preferredName: true,
          email: true,
        },
      },
    },
  });
}
