"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createEngagement } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ServiceTier = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
};

interface Props {
  userId: string;
  submissionId: string;
  clientName: string;
  serviceTiers: ServiceTier[];
}

export default function ActivateClientForm({
  userId,
  submissionId,
  clientName,
  serviceTiers,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [serviceTierId, setServiceTierId] = useState("");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [targetDate, setTargetDate] = useState("");
  const [error, setError] = useState("");

  const selectedTier = serviceTiers.find((t) => t.id === serviceTierId);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      try {
        await createEngagement({
          userId,
          intakeSubmissionId: submissionId,
          serviceTierId: serviceTierId || null,
          startDate: startDate || null,
          targetDate: targetDate || null,
        });
        router.push(`/admin-portal/clients/${userId}`);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to activate client.",
        );
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Service tier */}
      <div className="space-y-1.5">
        <Label htmlFor="tier">Service Tier</Label>
        {serviceTiers.length === 0 ? (
          <p className="text-sm text-amber-600 rounded-lg bg-amber-50 px-3 py-2 ring-1 ring-amber-200">
            No active service tiers found. Add tiers in{" "}
            <a
              href="/admin-portal/settings"
              className="underline underline-offset-4"
            >
              Settings
            </a>{" "}
            first.
          </p>
        ) : (
          <Select onValueChange={setServiceTierId} value={serviceTierId}>
            <SelectTrigger id="tier">
              <SelectValue placeholder="Select tier…" />
            </SelectTrigger>
            <SelectContent>
              {serviceTiers.map((tier) => (
                <SelectItem key={tier.id} value={tier.id}>
                  {tier.name} — {tier.currency} {tier.price.toLocaleString()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {selectedTier?.description && (
          <p className="text-xs text-on-surface-muted">
            {selectedTier.description}
          </p>
        )}
        {!selectedTier && (
          <p className="text-xs text-on-surface-muted">
            Determines the service package and fee structure.
          </p>
        )}
      </div>

      {/* Start date */}
      <div className="space-y-1.5">
        <Label htmlFor="start">Engagement Start Date</Label>
        <Input
          id="start"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
      </div>

      {/* Target completion */}
      <div className="space-y-1.5">
        <Label htmlFor="target">Target Completion Date (optional)</Label>
        <Input
          id="target"
          type="date"
          value={targetDate}
          min={startDate}
          onChange={(e) => setTargetDate(e.target.value)}
        />
        <p className="text-xs text-on-surface-muted">
          Estimated date for handover or deal completion.
        </p>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700 ring-1 ring-red-200">
          {error}
        </p>
      )}

      <Button
        type="submit"
        disabled={pending}
        className="w-full bg-(--color-navy) text-white hover:bg-(--color-navy-dark)"
      >
        {pending ? "Activating…" : `Activate ${clientName}`}
      </Button>
    </form>
  );
}
