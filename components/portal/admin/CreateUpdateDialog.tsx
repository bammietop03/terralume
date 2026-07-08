"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { createUpdate } from "@/app/actions/updates";
import { Plus, Loader2 } from "lucide-react";

interface CreateUpdateDialogProps {
  engagementId: string;
}

export default function CreateUpdateDialog({
  engagementId,
}: CreateUpdateDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [content, setContent] = useState("");
  const [nextSteps, setNextSteps] = useState("");
  const [publish, setPublish] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      setError("Update content is required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await createUpdate({
        engagementId,
        content,
        nextSteps: nextSteps.trim() || undefined,
        publish,
      });

      if (!result.success) {
        setError("Failed to create update.");
        setLoading(false);
        return;
      }

      // Success
      setOpen(false);
      setContent("");
      setNextSteps("");
      setPublish(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create update");
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Plus size={16} className="mr-2" />
          Post Update
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-150">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Post Project Update</DialogTitle>
            <DialogDescription>
              Share a progress update with the client. They will be notified
              when you publish.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Update Content */}
            <div className="space-y-2">
              <Label htmlFor="content">
                Update Message <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share what's been accomplished, any milestones reached, or important information for the client..."
                rows={6}
                disabled={loading}
                required
                className="resize-none"
              />
              <p className="text-xs text-on-surface-muted">
                {content.length} characters
              </p>
            </div>

            {/* Next Steps */}
            <div className="space-y-2">
              <Label htmlFor="nextSteps">Next Steps (optional)</Label>
              <Textarea
                id="nextSteps"
                value={nextSteps}
                onChange={(e) => setNextSteps(e.target.value)}
                placeholder="What's coming next? Any actions needed from the client?"
                rows={3}
                disabled={loading}
                className="resize-none"
              />
            </div>

            {/* Publish Immediately */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="publish"
                checked={publish}
                onCheckedChange={(checked) => setPublish(checked === true)}
                disabled={loading}
              />
              <Label
                htmlFor="publish"
                className="text-sm font-normal cursor-pointer"
              >
                Publish immediately (client will be notified)
              </Label>
            </div>

            {!publish && (
              <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
                <p className="text-sm text-amber-700">
                  This update will be saved as a draft. You can publish it later
                  from the updates list.
                </p>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !content.trim()}>
              {loading ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  {publish ? "Publishing..." : "Saving..."}
                </>
              ) : publish ? (
                "Publish Update"
              ) : (
                "Save as Draft"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
