"use client";

import { useState, useTransition } from "react";
import { updateLeadNotes } from "@/app/actions/leads";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function LeadNotesField({
  leadId,
  initialNotes,
}: {
  leadId: string;
  initialNotes: string | null;
}) {
  const [notes, setNotes] = useState(initialNotes ?? "");
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      const result = await updateLeadNotes(leadId, notes);
      if (result.success) {
        toast.success("Notes saved.");
      } else {
        toast.error("Failed to save notes.");
      }
    });
  }

  return (
    <div className="space-y-2">
      <Textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Add internal notes about this lead…"
        rows={5}
        className="resize-none text-sm"
      />
      <Button
        size="sm"
        variant="outline"
        onClick={handleSave}
        disabled={isPending}
        className="text-xs"
      >
        {isPending ? "Saving…" : "Save notes"}
      </Button>
    </div>
  );
}
