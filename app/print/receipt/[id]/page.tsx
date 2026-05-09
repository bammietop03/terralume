import { notFound, redirect } from "next/navigation";
import { requireAdmin } from "@/app/actions/auth";
import { prisma } from "@/lib/prisma";
import PrintTrigger from "@/components/portal/PrintTrigger";

export const metadata = { title: "Payment Receipt — Terralume" };

function formatDate(d: Date | string | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatDateTime(d: Date | string | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function ReceiptPrintPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await requireAdmin().catch(() => redirect("/admin-login"));

  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: {
      engagement: {
        include: {
          user: {
            select: {
              fullName: true,
              email: true,
              phone: true,
              location: true,
            },
          },
          tierRef: { select: { name: true } },
        },
      },
    },
  });

  if (!invoice || invoice.status !== "PAID") notFound();

  const client = invoice.engagement.user;
  const clientName = client.fullName ?? client.email;

  return (
    <>
      <PrintTrigger />
      <div className="min-h-screen bg-white text-gray-900 p-12 max-w-3xl mx-auto print:p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-10 pb-6 border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Terralume
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">Property Advisory</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">
              Payment Receipt
            </p>
            <p className="text-sm font-mono text-gray-700 mt-0.5">
              {invoice.invoiceNumber}
            </p>
          </div>
        </div>

        {/* Status badge */}
        <div className="mb-8">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Payment Confirmed
          </span>
        </div>

        {/* Client */}
        <div className="mb-8">
          <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">
            Client
          </p>
          <p className="text-lg font-semibold text-gray-900">{clientName}</p>
          <p className="text-sm text-gray-500">{client.email}</p>
          {client.phone && (
            <p className="text-sm text-gray-500">{client.phone}</p>
          )}
          {client.location && (
            <p className="text-sm text-gray-500">{client.location}</p>
          )}
        </div>

        {/* Payment details */}
        <div className="rounded-xl bg-gray-50 p-6 mb-8 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-0.5">
                Invoice Number
              </p>
              <p className="text-sm font-mono font-medium text-gray-900">
                {invoice.invoiceNumber}
              </p>
            </div>
            {invoice.engagement.tierRef && (
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-0.5">
                  Service Tier
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {invoice.engagement.tierRef.name}
                </p>
              </div>
            )}
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-0.5">
                Issued
              </p>
              <p className="text-sm font-medium text-gray-900">
                {formatDate(invoice.issuedAt)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-0.5">
                Payment Date
              </p>
              <p className="text-sm font-medium text-gray-900">
                {formatDateTime(invoice.paidAt)}
              </p>
            </div>
            {invoice.paystackReference && (
              <div className="col-span-2">
                <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-0.5">
                  Transaction Reference
                </p>
                <p className="text-sm font-mono text-gray-700">
                  {invoice.paystackReference}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Description + amount */}
        <div className="mb-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-xs text-gray-400 uppercase tracking-wide font-semibold pb-2">
                  Description
                </th>
                <th className="text-right text-xs text-gray-400 uppercase tracking-wide font-semibold pb-2">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-3 text-gray-700">{invoice.description}</td>
                <td className="py-3 text-right font-medium text-gray-900">
                  {invoice.currency} {invoice.amount.toLocaleString()}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td className="pt-4 text-sm font-bold text-gray-900">
                  Total Paid
                </td>
                <td className="pt-4 text-right text-base font-bold text-emerald-700">
                  {invoice.currency} {invoice.amount.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 pt-6 text-center">
          <p className="text-xs text-gray-400">
            This is an official payment receipt issued by Terralume Property
            Advisory.
          </p>
          <p className="text-xs text-gray-400 mt-1">
            For enquiries, contact{" "}
            <span className="text-gray-600">team@terralume.com</span>
          </p>
        </div>
      </div>
    </>
  );
}
