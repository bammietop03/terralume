"use client";

import { useState, useCallback } from "react";
import { ProgressBar } from "./ProgressBar";
import { Step1Goal } from "./Step1Goal";
import { Step2AboutYou } from "./Step2AboutYou";
import { Step3Property } from "./Step3Property";
import { Step4Budget } from "./Step4Budget";
import { Step5Timeline } from "./Step5Timeline";
import { Step6Review } from "./Step6Review";
import {
  INITIAL_FORM_DATA,
  TOTAL_STEPS,
  STEP_LABELS,
  STEP_DESCRIPTIONS,
  type FormData,
} from "./types";
import { submitIntakeForm } from "@/app/actions/intake";

type Errors = Partial<Record<keyof FormData, string>>;

function validateStep(step: number, data: FormData): Errors {
  const errs: Errors = {};
  if (step === 1) {
    if (!data.transactionType)
      errs.transactionType = "Please select what you are looking to do.";
  }
  if (step === 2) {
    if (!data.fullName.trim()) errs.fullName = "Full name is required.";
    if (!data.email.includes("@"))
      errs.email = "Please enter a valid email address.";
    if (!data.phone.trim()) errs.phone = "Phone number is required.";
    if (!data.location) errs.location = "Please select your current location.";
  }
  if (step === 3) {
    if (data.targetAreas.length === 0)
      (errs as Record<string, string>).targetAreas =
        "Please select at least one area.";
    if (!data.propertyType)
      errs.propertyType = "Please select a property type.";
  }
  if (step === 4) {
    if (!data.budgetMin.trim()) errs.budgetMin = "Minimum budget is required.";
    if (!data.sourceOfFunds)
      errs.sourceOfFunds = "Please select source of funds.";
  }
  return errs;
}

export function IntakeForm() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const set = useCallback((patch: Partial<FormData>) => {
    setData((prev) => ({ ...prev, ...patch }));
    // Clear errors for touched fields
    setErrors((prev) => {
      const next = { ...prev };
      for (const key of Object.keys(patch))
        delete (next as Record<string, unknown>)[key];
      return next;
    });
  }, []);

  async function handleNext(e: React.FormEvent) {
    e.preventDefault();
    const errs = validateStep(step, data);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});

    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Final step submit
    if (!data.dataConsent) {
      setErrors({
        dataConsent: "Please confirm your consent to proceed.",
      } as Errors);
      return;
    }

    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const result = await submitIntakeForm(data);
      if (result.success && result.referenceNumber) {
        setReferenceNumber(result.referenceNumber);
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setSubmitError(
          result.error ?? "Something went wrong. Please try again.",
        );
      }
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleBack() {
    if (step > 1) {
      setStep((s) => s - 1);
      setErrors({});
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  if (submitted) {
    return (
      <div className="overflow-hidden rounded-2xl border border-divider bg-white">
        {/* Brand bar */}
        <div className="flex items-center justify-between bg-[#111D4E] px-6 py-4">
          <div>
            <p className="text-sm font-medium tracking-wide text-white">
              TERRALUME LTD
            </p>
            <p className="mt-0.5 text-[11px] text-[#A8B4D8]">
              Buyer-Side Real Estate Advisory · Lagos, Nigeria
            </p>
          </div>
          <div className="text-right text-[11px] leading-relaxed text-[#A8B4D8]">
            Secure intake form
            <br />
            All data confidential
          </div>
        </div>
        <div className="h-[3px] bg-[#9B1C2E]" />

        <div className="flex flex-col items-center gap-6 bg-navy-light px-8 py-20 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-navy text-white">
            <svg
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 28 28"
              stroke="currentColor"
              strokeWidth={2}
            >
              <circle cx="14" cy="14" r="13" strokeWidth="1.5" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 14l4 4 8-8"
                strokeWidth="2"
              />
            </svg>
          </span>
          <div>
            <h3 className="font-display text-2xl font-bold text-navy">
              Enquiry received
            </h3>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-on-surface-muted">
              Thank you{data.preferredName ? `, ${data.preferredName}` : ""}.
              Your brief is with us. A Terralume advisor will contact you within
              48 hours to schedule your discovery call. A confirmation has been
              sent to <strong className="text-on-surface">{data.email}</strong>.
            </p>
          </div>
          {referenceNumber && (
            <div className="rounded-full bg-navy/10 px-6 py-2.5">
              <span className="text-sm font-semibold tracking-wide text-navy">
                Your reference: {referenceNumber}
              </span>
            </div>
          )}
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="/client-portal/dashboard"
              className="rounded-xl bg-navy px-5 py-2.5 text-sm font-medium text-white hover:bg-navy-dark transition-colors"
            >
              Go to your portal
            </a>
            <a
              href="/market-intelligence"
              className="rounded-xl border border-divider bg-white px-5 py-2.5 text-sm font-medium text-on-surface hover:shadow-sm"
            >
              Read market intelligence
            </a>
          </div>
        </div>
      </div>
    );
  }

  const isLastStep = step === TOTAL_STEPS;

  return (
    <div className="overflow-hidden rounded-2xl border border-divider bg-white">
      {/* Brand bar — matches HTML header */}
      <div className="flex items-center justify-between bg-[#111D4E] px-6 py-4">
        <div>
          <p className="text-sm font-medium tracking-wide text-white">
            TERRALUME LTD
          </p>
          <p className="mt-0.5 text-[11px] text-[#A8B4D8]">
            Buyer-Side Real Estate Advisory · Lagos, Nigeria
          </p>
        </div>
        <div className="text-right text-[11px] leading-relaxed text-[#A8B4D8]">
          Secure intake form
          <br />
          All data confidential
        </div>
      </div>
      {/* Crimson rule */}
      <div className="h-[3px] bg-[#9B1C2E]" />

      <div className="p-6 sm:p-8">
        <ProgressBar step={step} />

        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-crimson mb-1">
            Step {step} of {TOTAL_STEPS}
          </p>
          <h2 className="font-display text-xl font-bold text-on-surface">
            {STEP_LABELS[step - 1]}
          </h2>
          <p className="mt-1 text-sm text-on-surface-muted">
            {STEP_DESCRIPTIONS[step]}
          </p>
        </div>

        <form onSubmit={handleNext} noValidate>
          {step === 1 && <Step1Goal data={data} set={set} />}
          {step === 2 && (
            <Step2AboutYou data={data} set={set} errors={errors} />
          )}
          {step === 3 && (
            <Step3Property data={data} set={set} errors={errors} />
          )}
          {step === 4 && <Step4Budget data={data} set={set} errors={errors} />}
          {step === 5 && <Step5Timeline data={data} set={set} />}
          {step === 6 && <Step6Review data={data} set={set} />}

          {/* Step 1 validation error (for no type selected) */}
          {step === 1 && errors.transactionType && (
            <p className="mt-3 text-xs text-red-600">
              {errors.transactionType}
            </p>
          )}

          <div className="mt-8 flex items-center justify-between gap-4 border-t border-divider pt-6">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-2 rounded-xl border border-divider px-5 py-3 text-sm font-medium text-on-surface transition-colors hover:bg-surface-alt"
              >
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
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back
              </button>
            ) : (
              <div />
            )}

            <div className="flex flex-col items-end gap-2">
              {submitError && (
                <p className="text-xs text-red-600">{submitError}</p>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-navy px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy-dark disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting
                  ? "Submitting..."
                  : isLastStep
                    ? "Submit enquiry"
                    : "Continue"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
