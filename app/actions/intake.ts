"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin, requireClient } from "./auth";
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

  // 2. Generate a unique reference number
  let referenceNumber = generateReferenceNumber();
  // Ensure uniqueness (retry max 5 times)
  for (let i = 0; i < 5; i++) {
    const exists = await prisma.intakeSubmission.findUnique({
      where: { referenceNumber },
    });
    if (!exists) break;
    referenceNumber = generateReferenceNumber();
  }

  // 3. Create IntakeSubmission record
  await prisma.intakeSubmission.create({
    data: {
      referenceNumber,
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
    },
  });

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

export async function getIntakeSubmissionById(id: string) {
  const sessionUser = await getSessionUser();
  if (!sessionUser) return null;

  const submission = await prisma.intakeSubmission.findUnique({
    where: { id },
    include: {
      user: {
        select: { id: true, email: true, fullName: true, role: true },
      },
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

// ── Admin: assign PM to submission ────────────────────────────────────────

export async function assignPm(submissionId: string, pmId: string) {
  await requireAdmin();

  const submission = await prisma.intakeSubmission.update({
    where: { id: submissionId },
    data: {
      assignedPmId: pmId,
      pmChangeRequested: false,
      pmChangeReason: null,
      status: "ACTIVE",
    },
    include: {
      assignedPm: { select: { id: true, fullName: true } },
    },
  });

  // Notify the PM
  await createNotification({
    userId: pmId,
    type: "PM_ASSIGNED",
    content: `You have been assigned to intake brief ${submission.referenceNumber} (${submission.fullName}).`,
  });

  // Notify the client if they have an account
  if (submission.userId) {
    await createNotification({
      userId: submission.userId,
      type: "PM_ASSIGNED",
      content: `Your advisor has been assigned. They will be in touch shortly.`,
    });
  }

  revalidatePath("/admin-portal/intake");
  revalidatePath(`/admin-portal/intake/${submissionId}`);
  revalidatePath(`/client-portal/intake/${submissionId}`);
  return submission;
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

  await prisma.intakeSubmission.update({
    where: { id: submissionId },
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
