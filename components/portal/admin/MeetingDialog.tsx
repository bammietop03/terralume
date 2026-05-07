"use client";

import { useState, useTransition } from "react";
import { scheduleMeeting, deleteMeeting } from "@/app/actions/meetings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { CalendarPlus, Trash2, ExternalLink, Clock } from "lucide-react";

type Meeting = {
  id: string;
  title: string | null;
  scheduledAt: Date | string;
  meetingLink: string | null;
  notes: string | null;
  status: string;
  pm: { fullName: string | null };
};

interface Props {
  engagementId: string;
  meetings: Meeting[];
}

function formatDateTime(d: Date | string) {
  return new Date(d).toLocaleString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const STATUS_STYLES: Record<string, string> = {
  SCHEDULED: "bg-blue-50 text-blue-700 ring-blue-200",
  COMPLETED: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  CANCELLED: "bg-red-50 text-red-700 ring-red-200",
};

export default function MeetingDialog({ engagementId, meetings }: Props) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [deletingId, startDeleteTransition] = useTransition();

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
          title: title || null,
          scheduledAt: new Date(scheduledAt),
          meetingLink: meetingLink || null,
          notes: notes || null,
        });
        setOpen(false);
        setTitle("");
        setScheduledAt("");
        setMeetingLink("");
        setNotes("");
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to schedule meeting.",
        );
      }
    });
  }

  function handleDelete(meetingId: string) {
    startDeleteTransition(async () => {
      await deleteMeeting(meetingId);
    });
  }

  return (
    <div className="space-y-4">
      {/* Meeting list */}
      {meetings.length > 0 ? (
        <div className="divide-y divide-divider rounded-xl border border-divider overflow-hidden">
          {meetings.map((m) => (
            <div
              key={m.id}
              className="flex items-start justify-between gap-4 px-4 py-3 bg-surface"
            >
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-medium text-on-surface">
                    {m.title ?? "Strategy Meeting"}
                  </p>
                  <Badge
                    variant="outline"
                    className={`text-[10px] px-1.5 py-0.5 ring-1 ${STATUS_STYLES[m.status] ?? ""}`}
                  >
                    {m.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-on-surface-muted">
                  <Clock size={11} />
                  {formatDateTime(m.scheduledAt)}
                </div>
                {m.meetingLink && (
                  <a
                    href={m.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-(--color-navy) hover:underline"
                  >
                    <ExternalLink size={11} />
                    Join link
                  </a>
                )}
                {m.notes && (
                  <p className="text-xs text-on-surface-muted line-clamp-2">
                    {m.notes}
                  </p>
                )}
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0 text-on-surface-muted hover:text-red-600"
                    disabled={deletingId}
                  >
                    <Trash2 size={14} />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete meeting?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently remove the meeting record. The
                      client will not be notified.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => handleDelete(m.id)}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-on-surface-muted">
          No meetings scheduled yet.
        </p>
      )}

      {/* Add meeting button + dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="default" size="sm" className="gap-2">
            <CalendarPlus size={14} />
            Schedule Meeting
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Schedule Strategy Meeting</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="meetingTitle">Title (optional)</Label>
              <Input
                id="meetingTitle"
                placeholder="e.g. Initial Strategy Session"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="scheduledAt">Date &amp; time</Label>
                <Input
                  id="scheduledAt"
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
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
                  onChange={(e) => setMeetingLink(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="meetingNotes">Notes / agenda (optional)</Label>
              <Textarea
                id="meetingNotes"
                rows={3}
                placeholder="Topics to discuss..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex justify-end gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Scheduling…" : "Schedule & Notify Client"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
