import { redirect } from "next/navigation";
import { requireAdmin } from "@/app/actions/auth";
import { getNotifications } from "@/app/actions/notifications";
import { getUnreadMessageCount } from "@/app/actions/admin";
import PortalShell from "@/components/portal/PortalShell";
import type { Notification } from "@/types";

export default async function AdminPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin().catch(() => null);
  if (!user) redirect("/admin-login");

  const [notifications, unreadMessages] = await Promise.all([
    getNotifications(user.id) as Promise<Notification[]>,
    getUnreadMessageCount(),
  ]);

  return (
    <PortalShell
      role={user.role}
      userEmail={user.email}
      userName={user.fullName}
      preferredName={user.preferredName}
      userId={user.id}
      photoUrl={user.photoUrl}
      initialNotifications={notifications}
      unreadMessages={unreadMessages}
    >
      {children}
    </PortalShell>
  );
}
