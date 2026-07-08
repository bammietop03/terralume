"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin, requireClient, requireSuperAdmin } from "./auth";
import { getSessionUser } from "./auth";
import { sendEmail } from "@/lib/email";
import { intakeConfirmationEmailHtml } from "@/lib/email-templates";
import { createNotification } from "./notifications";
import { logAudit } from "./audit";
import type { FormData as IntakeFormData } from "@/components/get-started/types";

const PORTAL_BASE =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://app.terralume.com";

// ── Types ──────────────────────────────────────────────────────────────────

export type IntakeSubmissionWithUser = Awaited<
  ReturnType<typeof getIntakeSubmissions>
>[number];

export type IntakeSubmissionDetail = Awaited<
  ReturnType<typeof getIntakeSubmissionById>
>;

// ── Helpers ────────────────────────────────────────────────────────────────

function generateReferenceNumber(): string {
  const year = new Date().getFullYear();
  const numeric = String(Math.floor(1000 + Math.random() * 9000));
  return `TL-${year}-${numeric}`;
}

// ── Public: Submit intake form from landing page (no auth required) ───────
// Creates an intake submission without requiring authentication.
// Admin will review and create a user account upon approval.

export async function submitPublicIntakeForm(
  formData: IntakeFormData,
): Promise<{
  success: boolean;
  referenceNumber?: string;
  error?: string;
}> {
  // Basic validation
  if (!formData.selectedServices || formData.selectedServices.length === 0) {
    return { success: false, error: "Please select at least one service." };
  }

  if (!formData.fullName?.trim()) {
    return { success: false, error: "Full name is required." };
  }

  if (!formData.email?.includes("@")) {
    return { success: false, error: "Valid email is required." };
  }

  if (!formData.phone?.trim()) {
    return { success: false, error: "Phone number is required." };
  }

  // Generate unique reference number
  let referenceNumber = generateReferenceNumber();
  for (let i = 0; i < 5; i++) {
    const exists = await prisma.intakeSubmission.findUnique({
      where: { referenceNumber },
    });
    if (!exists) break;
    referenceNumber = generateReferenceNumber();
  }

  // Create intake submission WITHOUT userId (will be linked later by admin)
  const submission = await prisma.intakeSubmission.create({
    data: {
      referenceNumber,
      status: "PENDING",
      userId: null, // No user account yet
      fullName: formData.fullName.trim(),
      preferredName: formData.preferredName?.trim() || null,
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      location: formData.location || "",
      nationality: formData.nationality || null,
      selectedServices: formData.selectedServices,
      transactionType: formData.transactionType || null,
      purpose: formData.purpose || null,
      energyNeedsDescription: formData.energyNeedsDescription || null,
      currency: formData.currency || "NGN",
      budgetMin: formData.budgetMin || null,
      budgetMax: formData.budgetMax || null,
      sourceOfFunds: formData.sourceOfFunds || null,
      mortgageStatus: formData.mortgageStatus || null,
      targetAreas: formData.targetAreas || [],
      propertyType: formData.propertyType || null,
      bedrooms: formData.bedrooms || null,
      floorAreaSqm: formData.floorAreaSqm || null,
      mustHaves: formData.mustHaves || [],
      dealBreakers: formData.dealBreakers || null,
      targetDate: formData.targetDate || null,
      decisionSpeed: formData.decisionSpeed || null,
      decisionMakers: formData.decisionMakers || null,
      priorExperience: formData.priorExperience || null,
      riskProfile: formData.riskProfile || null,
      referralSource: formData.referralSource || null,
      dataConsent: formData.dataConsent,
      draftStep: null,
    },
  });

  const displayName =
    formData.preferredName || formData.fullName?.split(" ")[0] || "there";

  // Send intake confirmation email (non-blocking)
  const serviceNames = formData.selectedServices
    .map((s) => {
      if (s === "real-estate") return "Real Estate Advisory";
      if (s === "renewable-energy") return "Renewable Energy";
      return s;
    })
    .join(" + ");

  try {
    await sendEmail({
      to: formData.email,
      subject: `Enquiry received — your reference is ${referenceNumber}`,
      html: intakeConfirmationEmailHtml({
        clientName: displayName,
        referenceNumber,
        transactionType: formData.transactionType || serviceNames,
        isNewUser: true,
      }),
    });
  } catch {
    // Non-blocking
  }

  // Notify all admins
  try {
    const notifContent = `New public intake submission from ${formData.fullName} for ${serviceNames} (${referenceNumber}).`;

    const admins = await prisma.user.findMany({
      where: { role: "ADMIN" },
      select: { id: true },
    });

    void Promise.all(
      admins.map((a) =>
        createNotification({
          userId: a.id,
          type: "INTAKE_SUBMITTED",
          content: notifContent,
        }),
      ),
    );
  } catch {
    // Non-blocking
  }

  revalidatePath("/admin-portal/intake");

  return { success: true, referenceNumber };
}

// ── Client: Submit intake form (portal only) ──────────────────────────────
// Clients must be authenticated — accounts are created by admin via
// "Proceed with intake" on the intake detail page.

export async function submitIntakeForm(formData: IntakeFormData): Promise<{
  success: boolean;
  referenceNumber?: string;
  error?: string;
}> {
  const sessionUser = await requireClient().catch(() => null);
  if (!sessionUser) return { success: false, error: "Not authenticated." };

  if (!formData.selectedServices || formData.selectedServices.length === 0) {
    return { success: false, error: "Please select at least one service." };
  }

  const userId = sessionUser.id;

  const submissionFields = {
    status: "PENDING" as const,
    draftStep: null,
    userId,
    fullName: formData.fullName || sessionUser.fullName || "",
    preferredName: formData.preferredName || null,
    email: sessionUser.email,
    phone: formData.phone || sessionUser.phone || "",
    location: formData.location || sessionUser.location || "",
    nationality: formData.nationality || null,
    selectedServices: formData.selectedServices || [],
    transactionType: formData.transactionType || null,
    purpose: formData.purpose || null,
    energyNeedsDescription: formData.energyNeedsDescription || null,
    currency: formData.currency || "NGN",
    budgetMin: formData.budgetMin || null,
    budgetMax: formData.budgetMax || null,
    sourceOfFunds: formData.sourceOfFunds || null,
    mortgageStatus: formData.mortgageStatus || null,
    targetAreas: formData.targetAreas,
    propertyType: formData.propertyType || null,
    bedrooms: formData.bedrooms || null,
    floorAreaSqm: formData.floorAreaSqm || null,
    mustHaves: formData.mustHaves,
    dealBreakers: formData.dealBreakers || null,
    targetDate: formData.targetDate || null,
    decisionSpeed: formData.decisionSpeed || null,
    decisionMakers: formData.decisionMakers || null,
    priorExperience: formData.priorExperience || null,
    riskProfile: formData.riskProfile || null,
    referralSource: formData.referralSource || null,
    dataConsent: formData.dataConsent,
  };

  // Promote an existing DRAFT if one exists, otherwise create fresh
  let referenceNumber: string;
  const existingDraft = await prisma.intakeSubmission.findFirst({
    where: { userId, status: "DRAFT" },
    select: { id: true, referenceNumber: true },
  });

  if (existingDraft) {
    await prisma.intakeSubmission.update({
      where: { id: existingDraft.id },
      data: submissionFields,
    });
    referenceNumber = existingDraft.referenceNumber;
  } else {
    referenceNumber = generateReferenceNumber();
    for (let i = 0; i < 5; i++) {
      const exists = await prisma.intakeSubmission.findUnique({
        where: { referenceNumber },
      });
      if (!exists) break;
      referenceNumber = generateReferenceNumber();
    }
    await prisma.intakeSubmission.create({
      data: { referenceNumber, ...submissionFields },
    });
  }

  const displayName =
    formData.preferredName ||
    formData.fullName?.split(" ")[0] ||
    sessionUser.fullName?.split(" ")[0] ||
    "there";

  // Send intake confirmation email (non-blocking)
  const serviceNames = formData.selectedServices
    .map((s) => {
      if (s === "real-estate") return "Real Estate Advisory";
      if (s === "renewable-energy") return "Renewable Energy";
      return s;
    })
    .join(" + ");

  try {
    await sendEmail({
      to: sessionUser.email,
      subject: `Enquiry received — your reference is ${referenceNumber}`,
      html: intakeConfirmationEmailHtml({
        clientName: displayName,
        referenceNumber,
        transactionType: formData.transactionType || serviceNames,
        isNewUser: false,
      }),
    });
  } catch {
    // Non-blocking
  }

  // Notify admins and assigned PM
  try {
    const notifContent = `${displayName} has submitted an intake form for ${serviceNames} (${referenceNumber}).`;

    // Get user's assigned PM
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { assignedPmId: true },
    });

    // Notify assigned PM
    if (user?.assignedPmId) {
      void createNotification({
        userId: user.assignedPmId,
        type: "INTAKE_SUBMITTED",
        content: notifContent,
      });
    }

    // Notify all admins
    const admins = await prisma.user.findMany({
      where: { role: "ADMIN" },
      select: { id: true },
    });
    void Promise.all(
      admins.map((a) =>
        createNotification({
          userId: a.id,
          type: "INTAKE_SUBMITTED",
          content: notifContent,
        }),
      ),
    );
  } catch {
    // Non-blocking
  }

  revalidatePath("/admin-portal/intake");
  revalidatePath("/client-portal/intake");

  void logAudit(
    userId,
    "INTAKE_SUBMITTED",
    "IntakeSubmission",
    referenceNumber,
    { selectedServices: formData.selectedServices },
  );

  return { success: true, referenceNumber };
}

// ── Admin/PM: submit intake on behalf of a client ─────────────────────────

export async function submitIntakeFormForClient(
  clientId: string,
  formData: IntakeFormData,
): Promise<{ success: boolean; referenceNumber?: string; error?: string }> {
  await requireAdmin();

  if (!formData.selectedServices || formData.selectedServices.length === 0) {
    return { success: false, error: "Please select at least one service." };
  }

  const client = await prisma.user.findUnique({ where: { id: clientId } });
  if (!client) return { success: false, error: "Client not found." };

  let referenceNumber = generateReferenceNumber();
  for (let i = 0; i < 5; i++) {
    const exists = await prisma.intakeSubmission.findUnique({
      where: { referenceNumber },
    });
    if (!exists) break;
    referenceNumber = generateReferenceNumber();
  }

  await prisma.intakeSubmission.create({
    data: {
      referenceNumber,
      userId: clientId,
      fullName: client.fullName ?? formData.fullName,
      preferredName: client.preferredName ?? formData.preferredName ?? null,
      email: client.email,
      phone: client.phone ?? formData.phone,
      location: client.location ?? formData.location,
      nationality: client.nationality ?? formData.nationality ?? null,
      selectedServices: formData.selectedServices || [],
      transactionType: formData.transactionType || null,
      purpose: formData.purpose || null,
      energyNeedsDescription: formData.energyNeedsDescription || null,
      currency: formData.currency || "NGN",
      budgetMin: formData.budgetMin || null,
      budgetMax: formData.budgetMax || null,
      sourceOfFunds: formData.sourceOfFunds || null,
      mortgageStatus: formData.mortgageStatus || null,
      targetAreas: formData.targetAreas,
      propertyType: formData.propertyType || null,
      bedrooms: formData.bedrooms || null,
      floorAreaSqm: formData.floorAreaSqm || null,
      mustHaves: formData.mustHaves,
      dealBreakers: formData.dealBreakers || null,
      targetDate: formData.targetDate || null,
      decisionSpeed: formData.decisionSpeed || null,
      decisionMakers: formData.decisionMakers || null,
      priorExperience: formData.priorExperience || null,
      riskProfile: formData.riskProfile || null,
      referralSource: formData.referralSource || null,
      dataConsent: formData.dataConsent,
      status: "PENDING",
    },
  });

  revalidatePath("/admin-portal/intake");

  return { success: true, referenceNumber };
}

// ── Admin: all submissions ─────────────────────────────────────────────────

export async function getIntakeSubmissions() {
  await requireAdmin();
  return prisma.intakeSubmission.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { id: true, email: true, fullName: true },
      },
    },
  });
}

// ── PM: only submissions belonging to assigned clients ─────────────────────

export async function getMyAssignedIntakeSubmissions() {
  const pm = await requireAdmin();
  return prisma.intakeSubmission.findMany({
    where: { user: { assignedPmId: pm.id } },
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { id: true, email: true, fullName: true },
      },
    },
  });
}

export async function getIntakeSubmissionById(id: string) {
  const sessionUser = await getSessionUser();
  if (!sessionUser) return null;

  const submission = await prisma.intakeSubmission.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          fullName: true,
          role: true,
          assignedPmId: true,
          pmChangeRequested: true,
          pmChangeReason: true,
          assignedPm: {
            select: {
              id: true,
              email: true,
              fullName: true,
              phone: true,
              photoUrl: true,
            },
          },
        },
      },
      engagement: {
        select: {
          id: true,
          status: true,
        },
      },
    },
  });

  if (!submission) return null;

  // Clients can only view their own submissions
  if (sessionUser.role === "CLIENT" && submission.userId !== sessionUser.id) {
    return null;
  }

  return submission;
}

export async function updateIntakeStatus(
  id: string,
  status: "PENDING" | "REVIEWING" | "ACTIVE" | "CLOSED",
) {
  const admin = await requireAdmin();
  const updated = await prisma.intakeSubmission.update({
    where: { id },
    data: { status },
  });
  revalidatePath("/admin-portal/intake");
  revalidatePath(`/admin-portal/intake/${id}`);

  void logAudit(admin.id, "INTAKE_STATUS_CHANGED", "IntakeSubmission", id, {
    status,
  });

  return updated;
}

// ── Client: own submissions ────────────────────────────────────────────────

export async function getMyIntakeSubmissions(userId: string) {
  await requireClient();
  return prisma.intakeSubmission.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

// ── Super-admin: assign PM to client user ─────────────────────────────────
// PM is attached to the CLIENT USER, not to the intake submission.
// Only ADMIN role (super admin) may reassign.

export async function assignPmToUser(userId: string, pmId: string) {
  await requireSuperAdmin();

  const client = await prisma.user.update({
    where: { id: userId },
    data: {
      assignedPmId: pmId,
      pmChangeRequested: false,
      pmChangeReason: null,
    },
    select: { id: true, fullName: true, email: true },
  });

  // Notify the PM
  await createNotification({
    userId: pmId,
    type: "PM_ASSIGNED",
    content: `You have been assigned as advisor for ${client.fullName ?? client.email}.`,
  });

  // Notify the client
  await createNotification({
    userId: client.id,
    type: "PM_ASSIGNED",
    content: `Your advisor has been assigned. They will be in touch shortly.`,
  });

  revalidatePath("/admin-portal/intake");
  revalidatePath("/admin-portal/users/clients");
  revalidatePath(`/client-portal/intake`);
  return client;
}

// ── Client: request PM change ─────────────────────────────────────────────

export async function requestPmChange(submissionId: string, reason?: string) {
  const sessionUser = await requireClient();

  const submission = await prisma.intakeSubmission.findUnique({
    where: { id: submissionId },
    select: { id: true, userId: true, referenceNumber: true, fullName: true },
  });

  if (!submission || submission.userId !== sessionUser.id) {
    throw new Error("Not found or unauthorised.");
  }

  // PM change flag lives on the User, not on the submission
  await prisma.user.update({
    where: { id: sessionUser.id },
    data: {
      pmChangeRequested: true,
      pmChangeReason: reason ?? null,
    },
  });

  // Notify all admins
  const admins = await prisma.user.findMany({
    where: { role: "ADMIN" },
    select: { id: true },
  });

  await Promise.all(
    admins.map((admin) =>
      createNotification({
        userId: admin.id,
        type: "PM_CHANGE_REQUEST",
        content: `${submission.fullName} has requested an advisor change on brief ${submission.referenceNumber}${reason ? `: "${reason}"` : "."}`,
      }),
    ),
  );

  revalidatePath(`/client-portal/intake/${submissionId}`);
  revalidatePath(`/admin-portal/intake/${submissionId}`);
}

// ── Client: save intake draft ──────────────────────────────────────────────
// Creates or updates a DRAFT IntakeSubmission for a logged-in client.
// Safe to call after each step — only ever writes partial data.

export async function saveIntakeDraft(
  formData: Partial<import("@/components/get-started/types").FormData>,
  draftStep: number,
  draftId?: string,
): Promise<{ success: boolean; draftId?: string; error?: string }> {
  const sessionUser = await requireClient().catch(() => null);
  if (!sessionUser) return { success: false, error: "Not authenticated." };

  const draftData = {
    status: "DRAFT" as const,
    draftStep,
    userId: sessionUser.id,
    // Contact fallback so required-in-schema fields are always present
    fullName: formData.fullName?.trim() || sessionUser.fullName || "",
    email: formData.email?.trim() || sessionUser.email,
    phone: formData.phone?.trim() || sessionUser.phone || "",
    location: formData.location?.trim() || sessionUser.location || "",
    // Optional fields
    preferredName: formData.preferredName?.trim() || null,
    nationality: formData.nationality?.trim() || null,
    selectedServices: formData.selectedServices ?? [],
    transactionType: formData.transactionType || null,
    purpose: formData.purpose || null,
    energyNeedsDescription: formData.energyNeedsDescription || null,
    currency: formData.currency || "NGN",
    budgetMin: formData.budgetMin || null,
    budgetMax: formData.budgetMax || null,
    sourceOfFunds: formData.sourceOfFunds || null,
    mortgageStatus: formData.mortgageStatus || null,
    targetAreas: formData.targetAreas ?? [],
    propertyType: formData.propertyType || null,
    bedrooms: formData.bedrooms || null,
    floorAreaSqm: formData.floorAreaSqm || null,
    mustHaves: formData.mustHaves ?? [],
    dealBreakers: formData.dealBreakers || null,
    targetDate: formData.targetDate || null,
    decisionSpeed: formData.decisionSpeed || null,
    decisionMakers: formData.decisionMakers || null,
    priorExperience: formData.priorExperience || null,
    riskProfile: formData.riskProfile || null,
    referralSource: formData.referralSource || null,
    dataConsent: formData.dataConsent ?? false,
  };

  try {
    if (draftId) {
      // Update existing draft — verify ownership
      const existing = await prisma.intakeSubmission.findUnique({
        where: { id: draftId },
        select: { userId: true, status: true },
      });
      if (
        !existing ||
        existing.userId !== sessionUser.id ||
        existing.status !== "DRAFT"
      ) {
        return { success: false, error: "Draft not found." };
      }
      await prisma.intakeSubmission.update({
        where: { id: draftId },
        data: draftData,
      });
      return { success: true, draftId };
    } else {
      // Check if user already has an existing DRAFT (avoid duplicates)
      const existingDraft = await prisma.intakeSubmission.findFirst({
        where: { userId: sessionUser.id, status: "DRAFT" },
        select: { id: true },
      });
      if (existingDraft) {
        await prisma.intakeSubmission.update({
          where: { id: existingDraft.id },
          data: draftData,
        });
        return { success: true, draftId: existingDraft.id };
      }
      // Create new draft
      const referenceNumber = generateReferenceNumber();
      const created = await prisma.intakeSubmission.create({
        data: { ...draftData, referenceNumber },
      });
      return { success: true, draftId: created.id };
    }
  } catch {
    return { success: false, error: "Failed to save draft." };
  }
}

// ── Client: load existing draft ────────────────────────────────────────────

export async function getMyIntakeDraft(): Promise<{
  id: string;
  draftStep: number;
  data: import("@/components/get-started/types").FormData;
} | null> {
  const sessionUser = await requireClient().catch(() => null);
  if (!sessionUser) return null;

  const draft = await prisma.intakeSubmission.findFirst({
    where: { userId: sessionUser.id, status: "DRAFT" },
  });

  if (!draft) return null;

  return {
    id: draft.id,
    draftStep: draft.draftStep ?? 1,
    data: {
      selectedServices: draft.selectedServices ?? [],
      transactionType: draft.transactionType ?? "",
      purpose: draft.purpose ?? "",
      fullName: draft.fullName ?? "",
      preferredName: draft.preferredName ?? "",
      email: draft.email ?? "",
      phone: draft.phone ?? "",
      location: draft.location ?? "",
      nationality: draft.nationality ?? "",
      targetAreas: draft.targetAreas ?? [],
      propertyType: draft.propertyType ?? "",
      bedrooms: draft.bedrooms ?? "",
      floorAreaSqm: draft.floorAreaSqm ?? "",
      mustHaves: draft.mustHaves ?? [],
      dealBreakers: draft.dealBreakers ?? "",
      energyNeedsDescription: draft.energyNeedsDescription ?? "",
      currency: draft.currency ?? "NGN",
      budgetMin: draft.budgetMin ?? "",
      budgetMax: draft.budgetMax ?? "",
      sourceOfFunds: draft.sourceOfFunds ?? "",
      mortgageStatus: draft.mortgageStatus ?? "",
      targetDate: draft.targetDate ?? "",
      decisionSpeed: draft.decisionSpeed ?? "",
      decisionMakers: draft.decisionMakers ?? "",
      priorExperience: draft.priorExperience ?? "",
      riskProfile: draft.riskProfile ?? "",
      referralSource: draft.referralSource ?? "",
      dataConsent: draft.dataConsent ?? false,
    },
  };
}

// ── Super-admin: delete an intake submission ──────────────────────────────

export async function deleteIntakeSubmission(
  id: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const admin = await requireSuperAdmin();

  const submission = await prisma.intakeSubmission.findUnique({
    where: { id },
    select: { id: true, referenceNumber: true },
  });
  if (!submission) return { ok: false, error: "Submission not found." };

  await prisma.intakeSubmission.delete({ where: { id } });

  void logAudit(admin.id, "INTAKE_DELETED", "IntakeSubmission", id, {
    referenceNumber: submission.referenceNumber,
  });

  revalidatePath("/admin-portal/intake");
  return { ok: true };
}

// ── Admin: create user account from intake submission ─────────────────────

/**
 * Creates a client account from a public intake submission.
 * Links the submission to the new user and sends welcome email.
 */
export async function createAccountFromIntake(
  intakeId: string,
): Promise<{ success: boolean; userId?: string; error?: string }> {
  const admin = await requireAdmin();

  // Get the intake submission
  const submission = await prisma.intakeSubmission.findUnique({
    where: { id: intakeId },
    select: {
      id: true,
      userId: true,
      email: true,
      fullName: true,
      preferredName: true,
      phone: true,
      location: true,
      nationality: true,
      referenceNumber: true,
      status: true,
    },
  });

  if (!submission) {
    return { success: false, error: "Intake submission not found." };
  }

  if (submission.userId) {
    return {
      success: false,
      error: "This intake already has an associated user account.",
    };
  }

  // Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: submission.email },
    select: { id: true },
  });

  if (existingUser) {
    // Link existing user to this intake
    await prisma.intakeSubmission.update({
      where: { id: intakeId },
      data: { userId: existingUser.id, status: "REVIEWING" },
    });

    revalidatePath("/admin-portal/intake");
    revalidatePath(`/admin-portal/intake/${intakeId}`);

    void logAudit(
      admin.id,
      "INTAKE_STATUS_CHANGED",
      "IntakeSubmission",
      intakeId,
      {
        userId: existingUser.id,
        linkedToExistingUser: true,
      },
    );

    return {
      success: true,
      userId: existingUser.id,
    };
  }

  // Create new Supabase auth user
  const { createAdminClient } = await import("@/lib/supabase/admin");
  const adminClient = createAdminClient();

  const { data: authData, error: authError } =
    await adminClient.auth.admin.createUser({
      email: submission.email,
      email_confirm: true,
      user_metadata: { full_name: submission.fullName },
    });

  if (authError || !authData.user) {
    return {
      success: false,
      error: authError?.message ?? "Failed to create auth user",
    };
  }

  const uid = authData.user.id;

  // Create Prisma user record
  const user = await prisma.user.create({
    data: {
      id: uid,
      email: submission.email,
      fullName: submission.fullName,
      preferredName: submission.preferredName,
      phone: submission.phone,
      location: submission.location,
      nationality: submission.nationality,
      role: "CLIENT",
    },
  });

  // Link intake submission to new user
  await prisma.intakeSubmission.update({
    where: { id: intakeId },
    data: {
      userId: user.id,
      status: "REVIEWING",
    },
  });

  // Generate password-setup link
  const { data: linkData, error: linkError } =
    await adminClient.auth.admin.generateLink({
      type: "recovery",
      email: submission.email,
    });

  const setupUrl =
    !linkError && linkData?.properties?.action_link
      ? linkData.properties.action_link
      : `${PORTAL_BASE}/reset-password`;

  // Send welcome email
  try {
    const { welcomeEmailHtml } = await import("@/lib/email-templates");
    await sendEmail({
      to: submission.email,
      subject: "Welcome to Terralume — set up your account",
      html: welcomeEmailHtml({
        clientName: submission.preferredName || submission.fullName,
        loginUrl: setupUrl,
      }),
    });
  } catch {
    // Email failure should not roll back user creation
  }

  // Notify the user about account approval
  await createNotification({
    userId: user.id,
    type: "INTAKE_SUBMITTED",
    content: `Your intake submission (${submission.referenceNumber}) has been approved. Welcome to Terralume!`,
  });

  revalidatePath("/admin-portal/intake");
  revalidatePath(`/admin-portal/intake/${intakeId}`);
  revalidatePath("/admin-portal/users/clients");

  void logAudit(admin.id, "USER_CREATED", "User", user.id, {
    intakeId,
    referenceNumber: submission.referenceNumber,
    createdFromIntake: true,
  });

  return { success: true, userId: user.id };
}
