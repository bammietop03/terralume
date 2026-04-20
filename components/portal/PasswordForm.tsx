"use client";

import { useState, useTransition } from "react";
import { Loader2, Check, AlertCircle, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { updatePassword } from "@/app/actions/auth";

type Status = "idle" | "saved" | "error";

export default function PasswordForm() {
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [pending, startTransition] = useTransition();

  function validate(): string | null {
    if (!currentPwd) return "Current password is required.";
    if (newPwd.length < 8) return "New password must be at least 8 characters.";
    if (newPwd !== confirmPwd) return "Passwords do not match.";
    if (newPwd === currentPwd)
      return "New password must differ from current password.";
    return null;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validate();
    if (err) {
      setStatus("error");
      setErrorMsg(err);
      return;
    }
    setStatus("idle");
    setErrorMsg("");
    startTransition(async () => {
      const result = await updatePassword(currentPwd, newPwd);
      if (result.ok) {
        setStatus("saved");
        setCurrentPwd("");
        setNewPwd("");
        setConfirmPwd("");
        setTimeout(() => setStatus("idle"), 3000);
      } else {
        setStatus("error");
        setErrorMsg(result.error);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-6">
      <Card className="rounded-2xl border-divider/60 shadow-sm">
        {/* Card header accent */}
        <div className="h-1 w-full rounded-t-2xl bg-linear-to-r from-crimson to-navy-light" />

        <CardContent className="px-5 py-5 space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-divider/60">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy-light">
              <KeyRound size={16} className="text-(--color-navy)" />
            </div>
            <div>
              <p className="text-sm font-semibold text-on-surface leading-tight">
                Change password
              </p>
              <p className="text-xs text-on-surface-muted mt-0.5">
                Choose a strong password with at least 8 characters.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="current-pwd"
                className="text-xs font-semibold uppercase tracking-wide text-on-surface-muted"
              >
                Current password
              </Label>
              <Input
                id="current-pwd"
                type="password"
                autoComplete="current-password"
                value={currentPwd}
                onChange={(e) => setCurrentPwd(e.target.value)}
                placeholder="Enter current password"
                className="h-10 rounded-xl border-divider/80 bg-surface text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="new-pwd"
                className="text-xs font-semibold uppercase tracking-wide text-on-surface-muted"
              >
                New password
              </Label>
              <Input
                id="new-pwd"
                type="password"
                autoComplete="new-password"
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)}
                placeholder="At least 8 characters"
                className="h-10 rounded-xl border-divider/80 bg-surface text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="confirm-pwd"
                className="text-xs font-semibold uppercase tracking-wide text-on-surface-muted"
              >
                Confirm new password
              </Label>
              <Input
                id="confirm-pwd"
                type="password"
                autoComplete="new-password"
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
                placeholder="Repeat new password"
                className="h-10 rounded-xl border-divider/80 bg-surface text-sm"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status feedback */}
      {status === "error" && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          <AlertCircle size={15} className="shrink-0" />
          {errorMsg}
        </div>
      )}

      {status === "saved" && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700">
          <Check size={15} className="shrink-0" />
          Password updated successfully.
        </div>
      )}

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={pending}
          className="h-10 px-6 rounded-xl bg-(--color-navy) text-white hover:bg-(--color-navy-dark) text-sm font-semibold"
        >
          {pending ? (
            <>
              <Loader2 size={14} className="animate-spin mr-2" />
              Updating…
            </>
          ) : (
            "Update password"
          )}
        </Button>
      </div>
    </form>
  );
}
