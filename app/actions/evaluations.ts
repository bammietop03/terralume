"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "./auth";
import { logAudit } from "./audit";

export type EvaluationInput = {
  legalScore?: number | null;
  legalNotes?: string | null;
  financialScore?: number | null;
  financialNotes?: string | null;
  marketScore?: number | null;
  marketNotes?: string | null;
  taxNotes?: string | null;
  riskScore?: number | null;
  riskNotes?: string | null;
  crossBorderNotes?: string | null;
  overallRecommendation?: string | null;
  completedAt?: Date | null;
};

export async function saveEvaluation(
  intakeSubmissionId: string,
  data: EvaluationInput,
) {
  const admin = await requireAdmin();

  // Validate scores are between 1 and 5
  const scoreFields = [
    data.legalScore,
    data.financialScore,
    data.marketScore,
    data.riskScore,
  ];
  for (const score of scoreFields) {
    if (score !== null && score !== undefined && (score < 1 || score > 5)) {
      throw new Error("Scores must be between 1 and 5.");
    }
  }

  const evaluation = await prisma.clientEvaluation.upsert({
    where: { intakeSubmissionId },
    create: {
      intakeSubmissionId,
      pmId: admin.id,
      ...data,
    },
    update: {
      ...data,
      pmId: admin.id,
    },
  });

  // Move intake to REVIEWING if it's still PENDING
  await prisma.intakeSubmission.updateMany({
    where: { id: intakeSubmissionId, status: "PENDING" },
    data: { status: "REVIEWING" },
  });

  revalidatePath(`/admin-portal/intake/${intakeSubmissionId}`);
  revalidatePath(`/admin-portal/intake/${intakeSubmissionId}/evaluation`);

  void logAudit(
    admin.id,
    "EVALUATION_SAVED",
    "ClientEvaluation",
    evaluation.id,
    { intakeSubmissionId },
  );

  return evaluation;
}

export async function getEvaluation(intakeSubmissionId: string) {
  await requireAdmin();
  return prisma.clientEvaluation.findUnique({
    where: { intakeSubmissionId },
    include: { pm: { select: { id: true, fullName: true } } },
  });
}
