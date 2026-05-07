"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  MessageSquare,
  PenSquare,
  Search,
  ArrowLeft,
  Check,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useUnread } from "@/components/portal/UnreadContext";

// ─── Types ─────────────────────────────────────────────────────────────────

const STAGE_LABELS: Record<string, string> = {
  discovery: "Discovery",
  brief_confirmation: "Brief Confirmation",
  area_shortlisting: "Area Shortlisting",
  property_search: "Property Search",
  due_diligence: "Due Diligence",
  offer_negotiation: "Offer & Negotiation",
  legal_completion: "Legal & Completion",
  handover: "Handover",
  active_client: "Active Client",
};

type Conversation = {
  id: string;
  stage: string;
  pmId: string | null;
  user: {
    id: string;
    fullName: string | null;
    preferredName: string | null;
    email: string;
    photoUrl: string | null;
  };
  pm: {
    id: string;
    fullName: string | null;
    preferredName: string | null;
    photoUrl: string | null;
  } | null;
  messages: Array<{
    id: string;
    body: string;
    sentAt: Date | string;
    sender: {
      id: string;
      fullName: string | null;
      preferredName: string | null;
      role: string;
    };
  }>;
  _count: { messages: number };
  unreadCount: number;
};

type AccessibleClient = {
  id: string;
  stage: string;
  user: {
    id: string;
    fullName: string | null;
    preferredName: string | null;
    email: string;
  };
};

// ─── Helpers ───────────────────────────────────────────────────────────────

function formatTime(d: Date | string) {
  const date = new Date(d);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  if (isToday) {
    return date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

// ─── ConversationRow ───────────────────────────────────────────────────────

function ConversationRow({
  conv,
  isActive,
  currentUserId,
  onSelect,
  showPm = false,
  unreadCount = 0,
}: {
  conv: Conversation;
  isActive: boolean;
  currentUserId: string;
  onSelect: (id: string) => void;
  showPm?: boolean;
  unreadCount?: number;
}) {
  const name = conv.user.preferredName ?? conv.user.fullName ?? conv.user.email;
  const lastMsg = conv.messages[0] ?? null;
  const senderName = lastMsg
    ? (lastMsg.sender.preferredName ?? lastMsg.sender.fullName ?? "")
    : null;
  const isOwnMsg = lastMsg?.sender.id === currentUserId;
  const pmName = conv.pm
    ? (conv.pm.preferredName ?? conv.pm.fullName ?? "Unknown PM")
    : "Unassigned";

  return (
    <button
      onClick={() => onSelect(conv.id)}
      className={cn(
        "w-full flex items-start gap-3 px-4 py-3 text-left transition-all",
        isActive
          ? "bg-(--color-navy-light) border-l-2 border-(--color-navy)"
          : "border-l-2 border-transparent hover:bg-[#f4f5f9]",
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
          isActive
            ? "bg-(--color-navy) text-white"
            : "bg-(--color-navy-light) text-(--color-navy)",
        )}
      >
        {initials(name)}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-1.5">
          <span
            className={cn(
              "text-sm font-semibold truncate",
              isActive ? "text-(--color-navy)" : "text-on-surface",
            )}
          >
            {name}
          </span>
          <div className="flex items-center gap-1 shrink-0">
            {unreadCount > 0 && !isActive && (
              <span className="flex items-center justify-center rounded-full bg-(--color-navy) text-white text-[10px] font-bold min-w-4.5 h-4.5 px-1 tabular-nums">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
            {lastMsg && (
              <span className="text-[10px] text-on-surface-muted tabular-nums">
                {formatTime(lastMsg.sentAt)}
              </span>
            )}
          </div>
        </div>
        {showPm && (
          <p className="text-[10px] text-on-surface-muted/70 truncate leading-none mb-0.5">
            PM: {pmName}
          </p>
        )}
        <p className="text-xs text-on-surface-muted truncate mt-0.5 leading-relaxed">
          {lastMsg ? (
            <>
              {isOwnMsg && (
                <span className="inline-flex items-center gap-0.5 mr-0.5">
                  <Check size={10} className="text-(--color-navy)" />
                </span>
              )}
              {!isOwnMsg && senderName && `${senderName}: `}
              {lastMsg.body}
            </>
          ) : (
            <span className="italic opacity-60">No messages yet</span>
          )}
        </p>
      </div>
    </button>
  );
}

// ─── Component ─────────────────────────────────────────────────────────────

export default function MessagesShell({
  conversations,
  accessibleClients,
  currentUserId,
  currentUserRole,
  children,
}: {
  conversations: Conversation[];
  accessibleClients: AccessibleClient[];
  currentUserId: string;
  currentUserRole: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [newChatOpen, setNewChatOpen] = useState(false);
  const [clientSearch, setClientSearch] = useState("");

  // Detect active conversation from URL
  const activeId =
    pathname.match(/\/admin-portal\/messages\/([^/]+)/)?.[1] ?? null;

  const hasActive = !!activeId;

  // ── Unread tracking ─────────────────────────────────────────────────────
  // Initialise from server-computed values; decrement when a conv is opened
  const [unreadMap, setUnreadMap] = useState<Record<string, number>>(() =>
    Object.fromEntries(conversations.map((c) => [c.id, c.unreadCount])),
  );

  // When the active conversation changes, zero its unread count
  useEffect(() => {
    if (!activeId) return;
    setUnreadMap((prev) =>
      prev[activeId] ? { ...prev, [activeId]: 0 } : prev,
    );
  }, [activeId]);

  const totalUnread = Object.values(unreadMap).reduce((s, n) => s + n, 0);

  // Keep the sidebar badge in sync with the local unread map
  const { setUnread } = useUnread();
  useEffect(() => {
    setUnread(totalUnread);
  }, [totalUnread, setUnread]);

  const filtered = conversations.filter((c) => {
    const name = c.user.preferredName ?? c.user.fullName ?? c.user.email;
    return name.toLowerCase().includes(search.toLowerCase());
  });

  // For ADMIN: split into "my" vs "other PM" conversations
  const isAdmin = currentUserRole === "ADMIN";
  const myConvs = isAdmin
    ? filtered.filter((c) => c.pmId === currentUserId)
    : filtered;
  const otherConvs = isAdmin
    ? filtered.filter((c) => c.pmId !== currentUserId)
    : [];

  const filteredClients = accessibleClients.filter((c) => {
    const name = c.user.preferredName ?? c.user.fullName ?? c.user.email;
    const q = clientSearch.toLowerCase();
    return (
      name.toLowerCase().includes(q) || c.user.email.toLowerCase().includes(q)
    );
  });

  function openChat(engagementId: string) {
    setNewChatOpen(false);
    setClientSearch("");
    router.push(`/admin-portal/messages/${engagementId}`);
  }

  return (
    <div className="flex h-full overflow-hidden">
      {/* ── Left panel: conversation list ──────────────────────── */}
      <aside
        className={cn(
          "flex flex-col border-r border-divider bg-white shrink-0 w-full sm:w-72 xl:w-80",
          // On mobile: hide left panel when a conversation is open
          hasActive && "hidden sm:flex",
        )}
      >
        {/* Header */}
        <div className="px-4 pt-5 pb-3 border-b border-divider/70">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-bold text-on-surface text-lg tracking-tight flex items-center gap-2">
              Messages
              {totalUnread > 0 && (
                <span className="flex items-center justify-center rounded-full bg-(--color-navy) text-white text-[10px] font-bold min-w-4.5 h-4.5 px-1 tabular-nums">
                  {totalUnread > 99 ? "99+" : totalUnread}
                </span>
              )}
            </h2>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-lg text-on-surface-muted hover:text-on-surface hover:bg-surface-alt"
              onClick={() => setNewChatOpen(true)}
              title="New conversation"
            >
              <PenSquare size={15} />
            </Button>
          </div>
          {/* Search */}
          <div className="relative">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-muted pointer-events-none"
            />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search…"
              className="pl-8 h-8 text-sm bg-[#f4f5f9] border-0 focus-visible:ring-1 focus-visible:ring-navy/30 rounded-lg placeholder:text-on-surface-muted/60"
            />
          </div>
        </div>

        {/* List */}
        <ScrollArea className="flex-1">
          {filtered.length === 0 ? (
            <div className="py-16 text-center px-4">
              <MessageSquare
                size={22}
                className="mx-auto mb-2 text-on-surface-muted/40"
              />
              <p className="text-xs text-on-surface-muted">
                {search
                  ? "No matching conversations."
                  : "No conversations yet."}
              </p>
              {!search && (
                <button
                  onClick={() => setNewChatOpen(true)}
                  className="mt-3 text-xs font-medium text-(--color-navy) hover:underline"
                >
                  Start one →
                </button>
              )}
            </div>
          ) : isAdmin ? (
            <div className="py-1">
              {/* My conversations */}
              {myConvs.length > 0 && (
                <>
                  <p className="px-4 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-on-surface-muted/60">
                    My Conversations
                  </p>
                  {myConvs.map((conv) => (
                    <ConversationRow
                      key={conv.id}
                      conv={conv}
                      isActive={conv.id === activeId}
                      currentUserId={currentUserId}
                      unreadCount={unreadMap[conv.id] ?? 0}
                      onSelect={(id) =>
                        router.push(`/admin-portal/messages/${id}`)
                      }
                    />
                  ))}
                </>
              )}
              {/* Other PM conversations */}
              {otherConvs.length > 0 && (
                <>
                  <p className="px-4 pt-4 pb-1 text-[10px] font-semibold uppercase tracking-wider text-on-surface-muted/60">
                    Other Conversations
                  </p>
                  {otherConvs.map((conv) => (
                    <ConversationRow
                      key={conv.id}
                      conv={conv}
                      isActive={conv.id === activeId}
                      currentUserId={currentUserId}
                      unreadCount={unreadMap[conv.id] ?? 0}
                      onSelect={(id) =>
                        router.push(`/admin-portal/messages/${id}`)
                      }
                      showPm
                    />
                  ))}
                </>
              )}
            </div>
          ) : (
            <div className="py-1">
              {filtered.map((conv) => (
                <ConversationRow
                  key={conv.id}
                  conv={conv}
                  isActive={conv.id === activeId}
                  currentUserId={currentUserId}
                  unreadCount={unreadMap[conv.id] ?? 0}
                  onSelect={(id) => router.push(`/admin-portal/messages/${id}`)}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </aside>

      {/* ── Right panel: thread or empty state ─────────────────── */}
      <div
        className={cn(
          "flex-1 flex flex-col overflow-hidden min-w-0",
          // On mobile: hide right when no active conversation
          !hasActive && "hidden sm:flex",
        )}
      >
        {/* Mobile back button when viewing a thread */}
        {hasActive && (
          <div className="sm:hidden px-4 py-2 border-b border-divider bg-white">
            <button
              onClick={() => router.push("/admin-portal/messages")}
              className="flex items-center gap-1.5 text-sm text-on-surface-muted hover:text-on-surface"
            >
              <ArrowLeft size={15} />
              Back
            </button>
          </div>
        )}
        {children}
      </div>

      {/* ── New chat dialog ─────────────────────────────────────── */}
      <Dialog open={newChatOpen} onOpenChange={setNewChatOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-lg">
              New conversation
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 pt-1">
            <div className="relative">
              <Search
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-muted pointer-events-none"
              />
              <Input
                value={clientSearch}
                onChange={(e) => setClientSearch(e.target.value)}
                placeholder="Search by name or email…"
                className="pl-8"
                autoFocus
              />
            </div>

            <ScrollArea className="max-h-72 -mx-1">
              {filteredClients.length === 0 ? (
                <p className="text-sm text-on-surface-muted text-center py-8">
                  {clientSearch
                    ? "No matching clients."
                    : "No accessible clients found."}
                </p>
              ) : (
                <div className="space-y-0.5 px-1">
                  {filteredClients.map((c) => {
                    const name =
                      c.user.preferredName ?? c.user.fullName ?? c.user.email;
                    const isExisting = conversations.some(
                      (cv) => cv.id === c.id,
                    );
                    return (
                      <button
                        key={c.id}
                        onClick={() => openChat(c.id)}
                        className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-surface-alt transition-colors"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-(--color-navy-light) text-sm font-semibold text-(--color-navy)">
                          {initials(name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-on-surface truncate">
                            {name}
                          </p>
                          <p className="text-xs text-on-surface-muted truncate">
                            {c.user.email}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <Badge
                            variant="outline"
                            className="text-[10px] px-1.5"
                          >
                            {STAGE_LABELS[c.stage] ?? c.stage}
                          </Badge>
                          {isExisting && (
                            <Badge
                              variant="default"
                              className="text-[10px] px-1.5"
                            >
                              Active
                            </Badge>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
