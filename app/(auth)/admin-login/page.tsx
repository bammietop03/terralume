import Link from "next/link";
import { Lock } from "lucide-react";
import LoginForm from "@/components/auth/LoginForm";

export const metadata = {
  title: "Team Sign In — Terralume",
};

export default function AdminLoginPage() {
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
        {/* Decorative circle */}
        <div
          aria-hidden
          className="absolute -top-40 -left-40 w-95 h-95 rounded-full opacity-[0.06]"
          style={{ background: "var(--color-crimson)" }}
        />

        {/* Logo + Internal badge */}
        <div className="relative z-10 flex items-center justify-between">
          <Link href="/" className="inline-block">
            <span className="font-display text-2xl font-bold text-white tracking-tight">
              Terra<span className="text-(--color-crimson)">lume</span>
            </span>
          </Link>
          <span className="text-[10px] font-bold tracking-[0.12em] uppercase bg-white/10 text-white/50 px-2.5 py-1 rounded-full">
            Internal
          </span>
        </div>

        {/* Copy */}
        <div className="relative z-10">
          <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center mb-6">
            <Lock size={20} className="text-white/60" />
          </div>
          <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-white/35 mb-5">
            Team Portal
          </p>
          <h1 className="font-display text-[2.6rem] font-bold text-white leading-[1.15] mb-5">
            Terralume
            <br />
            <em className="not-italic text-(--color-crimson)">Team Access</em>
          </h1>
          <p className="text-white/55 text-[0.9rem] leading-relaxed max-w-xs">
            Restricted to authorised Terralume project managers and
            administrators. Unauthorised access is prohibited and monitored.
          </p>
        </div>

        {/* Footer note */}
        <div className="relative z-10">
          <Link
            href="/"
            className="text-white/35 text-xs hover:text-white/60 transition-colors"
          >
            ← Back to main site
          </Link>
        </div>
      </div>

      {/* ── Right: Form panel ── */}
      <div className="flex-1 flex flex-col justify-center overflow-y-auto px-6 sm:px-10 lg:px-16 xl:px-20 py-6 lg:py-0">
        <div className="w-full max-w-90 mx-auto">
          <div className="mb-8">
            <h2 className="font-display text-[1.75rem] font-bold text-(--color-navy-dark) mb-1.5">
              Team sign in
            </h2>
            <p className="text-sm text-on-surface-muted">
              For authorised Terralume staff only
            </p>
          </div>

          <LoginForm portalType="admin" />

          <p className="mt-8 text-center text-xs text-on-surface-muted">
            Not a team member?{" "}
            <Link href="/login" className="text-(--color-navy) hover:underline">
              Client portal →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
