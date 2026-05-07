"use client";

import { useState, useTransition, useEffect } from "react";
import { scheduleMeeting, getMeeting } from "@/app/actions/meetings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Send } from "lucide-react";

export default function MeetingScheduler({
  engagementId,
}: {
  engagementId: string;
}) {
  const [scheduledAt, setScheduledAt] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [notes, setNotes] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    getMeeting(engagementId).then((m) => {
      if (m) {
        const dt = new Date(m.scheduledAt);
        // Format for datetime-local input (YYYY-MM-DDTHH:MM)
        const pad = (n: number) => String(n).padStart(2, "0");
        const formatted = `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}T${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
        setScheduledAt(formatted);
        setMeetingLink(m.meetingLink ?? "");
        setNotes(m.notes ?? "");
        setSent(true);
      }
    });
  }, [engagementId]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!scheduledAt) {
      setError("Please set a date and time.");
      return;
    }
    startTransition(async () => {
      try {
        await scheduleMeeting(engagementId, {
          scheduledAt: new Date(scheduledAt),
          meetingLink: meetingLink || null,
          notes: notes || null,
        });
        setSent(true);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to schedule meeting.",
        );
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="scheduledAt">Date &amp; time</Label>
          <Input
            id="scheduledAt"
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => {
              setScheduledAt(e.target.value);
              setSent(false);
            }}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="meetingLink">Meeting link (optional)</Label>
          <Input
            id="meetingLink"
            type="url"
            placeholder="https://meet.google.com/..."
            value={meetingLink}
            onChange={(e) => {
              setMeetingLink(e.target.value);
              setSent(false);
            }}
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="meetingNotes">
          Preliminary notes / agenda (optional)
        </Label>
        <Textarea
          id="meetingNotes"
          rows={3}
          value={notes}
          onChange={(e) => {
            setNotes(e.target.value);
            setSent(false);
          }}
          placeholder="Topics to cover, documents to prepare…"
          className="resize-none"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isPending}>
          <Send size={15} className="mr-2" />
          {isPending ? "Sending…" : "Schedule and notify client"}
        </Button>
        {sent && (
          <span className="flex items-center gap-1.5 text-sm text-emerald-600">
            <CheckCircle2 size={15} />
            Sent
          </span>
        )}
      </div>
    </form>
  );
}
