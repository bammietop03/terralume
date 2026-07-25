import { redirect } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/app/actions/auth";
import {
  getEngagements,
  type EngagementListItem,
} from "@/app/actions/engagements";
import { getCurrentProjectStage } from "@/app/actions/engagements";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, Building2 } from "lucide-react";

export const metadata = { title: "Engagements — Terralume Admin Portal" };

function formatDate(d: Date | string | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getStatusColor(status: string) {
  switch (status) {
    case "IN_PROGRESS":
      return "bg-blue-50 text-blue-700";
    case "COMPLETED":
      return "bg-emerald-50 text-emerald-700";
    case "BLOCKED":
      return "bg-red-50 text-red-700";
    case "NOT_STARTED":
    default:
      return "bg-zinc-100 text-zinc-600";
  }
}

export default async function EngagementsPage() {
  const user = await requireAdmin().catch(() => null);
  if (!user) redirect("/admin-login");

  const engagements: EngagementListItem[] = await getEngagements();

  const total = engagements.length;
  const active = engagements.filter((e) => e.status === "ACTIVE").length;
  const completed = engagements.filter((e) => e.status === "COMPLETED").length;

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-muted mb-1">
          Engagements
        </p>
        <h1 className="font-display text-2xl font-bold text-on-surface">
          Active Engagements
        </h1>
        <p className="text-sm text-on-surface-muted mt-1">
          All active client engagements. Update stages and track onboarding
          progress.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Total engagements",
            value: total,
            color: "text-navy",
            bg: "bg-navy-light",
          },
          {
            label: "Active projects",
            value: active,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "Completed",
            value: completed,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-divider bg-surface shadow-sm px-5 py-4 flex items-center gap-4"
          >
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${s.bg}`}
            >
              <Building2 size={20} className={s.color} />
            </span>
            <div>
              <p className="text-2xl font-bold text-on-surface">{s.value}</p>
              <p className="text-xs text-on-surface-muted">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      {engagements.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-divider bg-surface p-16 text-center">
          <p className="text-sm text-on-surface-muted">
            No active engagements yet.{" "}
            <Link
              href="/admin-portal/intake"
              className="text-(--color-navy) underline underline-offset-4"
            >
              Activate a client from their intake form.
            </Link>
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-divider bg-surface shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-surface-muted/50">
                <TableHead className="font-semibold text-on-surface-muted">
                  Client
                </TableHead>
                <TableHead className="font-semibold text-on-surface-muted">
                  Service
                </TableHead>
                <TableHead className="font-semibold text-on-surface-muted">
                  PM
                </TableHead>
                <TableHead className="font-semibold text-on-surface-muted">
                  Current Stage
                </TableHead>
                <TableHead className="font-semibold text-on-surface-muted">
                  Tasks
                </TableHead>
                <TableHead className="font-semibold text-on-surface-muted">
                  Created
                </TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {engagements.map((eng) => {
                // Find current stage (first IN_PROGRESS or NOT_STARTED stage)
                const currentStage =
                  eng._count.tasks > 0
                    ? eng._count.tasks +
                      " task" +
                      (eng._count.tasks !== 1 ? "s" : "")
                    : "No tasks";

                return (
                  <TableRow key={eng.id} className="hover:bg-surface-muted/30">
                    <TableCell>
                      <div>
                        <p className="font-medium text-on-surface text-sm">
                          {eng.user.preferredName || eng.user.fullName}
                        </p>
                        <p className="text-xs text-on-surface-muted">
                          {eng.user.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium text-on-surface">
                          {eng.service?.name ?? "—"}
                        </p>
                        {eng.workflowTemplate && (
                          <p className="text-xs text-on-surface-muted">
                            {eng.workflowTemplate.name}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-on-surface-muted">
                      {(eng.pm?.preferredName || eng.pm?.fullName) ?? (
                        <span className="italic">Unassigned</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {eng.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-on-surface-muted">
                      {currentStage}
                    </TableCell>
                    <TableCell className="text-sm text-on-surface-muted">
                      {formatDate(eng.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/admin-portal/engagements/${eng.id}`}
                        className="inline-flex items-center gap-1 rounded-lg border border-divider px-3 py-1.5 text-xs font-medium text-on-surface hover:bg-surface-muted transition-colors"
                      >
                        <Eye size={13} />
                        View
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
