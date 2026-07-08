"use client";

import { useState, useCallback } from "react";
import { ProgressBar } from "./ProgressBar";
import Step1Service from "./Step1Service";
import { Step2Goal } from "./Step2Goal";
import { Step3AboutYou } from "./Step3AboutYou";
import { Step4Property } from "./Step4Property";
import { Step5Budget } from "./Step5Budget";
import { Step6Timeline } from "./Step6Timeline";
import { Step7Review } from "./Step7Review";
import { StepEnergyNeeds } from "./StepEnergyNeeds";
import {
  INITIAL_FORM_DATA,
  TOTAL_STEPS,
  STEP_LABELS,
  STEP_DESCRIPTIONS,
  type FormData,
} from "./types";
import { submitIntakeForm, saveIntakeDraft } from "@/app/actions/intake";

type Errors = Partial<Record<keyof FormData, string>>;

function validateStep(
  step: number,
  data: FormData,
  serviceType?: "real-estate" | "renewable-energy",
): Errors {
  const errs: Errors = {};
  const isRealEstateSelected = data.selectedServices?.includes("real-estate");
  const isEnergySelected = data.selectedServices?.includes("renewable-energy");

  // For service-specific flows, map step to validation
  if (serviceType === "real-estate") {
    if (step === 1) {
      // Goal/Transaction Type
      if (!data.transactionType) {
        errs.transactionType = "Please select what you are looking to do.";
      }
    } else if (step === 2) {
      // About You
      if (!data.fullName.trim()) errs.fullName = "Full name is required.";
      if (!data.email.includes("@"))
        errs.email = "Please enter a valid email address.";
      if (!data.phone.trim()) errs.phone = "Phone number is required.";
      if (!data.location)
        errs.location = "Please select your current location.";
    } else if (step === 3) {
      // Property Details
      if (data.targetAreas.length === 0)
        (errs as Record<string, string>).targetAreas =
          "Please select at least one area.";
      if (!data.propertyType)
        errs.propertyType = "Please select a property type.";
    } else if (step === 4) {
      // Budget
      if (!data.budgetMin.trim())
        errs.budgetMin = "Minimum budget is required.";
      if (!data.sourceOfFunds)
        errs.sourceOfFunds = "Please select source of funds.";
    }
    // Steps 5 (Timeline) and 6 (Review) - no additional validation
    return errs;
  }

  if (serviceType === "renewable-energy") {
    if (step === 1) {
      // Energy Needs
      if (!data.energyNeedsDescription?.trim()) {
        (errs as Record<string, string>).energyNeedsDescription =
          "Please describe your energy needs.";
      }
    } else if (step === 2) {
      // About You
      if (!data.fullName.trim()) errs.fullName = "Full name is required.";
      if (!data.email.includes("@"))
        errs.email = "Please enter a valid email address.";
      if (!data.phone.trim()) errs.phone = "Phone number is required.";
      if (!data.location)
        errs.location = "Please select your current location.";
    } else if (step === 3) {
      // Budget
      if (!data.budgetMin.trim())
        errs.budgetMin = "Minimum budget is required.";
      if (!data.sourceOfFunds)
        errs.sourceOfFunds = "Please select source of funds.";
    }
    // Steps 4 (Timeline) and 5 (Review) - no additional validation
    return errs;
  }

  // Original validation for mixed/portal flow
  if (step === 1) {
    // Service selection
    if (!data.selectedServices || data.selectedServices.length === 0) {
      (errs as Record<string, string>).selectedServices =
        "Please select at least one service.";
    }
  }
  if (step === 2) {
    // Goal (Real Estate only)
    if (isRealEstateSelected && !data.transactionType) {
      errs.transactionType = "Please select what you are looking to do.";
    }
  }
  if (step === 3) {
    // About You
    if (!data.fullName.trim()) errs.fullName = "Full name is required.";
    if (!data.email.includes("@"))
      errs.email = "Please enter a valid email address.";
    if (!data.phone.trim()) errs.phone = "Phone number is required.";
    if (!data.location) errs.location = "Please select your current location.";
  }
  if (step === 4) {
    // Property (Real Estate only)
    if (isRealEstateSelected) {
      if (data.targetAreas.length === 0)
        (errs as Record<string, string>).targetAreas =
          "Please select at least one area.";
      if (!data.propertyType)
        errs.propertyType = "Please select a property type.";
    }
  }
  if (step === 5) {
    // Budget (conditional)
    if (!data.budgetMin.trim()) errs.budgetMin = "Minimum budget is required.";
    if (!data.sourceOfFunds)
      errs.sourceOfFunds = "Please select source of funds.";
  }
  // Step 6 (Timeline) - no specific validation beyond general form
  // Step 7 (Review) - consent validation happens in handleNext
  return errs;
}

interface IntakeFormProps {
  /** Populate form from an existing draft (client portal path) */
  initialData?: Partial<FormData>;
  /** Resume from a specific step (1-indexed) */
  initialStep?: number;
  /** Existing draft IntakeSubmission.id to update instead of creating a new one */
  draftId?: string;
  /** Whether to save-and-continue drafts on each step (requires auth, client portal only) */
  enableDraft?: boolean;
  /** When true, Step 2 shows user info as read-only (client portal) */
  readOnlyAbout?: boolean;
  /** When true, shows public success message (no portal link) */
  isPublicSubmission?: boolean;
  /** Pre-selected service type for simplified flow (real-estate or renewable-energy) */
  serviceType?: "real-estate" | "renewable-energy";
  /** Custom submit action — defaults to submitIntakeForm (client self-service) */
  submitAction?: (
    data: FormData,
  ) => Promise<{ success: boolean; referenceNumber?: string; error?: string }>;
}

export function IntakeForm({
  initialData,
  initialStep,
  draftId: initialDraftId,
  enableDraft = false,
  readOnlyAbout = false,
  isPublicSubmission = false,
  serviceType,
  submitAction = submitIntakeForm,
}: IntakeFormProps = {}) {
  const [step, setStep] = useState(initialStep ?? 1);
  const [data, setData] = useState<FormData>({
    ...INITIAL_FORM_DATA,
    selectedServices: serviceType ? [serviceType] : [],
    ...initialData,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [draftId, setDraftId] = useState<string | undefined>(initialDraftId);

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

  // Define step flow based on service type
  const isRealEstateFlow = serviceType === "real-estate";
  const isEnergyFlow = serviceType === "renewable-energy";
  const isMixedFlow = !serviceType; // Old behavior for portal users

  // Calculate total steps based on service type
  const totalSteps = isRealEstateFlow ? 6 : isEnergyFlow ? 5 : TOTAL_STEPS;

  // Map actual step number to component step
  const getStepComponent = (currentStep: number) => {
    if (isMixedFlow) {
      // Original flow: Service → Goal → About → Property → Budget → Timeline → Review
      return currentStep;
    }

    if (isRealEstateFlow) {
      // Real Estate flow: Goal → About → Property → Budget → Timeline → Review
      // Step 1 → Goal (original step 2)
      // Step 2 → About (original step 3)
      // Step 3 → Property (original step 4)
      // Step 4 → Budget (original step 5)
      // Step 5 → Timeline (original step 6)
      // Step 6 → Review (original step 7)
      return currentStep + 1;
    }

    if (isEnergyFlow) {
      // Energy flow: Energy Needs → About → Budget → Timeline → Review
      // Step 1 → Energy Needs (custom)
      // Step 2 → About (original step 3)
      // Step 3 → Budget (original step 5)
      // Step 4 → Timeline (original step 6)
      // Step 5 → Review (original step 7)
      const energyStepMap: Record<number, number> = {
        1: -1, // Custom energy step
        2: 3, // About
        3: 5, // Budget
        4: 6, // Timeline
        5: 7, // Review
      };
      return energyStepMap[currentStep] ?? currentStep;
    }

    return currentStep;
  };

  async function handleNext(e: React.FormEvent) {
    e.preventDefault();
    const errs = validateStep(step, data, serviceType);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});

    if (step < totalSteps) {
      // Auto-save draft for logged-in portal users
      if (enableDraft) {
        saveIntakeDraft(data, step, draftId)
          .then((result) => {
            if (result.draftId) setDraftId(result.draftId);
          })
          .catch(() => {
            /* non-blocking */
          });
      }
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
      const result = await submitAction(data);
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
            {!isPublicSubmission ? (
              <>
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
              </>
            ) : (
              <>
                <a
                  href="/"
                  className="rounded-xl bg-navy px-5 py-2.5 text-sm font-medium text-white hover:bg-navy-dark transition-colors"
                >
                  Back to home
                </a>
                <a
                  href="/market-intelligence"
                  className="rounded-xl border border-divider bg-white px-5 py-2.5 text-sm font-medium text-on-surface hover:shadow-sm"
                >
                  Read market intelligence
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  const isLastStep = step === totalSteps;

  // Get step labels based on service type
  const getStepLabel = () => {
    if (isRealEstateFlow) {
      const realEstateLabels = [
        "What are you looking for?",
        "About You",
        "Property Details",
        "Budget & Financing",
        "Timeline",
        "Review & Submit",
      ];
      return realEstateLabels[step - 1] || "";
    }

    if (isEnergyFlow) {
      const energyLabels = [
        "Energy Needs",
        "About You",
        "Budget",
        "Timeline",
        "Review & Submit",
      ];
      return energyLabels[step - 1] || "";
    }

    return STEP_LABELS[step - 1] || "";
  };

  const getStepDescription = () => {
    if (isRealEstateFlow) {
      const realEstateDescs: Record<number, string> = {
        1: "Tell us about your real estate goals",
        2: "Help us get to know you better",
        3: "What kind of property are you looking for?",
        4: "Let's understand your financial situation",
        5: "When do you need to move?",
        6: "Review your information before submitting",
      };
      return realEstateDescs[step] || "";
    }

    if (isEnergyFlow) {
      const energyDescs: Record<number, string> = {
        1: "Describe your energy requirements",
        2: "Help us get to know you better",
        3: "Let's understand your budget",
        4: "When do you need the solution?",
        5: "Review your information before submitting",
      };
      return energyDescs[step] || "";
    }

    return STEP_DESCRIPTIONS[step] || "";
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-divider bg-white">
      {/* Brand bar — matches HTML header */}
      <div className="flex items-center justify-between bg-[#111D4E] px-6 py-4">
        <div>
          <p className="text-sm font-medium tracking-wide text-white">
            TERRALUME LTD
          </p>
          <p className="mt-0.5 text-[11px] text-[#A8B4D8]">
            {isEnergyFlow
              ? "Renewable Energy Solutions"
              : "Buyer-Side Real Estate Advisory"}{" "}
            · Lagos, Nigeria
          </p>
        </div>
        <div className="text-right text-[11px] leading-relaxed text-[#A8B4D8]">
          Secure intake form
          <br />
          All data confidential
        </div>
      </div>
      {/* gold rule */}
      <div className="h-[3px] bg-[#9B1C2E]" />

      <div className="p-6 sm:p-8">
        <ProgressBar step={step} totalSteps={totalSteps} />

        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-gold mb-1">
            Step {step} of {totalSteps}
          </p>
          <h2 className="font-display text-xl font-bold text-on-surface">
            {getStepLabel()}
          </h2>
          <p className="mt-1 text-sm text-on-surface-muted">
            {getStepDescription()}
          </p>
        </div>

        <form onSubmit={handleNext} noValidate>
          {/* Real Estate Flow */}
          {isRealEstateFlow && (
            <>
              {step === 1 && <Step2Goal data={data} set={set} />}
              {step === 2 && (
                <Step3AboutYou
                  data={data}
                  set={set}
                  errors={errors}
                  readOnly={readOnlyAbout}
                />
              )}
              {step === 3 && (
                <Step4Property data={data} set={set} errors={errors} />
              )}
              {step === 4 && (
                <Step5Budget data={data} set={set} errors={errors} />
              )}
              {step === 5 && <Step6Timeline data={data} set={set} />}
              {step === 6 && <Step7Review data={data} set={set} />}
            </>
          )}

          {/* Energy Flow */}
          {isEnergyFlow && (
            <>
              {step === 1 && (
                <StepEnergyNeeds data={data} set={set} errors={errors} />
              )}
              {step === 2 && (
                <Step3AboutYou
                  data={data}
                  set={set}
                  errors={errors}
                  readOnly={readOnlyAbout}
                />
              )}
              {step === 3 && (
                <Step5Budget data={data} set={set} errors={errors} />
              )}
              {step === 4 && <Step6Timeline data={data} set={set} />}
              {step === 5 && <Step7Review data={data} set={set} />}
            </>
          )}

          {/* Mixed/Original Flow (for portal users) */}
          {isMixedFlow && (
            <>
              {step === 1 && <Step1Service data={data} updateForm={set} />}
              {step === 2 && <Step2Goal data={data} set={set} />}
              {step === 3 && (
                <Step3AboutYou
                  data={data}
                  set={set}
                  errors={errors}
                  readOnly={readOnlyAbout}
                />
              )}
              {step === 4 && (
                <Step4Property data={data} set={set} errors={errors} />
              )}
              {step === 5 && (
                <Step5Budget data={data} set={set} errors={errors} />
              )}
              {step === 6 && <Step6Timeline data={data} set={set} />}
              {step === 7 && <Step7Review data={data} set={set} />}
            </>
          )}

          {/* Validation errors */}
          {step === 1 &&
            (errors as Record<string, string>).selectedServices && (
              <p className="mt-3 text-xs text-red-600">
                {(errors as Record<string, string>).selectedServices}
              </p>
            )}
          {step === 1 && errors.transactionType && (
            <p className="mt-3 text-xs text-red-600">
              {errors.transactionType}
            </p>
          )}
          {step === 1 &&
            (errors as Record<string, string>).energyNeedsDescription && (
              <p className="mt-3 text-xs text-red-600">
                {(errors as Record<string, string>).energyNeedsDescription}
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
