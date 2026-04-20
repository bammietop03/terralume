"use client";

import { useTransition } from "react";
import { updateIntakeStatus } from "@/app/actions/intake";
import { toast } from "sonner";

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Pending" },
  { value: "REVIEWING", label: "Reviewing" },
  { value: "ACTIVE", label: "Active" },
  { value: "CLOSED", label: "Closed" },
] as const;

type IntakeStatus = (typeof STATUS_OPTIONS)[number]["value"];

export default function IntakeStatusSelect({
  submissionId,
  currentStatus,
}: {
  submissionId: string;
  currentStatus: string;
}) {
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value as IntakeStatus;
    startTransition(async () => {
      try {
        await updateIntakeStatus(submissionId, newStatus);
        toast.success(`Status updated to ${newStatus.toLowerCase()}`);
      } catch {
        toast.error("Failed to update status.");
      }
    });
  }

  return (
    <select
      value={currentStatus}
      onChange={handleChange}
      disabled={isPending}
      className="rounded-lg border border-divider bg-white px-3 py-1.5 text-xs font-medium text-on-surface shadow-sm transition-colors hover:bg-surface-alt focus:outline-none focus:ring-2 focus:ring-navy/20 disabled:opacity-50"
    >
      {STATUS_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
