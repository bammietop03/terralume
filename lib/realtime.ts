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
  const [notifications, setNotifications] = useState<RealtimeNotification[]>(
    [],
  );
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
        },
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

    // Use a unique channel name per engagement.
    // postgres_changes requires the "messages" table to be in the supabase_realtime
    // publication. If your project has RLS enabled you must also add a policy that
    // allows SELECT for authenticated users.
    channelRef.current = supabase
      .channel(`messages:engagement:${engagementId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `engagement_id=eq.${engagementId}`,
        },
        (payload) => {
          // Supabase sends snake_case column names — map to camelCase
          const raw = payload.new as Record<string, unknown>;
          const msg: RealtimeMessage = {
            id: raw.id as string,
            engagementId: (raw.engagement_id ?? raw.engagementId) as string,
            senderId: (raw.sender_id ?? raw.senderId) as string,
            body: raw.body as string,
            attachmentPath: (raw.attachment_path ?? raw.attachmentPath) as
              | string
              | null,
            sentAt: (raw.sent_at ?? raw.sentAt) as string,
            readAt: (raw.read_at ?? raw.readAt) as string | null,
          };
          setMessages((prev) => [...prev, msg]);
        },
      )
      .subscribe((status) => {
        // "SUBSCRIBED" means the channel is live.
        // "CHANNEL_ERROR" / "TIMED_OUT" means realtime is not reachable —
        // check that the messages table is in the supabase_realtime publication
        // and that the anon key has SELECT permission.
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          console.warn("[realtime] messages channel error:", status);
        }
      });

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
  initial: RealtimeEngagement | null = null,
) {
  const [engagement, setEngagement] = useState<RealtimeEngagement | null>(
    initial,
  );
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
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channelRef.current!);
    };
  }, [engagementId]);

  return engagement;
}
