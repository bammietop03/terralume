"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RealtimeNotification {
  id: string;
  userId: string;
  type: string;
  content: string;
  read: boolean;
  createdAt: string;
}

export interface RealtimeMessage {
  id: string;
  engagementId: string;
  senderId: string;
  body: string;
  attachmentPath: string | null;
  sentAt: string;
  readAt: string | null;
}

export interface RealtimeEngagement {
  id: string;
  stage: string;
  status: string;
  targetDate: string | null;
}

// ─── useNotifications ─────────────────────────────────────────────────────────

/**
 * Subscribes to INSERT events on the `notifications` table for the given user.
 * Returns an array of new notifications received since mount (oldest first).
 *
 * Usage:
 *   const notifications = useNotifications(userId)
 */
export function useNotifications(userId: string) {
  const [notifications, setNotifications] = useState<RealtimeNotification[]>([]);
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!userId) return;

    const supabase = createClient();

    channelRef.current = supabase
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
          setNotifications((prev) => [
            ...prev,
            payload.new as RealtimeNotification,
          ]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channelRef.current!);
    };
  }, [userId]);

  return notifications;
}

// ─── useMessages ──────────────────────────────────────────────────────────────

/**
 * Subscribes to INSERT events on the `messages` table for the given engagement.
 * Returns an array of new messages received since mount.
 *
 * Usage:
 *   const messages = useMessages(engagementId)
 */
export function useMessages(engagementId: string) {
  const [messages, setMessages] = useState<RealtimeMessage[]>([]);
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!engagementId) return;

    const supabase = createClient();

    channelRef.current = supabase
      .channel(`messages:${engagementId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `engagement_id=eq.${engagementId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as RealtimeMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channelRef.current!);
    };
  }, [engagementId]);

  return messages;
}

// ─── useEngagementStage ───────────────────────────────────────────────────────

/**
 * Subscribes to UPDATE events on the `engagements` table for the given engagement.
 * Returns the latest engagement snapshot whenever stage/status changes.
 *
 * Usage:
 *   const engagement = useEngagementStage(engagementId, initialEngagement)
 */
export function useEngagementStage(
  engagementId: string,
  initial: RealtimeEngagement | null = null
) {
  const [engagement, setEngagement] = useState<RealtimeEngagement | null>(initial);
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!engagementId) return;

    const supabase = createClient();

    channelRef.current = supabase
      .channel(`engagement:${engagementId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "engagements",
          filter: `id=eq.${engagementId}`,
        },
        (payload) => {
          setEngagement(payload.new as RealtimeEngagement);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channelRef.current!);
    };
  }, [engagementId]);

  return engagement;
}
