"use client";

import { useState, useTransition } from "react";
import { assignPm } from "@/app/actions/intake";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { UserCircle, AlertCircle, Check } from "lucide-react";

type PmOption = {
  id: string;
  fullName: string | null;
  email: string;
  phone: string | null;
};

interface Props {
  submissionId: string;
  assignedPm: PmOption | null;
  pmChangeRequested: boolean;
  pmChangeReason: string | null;
  pmOptions: PmOption[];
}

export default function AssignPmButton({
  submissionId,
  assignedPm,
  pmChangeRequested,
  pmChangeReason,
  pmOptions,
}: Props) {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string>(assignedPm?.id ?? "");
  const [isPending, startTransition] = useTransition();

  function handleOpen() {
    setSelectedId(assignedPm?.id ?? "");
    setOpen(true);
  }

  function handleConfirm() {
    if (!selectedId) return;
    startTransition(async () => {
      try {
        await assignPm(submissionId, selectedId);
        toast.success("PM assigned successfully.");
        setOpen(false);
      } catch {
        toast.error("Failed to assign PM.");
      }
    });
  }

  return (
    <>
      <div className="flex items-center gap-2">
        {pmChangeRequested && (
          <Badge variant="crimson" className="gap-1 text-[11px]">
            <AlertCircle size={10} />
            Change requested
          </Badge>
        )}
        <Button
          variant="default"
          size="sm"
          onClick={handleOpen}
          className="text-xs"
        >
          {assignedPm ? "Change PM" : "Assign PM"}
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {assignedPm ? "Reassign PM" : "Assign PM"}
            </DialogTitle>
            <DialogDescription>
              Select the project manager who will handle this brief and
              communicate with the client.
            </DialogDescription>
          </DialogHeader>

          {/* Change reason alert */}
          {pmChangeRequested && pmChangeReason && (
            <div className="flex gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-800">
              <AlertCircle
                size={14}
                className="mt-0.5 shrink-0 text-amber-600"
              />
              <span>
                <strong>Client reason:</strong> {pmChangeReason}
              </span>
            </div>
          )}

          {/* PM list */}
          {pmOptions.length === 0 ? (
            <p className="text-sm text-on-surface-muted text-center py-6">
              No PMs found. Add staff users with the PM role first.
            </p>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {pmOptions.map((pm) => {
                const isSelected = selectedId === pm.id;
                return (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setSelectedId(pm.id)}
                    className={[
                      "flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-all",
                      isSelected
                        ? "border-navy bg-navy-light"
                        : "border-divider bg-surface hover:border-divider-strong hover:bg-surface-alt",
                    ].join(" ")}
                  >
                    {/* Avatar */}
                    <div
                      className={[
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold uppercase",
                        isSelected
                          ? "bg-navy text-white"
                          : "bg-surface-alt text-on-surface-muted",
                      ].join(" ")}
                    >
                      {pm.fullName?.charAt(0) ?? <UserCircle size={16} />}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={[
                          "text-sm font-medium truncate",
                          isSelected ? "text-navy" : "text-on-surface",
                        ].join(" ")}
                      >
                        {pm.fullName ?? "Unnamed"}
                      </p>
                      <p className="text-[11px] text-on-surface-muted truncate">
                        {pm.email}
                      </p>
                    </div>

                    {/* Check */}
                    {isSelected && (
                      <Check size={15} className="shrink-0 text-navy" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirm} disabled={!selectedId || isPending}>
              {isPending ? "Assigning…" : "Confirm assignment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
