import { redirect } from "next/navigation";
import { requireClient } from "@/app/actions/auth";
import { User, Phone, MapPin, Globe } from "lucide-react";

export const metadata = { title: "Profile — Terralume Client Portal" };

export default async function ProfilePage() {
  const user = await requireClient().catch(() => null);
  if (!user) redirect("/login");

  const fields = [
    { label: "Full name", value: user.fullName, icon: <User size={15} /> },
    {
      label: "Preferred name",
      value: user.preferredName,
      icon: <User size={15} />,
    },
    { label: "Email", value: user.email, icon: null },
    { label: "Phone", value: user.phone, icon: <Phone size={15} /> },
    { label: "Location", value: user.location, icon: <MapPin size={15} /> },
    {
      label: "Nationality",
      value: user.nationality,
      icon: <Globe size={15} />,
    },
  ];

  return (
    <div className="px-6 py-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-muted mb-1">
          Profile
        </p>
        <h1 className="font-display text-2xl font-bold text-on-surface">
          Your Profile
        </h1>
      </div>

      <div className="rounded-2xl border border-divider bg-surface p-6 shadow-sm space-y-4">
        {/* Avatar */}
        <div className="flex items-center gap-4 pb-4 border-b border-divider">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[--color-navy] text-white text-2xl font-semibold uppercase">
            {(user.fullName ?? user.email).charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-on-surface">
              {user.fullName ?? "—"}
            </p>
            <p className="text-sm text-on-surface-muted">{user.email}</p>
          </div>
        </div>

        {/* Fields */}
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map((f) => (
            <div key={f.label}>
              <dt className="text-xs font-medium text-on-surface-muted mb-0.5">
                {f.label}
              </dt>
              <dd className="text-sm text-on-surface">
                {f.value ?? <span className="text-on-surface-muted">—</span>}
              </dd>
            </div>
          ))}
        </dl>

        <p className="text-xs text-on-surface-muted pt-2">
          To update your profile details, please contact your PM.
        </p>
      </div>
    </div>
  );
}
