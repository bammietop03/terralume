"use client";

import { useState, useTransition } from "react";
import { sendCalendarLink } from "@/app/actions/leads";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarCheck, Send } from "lucide-react";

interface Props {
  leadId: string;
  existingUrl: string | null;
  sentAt: Date | null;
}

export default function SendCalendarButton({
  leadId,
  existingUrl,
  sentAt,
}: Props) {
  const [url, setUrl] = useState(existingUrl ?? "");
  const [isPending, startTransition] = useTransition();

  function handleSend() {
    if (!url.trim()) {
      toast.error("Please enter a calendar URL.");
      return;
    }
    startTransition(async () => {
      const result = await sendCalendarLink(leadId, url.trim());
      if (result.success) {
        toast.success("Calendar link sent to lead.");
      } else {
        toast.error(result.error ?? "Failed to send calendar link.");
      }
    });
  }

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor="calendarUrl">Calendar / booking link</Label>
        <Input
          id="calendarUrl"
          type="url"
          placeholder="https://calendly.com/your-link"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="text-sm"
        />
      </div>

      {sentAt && (
        <div className="flex items-center gap-1.5 text-[12px] text-emerald-600">
          <CalendarCheck size={13} />
          <span>
            Last sent{" "}
            {new Date(sentAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      )}

      <Button
        size="sm"
        onClick={handleSend}
        disabled={isPending || !url.trim()}
        className="gap-1.5 text-xs"
      >
        <Send size={12} />
        {isPending
          ? "Sending…"
          : sentAt
            ? "Resend calendar link"
            : "Send calendar link"}
      </Button>
    </div>
  );
}
