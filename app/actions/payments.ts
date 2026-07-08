"use server";

import { prisma } from "@/lib/prisma";
import { getSessionUser, requireAdmin } from "./auth";
import { createNotification } from "./notifications";
import { revalidatePath } from "next/cache";
import { logAudit } from "./audit";

/**
 * Get all payments for an engagement
 */
export async function getEngagementPayments(engagementId: string) {
  const user = await getSessionUser();
  if (!user) throw new Error("Not authenticated.");

  const engagement = await prisma.engagement.findUnique({
    where: { id: engagementId },
    select: { userId: true },
  });
  if (!engagement) throw new Error("Engagement not found.");

  // Clients can only see their own engagement payments
  if (user.role === "CLIENT" && engagement.userId !== user.id) {
    throw new Error("Not authorised.");
  }

  return prisma.payment.findMany({
    where: { engagementId },
    orderBy: { createdAt: "desc" },
  });
}

export type PaymentInput = {
  engagementId: string;
  type: "RETAINER" | "SUCCESS" | "OTHER";
  amount: number;
  currency?: string;
  provider?: "MANUAL" | "PAYSTACK" | "OTHER";
  status?: "PENDING" | "SUCCESS" | "FAILED";
  reference?: string;
  paidAt?: Date;
};

/**
 * Record a new payment (manual or external)
 */
export async function recordPayment(input: PaymentInput) {
  const admin = await requireAdmin();

  if (!input.amount || input.amount <= 0) {
    throw new Error("Payment amount must be greater than 0.");
  }

  const engagement = await prisma.engagement.findUnique({
    where: { id: input.engagementId },
    include: { user: true },
  });

  if (!engagement) {
    throw new Error("Engagement not found.");
  }

  const payment = await prisma.payment.create({
    data: {
      engagementId: input.engagementId,
      type: input.type,
      amount: input.amount,
      currency: input.currency || "NGN",
      provider: input.provider || "MANUAL",
      status: input.status || "SUCCESS",
      reference: input.reference || null,
      paidAt: input.paidAt || (input.status === "SUCCESS" ? new Date() : null),
    },
  });

  // Notify client if payment is successful
  if (payment.status === "SUCCESS") {
    const client = engagement.user;
    await createNotification({
      userId: client.id,
      type: "payment_received",
      content: `Payment of ${payment.currency} ${payment.amount.toLocaleString()} has been recorded.`,
    });
  }

  revalidatePath(`/admin-portal/engagements/${input.engagementId}`);
  revalidatePath("/client-portal/payments");

  void logAudit(admin.id, "PAYMENT_RECORDED", "Payment", payment.id, {
    amount: input.amount,
    currency: input.currency,
    type: input.type,
  });

  return { success: true, paymentId: payment.id };
}
