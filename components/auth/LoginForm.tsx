"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const inputClass =
  "w-full rounded-lg border border-(--color-divider) bg-(--color-surface-alt) px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-muted outline-none transition-all focus:border-(--color-navy) focus:ring-2 focus:ring-(--color-navy)/10 focus:bg-white disabled:opacity-50";

export default function LoginForm({
  portalType,
  redirectTo,
}: {
  portalType: "client" | "admin";
  redirectTo?: string;
}) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, portalType }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "Login failed. Please try again.");
        return;
      }
      toast.success("Logged in successfully!");

      router.push(
        redirectTo && redirectTo.startsWith("/")
          ? redirectTo
          : data.redirectUrl,
      );
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Email */}
      <div>
        <label
          htmlFor="login-email"
          className="block text-sm font-medium text-on-surface mb-1.5"
        >
          Email address
        </label>
        <input
          id="login-email"
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

      {/* Password */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label
            htmlFor="login-password"
            className="block text-sm font-medium text-on-surface"
          >
            Password
          </label>
          {portalType === "client" && (
            <Link
              href="/reset-password"
              className="text-xs text-(--color-navy) hover:text-(--color-navy-dark) underline underline-offset-2"
            >
              Forgot password?
            </Link>
          )}
        </div>
        <div className="relative">
          <input
            id="login-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className={`${inputClass} pr-11`}
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-muted hover:text-on-surface transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </div>
      </div>

      {/* Submit */}
      <Button type="submit" className="w-full mt-1" disabled={loading}>
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 size={15} className="animate-spin" />
            Signing in…
          </span>
        ) : (
          "Sign in"
        )}
      </Button>
    </form>
  );
}
