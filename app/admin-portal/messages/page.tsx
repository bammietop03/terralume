import { MessageSquare } from "lucide-react";

export const metadata = { title: "Messages — Terralume Admin Portal" };

export default function AdminMessagesPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center px-6 bg-[#f7f8fc]">
      <div className="p-5 rounded-full bg-(--color-navy-light) mb-4">
        <MessageSquare size={28} className="text-(--color-navy)" />
      </div>
      <h2 className="font-display text-lg font-semibold text-on-surface mb-1.5">
        Select a conversation
      </h2>
      <p className="text-sm text-on-surface-muted max-w-xs leading-relaxed">
        Choose an existing conversation from the list, or tap the compose button
        to start a new one.
      </p>
    </div>
  );
}
