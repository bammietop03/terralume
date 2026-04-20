import { redirect } from "next/navigation";
import { requireClient } from "@/app/actions/auth";
import ProfileForm from "@/components/portal/ProfileForm";

export const metadata = { title: "Profile — Terralume Client Portal" };

export default async function ProfilePage() {
  const user = await requireClient().catch(() => null);
  if (!user) redirect("/login");

  return (
    <div className="mx-auto max-w-5xl px-6 py-8 space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-muted mb-1">
          Account
        </p>
        <h1 className="font-display text-2xl font-bold text-on-surface">
          Your profile
        </h1>
        <p className="text-sm text-on-surface-muted mt-1">
          Update your personal information and profile photo.
        </p>
      </div>

      <ProfileForm
        user={{
          id: user.id,
          fullName: user.fullName,
          preferredName: user.preferredName,
          email: user.email,
          phone: user.phone,
          nationality: user.nationality,
          location: user.location,
          photoUrl: user.photoUrl,
          role: user.role,
        }}
      />
    </div>
  );
}
