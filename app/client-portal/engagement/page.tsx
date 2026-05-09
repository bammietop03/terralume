import { redirect } from "next/navigation";
import Link from "next/link";
import { requireClient } from "@/app/actions/auth";
import { prisma } from "@/lib/prisma";
import { getDocumentSignedUrl } from "@/app/actions/storage";
import StageProgressTracker from "@/components/portal/client/StageProgressTracker";
import ClientDocumentViewer from "@/components/portal/client/ClientDocumentViewer";
import AgreementDialog from "@/components/portal/client/AgreementDialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Receipt,
  CalendarCheck,
  MessageSquare,
  FileText,
  Download,
  ArrowRight,
  CheckCircle2,
  Clock,
  FileSignature,
  Rss,
} from "lucide-react";

export const metadata = { title: "My Engagement — Terralume Client Portal" };

function formatDate(d: Date | string | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function ClientEngagementPage() {
  const user = await requireClient().catch(() => null);
  if (!user) redirect("/login");

  const engagements = await prisma.engagement.findMany({
    where: { userId: user.id },
    orderBy: { startDate: "desc" },
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
          signatureImageUrl: true,
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
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          amount: true,
          currency: true,
          status: true,
          dueDate: true,
        },
      },
      strategyMeetings: {
        select: {
          id: true,
          scheduledAt: true,
          meetingLink: true,
          title: true,
          status: true,
        },
        orderBy: { scheduledAt: "asc" },
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
          phone: true,
          photoUrl: true,
        },
      },
    },
  });

  const activeEngagements = engagements.filter((e) => e.status === "active");
  const pastEngagements = engagements.filter((e) => e.status !== "active");

  // Generate signed URLs for all visible documents
  const engagementsWithDocUrls = await Promise.all(
    engagements.map(async (eng) => ({
      ...eng,
      documents: await Promise.all(
        eng.documents.map(async (doc) => {
          const result = await getDocumentSignedUrl(doc.filePath);
          return { ...doc, signedUrl: result.ok ? result.url : null };
        }),
      ),
    })),
  );

  if (engagements.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-(--color-navy-light)">
          <ArrowRight size={28} className="text-(--color-navy)" />
        </div>
        <h1 className="font-display text-2xl font-bold text-on-surface">
          Your engagement is not yet active
        </h1>
        <p className="text-sm text-on-surface-muted max-w-sm mx-auto">
          Once your consultant activates your portal, your full engagement
          journey will appear here.
        </p>
        <Link
          href="/client-portal/dashboard"
          className="inline-flex items-center gap-1.5 rounded-xl bg-(--color-navy) px-5 py-2.5 text-sm font-semibold text-white hover:bg-(--color-navy-dark) transition-colors"
        >
          Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-8 space-y-10">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-muted mb-1">
          My Engagements
        </p>
        <h1 className="font-display text-2xl font-bold text-on-surface">
          Your Property Journey
        </h1>
      </div>

      {/* Active engagements */}
      {engagementsWithDocUrls
        .filter((e) => e.status === "active")
        .map((engagement, idx) => {
          const pm = engagement.pm ?? null;
          const pendingInvoices = engagement.invoices.filter(
            (inv) => inv.status === "SENT",
          );
          const paidInvoices = engagement.invoices.filter(
            (inv) => inv.status === "PAID",
          );

          return (
            <section key={engagement.id} className="space-y-5">
              {activeEngagements.length > 1 && (
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-(--color-navy) text-xs font-bold text-white">
                    {idx + 1}
                  </span>
                  <h2 className="text-sm font-semibold text-on-surface">
                    {engagement.serviceTier ?? "Engagement"}{" "}
                    <span className="text-on-surface-muted font-normal">
                      · started {formatDate(engagement.startDate)}
                    </span>
                  </h2>
                </div>
              )}

              {engagement.targetDate && (
                <p className="text-sm text-on-surface-muted">
                  Target completion:{" "}
                  <span className="font-medium text-on-surface">
                    {formatDate(engagement.targetDate)}
                  </span>
                </p>
              )}

              {/* Stage tracker */}
              <StageProgressTracker currentStage={engagement.stage} />

              {/* Progress Updates — prominent, always visible */}
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
                  <div className="rounded-xl border border-dashed border-divider bg-surface p-5 flex items-center gap-3">
                    <Clock
                      size={18}
                      className="text-on-surface-muted shrink-0"
                    />
                    <p className="text-sm text-on-surface-muted">
                      No updates yet — your PM will post progress notes here as
                      your search advances.
                    </p>
                  </div>
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

              {/* Agreement banner */}
              {engagement.agreement ? (
                <div
                  className={`rounded-2xl border-2 p-5 flex flex-col sm:flex-row sm:items-center gap-4 ${
                    engagement.agreement.status === "SIGNED"
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-navy/30 bg-(--color-navy-light)"
                  }`}
                >
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                      engagement.agreement.status === "SIGNED"
                        ? "bg-emerald-100"
                        : "bg-navy/10"
                    }`}
                  >
                    {engagement.agreement.status === "SIGNED" ? (
                      <CheckCircle2 size={22} className="text-emerald-600" />
                    ) : (
                      <FileSignature
                        size={22}
                        className="text-(--color-navy)"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-semibold ${
                        engagement.agreement.status === "SIGNED"
                          ? "text-emerald-800"
                          : "text-(--color-navy)"
                      }`}
                    >
                      {engagement.agreement.status === "SIGNED"
                        ? "Service Agreement Signed"
                        : "Service Agreement Awaiting Your Signature"}
                    </p>
                    <p
                      className={`text-xs mt-0.5 ${
                        engagement.agreement.status === "SIGNED"
                          ? "text-emerald-700"
                          : "text-on-surface-muted"
                      }`}
                    >
                      {engagement.agreement.status === "SIGNED"
                        ? `Signed by "${engagement.agreement.signerName}" on ${formatDate(engagement.agreement.signedAt)}`
                        : "Please review and sign your service agreement to proceed with your engagement."}
                    </p>
                  </div>
                  <AgreementDialog
                    engagementId={engagement.id}
                    agreement={{
                      id: engagement.agreement.id,
                      status: engagement.agreement.status,
                      signedAt: engagement.agreement.signedAt ?? null,
                      signerName: engagement.agreement.signerName ?? null,
                      signatureImageUrl:
                        engagement.agreement.signatureImageUrl ?? null,
                      serviceTier: engagement.agreement.serviceTier ?? null,
                      scopeDescription: engagement.agreement.scopeDescription,
                      timeline: engagement.agreement.timeline ?? null,
                      deliverables: engagement.agreement.deliverables,
                      feeAmount: engagement.agreement.feeAmount,
                      currency: engagement.agreement.currency,
                      terms: engagement.agreement.terms,
                      createdAt: engagement.agreement.createdAt,
                    }}
                  />
                </div>
              ) : (
                <div className="rounded-2xl border-2 border-dashed border-divider bg-surface p-5 flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-surface-muted">
                    <Clock size={22} className="text-on-surface-muted" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-on-surface">
                      Agreement Not Yet Prepared
                    </p>
                    <p className="text-xs text-on-surface-muted mt-0.5">
                      Your service agreement will appear here once your project
                      manager has prepared it.
                    </p>
                  </div>
                </div>
              )}

              {/* Milestone cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Invoices */}
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                      <Receipt size={16} className="text-(--color-navy)" />
                      Payments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {engagement.invoices.length === 0 ? (
                      <p className="text-sm text-on-surface-muted italic">
                        No invoices yet
                      </p>
                    ) : (
                      <div className="space-y-1.5">
                        {pendingInvoices.length > 0 && (
                          <Badge variant="crimson">
                            {pendingInvoices.length} invoice
                            {pendingInvoices.length > 1 ? "s" : ""} due
                          </Badge>
                        )}
                        {paidInvoices.length > 0 && (
                          <Badge variant="default">
                            {paidInvoices.length} paid
                          </Badge>
                        )}
                        <Link
                          href="/client-portal/payments"
                          className="block text-xs text-(--color-navy) underline underline-offset-4 mt-2"
                        >
                          View payments →
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Meeting */}
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                      <CalendarCheck
                        size={16}
                        className="text-(--color-navy)"
                      />
                      Next Meeting
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      const upcomingMeeting = engagement.strategyMeetings
                        .filter((m) => m.status !== "CANCELLED")
                        .sort(
                          (a, b) =>
                            new Date(a.scheduledAt).getTime() -
                            new Date(b.scheduledAt).getTime(),
                        )[0];
                      return upcomingMeeting ? (
                        <div className="space-y-1.5">
                          <p className="text-sm font-medium text-on-surface">
                            {upcomingMeeting.title ?? "Strategy Meeting"}
                          </p>
                          <p className="text-xs text-on-surface-muted">
                            {formatDate(upcomingMeeting.scheduledAt)}
                          </p>
                          {upcomingMeeting.meetingLink && (
                            <a
                              href={upcomingMeeting.meetingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block text-xs text-(--color-navy) underline underline-offset-4 mt-1"
                            >
                              Join meeting →
                            </a>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-on-surface-muted italic">
                          No meetings scheduled
                        </p>
                      );
                    })()}
                  </CardContent>
                </Card>
              </div>

              {/* PM contact */}
              {pm && (
                <Card>
                  <CardContent className="pt-5 flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-(--color-navy) text-sm font-bold uppercase text-white">
                      {pm.fullName?.charAt(0) ?? "PM"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-on-surface">
                        {pm.fullName ?? pm.email}
                      </p>
                      <p className="text-xs text-on-surface-muted">
                        Your Property Manager
                      </p>
                      {pm.email && (
                        <a
                          href={`mailto:${pm.email}`}
                          className="text-xs text-(--color-navy) underline underline-offset-4"
                        >
                          {pm.email}
                        </a>
                      )}
                    </div>
                    <Link
                      href="/client-portal/messages"
                      className="shrink-0 inline-flex items-center gap-1.5 rounded-xl border border-divider px-4 py-2 text-xs font-semibold text-on-surface hover:bg-surface-muted transition-colors"
                    >
                      <MessageSquare size={13} />
                      Message
                    </Link>
                  </CardContent>
                </Card>
              )}

              {/* Documents */}
              <section className="space-y-3">
                <h2 className="text-sm font-semibold text-on-surface flex items-center gap-2">
                  <FileText size={16} className="text-(--color-navy)" />
                  Documents
                </h2>
                {engagement.documents.length === 0 ? (
                  <p className="text-sm text-on-surface-muted italic">
                    No documents shared yet.
                  </p>
                ) : (
                  <div className="divide-y divide-divider rounded-xl border border-divider overflow-hidden">
                    {engagement.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between gap-3 px-4 py-3 bg-surface"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-muted">
                            <FileText
                              size={15}
                              className="text-on-surface-muted"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-on-surface truncate">
                              {doc.title || doc.name}
                            </p>
                            <p className="text-xs text-on-surface-muted">
                              {doc.category ?? "General"} ·{" "}
                              {formatDate(doc.uploadedAt)}
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
            </section>
          );
        })}

      {/* Past engagements */}
      {pastEngagements.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-on-surface-muted uppercase tracking-wide">
            Past Engagements
          </h2>
          <div className="space-y-2">
            {pastEngagements.map((e) => (
              <Link
                key={e.id}
                href={`/client-portal/engagement/${e.id}`}
                className="flex items-center justify-between rounded-xl border border-divider bg-surface px-4 py-3 hover:bg-surface-muted transition-colors group"
              >
                <div>
                  <p className="text-sm font-medium text-on-surface">
                    {e.serviceTier ?? "Engagement"}
                  </p>
                  <p className="text-xs text-on-surface-muted">
                    {formatDate(e.startDate)} —{" "}
                    {e.targetDate ? formatDate(e.targetDate) : "closed"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="capitalize">
                    {e.status.replace(/_/g, " ")}
                  </Badge>
                  <ArrowRight
                    size={14}
                    className="text-on-surface-muted transition-opacity"
                  />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-3">
        {[
          {
            href: "/client-portal/messages",
            icon: MessageSquare,
            label: "Messages",
          },
          {
            href: "/client-portal/payments",
            icon: Receipt,
            label: "Payments",
          },
        ].map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 rounded-xl border border-divider bg-surface px-4 py-3.5 text-sm font-medium text-on-surface hover:bg-surface-muted transition-colors"
          >
            <Icon size={16} className="text-on-surface-muted" />
            {label}
            <ArrowRight size={14} className="ml-auto text-on-surface-muted" />
          </Link>
        ))}
      </div>
    </div>
  );
}
