"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

const inputClass =
  "w-full rounded-lg border border-(--color-divider) bg-(--color-surface-alt) px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-muted outline-none transition-all focus:border-(--color-navy) focus:ring-2 focus:ring-(--color-navy)/10 focus:bg-white disabled:opacity-50";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  // Wait for Supabase to process the hash and fire PASSWORD_RECOVERY
  const [sessionReady, setSessionReady] = useState(false);
  const [sessionError, setSessionError] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    async function init() {
      // Parse tokens from the URL hash (#access_token=...&refresh_token=...&type=recovery)
      const hash = window.location.hash.slice(1); // strip leading #
      const params = new URLSearchParams(hash);
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");

      if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (error) {
          setSessionError(true);
        } else {
          // Clean the hash from the URL without a reload
          window.history.replaceState(null, "", window.location.pathname);
          setSessionReady(true);
        }
        return;
      }

      // No hash — check if a session already exists (e.g. page reload after hash was cleared)
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setSessionReady(true);
      } else {
        setSessionError(true);
      }
    }

    init();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: sbError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (sbError) {
      toast.error(sbError.message);
    } else {
      setDone(true);
      setTimeout(() => router.push("/login"), 3000);
    }
  }

  return (
    <div className="flex flex-col bg-white lg:min-h-screen pt-17 lg:pt-0 lg:fixed lg:inset-0 lg:z-60 lg:flex-row lg:overflow-hidden">
      {/* ── Left: Brand panel ── */}
      <div className="hidden lg:flex lg:w-[46%] xl:w-[44%] shrink-0 flex-col justify-between bg-(--color-navy-dark) px-12 py-12 relative overflow-hidden">
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
            <CheckCircle2 size={20} className="text-white/60" />
          </div>
          <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-white/35 mb-5">
            Password Reset
          </p>
          <h1 className="font-display text-[2.6rem] font-bold text-white leading-[1.15] mb-5">
            Set your
            <br />
            <em className="not-italic text-(--color-crimson)">new password</em>
          </h1>
          <p className="text-white/55 text-[0.9rem] leading-relaxed max-w-xs">
            Choose a strong password to secure your Terralume client portal
            account.
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
          {done ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-50 border border-green-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={32} className="text-green-500" />
              </div>
              <h2 className="font-display text-2xl font-bold text-(--color-navy-dark) mb-3">
                Password updated
              </h2>
              <p className="text-sm text-on-surface-muted leading-relaxed">
                Your password has been changed. Redirecting you to sign in…
              </p>
            </div>
          ) : !sessionReady ? (
            <div className="text-center">
              {sessionError ? (
                <>
                  <p className="text-sm font-medium text-on-surface mb-2">
                    This link has expired or is invalid.
                  </p>
                  <Link
                    href="/reset-password"
                    className="text-sm text-navy underline underline-offset-4"
                  >
                    Request a new reset link
                  </Link>
                </>
              ) : (
                <div className="flex items-center justify-center gap-2 text-sm text-on-surface-muted">
                  <Loader2 size={16} className="animate-spin" />
                  Verifying your link…
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="font-display text-[1.75rem] font-bold text-(--color-navy-dark) mb-1.5">
                  Set new password
                </h2>
                <p className="text-sm text-on-surface-muted">
                  Must be at least 8 characters.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* New password */}
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
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 8 characters"
                      className={inputClass}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-muted hover:text-on-surface transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Confirm password */}
                <div>
                  <label
                    htmlFor="confirm-password"
                    className="block text-sm font-medium text-on-surface mb-1.5"
                  >
                    Confirm password
                  </label>
                  <input
                    id="confirm-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Repeat your password"
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
                      Updating…
                    </span>
                  ) : (
                    "Update password"
                  )}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
