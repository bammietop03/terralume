"use client";

import { useState, useTransition } from "react";
import { requestPmChange } from "@/app/actions/intake";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

interface Props {
  submissionId: string;
}

export default function RequestPmChangeButton({ submissionId }: Props) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      try {
        await requestPmChange(submissionId, reason.trim() || undefined);
        toast.success("Request sent. Our team will be in touch shortly.");
        setOpen(false);
        setReason("");
      } catch {
        toast.error("Failed to send request. Please try again.");
      }
    });
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="text-xs"
        onClick={() => setOpen(true)}
      >
        Request a different advisor
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Request advisor change</DialogTitle>
            <DialogDescription>
              Let us know why you would like a different advisor. We will review
              your request and get back to you within 24 hours.
            </DialogDescription>
          </DialogHeader>

          <div>
            <Label htmlFor="reason" className="mb-1.5 block">
              Reason{" "}
              <span className="text-on-surface-muted font-normal">
                (optional)
              </span>
            </Label>
            <Textarea
              id="reason"
              placeholder="e.g. I would prefer someone with commercial lease expertise."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="resize-none"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirm} disabled={isPending}>
              {isPending ? "Sending…" : "Send request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
