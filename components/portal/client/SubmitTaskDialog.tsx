"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitTask } from "@/app/actions/tasks";
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
import { Input } from "@/components/ui/input";
import { Send, Loader2, X, FileUp } from "lucide-react";
import { toast } from "sonner";

type Task = {
  id: string;
  title: string;
  description: string | null;
  dueDate: Date | null;
  priority: string;
  status: string;
};

export default function SubmitTaskDialog({ task }: { task: Task }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [attachmentPaths, setAttachmentPaths] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newAttachment, setNewAttachment] = useState("");

  const handleAddAttachment = () => {
    if (newAttachment.trim()) {
      setAttachmentPaths([...attachmentPaths, newAttachment.trim()]);
      setNewAttachment("");
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachmentPaths(attachmentPaths.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!responseText.trim()) {
      toast.error("Please provide a response");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitTask({
        taskId: task.id,
        responseText: responseText.trim(),
        attachmentPaths:
          attachmentPaths.length > 0 ? attachmentPaths : undefined,
      });

      if (result.success) {
        toast.success("Task submitted successfully");
        setOpen(false);
        setResponseText("");
        setAttachmentPaths([]);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to submit task");
      }
    } catch (error) {
      console.error("Error submitting task:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-navy hover:bg-navy-dark text-white">
          <Send size={14} className="mr-1.5" />
          Submit Response
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display">
            Submit Task Response
          </DialogTitle>
          <DialogDescription>
            Provide your response to complete this task. Your project manager
            will review it.
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
            {task.dueDate && (
              <p className="text-xs text-on-surface-muted mt-2">
                Due: {new Date(task.dueDate).toLocaleDateString("en-GB")}
              </p>
            )}
          </div>

          {/* Response text */}
          <div>
            <Label htmlFor="responseText">
              Your Response <span className="text-red-600">*</span>
            </Label>
            <Textarea
              id="responseText"
              placeholder="Provide your detailed response here..."
              rows={6}
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              className="mt-2"
            />
          </div>

          {/* Attachments */}
          <div>
            <Label htmlFor="attachment">Attachments (Optional)</Label>
            <p className="text-xs text-on-surface-muted mb-2">
              Add file paths or URLs if you've uploaded documents elsewhere
            </p>

            {/* Existing attachments */}
            {attachmentPaths.length > 0 && (
              <div className="space-y-2 mb-2">
                {attachmentPaths.map((path, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2 rounded-lg bg-surface border border-divider"
                  >
                    <FileUp size={14} className="text-on-surface-muted" />
                    <span className="text-xs font-mono text-on-surface flex-1 truncate">
                      {path}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveAttachment(idx)}
                      className="h-6 w-6 p-0"
                    >
                      <X size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Add attachment */}
            <div className="flex gap-2">
              <Input
                id="attachment"
                type="text"
                placeholder="File path or URL..."
                value={newAttachment}
                onChange={(e) => setNewAttachment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddAttachment();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddAttachment}
                disabled={!newAttachment.trim()}
              >
                Add
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !responseText.trim()}
            className="bg-navy hover:bg-navy-dark text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={14} className="mr-1.5 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send size={14} className="mr-1.5" />
                Submit
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
