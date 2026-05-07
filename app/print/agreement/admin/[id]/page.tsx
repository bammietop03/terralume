import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import { requireAdmin } from "@/app/actions/auth";
import { getAgreement } from "@/app/actions/agreements";
import { prisma } from "@/lib/prisma";
import PrintTrigger from "@/components/portal/PrintTrigger";

export const metadata = { title: "Service Agreement — Terralume" };

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

export default async function AdminAgreementPrintPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await requireAdmin().catch(() => redirect("/admin-login"));

  const engagement = await prisma.engagement.findUnique({
    where: { id },
    select: {
      id: true,
      user: { select: { fullName: true, email: true } },
    },
  });
  if (!engagement) notFound();

  const agreement = await getAgreement(id);
  if (!agreement || agreement.status !== "SIGNED") notFound();

  const clientName = engagement.user.fullName ?? engagement.user.email;

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
              Service Agreement
            </p>
            <p className="text-sm text-gray-600 mt-0.5">
              Prepared {formatDate(agreement.createdAt)}
            </p>
          </div>
        </div>

        {/* Client */}
        <div className="mb-8">
          <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">
            Client
          </p>
          <p className="text-lg font-semibold text-gray-900">{clientName}</p>
          <p className="text-sm text-gray-500">{engagement.user.email}</p>
        </div>

        {/* Key details */}
        <div className="grid grid-cols-3 gap-4 bg-gray-50 rounded-xl p-5 mb-8">
          {agreement.serviceTier && (
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-0.5">
                Service Tier
              </p>
              <p className="text-sm font-medium text-gray-900">
                {agreement.serviceTier}
              </p>
            </div>
          )}
          {agreement.timeline && (
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-0.5">
                Timeline
              </p>
              <p className="text-sm font-medium text-gray-900">
                {agreement.timeline}
              </p>
            </div>
          )}
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-0.5">
              Agreed Fee
            </p>
            <p className="text-sm font-medium text-gray-900">
              {agreement.currency} {agreement.feeAmount.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Scope */}
        <div className="mb-8">
          <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-2">
            Scope of Service
          </p>
          <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
            {agreement.scopeDescription}
          </p>
        </div>

        {/* Deliverables */}
        {agreement.deliverables.length > 0 && (
          <div className="mb-8">
            <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-2">
              Deliverables
            </p>
            <ul className="space-y-1.5">
              {agreement.deliverables.map((d, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-gray-700"
                >
                  <span className="mt-2 size-1.5 rounded-full bg-gray-400 shrink-0" />
                  {d}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Terms */}
        <div className="mb-10">
          <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-2">
            Terms &amp; Conditions
          </p>
          <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
            {agreement.terms}
          </p>
        </div>

        {/* Signature */}
        <div className="border-t border-gray-200 pt-8">
          <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-4">
            Electronic Signature
          </p>
          <div className="flex items-end gap-10">
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Signed by</p>
              <p className="font-semibold text-gray-900">
                {agreement.signerName}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {formatDateTime(agreement.signedAt)}
              </p>
            </div>
            {agreement.signatureImageUrl && (
              <div className="relative h-20 w-52 border border-gray-200 rounded-lg bg-white overflow-hidden">
                <Image
                  src={agreement.signatureImageUrl}
                  alt="Signature"
                  fill
                  className="object-contain p-1"
                />
              </div>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-6">
            This agreement was electronically signed and is legally binding.
            Document generated by Terralume Property Advisory.
          </p>
        </div>
      </div>
    </>
  );
}
