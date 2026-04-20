import { redirect } from "next/navigation";
import { requireClient } from "@/app/actions/auth";
import { getNotifications } from "@/app/actions/notifications";
import PortalShell from "@/components/portal/PortalShell";
import type { Notification } from "@/types";

export default async function ClientPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireClient().catch(() => null);
  if (!user) redirect("/login");

  const notifications = (await getNotifications(user.id)) as Notification[];

  return (
    <PortalShell
      role={user.role}
      userEmail={user.email}
      userName={user.fullName}
      preferredName={user.preferredName}
      userId={user.id}
      photoUrl={user.photoUrl}
      initialNotifications={notifications}
    >
      {children}
    </PortalShell>
  );
}
