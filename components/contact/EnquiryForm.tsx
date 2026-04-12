"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const COUNTRY_CODES = [
  { code: "+234", flag: "🇳🇬", name: "Nigeria" },
  { code: "+44", flag: "🇬🇧", name: "UK" },
  { code: "+1", flag: "🇺🇸", name: "USA / Canada" },
  { code: "+971", flag: "🇦🇪", name: "UAE" },
  { code: "+61", flag: "🇦🇺", name: "Australia" },
  { code: "+27", flag: "🇿🇦", name: "South Africa" },
  { code: "+353", flag: "🇮🇪", name: "Ireland" },
  { code: "+49", flag: "🇩🇪", name: "Germany" },
  { code: "+31", flag: "🇳🇱", name: "Netherlands" },
  { code: "+33", flag: "🇫🇷", name: "France" },
  { code: "+47", flag: "🇳🇴", name: "Norway" },
  { code: "+46", flag: "🇸🇪", name: "Sweden" },
  { code: "+64", flag: "🇳🇿", name: "New Zealand" },
];

const TRANSACTION_TYPES = [
  { value: "buy", label: "Buying a property" },
  { value: "rent", label: "Renting a property" },
  { value: "invest", label: "Buy-to-let investment" },
  { value: "corporate", label: "Corporate / company acquisition" },
  { value: "not-sure", label: "Not sure yet — just exploring" },
];

const labelClass = "block text-sm font-medium text-on-surface mb-1.5";
const inputClass =
  "w-full rounded-xl border border-divider bg-white px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-muted outline-none transition-all focus:border-navy focus:ring-2 focus:ring-navy/10";
const selectClass =
  "w-full appearance-none rounded-xl border border-divider bg-white px-4 py-3 text-sm text-on-surface outline-none transition-all focus:border-navy focus:ring-2 focus:ring-navy/10 cursor-pointer";

export function EnquiryForm() {
  const [countryCode, setCountryCode] = useState("+234");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Submission logic to be wired up
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-6 rounded-2xl border border-divider bg-navy-light px-8 py-16 text-center">
        {/* Checkmark */}
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-navy text-white">
          <svg
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </span>
        <div>
          <h3 className="font-display text-2xl font-bold text-navy">
            Enquiry received
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-on-surface-muted">
            We&apos;ll review your details and follow up within one business
            day. Check your inbox for a confirmation of what happens next.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="text-sm font-medium text-navy underline underline-offset-4"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-divider bg-white p-8"
      noValidate
    >
      {/* Full name */}
      <div>
        <label htmlFor="fullName" className={labelClass}>
          Full name <span className="text-crimson">*</span>
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          required
          autoComplete="name"
          placeholder="e.g. Adebayo Okonkwo"
          className={inputClass}
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className={labelClass}>
          Email address <span className="text-crimson">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className={inputClass}
        />
      </div>

      {/* Phone with country code */}
      <div>
        <label htmlFor="phone" className={labelClass}>
          Phone number
        </label>
        <div className="flex gap-2">
          {/* Country code selector */}
          <div className="relative shrink-0">
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              aria-label="Country calling code"
              className={[selectClass, "w-auto pr-8"].join(" ")}
            >
              {COUNTRY_CODES.map(({ code, flag, name }) => (
                <option key={`${code}-${name}`} value={code}>
                  {flag} {code}
                </option>
              ))}
            </select>
            {/* Chevron */}
            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-muted">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </span>
          </div>

          {/* Number input */}
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel-national"
            placeholder="080 0000 0000"
            className={[inputClass, "flex-1"].join(" ")}
          />
        </div>
        <p className="mt-1.5 text-xs text-on-surface-muted">
          Optional — helps us reach you faster for quick questions.
        </p>
      </div>

      {/* Transaction type */}
      <div>
        <label htmlFor="transactionType" className={labelClass}>
          What are you looking to do? <span className="text-crimson">*</span>
        </label>
        <div className="relative">
          <select
            id="transactionType"
            name="transactionType"
            required
            defaultValue=""
            className={selectClass}
          >
            <option value="" disabled>
              Select one…
            </option>
            {TRANSACTION_TYPES.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-muted">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </span>
        </div>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className={labelClass}>
          Tell us about your situation
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          placeholder="A brief description helps us give you a more useful first response. E.g. budget, target area, timeline, specific concerns."
          className={[inputClass, "resize-none leading-relaxed"].join(" ")}
        />
        <p className="mt-1.5 text-xs text-on-surface-muted">
          No detail is too early or too vague — this is just to get the
          conversation started.
        </p>
      </div>

      {/* Trust note */}
      <div className="rounded-xl bg-surface-alt px-4 py-3 text-xs leading-relaxed text-on-surface-muted">
        No obligation. No sales pressure. Your details are never shared with
        third parties. First response within one business day.
      </div>

      {/* Submit */}
      <Button type="submit" size="lg" className="w-full">
        Send enquiry
      </Button>
    </form>
  );
}
