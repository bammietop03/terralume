"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  approveTaskSubmission,
  rejectTaskSubmission,
} from "@/app/actions/tasks";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Eye, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

type Task = {
  id: string;
  title: string;
  description: string | null;
  dueDate: Date | null;
  priority: string;
  status: string;
};

type Submission = {
  id: string;
  responseText: string | null;
  attachmentPaths: string[];
  submittedAt: Date;
  approvalStatus: string | null;
  feedback: string | null;
};

export default function TaskReviewDialog({
  task,
  submission,
}: {
  task: Task;
  submission: Submission;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState(submission.feedback || "");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApprove = async () => {
    setIsProcessing(true);

    try {
      const result = await approveTaskSubmission({
        submissionId: submission.id,
        feedback: feedback || undefined,
      });

      if (result.success) {
        toast.success("Task approved successfully");
        setOpen(false);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to approve task");
      }
    } catch (error) {
      console.error("Error approving task:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!feedback.trim()) {
      toast.error("Please provide feedback when rejecting");
      return;
    }

    setIsProcessing(true);

    try {
      const result = await rejectTaskSubmission({
        submissionId: submission.id,
        feedback,
      });

      if (result.success) {
        toast.success("Task rejected with feedback");
        setOpen(false);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to reject task");
      }
    } catch (error) {
      console.error("Error rejecting task:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="text-blue-600 border-blue-200 hover:bg-blue-50"
        >
          <Eye size={14} className="mr-1.5" />
          Review
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display">
            Review Task Submission
          </DialogTitle>
          <DialogDescription>
            Review the client's response and approve or reject with feedback.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Task details */}
          <div className="rounded-lg border border-divider bg-surface-alt p-4">
            <h3 className="font-semibold text-on-surface text-sm mb-2">
              {task.title}
            </h3>
            {task.description && (
              <p className="text-xs text-on-surface-muted">
                {task.description}
              </p>
            )}
          </div>

          {/* Submission details */}
          <div>
            <Label>Client Response</Label>
            <div className="mt-2 rounded-lg border border-divider bg-surface p-3">
              <p className="text-sm text-on-surface whitespace-pre-wrap">
                {submission.responseText || "No response text provided"}
              </p>
            </div>
            <p className="text-xs text-on-surface-muted mt-1">
              Submitted:{" "}
              {new Date(submission.submittedAt).toLocaleString("en-GB")}
            </p>
          </div>

          {/* Attachments */}
          {submission.attachmentPaths.length > 0 && (
            <div>
              <Label>Attachments</Label>
              <div className="mt-2 space-y-1">
                {submission.attachmentPaths.map((path, idx) => (
                  <div
                    key={idx}
                    className="text-xs text-on-surface-muted flex items-center gap-2"
                  >
                    <span className="font-mono">{path}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Feedback */}
          <div>
            <Label htmlFor="feedback">
              Feedback{" "}
              {submission.approvalStatus !== "APPROVED" &&
                "(Required for rejection)"}
            </Label>
            <Textarea
              id="feedback"
              placeholder="Provide feedback to the client..."
              rows={4}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="mt-2"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={handleReject}
            disabled={isProcessing}
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            {isProcessing ? (
              <>
                <Loader2 size={14} className="mr-1.5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <XCircle size={14} className="mr-1.5" />
                Reject
              </>
            )}
          </Button>
          <Button
            onClick={handleApprove}
            disabled={isProcessing}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {isProcessing ? (
              <>
                <Loader2 size={14} className="mr-1.5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle2 size={14} className="mr-1.5" />
                Approve
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
