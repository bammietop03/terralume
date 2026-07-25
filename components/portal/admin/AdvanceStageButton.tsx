"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { advanceProjectStage } from "@/app/actions/engagements";
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
import { ChevronRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AdvanceStageButton({
  engagementId,
}: {
  engagementId: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isAdvancing, setIsAdvancing] = useState(false);

  const handleAdvance = async () => {
    setIsAdvancing(true);

    try {
      const result = await advanceProjectStage(engagementId);

      if (result.success) {
        toast.success("Stage advanced successfully");
        setOpen(false);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to advance stage");
      }
    } catch (error) {
      console.error("Error advancing stage:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsAdvancing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-navy hover:bg-navy-dark text-white">
          <ChevronRight size={14} className="mr-1" />
          Advance Stage
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Advance to Next Stage</DialogTitle>
          <DialogDescription>
            This will mark the current stage as complete and move the project to
            the next stage in the workflow. This action will be logged in the
            activity timeline.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isAdvancing}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAdvance}
            disabled={isAdvancing}
            className="bg-navy hover:bg-navy-dark text-white"
          >
            {isAdvancing ? (
              <>
                <Loader2 size={14} className="mr-1.5 animate-spin" />
                Advancing...
              </>
            ) : (
              "Confirm Advance"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
