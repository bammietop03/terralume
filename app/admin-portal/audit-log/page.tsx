import { redirect } from "next/navigation";
import { requireSuperAdmin } from "@/app/actions/auth";
import { getAuditLogs } from "@/app/actions/audit";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const metadata = { title: "Audit Log — Terralume Admin Portal" };

const ACTION_VARIANTS: Record<
  string,
  "default" | "outline" | "gold" | "white"
> = {
  USER_DELETED: "gold",
  AGREEMENT_SIGNED: "default",
  INVOICE_PAID: "default",
  ONBOARDING_COMPLETE: "default",
  PASSWORD_CHANGED: "gold",
  DOCUMENT_UPLOADED: "gold",
  MESSAGE_SENT: "outline",
};

function actionBadgeVariant(action: string) {
  return ACTION_VARIANTS[action] ?? "outline";
}

function formatTs(d: Date | string) {
  return new Date(d).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default async function AuditLogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; action?: string; resource?: string }>;
}) {
  const user = await requireSuperAdmin().catch(() => null);
  if (!user) redirect("/admin-login");

  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? "1", 10));
  const actionFilter = sp.action ?? undefined;
  const resourceFilter = sp.resource ?? undefined;

  const { entries, total, totalPages } = await getAuditLogs({
    page,
    pageSize: 50,
    action: actionFilter,
    resourceType: resourceFilter,
  });

  function pageUrl(p: number) {
    const params = new URLSearchParams();
    if (p > 1) params.set("page", String(p));
    if (actionFilter) params.set("action", actionFilter);
    if (resourceFilter) params.set("resource", resourceFilter);
    const qs = params.toString();
    return `/admin-portal/settings/audit-log${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-muted mb-1">
          Settings
        </p>
        <h1 className="font-display text-2xl font-bold text-on-surface">
          Audit Log
        </h1>
        <p className="text-sm text-on-surface-muted mt-1">
          Full history of all privileged actions taken in the system.{" "}
          <span className="font-medium text-on-surface">
            {total.toLocaleString()}
          </span>{" "}
          events total.
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-44">Timestamp</TableHead>
                <TableHead className="w-44">Actor</TableHead>
                <TableHead className="w-52">Action</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>Resource ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-12 text-center text-sm text-on-surface-muted"
                  >
                    No audit log entries found.
                  </TableCell>
                </TableRow>
              ) : (
                entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="text-xs text-on-surface-muted font-mono whitespace-nowrap">
                      {formatTs(entry.timestamp)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium text-on-surface leading-tight">
                        {entry.user.fullName ?? "—"}
                      </div>
                      <div className="text-xs text-on-surface-muted truncate max-w-40">
                        {entry.user.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={actionBadgeVariant(entry.action)}
                        className="text-xs font-mono"
                      >
                        {entry.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-on-surface">
                      {entry.resourceType}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-on-surface-muted">
                      {entry.resourceId ?? "—"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-on-surface-muted">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={pageUrl(page - 1)}
                className="inline-flex items-center gap-1 rounded-lg border border-divider px-3 py-1.5 text-sm font-medium text-on-surface hover:bg-surface-muted transition-colors"
              >
                <ChevronLeft size={14} />
                Previous
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={pageUrl(page + 1)}
                className="inline-flex items-center gap-1 rounded-lg border border-divider px-3 py-1.5 text-sm font-medium text-on-surface hover:bg-surface-muted transition-colors"
              >
                Next
                <ChevronRight size={14} />
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
