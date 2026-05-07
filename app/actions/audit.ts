"use server";

import { prisma } from "@/lib/prisma";
import { InputJsonValue } from "../generated/prisma/internal/prismaNamespaceBrowser";

export type AuditAction =
  // Auth
  | "PASSWORD_CHANGED"
  // Users
  | "USER_CREATED"
  | "USER_UPDATED"
  | "USER_DELETED"
  | "PROFILE_UPDATED"
  // Intake
  | "INTAKE_SUBMITTED"
  | "INTAKE_STATUS_CHANGED"
  | "INTAKE_DELETED"
  | "PM_ASSIGNED"
  | "PM_CHANGE_REQUESTED"
  // Leads
  | "LEAD_STATUS_CHANGED"
  | "LEAD_PM_ASSIGNED"
  | "CALENDAR_LINK_SENT"
  | "INTAKE_INVITATION_SENT"
  // Evaluation
  | "EVALUATION_SAVED"
  // Meetings
  | "MEETING_SCHEDULED"
  // Agreements
  | "AGREEMENT_CREATED"
  | "AGREEMENT_SIGNED"
  // Invoices
  | "INVOICE_CREATED"
  | "INVOICE_SENT"
  | "INVOICE_PAID"
  // Documents
  | "DOCUMENT_UPLOADED"
  | "DOCUMENT_DELETED"
  // Updates
  | "UPDATE_PUBLISHED"
  // Messages
  | "MESSAGE_SENT"
  // Engagement
  | "ENGAGEMENT_CREATED"
  | "ENGAGEMENT_STAGE_UPDATED"
  | "ENGAGEMENT_DELETED"
  | "ENGAGEMENT_STATUS_UPDATED"
  // Service Tiers
  | "SERVICE_TIER_CREATED"
  | "SERVICE_TIER_UPDATED"
  | "SERVICE_TIER_DELETED"
  // Onboarding
  | "ONBOARDING_COMPLETE";

/**
 * Fire-and-forget audit log writer. Never throws — failures are silently swallowed
 * so they never break the calling action.
 */
export async function logAudit(
  userId: string,
  action: AuditAction,
  resourceType: string,
  resourceId?: string | null,
  metadata?: Record<string, unknown>,
): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        resourceType,
        resourceId: resourceId ?? null,
        metadata: (metadata as InputJsonValue) ?? undefined,
      },
    });
  } catch {
    // Non-blocking — audit failures must never surface to users
  }
}

// ── Admin queries ─────────────────────────────────────────────────────────────

export type AuditLogEntry = Awaited<
  ReturnType<typeof getAuditLogs>
>["entries"][number];

export async function getAuditLogs({
  page = 1,
  pageSize = 50,
  userId,
  resourceType,
  action,
}: {
  page?: number;
  pageSize?: number;
  userId?: string;
  resourceType?: string;
  action?: string;
} = {}) {
  const { requireRole } = await import("./auth");
  await requireRole("ADMIN");

  const where = {
    ...(userId ? { userId } : {}),
    ...(resourceType ? { resourceType } : {}),
    ...(action ? { action } : {}),
  };

  const [entries, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      include: {
        user: { select: { id: true, fullName: true, email: true, role: true } },
      },
      orderBy: { timestamp: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.auditLog.count({ where }),
  ]);

  return {
    entries,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}
