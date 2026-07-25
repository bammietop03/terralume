import { redirect } from "next/navigation";
import Link from "next/link";
import { requireClient } from "@/app/actions/auth";
import { getMyEngagement, getProjectProgress } from "@/app/actions/engagements";
import { getMyTasks } from "@/app/actions/tasks";
import { getRecentUpdates } from "@/app/actions/timeline";
import { getMyIntakeDraft } from "@/app/actions/intake";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileEdit,
  CheckCircle2,
  Clock,
  AlertCircle,
  Circle,
  User,
  TrendingUp,
  ClipboardList,
} from "lucide-react";

export const metadata = {
  title: "Dashboard — Terralume Client Portal",
};

function formatDate(date: Date | string | null | undefined) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(date: Date | string | null | undefined) {
  if (!date) return "—";
  return new Date(date).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
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
    case "PENDING":
    default:
      return "bg-zinc-100 text-zinc-600 ring-zinc-200";
  }
}

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

export default async function ClientDashboardPage() {
  const user = await requireClient().catch(() => null);
  if (!user) redirect("/login");

  const [engagements, draft] = await Promise.all([
    getMyEngagement(),
    getMyIntakeDraft(),
  ]);

  const engagement = engagements?.[0] ?? null;

  const firstName =
    user.preferredName ?? user.fullName?.split(" ")[0] ?? "there";

  // If no engagement, show welcome screen
  if (!engagement) {
    return (
      <>
        <div className="px-6 pt-8 pb-2 max-w-6xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold mb-1">
            Client Portal
          </p>
          <h1 className="font-display text-2xl font-bold text-on-surface">
            Welcome to Terralume, {firstName}
          </h1>
        </div>
        <div className="p-8 max-w-3xl mx-auto space-y-4">
          {/* Draft continuation banner */}
          {draft && (
            <Link
              href="/client-portal/intake/new"
              className="flex items-center justify-between gap-4 rounded-2xl border border-navy/20 bg-navy-light p-5 transition-colors hover:bg-navy/10"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy text-white">
                  <FileEdit size={18} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-on-surface">
                    Continue your intake form
                  </p>
                  <p className="text-xs text-on-surface-muted">
                    You have an in-progress brief — step {draft.draftStep} of 7
                  </p>
                </div>
              </div>
              <span className="shrink-0 text-xs font-semibold text-navy underline underline-offset-4">
                Continue →
              </span>
            </Link>
          )}
          <div className="rounded-2xl border border-white/60 bg-white/80 backdrop-blur-sm p-10 text-center shadow-lg">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-navy to-navy-dark shadow-sm">
              <span className="font-display text-2xl text-white">T</span>
            </div>
            <h2 className="font-display text-xl font-bold text-on-surface mb-3">
              Your portal is being set up
            </h2>
            <p className="text-on-surface-muted text-sm leading-relaxed max-w-md mx-auto">
              Your engagement hasn't been activated yet. Your project manager
              will set it up shortly — you'll receive an email when it's ready.
            </p>
          </div>
        </div>
      </>
    );
  }

  // Fetch project data
  const [progress, tasks, recentUpdates] = await Promise.all([
    getProjectProgress(engagement.id),
    getMyTasks(),
    getRecentUpdates(engagement.id, 5),
  ]);

  const currentStage = engagement.projectStages.find(
    (s) => s.status === "IN_PROGRESS"
  );
  const completedStages = engagement.projectStages.filter(
    (s) => s.status === "COMPLETED"
  ).length;
  const pendingTasks = tasks.filter((t) => t.status === "PENDING");
  const pm = engagement.pm;

  return (
    <>
      <div className="px-6 pt-8 pb-2 max-w-7xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold mb-1">
          Your Project
        </p>
        <h1 className="font-display text-2xl font-bold text-on-surface">
          Welcome back, {firstName}
        </h1>
        <p className="mt-1 text-sm text-on-surface-muted">
          Here's what's happening with your project
        </p>
      </div>

      <div className="px-6 py-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Progress Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp size={18} className="text-navy" />
                  Project Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Progress bar */}
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
                        className="h-full bg-gradient-to-r from-navy to-blue-600 transition-all duration-500"
                        style={{ width: `${progress.percentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Current stage */}
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
                      {currentStage.workflowStage.estimatedDays && (
                        <p className="text-xs text-on-surface-muted mt-2">
                          Estimated duration: {currentStage.workflowStage.estimatedDays} days
                        </p>
                      )}
                    </div>
                  )}

                  {/* Stage list */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-on-surface">
                      All Stages
                    </h4>
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
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {recentUpdates.length === 0 ? (
                  <p className="text-sm text-on-surface-muted italic text-center py-4">
                    No recent activity
                  </p>
                ) : (
                  <div className="space-y-4">
                    {recentUpdates.map((update) => (
                      <div
                        key={update.id}
                        className="border-l-2 border-divider pl-4 py-2"
                      >
                        <p className="text-sm font-medium text-on-surface">
                          {update.description}
                        </p>
                        <p className="text-xs text-on-surface-muted mt-1">
                          {formatDateTime(update.timestamp)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right column - Sidebar */}
          <div className="space-y-6">
            {/* PM Card */}
            {pm && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <User size={18} className="text-navy" />
                    Your Project Manager
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-navy/10 text-sm font-bold text-navy uppercase">
                      {pm.fullName?.charAt(0) ?? "PM"}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-on-surface">
                        {pm.preferredName || pm.fullName}
                      </p>
                      <p className="text-xs text-on-surface-muted mt-0.5">
                        {pm.email}
                      </p>
                      {pm.phone && (
                        <p className="text-xs text-on-surface-muted">
                          {pm.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tasks Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <ClipboardList size={18} className="text-navy" />
                    Your Tasks
                  </CardTitle>
                  {pendingTasks.length > 0 && (
                    <Badge className="bg-amber-100 text-amber-700">
                      {pendingTasks.length} pending
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {tasks.length === 0 ? (
                  <p className="text-sm text-on-surface-muted italic text-center py-4">
                    No tasks yet
                  </p>
                ) : (
                  <div className="space-y-3">
                    {tasks.slice(0, 5).map((task) => (
                      <div
                        key={task.id}
                        className="border border-divider rounded-lg p-3 hover:bg-surface-alt/50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="text-sm font-semibold text-on-surface flex-1">
                            {task.title}
                          </h4>
                          <Badge
                            variant="outline"
                            className={`text-xs ${getTaskStatusColor(task.status)}`}
                          >
                            {task.status}
                          </Badge>
                        </div>
                        {task.dueDate && (
                          <p className="text-xs text-on-surface-muted">
                            Due: {formatDate(task.dueDate)}
                          </p>
                        )}
                        {task.status === "PENDING" && (
                          <Link href={`/client-portal/engagement/${engagement.id}`}>
                            <Button
                              size="sm"
                              className="w-full mt-2 bg-navy hover:bg-navy-dark text-white"
                            >
                              Submit Response
                            </Button>
                          </Link>
                        )}
                      </div>
                    ))}
                    {tasks.length > 5 && (
                      <Link
                        href={`/client-portal/engagement/${engagement.id}`}
                        className="text-xs text-navy hover:underline block text-center"
                      >
                        View all {tasks.length} tasks →
                      </Link>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Project Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="text-on-surface-muted text-xs">Service</p>
                  <p className="font-medium text-on-surface">
                    {engagement.service?.name ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="text-on-surface-muted text-xs">Status</p>
                  <Badge variant="outline">{engagement.status}</Badge>
                </div>
                <div>
                  <p className="text-on-surface-muted text-xs">Started</p>
                  <p className="font-medium text-on-surface">
                    {formatDate(engagement.createdAt)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
