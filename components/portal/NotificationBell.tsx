"use client";

import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { markRead, markAllRead } from "@/app/actions/notifications";
import { cn } from "@/lib/utils";
import type { Notification } from "@/types";

interface Props {
  userId: string;
  initialNotifications: Notification[];
}

export default function NotificationBell({
  userId,
  initialNotifications,
}: Props) {
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const unread = notifications.filter((n) => !n.read).length;

  // Real-time subscription
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setNotifications((prev) => [payload.new as Notification, ...prev]);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  async function handleMarkRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
    await markRead(id);
  }

  async function handleMarkAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    await markAllRead(userId);
  }

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 rounded-lg hover:bg-navy-light transition-colors"
        aria-label={`Notifications${unread > 0 ? ` (${unread} unread)` : ""}`}
      >
        <Bell size={20} className="text-on-surface" />
        {unread > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-(--color-crimson) text-[10px] font-bold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 rounded-2xl border border-divider bg-surface shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-divider">
            <h3 className="text-sm font-semibold text-on-surface">
              Notifications
            </h3>
            {unread > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-navy hover:text-navy-dark underline underline-offset-2"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <ul className="max-h-80 overflow-y-auto divide-y divide-divider">
            {notifications.length === 0 ? (
              <li className="px-4 py-6 text-center text-sm text-on-surface-muted">
                No notifications yet
              </li>
            ) : (
              notifications.map((n) => (
                <li
                  key={n.id}
                  className={cn(
                    "px-4 py-3 cursor-pointer hover:bg-surface-alt transition-colors",
                    !n.read && "bg-navy-light/40",
                  )}
                  onClick={() => !n.read && handleMarkRead(n.id)}
                >
                  <p
                    className={cn(
                      "text-sm leading-snug",
                      !n.read && "font-medium text-on-surface",
                      n.read && "text-on-surface-muted",
                    )}
                  >
                    {n.content}
                  </p>
                  <time className="mt-1 block text-xs text-on-surface-muted">
                    {new Date(n.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </time>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
