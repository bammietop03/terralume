import { redirect } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/app/actions/auth";
import { prisma } from "@/lib/prisma";
import {
  Users,
  Briefcase,
  FileQuestion,
  CheckCircle2,
  ListTodo,
  FolderKanban,
  TrendingUp,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Dashboard — Terralume Admin Portal" };

function StatCard({
  label,
  value,
  icon: Icon,
  href,
  color = "navy",
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  href?: string;
  color?: string;
}) {
  const content = (
    <Card
      className={
        href ? "hover:bg-surface-alt/50 cursor-pointer transition-colors" : ""
      }
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-on-surface-muted font-medium">{label}</p>
            <p className="text-3xl font-bold text-on-surface mt-2">{value}</p>
          </div>
          <div
            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${
              color === "navy"
                ? "bg-navy/10 text-navy"
                : color === "blue"
                  ? "bg-blue-50 text-blue-600"
                  : color === "emerald"
                    ? "bg-emerald-50 text-emerald-600"
                    : color === "amber"
                      ? "bg-amber-50 text-amber-600"
                      : "bg-zinc-100 text-zinc-600"
            }`}
          >
            <Icon size={24} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}

export default async function AdminDashboardPage() {
  const user = await requireAdmin();

  if (user.role === "PM") {
    const [
      myEngagementsCount,
      activeEngagementsCount,
      pendingTasksCount,
      myEngagements,
    ] = await Promise.all([
      prisma.engagement.count({ where: { pmId: user.id } }),
      prisma.engagement.count({ where: { pmId: user.id, status: "ACTIVE" } }),
      prisma.task.count({
        where: {
          engagement: { pmId: user.id },
          status: { in: ["PENDING", "SUBMITTED"] },
        },
      }),
      prisma.engagement.findMany({
        where: { pmId: user.id },
        include: {
          user: {
            select: {
              fullName: true,
              preferredName: true,
            },
          },
          service: {
            select: {
              name: true,
            },
          },
          projectStages: {
            select: {
              status: true,
            },
          },
        },
        orderBy: { updatedAt: "desc" },
        take: 8,
      }),
    ]);

    return (
      <>
        <div className="px-6 pt-8 pb-2 max-w-7xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold mb-1">
            PM Portal
          </p>
          <h1 className="font-display text-2xl font-bold text-on-surface">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-on-surface-muted">
            Your engagements at a glance.
          </p>
        </div>

        <div className="px-6 py-6 max-w-7xl mx-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              label="My Engagements"
              value={myEngagementsCount}
              icon={FolderKanban}
              href="/admin-portal/engagements"
              color="navy"
            />
            <StatCard
              label="Active"
              value={activeEngagementsCount}
              icon={Briefcase}
              href="/admin-portal/engagements"
              color="blue"
            />
            <StatCard
              label="Pending Tasks"
              value={pendingTasksCount}
              icon={ListTodo}
              href="/admin-portal/engagements"
              color="amber"
            />
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">My Engagements</CardTitle>
              <Link
                href="/admin-portal/engagements"
                className="text-xs text-navy hover:underline font-medium"
              >
                View all →
              </Link>
            </CardHeader>
            <CardContent>
              {myEngagements.length === 0 ? (
                <p className="text-sm text-on-surface-muted italic text-center py-4">
                  No engagements assigned yet
                </p>
              ) : (
                <div className="space-y-3">
                  {myEngagements.map((engagement) => {
                    const clientName =
                      engagement.user.preferredName ||
                      engagement.user.fullName ||
                      "Client";
                    const completedStages = engagement.projectStages.filter(
                      (s) => s.status === "COMPLETED",
                    ).length;
                    const totalStages = engagement.projectStages.length;
                    const progress =
                      totalStages > 0
                        ? Math.round((completedStages / totalStages) * 100)
                        : 0;

                    return (
                      <Link
                        key={engagement.id}
                        href={`/admin-portal/engagements/${engagement.id}`}
                        className="flex items-center justify-between gap-3 rounded-lg border border-divider p-3 hover:bg-surface-alt/50 transition-colors"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-semibold text-on-surface truncate">
                              {clientName}
                            </p>
                            <Badge
                              variant="outline"
                              className="text-xs shrink-0"
                            >
                              {engagement.service?.name ?? "Unknown Service"}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-32 h-1.5 bg-zinc-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-navy transition-all"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <span className="text-xs text-on-surface-muted">
                              {progress}%
                            </span>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {engagement.status}
                        </Badge>
                      </Link>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  // Fetch dashboard metrics
  const [
    totalProjects,
    activeProjects,
    completedProjectsCount,
    pendingIntakeCount,
    totalClientsCount,
    pendingTasksCount,
    realEstateCount,
    energyCount,
    integratedCount,
    recentProjects,
    pmWorkload,
  ] = await Promise.all([
    // Total projects
    prisma.engagement.count(),

    // Active projects
    prisma.engagement.count({
      where: { status: "ACTIVE" },
    }),

    // Completed projects (all stages completed)
    prisma.engagement.count({
      where: {
        projectStages: {
          every: {
            status: "COMPLETED",
          },
        },
      },
    }),

    // Pending intake forms
    prisma.intakeSubmission.count({
      where: { status: "PENDING" },
    }),

    // Total clients
    prisma.user.count({
      where: { role: "CLIENT" },
    }),

    // Pending tasks
    prisma.task.count({
      where: {
        status: {
          in: ["PENDING", "SUBMITTED"],
        },
      },
    }),

    // Projects by service type
    prisma.engagement.count({
      where: {
        service: {
          type: "REAL_ESTATE",
        },
      },
    }),

    prisma.engagement.count({
      where: {
        service: {
          type: "RENEWABLE_ENERGY",
        },
      },
    }),

    prisma.engagement.count({
      where: {
        service: {
          type: "INTEGRATED",
        },
      },
    }),

    // Recent projects
    prisma.engagement.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            fullName: true,
            preferredName: true,
          },
        },
        service: {
          select: {
            name: true,
            type: true,
          },
        },
        pm: {
          select: {
            fullName: true,
            preferredName: true,
          },
        },
        projectStages: {
          select: {
            status: true,
          },
        },
      },
    }),

    // PM workload
    prisma.user.findMany({
      where: { role: { in: ["PM", "ADMIN"] } },
      select: {
        id: true,
        fullName: true,
        preferredName: true,
        _count: {
          select: {
            managedEngagements: {
              where: {
                status: "ACTIVE",
              },
            },
          },
        },
      },
    }),
  ]);

  return (
    <>
      <div className="px-6 pt-8 pb-2 max-w-7xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold mb-1">
          Admin Portal
        </p>
        <h1 className="font-display text-2xl font-bold text-on-surface">
          Dashboard Overview
        </h1>
        <p className="mt-1 text-sm text-on-surface-muted">
          Track your project portfolio and team performance
        </p>
      </div>

      <div className="px-6 py-6 max-w-7xl mx-auto space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Projects"
            value={totalProjects}
            icon={FolderKanban}
            href="/admin-portal/engagements"
            color="navy"
          />
          <StatCard
            label="Active Projects"
            value={activeProjects}
            icon={Briefcase}
            href="/admin-portal/engagements"
            color="blue"
          />
          <StatCard
            label="Completed"
            value={completedProjectsCount}
            icon={CheckCircle2}
            color="emerald"
          />
          <StatCard
            label="Pending Intakes"
            value={pendingIntakeCount}
            icon={FileQuestion}
            href="/admin-portal/intake"
            color="amber"
          />
        </div>

        {/* Secondary stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            label="Total Clients"
            value={totalClientsCount}
            icon={Users}
            href="/admin-portal/users"
          />
          <StatCard
            label="Pending Tasks"
            value={pendingTasksCount}
            icon={ListTodo}
          />
          <StatCard
            label="Project Growth"
            value={`+${Math.round((activeProjects / Math.max(totalProjects, 1)) * 100)}%`}
            icon={TrendingUp}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Projects by Service */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Projects by Service</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-navy"></div>
                    <span className="text-sm text-on-surface">Real Estate</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-zinc-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-navy"
                        style={{
                          width: `${(realEstateCount / Math.max(totalProjects, 1)) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-on-surface w-8 text-right">
                      {realEstateCount}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span className="text-sm text-on-surface">
                      Renewable Energy
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-zinc-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500"
                        style={{
                          width: `${(energyCount / Math.max(totalProjects, 1)) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-on-surface w-8 text-right">
                      {energyCount}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span className="text-sm text-on-surface">Integrated</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-zinc-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500"
                        style={{
                          width: `${(integratedCount / Math.max(totalProjects, 1)) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-on-surface w-8 text-right">
                      {integratedCount}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* PM Workload */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">PM Workload</CardTitle>
            </CardHeader>
            <CardContent>
              {pmWorkload.length === 0 ? (
                <p className="text-sm text-on-surface-muted italic text-center py-4">
                  No project managers yet
                </p>
              ) : (
                <div className="space-y-3">
                  {pmWorkload.map((pm) => (
                    <div
                      key={pm.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy/10 text-xs font-bold text-navy uppercase">
                          {pm.fullName?.charAt(0) ?? "PM"}
                        </div>
                        <span className="text-sm text-on-surface">
                          {pm.preferredName || pm.fullName}
                        </span>
                      </div>
                      <Badge variant="outline">
                        {pm._count.managedEngagements} active
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Projects */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Recent Projects</CardTitle>
              <Link
                href="/admin-portal/engagements"
                className="text-xs text-navy hover:underline font-medium"
              >
                View all →
              </Link>
            </CardHeader>
            <CardContent>
              {recentProjects.length === 0 ? (
                <p className="text-sm text-on-surface-muted italic text-center py-4">
                  No projects yet
                </p>
              ) : (
                <div className="space-y-3">
                  {recentProjects.map((project) => {
                    const clientName =
                      project.user.preferredName ||
                      project.user.fullName ||
                      "Client";
                    const completedStages = project.projectStages.filter(
                      (s) => s.status === "COMPLETED",
                    ).length;
                    const totalStages = project.projectStages.length;
                    const progress =
                      totalStages > 0
                        ? Math.round((completedStages / totalStages) * 100)
                        : 0;

                    return (
                      <Link
                        key={project.id}
                        href={`/admin-portal/engagements/${project.id}`}
                        className="flex items-center justify-between p-3 rounded-lg border border-divider hover:bg-surface-alt/50 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-semibold text-on-surface truncate">
                              {clientName}
                            </p>
                            <Badge
                              variant="outline"
                              className="text-xs shrink-0"
                            >
                              {project.service?.name ?? "Unknown Service"}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-32 h-1.5 bg-zinc-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-navy transition-all"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <span className="text-xs text-on-surface-muted">
                              {progress}%
                            </span>
                          </div>
                        </div>
                        {project.pm && (
                          <div className="ml-4 flex items-center gap-2 text-xs text-on-surface-muted">
                            <span>PM:</span>
                            <span className="font-medium">
                              {project.pm.preferredName || project.pm.fullName}
                            </span>
                          </div>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <Link href="/admin-portal/intake">
            <button className="px-4 py-2 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors text-sm font-medium">
              Review Pending Intakes
            </button>
          </Link>
          <Link href="/admin-portal/engagements">
            <button className="px-4 py-2 rounded-lg bg-navy text-white hover:bg-navy-dark transition-colors text-sm font-medium">
              View All Projects
            </button>
          </Link>
          <Link href="/admin-portal/users">
            <button className="px-4 py-2 rounded-lg bg-surface border border-divider text-on-surface hover:bg-surface-alt transition-colors text-sm font-medium">
              Manage Users
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}
