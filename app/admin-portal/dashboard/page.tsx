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
  FileQuestion,
  ArrowRight,
  Clock,
  TrendingUp,
  Sparkles,
  ClipboardList,
  MessageSquare,
  Calendar,
  FileText,
  CheckCircle2,
  BarChart3,
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

const STAGE_ORDER = [
  "discovery",
  "brief_confirmation",
  "area_shortlisting",
  "property_search",
  "due_diligence",
  "offer_negotiation",
  "legal_completion",
  "handover",
];

const stageBarColor: Record<string, string> = {
  discovery: "bg-slate-400",
  brief_confirmation: "bg-blue-400",
  area_shortlisting: "bg-purple-500",
  property_search: "bg-indigo-500",
  due_diligence: "bg-amber-500",
  offer_negotiation: "bg-orange-500",
  legal_completion: "bg-green-500",
  handover: "bg-emerald-500",
};

function fmtCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function fmtRelative(date: Date | string | null): string {
  if (!date) return "";
  const d = new Date(date);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

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
  href,
  sub,
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  gradient: string;
  iconBg: string;
  href?: string;
  sub?: string;
}) {
  const inner = (
    <div className="group relative overflow-hidden rounded-2xl border border-white/60 bg-white/80 backdrop-blur-sm p-5 shadow-[0_1px_3px_rgba(27,42,107,0.06),0_8px_24px_rgba(27,42,107,0.04)] hover:shadow-[0_4px_12px_rgba(27,42,107,0.1),0_12px_32px_rgba(27,42,107,0.06)] transition-all duration-300 hover:-translate-y-0.5">
      <div className={`absolute inset-x-0 top-0 h-1 ${gradient}`} />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-muted/80 mb-2">
            {label}
          </p>
          <p className="font-display text-3xl font-bold text-on-surface tracking-tight">
            {value}
          </p>
          {sub && <p className="text-xs text-on-surface-muted mt-1">{sub}</p>}
        </div>
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-2xl ${iconBg} shadow-sm ring-1 ring-black/3`}
        >
          {icon}
        </div>
      </div>
    </div>
  );

  if (href)
    return (
      <Link href={href} className="block">
        {inner}
      </Link>
    );
  return inner;
}

export default async function AdminDashboardPage() {
  const user = await requireAdmin().catch(() => null);
  if (!user) redirect("/login");

  const isAdmin = user.role === "ADMIN";

  const [adminStats, pmData] = await Promise.all([
    isAdmin ? getAdminDashboardStats() : null,
    !isAdmin ? getPMDashboardData(user.id) : null,
  ]);

  // ── Admin view ────────────────────────────────────────────────────────────
  if (isAdmin && adminStats) {
    const maxStageCount = Math.max(
      ...adminStats.stageCounts.map((s) => s.count),
      1,
    );

    return (
      <>
        <div className="px-6 pt-8 pb-2 max-w-7xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-(--color-gold) mb-1">
            Admin Portal
          </p>
          <h1 className="font-display text-2xl font-bold text-on-surface">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-on-surface-muted">
            System-wide overview of engagements, leads, and platform activity.
          </p>
        </div>

        <div className="px-6 py-6 max-w-7xl mx-auto space-y-6">
          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
            <StatCard
              label="Active engagements"
              value={adminStats.activeEngagements}
              icon={<Briefcase size={18} className="text-(--color-navy)" />}
              gradient="bg-linear-to-r from-(--color-navy) to-(--color-navy-light)"
              iconBg="bg-(--color-navy-light)"
              href="/admin-portal/engagements"
            />
            <StatCard
              label="Total clients"
              value={adminStats.totalClients}
              icon={<Users size={18} className="text-purple-600" />}
              gradient="bg-linear-to-r from-purple-500 to-purple-200"
              iconBg="bg-purple-50"
              href="/admin-portal/users/clients"
            />
            <StatCard
              label="Open enquiries"
              value={adminStats.openEnquiries}
              icon={<FileQuestion size={18} className="text-(--color-gold)" />}
              gradient="bg-linear-to-r from-(--color-gold) to-(--color-gold-light)"
              iconBg="bg-(--color-gold-light)"
            />
            <StatCard
              label="New leads (7d)"
              value={adminStats.newLeads}
              icon={<Sparkles size={18} className="text-indigo-600" />}
              gradient="bg-linear-to-r from-indigo-500 to-indigo-200"
              iconBg="bg-indigo-50"
              href="/admin-portal/leads"
            />
            <StatCard
              label="Pending intakes"
              value={adminStats.pendingIntakes}
              icon={<ClipboardList size={18} className="text-teal-600" />}
              gradient="bg-linear-to-r from-teal-500 to-teal-200"
              iconBg="bg-teal-50"
              href="/admin-portal/intake"
            />
          </div>

          {/* Middle row: Pipeline + Activity */}
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
            {/* Stage Pipeline */}
            <div className="xl:col-span-3 rounded-2xl border border-white/60 bg-white/80 backdrop-blur-sm shadow-[0_1px_3px_rgba(27,42,107,0.06),0_8px_24px_rgba(27,42,107,0.04)] overflow-hidden">
              <div className="h-1 bg-linear-to-r from-(--color-navy) via-indigo-400 to-(--color-gold)" />
              <div className="px-6 py-5">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-linear-to-br from-(--color-navy) to-(--color-navy-dark) text-white shadow-sm">
                      <BarChart3 size={14} />
                    </div>
                    <h2 className="text-sm font-semibold text-on-surface">
                      Engagement Pipeline
                    </h2>
                  </div>
                  <span className="text-xs text-on-surface-muted">
                    {adminStats.activeEngagements} active
                  </span>
                </div>

                {adminStats.stageCounts.length === 0 ? (
                  <p className="text-sm text-on-surface-muted text-center py-6">
                    No active engagements
                  </p>
                ) : (
                  <div className="space-y-3">
                    {STAGE_ORDER.filter((s) =>
                      adminStats.stageCounts.some((sc) => sc.stage === s),
                    ).map((stageKey) => {
                      const sc = adminStats.stageCounts.find(
                        (s) => s.stage === stageKey,
                      );
                      const count = sc?.count ?? 0;
                      const pct = Math.round((count / maxStageCount) * 100);
                      return (
                        <div key={stageKey} className="flex items-center gap-3">
                          <span className="text-xs text-on-surface-muted w-36 shrink-0 truncate">
                            {STAGE_LABELS[stageKey] ?? stageKey}
                          </span>
                          <div className="flex-1 h-2 rounded-full bg-(--color-navy-light) overflow-hidden">
                            <div
                              className={`h-full rounded-full ${stageBarColor[stageKey] ?? "bg-(--color-navy)"} transition-all duration-500`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-on-surface w-5 text-right shrink-0">
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {adminStats.totalRevenue > 0 && (
                  <div className="mt-5 pt-4 border-t border-divider/40 flex items-center justify-between">
                    <span className="text-xs text-on-surface-muted font-medium">
                      Total revenue collected
                    </span>
                    <span className="text-sm font-bold text-(--color-navy)">
                      {fmtCurrency(
                        adminStats.totalRevenue,
                        adminStats.currency,
                      )}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="xl:col-span-2 rounded-2xl border border-white/60 bg-white/80 backdrop-blur-sm shadow-[0_1px_3px_rgba(27,42,107,0.06),0_8px_24px_rgba(27,42,107,0.04)] overflow-hidden">
              <div className="h-1 bg-linear-to-r from-(--color-gold) to-(--color-navy-light)" />
              <div className="px-6 py-5">
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-linear-to-br from-(--color-gold) to-[#6d1220] text-white shadow-sm">
                    <FileText size={14} />
                  </div>
                  <h2 className="text-sm font-semibold text-on-surface">
                    Recent Updates
                  </h2>
                </div>

                {adminStats.recentUpdates.length === 0 ? (
                  <p className="text-sm text-on-surface-muted text-center py-6">
                    No updates published yet
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {adminStats.recentUpdates.map((update) => (
                      <li
                        key={update.id}
                        className="flex items-start gap-3 py-1"
                      >
                        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-(--color-navy-light) text-[10px] font-bold text-(--color-navy) uppercase">
                          {(
                            update.engagement.user?.fullName ??
                            update.engagement.user?.email ??
                            "?"
                          )
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-on-surface truncate">
                            {update.engagement.user?.fullName ??
                              update.engagement.user?.email ??
                              "Unknown"}
                          </p>
                          <p className="text-xs text-on-surface-muted line-clamp-1">
                            {update.content}
                          </p>
                        </div>
                        <span className="text-[10px] text-on-surface-muted shrink-0 mt-0.5">
                          {fmtRelative(update.publishedAt)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Active Engagements table */}
          <div className="rounded-2xl border border-white/60 bg-white/80 backdrop-blur-sm shadow-[0_1px_3px_rgba(27,42,107,0.06),0_8px_24px_rgba(27,42,107,0.04)] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-divider/60">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-linear-to-br from-(--color-navy) to-(--color-navy-dark) text-white shadow-sm">
                  <TrendingUp size={14} />
                </div>
                <h2 className="text-sm font-semibold text-on-surface">
                  Active Engagements
                </h2>
              </div>
              <Link
                href="/admin-portal/engagements"
                className="flex items-center gap-1.5 text-xs text-(--color-navy) font-semibold hover:text-navy-dark rounded-lg px-3 py-1.5 hover:bg-(--color-navy-light) transition-colors"
              >
                View all <ArrowRight size={12} />
              </Link>
            </div>

            {adminStats.recentEngagements.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-(--color-navy-light)/60">
                  <Briefcase size={20} className="text-navy/50" />
                </div>
                <p className="text-sm font-medium text-on-surface-muted">
                  No active engagements
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
                      <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-on-surface-muted uppercase tracking-wider hidden lg:table-cell">
                        Target
                      </th>
                      <th className="px-4 py-3.5" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-divider/40">
                    {adminStats.recentEngagements.map((eng) => (
                      <tr
                        key={eng.id}
                        className="group hover:bg-navy-light/20 transition-colors"
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
                        <td className="px-4 py-4 hidden lg:table-cell">
                          {eng.targetDate ? (
                            <span className="flex items-center gap-1.5 text-xs text-on-surface-muted">
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
                            href={`/admin-portal/engagements/${eng.id}`}
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

  // ── PM view ───────────────────────────────────────────────────────────────
  const pmEngagements = pmData!.engagements;
  const firstName =
    user.preferredName ?? user.fullName?.split(" ")[0] ?? "there";

  return (
    <>
      <div className="px-6 pt-8 pb-2 max-w-7xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-(--color-gold) mb-1">
          PM Portal
        </p>
        <h1 className="font-display text-2xl font-bold text-on-surface">
          Welcome back, {firstName}
        </h1>
        <p className="mt-1 text-sm text-on-surface-muted">
          Your client engagements and pending tasks at a glance.
        </p>
      </div>

      <div className="px-6 py-6 max-w-7xl mx-auto space-y-6">
        {/* PM Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-2 gap-4">
          <StatCard
            label="My active clients"
            value={pmEngagements.length}
            icon={<Users size={18} className="text-(--color-navy)" />}
            gradient="bg-linear-to-r from-(--color-navy) to-(--color-navy-light)"
            iconBg="bg-(--color-navy-light)"
          />
          <StatCard
            label="Unread messages"
            value={pmData!.unreadMessages}
            icon={<MessageSquare size={18} className="text-teal-600" />}
            gradient="bg-linear-to-r from-teal-500 to-teal-200"
            iconBg="bg-teal-50"
            href="/admin-portal/messages"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* My Clients list */}
          <div className="xl:col-span-2 rounded-2xl border border-white/60 bg-white/80 backdrop-blur-sm shadow-[0_1px_3px_rgba(27,42,107,0.06),0_8px_24px_rgba(27,42,107,0.04)] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-divider/60">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-linear-to-br from-(--color-navy) to-(--color-navy-dark) text-white shadow-sm">
                  <Briefcase size={14} />
                </div>
                <h2 className="text-sm font-semibold text-on-surface">
                  My Engagements
                </h2>
              </div>
              <Link
                href="/admin-portal/engagements"
                className="flex items-center gap-1.5 text-xs text-(--color-navy) font-semibold hover:text-navy-dark rounded-lg px-3 py-1.5 hover:bg-(--color-navy-light) transition-colors"
              >
                View all <ArrowRight size={12} />
              </Link>
            </div>

            {pmEngagements.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-(--color-navy-light)/60">
                  <Briefcase size={20} className="text-navy/50" />
                </div>
                <p className="text-sm font-medium text-on-surface-muted">
                  No active engagements assigned
                </p>
              </div>
            ) : (
              <div className="divide-y divide-divider/40">
                {pmEngagements.map((eng) => {
                  const lastUpdate = eng.updates[0]?.publishedAt;
                  return (
                    <div
                      key={eng.id}
                      className="flex items-center gap-4 px-6 py-4 hover:bg-navy-light/20 transition-colors group"
                    >
                      <div className="h-10 w-10 shrink-0 rounded-full bg-linear-to-br from-(--color-navy) to-(--color-navy-dark) flex items-center justify-center text-white text-sm font-bold shadow-sm">
                        {(eng.user?.fullName ?? eng.user?.email ?? "?")
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-on-surface truncate">
                          {eng.user?.fullName ?? eng.user?.email ?? "—"}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${stagePill[eng.stage] ?? "bg-surface-card text-on-surface-muted border border-divider/60"}`}
                          >
                            {STAGE_LABELS[eng.stage] ?? eng.stage}
                          </span>
                          {lastUpdate && (
                            <span className="text-[11px] text-on-surface-muted">
                              Updated {fmtRelative(lastUpdate)}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Link
                          href={`/admin-portal/engagements/${eng.id}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-(--color-navy) hover:text-navy-dark rounded-lg px-3 py-1.5 hover:bg-(--color-navy-light) transition-colors opacity-0 group-hover:opacity-100"
                        >
                          Open <ArrowRight size={11} />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right column: Meetings + Quick links */}
          <div className="flex flex-col gap-5">
            <div className="rounded-2xl border border-white/60 bg-white/80 backdrop-blur-sm shadow-[0_1px_3px_rgba(27,42,107,0.06),0_8px_24px_rgba(27,42,107,0.04)] overflow-hidden">
              <div className="h-1 bg-linear-to-r from-(--color-gold) to-(--color-navy-light)" />
              <div className="px-6 py-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-linear-to-br from-(--color-gold) to-[#6d1220] text-white shadow-sm">
                    <Calendar size={14} />
                  </div>
                  <h2 className="text-sm font-semibold text-on-surface">
                    Upcoming Meetings
                  </h2>
                </div>

                {pmData!.upcomingMeetings.length === 0 ? (
                  <p className="text-sm text-on-surface-muted">
                    No upcoming meetings scheduled.
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {pmData!.upcomingMeetings.map((m) => (
                      <li
                        key={m.id}
                        className="rounded-xl border border-divider/60 p-3 bg-white/60"
                      >
                        <p className="text-xs font-semibold text-on-surface">
                          {m.title ?? "Strategy Meeting"}
                        </p>
                        <p className="text-xs text-on-surface-muted mt-0.5">
                          {m.engagement.user?.fullName ??
                            m.engagement.user?.email}
                        </p>
                        <p className="text-xs font-medium text-(--color-navy) mt-1">
                          {new Date(m.scheduledAt).toLocaleDateString("en-GB", {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="rounded-2xl bg-linear-to-br from-(--color-navy-dark) to-[#0d1940] p-5 shadow-[0_1px_3px_rgba(27,42,107,0.1),0_8px_24px_rgba(27,42,107,0.08)] ring-1 ring-white/5">
              <p className="text-xs font-semibold uppercase tracking-wide text-white/50 mb-3">
                Quick Actions
              </p>
              <div className="space-y-1">
                {[
                  {
                    label: "View all leads",
                    href: "/admin-portal/leads",
                    icon: <Sparkles size={14} />,
                  },
                  {
                    label: "Review intakes",
                    href: "/admin-portal/intake",
                    icon: <ClipboardList size={14} />,
                  },
                  {
                    label: "Messages",
                    href: "/admin-portal/messages",
                    icon: <MessageSquare size={14} />,
                  },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
                  >
                    <span className="opacity-60">{item.icon}</span>
                    {item.label}
                    <ArrowRight size={12} className="ml-auto opacity-40" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
