"use client";

import { useState, useTransition, useEffect } from "react";
import { ArrowLeft, Save, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createAgreement, getAgreement } from "@/app/actions/agreements";
import { getEngagementDetail } from "@/app/actions/admin";

interface Props {
  engagementId: string;
}

export default function AgreementEditForm({ engagementId }: Props) {
  const [serviceTier, setServiceTier] = useState("");
  const [scopeDescription, setScopeDescription] = useState("");
  const [timeline, setTimeline] = useState("");
  const [deliverables, setDeliverables] = useState("");
  const [feeAmount, setFeeAmount] = useState("");
  const [currency, setCurrency] = useState("NGN");
  const [terms, setTerms] = useState("");
  const [status, setStatus] = useState<"PENDING" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    getEngagementDetail(engagementId).then((eng) => {
      if (!eng) return;
      if (eng.tierRef) {
        setServiceTier(eng.tierRef.name);
        setFeeAmount(String(eng.tierRef.price));
        setCurrency(eng.tierRef.currency);
      } else if (eng.serviceTier) {
        setServiceTier(eng.serviceTier);
      }
      getAgreement(engagementId).then((ag) => {
        if (ag) {
          setServiceTier(ag.serviceTier ?? "");
          setScopeDescription(ag.scopeDescription);
          setTimeline(ag.timeline ?? "");
          setDeliverables(ag.deliverables.join("\n"));
          setFeeAmount(String(ag.feeAmount));
          setCurrency(ag.currency);
          setTerms(ag.terms);
          setStatus("PENDING");
          setSaved(true);
        }
      });
    });
  }, [engagementId]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        await createAgreement(engagementId, {
          serviceTier: serviceTier || null,
          scopeDescription,
          timeline: timeline || null,
          deliverables: deliverables
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean),
          feeAmount: parseFloat(feeAmount),
          currency,
          terms,
        });
        setSaved(true);
        setStatus("PENDING");
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to save agreement.",
        );
      }
    });
  }

  return (
    <>
      {status === "PENDING" && (
        <div className="rounded-xl px-4 py-3 flex items-center gap-3 text-sm font-medium bg-amber-50 text-amber-700 ring-1 ring-amber-200">
          Agreement sent — awaiting client signature
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="pt-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="serviceTier">Service tier (optional)</Label>
                <Input
                  id="serviceTier"
                  value={serviceTier}
                  onChange={(e) => {
                    setServiceTier(e.target.value);
                    setSaved(false);
                  }}
                  placeholder="e.g. Premium, Standard"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="timeline">Timeline (optional)</Label>
                <Input
                  id="timeline"
                  value={timeline}
                  onChange={(e) => {
                    setTimeline(e.target.value);
                    setSaved(false);
                  }}
                  placeholder="e.g. 3–6 months"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="scopeDescription">Scope of service</Label>
              <Textarea
                id="scopeDescription"
                rows={4}
                value={scopeDescription}
                onChange={(e) => {
                  setScopeDescription(e.target.value);
                  setSaved(false);
                }}
                placeholder="Describe the services Terralume will provide…"
                className="resize-none"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="deliverables">Deliverables (one per line)</Label>
              <Textarea
                id="deliverables"
                rows={4}
                value={deliverables}
                onChange={(e) => {
                  setDeliverables(e.target.value);
                  setSaved(false);
                }}
                placeholder={
                  "Property shortlist report\nDue diligence report\nNegotiation support"
                }
                className="resize-none font-mono text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="feeAmount">Agreed fee</Label>
                <Input
                  id="feeAmount"
                  type="number"
                  min="1"
                  step="any"
                  value={feeAmount}
                  onChange={(e) => {
                    setFeeAmount(e.target.value);
                    setSaved(false);
                  }}
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="currency">Currency</Label>
                <Input
                  id="currency"
                  value={currency}
                  onChange={(e) => {
                    setCurrency(e.target.value.toUpperCase());
                    setSaved(false);
                  }}
                  maxLength={3}
                  placeholder="NGN"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="terms">Terms &amp; conditions</Label>
              <Textarea
                id="terms"
                rows={6}
                value={terms}
                onChange={(e) => {
                  setTerms(e.target.value);
                  setSaved(false);
                }}
                placeholder="Full terms and conditions text…"
                className="resize-none"
                required
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex items-center gap-3">
              <Button type="submit" disabled={isPending}>
                <Save size={15} className="mr-2" />
                {isPending ? "Saving…" : "Save & notify client"}
              </Button>
              {saved && status === "PENDING" && (
                <span className="flex items-center gap-1.5 text-sm text-emerald-600">
                  <CheckCircle2 size={15} />
                  Saved
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </form>
    </>
  );
}
