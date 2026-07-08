import { redirect } from "next/navigation";
import Link from "next/link";
import { requireClient } from "@/app/actions/auth";
import {
  getEngagementById,
  getProjectProgress,
} from "@/app/actions/engagements";
import { getEngagementTasks } from "@/app/actions/tasks";
import { getEngagementUpdates } from "@/app/actions/updates";
import { getEngagementMessageThread } from "@/app/actions/admin";
import {
  getEngagementDocuments,
  getDocumentSignedUrl,
} from "@/app/actions/storage";
import { getInvoices } from "@/app/actions/invoices";
import { getEngagementPayments } from "@/app/actions/payments";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  TrendingUp,
  CheckSquare,
  XCircle,
  FileUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  Circle,
  User,
  ClipboardList,
  Bell,
  MessageSquare,
  FileText,
  CreditCard,
  Download,
} from "lucide-react";
import SubmitTaskDialog from "@/components/portal/client/SubmitTaskDialog";
import MessageThread from "@/components/portal/client/MessageThread";
import ClientDocumentViewer from "@/components/portal/client/ClientDocumentViewer";
import ClientUploadDocumentDialog from "@/components/portal/client/ClientUploadDocumentDialog";
import ClientInvoiceDialog from "@/components/portal/client/ClientInvoiceDialog";
import PayNowButton from "@/components/portal/client/PayNowButton";
import EngagementTabNav, {
  type EngagementTab,
} from "@/components/portal/engagement/EngagementTabNav";
import EmptySection from "@/components/portal/engagement/EmptySection";
import {
  formatDate,
  formatDateTime,
  formatCurrency,
  INVOICE_STATUS_STYLES,
  PAYMENT_STATUS_STYLES,
} from "@/components/portal/engagement/helpers";

export const metadata = { title: "My Project — Terralume Client Portal" };

const VALID_TABS = [
  "overview",
  "tasks",
  "updates",
  "messages",
  "documents",
  "billing",
] as const;

type TabId = (typeof VALID_TABS)[number];

function getStageIcon(status: string) {
  switch (status) {
    case "COMPLETED":
      return <CheckCircle2 size={16} className="text-emerald-600" />;
    case "IN_PROGRESS":
      return <Clock size={16} className="text-blue-600" />;
    case "BLOCKED":
      return <AlertCircle size={16} className="text-red-600" />;
    default:
      return <Circle size={16} className="text-zinc-300" />;
  }
}

type SenderInfo = {
  id: string;
  fullName: string | null;
  preferredName: string | null;
  photoUrl: string | null;
  role: string;
};

function getTaskStatusColor(status: string) {
  switch (status) {
    case "APPROVED":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    case "SUBMITTED":
      return "bg-blue-50 text-blue-700 ring-blue-200";
    case "IN_PROGRESS":
      return "bg-amber-50 text-amber-700 ring-amber-200";
    case "REJECTED":
      return "bg-red-50 text-red-700 ring-red-200";
    default:
      return "bg-zinc-100 text-zinc-600 ring-zinc-200";
  }
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case "URGENT":
      return "bg-red-50 text-red-700 ring-red-200";
    case "HIGH":
      return "bg-orange-50 text-orange-700 ring-orange-200";
    case "MEDIUM":
      return "bg-blue-50 text-blue-700 ring-blue-200";
    default:
      return "bg-zinc-100 text-zinc-600 ring-zinc-200";
  }
}

export default async function ClientEngagementDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const user = await requireClient().catch(() => null);
  if (!user) redirect("/login");

  const { id } = await params;
  const { tab: rawTab } = await searchParams;
  const tab: TabId = VALID_TABS.includes(rawTab as TabId)
    ? (rawTab as TabId)
    : "overview";

  const engagement = await getEngagementById(id);
  if (!engagement) {
    return (
      <div className="px-6 py-8 max-w-4xl mx-auto">
        <div className="text-center py-12">
          <h1 className="font-display text-2xl font-bold text-on-surface mb-3">
            Project not found
          </h1>
          <p className="text-on-surface-muted mb-6">
            This project doesn&apos;t exist or you don&apos;t have access to it.
          </p>
          <Link
            href="/client-portal/engagement"
            className="text-navy hover:underline font-medium"
          >
            ← Back to engagements
          </Link>
        </div>
      </div>
    );
  }

  const [
    progress,
    tasks,
    updates,
    messageThread,
    documents,
    invoices,
    payments,
  ] = await Promise.all([
    getProjectProgress(engagement.id),
    getEngagementTasks(engagement.id),
    getEngagementUpdates(engagement.id).catch(() => []),
    getEngagementMessageThread(engagement.id).catch(() => ({
      messages: [],
      engagementId: engagement.id,
      pmInfo: engagement.pm,
      clientInfo: {
        id: user.id,
        fullName: user.fullName,
        preferredName: user.preferredName,
        photoUrl: user.photoUrl,
        role: user.role,
      },
      canSend: true,
    })),
    getEngagementDocuments(engagement.id).catch(() => []),
    getInvoices(engagement.id).catch(() => []),
    getEngagementPayments(engagement.id).catch(() => []),
  ]);

  const documentsWithUrls = await Promise.all(
    documents.map(async (doc) => {
      const result = await getDocumentSignedUrl(doc.filePath);
      return { ...doc, signedUrl: result.ok ? result.url : null };
    }),
  );

  const clientInvoices = invoices.filter((inv) => inv.status !== "DRAFT");
  const unpaidInvoices = clientInvoices.filter((inv) => inv.status === "SENT");

  const currentStage = engagement.projectStages.find(
    (s) => s.status === "IN_PROGRESS",
  );
  const completedStages = engagement.projectStages.filter(
    (s) => s.status === "COMPLETED",
  ).length;
  const pendingTasks = tasks.filter((t) => t.status === "PENDING");
  const submittedTasks = tasks.filter((t) => t.status === "SUBMITTED");
  const approvedTasks = tasks.filter(
    (t) => t.submission?.approvalStatus === "APPROVED",
  );
  const pm = engagement.pm;
  const basePath = `/client-portal/engagement/${id}`;

  const tabs: EngagementTab[] = [
    { id: "overview", label: "Overview", icon: "overview" },
    {
      id: "tasks",
      label: "Tasks",
      icon: "tasks",
      badge: pendingTasks.length,
    },
    { id: "updates", label: "Updates", icon: "updates", badge: updates.length },
    {
      id: "messages",
      label: "Messages",
      icon: "messages",
      badge: messageThread.messages.length,
    },
    {
      id: "documents",
      label: "Documents",
      icon: "documents",
      badge: documentsWithUrls.length,
    },
    {
      id: "billing",
      label: "Invoices",
      icon: "billing",
      badge: unpaidInvoices.length,
    },
  ];

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto space-y-6">
      <Link
        href="/client-portal/engagement"
        className="flex items-center gap-1.5 text-sm text-on-surface-muted hover:text-on-surface transition-colors w-fit"
      >
        <ArrowLeft size={16} />
        Back to engagements
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold mb-1">
            My Project
          </p>
          <h1 className="font-display text-2xl font-bold text-on-surface">
            {engagement.service?.name ?? "Project"}
          </h1>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <Badge variant="outline" className="text-xs">
              {engagement.workflowTemplate?.name ?? "—"}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {engagement.status}
            </Badge>
            <span className="text-xs text-on-surface-muted">
              Started {formatDate(engagement.createdAt)}
            </span>
          </div>
        </div>

        {pm && (
          <Card className="w-full lg:w-auto lg:min-w-72 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy/10 text-sm font-bold text-navy uppercase">
                  {pm.fullName?.charAt(0) ?? "PM"}
                </div>
                <div>
                  <p className="text-xs text-on-surface-muted flex items-center gap-1">
                    <User size={12} />
                    Your Project Manager
                  </p>
                  <p className="font-semibold text-sm text-on-surface">
                    {pm.preferredName || pm.fullName}
                  </p>
                  <p className="text-xs text-on-surface-muted">{pm.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Progress",
            value: `${progress.percentage}%`,
            sub: `${completedStages}/${engagement.projectStages.length} stages`,
          },
          {
            label: "Tasks due",
            value: String(pendingTasks.length),
            sub: "Action needed",
          },
          {
            label: "Updates",
            value: String(updates.length),
            sub: "From your PM",
          },
          {
            label: "Unpaid",
            value: String(unpaidInvoices.length),
            sub: "Invoices",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-divider bg-surface px-4 py-3 shadow-sm"
          >
            <p className="text-xs text-on-surface-muted">{stat.label}</p>
            <p className="text-xl font-bold text-on-surface">{stat.value}</p>
            <p className="text-[11px] text-on-surface-muted">{stat.sub}</p>
          </div>
        ))}
      </div>

      <EngagementTabNav basePath={basePath} activeTab={tab} tabs={tabs} />

      {/* ── OVERVIEW ── */}
      {tab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp size={18} className="text-navy" />
                  Project Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-on-surface-muted">
                      {completedStages} of {engagement.projectStages.length}{" "}
                      stages completed
                    </span>
                    <span className="font-semibold text-on-surface">
                      {progress.percentage}%
                    </span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-zinc-200 overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-navy to-blue-600 transition-all duration-500"
                      style={{ width: `${progress.percentage}%` }}
                    />
                  </div>
                </div>

                {currentStage && (
                  <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock size={18} className="text-blue-600" />
                      <span className="text-sm font-semibold text-on-surface">
                        Current Stage
                      </span>
                    </div>
                    <h3 className="font-semibold text-on-surface mb-1">
                      {currentStage.workflowStage.name}
                    </h3>
                    {currentStage.workflowStage.description && (
                      <p className="text-sm text-on-surface-muted">
                        {currentStage.workflowStage.description}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {updates[0] && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base">Latest Update</CardTitle>
                  <Link
                    href={`${basePath}?tab=updates`}
                    className="text-xs text-navy hover:underline"
                  >
                    View all →
                  </Link>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-on-surface-muted mb-2">
                    {formatDateTime(updates[0].publishedAt)} ·{" "}
                    {updates[0].pm.preferredName || updates[0].pm.fullName}
                  </p>
                  <p className="text-sm text-on-surface leading-relaxed">
                    {updates[0].content}
                  </p>
                  {updates[0].nextSteps && (
                    <div className="mt-3 rounded-lg bg-navy/5 border border-navy/10 p-3">
                      <p className="text-xs font-semibold text-navy mb-1">
                        Next steps
                      </p>
                      <p className="text-sm text-on-surface whitespace-pre-line">
                        {updates[0].nextSteps}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Workflow Stages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {engagement.projectStages.map((stage, idx) => (
                  <div
                    key={stage.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-alt/50 transition-colors"
                  >
                    <span className="text-xs text-on-surface-muted font-medium w-6">
                      {idx + 1}
                    </span>
                    {getStageIcon(stage.status)}
                    <span className="text-sm text-on-surface flex-1">
                      {stage.workflowStage.name}
                    </span>
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        stage.status === "COMPLETED"
                          ? "bg-emerald-50 text-emerald-700"
                          : stage.status === "IN_PROGRESS"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-zinc-100 text-zinc-600"
                      }`}
                    >
                      {stage.status.replace("_", " ")}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── TASKS ── */}
      {tab === "tasks" && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-base">My Tasks</CardTitle>
              <div className="flex items-center gap-2">
                {pendingTasks.length > 0 && (
                  <Badge className="bg-amber-100 text-amber-700">
                    {pendingTasks.length} action needed
                  </Badge>
                )}
                {submittedTasks.length > 0 && (
                  <Badge className="bg-blue-100 text-blue-700">
                    {submittedTasks.length} under review
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                {
                  count: pendingTasks.length,
                  label: "Action Needed",
                  className: "bg-amber-50 border-amber-200 text-amber-700",
                },
                {
                  count: submittedTasks.length,
                  label: "Under Review",
                  className: "bg-blue-50 border-blue-200 text-blue-700",
                },
                {
                  count: approvedTasks.length,
                  label: "Approved",
                  className:
                    "bg-emerald-50 border-emerald-200 text-emerald-700",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`text-center p-3 rounded-lg border ${item.className}`}
                >
                  <p className="text-xl font-bold">{item.count}</p>
                  <p className="text-xs opacity-80">{item.label}</p>
                </div>
              ))}
            </div>

            {tasks.length === 0 ? (
              <EmptySection
                icon={ClipboardList}
                title="No tasks yet"
                description="Your project manager will assign tasks when they're ready for your input."
              />
            ) : (
              <div className="space-y-3">
                {tasks.map((task) => {
                  const isOverdue =
                    task.dueDate &&
                    task.status === "PENDING" &&
                    new Date(task.dueDate) < new Date();

                  return (
                    <div
                      key={task.id}
                      className={`border rounded-lg p-4 transition-colors ${
                        isOverdue
                          ? "border-red-200 bg-red-50/30"
                          : "border-divider hover:bg-surface-alt/50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-on-surface text-sm">
                            {task.title}
                          </h4>
                          {task.description && (
                            <p className="text-xs text-on-surface-muted mt-1">
                              {task.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={`text-xs ${getPriorityColor(task.priority)}`}
                          >
                            {task.priority}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={`text-xs ${getTaskStatusColor(task.status)}`}
                          >
                            {task.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        {task.dueDate && (
                          <span
                            className={`text-xs ${
                              isOverdue
                                ? "text-red-600 font-medium"
                                : "text-on-surface-muted"
                            }`}
                          >
                            Due: {formatDate(task.dueDate)}
                            {isOverdue && " (Overdue)"}
                          </span>
                        )}
                        {task.status === "PENDING" && (
                          <SubmitTaskDialog task={task} />
                        )}
                      </div>

                      {task.submission && (
                        <div className="mt-3 pt-3 border-t border-divider">
                          <div className="flex items-start gap-2 mb-2">
                            <FileUp
                              size={14}
                              className="text-on-surface-muted mt-0.5"
                            />
                            <div className="flex-1">
                              <p className="text-xs font-medium text-on-surface">
                                Your Response
                              </p>
                              <p className="text-xs text-on-surface-muted mt-1">
                                {task.submission.responseText ||
                                  "No response text"}
                              </p>
                              <p className="text-xs text-on-surface-muted mt-1">
                                Submitted:{" "}
                                {formatDateTime(task.submission.submittedAt)}
                              </p>
                            </div>
                          </div>
                          {task.submission.approvalStatus && (
                            <div
                              className={`mt-2 rounded-lg p-2 flex items-start gap-2 ${
                                task.submission.approvalStatus === "APPROVED"
                                  ? "bg-emerald-50 border border-emerald-200"
                                  : "bg-red-50 border border-red-200"
                              }`}
                            >
                              {task.submission.approvalStatus === "APPROVED" ? (
                                <CheckSquare
                                  size={14}
                                  className="text-emerald-600 mt-0.5"
                                />
                              ) : (
                                <XCircle
                                  size={14}
                                  className="text-red-600 mt-0.5"
                                />
                              )}
                              <div className="flex-1">
                                <p
                                  className={`text-xs font-semibold ${
                                    task.submission.approvalStatus ===
                                    "APPROVED"
                                      ? "text-emerald-700"
                                      : "text-red-700"
                                  }`}
                                >
                                  {task.submission.approvalStatus}
                                </p>
                                {task.submission.feedback && (
                                  <p className="text-xs text-on-surface-muted mt-1">
                                    {task.submission.feedback}
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── UPDATES ── */}
      {tab === "updates" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Bell size={18} className="text-navy" />
              Project Updates
            </CardTitle>
          </CardHeader>
          <CardContent>
            {updates.length === 0 ? (
              <EmptySection
                icon={Bell}
                title="No updates yet"
                description="Your project manager will post updates as your project progresses."
              />
            ) : (
              <div className="space-y-4">
                {updates.map((update) => (
                  <div
                    key={update.id}
                    className="rounded-xl border border-divider p-4 hover:bg-surface-alt/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy/10 text-xs font-bold text-navy uppercase">
                          {(
                            update.pm.preferredName ||
                            update.pm.fullName ||
                            "PM"
                          ).charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-on-surface">
                            {update.pm.preferredName || update.pm.fullName}
                          </p>
                          <p className="text-xs text-on-surface-muted">
                            {formatDateTime(update.publishedAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-on-surface leading-relaxed whitespace-pre-line">
                      {update.content}
                    </p>
                    {update.nextSteps && (
                      <div className="mt-3 rounded-lg bg-navy/5 border border-navy/10 p-3">
                        <p className="text-xs font-semibold text-navy mb-1">
                          Next steps
                        </p>
                        <p className="text-sm text-on-surface whitespace-pre-line">
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
      )}

      {/* ── MESSAGES ── */}
      {tab === "messages" && (
        <Card className="overflow-hidden">
          <CardHeader className="border-b border-divider">
            <CardTitle className="text-base flex items-center gap-2">
              <MessageSquare size={18} className="text-navy" />
              Messages
            </CardTitle>
            <p className="text-sm text-on-surface-muted">
              Chat directly with your project manager about this engagement.
            </p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="min-h-[520px] flex flex-col">
              <MessageThread
                initialMessages={messageThread.messages}
                engagementId={messageThread.engagementId}
                currentUserId={user.id}
                pmInfo={
                  {
                    id: engagement.pm?.id ?? "",
                    fullName: engagement.pm?.fullName ?? "",
                    preferredName: engagement.pm?.preferredName ?? "",
                    photoUrl: engagement.pm?.photoUrl ?? "",
                    role: "PM",
                  } as SenderInfo
                }
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── DOCUMENTS ── */}
      {tab === "documents" && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText size={18} className="text-navy" />
              Documents
            </CardTitle>
            <ClientUploadDocumentDialog engagementId={engagement.id} />
          </CardHeader>
          <CardContent>
            {documentsWithUrls.length === 0 ? (
              <EmptySection
                icon={FileText}
                title="No documents yet"
                description="Documents shared by your PM will appear here. You can also upload your own files."
              />
            ) : (
              <div className="space-y-2">
                {documentsWithUrls.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between gap-3 p-3 rounded-xl border border-divider hover:bg-surface-alt/50 transition-colors"
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-navy/10 text-navy">
                        <FileText size={16} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-on-surface truncate">
                          {doc.title || doc.name}
                        </p>
                        {doc.category && (
                          <p className="text-xs text-on-surface-muted">
                            {doc.category}
                          </p>
                        )}
                        <p className="text-xs text-on-surface-muted mt-0.5">
                          Uploaded {formatDate(doc.uploadedAt)}
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
                          className="inline-flex items-center gap-1 rounded-lg border border-divider px-3 py-1.5 text-xs font-medium text-on-surface hover:bg-surface-muted transition-colors"
                        >
                          <Download size={12} />
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── BILLING ── */}
      {tab === "billing" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CreditCard size={18} className="text-navy" />
                Invoices
              </CardTitle>
            </CardHeader>
            <CardContent>
              {clientInvoices.length === 0 ? (
                <EmptySection
                  icon={CreditCard}
                  title="No invoices yet"
                  description="Invoices will appear here once your PM issues them."
                />
              ) : (
                <div className="space-y-3">
                  {clientInvoices.map((invoice) => (
                    <div
                      key={invoice.id}
                      className="rounded-xl border border-divider p-4 hover:bg-surface-alt/30 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <p className="text-sm font-semibold text-on-surface">
                              {invoice.invoiceNumber}
                            </p>
                            <Badge
                              variant="outline"
                              className={`text-xs ${INVOICE_STATUS_STYLES[invoice.status] ?? INVOICE_STATUS_STYLES.DRAFT}`}
                            >
                              {invoice.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-on-surface-muted">
                            {invoice.description}
                          </p>
                          <p className="text-base font-semibold text-on-surface mt-1">
                            {formatCurrency(
                              invoice.amount,
                              invoice.currency ?? "NGN",
                            )}
                          </p>
                          {invoice.dueDate && invoice.status === "SENT" && (
                            <p className="text-xs text-on-surface-muted mt-1">
                              Due {formatDate(invoice.dueDate)}
                            </p>
                          )}
                          {invoice.paidAt && (
                            <p className="text-xs text-emerald-600 mt-1">
                              Paid {formatDate(invoice.paidAt)}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <ClientInvoiceDialog
                            invoice={invoice}
                            engagementId={engagement.id}
                          />
                          {invoice.status === "SENT" && (
                            <PayNowButton
                              engagementId={engagement.id}
                              invoiceId={invoice.id}
                              amount={invoice.amount}
                              currency={invoice.currency ?? "NGN"}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              {payments.length === 0 ? (
                <EmptySection
                  icon={CreditCard}
                  title="No payments yet"
                  description="Successful payments for this project will be listed here."
                />
              ) : (
                <div className="space-y-2">
                  {payments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between rounded-xl border border-divider p-3"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge
                            variant="outline"
                            className={`text-xs ${PAYMENT_STATUS_STYLES[payment.status] ?? PAYMENT_STATUS_STYLES.PENDING}`}
                          >
                            {payment.status}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {payment.type}
                          </Badge>
                        </div>
                        <p className="text-sm font-semibold text-on-surface">
                          {formatCurrency(
                            payment.amount,
                            payment.currency ?? "NGN",
                          )}
                        </p>
                        <p className="text-xs text-on-surface-muted">
                          {payment.paidAt
                            ? `Paid ${formatDate(payment.paidAt)}`
                            : `Created ${formatDate(payment.createdAt)}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
