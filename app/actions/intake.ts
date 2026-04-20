"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin, requireClient, requireSuperAdmin } from "./auth";
import { getSessionUser } from "./auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email";
import {
  intakeConfirmationEmailHtml,
  welcomeEmailHtml,
} from "@/lib/email-templates";
import { createNotification } from "./notifications";
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

// ── Public: Submit intake form ─────────────────────────────────────────────

export async function submitIntakeForm(formData: IntakeFormData): Promise<{
  success: boolean;
  referenceNumber?: string;
  error?: string;
}> {
  // Basic server-side validation of required fields
  if (!formData.fullName || !formData.email || !formData.transactionType) {
    return { success: false, error: "Required fields are missing." };
  }
  if (!formData.email.includes("@")) {
    return { success: false, error: "Invalid email address." };
  }

  const adminClient = createAdminClient();

  // 1. Check if a user with this email already exists in Prisma
  let userId: string | null = null;
  let isNewUser = false;

  const existingUser = await prisma.user.findUnique({
    where: { email: formData.email.toLowerCase().trim() },
    select: { id: true },
  });

  if (existingUser) {
    userId = existingUser.id;
  } else {
    // Create new Supabase auth user (email_confirm: true so no email loop)
    const { data: authData, error: authError } =
      await adminClient.auth.admin.createUser({
        email: formData.email.toLowerCase().trim(),
        email_confirm: true,
        user_metadata: { full_name: formData.fullName },
      });

    if (authError || !authData.user) {
      // If the error is "User already registered" it means a Supabase user exists
      // without a Prisma record — handle gracefully
      if (authError?.message?.includes("already")) {
        // Try to look up existing Supabase user via admin API
        const { data: listData } = await adminClient.auth.admin.listUsers();
        const found = listData?.users?.find(
          (u) => u.email?.toLowerCase() === formData.email.toLowerCase().trim(),
        );
        if (found) {
          // Mirror into Prisma
          await prisma.user.upsert({
            where: { id: found.id },
            create: {
              id: found.id,
              email: formData.email.toLowerCase().trim(),
              fullName: formData.fullName,
              preferredName: formData.preferredName || null,
              phone: formData.phone || null,
              nationality: formData.nationality || null,
              location: formData.location || null,
              role: "CLIENT",
            },
            update: {},
          });
          userId = found.id;
        }
      } else {
        return {
          success: false,
          error: authError?.message ?? "Failed to create account.",
        };
      }
    } else {
      const uid = authData.user.id;

      // Create Prisma user record
      await prisma.user.create({
        data: {
          id: uid,
          email: formData.email.toLowerCase().trim(),
          fullName: formData.fullName,
          preferredName: formData.preferredName || null,
          phone: formData.phone || null,
          nationality: formData.nationality || null,
          location: formData.location || null,
          role: "CLIENT",
        },
      });

      userId = uid;
      isNewUser = true;
    }
  }

  // 2. Build the submission field data (shared between create and draft-promotion)
  const submissionFields = {
    status: "PENDING" as const,
    draftStep: null,
    userId: userId ?? undefined,
    fullName: formData.fullName,
    preferredName: formData.preferredName || null,
    email: formData.email.toLowerCase().trim(),
    phone: formData.phone,
    location: formData.location,
    nationality: formData.nationality || null,
    transactionType: formData.transactionType,
    purpose: formData.purpose || null,
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

  // 3. If a logged-in user has an existing DRAFT, promote it instead of creating a duplicate
  let referenceNumber: string;
  if (userId) {
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
      // No draft — generate a fresh reference number and create
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
  } else {
    // Unauthenticated path — always create new
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
    formData.preferredName || formData.fullName.split(" ")[0] || "there";

  // 4. Send intake confirmation email
  try {
    await sendEmail({
      to: formData.email,
      subject: `Enquiry received — your reference is ${referenceNumber}`,
      html: intakeConfirmationEmailHtml({
        clientName: displayName,
        referenceNumber,
        transactionType: formData.transactionType,
        isNewUser,
      }),
    });
  } catch {
    // Non-blocking
  }

  // 5. If new user, send welcome / account setup email
  if (isNewUser && userId) {
    try {
      const { data: linkData, error: linkError } =
        await adminClient.auth.admin.generateLink({
          type: "recovery",
          email: formData.email.toLowerCase().trim(),
        });

      const setupUrl =
        !linkError && linkData?.properties?.action_link
          ? linkData.properties.action_link
          : `${PORTAL_BASE}/reset-password`;

      await sendEmail({
        to: formData.email,
        subject: "Welcome to Terralume — set up your account",
        html: welcomeEmailHtml({
          clientName: formData.fullName,
          loginUrl: setupUrl,
        }),
      });
    } catch {
      // Non-blocking
    }
  }

  revalidatePath("/admin-portal/intake");
  revalidatePath("/client-portal/intake");

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
  await requireAdmin();
  const updated = await prisma.intakeSubmission.update({
    where: { id },
    data: { status },
  });
  revalidatePath("/admin-portal/intake");
  revalidatePath(`/admin-portal/intake/${id}`);
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

  // Also mark any PENDING intake submissions as ACTIVE
  await prisma.intakeSubmission.updateMany({
    where: { userId, status: "PENDING" },
    data: { status: "ACTIVE" },
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
    transactionType: formData.transactionType || "",
    purpose: formData.purpose || null,
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

// ── Admin/PM: submit intake on behalf of a client ─────────────────────────

export async function submitIntakeFormForClient(
  clientId: string,
  formData: IntakeFormData,
): Promise<{ success: boolean; referenceNumber?: string; error?: string }> {
  await requireAdmin();

  if (!formData.transactionType) {
    return { success: false, error: "Required fields are missing." };
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
      transactionType: formData.transactionType,
      purpose: formData.purpose || null,
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
