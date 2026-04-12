import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, ShieldCheck, Layers } from "lucide-react";
import { ProcessStages } from "@/components/how-it-works/ProcessStages";
import { FaqAccordion } from "@/components/how-it-works/FaqAccordion";
import { FooterCTA } from "@/components/home/FooterCTA";
import PageHero from "@/components/layout/PageHero";

export const metadata: Metadata = {
  title: "How It Works — Terralume Buyer Advisory Process",
  description:
    "A detailed walkthrough of all 8 stages of the Terralume advisory process — from initial enquiry to key handover.",
};

const stats = [
  {
    icon: <Layers size={22} />,
    value: "8",
    label: "Advisory Stages",
  },
  {
    icon: <ShieldCheck size={22} />,
    value: "4",
    label: "Quality Gates",
  },
  {
    icon: <Clock size={22} />,
    value: "8–14",
    label: "Weeks Typical",
  },
];

export default function HowItWorksPage() {
  return (
    <main className="flex flex-col flex-1">
      <PageHero
        eyebrow="The Terralume Process"
        title={
          <>
            How we protect <em className="italic text-crimson">every buyer.</em>
          </>
        }
        description="A structured, eight-stage advisory process with four built-in quality gates — designed so that nothing is left to chance on your property transaction."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "How It Works" }]}
        minHeight="52vh"
      />

      {/* ── Stats bar ──────────────────────────────────────────── */}
      <section className="border-b border-divider bg-surface">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 sm:divide-x sm:divide-divider">
            {stats.map((s) => (
              <div
                key={s.label}
                className="flex items-center justify-center gap-4 border-b border-divider py-8 last:border-b-0 sm:border-b-0 sm:py-10"
              >
                <span className="text-navy">{s.icon}</span>
                <div>
                  <span className="block font-display text-4xl font-bold leading-none text-navy">
                    {s.value}
                  </span>
                  <span className="mt-1 block text-[12px] uppercase tracking-wider text-on-surface-muted">
                    {s.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Legend ─────────────────────────────────────────────── */}
      <section className="bg-surface pt-10">
        <div className="mx-auto max-w-5xl px-6 lg:px-12">
          <div className="flex flex-wrap items-center gap-6 rounded-2xl border border-divider bg-surface-alt px-7 py-5">
            <span className="text-[12px] font-bold uppercase tracking-widest text-on-surface-muted">
              Legend
            </span>
            <div className="flex flex-wrap gap-3">
              {[
                {
                  label: "Terralume Team",
                  cls: "bg-crimson/8 text-crimson border border-crimson/20",
                },
                {
                  label: "Project Manager",
                  cls: "bg-navy/8 text-navy border border-navy/15",
                },
                {
                  label: "Client",
                  cls: "bg-surface text-on-surface-muted border border-divider",
                },
              ].map((item) => (
                <span
                  key={item.label}
                  className={`rounded-full px-3 py-1 text-[11px] font-semibold ${item.cls}`}
                >
                  {item.label}
                </span>
              ))}
              <span className="ml-2 flex items-center gap-2 rounded-full bg-navy-dark px-3.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                <span className="h-2 w-2 rounded-full bg-crimson" />
                Quality Gate
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8 Stages + 4 Gates ─────────────────────────────────── */}
      <ProcessStages />

      {/* ── FAQ ────────────────────────────────────────────────── */}
      <FaqAccordion />

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <FooterCTA />
    </main>
  );
}
