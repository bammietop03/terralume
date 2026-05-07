import { redirect } from "next/navigation";
import { requireClient } from "@/app/actions/auth";
import { getClientMessages } from "@/app/actions/admin";
import MessageThread from "@/components/portal/client/MessageThread";

export const metadata = { title: "Messages — Terralume Client Portal" };

export default async function MessagesPage() {
  const user = await requireClient().catch(() => null);
  if (!user) redirect("/login");

  const { messages, engagementId, pmInfo } = await getClientMessages(user.id);

  return (
    <div className="flex flex-col max-w-5xl mx-auto h-full overflow-hidden">
      {/* Header */}
      <div className="shrink-0 px-6 pt-6 pb-4 border-b border-divider bg-white">
        <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-muted mb-1">
          Messages
        </p>
        <h1 className="font-display text-2xl font-bold text-on-surface">
          Messages
        </h1>
        <p className="text-sm text-on-surface-muted mt-1">
          Communicate directly with your project manager.
        </p>
      </div>

      {/* Thread fills remaining height */}
      <div className="flex-1 overflow-hidden">
        <MessageThread
          initialMessages={messages}
          engagementId={engagementId}
          currentUserId={user.id}
          pmInfo={pmInfo}
        />
      </div>
    </div>
  );
}
