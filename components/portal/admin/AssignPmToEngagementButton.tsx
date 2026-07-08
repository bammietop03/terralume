"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { assignPmToEngagement } from "@/app/actions/engagements";
import { getStaffUsers } from "@/app/actions/users";
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
import { UserCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

type StaffUser = {
  id: string;
  fullName: string;
  preferredName: string | null;
  email: string;
  role: string;
};

export default function AssignPmToEngagementButton({
  engagementId,
  currentPmId,
}: {
  engagementId: string;
  currentPmId?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedPmId, setSelectedPmId] = useState<string | undefined>(
    currentPmId,
  );
  const [isAssigning, setIsAssigning] = useState(false);
  const [pmOptions, setPmOptions] = useState<StaffUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open && pmOptions.length === 0) {
      setIsLoading(true);
      getStaffUsers()
        .then((users) => {
          setPmOptions(
            users.map((u) => ({
              id: u.id,
              fullName: u.fullName ?? "",
              preferredName: u.preferredName ?? null,
              email: u.email,
              role: u.role,
              phone: u.phone ?? "",
            })),
          );
        })
        .catch((error) => {
          console.error("Error loading PMs:", error);
          toast.error("Failed to load project managers");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [open, pmOptions.length]);

  const handleAssign = async () => {
    if (!selectedPmId) {
      toast.error("Please select a project manager");
      return;
    }

    setIsAssigning(true);

    try {
      const result = await assignPmToEngagement(engagementId, selectedPmId);

      if (result.success) {
        toast.success("Project manager assigned successfully");
        setOpen(false);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to assign PM");
      }
    } catch (error) {
      console.error("Error assigning PM:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <UserCircle size={14} className="mr-1.5" />
          {currentPmId ? "Reassign PM" : "Assign PM"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">
            {currentPmId
              ? "Reassign Project Manager"
              : "Assign Project Manager"}
          </DialogTitle>
          <DialogDescription>
            Select a project manager to oversee this engagement. They will
            receive notifications about project updates.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="pm-select">Project Manager</Label>
            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2
                  size={20}
                  className="animate-spin text-muted-foreground"
                />
              </div>
            ) : (
              <Select
                value={selectedPmId}
                onValueChange={setSelectedPmId}
                disabled={pmOptions.length === 0}
              >
                <SelectTrigger id="pm-select">
                  <SelectValue placeholder="Select a PM" />
                </SelectTrigger>
                <SelectContent>
                  {pmOptions.map((pm) => (
                    <SelectItem key={pm.id} value={pm.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {pm.preferredName || pm.fullName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {pm.email}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isAssigning}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            disabled={isAssigning || !selectedPmId}
            className="bg-navy hover:bg-navy-dark text-white"
          >
            {isAssigning ? (
              <>
                <Loader2 size={14} className="mr-1.5 animate-spin" />
                Assigning...
              </>
            ) : (
              "Assign PM"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
