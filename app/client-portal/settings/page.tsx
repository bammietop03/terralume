import { redirect } from "next/navigation";
import { requireClient } from "@/app/actions/auth";
import PasswordForm from "@/components/portal/PasswordForm";

export const metadata = { title: "Settings — Terralume Client Portal" };

export default async function ClientSettingsPage() {
  const user = await requireClient().catch(() => null);
  if (!user) redirect("/login");

  return (
    <div className="mx-auto max-w-5xl px-6 py-8 space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-muted mb-1">
          Account
        </p>
        <h1 className="font-display text-2xl font-bold text-on-surface">
          Settings
        </h1>
        <p className="text-sm text-on-surface-muted mt-1">
          Manage your account security and preferences.
        </p>
      </div>

      <PasswordForm />
    </div>
  );
}
