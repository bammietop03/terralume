import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/app/actions/auth";
import { prisma } from "@/lib/prisma";
import {
  getEngagementById,
  getAllProjectStages,
  getProjectProgress,
} from "@/app/actions/engagements";
import { getEngagementTasks } from "@/app/actions/tasks";
import { getEngagementTimeline } from "@/app/actions/timeline";
import {
  getEngagementDocuments,
  getDocumentSignedUrl,
} from "@/app/actions/storage";
import {
  getAdminEngagementMessages,
  getEngagementMessageThread,
} from "@/app/actions/admin";
import { getEngagementPayments } from "@/app/actions/payments";
import { getInvoices } from "@/app/actions/invoices";
import { getEngagementUpdates } from "@/app/actions/updates";
import { getInternalNotes } from "@/app/actions/timeline";
import {
  ArrowLeft,
  User,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  CheckSquare,
  XCircle,
  AlertTriangle,
  FileText,
  MessageSquare,
  CreditCard,
  Download,
  ClipboardList,
  Bell,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AdvanceStageButton from "@/components/portal/admin/AdvanceStageButton";
import AssignPmToEngagementButton from "@/components/portal/admin/AssignPmToEngagementButton";
import CreateTaskDialog from "@/components/portal/admin/CreateTaskDialog";
import TaskReviewDialog from "@/components/portal/admin/TaskReviewDialog";
import UploadDocumentDialog from "@/components/portal/admin/UploadDocumentDialog";
import CreateUpdateDialog from "@/components/portal/admin/CreateUpdateDialog";
import RecordPaymentDialog from "@/components/portal/admin/RecordPaymentDialog";
import CreateInvoiceDialog from "@/components/portal/admin/CreateInvoiceDialog";
import SendInvoiceButton from "@/components/portal/admin/SendInvoiceButton";
import ViewClientsDialog from "@/components/portal/admin/ViewClientsDialog";
import InternalNotesPanel from "@/components/portal/admin/InternalNotesPanel";
import ClientDocumentViewer from "@/components/portal/client/ClientDocumentViewer";
import AdminMessageThread from "@/components/portal/admin/AdminMessageThread";
import UpdateStatusForm from "@/components/portal/admin/UpdateStatusForm";
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

export const metadata = { title: "Project Details — Terralume Admin Portal" };

const VALID_TABS = [
  "overview",
  "tasks",
  "updates",
  "messages",
  "documents",
  "billing",
  "notes",
] as const;

type TabId = (typeof VALID_TABS)[number];

function getStageStatusIcon(status: string) {
  switch (status) {
    case "COMPLETED":
      return <CheckCircle2 size={18} className="text-emerald-600" />;
    case "IN_PROGRESS":
      return <Clock size={18} className="text-blue-600" />;
    case "BLOCKED":
      return <AlertCircle size={18} className="text-red-600" />;
    default:
      return <Circle size={18} className="text-zinc-300" />;
  }
}

function getStageStatusColor(status: string) {
  switch (status) {
    case "COMPLETED":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    case "IN_PROGRESS":
      return "bg-blue-50 text-blue-700 ring-blue-200";
    case "BLOCKED":
      return "bg-red-50 text-red-700 ring-red-200";
    default:
      return "bg-zinc-100 text-zinc-600 ring-zinc-200";
  }
}

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

export default async function EngagementDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { id } = await params;
  const { tab: rawTab } = await searchParams;
  const tab: TabId = VALID_TABS.includes(rawTab as TabId)
    ? (rawTab as TabId)
    : "overview";

  const user = await requireAdmin().catch(() => redirect("/admin-login"));

  const [
    engagement,
    stages,
    progress,
    tasks,
    timeline,
    documents,
    updates,
    messages,
    payments,
    invoices,
    internalNotes,
  ] = await Promise.all([
    getEngagementById(id),
    getAllProjectStages(id),
    getProjectProgress(id),
    getEngagementTasks(id),
    getEngagementTimeline(id, 20),
    getEngagementDocuments(id).catch(() => []),
    getEngagementUpdates(id),
    getEngagementMessageThread(id).catch(() => null),
    getEngagementPayments(id).catch(() => []),
    getInvoices(id).catch(() => []),
    getInternalNotes(id).catch(() => []),
  ]);

  if (!engagement) notFound();

  const documentsWithUrls = await Promise.all(
    documents.map(async (doc) => {
      const result = await getDocumentSignedUrl(doc.filePath);
      return { ...doc, signedUrl: result.ok ? result.url : null };
    }),
  );

  const client = engagement.user;
  const clientName =
    client.preferredName || client.fullName || "Unknown Client";
  const currentStage = stages.find((s) => s.status === "IN_PROGRESS");
  const completedStages = stages.filter((s) => s.status === "COMPLETED").length;
  const pendingTasks = tasks.filter((t) => t.status === "PENDING").length;
  const submittedTasks = tasks.filter((t) => t.status === "SUBMITTED").length;
  const approvedTasks = tasks.filter(
    (t) => t.submission?.approvalStatus === "APPROVED",
  ).length;
  const unpaidInvoices = invoices.filter((inv) => inv.status === "SENT");

  const dialogClients = await prisma.user.findMany({
    where:
      user.role === "PM"
        ? { role: "CLIENT", assignedPmId: user.id }
        : engagement.pmId
          ? { role: "CLIENT", assignedPmId: engagement.pmId }
          : { id: engagement.userId },
    select: {
      id: true,
      fullName: true,
      preferredName: true,
      email: true,
      phone: true,
      _count: {
        select: {
          engagements: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const clientsForDialog = dialogClients.map((entry) => ({
    id: entry.id,
    name: entry.preferredName || entry.fullName || "Client",
    email: entry.email,
    phone: entry.phone,
    engagementCount: entry._count.engagements,
    isCurrentEngagementClient: entry.id === engagement.userId,
  }));

  const basePath = `/admin-portal/engagements/${id}`;

  const tabs: EngagementTab[] = [
    { id: "overview", label: "Overview", icon: "overview" },
    {
      id: "tasks",
      label: "Tasks",
      icon: "tasks",
      badge: submittedTasks,
    },
    { id: "updates", label: "Updates", icon: "updates", badge: updates.length },
    {
      id: "messages",
      label: "Messages",
      icon: "messages",
      badge: messages?.messages.length ?? 0,
    },
    {
      id: "documents",
      label: "Documents",
      icon: "documents",
      badge: documentsWithUrls.length,
    },
    {
      id: "billing",
      label: "Billing",
      icon: "billing",
      badge: unpaidInvoices.length,
    },
    {
      id: "notes",
      label: "Notes",
      icon: "notes",
      badge: internalNotes.length,
    },
  ];

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto space-y-6">
      <Link
        href="/admin-portal/engagements"
        className="flex items-center gap-1.5 text-sm text-on-surface-muted hover:text-on-surface transition-colors w-fit"
      >
        <ArrowLeft size={16} />
        Back to engagements
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-navy/10 text-lg font-bold text-navy uppercase">
            {clientName.charAt(0)}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-muted mb-1">
              Engagement
            </p>
            <h1 className="font-display text-2xl font-bold text-on-surface">
              {clientName}
            </h1>
            <p className="text-sm text-on-surface-muted mt-0.5">
              {client.email}
              {client.phone && (
                <>
                  <span className="mx-1.5">·</span>
                  {client.phone}
                </>
              )}
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                {engagement.service?.name ?? "Unknown Service"}
              </Badge>
              <Badge
                variant="outline"
                className={`text-xs ${getStageStatusColor(engagement.status)}`}
              >
                {engagement.status}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <ViewClientsDialog clients={clientsForDialog} />
          {engagement.pm ? (
            <div className="flex items-center gap-2 rounded-xl border border-divider bg-surface px-3 py-2">
              <User size={14} className="text-on-surface-muted" />
              <span className="text-sm font-medium text-on-surface">
                PM: {engagement.pm.preferredName || engagement.pm.fullName}
              </span>
            </div>
          ) : (
            <span className="text-sm text-on-surface-muted italic">
              No PM assigned
            </span>
          )}
          {user.role === "ADMIN" && (
            <AssignPmToEngagementButton
              engagementId={engagement.id}
              currentPmId={engagement.pmId ?? undefined}
            />
          )}
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Progress",
            value: `${progress.percentage}%`,
            sub: `${completedStages}/${stages.length} stages`,
          },
          {
            label: "Awaiting review",
            value: String(submittedTasks),
            sub: "Submitted tasks",
          },
          {
            label: "Documents",
            value: String(documentsWithUrls.length),
            sub: "Uploaded files",
          },
          {
            label: "Outstanding",
            value: String(unpaidInvoices.length),
            sub: "Unpaid invoices",
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
                <CardTitle className="text-base">Project Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-on-surface-muted">
                      {completedStages} of {stages.length} stages completed
                    </span>
                    <span className="font-semibold text-on-surface">
                      {progress.percentage}%
                    </span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-zinc-200 overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-navy to-blue-600 transition-all duration-500"
                      style={{ width: `${progress.percentage}%` }}
                    />
                  </div>
                </div>

                {currentStage && (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-blue-200 bg-blue-50/50 p-4">
                    <div className="flex items-center gap-3">
                      <Clock size={20} className="text-blue-600 shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-on-surface">
                          Current Stage: {currentStage.workflowStage.name}
                        </p>
                        {currentStage.workflowStage.description && (
                          <p className="text-xs text-on-surface-muted mt-0.5">
                            {currentStage.workflowStage.description}
                          </p>
                        )}
                      </div>
                    </div>
                    {(user.role === "ADMIN" || user.role === "PM") && (
                      <AdvanceStageButton engagementId={engagement.id} />
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Workflow Stages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-0 relative">
                  <div className="absolute left-2.25 top-0 bottom-0 w-0.5 bg-divider" />
                  {stages.map((stage) => (
                    <div
                      key={stage.id}
                      className="relative pl-8 pb-6 last:pb-0"
                    >
                      <div className="absolute left-0 top-0 bg-surface">
                        {getStageStatusIcon(stage.status)}
                      </div>
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex-1">
                            <h3 className="font-semibold text-on-surface text-sm">
                              {stage.workflowStage.name}
                            </h3>
                            {stage.workflowStage.description && (
                              <p className="text-xs text-on-surface-muted mt-0.5">
                                {stage.workflowStage.description}
                              </p>
                            )}
                          </div>
                          <Badge
                            variant="outline"
                            className={`text-xs ${getStageStatusColor(stage.status)}`}
                          >
                            {stage.status.replace("_", " ")}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-on-surface-muted mt-2">
                          {stage.workflowStage.estimatedDays && (
                            <span>
                              Est. {stage.workflowStage.estimatedDays} days
                            </span>
                          )}
                          {stage.startedAt && (
                            <span>Started: {formatDate(stage.startedAt)}</span>
                          )}
                          {stage.completedAt && (
                            <span>
                              Completed: {formatDate(stage.completedAt)}
                            </span>
                          )}
                        </div>
                        {stage.notes && (
                          <div className="mt-2 rounded-lg bg-surface-alt border border-divider p-2">
                            <p className="text-xs text-on-surface">
                              {stage.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="text-on-surface-muted text-xs">Status</p>
                  <UpdateStatusForm
                    engagementId={engagement.id}
                    currentStatus={engagement.status}
                  />
                </div>
                <div>
                  <p className="text-on-surface-muted text-xs">Service</p>
                  <p className="font-medium text-on-surface">
                    {engagement.service?.name ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="text-on-surface-muted text-xs">Workflow</p>
                  <p className="font-medium text-on-surface">
                    {engagement.workflowTemplate?.name ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="text-on-surface-muted text-xs">Created</p>
                  <p className="font-medium text-on-surface">
                    {formatDate(engagement.createdAt)}
                  </p>
                </div>
                {engagement.intakeSubmission && (
                  <div className="pt-2 border-t border-divider">
                    <p className="text-on-surface-muted text-xs mb-1">
                      Intake Reference
                    </p>
                    <Link
                      href={`/admin-portal/intake/${engagement.intakeSubmissionId}`}
                      className="text-xs text-navy hover:underline font-medium"
                    >
                      {engagement.intakeSubmission.referenceNumber}
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {timeline.length === 0 ? (
                  <p className="text-xs text-on-surface-muted italic text-center py-4">
                    No activity yet
                  </p>
                ) : (
                  <div className="space-y-3">
                    {timeline.map((event) => (
                      <div
                        key={event.id}
                        className="text-xs border-l-2 border-divider pl-3 pb-2 last:pb-0"
                      >
                        <p className="font-medium text-on-surface">
                          {event.description}
                        </p>
                        <p className="text-on-surface-muted mt-0.5">
                          {event.actorName} · {formatDateTime(event.timestamp)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ── TASKS ── */}
      {tab === "tasks" && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Client Tasks</CardTitle>
            <CreateTaskDialog
              engagementId={engagement.id}
              clientId={client.id}
              clientName={clientName}
            />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { count: pendingTasks, label: "Pending" },
                { count: submittedTasks, label: "Awaiting Review" },
                { count: approvedTasks, label: "Approved" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="text-center p-3 rounded-lg bg-zinc-50 border border-divider"
                >
                  <p className="text-xl font-bold text-on-surface">
                    {item.count}
                  </p>
                  <p className="text-xs text-on-surface-muted">{item.label}</p>
                </div>
              ))}
            </div>

            {tasks.length === 0 ? (
              <EmptySection
                icon={ClipboardList}
                title="No tasks yet"
                description="Create a task to request information or documents from the client."
              />
            ) : (
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="border border-divider rounded-lg p-4 hover:bg-surface-alt/50 transition-colors"
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

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-on-surface-muted">
                        {task.dueDate && (
                          <span>Due: {formatDate(task.dueDate)}</span>
                        )}
                        <span>Created: {formatDate(task.createdAt)}</span>
                      </div>
                      {task.status === "SUBMITTED" && task.submission && (
                        <TaskReviewDialog
                          task={task}
                          submission={task.submission}
                        />
                      )}
                    </div>

                    {task.submission && (
                      <div className="mt-3 pt-3 border-t border-divider">
                        <p className="text-xs font-medium text-on-surface mb-1">
                          Client Response:
                        </p>
                        <p className="text-xs text-on-surface-muted">
                          {task.submission.responseText || "No response text"}
                        </p>
                        {task.submission.approvalStatus && (
                          <div className="mt-2 flex items-center gap-2">
                            {task.submission.approvalStatus === "APPROVED" ? (
                              <CheckSquare
                                size={14}
                                className="text-emerald-600"
                              />
                            ) : task.submission.approvalStatus ===
                              "REJECTED" ? (
                              <XCircle size={14} className="text-red-600" />
                            ) : (
                              <AlertTriangle
                                size={14}
                                className="text-amber-600"
                              />
                            )}
                            <span className="text-xs font-medium text-on-surface">
                              {task.submission.approvalStatus}
                            </span>
                            {task.submission.feedback && (
                              <span className="text-xs text-on-surface-muted">
                                — {task.submission.feedback}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── UPDATES ── */}
      {tab === "updates" && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Bell size={18} className="text-navy" />
              Project Updates
            </CardTitle>
            <CreateUpdateDialog engagementId={engagement.id} />
          </CardHeader>
          <CardContent>
            {updates.length === 0 ? (
              <EmptySection
                icon={Bell}
                title="No updates posted yet"
                description="Post an update to keep the client informed about project progress."
              />
            ) : (
              <div className="space-y-3">
                {updates.map((update) => (
                  <div
                    key={update.id}
                    className="p-4 rounded-xl border border-divider hover:bg-surface-alt/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="text-xs font-medium text-on-surface">
                        {update.pm.preferredName || update.pm.fullName}
                        {update.draft && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            Draft
                          </Badge>
                        )}
                      </p>
                      <p className="text-xs text-on-surface-muted">
                        {formatDateTime(update.publishedAt ?? "")}
                      </p>
                    </div>
                    <p className="text-sm text-on-surface whitespace-pre-line">
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
          <CardHeader className="flex flex-row items-center justify-between border-b border-divider">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare size={18} className="text-navy" />
                Messages
              </CardTitle>
              <p className="text-sm text-on-surface-muted mt-1">
                Conversation with {clientName}
              </p>
            </div>
            <Link href={`/admin-portal/messages/${engagement.id}`}>
              <Button size="sm" variant="outline">
                Open full thread
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {messages ? (
              <div className="min-h-130 flex flex-col">
                <AdminMessageThread
                  initialMessages={messages.messages}
                  engagementId={messages.engagementId}
                  currentUserId={user.id}
                  canSend={messages.canSend}
                  clientInfo={messages.clientInfo}
                  pmInfo={messages.pmInfo}
                />
              </div>
            ) : (
              <EmptySection
                icon={MessageSquare}
                title="Unable to load messages"
                description="You may not have permission to view this conversation."
              />
            )}
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
            <UploadDocumentDialog engagementId={engagement.id} />
          </CardHeader>
          <CardContent>
            {documentsWithUrls.length === 0 ? (
              <EmptySection
                icon={FileText}
                title="No documents uploaded yet"
                description="Upload contracts, reports, and other files for this engagement."
              />
            ) : (
              <div className="space-y-2">
                {documentsWithUrls.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-divider hover:bg-surface-alt/50 transition-colors"
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-navy/10 text-navy">
                        <FileText size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-on-surface truncate">
                          {doc.title || doc.name}
                        </p>
                        {doc.category && (
                          <p className="text-xs text-on-surface-muted">
                            {doc.category}{" "}
                            {doc.isClientVisible
                              ? "· Visible to client"
                              : "· Internal only"}
                          </p>
                        )}
                        <p className="text-xs text-on-surface-muted mt-0.5">
                          Uploaded {formatDate(doc.uploadedAt)} · v{doc.version}
                        </p>
                      </div>
                    </div>
                    {doc.signedUrl ? (
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
                        </a>
                      </div>
                    ) : (
                      <Download
                        size={16}
                        className="text-on-surface-muted opacity-30 shrink-0"
                      />
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
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <CreditCard size={18} className="text-navy" />
                Invoices
              </CardTitle>
              <CreateInvoiceDialog engagementId={engagement.id} />
            </CardHeader>
            <CardContent>
              {invoices.length === 0 ? (
                <EmptySection
                  icon={CreditCard}
                  title="No invoices issued yet"
                  description="Create an invoice when you're ready to bill the client."
                />
              ) : (
                <div className="space-y-2">
                  {invoices.map((invoice) => (
                    <div
                      key={invoice.id}
                      className="rounded-xl border border-divider p-4 hover:bg-surface-alt/30 transition-colors"
                    >
                      <div className="mb-1 flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-2">
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
                        {invoice.status === "DRAFT" ? (
                          <SendInvoiceButton invoiceId={invoice.id} />
                        ) : null}
                      </div>
                      <p className="text-sm font-semibold text-on-surface">
                        {formatCurrency(
                          invoice.amount,
                          invoice.currency ?? "NGN",
                        )}
                      </p>
                      <p className="text-xs text-on-surface-muted mt-1">
                        {invoice.description}
                      </p>
                      {invoice.dueDate && (
                        <p className="text-xs text-on-surface-muted">
                          Due {formatDate(invoice.dueDate)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Payments</CardTitle>
              <RecordPaymentDialog engagementId={engagement.id} />
            </CardHeader>
            <CardContent>
              {payments.length === 0 ? (
                <EmptySection
                  icon={CreditCard}
                  title="No payments recorded yet"
                  description="Record manual payments or they will appear here after Paystack checkout."
                />
              ) : (
                <div className="space-y-2">
                  {payments.map((payment) => (
                    <div
                      key={payment.id}
                      className="rounded-xl border border-divider p-3 hover:bg-surface-alt/30 transition-colors"
                    >
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
                      <p className="text-xs text-on-surface-muted mt-1">
                        {payment.paidAt
                          ? `Paid ${formatDate(payment.paidAt)}`
                          : `Created ${formatDate(payment.createdAt)}`}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── NOTES ── */}
      {tab === "notes" && (
        <InternalNotesPanel
          engagementId={engagement.id}
          initialNotes={internalNotes}
        />
      )}
    </div>
  );
}
