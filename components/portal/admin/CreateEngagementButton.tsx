"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createEngagementFromIntake } from "@/app/actions/engagements";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Zap, Loader2 } from "lucide-react";
import { toast } from "sonner";

type PmOption = {
  id: string;
  fullName: string;
  email: string;
};

export default function CreateEngagementButton({
  intakeSubmissionId,
  assignedPmId,
  pmOptions,
  clientName,
}: {
  intakeSubmissionId: string;
  assignedPmId?: string | null;
  pmOptions: PmOption[];
  clientName: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedPmId, setSelectedPmId] = useState<string | undefined>(
    assignedPmId ?? undefined,
  );
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    setIsCreating(true);

    try {
      const result = await createEngagementFromIntake({
        intakeSubmissionId,
        pmId: selectedPmId,
      });

      if (result.success && result.engagementId) {
        toast.success("Engagement created successfully");
        setOpen(false);
        router.push(`/admin-portal/engagements/${result.engagementId}`);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to create engagement");
      }
    } catch (error) {
      console.error("Error creating engagement:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-navy hover:bg-navy-dark text-white" size="sm">
          <Zap size={14} className="mr-1.5" />
          Create Engagement
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Create Engagement</DialogTitle>
          <DialogDescription>
            Create a project engagement for <strong>{clientName}</strong>. The
            workflow will be automatically set up based on their selected
            services.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="pm-select">Assign Project Manager (Optional)</Label>
            <Select value={selectedPmId} onValueChange={setSelectedPmId}>
              <SelectTrigger id="pm-select">
                <SelectValue placeholder="No PM assigned" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No PM assigned</SelectItem>
                {pmOptions.map((pm) => (
                  <SelectItem key={pm.id} value={pm.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{pm.fullName}</span>
                      <span className="text-xs text-muted-foreground">
                        {pm.email}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              You can assign or change the PM later from the engagement page.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isCreating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={isCreating}
            className="bg-navy hover:bg-navy-dark text-white"
          >
            {isCreating ? (
              <>
                <Loader2 size={14} className="mr-1.5 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Engagement"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
