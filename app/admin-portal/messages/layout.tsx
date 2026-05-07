import { redirect } from "next/navigation";
import { requireAdmin } from "@/app/actions/auth";
import {
  getAdminConversations,
  getAccessibleClientsForChat,
} from "@/app/actions/admin";
import MessagesShell from "@/components/portal/admin/MessagesShell";

export default async function MessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin().catch(() => null);
  if (!user) redirect("/admin-login");

  const [conversations, accessibleClients] = await Promise.all([
    getAdminConversations(),
    getAccessibleClientsForChat(),
  ]);

  return (
    <MessagesShell
      conversations={conversations}
      accessibleClients={accessibleClients}
      currentUserId={user.id}
      currentUserRole={user.role}
    >
      {children}
    </MessagesShell>
  );
}
