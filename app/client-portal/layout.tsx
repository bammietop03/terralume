import { redirect } from "next/navigation";
import { requireClient } from "@/app/actions/auth";
import { getNotifications } from "@/app/actions/notifications";
import { getUnreadMessageCount } from "@/app/actions/admin";
import PortalShell from "@/components/portal/PortalShell";
import type { Notification } from "@/types";

export default async function ClientPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireClient().catch(() => null);
  if (!user) redirect("/login");

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
