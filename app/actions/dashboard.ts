"use server";

import { prisma } from "@/lib/prisma";
import type { DashboardData } from "@/types";

export async function getClientDashboardData(
  userId: string,
): Promise<DashboardData | null> {
  const engagement = await prisma.engagement.findFirst({
    where: { userId, status: "active" },
    include: {
      updates: {
        where: { draft: false },
        orderBy: { publishedAt: "desc" },
        take: 1,
      },
      pendingActions: {
        where: { completedAt: null },
        orderBy: { dueDate: "asc" },
      },
    },
  });

  if (!engagement) return null;

  const pm = engagement.pmId
    ? await prisma.user.findUnique({
        where: { id: engagement.pmId },
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          photoUrl: true,
        },
      })
    : null;

  return {
    engagement,
    latestUpdate: engagement.updates[0] ?? null,
    pendingActions:
      engagement.pendingActions as DashboardData["pendingActions"],
    pm,
  };
}

export async function getAdminDashboardStats() {
  const [
    activeEngagements,
    totalClients,
    pendingActions,
    openEnquiries,
    recentEngagements,
  ] = await Promise.all([
    prisma.engagement.count({ where: { status: "active" } }),
    prisma.user.count({ where: { role: "CLIENT" } }),
    prisma.pendingAction.count({ where: { completedAt: null } }),
    prisma.enquiry.count({ where: { status: "open" } }),
    prisma.engagement.findMany({
      where: { status: "active" },
      orderBy: { startDate: "desc" },
      take: 8,
      include: {
        user: { select: { fullName: true, email: true } },
      },
    }),
  ]);

  return {
    activeEngagements,
    totalClients,
    pendingActions,
    openEnquiries,
    recentEngagements,
  };
}

export async function getPMDashboardData(pmUserId: string) {
  const engagements = await prisma.engagement.findMany({
    where: { pmId: pmUserId, status: "active" },
    orderBy: { startDate: "desc" },
    include: {
      user: { select: { fullName: true, email: true } },
      pendingActions: { where: { completedAt: null } },
    },
  });

  return { engagements };
}
