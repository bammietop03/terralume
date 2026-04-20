import { redirect } from "next/navigation";
import { requireRole } from "@/app/actions/auth";
import { getClientUsers } from "@/app/actions/users";
import UsersTable from "@/components/portal/admin/UsersTable";
import { Users, CheckCircle2, Clock } from "lucide-react";

export const metadata = { title: "Client Accounts — Terralume Admin Portal" };

export default async function ClientAccountsPage() {
  const user = await requireRole("ADMIN").catch(() => null);
  if (!user) redirect("/admin-login");

  const users = await getClientUsers();

  const total = users.length;
  const onboarded = users.filter((u) => u.onboardingComplete).length;
  const pending = total - onboarded;

  const stats = [
    {
      label: "Total clients",
      value: total,
      icon: Users,
      iconBg: "bg-(--color-navy-light)",
      iconColor: "text-(--color-navy)",
    },
    {
      label: "Onboarded",
      value: onboarded,
      icon: CheckCircle2,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      label: "Pending onboarding",
      value: pending,
      icon: Clock,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
  ];

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-muted mb-1">
            User Management
          </p>
          <h1 className="font-display text-2xl font-bold text-on-surface">
            Client Accounts
          </h1>
          <p className="text-sm text-on-surface-muted mt-1">
            Manage all client users — add, edit, view details, or remove
            accounts.
          </p>
        </div>
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

      <UsersTable initialUsers={users} segment="clients" />
    </div>
  );
}
