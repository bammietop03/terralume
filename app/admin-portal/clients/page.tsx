import { redirect } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/app/actions/auth";
import { getMyAssignedClients } from "@/app/actions/users";
import { Users, CheckCircle2, Clock, Eye } from "lucide-react";

export const metadata = { title: "My Clients — Terralume PM Portal" };

function formatDate(date: Date | string | null) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function MyClientsPage() {
  const user = await requireAdmin().catch(() => null);
  if (!user) redirect("/admin-login");

  const clients = await getMyAssignedClients();

  const total = clients.length;
  const onboarded = clients.filter((c) => c.onboardingComplete).length;
  const pending = total - onboarded;

  const stats = [
    {
      label: "My clients",
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
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-muted mb-1">
          My Clients
        </p>
        <h1 className="font-display text-2xl font-bold text-on-surface">
          My Clients
        </h1>
        <p className="text-sm text-on-surface-muted mt-1">
          Clients currently assigned to you.
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
      <div className="overflow-hidden rounded-2xl border border-divider bg-surface shadow-sm">
        {clients.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <Users size={32} className="text-on-surface-muted opacity-40" />
            <p className="text-sm font-medium text-on-surface-muted">
              No clients assigned yet
            </p>
            <p className="text-xs text-on-surface-muted">
              Clients assigned to you will appear here.
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
                    Location
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-on-surface-muted">
                    Onboarding
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-on-surface-muted">
                    Joined
                  </th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-divider">
                {clients.map((client) => (
                  <tr
                    key={client.id}
                    className="transition-colors hover:bg-surface-alt"
                  >
                    <td className="px-5 py-3.5 font-medium text-on-surface">
                      {client.fullName ?? "—"}
                      {client.preferredName && (
                        <span className="ml-1.5 text-xs text-on-surface-muted">
                          ({client.preferredName})
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-on-surface">{client.email}</p>
                      {client.phone && (
                        <p className="text-xs text-on-surface-muted">
                          {client.phone}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-on-surface-muted">
                      {client.location ?? "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      {client.onboardingComplete ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 border border-emerald-200">
                          <CheckCircle2 size={10} />
                          Complete
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 border border-amber-200">
                          <Clock size={10} />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-on-surface-muted">
                      {formatDate(client.createdAt)}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link
                        href={`/admin-portal/users/clients`}
                        className="inline-flex items-center gap-1 rounded-lg border border-divider bg-white px-3 py-1.5 text-xs font-medium text-on-surface shadow-sm transition-colors hover:bg-surface-alt"
                      >
                        <Eye size={12} />
                        View
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
  );
}
