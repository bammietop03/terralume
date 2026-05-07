import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { requireAdmin } from "@/app/actions/auth";
import { getAgreement } from "@/app/actions/agreements";
import { prisma } from "@/lib/prisma";
import { ArrowLeft, CheckCircle2, FileSignature, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AgreementEditForm from "@/components/portal/admin/AgreementEditForm";

export const metadata = { title: "Service Agreement — Terralume Admin" };

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

export default async function EngagementAgreementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await requireAdmin().catch(() => redirect("/admin-login"));

  // Check engagement exists
  const engagement = await prisma.engagement.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!engagement) notFound();

  const agreement = await getAgreement(id);
  const isSigned = agreement?.status === "SIGNED";

  return (
    <div className="px-6 py-8 max-w-3xl mx-auto space-y-6">
      <Link
        href={`/admin-portal/engagements/${id}`}
        className="flex items-center gap-1.5 text-sm text-on-surface-muted hover:text-on-surface transition-colors w-fit"
      >
        <ArrowLeft size={16} />
        Back to engagement
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-muted mb-1">
            Service Agreement
          </p>
          <h1 className="font-display text-2xl font-bold text-on-surface">
            {isSigned ? "Signed Agreement" : "Draft Agreement"}
          </h1>
          {!isSigned && (
            <p className="text-sm text-on-surface-muted mt-1">
              Draft and send the formal service agreement. The client will sign
              electronically.
            </p>
          )}
        </div>
        {isSigned && (
          <Link
            href={`/print/agreement/admin/${id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1.5"
            >
              <Download size={14} />
              Export PDF
            </Button>
          </Link>
        )}
      </div>

      {/* Signed: read-only view */}
      {isSigned && agreement ? (
        <div className="space-y-6">
          {/* Signed banner */}
          <div className="rounded-xl px-4 py-3 flex items-center gap-3 text-sm font-medium bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
            <CheckCircle2 size={16} />
            Signed by &ldquo;{agreement.signerName}&rdquo; on{" "}
            {formatDateTime(agreement.signedAt)}
          </div>

          {/* Agreement details */}
          <Card>
            <CardContent className="pt-5 space-y-5">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4 text-sm">
                {agreement.serviceTier && (
                  <div>
                    <p className="text-xs text-on-surface-muted mb-0.5">
                      Service Tier
                    </p>
                    <p className="font-medium text-on-surface">
                      {agreement.serviceTier}
                    </p>
                  </div>
                )}
                {agreement.timeline && (
                  <div>
                    <p className="text-xs text-on-surface-muted mb-0.5">
                      Timeline
                    </p>
                    <p className="font-medium text-on-surface">
                      {agreement.timeline}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-on-surface-muted mb-0.5">
                    Agreed Fee
                  </p>
                  <p className="font-medium text-on-surface">
                    {agreement.currency} {agreement.feeAmount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-on-surface-muted mb-0.5">
                    Prepared
                  </p>
                  <p className="font-medium text-on-surface">
                    {formatDate(agreement.createdAt)}
                  </p>
                </div>
              </div>

              <div className="border-t border-divider pt-4">
                <p className="text-xs text-on-surface-muted mb-1.5 font-medium uppercase tracking-wide">
                  Scope of Service
                </p>
                <p className="text-sm text-on-surface whitespace-pre-wrap">
                  {agreement.scopeDescription}
                </p>
              </div>

              {agreement.deliverables.length > 0 && (
                <div className="border-t border-divider pt-4">
                  <p className="text-xs text-on-surface-muted mb-2 font-medium uppercase tracking-wide">
                    Deliverables
                  </p>
                  <ul className="space-y-1">
                    {agreement.deliverables.map((d, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-on-surface"
                      >
                        <span className="mt-1.5 size-1.5 rounded-full bg-navy shrink-0" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="border-t border-divider pt-4">
                <p className="text-xs text-on-surface-muted mb-1.5 font-medium uppercase tracking-wide">
                  Terms &amp; Conditions
                </p>
                <p className="text-sm text-on-surface whitespace-pre-wrap leading-relaxed">
                  {agreement.terms}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Signature */}
          <Card>
            <CardContent className="pt-5">
              <div className="flex items-center gap-2 mb-4">
                <FileSignature size={16} className="text-(--color-navy)" />
                <p className="font-semibold text-on-surface text-sm">
                  Electronic Signature
                </p>
              </div>
              <div className="rounded-xl border border-divider bg-surface-alt p-4">
                <p className="text-xs text-on-surface-muted mb-1">Signed by</p>
                <p className="font-semibold text-on-surface mb-3">
                  {agreement.signerName}
                </p>
                {agreement.signatureImageUrl && (
                  <div className="relative h-24 w-64 rounded-lg border border-divider bg-white overflow-hidden">
                    <Image
                      src={agreement.signatureImageUrl}
                      alt="Client signature"
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                )}
                <p className="text-xs text-on-surface-muted mt-3">
                  Signed on {formatDateTime(agreement.signedAt)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Not signed: show editable form */
        <AgreementEditForm engagementId={id} />
      )}
    </div>
  );
}
