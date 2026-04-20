import { redirect } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/app/actions/auth";
import {
  getAdminDashboardStats,
  getPMDashboardData,
} from "@/app/actions/dashboard";
import {
  Users,
  Briefcase,
  AlertCircle,
  FileQuestion,
  ArrowRight,
  Clock,
  TrendingUp,
} from "lucide-react";

export const metadata = { title: "Dashboard — Terralume Admin Portal" };

const STAGE_LABELS: Record<string, string> = {
  discovery: "Discovery",
  brief_confirmation: "Brief Confirmation",
  area_shortlisting: "Area Shortlisting",
  property_search: "Property Search",
  due_diligence: "Due Diligence",
  offer_negotiation: "Offer & Negotiation",
  legal_completion: "Legal & Completion",
  handover: "Handover",
};

const stagePill: Record<string, string> = {
  discovery: "bg-slate-100 text-slate-700 border border-slate-200/60",
  brief_confirmation: "bg-blue-50 text-blue-700 border border-blue-200/60",
  area_shortlisting: "bg-purple-50 text-purple-700 border border-purple-200/60",
  property_search: "bg-indigo-50 text-indigo-700 border border-indigo-200/60",
  due_diligence: "bg-amber-50 text-amber-700 border border-amber-200/60",
  offer_negotiation: "bg-orange-50 text-orange-700 border border-orange-200/60",
  legal_completion: "bg-green-50 text-green-700 border border-green-200/60",
  handover: "bg-emerald-50 text-emerald-700 border border-emerald-200/60",
};

function StatCard({
  label,
  value,
  icon,
  gradient,
  iconBg,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  gradient: string;
  iconBg: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/60 bg-white/80 backdrop-blur-sm p-5 shadow-[0_1px_3px_rgba(27,42,107,0.06),0_8px_24px_rgba(27,42,107,0.04)] hover:shadow-[0_4px_12px_rgba(27,42,107,0.1),0_12px_32px_rgba(27,42,107,0.06)] transition-all duration-300 hover:-translate-y-0.5">
      {/* Subtle gradient accent */}
      <div className={`absolute inset-x-0 top-0 h-1 ${gradient}`} />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-muted/80 mb-2">
            {label}
          </p>
          <p className="font-display text-3xl font-bold text-on-surface tracking-tight">
            {value}
          </p>
        </div>
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-2xl ${iconBg} shadow-sm ring-1 ring-black/3`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

export default async function AdminDashboardPage() {
  const user = await requireAdmin().catch(() => null);
  if (!user) redirect("/login");

  const isAdmin = user.role === "ADMIN";

  const [adminStats, pmData] = await Promise.all([
    isAdmin ? getAdminDashboardStats() : null,
    !isAdmin ? getPMDashboardData(user.id) : null,
  ]);

  const engagements = isAdmin
    ? adminStats!.recentEngagements
    : pmData!.engagements;

  const greeting = isAdmin
    ? "Admin Dashboard"
    : `Welcome back, ${user.preferredName ?? user.fullName?.split(" ")[0] ?? "PM"}`;

  return (
    <>
      <div className="px-6 pt-8 pb-2 max-w-6xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-(--color-crimson) mb-1">
          {isAdmin ? "Admin Portal" : "PM Portal"}
        </p>
        <h1 className="font-display text-2xl font-bold text-on-surface">
          {greeting}
        </h1>
        <p className="mt-1 text-sm text-on-surface-muted">
          Overview of engagements, clients, and pending items.
        </p>
      </div>

      <div className="px-6 py-6 max-w-6xl mx-auto">
        {/* Stats (admin only) */}
        {isAdmin && adminStats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              label="Active engagements"
              value={adminStats.activeEngagements}
              icon={<Briefcase size={18} className="text-(--color-navy)" />}
              gradient="bg-linear-to-r from-(--color-navy) to-(--color-navy-light)"
              iconBg="bg-(--color-navy-light)"
            />
            <StatCard
              label="Total clients"
              value={adminStats.totalClients}
              icon={<Users size={18} className="text-purple-600" />}
              gradient="bg-linear-to-r from-purple-500 to-purple-200"
              iconBg="bg-purple-50"
            />
            <StatCard
              label="Pending actions"
              value={adminStats.pendingActions}
              icon={<AlertCircle size={18} className="text-amber-600" />}
              gradient="bg-linear-to-r from-amber-500 to-amber-200"
              iconBg="bg-amber-50"
            />
            <StatCard
              label="Open enquiries"
              value={adminStats.openEnquiries}
              icon={
                <FileQuestion size={18} className="text-(--color-crimson)" />
              }
              gradient="bg-linear-to-r from-(--color-crimson) to-(--color-crimson-light)"
              iconBg="bg-(--color-crimson-light)"
            />
          </div>
        )}

        {/* Engagements table */}
        <div className="rounded-2xl border border-white/60 bg-white/80 backdrop-blur-sm shadow-[0_1px_3px_rgba(27,42,107,0.06),0_8px_24px_rgba(27,42,107,0.04)] overflow-hidden">
          {/* Table header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-divider/60">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-linear-to-br from-(--color-navy) to-(--color-navy-dark) text-white shadow-sm">
                <TrendingUp size={14} />
              </div>
              <h2 className="text-sm font-semibold text-on-surface">
                {isAdmin ? "Recent Engagements" : "My Engagements"}
              </h2>
            </div>
            <Link
              href="/admin-portal/clients"
              className="flex items-center gap-1.5 text-xs text-(--color-navy) font-semibold hover:text-navy-dark rounded-lg px-3 py-1.5 hover:bg-(--color-navy-light) transition-colors"
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>

          {engagements.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-(--color-navy-light)/60">
                <Briefcase size={20} className="text-(--color-navy)/50" />
              </div>
              <p className="text-sm font-medium text-on-surface-muted">
                No active engagements
              </p>
              <p className="text-xs text-on-surface-muted/70 mt-1">
                New engagements will appear here
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-(--color-navy-light)/30 border-b border-divider/40">
                    <th className="text-left px-6 py-3.5 text-[11px] font-semibold text-on-surface-muted uppercase tracking-wider">
                      Client
                    </th>
                    <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-on-surface-muted uppercase tracking-wider">
                      Stage
                    </th>
                    <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-on-surface-muted uppercase tracking-wider hidden md:table-cell">
                      Started
                    </th>
                    <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-on-surface-muted uppercase tracking-wider hidden lg:table-cell">
                      Target
                    </th>
                    <th className="px-4 py-3.5" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-divider/40">
                  {engagements.map((eng) => (
                    <tr
                      key={eng.id}
                      className="group hover:bg-(--color-navy-light)/20 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 shrink-0 rounded-full bg-linear-to-br from-(--color-navy) to-(--color-navy-dark) flex items-center justify-center text-white text-xs font-bold shadow-sm">
                            {(eng.user?.fullName ?? eng.user?.email ?? "?")
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-on-surface">
                              {eng.user?.fullName ?? eng.user?.email ?? "—"}
                            </p>
                            <p className="text-xs text-on-surface-muted">
                              {eng.user?.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${stagePill[eng.stage] ?? "bg-surface-card text-on-surface-muted border border-divider/60"}`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current opacity-40" />
                          {STAGE_LABELS[eng.stage] ?? eng.stage}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-on-surface-muted hidden md:table-cell">
                        {eng.startDate
                          ? new Date(eng.startDate).toLocaleDateString(
                              "en-GB",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )
                          : "—"}
                      </td>
                      <td className="px-4 py-4 hidden lg:table-cell">
                        {eng.targetDate ? (
                          <span className="flex items-center gap-1.5 text-on-surface-muted">
                            <Clock size={12} className="opacity-50" />
                            {new Date(eng.targetDate).toLocaleDateString(
                              "en-GB",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <Link
                          href={`/admin-portal/clients/${eng.userId}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-(--color-navy) hover:text-navy-dark rounded-lg px-3 py-1.5 hover:bg-(--color-navy-light) transition-colors opacity-70 group-hover:opacity-100"
                        >
                          View <ArrowRight size={12} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
