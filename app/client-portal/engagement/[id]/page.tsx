import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { requireClient } from "@/app/actions/auth";
import { prisma } from "@/lib/prisma";
import { getDocumentSignedUrl } from "@/app/actions/storage";
import StageProgressTracker from "@/components/portal/client/StageProgressTracker";
import ClientDocumentViewer from "@/components/portal/client/ClientDocumentViewer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  Download,
  Receipt,
  CalendarCheck,
  Rss,
  Clock,
  FileSignature,
} from "lucide-react";

export const metadata = {
  title: "Engagement Details — Terralume Client Portal",
};

function formatDate(d: Date | string | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatCurrency(amount: number | null | undefined, currency = "NGN") {
  if (!amount) return "—";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default async function PastEngagementDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireClient().catch(() => null);
  if (!user) redirect("/login");

  const engagement = await prisma.engagement.findUnique({
    where: { id },
    include: {
      updates: {
        where: { draft: false },
        orderBy: { publishedAt: "desc" },
      },
      agreement: {
        select: {
          id: true,
          status: true,
          signedAt: true,
          signerName: true,
          serviceTier: true,
          scopeDescription: true,
          timeline: true,
          deliverables: true,
          feeAmount: true,
          currency: true,
          terms: true,
          createdAt: true,
        },
      },
      invoices: {
        orderBy: { issuedAt: "desc" },
        select: {
          id: true,
          invoiceNumber: true,
          description: true,
          amount: true,
          currency: true,
          status: true,
          issuedAt: true,
          dueDate: true,
          paidAt: true,
        },
      },
      strategyMeetings: {
        orderBy: { scheduledAt: "asc" },
        select: {
          id: true,
          title: true,
          scheduledAt: true,
          status: true,
          meetingLink: true,
          notes: true,
        },
      },
      documents: {
        where: { isClientVisible: true },
        orderBy: { uploadedAt: "desc" },
        select: {
          id: true,
          name: true,
          title: true,
          category: true,
          filePath: true,
          uploadedAt: true,
        },
      },
      pm: {
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      },
    },
  });

  // Security: ensure this engagement belongs to the authenticated user
  if (!engagement || engagement.userId !== user.id) {
    notFound();
  }

  // Generate signed URLs for all visible documents
  const documentsWithUrls = await Promise.all(
    engagement.documents.map(async (doc) => {
      const result = await getDocumentSignedUrl(doc.filePath);
      return { ...doc, signedUrl: result.ok ? result.url : null };
    }),
  );

  const statusLabel: Record<string, string> = {
    completed: "Completed",
    cancelled: "Cancelled",
    paused: "Paused",
    active: "Active",
  };

  const statusColor: Record<string, string> = {
    completed: "bg-emerald-100 text-emerald-800 border-emerald-200",
    cancelled: "bg-red-50 text-red-700 border-red-200",
    paused: "bg-amber-50 text-amber-700 border-amber-200",
    active: "bg-blue-50 text-blue-700 border-blue-200",
  };

  const statusClass =
    statusColor[engagement.status] ?? "bg-surface-muted text-on-surface";

  return (
    <div className="mx-auto max-w-4xl px-6 py-8 space-y-8">
      {/* Back link */}
      <div>
        <Link
          href="/client-portal/engagement"
          className="inline-flex items-center gap-1.5 text-sm text-on-surface-muted hover:text-on-surface transition-colors"
        >
          <ArrowLeft size={14} />
          Back to My Engagements
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-muted mb-1">
            Engagement Detail
          </p>
          <h1 className="font-display text-2xl font-bold text-on-surface">
            {engagement.serviceTier ?? "Engagement"}
          </h1>
          <p className="text-sm text-on-surface-muted mt-1">
            {formatDate(engagement.startDate)} —{" "}
            {engagement.targetDate
              ? formatDate(engagement.targetDate)
              : "closed"}
            {engagement.pm && (
              <span>
                {" "}
                · PM: {engagement.pm.fullName ?? engagement.pm.email}
              </span>
            )}
          </p>
        </div>
        <span
          className={`self-start rounded-full border px-3 py-1 text-xs font-semibold ${statusClass}`}
        >
          {statusLabel[engagement.status] ?? engagement.status}
        </span>
      </div>

      {/* Stage at close */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-on-surface">Stage Reached</h2>
        <StageProgressTracker currentStage={engagement.stage} />
      </section>

      {/* Progress Updates */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Rss size={16} className="text-(--color-navy)" />
          <h2 className="text-sm font-semibold text-on-surface">
            Progress Updates
          </h2>
          {engagement.updates.length > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-(--color-navy) px-1.5 text-[10px] font-bold text-white">
              {engagement.updates.length}
            </span>
          )}
        </div>

        {engagement.updates.length === 0 ? (
          <p className="text-sm text-on-surface-muted italic">
            No updates were posted for this engagement.
          </p>
        ) : (
          <div className="space-y-3">
            {engagement.updates.map((update) => (
              <Card
                key={update.id}
                className="border-l-4 border-l-(--color-navy)"
              >
                <CardContent className="pt-4 pb-4">
                  <p className="text-xs text-on-surface-muted mb-2">
                    {formatDate(update.publishedAt)}
                  </p>
                  <p className="text-sm text-on-surface whitespace-pre-line">
                    {update.content}
                  </p>
                  {update.nextSteps && (
                    <div className="mt-3 rounded-lg bg-surface-muted/60 px-3 py-2">
                      <p className="text-xs font-semibold text-on-surface-muted uppercase tracking-wide mb-1">
                        Next steps
                      </p>
                      <p className="text-xs text-on-surface whitespace-pre-line">
                        {update.nextSteps}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Agreement summary */}
      {engagement.agreement && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-on-surface flex items-center gap-2">
            <FileSignature size={16} className="text-(--color-navy)" />
            Service Agreement
          </h2>
          <Card>
            <CardContent className="pt-5 space-y-3">
              <div className="flex items-center gap-2">
                {engagement.agreement.status === "SIGNED" ? (
                  <CheckCircle2
                    size={16}
                    className="text-emerald-600 shrink-0"
                  />
                ) : (
                  <Clock size={16} className="text-on-surface-muted shrink-0" />
                )}
                <span className="text-sm font-medium text-on-surface">
                  {engagement.agreement.status === "SIGNED"
                    ? `Signed by "${engagement.agreement.signerName}" on ${formatDate(engagement.agreement.signedAt)}`
                    : "Agreement was not signed"}
                </span>
              </div>
              {engagement.agreement.scopeDescription && (
                <div>
                  <p className="text-xs font-semibold text-on-surface-muted uppercase tracking-wide mb-1">
                    Scope
                  </p>
                  <p className="text-sm text-on-surface whitespace-pre-line">
                    {engagement.agreement.scopeDescription}
                  </p>
                </div>
              )}
              {engagement.agreement.feeAmount && (
                <div>
                  <p className="text-xs font-semibold text-on-surface-muted uppercase tracking-wide mb-1">
                    Total Fee
                  </p>
                  <p className="text-sm font-semibold text-on-surface">
                    {formatCurrency(
                      engagement.agreement.feeAmount,
                      engagement.agreement.currency ?? "NGN",
                    )}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      )}

      {/* Invoices / Payments */}
      {engagement.invoices.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-on-surface flex items-center gap-2">
            <Receipt size={16} className="text-(--color-navy)" />
            Invoices & Payments
          </h2>
          <div className="divide-y divide-divider rounded-xl border border-divider overflow-hidden">
            {engagement.invoices.map((inv) => (
              <div
                key={inv.id}
                className="flex items-center justify-between gap-3 px-4 py-3 bg-surface"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-on-surface truncate">
                    {inv.invoiceNumber}
                  </p>
                  <p className="text-xs text-on-surface-muted">
                    {inv.description} · Issued {formatDate(inv.issuedAt)}
                    {inv.paidAt && ` · Paid ${formatDate(inv.paidAt)}`}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm font-semibold text-on-surface">
                    {formatCurrency(inv.amount, inv.currency ?? "NGN")}
                  </span>
                  <Badge
                    variant={inv.status === "PAID" ? "default" : "outline"}
                    className="capitalize"
                  >
                    {inv.status.toLowerCase()}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Meetings */}
      {engagement.strategyMeetings.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-on-surface flex items-center gap-2">
            <CalendarCheck size={16} className="text-(--color-navy)" />
            Meetings
          </h2>
          <div className="divide-y divide-divider rounded-xl border border-divider overflow-hidden">
            {engagement.strategyMeetings.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between gap-3 px-4 py-3 bg-surface"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-on-surface truncate">
                    {m.title ?? "Strategy Meeting"}
                  </p>
                  <p className="text-xs text-on-surface-muted">
                    {formatDate(m.scheduledAt)}
                  </p>
                  {m.notes && (
                    <p className="text-xs text-on-surface-muted mt-0.5 line-clamp-2">
                      {m.notes}
                    </p>
                  )}
                </div>
                <Badge variant="outline" className="capitalize shrink-0">
                  {m.status.toLowerCase()}
                </Badge>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Documents */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-on-surface flex items-center gap-2">
          <FileText size={16} className="text-(--color-navy)" />
          Documents
        </h2>
        {documentsWithUrls.length === 0 ? (
          <p className="text-sm text-on-surface-muted italic">
            No documents shared for this engagement.
          </p>
        ) : (
          <div className="divide-y divide-divider rounded-xl border border-divider overflow-hidden">
            {documentsWithUrls.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between gap-3 px-4 py-3 bg-surface"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-muted">
                    <FileText size={15} className="text-on-surface-muted" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-on-surface truncate">
                      {doc.title || doc.name}
                    </p>
                    <p className="text-xs text-on-surface-muted">
                      {doc.category ?? "General"} · {formatDate(doc.uploadedAt)}
                    </p>
                  </div>
                </div>
                {doc.signedUrl && (
                  <div className="flex items-center gap-1 shrink-0">
                    <ClientDocumentViewer
                      name={doc.name}
                      title={doc.title}
                      signedUrl={doc.signedUrl}
                    />
                    <a
                      href={doc.signedUrl}
                      download={doc.name}
                      className="flex items-center gap-1.5 rounded-lg border border-divider px-3 py-1.5 text-xs font-medium text-on-surface hover:bg-surface-muted transition-colors"
                    >
                      <Download size={12} />
                      Download
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
