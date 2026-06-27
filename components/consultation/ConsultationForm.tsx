"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { submitConsultationRequest } from "@/app/actions/leads";
import type { LeadInterestType } from "@/app/generated/prisma/client";
import { CheckCircle2 } from "lucide-react";

const COUNTRY_CODES = [
  { code: "+234", flag: "🇳🇬", name: "Nigeria" },
  { code: "+44", flag: "🇬🇧", name: "UK" },
  { code: "+1", flag: "🇺🇸", name: "USA / Canada" },
  { code: "+971", flag: "🇦🇪", name: "UAE" },
  { code: "+61", flag: "🇦🇺", name: "Australia" },
  { code: "+27", flag: "🇿🇦", name: "South Africa" },
  { code: "+353", flag: "🇮🇪", name: "Ireland" },
  { code: "+49", flag: "🇩🇪", name: "Germany" },
];

const SERVICE_OPTIONS: { value: LeadInterestType; label: string }[] = [
  { value: "REAL_ESTATE", label: "Real estate" },
  { value: "ENERGY", label: "Energy" },
  { value: "BOTH", label: "Both" },
  { value: "NOT_SURE", label: "Not sure" },
];

const LOCATIONS = [
  { value: "Lagos", label: "Lagos" },
  { value: "Abuja", label: "Abuja" },
  { value: "Port Harcourt", label: "Port Harcourt" },
  { value: "Other", label: "Other" },
];

export function ConsultationForm() {
  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [countryCode, setCountryCode] = useState("+234");
  const [serviceArea, setServiceArea] = useState<LeadInterestType | "">("");
  const [location, setLocation] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = e.currentTarget;
    const data = new FormData(form);

    const fullName = (data.get("fullName") as string)?.trim();
    const phoneLocal = (data.get("phone") as string)?.trim();
    const email = (data.get("email") as string)?.trim();
    const description = (data.get("description") as string)?.trim();

    if (!fullName || !phoneLocal || !email) {
      setError("Please fill in all required fields.");
      return;
    }

    const phone = `${countryCode}${phoneLocal.replace(/^0/, "")}`;

    startTransition(async () => {
      const result = await submitConsultationRequest({
        fullName,
        phone,
        email,
        location: location || undefined,
        interestType: serviceArea || undefined,
        notes: description || undefined,
      });

      if (result.success) {
        setSubmitted(true);
      } else {
        setError(result.error ?? "Something went wrong. Please try again.");
      }
    });
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-6 rounded-2xl border border-divider bg-navy-light px-8 py-16 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-navy text-white">
          <CheckCircle2 className="h-8 w-8" />
        </span>
        <div>
          <h3 className="font-display text-2xl font-bold text-navy">
            Request received
          </h3>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-on-surface-muted">
            A confirmation email is on its way. A Terralume project manager will
            be in touch within 12–24 hours to schedule your free consultation.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-divider bg-white p-8"
      noValidate
    >
      {/* Full name */}
      <div className="space-y-1.5">
        <Label htmlFor="fullName">
          Full name <span className="text-crimson">*</span>
        </Label>
        <Input
          id="fullName"
          name="fullName"
          type="text"
          placeholder="e.g. Amara Okonkwo"
          required
          autoComplete="name"
          className="h-12 rounded-xl border-divider text-sm focus-visible:ring-navy/20"
        />
      </div>

      {/* Phone */}
      <div className="space-y-1.5">
        <Label htmlFor="phone">
          Phone number <span className="text-crimson">*</span>
        </Label>
        <div className="flex gap-2">
          <select
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            aria-label="Country code"
            className="h-12 shrink-0 appearance-none rounded-xl border border-divider bg-white px-3 text-sm text-on-surface outline-none transition-all focus:border-navy focus:ring-2 focus:ring-navy/10"
          >
            {COUNTRY_CODES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.code}
              </option>
            ))}
          </select>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="812 345 6789"
            required
            autoComplete="tel-local"
            className="h-12 rounded-xl border-divider text-sm focus-visible:ring-navy/20"
          />
        </div>
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <Label htmlFor="email">
          Email address <span className="text-crimson">*</span>
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          autoComplete="email"
          className="h-12 rounded-xl border-divider text-sm focus-visible:ring-navy/20"
        />
      </div>

      {/* What do you need help with */}
      <div className="space-y-1.5">
        <Label htmlFor="serviceArea">
          What do you need help with?{" "}
          <span className="text-on-surface-muted font-normal">(optional)</span>
        </Label>
        <Select
          value={serviceArea}
          onValueChange={(v) => setServiceArea(v as LeadInterestType)}
        >
          <SelectTrigger
            id="serviceArea"
            className="h-12 rounded-xl border-divider text-sm"
          >
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            {SERVICE_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Location */}
      <div className="space-y-1.5">
        <Label htmlFor="location">
          Location{" "}
          <span className="text-on-surface-muted font-normal">(optional)</span>
        </Label>
        <Select value={location} onValueChange={setLocation}>
          <SelectTrigger
            id="location"
            className="h-12 rounded-xl border-divider text-sm"
          >
            <SelectValue placeholder="Select a city" />
          </SelectTrigger>
          <SelectContent>
            {LOCATIONS.map((l) => (
              <SelectItem key={l.value} value={l.value}>
                {l.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <Label htmlFor="description">
          Brief description of what you&apos;re looking for{" "}
          <span className="text-on-surface-muted font-normal">(optional)</span>
        </Label>
        <Textarea
          id="description"
          name="description"
          placeholder="e.g. Looking for a 3-bedroom home in Lekki, budget ₦80m, ready to buy within 3 months."
          rows={4}
          className="rounded-xl border-divider text-sm focus-visible:ring-navy/20 resize-none"
        />
      </div>

      {error && (
        <p role="alert" className="text-sm font-medium text-crimson">
          {error}
        </p>
      )}

      <Button
        type="submit"
        disabled={isPending}
        className="h-12 w-full rounded-xl bg-navy text-sm font-semibold uppercase tracking-wide text-white hover:bg-navy-dark"
      >
        {isPending ? "Sending…" : "Request free consultation"}
      </Button>

      <p className="text-center text-[12px] text-on-surface-muted">
        No commitment required. We will not share your details with third
        parties.
      </p>
    </form>
  );
}
