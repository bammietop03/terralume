"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "./auth";
import { createNotification } from "./notifications";
import { sendEmail } from "@/lib/email";
import { strategyMeetingEmailHtml } from "@/lib/email-templates";
import { logAudit } from "./audit";

export type MeetingInput = {
  title?: string | null;
  scheduledAt: Date;
  meetingLink?: string | null;
  notes?: string | null;
};

export async function scheduleMeeting(
  engagementId: string,
  data: MeetingInput,
) {
  const admin = await requireAdmin();

  if (!data.scheduledAt) throw new Error("scheduledAt is required.");

  if (data.meetingLink) {
    try {
      new URL(data.meetingLink);
    } catch {
      throw new Error("Invalid meeting link URL.");
    }
  }

  const meeting = await prisma.strategyMeeting.create({
    data: {
      engagementId,
      pmId: admin.id,
      title: data.title ?? null,
      scheduledAt: data.scheduledAt,
      meetingLink: data.meetingLink ?? null,
      notes: data.notes ?? null,
      status: "SCHEDULED",
      sentAt: new Date(),
    },
    include: {
      engagement: {
        include: { user: true },
      },
      pm: { select: { fullName: true } },
    },
  });

  const client = meeting.engagement.user;
  const clientName = client.preferredName ?? client.fullName ?? "there";
  const pmName = meeting.pm.fullName ?? "Your Project Manager";
  const portalUrl = `${process.env.NEXT_PUBLIC_APP_URL}/client-portal/dashboard`;

  // Send email notification
  await sendEmail({
    to: client.email,
    subject: "Your Strategy Meeting Has Been Scheduled — Terralume",
    html: strategyMeetingEmailHtml({
      clientName,
      pmName,
      scheduledAt: data.scheduledAt,
      meetingLink: data.meetingLink ?? null,
      notes: data.notes ?? null,
      portalUrl,
    }),
  });

  // In-app notification
  await createNotification({
    userId: client.id,
    type: "strategy_meeting_scheduled",
    content: `Your strategy meeting has been scheduled for ${new Date(data.scheduledAt).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}.`,
  });

  revalidatePath(`/admin-portal/engagements/${engagementId}`);
  revalidatePath(`/admin-portal/clients/${client.id}`);

  void logAudit(admin.id, "MEETING_SCHEDULED", "StrategyMeeting", meeting.id, {
    engagementId,
  });

  return meeting;
}

export async function getMeetings(engagementId: string) {
  await requireAdmin();
  return prisma.strategyMeeting.findMany({
    where: { engagementId },
    include: { pm: { select: { id: true, fullName: true } } },
    orderBy: { scheduledAt: "asc" },
  });
}

/** @deprecated use getMeetings instead */
export async function getMeeting(engagementId: string) {
  await requireAdmin();
  return prisma.strategyMeeting.findFirst({
    where: { engagementId },
    include: { pm: { select: { id: true, fullName: true } } },
    orderBy: { scheduledAt: "desc" },
  });
}

export async function deleteMeeting(meetingId: string) {
  const admin = await requireAdmin();
  const meeting = await prisma.strategyMeeting.findUnique({
    where: { id: meetingId },
    select: { engagementId: true, engagement: { select: { userId: true } } },
  });
  if (!meeting) throw new Error("Meeting not found.");
  await prisma.strategyMeeting.delete({ where: { id: meetingId } });
  revalidatePath(`/admin-portal/engagements/${meeting.engagementId}`);
  revalidatePath(`/admin-portal/clients/${meeting.engagement.userId}`);
  void logAudit(admin.id, "MEETING_DELETED", "StrategyMeeting", meetingId, {
    engagementId: meeting.engagementId,
  });
}
