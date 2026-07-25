import { redirect } from "next/navigation";
import Link from "next/link";
import { requireClient } from "@/app/actions/auth";
import { getMyEngagement } from "@/app/actions/engagements";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Building2,
  ChevronRight,
  Clock,
  ClipboardList,
} from "lucide-react";

export const metadata = { title: "My Engagements — Terralume Client Portal" };

function formatDate(date: Date | string | null | undefined) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getStatusColor(status: string) {
  switch (status) {
    case "ACTIVE":
      return "bg-blue-50 text-blue-700 ring-blue-200";
    case "COMPLETED":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    case "PAUSED":
      return "bg-amber-50 text-amber-700 ring-amber-200";
    case "CANCELLED":
      return "bg-red-50 text-red-700 ring-red-200";
    default:
      return "bg-zinc-100 text-zinc-600 ring-zinc-200";
  }
}

export default async function ClientEngagementsPage() {
  const user = await requireClient().catch(() => null);
  if (!user) redirect("/login");

  const engagements = await getMyEngagement();

  if (!engagements || engagements.length === 0) {
    return (
      <div className="px-6 py-8 max-w-4xl mx-auto">
        <div className="text-center py-12">
          <h1 className="font-display text-2xl font-bold text-on-surface mb-3">
            No active projects
          </h1>
          <p className="text-on-surface-muted mb-6">
            You don&apos;t have any active projects yet.
          </p>
          <Link
            href="/client-portal/dashboard"
            className="text-navy hover:underline font-medium"
          >
            ← Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-8 space-y-6">
      <Link
        href="/client-portal/dashboard"
        className="flex items-center gap-1.5 text-sm text-on-surface-muted hover:text-on-surface transition-colors w-fit"
      >
        <ArrowLeft size={16} />
        Back to dashboard
      </Link>

      <div>
        <h1 className="font-display text-2xl font-bold text-on-surface">
          My Engagements
        </h1>
        <p className="text-on-surface-muted">
          Select a project to view progress, tasks, and activity.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Building2 size={18} className="text-navy" />
            Active Projects
            <Badge variant="outline" className="ml-auto text-xs font-normal">
              {engagements.length}{" "}
              {engagements.length === 1 ? "project" : "projects"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y divide-divider">
            {engagements.map((engagement) => {
              const currentStage = engagement.projectStages.find(
                (s) => s.status === "IN_PROGRESS",
              );
              const completedStages = engagement.projectStages.filter(
                (s) => s.status === "COMPLETED",
              ).length;
              const totalStages = engagement.projectStages.length;
              const percentage =
                totalStages > 0
                  ? Math.round((completedStages / totalStages) * 100)
                  : 0;
              const pendingTasks = engagement.tasks.filter(
                (t) => t.status === "PENDING",
              ).length;

              return (
                <li key={engagement.id}>
                  <Link
                    href={`/client-portal/engagement/${engagement.id}`}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-surface-alt/50 transition-colors group"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy/10 text-navy">
                      <Building2 size={18} />
                    </div>

                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-semibold text-on-surface text-sm truncate">
                          {engagement.service?.name ?? "Project"}
                        </h2>
                        <Badge
                          variant="outline"
                          className={`text-xs ${getStatusColor(engagement.status)}`}
                        >
                          {engagement.status}
                        </Badge>
                        {pendingTasks > 0 && (
                          <Badge className="bg-amber-100 text-amber-700 text-xs">
                            {pendingTasks} task
                            {pendingTasks !== 1 ? "s" : ""} pending
                          </Badge>
                        )}
                      </div>

                      {currentStage && (
                        <p className="flex items-center gap-1.5 text-xs text-on-surface-muted">
                          <Clock size={12} className="shrink-0" />
                          <span className="truncate">
                            {currentStage.workflowStage.name}
                          </span>
                        </p>
                      )}

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs text-on-surface-muted">
                          <span>
                            {completedStages} of {totalStages} stages completed
                          </span>
                          <span className="font-semibold text-on-surface">
                            {percentage}%
                          </span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-zinc-200 overflow-hidden">
                          <div
                            className="h-full bg-linear-to-r from-navy to-blue-600 transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-on-surface-muted">
                        {engagement.pm && (
                          <span>
                            PM:{" "}
                            {engagement.pm.preferredName ||
                              engagement.pm.fullName}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <ClipboardList size={12} />
                          Started {formatDate(engagement.createdAt)}
                        </span>
                      </div>
                    </div>

                    <ChevronRight
                      size={18}
                      className="shrink-0 text-on-surface-muted group-hover:text-navy transition-colors"
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
