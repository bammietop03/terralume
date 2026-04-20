import { redirect } from "next/navigation";
import Link from "next/link";
import { requireClient } from "@/app/actions/auth";
import { getNotifications } from "@/app/actions/notifications";
import { Bell } from "lucide-react";

export const metadata = { title: "Notifications — Terralume Client Portal" };

export default async function NotificationsPage() {
  const user = await requireClient().catch(() => null);
  if (!user) redirect("/login");

  const notifications = await getNotifications(user.id);

  return (
    <div className="px-6 py-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-muted mb-1">
          Notifications
        </p>
        <h1 className="font-display text-2xl font-bold text-on-surface">
          All Notifications
        </h1>
      </div>

      {notifications.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-divider bg-surface p-16 text-center shadow-sm">
          <Bell size={32} className="text-on-surface-muted mx-auto mb-3" />
          <p className="text-sm text-on-surface-muted">No notifications yet.</p>
        </div>
      ) : (
        <ul className="divide-y divide-divider rounded-2xl border border-divider bg-surface shadow-sm overflow-hidden">
          {notifications.map((n) => (
            <li
              key={n.id}
              className={`px-5 py-4 ${!n.read ? "bg-[--color-navy-light]/30" : ""}`}
            >
              <p
                className={`text-sm ${!n.read ? "font-medium text-on-surface" : "text-on-surface-muted"}`}
              >
                {n.content}
              </p>
              <time className="mt-1 block text-xs text-on-surface-muted">
                {new Date(n.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </time>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
