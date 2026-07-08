"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Building2, Zap, Check } from "lucide-react";
import type { FormData } from "./types";

interface Props {
  data: FormData;
  updateForm: (partial: Partial<FormData>) => void;
}

export default function Step1Service({ data, updateForm }: Props) {
  const toggleService = (service: string) => {
    const current = data.selectedServices || [];
    const updated = current.includes(service)
      ? current.filter((s) => s !== service)
      : [...current, service];
    updateForm({ selectedServices: updated });
  };

  const handleCardClick = (service: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleService(service);
  };

  const isRealEstateSelected = data.selectedServices?.includes("real-estate");
  const isEnergySelected = data.selectedServices?.includes("renewable-energy");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy mb-2">
          What service(s) do you need?
        </h2>
        <p className="text-gray-600">
          Select one or both services depending on your needs. We offer
          integrated solutions if you need both.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Real Estate Service */}
        <Card
          className={`cursor-pointer transition-all ${
            isRealEstateSelected
              ? "border-gold border-2 shadow-lg"
              : "border-gray-200 hover:border-gray-300"
          }`}
          onClick={(e) => handleCardClick("real-estate", e)}
        >
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div
                className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${
                  isRealEstateSelected
                    ? "border-gold bg-gold text-white"
                    : "border-gray-300 bg-white"
                }`}
              >
                {isRealEstateSelected && <Check className="h-3 w-3" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="w-5 h-5 text-navy" />
                  <Label
                    htmlFor="service-real-estate"
                    className="text-lg font-semibold text-navy cursor-pointer"
                  >
                    Real Estate Advisory
                  </Label>
                </div>
                <p className="text-sm text-gray-600">
                  Property search, evaluation, and acquisition management for
                  residential or commercial real estate in Nigeria.
                </p>
                <ul className="mt-3 space-y-1 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-gold mr-2">•</span>
                    Four-Pillar Evaluation (Authenticity, Legal, Value, Market)
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold mr-2">•</span>
                    Curated property shortlist
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold mr-2">•</span>
                    Site visits and acquisition support
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Renewable Energy Service */}
        <Card
          className={`cursor-pointer transition-all ${
            isEnergySelected
              ? "border-gold border-2 shadow-lg"
              : "border-gray-200 hover:border-gray-300"
          }`}
          onClick={(e) => handleCardClick("renewable-energy", e)}
        >
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div
                className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${
                  isEnergySelected
                    ? "border-gold bg-gold text-white"
                    : "border-gray-300 bg-white"
                }`}
              >
                {isEnergySelected && <Check className="h-3 w-3" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-navy" />
                  <Label
                    htmlFor="service-energy"
                    className="text-lg font-semibold text-navy cursor-pointer"
                  >
                    Renewable Energy Solutions
                  </Label>
                </div>
                <p className="text-sm text-gray-600">
                  Solar energy system design, procurement, and installation for
                  residential and commercial properties.
                </p>
                <ul className="mt-3 space-y-1 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-gold mr-2">•</span>
                    Energy needs assessment
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold mr-2">•</span>
                    Product matching and costed proposals
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold mr-2">•</span>
                    Installation and system monitoring
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {data.selectedServices && data.selectedServices.length > 1 && (
        <Card className="border-gold/30 bg-gold/5">
          <CardContent className="p-4">
            <p className="text-sm text-navy">
              <strong>Integrated Solution:</strong> You've selected both
              services. We'll coordinate a comprehensive solution that addresses
              your real estate and energy needs together.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
