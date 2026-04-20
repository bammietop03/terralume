"use client";

import { useState, useTransition } from "react";
import { assignLeadPm } from "@/app/actions/leads";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { UserCircle, Check } from "lucide-react";

type PmOption = {
  id: string;
  fullName: string | null;
  email: string;
  phone: string | null;
};

interface Props {
  leadId: string;
  assignedPm: PmOption | null;
  pmOptions: PmOption[];
}

export default function AssignLeadPmButton({
  leadId,
  assignedPm,
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
        await assignLeadPm(leadId, selectedId);
        toast.success("PM assigned successfully.");
        setOpen(false);
      } catch {
        toast.error("Failed to assign PM.");
      }
    });
  }

  return (
    <>
      <Button
        variant="default"
        size="sm"
        onClick={handleOpen}
        className="text-xs"
      >
        {assignedPm ? "Change PM" : "Assign PM"}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {assignedPm ? "Reassign PM" : "Assign PM"}
            </DialogTitle>
            <DialogDescription>
              Select the project manager who will handle this lead and conduct
              the consultation.
            </DialogDescription>
          </DialogHeader>

          {pmOptions.length === 0 ? (
            <p className="py-6 text-center text-sm text-on-surface-muted">
              No PMs found. Add staff users with the PM role first.
            </p>
          ) : (
            <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
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
                    <div className="min-w-0 flex-1">
                      <p
                        className={[
                          "text-sm font-medium truncate",
                          isSelected ? "text-navy" : "text-on-surface",
                        ].join(" ")}
                      >
                        {pm.fullName ?? "Unnamed"}
                      </p>
                      <p className="truncate text-[11px] text-on-surface-muted">
                        {pm.email}
                      </p>
                    </div>
                    {isSelected && (
                      <Check size={14} className="shrink-0 text-navy" />
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
              {isPending ? "Saving…" : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
