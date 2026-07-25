"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Save, StickyNote } from "lucide-react";
import { createInternalNote, type InternalNote } from "@/app/actions/timeline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface InternalNotesPanelProps {
  engagementId: string;
  initialNotes: InternalNote[];
}

function formatDateTime(input: Date | string) {
  return new Date(input).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function InternalNotesPanel({
  engagementId,
  initialNotes,
}: InternalNotesPanelProps) {
  const router = useRouter();
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit() {
    setError(null);

    startTransition(async () => {
      const result = await createInternalNote({
        engagementId,
        note: draft,
      });

      if (!result.success) {
        setError(result.error);
        return;
      }

      setDraft("");
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <StickyNote size={17} className="text-navy" />
            Add Internal Note
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Write an internal note for PM/Admin only..."
            rows={4}
          />
          {error ? <p className="text-xs text-red-600">{error}</p> : null}
          <div className="flex justify-end">
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isPending || draft.trim().length === 0}
              className="gap-2"
            >
              <Save size={14} />
              {isPending ? "Saving..." : "Save note"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Note History</CardTitle>
        </CardHeader>
        <CardContent>
          {initialNotes.length === 0 ? (
            <p className="text-sm text-on-surface-muted italic text-center py-4">
              No internal notes yet.
            </p>
          ) : (
            <div className="space-y-3">
              {initialNotes.map((note) => (
                <div
                  key={note.id}
                  className="rounded-xl border border-divider bg-surface-alt/35 px-4 py-3"
                >
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <p className="text-xs font-semibold text-on-surface">
                      {note.authorName}
                    </p>
                    <Badge variant="outline" className="text-[10px] h-5">
                      {note.authorRole}
                    </Badge>
                    <p className="text-[11px] text-on-surface-muted">
                      {formatDateTime(note.timestamp)}
                    </p>
                  </div>
                  <p className="text-sm text-on-surface whitespace-pre-wrap">
                    {note.note}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
