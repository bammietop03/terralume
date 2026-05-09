import { notFound, redirect } from "next/navigation";
import { requireClient } from "@/app/actions/auth";
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

export default async function ClientReceiptPrintPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireClient().catch(() => null);
  if (!user) redirect("/login");

  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: {
      engagement: {
        include: {
          user: {
            select: {
              id: true,
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

  // Only show the receipt if it belongs to this client and is paid
  if (
    !invoice ||
    invoice.status !== "PAID" ||
    invoice.engagement.userId !== user.id
  ) {
    notFound();
  }

  const clientName = user.fullName ?? user.email;

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
          <p className="text-sm text-gray-500">{user.email}</p>
          {user.phone && <p className="text-sm text-gray-500">{user.phone}</p>}
          {user.location && (
            <p className="text-sm text-gray-500">{user.location}</p>
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
