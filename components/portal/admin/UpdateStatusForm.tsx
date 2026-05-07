"use client";

import { useState, useTransition } from "react";
import { updateEngagementStatus } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STATUSES = [
  { key: "active", label: "Active" },
  { key: "on_hold", label: "On Hold" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

interface Props {
  engagementId: string;
  currentStatus: string;
}

export default function UpdateStatusForm({
  engagementId,
  currentStatus,
}: Props) {
  const [status, setStatus] = useState(currentStatus);
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function handleSave() {
    startTransition(async () => {
      await updateEngagementStatus(engagementId, status);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  return (
    <div className="flex items-center gap-2">
      <Select
        onValueChange={(val) => {
          setStatus(val);
          setSaved(false);
        }}
        value={status}
      >
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {STATUSES.map((s) => (
            <SelectItem key={s.key} value={s.key}>
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        size="sm"
        variant="default"
        disabled={pending || status === currentStatus}
        onClick={handleSave}
      >
        {saved ? "Saved ✓" : pending ? "Saving…" : "Update"}
      </Button>
    </div>
  );
}
