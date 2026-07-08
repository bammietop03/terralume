"use client";

import { useState } from "react";
import { ArrowRight, Building2, CheckCircle, Zap } from "lucide-react";
import { IntakeForm } from "@/components/get-started/IntakeForm";
import type { FormData } from "@/components/get-started/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type ServiceType = "real-estate" | "renewable-energy";

const SERVICE_OPTIONS: Record<
  ServiceType,
  {
    title: string;
    description: string;
    buttonLabel: string;
    icon: typeof Building2;
    highlights: string[];
  }
> = {
  "real-estate": {
    title: "Real Estate Advisory",
    description:
      "Property search, evaluation, and acquisition management for residential or commercial real estate in Nigeria.",
    buttonLabel: "Start Real Estate Form",
    icon: Building2,
    highlights: [
      "Four-Pillar Evaluation",
      "Curated property shortlist",
      "Site visits & acquisition support",
    ],
  },
  "renewable-energy": {
    title: "Renewable Energy Solutions",
    description:
      "Solar energy system design, procurement, and installation for residential and commercial properties.",
    buttonLabel: "Start Energy Form",
    icon: Zap,
    highlights: [
      "Energy needs assessment",
      "Product matching & proposals",
      "Installation & monitoring",
    ],
  },
};

function resolveServiceType(selectedServices?: string[]): ServiceType | null {
  if (selectedServices?.length !== 1) {
    return null;
  }

  const [service] = selectedServices;
  if (service === "real-estate" || service === "renewable-energy") {
    return service;
  }

  return null;
}

interface PortalIntakeFlowProps {
  initialData?: Partial<FormData>;
  initialStep?: number;
  draftId?: string;
  enableDraft?: boolean;
  readOnlyAbout?: boolean;
  submitAction?: (
    data: FormData,
  ) => Promise<{ success: boolean; referenceNumber?: string; error?: string }>;
  selectionTitle?: string;
  selectionDescription?: string;
}

export default function PortalIntakeFlow({
  initialData,
  initialStep,
  draftId,
  enableDraft = false,
  readOnlyAbout = false,
  submitAction,
  selectionTitle = "Which service do you need?",
  selectionDescription = "Select one service to get started. You can submit another brief later.",
}: PortalIntakeFlowProps) {
  const restoredServiceType = resolveServiceType(initialData?.selectedServices);
  const [selectedService, setSelectedService] = useState<ServiceType | null>(
    restoredServiceType,
  );

  if (!selectedService) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="mb-3 text-2xl font-bold text-navy">
            {selectionTitle}
          </h2>
          <p className="text-on-surface-muted">{selectionDescription}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {(
            Object.entries(SERVICE_OPTIONS) as Array<
              [ServiceType, (typeof SERVICE_OPTIONS)[ServiceType]]
            >
          ).map(([service, option]) => {
            const Icon = option.icon;

            return (
              <Card
                key={service}
                className="cursor-pointer transition-all hover:border-gold hover:shadow-xl"
                onClick={() => setSelectedService(service)}
              >
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy text-white">
                      <Icon size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="mb-2 text-xl font-bold text-navy">
                        {option.title}
                      </h3>
                      <p className="mb-4 text-sm text-on-surface-muted">
                        {option.description}
                      </p>
                      <ul className="mb-4 space-y-2 text-sm text-on-surface-muted">
                        {option.highlights.map((highlight) => (
                          <li key={highlight} className="flex items-start">
                            <CheckCircle
                              size={16}
                              className="mr-2 mt-0.5 shrink-0 text-gold"
                            />
                            {highlight}
                          </li>
                        ))}
                      </ul>
                      <Button className="w-full bg-navy text-white hover:bg-navy-dark">
                        {option.buttonLabel}
                        <ArrowRight size={16} className="ml-2" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  const nextInitialData: Partial<FormData> = {
    ...initialData,
    selectedServices: [selectedService],
  };
  const nextInitialStep =
    selectedService === restoredServiceType ? initialStep : 1;

  return (
    <div className="space-y-6">
      <Button
        type="button"
        variant="ghost"
        className="h-auto px-0 text-sm text-on-surface-muted hover:bg-transparent hover:text-on-surface"
        onClick={() => setSelectedService(null)}
      >
        ← Change service
      </Button>

      <div className="mx-auto max-w-3xl">
        <IntakeForm
          key={`${selectedService}-${draftId ?? "new"}`}
          serviceType={selectedService}
          initialData={nextInitialData}
          initialStep={nextInitialStep}
          draftId={draftId}
          enableDraft={enableDraft}
          readOnlyAbout={readOnlyAbout}
          submitAction={submitAction}
        />
      </div>
    </div>
  );
}
