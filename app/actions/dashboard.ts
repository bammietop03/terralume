"use server";

import { prisma } from "@/lib/prisma";
import type { DashboardData } from "@/types";

export async function getClientDashboardData(userId: string): Promise<
  | (DashboardData & {
      paymentSummary: {
        totalPaid: number;
        currency: string;
        pendingAmount: number;
      };
      documentCount: number;
      upcomingMeeting: {
        title: string | null;
        scheduledAt: Date;
        meetingLink: string | null;
      } | null;
    })
  | null
> {
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

  const [pm, payments, documentCount, upcomingMeeting] = await Promise.all([
    engagement.pmId
      ? prisma.user.findUnique({
          where: { id: engagement.pmId },
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            photoUrl: true,
          },
        })
      : Promise.resolve(null),
    prisma.payment.findMany({
      where: { engagementId: engagement.id },
      select: { amount: true, currency: true, status: true },
    }),
    prisma.document.count({
      where: { engagementId: engagement.id, isClientVisible: true },
    }),
    prisma.strategyMeeting.findFirst({
      where: {
        engagementId: engagement.id,
        scheduledAt: { gte: new Date() },
        status: "SCHEDULED",
      },
      orderBy: { scheduledAt: "asc" },
      select: { title: true, scheduledAt: true, meetingLink: true },
    }),
  ]);

  const successPayments = payments.filter((p) => p.status === "SUCCESS");
  const pendingPayments = payments.filter((p) => p.status === "PENDING");
  const totalPaid = successPayments.reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = pendingPayments.reduce((sum, p) => sum + p.amount, 0);
  const currency = payments[0]?.currency ?? "NGN";

  return {
    engagement,
    latestUpdate: engagement.updates[0] ?? null,
    pendingActions:
      engagement.pendingActions as DashboardData["pendingActions"],
    pm,
    paymentSummary: { totalPaid, currency, pendingAmount },
    documentCount,
    upcomingMeeting,
  };
}

export async function getAdminDashboardStats() {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [
    activeEngagements,
    totalClients,
    pendingActions,
    openEnquiries,
    recentEngagements,
    newLeads,
    pendingIntakes,
    stageCounts,
    recentUpdates,
    revenueResult,
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
        pendingActions: { where: { completedAt: null }, select: { id: true } },
      },
    }),
    prisma.lead.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.intakeSubmission.count({
      where: { status: { in: ["PENDING", "REVIEWING"] } },
    }),
    prisma.engagement.groupBy({
      by: ["stage"],
      where: { status: "active" },
      _count: true,
    }),
    prisma.update.findMany({
      where: { draft: false, publishedAt: { not: null } },
      orderBy: { publishedAt: "desc" },
      take: 6,
      include: {
        engagement: {
          include: { user: { select: { fullName: true, email: true } } },
        },
        pm: { select: { fullName: true } },
      },
    }),
    prisma.payment.aggregate({
      where: { status: "SUCCESS" },
      _sum: { amount: true },
    }),
  ]);

  const totalRevenue = revenueResult._sum.amount ?? 0;
  const currency = "NGN";

  return {
    activeEngagements,
    totalClients,
    pendingActions,
    openEnquiries,
    newLeads,
    pendingIntakes,
    recentEngagements,
    stageCounts: stageCounts.map((s) => ({ stage: s.stage, count: s._count })),
    recentUpdates,
    totalRevenue,
    currency,
  };
}

export async function getPMDashboardData(pmUserId: string) {
  const now = new Date();

  const engagements = await prisma.engagement.findMany({
    where: { pmId: pmUserId, status: "active" },
    orderBy: { startDate: "desc" },
    include: {
      user: { select: { fullName: true, email: true } },
      pendingActions: {
        where: { completedAt: null },
        orderBy: { dueDate: "asc" },
      },
      updates: {
        where: { draft: false },
        orderBy: { publishedAt: "desc" },
        take: 1,
        select: { publishedAt: true },
      },
    },
  });

  const engagementIds = engagements.map((e) => e.id);

  const [unreadMessages, upcomingMeetings] = await Promise.all([
    engagementIds.length > 0
      ? prisma.message.count({
          where: {
            engagementId: { in: engagementIds },
            readAt: null,
            sender: { role: "CLIENT" },
          },
        })
      : Promise.resolve(0),
    engagementIds.length > 0
      ? prisma.strategyMeeting.findMany({
          where: {
            pmId: pmUserId,
            scheduledAt: { gte: now },
            status: "SCHEDULED",
          },
          orderBy: { scheduledAt: "asc" },
          take: 3,
          include: {
            engagement: {
              include: { user: { select: { fullName: true, email: true } } },
            },
          },
        })
      : Promise.resolve([]),
  ]);

  const totalPendingActions = engagements.reduce(
    (sum, e) => sum + e.pendingActions.length,
    0,
  );
  const overduePendingActions = engagements.reduce(
    (sum, e) =>
      sum +
      e.pendingActions.filter((a) => a.dueDate && new Date(a.dueDate) < now)
        .length,
    0,
  );

  return {
    engagements,
    totalPendingActions,
    overduePendingActions,
    unreadMessages,
    upcomingMeetings,
  };
}
