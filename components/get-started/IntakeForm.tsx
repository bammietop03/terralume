"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "./ProgressBar";
import { Step1AboutYou } from "./Step1AboutYou";
import { Step2YourGoal } from "./Step2YourGoal";
import { Step3Budget } from "./Step3Budget";
import { Step4Property } from "./Step4Property";
import { Step5Timeline } from "./Step5Timeline";
import { Step6Background } from "./Step6Background";
import { Step7Confirmation } from "./Step7Confirmation";
import {
  TOTAL_STEPS,
  STEP_LABELS,
  STEP_DESCRIPTIONS,
  INITIAL_FORM_DATA,
  type FormData,
} from "./types";

export function IntakeForm() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>(INITIAL_FORM_DATA);
  const [submitted, setSubmitted] = useState(false);

  const set = useCallback((patch: Partial<FormData>) => {
    setData((prev) => ({ ...prev, ...patch }));
  }, []);

  function isStepValid(): boolean {
    switch (step) {
      case 1:
        return !!(
          data.fullName &&
          data.email &&
          data.location &&
          data.nationality
        );
      case 2:
        return !!data.transactionType;
      case 3:
        return !!data.budgetRange;
      case 4:
        return !!data.propertyType;
      case 5:
        return !!(data.targetDate && data.decisionSpeed);
      case 6:
        return true;
      case 7:
        return data.dataConsent;
      default:
        return true;
    }
  }

  function handleNext(e: React.FormEvent) {
    e.preventDefault();
    if (!isStepValid()) return;
    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setSubmitted(true);
    }
  }

  function handleBack() {
    if (step > 1) {
      setStep((s) => s - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-6 rounded-2xl border border-divider bg-navy-light px-8 py-20 text-center">
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
            Intake form received
          </h3>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-on-surface-muted">
            Thank you{data.preferredName ? `, ${data.preferredName}` : ""}. Your
            intake has been logged and an advisor will review it within one
            business day. Check your inbox at{" "}
            <strong className="text-on-surface">{data.email}</strong> for
            confirmation and next steps.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <a
            href="/area-guides"
            className="rounded-xl border border-divider bg-white px-5 py-2.5 text-sm font-medium text-on-surface hover:shadow-sm"
          >
            Explore area guides
          </a>
          <a
            href="/market-intelligence"
            className="rounded-xl border border-divider bg-white px-5 py-2.5 text-sm font-medium text-on-surface hover:shadow-sm"
          >
            Read market intelligence
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-divider bg-white p-6 sm:p-8">
      <ProgressBar step={step} />

      <div className="mb-6">
        <h2 className="font-display text-xl font-bold text-on-surface">
          {STEP_LABELS[step - 1]}
        </h2>
        <p className="mt-1 text-sm text-on-surface-muted">
          {STEP_DESCRIPTIONS[step]}
        </p>
      </div>

      <form onSubmit={handleNext} noValidate>
        {step === 1 && <Step1AboutYou data={data} set={set} />}
        {step === 2 && <Step2YourGoal data={data} set={set} />}
        {step === 3 && <Step3Budget data={data} set={set} />}
        {step === 4 && <Step4Property data={data} set={set} />}
        {step === 5 && <Step5Timeline data={data} set={set} />}
        {step === 6 && <Step6Background data={data} set={set} />}
        {step === 7 && <Step7Confirmation data={data} set={set} />}

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

          <Button
            type="submit"
            size="default"
            disabled={!isStepValid()}
            className="min-w-36"
          >
            {step === TOTAL_STEPS ? "Submit intake" : "Continue"}
            {step < TOTAL_STEPS && (
              <svg
                className="ml-1 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
