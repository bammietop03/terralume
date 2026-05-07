"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { sendMessage } from "@/app/actions/admin";
import { useMessages } from "@/lib/realtime";
import { Send, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type SenderInfo = {
  id: string;
  fullName: string | null;
  preferredName: string | null;
  photoUrl: string | null;
  role: string;
};

type Message = {
  id: string;
  body: string;
  sentAt: Date | string;
  sender: SenderInfo;
};

function formatTime(d: Date | string) {
  return new Date(d).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminMessageThread({
  initialMessages,
  engagementId,
  currentUserId,
  canSend,
  clientInfo,
  pmInfo,
}: {
  initialMessages: Message[];
  engagementId: string;
  currentUserId: string;
  canSend: boolean;
  clientInfo: SenderInfo;
  pmInfo: SenderInfo | null;
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const seenIds = useRef<Set<string>>(
    new Set(initialMessages.map((m) => m.id)),
  );

  const realtimeMessages = useMessages(engagementId);

  useEffect(() => {
    for (const rm of realtimeMessages) {
      if (seenIds.current.has(rm.id)) continue;
      if (rm.senderId === currentUserId) {
        seenIds.current.add(rm.id);
        continue;
      }
      seenIds.current.add(rm.id);

      let sender: SenderInfo;
      if (pmInfo && rm.senderId === pmInfo.id) {
        sender = pmInfo;
      } else if (rm.senderId === clientInfo.id) {
        sender = clientInfo;
      } else {
        sender = {
          id: rm.senderId,
          fullName: null,
          preferredName: null,
          photoUrl: null,
          role: "PM",
        };
      }

      setMessages((prev) => [
        ...prev,
        { id: rm.id, body: rm.body, sentAt: rm.sentAt, sender },
      ]);

      const fromName = sender.preferredName ?? sender.fullName ?? "New message";
      toast(fromName, {
        description: rm.body.length > 80 ? rm.body.slice(0, 80) + "…" : rm.body,
        duration: 4000,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [realtimeMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim() || !canSend) return;
    setError(null);
    startTransition(async () => {
      try {
        const msg = await sendMessage({ engagementId, body: body.trim() });
        if (!seenIds.current.has(msg.id)) {
          seenIds.current.add(msg.id);
          setMessages((prev) => [...prev, msg as unknown as Message]);
        }
        setBody("");
        inputRef.current?.focus();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to send.");
      }
    });
  }

  return (
    <div className="flex flex-col h-full bg-[#f7f8fc]">
      {/* ── Messages area ───────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-on-surface-muted text-center">
              No messages yet. Send the first one below.
            </p>
          </div>
        ) : (
          <>
            {messages.map((msg) => {
              const isMe = msg.sender.id === currentUserId;
              const isClient = msg.sender.id === clientInfo.id;
              const name =
                msg.sender.preferredName ??
                msg.sender.fullName ??
                (isClient ? "Client" : "Project Manager");

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                >
                  <p className="text-[11px] text-on-surface-muted mb-1 px-1">
                    {name}
                    {isClient && (
                      <span className="ml-1 opacity-60">· Client</span>
                    )}
                    {!isMe && !isClient && (
                      <span className="ml-1 opacity-60">· PM</span>
                    )}
                    <span className="mx-1 opacity-40">·</span>
                    {formatTime(msg.sentAt)}
                  </p>
                  <div
                    className={`max-w-[72%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                      isMe
                        ? "bg-(--color-navy) text-white rounded-tr-sm"
                        : isClient
                          ? "bg-white text-on-surface border border-divider rounded-tl-sm"
                          : "bg-white text-on-surface border border-divider rounded-tl-sm"
                    }`}
                  >
                    {msg.body}
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* ── Input area ──────────────────────────────────── */}
      <div className="shrink-0 border-t border-divider bg-white px-4 py-3">
        {canSend ? (
          <form onSubmit={handleSend} className="flex items-end gap-2">
            <Textarea
              ref={inputRef}
              rows={1}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write a message… (Enter to send)"
              className="resize-none flex-1 min-h-10 max-h-32 bg-[#f4f5f9] border-0 focus-visible:ring-1 focus-visible:ring-navy/30 rounded-xl text-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (body.trim()) handleSend(e as unknown as React.FormEvent);
                }
              }}
            />
            <Button
              type="submit"
              disabled={isPending || !body.trim()}
              className="shrink-0 h-10 w-10 rounded-xl p-0 bg-(--color-navy) hover:bg-(--color-navy-dark)"
            >
              <Send size={15} />
            </Button>
          </form>
        ) : (
          <div className="flex items-center gap-2 rounded-xl bg-[#f4f5f9] px-4 py-2.5 text-sm text-on-surface-muted">
            <Lock size={13} className="shrink-0" />
            <span>
              Read-only — only the assigned PM can send messages in this
              conversation.
            </span>
          </div>
        )}
        {error && <p className="text-xs text-red-600 mt-1.5 px-1">{error}</p>}
      </div>
    </div>
  );
}
