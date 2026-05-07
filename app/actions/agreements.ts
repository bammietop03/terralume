"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin, requireClient, getSessionUser } from "./auth";
import { createNotification } from "./notifications";
import { sendEmail } from "@/lib/email";
import {
  agreementReadyEmailHtml,
  onboardingCompleteEmailHtml,
} from "@/lib/email-templates";
import { logAudit } from "./audit";

export type AgreementInput = {
  serviceTier?: string | null;
  scopeDescription: string;
  timeline?: string | null;
  deliverables: string[];
  feeAmount: number;
  currency?: string;
  terms: string;
};

export async function createAgreement(
  engagementId: string,
  data: AgreementInput,
) {
  await requireAdmin();

  if (!data.scopeDescription?.trim()) {
    throw new Error("Scope description is required.");
  }
  if (!data.terms?.trim()) throw new Error("Terms are required.");
  if (!data.feeAmount || data.feeAmount <= 0) {
    throw new Error("Fee amount must be greater than 0.");
  }

  const engagement = await prisma.engagement.findUnique({
    where: { id: engagementId },
    include: { user: true },
  });
  if (!engagement) throw new Error("Engagement not found.");

  const agreement = await prisma.serviceAgreement.upsert({
    where: { engagementId },
    create: {
      engagementId,
      serviceTier: data.serviceTier ?? null,
      scopeDescription: data.scopeDescription,
      timeline: data.timeline ?? null,
      deliverables: data.deliverables,
      feeAmount: data.feeAmount,
      currency: data.currency ?? "NGN",
      terms: data.terms,
      status: "PENDING",
    },
    update: {
      serviceTier: data.serviceTier ?? null,
      scopeDescription: data.scopeDescription,
      timeline: data.timeline ?? null,
      deliverables: data.deliverables,
      feeAmount: data.feeAmount,
      currency: data.currency ?? "NGN",
      terms: data.terms,
      status: "PENDING",
      signedAt: null,
      signerName: null,
      signedByUserId: null,
    },
  });

  const client = engagement.user;
  const clientName = client.preferredName ?? client.fullName ?? "there";
  const portalUrl = `${process.env.NEXT_PUBLIC_APP_URL}/client-portal/agreement`;

  await sendEmail({
    to: client.email,
    subject: "Your Service Agreement Is Ready to Sign — Terralume",
    html: agreementReadyEmailHtml({
      clientName,
      portalUrl,
      feeAmount: data.feeAmount,
      currency: data.currency ?? "NGN",
    }),
  });

  await createNotification({
    userId: client.id,
    type: "agreement_ready",
    content: "Your service agreement is ready for review and signature.",
  });

  revalidatePath(`/admin-portal/clients/${client.id}`);
  revalidatePath(`/client-portal/agreement`);

  const admin = await requireAdmin();
  void logAudit(
    admin.id,
    "AGREEMENT_CREATED",
    "ServiceAgreement",
    agreement.id,
    { engagementId },
  );

  return agreement;
}

export async function signAgreement(
  engagementId: string,
  signerName: string,
  signatureImageUrl?: string | null,
) {
  const user = await requireClient();

  const trimmedName = signerName?.trim();
  if (!trimmedName) throw new Error("Signer name is required.");

  const agreement = await prisma.serviceAgreement.findUnique({
    where: { engagementId },
    include: { engagement: { include: { user: true } } },
  });

  if (!agreement) throw new Error("Agreement not found.");
  if (agreement.engagement.userId !== user.id) {
    throw new Error("Not authorised.");
  }
  if (agreement.status === "SIGNED") {
    throw new Error("Agreement has already been signed.");
  }

  const signed = await prisma.serviceAgreement.update({
    where: { engagementId },
    data: {
      status: "SIGNED",
      signedAt: new Date(),
      signerName: trimmedName,
      signedByUserId: user.id,
      ...(signatureImageUrl ? { signatureImageUrl } : {}),
    },
  });

  // Check if all invoices for this engagement are paid — trigger onboarding completion
  await maybeCompleteOnboarding(engagementId, user.id);

  void logAudit(user.id, "AGREEMENT_SIGNED", "ServiceAgreement", signed.id, {
    signerName: trimmedName,
  });

  revalidatePath("/client-portal/agreement");
  revalidatePath(`/admin-portal/clients/${user.id}`);

  return signed;
}

export async function getAgreement(engagementId: string) {
  const user = await getSessionUser();
  if (!user) throw new Error("Not authenticated.");

  const agreement = await prisma.serviceAgreement.findUnique({
    where: { engagementId },
    include: { engagement: true },
  });

  if (!agreement) return null;

  // Clients may only see their own agreement
  if (user.role === "CLIENT" && agreement.engagement.userId !== user.id) {
    throw new Error("Not authorised.");
  }

  return agreement;
}

// ─── Internal helper ──────────────────────────────────────────────────────────

export async function maybeCompleteOnboarding(
  engagementId: string,
  clientUserId: string,
) {
  const [agreement, unpaidInvoices] = await Promise.all([
    prisma.serviceAgreement.findUnique({
      where: { engagementId },
      select: { status: true },
    }),
    prisma.invoice.count({
      where: { engagementId, status: { in: ["DRAFT", "SENT"] } },
    }),
  ]);

  if (agreement?.status === "SIGNED" && unpaidInvoices === 0) {
    // Mark engagement as active client + set onboardingComplete
    await prisma.$transaction([
      prisma.engagement.update({
        where: { id: engagementId },
        data: { stage: "active_client" },
      }),
      prisma.user.update({
        where: { id: clientUserId },
        data: { onboardingComplete: true },
      }),
    ]);

    const client = await prisma.user.findUnique({
      where: { id: clientUserId },
      select: { email: true, fullName: true, preferredName: true },
    });

    if (client) {
      const clientName = client.preferredName ?? client.fullName ?? "there";
      const portalUrl = `${process.env.NEXT_PUBLIC_APP_URL}/client-portal/dashboard`;

      await sendEmail({
        to: client.email,
        subject: "You're Now an Active Client — Terralume",
        html: onboardingCompleteEmailHtml({ clientName, portalUrl }),
      });

      await createNotification({
        userId: clientUserId,
        type: "onboarding_complete",
        content:
          "Your onboarding is complete. Welcome to your active client workspace.",
      });

      void logAudit(
        clientUserId,
        "ONBOARDING_COMPLETE",
        "Engagement",
        engagementId,
      );
    }
  }
}
