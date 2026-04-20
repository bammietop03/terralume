import { redirect } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/app/actions/auth";
import { getAllLeads, getMyAssignedLeads } from "@/app/actions/leads";
import {
  Users,
  Sparkles,
  CalendarCheck,
  MailCheck,
  XCircle,
  Eye,
} from "lucide-react";

export const metadata = { title: "Leads — Terralume Admin Portal" };

const STATUS_META: Record<string, { label: string; className: string }> = {
  NEW: {
    label: "New",
    className: "bg-purple-50 text-purple-700 border border-purple-200",
  },
  CONSULTATION_SCHEDULED: {
    label: "Consultation scheduled",
    className: "bg-blue-50 text-blue-700 border border-blue-200",
  },
  AWAITING_DECISION: {
    label: "Awaiting decision",
    className: "bg-amber-50 text-amber-700 border border-amber-200",
  },
  INTAKE_INVITED: {
    label: "Intake invited",
    className: "bg-indigo-50 text-indigo-700 border border-indigo-200",
  },
  INTAKE_SUBMITTED: {
    label: "Intake submitted",
    className: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  },
  DECLINED: {
    label: "Declined",
    className: "bg-zinc-100 text-zinc-500 border border-zinc-200",
  },
};

const INTEREST_LABEL: Record<string, string> = {
  BUY: "Buy",
  INVEST: "Invest",
  DEVELOP: "Develop",
  LEGAL_SUPPORT: "Legal Support",
  CROSS_BORDER: "Cross-border",
};

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function AdminLeadsPage() {
  const user = await requireAdmin().catch(() => null);
  if (!user) redirect("/admin-login");

  const leads =
    user.role === "PM" ? await getMyAssignedLeads() : await getAllLeads();

  const isPm = user.role === "PM";

  const total = leads.length;
  const newLeads = leads.filter((l) => l.status === "NEW").length;
  const scheduled = leads.filter(
    (l) => l.status === "CONSULTATION_SCHEDULED",
  ).length;
  const awaiting = leads.filter((l) => l.status === "AWAITING_DECISION").length;
  const invited = leads.filter((l) => l.status === "INTAKE_INVITED").length;
  const declined = leads.filter((l) => l.status === "DECLINED").length;

  const stats = [
    {
      label: "Total leads",
      value: total,
      icon: Users,
      iconBg: "bg-(--color-navy-light)",
      iconColor: "text-(--color-navy)",
    },
    {
      label: "New",
      value: newLeads,
      icon: Sparkles,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      label: "Consultation scheduled",
      value: scheduled,
      icon: CalendarCheck,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      label: "Awaiting decision",
      value: awaiting,
      icon: MailCheck,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      label: "Invited to intake",
      value: invited,
      icon: MailCheck,
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600",
    },
    {
      label: "Declined",
      value: declined,
      icon: XCircle,
      iconBg: "bg-zinc-100",
      iconColor: "text-zinc-500",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-6 py-8">
      {/* Header */}
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-on-surface-muted">
          Lead Management
        </p>
        <h1 className="font-display text-2xl font-bold text-on-surface">
          {isPm ? "My Leads" : "Consultation Leads"}
        </h1>
        <p className="mt-1 text-sm text-on-surface-muted">
          {isPm
            ? "Consultation leads currently assigned to you."
            : "All free consultation requests from the website."}
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="flex flex-col gap-2 rounded-2xl border border-divider bg-surface px-4 py-4 shadow-sm"
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${s.iconBg}`}
              >
                <Icon size={16} className={s.iconColor} />
              </span>
              <div>
                <p className="text-xl font-bold leading-none text-on-surface">
                  {s.value}
                </p>
                <p className="mt-0.5 text-[11px] text-on-surface-muted">
                  {s.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-divider bg-surface shadow-sm">
        {leads.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <Users size={32} className="text-on-surface-muted opacity-40" />
            <p className="text-sm font-medium text-on-surface-muted">
              No leads yet
            </p>
            <p className="text-xs text-on-surface-muted">
              Consultation requests submitted via the website will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-divider bg-surface-alt">
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-on-surface-muted">
                    Name
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-on-surface-muted">
                    Contact
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-on-surface-muted">
                    Interest
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-on-surface-muted">
                    PM
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-on-surface-muted">
                    Status
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-on-surface-muted">
                    Received
                  </th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-divider">
                {leads.map((lead) => {
                  const meta = STATUS_META[lead.status] ?? STATUS_META.NEW;
                  return (
                    <tr
                      key={lead.id}
                      className="transition-colors hover:bg-surface-alt"
                    >
                      <td className="px-5 py-3.5 font-medium text-on-surface">
                        {lead.fullName}
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="text-on-surface">{lead.email}</p>
                        <p className="text-xs text-on-surface-muted">
                          {lead.phone}
                        </p>
                      </td>
                      <td className="px-5 py-3.5 text-on-surface-muted">
                        {lead.interestType
                          ? (INTEREST_LABEL[lead.interestType] ??
                            lead.interestType)
                          : "—"}
                      </td>
                      <td className="px-5 py-3.5 text-on-surface-muted">
                        {lead.assignedPm?.fullName ?? (
                          <span className="italic text-on-surface-muted/60">
                            Unassigned
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${meta.className}`}
                        >
                          {meta.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-on-surface-muted">
                        {formatDate(lead.createdAt)}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <Link
                          href={`/admin-portal/leads/${lead.id}`}
                          className="inline-flex items-center gap-1 rounded-lg border border-divider bg-white px-3 py-1.5 text-xs font-medium text-on-surface shadow-sm transition-colors hover:bg-surface-alt"
                        >
                          <Eye size={12} />
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
