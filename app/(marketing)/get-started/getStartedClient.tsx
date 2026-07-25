"use client";

import type { Metadata } from "next";
import { useState } from "react";
import { IntakeForm } from "@/components/get-started/IntakeForm";
import { submitPublicIntakeForm } from "@/app/actions/intake";
import { CheckCircle, Shield, Zap, Building2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PageHero from "@/components/layout/PageHero";

// export const metadata: Metadata = {
//   title: "Get Started — Terralume",
//   description:
//     "Choose your service and complete a quick intake form. We'll review your information and get back to you within 24 hours.",
// };

export default function GetStartedClient({service}: {service?: "real-estate" | "renewable-energy"}) {
  const [selectedService, setSelectedService] = useState<
    "real-estate" | "renewable-energy" | null
  >(service ?? null);

  // If no service selected yet, show service selection
  if (!selectedService) {
    return (
      <main>
        <PageHero
          eyebrow="Get Started"
          title="Begin Your Journey with Terralume"
          description="Choose the service you need, and we'll guide you through the right questions."
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Get Started" }]}
        />

        <section className="mx-auto max-w-4xl px-6 py-12">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-navy mb-3">
              Which service do you need?
            </h2>
            <p className="text-on-surface-muted">
              Select one service to get started. You can add more later.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Real Estate Service */}
            <Card
              className="cursor-pointer transition-all hover:shadow-xl hover:border-gold"
              onClick={() => setSelectedService("real-estate")}
            >
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy text-white">
                    <Building2 size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-navy mb-2">
                      Intelligent Real Estate Advisory
                    </h3>
                    <p className="text-sm text-on-surface-muted mb-4">
                      Property search, evaluation, and acquisition management
                      for residential or commercial real estate in Nigeria.
                    </p>
                    <ul className="space-y-2 text-sm text-on-surface-muted mb-4">
                      <li className="flex items-start">
                        <CheckCircle
                          size={16}
                          className="text-gold mr-2 mt-0.5 shrink-0"
                        />
                        Four-Pillar Evaluation
                      </li>
                      <li className="flex items-start">
                        <CheckCircle
                          size={16}
                          className="text-gold mr-2 mt-0.5 shrink-0"
                        />
                        Curated property shortlist
                      </li>
                      <li className="flex items-start">
                        <CheckCircle
                          size={16}
                          className="text-gold mr-2 mt-0.5 shrink-0"
                        />
                        Site visits & acquisition support
                      </li>
                    </ul>
                    <Button className="w-full bg-navy hover:bg-navy-dark text-white">
                      Start Real Estate Form
                      <ArrowRight size={16} className="ml-2" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Energy Service */}
            <Card
              className="cursor-pointer transition-all hover:shadow-xl hover:border-gold"
              onClick={() => setSelectedService("renewable-energy")}
            >
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy text-white">
                    <Zap size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-navy mb-2">
                      Renewable Energy Solutions
                    </h3>
                    <p className="text-sm text-on-surface-muted mb-4">
                      Solar energy system design, procurement, and installation
                      for residential and commercial properties.
                    </p>
                    <ul className="space-y-2 text-sm text-on-surface-muted mb-4">
                      <li className="flex items-start">
                        <CheckCircle
                          size={16}
                          className="text-gold mr-2 mt-0.5 shrink-0"
                        />
                        Energy needs assessment
                      </li>
                      <li className="flex items-start">
                        <CheckCircle
                          size={16}
                          className="text-gold mr-2 mt-0.5 shrink-0"
                        />
                        Product matching & proposals
                      </li>
                      <li className="flex items-start">
                        <CheckCircle
                          size={16}
                          className="text-gold mr-2 mt-0.5 shrink-0"
                        />
                        Installation & monitoring
                      </li>
                    </ul>
                    <Button className="w-full bg-navy hover:bg-navy-dark text-white">
                      Start Energy Form
                      <ArrowRight size={16} className="ml-2" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center gap-2">
              <CheckCircle className="text-emerald-600" size={24} />
              <p className="text-sm font-semibold text-on-surface">
                No commitment required
              </p>
              <p className="text-xs text-on-surface-muted">
                Free initial consultation
              </p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Shield className="text-emerald-600" size={24} />
              <p className="text-sm font-semibold text-on-surface">
                Your data is protected
              </p>
              <p className="text-xs text-on-surface-muted">
                Bank-level encryption
              </p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Zap className="text-emerald-600" size={24} />
              <p className="text-sm font-semibold text-on-surface">
                Quick response time
              </p>
              <p className="text-xs text-on-surface-muted">24-hour review</p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // Show the appropriate form based on selected service
  return (
    <main>
      <PageHero
        eyebrow="Get Started"
        title={
          selectedService === "real-estate"
            ? "Real Estate Intake Form"
            : "Energy Solutions Intake Form"
        }
        description={
          selectedService === "real-estate"
            ? "Tell us about your real estate goals and we'll help you find the right property."
            : "Describe your energy needs and we'll match you with the right solution."
        }
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Get Started", href: "/get-started" },
          {
            label:
              selectedService === "real-estate"
                ? "Real Estate"
                : "Energy Solutions",
          },
        ]}
      />

      <section className="mx-auto max-w-3xl px-6 py-12">
        <button
          onClick={() => setSelectedService(null)}
          className="inline-flex items-center gap-1.5 text-sm text-on-surface-muted hover:text-on-surface transition-colors mb-8"
        >
          ← Change service
        </button>

        <IntakeForm
          serviceType={selectedService}
          submitAction={submitPublicIntakeForm}
          isPublicSubmission={true}
        />
      </section>
    </main>
  );
}
