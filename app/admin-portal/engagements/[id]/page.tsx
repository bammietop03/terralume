import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/app/actions/auth";
import { getEngagementDetail } from "@/app/actions/admin";
import {
  ArrowLeft,
  ClipboardCheck,
  FileText,
  CreditCard,
  FileSignature,
  Rss,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MeetingDialog from "@/components/portal/admin/MeetingDialog";
import DocumentDialog from "@/components/portal/admin/DocumentDialog";
import ClientDetailsDialog from "@/components/portal/admin/ClientDetailsDialog";
import UpdateStageForm from "@/components/portal/admin/UpdateStageForm";
import UpdateStatusForm from "@/components/portal/admin/UpdateStatusForm";
import AddUpdateDialog from "@/components/portal/admin/AddUpdateDialog";

export const metadata = { title: "Engagement Detail — Terralume Admin Portal" };

function formatDate(date: Date | string | null | undefined) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const STAGE_LABELS: Record<string, string> = {
  discovery: "Discovery",
  brief_confirmation: "Brief Confirmation",
  area_shortlisting: "Area Shortlisting",
  property_search: "Property Search",
  due_diligence: "Due Diligence",
  offer_negotiation: "Offer & Negotiation",
  legal_completion: "Legal & Completion",
  handover: "Handover",
  active_client: "Active Client",
};

const STATUS_STYLES: Record<string, string> = {
  DRAFT: "bg-zinc-100 text-zinc-600 ring-zinc-200",
  SENT: "bg-blue-50 text-blue-700 ring-blue-200",
  PAID: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  CANCELLED: "bg-red-50 text-red-700 ring-red-200",
};

const ENGAGEMENT_STATUS_COLORS: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  on_hold: "bg-amber-50 text-amber-700 ring-amber-200",
  completed: "bg-blue-50 text-blue-700 ring-blue-200",
  cancelled: "bg-red-50 text-red-700 ring-red-200",
};

export default async function EngagementDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await requireAdmin().catch(() => redirect("/admin-login"));

  const engagement = await getEngagementDetail(id);
  if (!engagement) notFound();

  const client = engagement.user;
  const clientName = client.fullName ?? client.email;

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto space-y-8">
      {/* Back */}
      <Link
        href="/admin-portal/engagements"
        className="flex items-center gap-1.5 text-sm text-on-surface-muted hover:text-on-surface transition-colors w-fit"
      >
        <ArrowLeft size={16} />
        Back to engagements
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-muted mb-1">
            Engagement
          </p>
          <h1 className="font-display text-2xl font-bold text-on-surface">
            {clientName}
          </h1>
          <p className="text-sm text-on-surface-muted">{client.email}</p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2">
          <ClientDetailsDialog
            client={client}
            stats={[
              { label: "Documents", value: engagement.documents.length },
              { label: "Meetings", value: engagement.strategyMeetings.length },
              { label: "Invoices", value: engagement.invoices.length },
            ]}
          />

          <Link
            href={`/admin-portal/engagements/${id}/agreement`}
            className="flex items-center gap-1.5 rounded-xl bg-navy border border-divider px-3 py-1.5 text-sm font-medium text-white hover:bg-navy/80 transition-colors"
          >
            <FileSignature size={14} />
            Agreement
          </Link>
          <Link
            href={`/admin-portal/engagements/${id}/invoice`}
            className="flex items-center gap-1.5 rounded-xl bg-navy border border-divider px-3 py-1.5 text-sm font-medium text-white hover:bg-navy/80 transition-colors"
          >
            <CreditCard size={14} />
            Invoices
          </Link>
        </div>
      </div>

      {/* Engagement summary */}
      <Card>
        <CardContent className="pt-5">
          <h2 className="font-semibold text-on-surface mb-4">
            Engagement Details
          </h2>
          <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3 text-sm mb-6">
            {[
              {
                label: "Service tier",
                value:
                  engagement.tierRef?.name ?? engagement.serviceTier ?? "—",
              },
              {
                label: "Tier price",
                value: engagement.tierRef
                  ? `${engagement.tierRef.currency} ${engagement.tierRef.price.toLocaleString()}`
                  : "—",
              },
              { label: "PM", value: engagement.pm?.fullName ?? "Unassigned" },
              { label: "Start date", value: formatDate(engagement.startDate) },
              {
                label: "Target date",
                value: formatDate(engagement.targetDate),
              },
            ].map(({ label, value }) => (
              <div key={label}>
                <dt className="text-on-surface-muted text-xs">{label}</dt>
                <dd className="font-medium text-on-surface capitalize">
                  {value ?? "—"}
                </dd>
              </div>
            ))}
          </dl>

          <div className="border-t border-divider pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-on-surface-muted mb-2 font-medium uppercase tracking-wide">
                Stage
              </p>
              <UpdateStageForm
                engagementId={engagement.id}
                currentStage={engagement.stage}
              />
            </div>
            <div>
              <p className="text-xs text-on-surface-muted mb-2 font-medium uppercase tracking-wide">
                Status
              </p>
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset capitalize ${ENGAGEMENT_STATUS_COLORS[engagement.status] ?? "bg-zinc-100 text-zinc-600 ring-zinc-200"}`}
                >
                  {engagement.status.replace("_", " ")}
                </span>
                <UpdateStatusForm
                  engagementId={engagement.id}
                  currentStatus={engagement.status}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Updates */}
      <Card>
        <CardContent className="pt-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Rss size={18} className="text-(--color-navy)" />
              <h2 className="font-semibold text-on-surface">Updates</h2>
            </div>
            <AddUpdateDialog
              engagementId={engagement.id}
              pmId={engagement.pm?.id ?? client.id}
            />
          </div>

          {engagement.updates.length === 0 ? (
            <p className="text-sm text-on-surface-muted italic">
              No updates posted yet.
            </p>
          ) : (
            <div className="space-y-3">
              {engagement.updates.map((update) => (
                <div
                  key={update.id}
                  className="rounded-xl border border-divider bg-surface-muted/40 px-4 py-3 space-y-1"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-medium text-on-surface-muted">
                      {update.pm?.fullName ?? "PM"} ·{" "}
                      {formatDate(update.publishedAt)}
                    </p>
                  </div>
                  <p className="text-sm text-on-surface whitespace-pre-line">
                    {update.content}
                  </p>
                  {update.nextSteps && (
                    <div className="mt-2 rounded-lg bg-surface-muted px-3 py-2">
                      <p className="text-xs font-semibold text-on-surface-muted uppercase tracking-wide mb-0.5">
                        Next steps
                      </p>
                      <p className="text-xs text-on-surface whitespace-pre-line">
                        {update.nextSteps}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Strategy meetings */}
      <Card>
        <CardContent className="pt-5">
          <div className="flex items-center gap-2 mb-4">
            <ClipboardCheck size={18} className="text-(--color-navy)" />
            <h2 className="font-semibold text-on-surface">Strategy Meetings</h2>
          </div>
          <MeetingDialog
            engagementId={engagement.id}
            meetings={engagement.strategyMeetings.map((m) => ({
              ...m,
              scheduledAt: m.scheduledAt,
            }))}
          />
        </CardContent>
      </Card>

      {/* Documents */}
      <Card>
        <CardContent className="pt-5">
          <div className="flex items-center gap-2 mb-4">
            <FileText size={18} className="text-(--color-navy)" />
            <h2 className="font-semibold text-on-surface">Documents</h2>
          </div>
          <DocumentDialog
            engagementId={engagement.id}
            documents={engagement.documents}
          />
        </CardContent>
      </Card>

      {/* Invoices summary */}
      {engagement.invoices.length > 0 && (
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CreditCard size={18} className="text-(--color-navy)" />
                <h2 className="font-semibold text-on-surface">Invoices</h2>
              </div>
              <Link
                href={`/admin-portal/engagements/${id}/invoice`}
                className="text-xs font-medium text-(--color-navy) hover:underline underline-offset-4"
              >
                Manage →
              </Link>
            </div>
            <div className="divide-y divide-divider">
              {engagement.invoices.slice(0, 5).map((inv) => (
                <div
                  key={inv.id}
                  className="flex items-center justify-between py-3 text-sm"
                >
                  <div>
                    <p className="font-medium text-on-surface">
                      {inv.invoiceNumber}
                    </p>
                    <p className="text-xs text-on-surface-muted">
                      {inv.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">
                      {inv.currency} {inv.amount.toLocaleString()}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${STATUS_STYLES[inv.status] ?? ""}`}
                    >
                      {inv.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Agreement status */}
      {engagement.agreement && (
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileSignature size={18} className="text-(--color-navy)" />
                <h2 className="font-semibold text-on-surface">
                  Service Agreement
                </h2>
              </div>
              <Link
                href={`/admin-portal/engagements/${id}/agreement`}
                className="text-xs font-medium text-(--color-navy) hover:underline underline-offset-4"
              >
                Manage →
              </Link>
            </div>
            <div className="mt-3">
              <Badge
                variant={
                  engagement.agreement.status === "SIGNED"
                    ? "default"
                    : "outline"
                }
              >
                {engagement.agreement.status}
              </Badge>
              {engagement.agreement.signedAt && (
                <p className="text-xs text-on-surface-muted mt-1">
                  Signed {formatDate(engagement.agreement.signedAt)} by{" "}
                  {engagement.agreement.signerName ?? "client"}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
