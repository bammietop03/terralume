"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin, getSessionUser } from "./auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email";
import {
  consultationConfirmationEmailHtml,
  internalLeadAlertEmailHtml,
  calendarInvitationEmailHtml,
  intakeInvitationEmailHtml,
} from "@/lib/email-templates";
import { createNotification } from "./notifications";
import type {
  LeadInterestType,
  LeadStatus,
} from "@/app/generated/prisma/client";

const PORTAL_BASE =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://app.terralume.com";
const ADMIN_ALERT_EMAIL = process.env.ADMIN_ALERT_EMAIL ?? "team@terralume.com";

// ── Types ──────────────────────────────────────────────────────────────────

export type LeadWithPm = Awaited<ReturnType<typeof getAllLeads>>[number];
export type LeadDetail = Awaited<ReturnType<typeof getLeadById>>;

// ── Public: Submit consultation request ───────────────────────────────────

export async function submitConsultationRequest(data: {
  fullName: string;
  phone: string;
  email: string;
  location?: string;
  interestType?: LeadInterestType;
}): Promise<{ success: boolean; error?: string }> {
  if (!data.fullName?.trim() || !data.phone?.trim() || !data.email?.trim()) {
    return { success: false, error: "Name, phone, and email are required." };
  }
  if (!data.email.includes("@")) {
    return { success: false, error: "Invalid email address." };
  }

  const lead = await prisma.lead.create({
    data: {
      fullName: data.fullName.trim(),
      phone: data.phone.trim(),
      email: data.email.toLowerCase().trim(),
      location: data.location?.trim() || null,
      interestType: data.interestType ?? null,
    },
  });

  const displayName = data.fullName.split(" ")[0] || data.fullName;

  // Send confirmation email to lead (non-blocking)
  try {
    await sendEmail({
      to: data.email,
      subject: "Terralume — we've received your consultation request",
      html: consultationConfirmationEmailHtml({ clientName: displayName }),
    });
  } catch {
    // Non-blocking
  }

  // Send internal alert to admin team (non-blocking)
  try {
    await sendEmail({
      to: ADMIN_ALERT_EMAIL,
      subject: `New consultation request — ${data.fullName}`,
      html: internalLeadAlertEmailHtml({
        fullName: data.fullName,
        phone: data.phone,
        email: data.email,
        location: data.location,
        interestType: data.interestType,
      }),
    });
  } catch {
    // Non-blocking
  }

  // Create in-app notification for all admins (non-blocking)
  try {
    const admins = await prisma.user.findMany({
      where: { role: { in: ["ADMIN", "PM"] } },
      select: { id: true },
    });
    await Promise.all(
      admins.map((a) =>
        createNotification({
          userId: a.id,
          type: "NEW_LEAD",
          content: `New consultation request from ${data.fullName} (${data.email})`,
        }),
      ),
    );
  } catch {
    // Non-blocking
  }

  revalidatePath("/admin-portal/leads");

  return { success: true };
}

// ── Admin: list all leads ──────────────────────────────────────────────────

export async function getAllLeads() {
  await requireAdmin();
  return prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      assignedPm: {
        select: { id: true, fullName: true, email: true, phone: true },
      },
      intakeSubmission: {
        select: { id: true, referenceNumber: true, status: true },
      },
    },
  });
}

// ── PM: list own assigned leads ───────────────────────────────────────────

export async function getMyAssignedLeads() {
  const pm = await requireAdmin();
  return prisma.lead.findMany({
    where: { assignedPmId: pm.id },
    orderBy: { createdAt: "desc" },
    include: {
      assignedPm: {
        select: { id: true, fullName: true, email: true, phone: true },
      },
      intakeSubmission: {
        select: { id: true, referenceNumber: true, status: true },
      },
    },
  });
}

// ── Admin: single lead detail ──────────────────────────────────────────────

export async function getLeadById(id: string) {
  await requireAdmin();
  return prisma.lead.findUnique({
    where: { id },
    include: {
      assignedPm: {
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          photoUrl: true,
        },
      },
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
          onboardingComplete: true,
        },
      },
      intakeSubmission: {
        select: {
          id: true,
          referenceNumber: true,
          status: true,
          transactionType: true,
          createdAt: true,
        },
      },
    },
  });
}

// ── Admin: update lead status ──────────────────────────────────────────────

export async function updateLeadStatus(id: string, status: LeadStatus) {
  await requireAdmin();
  await prisma.lead.update({
    where: { id },
    data: {
      status,
      declinedAt: status === "DECLINED" ? new Date() : undefined,
    },
  });
  revalidatePath("/admin-portal/leads");
  revalidatePath(`/admin-portal/leads/${id}`);
}

// ── Admin: assign PM to lead ───────────────────────────────────────────────

export async function assignLeadPm(leadId: string, pmId: string) {
  await requireAdmin();

  const lead = await prisma.lead.update({
    where: { id: leadId },
    data: { assignedPmId: pmId },
    select: { fullName: true },
  });

  // Notify PM
  try {
    await createNotification({
      userId: pmId,
      type: "LEAD_ASSIGNED",
      content: `You have been assigned to lead: ${lead.fullName}`,
    });
  } catch {
    // Non-blocking
  }

  revalidatePath("/admin-portal/leads");
  revalidatePath(`/admin-portal/leads/${leadId}`);
}

// ── Admin: send calendar link to lead ─────────────────────────────────────

export async function sendCalendarLink(leadId: string, calendarUrl: string) {
  await requireAdmin();

  if (!calendarUrl?.trim()) {
    return { success: false, error: "Calendar URL is required." };
  }

  const sessionUser = await getSessionUser();

  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    select: {
      fullName: true,
      email: true,
      assignedPm: { select: { fullName: true } },
    },
  });

  if (!lead) return { success: false, error: "Lead not found." };

  await prisma.lead.update({
    where: { id: leadId },
    data: {
      calendarUrl: calendarUrl.trim(),
      calendarSentAt: new Date(),
      status: "CONSULTATION_SCHEDULED",
    },
  });

  const pmName =
    lead.assignedPm?.fullName ??
    sessionUser?.fullName ??
    "Your project manager";
  const displayName = lead.fullName.split(" ")[0] || lead.fullName;

  try {
    await sendEmail({
      to: lead.email,
      subject: "Terralume — book your free consultation",
      html: calendarInvitationEmailHtml({
        clientName: displayName,
        pmName,
        calendarUrl: calendarUrl.trim(),
      }),
    });
  } catch {
    return {
      success: false,
      error: "Calendar URL saved but email failed to send.",
    };
  }

  revalidatePath(`/admin-portal/leads/${leadId}`);
  revalidatePath("/admin-portal/leads");

  return { success: true };
}

// ── Admin: send intake invitation ─────────────────────────────────────────
// Creates a portal account for the lead (if not already existing),
// generates a secure setup link, and emails the client.

export async function sendIntakeInvitation(leadId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  await requireAdmin();

  const adminClient = createAdminClient();

  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    select: {
      fullName: true,
      email: true,
      phone: true,
      location: true,
      userId: true,
      assignedPmId: true,
    },
  });

  if (!lead) return { success: false, error: "Lead not found." };

  let userId: string;

  if (lead.userId) {
    // Portal account already exists — just re-send invitation
    // Ensure PM is still in sync from lead
    if (lead.assignedPmId) {
      await prisma.user.update({
        where: { id: lead.userId },
        data: { assignedPmId: lead.assignedPmId },
      });
    }
    userId = lead.userId;
  } else {
    // Create Supabase auth user
    const { data: authData, error: authError } =
      await adminClient.auth.admin.createUser({
        email: lead.email.toLowerCase().trim(),
        email_confirm: true,
        user_metadata: { full_name: lead.fullName },
      });

    if (authError || !authData.user) {
      // Handle "already registered" edge case
      if (authError?.message?.includes("already")) {
        const { data: listData } = await adminClient.auth.admin.listUsers();
        const found = listData?.users?.find(
          (u) => u.email?.toLowerCase() === lead.email.toLowerCase().trim(),
        );
        if (!found) {
          return {
            success: false,
            error: authError?.message ?? "Failed to create account.",
          };
        }
        // Upsert Prisma record — set PM from lead if not already set
        await prisma.user.upsert({
          where: { id: found.id },
          create: {
            id: found.id,
            email: lead.email.toLowerCase().trim(),
            fullName: lead.fullName,
            phone: lead.phone || null,
            location: lead.location || null,
            role: "CLIENT",
            assignedPmId: lead.assignedPmId || null,
          },
          update: {
            // Only set PM if the user doesn't already have one
            ...(lead.assignedPmId ? { assignedPmId: lead.assignedPmId } : {}),
          },
        });
        userId = found.id;
      } else {
        return {
          success: false,
          error: authError?.message ?? "Failed to create account.",
        };
      }
    } else {
      const uid = authData.user.id;
      // Check if a DB record already exists with this email (different auth ID)
      const existingByEmail = await prisma.user.findUnique({
        where: { email: lead.email.toLowerCase().trim() },
      });
      if (existingByEmail) {
        // Reuse existing record — just sync PM
        await prisma.user.update({
          where: { id: existingByEmail.id },
          data: {
            ...(lead.assignedPmId ? { assignedPmId: lead.assignedPmId } : {}),
          },
        });
        userId = existingByEmail.id;
      } else {
        await prisma.user.upsert({
          where: { id: uid },
          create: {
            id: uid,
            email: lead.email.toLowerCase().trim(),
            fullName: lead.fullName,
            phone: lead.phone || null,
            location: lead.location || null,
            role: "CLIENT",
            assignedPmId: lead.assignedPmId || null,
          },
          update: {
            ...(lead.assignedPmId ? { assignedPmId: lead.assignedPmId } : {}),
          },
        });
        userId = uid;
      }
    }
  }

  // Generate a secure invite token (7-day expiry)
  const inviteToken = crypto.randomUUID();
  const inviteTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  // Generate Supabase recovery / setup link
  const { data: linkData, error: linkError } =
    await adminClient.auth.admin.generateLink({
      type: "recovery",
      email: lead.email.toLowerCase().trim(),
      options: {
        redirectTo: `${PORTAL_BASE}/reset-password/update`,
      },
    });

  const setupUrl =
    !linkError && linkData?.properties?.action_link
      ? linkData.properties.action_link
      : `${PORTAL_BASE}/reset-password`;

  // Update lead
  await prisma.lead.update({
    where: { id: leadId },
    data: {
      userId,
      inviteToken,
      inviteTokenExpiry,
      inviteSentAt: new Date(),
      status: "INTAKE_INVITED",
    },
  });

  const displayName = lead.fullName.split(" ")[0] || lead.fullName;

  try {
    await sendEmail({
      to: lead.email,
      subject: "Terralume — your portal is ready",
      html: intakeInvitationEmailHtml({
        clientName: displayName,
        setupLink: setupUrl,
      }),
    });
  } catch {
    return {
      success: false,
      error:
        "Account created but invitation email failed to send. Please retry.",
    };
  }

  revalidatePath(`/admin-portal/leads/${leadId}`);
  revalidatePath("/admin-portal/leads");

  return { success: true };
}

// ── Admin: update internal notes ──────────────────────────────────────────

export async function updateLeadNotes(
  leadId: string,
  notes: string,
): Promise<{ success: boolean }> {
  await requireAdmin();
  await prisma.lead.update({
    where: { id: leadId },
    data: { notes: notes.trim() || null },
  });
  revalidatePath(`/admin-portal/leads/${leadId}`);
  return { success: true };
}
