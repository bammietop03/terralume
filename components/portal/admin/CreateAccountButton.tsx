"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createAccountFromIntake } from "@/app/actions/intake";
import { Button } from "@/components/ui/button";
import { UserPlus, Loader2 } from "lucide-react";

interface Props {
  intakeId: string;
  clientName: string;
  clientEmail: string;
}

export default function CreateAccountButton({
  intakeId,
  clientName,
  clientEmail,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleCreate() {
    setError("");
    startTransition(async () => {
      try {
        const result = await createAccountFromIntake(intakeId);
        if (result.success) {
          router.refresh();
        } else {
          setError(result.error || "Failed to create account.");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to create account.",
        );
      }
    });
  }

  return (
    <div className="space-y-2">
      <Button
        onClick={handleCreate}
        disabled={pending}
        className="bg-(--color-navy) text-white hover:bg-(--color-navy-dark) disabled:opacity-50"
        size="sm"
      >
        {pending ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            Creating account...
          </>
        ) : (
          <>
            <UserPlus size={14} />
            Create account
          </>
        )}
      </Button>
      {error && (
        <p className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
          {error}
        </p>
      )}
    </div>
  );
}
