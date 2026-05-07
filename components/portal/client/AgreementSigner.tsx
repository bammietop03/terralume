"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { signAgreement } from "@/app/actions/agreements";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { PenLine } from "lucide-react";

export default function AgreementSigner({
  engagementId,
}: {
  engagementId: string;
}) {
  const [agreed, setAgreed] = useState(false);
  const [signerName, setSignerName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSign(e: React.FormEvent) {
    e.preventDefault();
    if (!agreed) {
      setError("Please confirm you have read and agreed to the terms.");
      return;
    }
    if (!signerName.trim()) {
      setError("Please type your full name to sign.");
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        await signAgreement(engagementId, signerName.trim());
        router.refresh();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to sign agreement.",
        );
      }
    });
  }

  return (
    <Card className="border-2 border-(--color-navy)/20">
      <CardContent className="pt-5">
        <div className="flex items-center gap-2 mb-4">
          <PenLine size={18} className="text-(--color-navy)" />
          <h2 className="font-semibold text-on-surface">Sign this agreement</h2>
        </div>

        <form onSubmit={handleSign} className="space-y-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => {
                setAgreed(e.target.checked);
                setError(null);
              }}
              className="mt-0.5 rounded border-divider h-4 w-4 shrink-0"
            />
            <span className="text-sm text-on-surface">
              I confirm that I have read and understood this service agreement,
              and I agree to its terms and conditions.
            </span>
          </label>

          <div className="space-y-1.5">
            <Label htmlFor="signerName">
              Type your full legal name to sign
            </Label>
            <Input
              id="signerName"
              value={signerName}
              onChange={(e) => setSignerName(e.target.value)}
              placeholder="Your full name"
              required
            />
            <p className="text-xs text-on-surface-muted">
              By typing your name and clicking Sign, you are providing a legally
              binding electronic signature.
            </p>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button
            type="submit"
            disabled={isPending || !agreed || !signerName.trim()}
            className="w-full sm:w-auto"
          >
            <PenLine size={15} className="mr-2" />
            {isPending ? "Signing…" : "Sign agreement"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
