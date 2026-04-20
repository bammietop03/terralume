"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import LoginForm from "@/components/auth/LoginForm";

const FEATURES = [
  "100% buyer-side only — we never represent sellers",
  "8-stage advisory process, start to finish",
  "Dedicated project manager for every client",
];

export default function LoginPageClient() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? undefined;

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
          className="absolute -bottom-40 -right-40 w-105 h-105 rounded-full opacity-5"
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
          <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-white/35 mb-5">
            Client Portal
          </p>
          <h1 className="font-display text-[2.6rem] font-bold text-white leading-[1.15] mb-5">
            Your home in Lagos,
            <br />
            <em className="not-italic text-(--color-crimson)">
              expertly guided.
            </em>
          </h1>
          <p className="text-white/55 text-[0.9rem] leading-relaxed mb-8 max-w-xs">
            Track your search, review property shortlists, and stay connected
            with your advisory team — all in one place.
          </p>
          <ul className="space-y-3.5">
            {FEATURES.map((f) => (
              <li
                key={f}
                className="flex items-start gap-3 text-white/65 text-sm"
              >
                <CheckCircle2
                  size={15}
                  className="text-(--color-crimson) shrink-0 mt-0.5"
                />
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Footer note */}
        <div className="relative z-10">
          <p className="text-white/35 text-xs">
            Not yet a client?{" "}
            <Link
              href="/consultation"
              className="text-white/60 underline underline-offset-2 hover:text-white transition-colors"
            >
              Book a consultation →
            </Link>
          </p>
        </div>
      </div>

      {/* ── Right: Form panel ── */}
      <div className="flex-1 flex flex-col justify-center overflow-y-auto px-6 sm:px-10 lg:px-16 xl:px-20 py-6 lg:py-0">
        <div className="w-full max-w-90 mx-auto">
          <div className="mb-8">
            <h2 className="font-display text-[1.75rem] font-bold text-(--color-navy-dark) mb-1.5">
              Welcome back
            </h2>
            <p className="text-sm text-on-surface-muted">
              Sign in to your client portal
            </p>
          </div>

          <LoginForm portalType="client" redirectTo={redirectTo} />

          <p className="mt-8 text-center text-xs text-on-surface-muted">
            Having trouble?{" "}
            <a
              href="mailto:hello@terralume.com"
              className="text-(--color-navy) hover:underline"
            >
              Contact your advisor
            </a>
          </p>

          <div className="mt-6 pt-6 border-t border-(--color-divider) text-center">
            <Link
              href="/admin-login"
              className="text-xs text-on-surface-muted hover:text-on-surface transition-colors"
            >
              Terralume team? Sign in here →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
