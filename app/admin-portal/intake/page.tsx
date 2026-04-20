import { redirect } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/app/actions/auth";
import { getIntakeSubmissions } from "@/app/actions/intake";
import { ClipboardList, Clock, Search, Eye } from "lucide-react";

export const metadata = { title: "Intake Forms — Terralume Admin Portal" };

const STATUS_META: Record<string, { label: string; className: string }> = {
  PENDING: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700 border border-amber-200",
  },
  REVIEWING: {
    label: "Reviewing",
    className: "bg-blue-50 text-blue-700 border border-blue-200",
  },
  ACTIVE: {
    label: "Active",
    className: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  },
  CLOSED: {
    label: "Closed",
    className: "bg-zinc-100 text-zinc-500 border border-zinc-200",
  },
};

const TYPE_LABEL: Record<string, string> = {
  rent: "Rental",
  buy: "Purchase",
  lease: "Commercial Lease",
};

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function AdminIntakePage() {
  const user = await requireAdmin().catch(() => null);
  if (!user) redirect("/admin-login");

  const submissions = await getIntakeSubmissions();

  const total = submissions.length;
  const pending = submissions.filter((s) => s.status === "PENDING").length;
  const reviewing = submissions.filter((s) => s.status === "REVIEWING").length;

  const stats = [
    {
      label: "Total submissions",
      value: total,
      icon: ClipboardList,
      iconBg: "bg-(--color-navy-light)",
      iconColor: "text-(--color-navy)",
    },
    {
      label: "Awaiting review",
      value: pending,
      icon: Clock,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      label: "In review",
      value: reviewing,
      icon: Search,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
  ];

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-muted mb-1">
          Intake Management
        </p>
        <h1 className="font-display text-2xl font-bold text-on-surface">
          Client Intake Forms
        </h1>
        <p className="text-sm text-on-surface-muted mt-1">
          All enquiry submissions from potential clients.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="rounded-2xl border border-divider bg-surface shadow-sm px-5 py-4 flex items-center gap-4"
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${s.iconBg}`}
              >
                <Icon size={20} className={s.iconColor} />
              </span>
              <div>
                <p className="text-2xl font-bold text-on-surface leading-none">
                  {s.value}
                </p>
                <p className="text-xs text-on-surface-muted mt-0.5">
                  {s.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-divider bg-surface shadow-sm overflow-hidden">
        {submissions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
            <ClipboardList size={36} className="text-on-surface-muted/40" />
            <p className="text-sm text-on-surface-muted">
              No intake submissions yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-divider bg-surface-alt">
                  <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide text-on-surface-muted">
                    Reference
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-on-surface-muted">
                    Name
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-on-surface-muted hidden md:table-cell">
                    Email
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-on-surface-muted hidden sm:table-cell">
                    Type
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-on-surface-muted hidden lg:table-cell">
                    Location
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-on-surface-muted">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-on-surface-muted hidden sm:table-cell">
                    Date
                  </th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-divider">
                {submissions.map((s) => {
                  const statusMeta =
                    STATUS_META[s.status] ?? STATUS_META.PENDING;
                  return (
                    <tr
                      key={s.id}
                      className="hover:bg-surface-alt/50 transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <span className="font-mono text-xs font-medium text-on-surface">
                          {s.referenceNumber}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div>
                          <p className="font-medium text-on-surface">
                            {s.fullName}
                          </p>
                          {s.preferredName && (
                            <p className="text-xs text-on-surface-muted">
                              {s.preferredName}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-on-surface-muted hidden md:table-cell">
                        {s.email}
                      </td>
                      <td className="px-4 py-3.5 hidden sm:table-cell">
                        <span className="text-on-surface">
                          {TYPE_LABEL[s.transactionType] ?? s.transactionType}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-on-surface-muted hidden lg:table-cell">
                        {s.location}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusMeta.className}`}
                        >
                          {statusMeta.label}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-on-surface-muted hidden sm:table-cell">
                        {formatDate(s.createdAt)}
                      </td>
                      <td className="px-4 py-3.5">
                        <Link
                          href={`/admin-portal/intake/${s.id}`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-divider bg-white px-3 py-1.5 text-xs font-medium text-on-surface transition-colors hover:bg-surface-alt"
                        >
                          <Eye size={13} />
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
