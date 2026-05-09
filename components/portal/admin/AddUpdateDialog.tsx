"use client";

import { useState, useTransition } from "react";
import { publishUpdate } from "@/app/actions/admin";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";

interface Props {
  engagementId: string;
  pmId: string;
}

export default function AddUpdateDialog({ engagementId, pmId }: Props) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [nextSteps, setNextSteps] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    startTransition(async () => {
      try {
        await publishUpdate({
          engagementId,
          content: content.trim(),
          nextSteps: nextSteps.trim() || undefined,
          pmId,
        });
        toast.success("Update published and client notified.");
        setContent("");
        setNextSteps("");
        setOpen(false);
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Failed to publish update.",
        );
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="default">
          <PlusCircle size={14} className="mr-1.5" />
          Add Update
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Post Engagement Update</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="content">Update</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's the latest progress on this engagement?"
              rows={4}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="nextSteps">
              Next steps{" "}
              <span className="text-on-surface-muted font-normal">
                (optional)
              </span>
            </Label>
            <Textarea
              id="nextSteps"
              value={nextSteps}
              onChange={(e) => setNextSteps(e.target.value)}
              placeholder="What should happen next?"
              rows={2}
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || !content.trim()}>
              {isPending ? "Publishing…" : "Publish update"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
