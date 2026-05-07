"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin, getSessionUser } from "./auth";
import { createNotification } from "./notifications";
import { sendEmail } from "@/lib/email";
import { invoiceIssuedEmailHtml } from "@/lib/email-templates";
import { maybeCompleteOnboarding } from "./agreements";
import { logAudit } from "./audit";

let invoiceCounter = 0;

async function generateInvoiceNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await prisma.invoice.count();
  return `TRL-${year}-${String(count + 1 + invoiceCounter++).padStart(4, "0")}`;
}

export type InvoiceInput = {
  description: string;
  amount: number;
  currency?: string;
  dueDate?: Date | null;
  serviceAgreementId?: string | null;
};

export async function createInvoice(engagementId: string, data: InvoiceInput) {
  await requireAdmin();

  if (!data.description?.trim()) throw new Error("Description is required.");
  if (!data.amount || data.amount <= 0) {
    throw new Error("Amount must be greater than 0.");
  }

  const invoiceNumber = await generateInvoiceNumber();

  const invoice = await prisma.invoice.create({
    data: {
      engagementId,
      invoiceNumber,
      description: data.description,
      amount: data.amount,
      currency: data.currency ?? "NGN",
      dueDate: data.dueDate ?? null,
      serviceAgreementId: data.serviceAgreementId ?? null,
      status: "DRAFT",
    },
  });

  const engagement = await prisma.engagement.findUnique({
    where: { id: engagementId },
    select: { userId: true },
  });
  if (engagement) {
    revalidatePath(`/admin-portal/clients/${engagement.userId}`);
  }

  const admin = await requireAdmin();
  void logAudit(admin.id, "INVOICE_CREATED", "Invoice", invoice.id, {
    engagementId,
  });

  return invoice;
}

export async function sendInvoice(invoiceId: string) {
  const admin = await requireAdmin();

  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: { engagement: { include: { user: true } } },
  });
  if (!invoice) throw new Error("Invoice not found.");
  if (invoice.status !== "DRAFT") {
    throw new Error("Only DRAFT invoices can be sent.");
  }

  const updated = await prisma.invoice.update({
    where: { id: invoiceId },
    data: { status: "SENT", issuedAt: new Date() },
  });

  const client = invoice.engagement.user;
  const clientName = client.preferredName ?? client.fullName ?? "there";
  const portalUrl = `${process.env.NEXT_PUBLIC_APP_URL}/client-portal/payments`;

  await sendEmail({
    to: client.email,
    subject: `Invoice ${invoice.invoiceNumber} — Terralume`,
    html: invoiceIssuedEmailHtml({
      clientName,
      invoiceNumber: invoice.invoiceNumber,
      description: invoice.description,
      amount: invoice.amount,
      currency: invoice.currency,
      dueDate: invoice.dueDate,
      portalUrl,
    }),
  });

  await createNotification({
    userId: client.id,
    type: "invoice_issued",
    content: `Invoice ${invoice.invoiceNumber} for ${invoice.currency} ${invoice.amount.toLocaleString()} has been issued.`,
  });

  revalidatePath(`/admin-portal/clients/${client.id}`);
  revalidatePath("/client-portal/payments");

  void logAudit(admin.id, "INVOICE_SENT", "Invoice", invoiceId);

  return updated;
}

export async function getInvoices(engagementId: string) {
  const user = await getSessionUser();
  if (!user) throw new Error("Not authenticated.");

  const engagement = await prisma.engagement.findUnique({
    where: { id: engagementId },
    select: { userId: true },
  });
  if (!engagement) throw new Error("Engagement not found.");

  if (user.role === "CLIENT" && engagement.userId !== user.id) {
    throw new Error("Not authorised.");
  }

  return prisma.invoice.findMany({
    where: { engagementId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getInvoiceById(invoiceId: string) {
  const user = await getSessionUser();
  if (!user) throw new Error("Not authenticated.");

  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: { engagement: true },
  });
  if (!invoice) return null;

  if (user.role === "CLIENT" && invoice.engagement.userId !== user.id) {
    throw new Error("Not authorised.");
  }

  return invoice;
}

/** Called by the Paystack webhook after charge.success */
export async function markInvoicePaid(paystackReference: string, paidAt: Date) {
  const invoice = await prisma.invoice.findFirst({
    where: { paystackReference },
  });
  if (!invoice) return null;

  const updated = await prisma.invoice.update({
    where: { id: invoice.id },
    data: { status: "PAID", paidAt },
  });

  await maybeCompleteOnboarding(invoice.engagementId, "");

  void logAudit(invoice.engagementId, "INVOICE_PAID", "Invoice", invoice.id, {
    paystackReference,
    paidAt,
  });

  revalidatePath("/client-portal/payments");

  return updated;
}
