"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, CheckCircle2, Mail } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

const inputClass =
  "w-full rounded-lg border border-(--color-divider) bg-(--color-surface-alt) px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-muted outline-none transition-all focus:border-(--color-navy) focus:ring-2 focus:ring-(--color-navy)/10 focus:bg-white disabled:opacity-50";

const ERROR_MESSAGES: Record<string, string> = {
  otp_expired: "This reset link has expired. Please request a new one.",
  access_denied:
    "The reset link is invalid or has already been used. Please request a new one.",
};

export default function ResetPasswordPageClient() {
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (urlError) {
      toast.error(
        ERROR_MESSAGES[urlError] ?? "Something went wrong. Please try again.",
      );
    }
  }, [urlError]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();
    const { error: sbError } = await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: `${window.location.origin}/api/auth/callback?next=/reset-password/update`,
      },
    );

    setLoading(false);

    if (sbError) {
      toast.error(sbError.message);
    } else {
      setSent(true);
    }
  }

  return (
    <div className="flex flex-col bg-white lg:min-h-screen pt-17 lg:pt-0 lg:fixed lg:inset-0 lg:z-60 lg:flex-row lg:overflow-hidden">
      {/* ── Left: Brand panel ── */}
      <div className="hidden lg:flex lg:w-[46%] xl:w-[44%] shrink-0 flex-col justify-between bg-(--color-navy-dark) px-12 py-12 relative overflow-hidden">
        {/* Subtle grid */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(to right,white 1px,transparent 1px),linear-gradient(to bottom,white 1px,transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        <div
          aria-hidden
          className="absolute -bottom-32 -left-32 w-90 h-90 rounded-full opacity-[0.06]"
          style={{ background: "var(--color-crimson)" }}
        />

        {/* Logo */}
        <div className="relative z-10">
          <Link href="/" className="inline-block">
            <span className="font-display text-2xl font-bold text-white tracking-tight">
              Terra<span className="text-(--color-crimson)">lume</span>
            </span>
          </Link>
        </div>

        {/* Copy */}
        <div className="relative z-10">
          <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center mb-6">
            <Mail size={20} className="text-white/60" />
          </div>
          <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-white/35 mb-5">
            Password Reset
          </p>
          <h1 className="font-display text-[2.6rem] font-bold text-white leading-[1.15] mb-5">
            Forgot your
            <br />
            <em className="not-italic text-(--color-crimson)">password?</em>
          </h1>
          <p className="text-white/55 text-[0.9rem] leading-relaxed max-w-xs">
            No worries — it happens to the best of us. Enter your email and
            we&apos;ll send you a secure reset link straight away.
          </p>
        </div>

        {/* Footer note */}
        <div className="relative z-10">
          <Link
            href="/login"
            className="text-white/35 text-xs hover:text-white/60 transition-colors"
          >
            ← Back to login
          </Link>
        </div>
      </div>

      {/* ── Right: Form panel ── */}
      <div className="flex-1 flex flex-col justify-center overflow-y-auto px-6 sm:px-10 lg:px-16 xl:px-20 py-6 lg:py-0">
        <div className="w-full max-w-90 mx-auto">
          {sent ? (
            /* ── Success state ── */
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-50 border border-green-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={32} className="text-green-500" />
              </div>
              <h2 className="font-display text-2xl font-bold text-(--color-navy-dark) mb-3">
                Check your inbox
              </h2>
              <p className="text-sm text-on-surface-muted leading-relaxed mb-6">
                We&apos;ve sent a reset link to{" "}
                <span className="font-semibold text-on-surface">{email}</span>.
                The link expires in 1 hour.
              </p>
              <Link
                href="/login"
                className="text-sm text-(--color-navy) font-medium hover:text-(--color-navy-dark) underline underline-offset-2"
              >
                ← Back to login
              </Link>
            </div>
          ) : (
            /* ── Form state ── */
            <>
              <div className="mb-8">
                <h2 className="font-display text-[1.75rem] font-bold text-(--color-navy-dark) mb-1.5">
                  Reset password
                </h2>
                <p className="text-sm text-on-surface-muted">
                  Enter your email and we&apos;ll send you a reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                  <label
                    htmlFor="reset-email"
                    className="block text-sm font-medium text-on-surface mb-1.5"
                  >
                    Email address
                  </label>
                  <input
                    id="reset-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={inputClass}
                    disabled={loading}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full mt-1"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 size={15} className="animate-spin" />
                      Sending…
                    </span>
                  ) : (
                    "Send reset link"
                  )}
                </Button>
              </form>

              <p className="mt-6 text-center">
                <Link
                  href="/login"
                  className="text-sm text-on-surface-muted hover:text-on-surface transition-colors"
                >
                  ← Back to login
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
