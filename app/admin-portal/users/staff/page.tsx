import { redirect } from "next/navigation";
import { requireRole } from "@/app/actions/auth";
import { getStaffUsers } from "@/app/actions/users";
import UsersTable from "@/components/portal/admin/UsersTable";

export const metadata = { title: "Staff Management — Terralume Admin Portal" };

export default async function StaffManagementPage() {
  const user = await requireRole("ADMIN").catch(() => null);
  if (!user) redirect("/admin-login");

  const users = await getStaffUsers();

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-muted mb-1">
          User Management
        </p>
        <h1 className="font-display text-2xl font-bold text-on-surface">
          Staff Management
        </h1>
        <p className="text-sm text-on-surface-muted mt-1">
          Manage project managers and administrators — add, edit, view details,
          or remove staff accounts.
        </p>
      </div>

      <UsersTable initialUsers={users} segment="staff" />
    </div>
  );
}
