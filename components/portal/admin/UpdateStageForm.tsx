"use client";

import { useState, useTransition } from "react";
import { updateEngagementStage } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STAGES = [
  { key: "discovery", label: "Discovery" },
  { key: "brief_confirmation", label: "Brief Confirmation" },
  { key: "area_shortlisting", label: "Area Shortlisting" },
  { key: "property_search", label: "Property Search" },
  { key: "due_diligence", label: "Due Diligence" },
  { key: "offer_negotiation", label: "Offer & Negotiation" },
  { key: "legal_completion", label: "Legal & Completion" },
  { key: "handover", label: "Handover" },
];

interface Props {
  engagementId: string;
  currentStage: string;
}

export default function UpdateStageForm({ engagementId, currentStage }: Props) {
  const [stage, setStage] = useState(currentStage);
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function handleSave() {
    startTransition(async () => {
      await updateEngagementStage(engagementId, stage);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  return (
    <div className="flex items-center gap-2">
      <Select onValueChange={setStage} value={stage}>
        <SelectTrigger className="w-52">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {STAGES.map((s) => (
            <SelectItem key={s.key} value={s.key}>
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        size="sm"
        variant="default"
        disabled={pending || stage === currentStage}
        onClick={handleSave}
      >
        {saved ? "Saved ✓" : pending ? "Saving…" : "Update"}
      </Button>
    </div>
  );
}
