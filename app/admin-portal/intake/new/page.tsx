import { redirect } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/app/actions/auth";
import { getClientUsers, getMyAssignedClients } from "@/app/actions/users";
import AdminIntakeForm from "@/components/portal/admin/AdminIntakeForm";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "New Intake — Terralume Admin Portal",
};

export default async function AdminIntakeNewPage() {
  const user = await requireAdmin().catch(() => null);
  if (!user) redirect("/admin-login");

  const clients =
    user.role === "PM" ? await getMyAssignedClients() : await getClientUsers();

  const clientOptions = clients.map((c) => ({
    id: c.id,
    fullName: c.fullName,
    email: c.email,
    phone: c.phone,
    nationality: c.nationality,
    location: c.location,
    preferredName: c.preferredName,
  }));

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-6 py-8">
      <div>
        <Link
          href="/admin-portal/intake"
          className="mb-4 inline-flex items-center gap-1.5 text-xs text-on-surface-muted transition-colors hover:text-on-surface"
        >
          <ArrowLeft size={13} />
          All intake forms
        </Link>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-on-surface-muted">
          New intake
        </p>
        <h1 className="font-display text-2xl font-bold text-on-surface">
          Submit intake on behalf of client
        </h1>
        <p className="mt-1 text-sm text-on-surface-muted">
          Select a client, then complete the brief. Their profile details will
          be pre-filled automatically.
        </p>
      </div>

      <AdminIntakeForm clients={clientOptions} />
    </div>
  );
}
