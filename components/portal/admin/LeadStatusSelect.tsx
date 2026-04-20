"use client";

import { useTransition } from "react";
import { updateLeadStatus } from "@/app/actions/leads";
import { toast } from "sonner";
import type { LeadStatus } from "@/app/generated/prisma";

const STATUS_OPTIONS: { value: LeadStatus; label: string }[] = [
  { value: "NEW", label: "New" },
  { value: "CONSULTATION_SCHEDULED", label: "Consultation scheduled" },
  { value: "AWAITING_DECISION", label: "Awaiting decision" },
  { value: "INTAKE_INVITED", label: "Intake invited" },
  { value: "INTAKE_SUBMITTED", label: "Intake submitted" },
  { value: "DECLINED", label: "Declined" },
];

export default function LeadStatusSelect({
  leadId,
  currentStatus,
}: {
  leadId: string;
  currentStatus: LeadStatus;
}) {
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value as LeadStatus;
    startTransition(async () => {
      try {
        await updateLeadStatus(leadId, newStatus);
        toast.success(
          `Status updated to ${newStatus.replace(/_/g, " ").toLowerCase()}`,
        );
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
