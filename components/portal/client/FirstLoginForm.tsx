"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, CheckCircle2, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full rounded-xl border border-divider bg-white px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-muted outline-none transition-all focus:border-navy focus:ring-2 focus:ring-navy/10 disabled:opacity-50";

interface Props {
  userName: string | null;
  brief: string | null;
  transactionType: string | null;
  userId: string;
}

export default function FirstLoginForm({
  userName,
  brief,
  transactionType,
  userId,
}: Props) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);

  // Step 1 state
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);

  // Step 2 state
  const [confirming, setConfirming] = useState(false);

  async function handleSetPassword(e: FormEvent) {
    e.preventDefault();

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match.");
      return;
    }

    setPwLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setPwLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      setStep(2);
    }
  }

  async function handleConfirmBrief() {
    setConfirming(true);
    try {
      await fetch("/api/auth/onboarding-complete", { method: "POST" });
    } catch {
      // non-critical
    }
    router.push("/client-portal/dashboard");
  }

  return (
    <div className="min-h-screen bg-surface-alt flex items-start justify-center pt-16 px-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="font-display text-2xl font-bold tracking-tight text-navy-dark">
            Terra<span className="text-(--color-crimson)">lume</span>
          </span>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={cn(
                  "h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all",
                  step === s
                    ? "bg-(--color-navy) text-white"
                    : step > s
                      ? "bg-green-500 text-white"
                      : "bg-divider text-on-surface-muted",
                )}
              >
                {step > s ? <CheckCircle2 size={14} /> : s}
              </div>
              <span
                className={cn(
                  "text-xs font-medium",
                  step >= s ? "text-on-surface" : "text-on-surface-muted",
                )}
              >
                {s === 1 ? "Set password" : "Confirm brief"}
              </span>
              {s < 2 && (
                <ChevronRight size={14} className="text-on-surface-muted" />
              )}
            </div>
          ))}
        </div>

        <div className="bg-surface rounded-2xl border border-divider p-8 shadow-sm">
          {/* ── Step 1: Set Password ── */}
          {step === 1 && (
            <>
              <div className="mb-6">
                <h1 className="font-display text-xl font-semibold text-on-surface">
                  Welcome, {userName?.split(" ")[0] ?? "there"} 👋
                </h1>
                <p className="mt-1.5 text-sm text-on-surface-muted">
                  Set a secure password for your client portal.
                </p>
              </div>

              <form
                onSubmit={handleSetPassword}
                className="flex flex-col gap-5"
              >
                <div>
                  <label
                    htmlFor="new-password"
                    className="block text-sm font-medium text-on-surface mb-1.5"
                  >
                    New password
                  </label>
                  <div className="relative">
                    <input
                      id="new-password"
                      type={showPw ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 8 characters"
                      className={cn(inputClass, "pr-11")}
                      disabled={pwLoading}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-muted hover:text-on-surface"
                      aria-label="Toggle password visibility"
                    >
                      {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="confirm-password"
                    className="block text-sm font-medium text-on-surface mb-1.5"
                  >
                    Confirm password
                  </label>
                  <div className="relative">
                    <input
                      id="confirm-password"
                      type={showConfirm ? "text" : "password"}
                      required
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder="Repeat your password"
                      className={cn(inputClass, "pr-11")}
                      disabled={pwLoading}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-muted hover:text-on-surface"
                      aria-label="Toggle confirm password visibility"
                    >
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="default"
                  className="w-full"
                  disabled={pwLoading}
                >
                  {pwLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 size={16} className="animate-spin" /> Saving…
                    </span>
                  ) : (
                    "Set password & continue"
                  )}
                </Button>
              </form>
            </>
          )}

          {/* ── Step 2: Confirm Brief ── */}
          {step === 2 && (
            <>
              <div className="mb-6">
                <h1 className="font-display text-xl font-semibold text-on-surface">
                  Review your brief
                </h1>
                <p className="mt-1.5 text-sm text-on-surface-muted">
                  This is the summary of your goals from your intake form.
                  Review and confirm to activate your portal.
                </p>
              </div>

              <div className="rounded-xl bg-surface-alt border border-divider p-5 mb-6 space-y-3">
                {transactionType && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-muted mb-0.5">
                      Transaction type
                    </p>
                    <p className="text-sm text-on-surface capitalize">
                      {transactionType.replace(/-/g, " ")}
                    </p>
                  </div>
                )}
                {brief ? (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-muted mb-0.5">
                      Your brief
                    </p>
                    <p className="text-sm text-on-surface leading-relaxed">
                      {brief}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-on-surface-muted italic">
                    No brief on file yet — your PM will reach out shortly.
                  </p>
                )}
              </div>

              <Button
                onClick={handleConfirmBrief}
                variant="default"
                className="w-full"
                disabled={confirming}
              >
                {confirming ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 size={16} className="animate-spin" /> Setting up…
                  </span>
                ) : (
                  "Confirm & go to dashboard"
                )}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
