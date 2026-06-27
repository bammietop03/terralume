import type { Metadata } from "next";
import Link from "next/link";
import {
  FileText,
  Shield,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  Lock,
  Scale,
  Mail,
  Phone,
  Building,
  Zap,
  User,
} from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import { FooterCTA } from "@/components/home/FooterCTA";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Terms of Service — Terralume",
  description:
    "Terms of Service for Terralume's Real Estate Acquisition & Intelligence and Renewable Energy as a Service (EaaS) platforms.",
  openGraph: {
    title: "Terms of Service — Terralume",
    description:
      "Legal terms governing the use of Terralume's services and platforms.",
    type: "website",
  },
};

export default function TermsOfServicePage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms of Service"
        description="Legal terms governing your use of Terralume's Real Estate Acquisition & Intelligence and Renewable Energy as a Service platforms."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Terms of Service" },
        ]}
      />

      <section className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Effective Date and Contact */}
        <div className="mb-12 space-y-2 text-sm text-muted-foreground">
          <p>
            <strong>Effective date:</strong> June 1, 2026
          </p>
          <div className="flex flex-wrap gap-4 items-center">
            <span className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <a
                href="mailto:info@terralume.org"
                className="text-primary hover:underline"
              >
                info@terralume.org
              </a>
            </span>
            <span className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <a
                href="tel:+2347046676828"
                className="text-primary hover:underline"
              >
                +234 704 667 6828
              </a>
            </span>
          </div>
        </div>

        {/* Section 1: Acceptance of Terms */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <CheckCircle className="h-6 w-6" />
            1. Acceptance of Terms
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            By accessing{" "}
            <Link href="/" className="text-primary hover:underline">
              terralume.com
            </Link>
            , submitting an intake form, or engaging Terralume Limited for Real
            Estate Acquisition & Intelligence and/or Renewable Energy as a
            Service (EaaS), you agree to these Terms of Service. If you do not
            agree, please do not use our services.
          </p>
        </section>

        <Separator className="my-12" />

        {/* Section 2: Our Services */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">2. Our Services</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Terralume provides two distinct, independently engageable services:
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Real Estate Acquisition & Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Evaluation and sourcing of property based on title, financial,
                economic, and exit-strategy analysis, using the information you
                provide to identify and acquire suitable property on your
                behalf.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Renewable Energy as a Service (EaaS)
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Consultation-led assessment and deployment of a renewable energy
                solution sized to your property and needs, available as a
                standalone service or bundled with a property acquisition.
              </CardContent>
            </Card>
          </div>
          <p className="text-muted-foreground leading-relaxed mt-4">
            Engaging one service does not obligate you to engage the other.
          </p>
        </section>

        <Separator className="my-12" />

        {/* Section 3: Nature of Our Advice */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <AlertTriangle className="h-6 w-6" />
            3. Nature of Our Advice
          </h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Terralume&apos;s evaluations and recommendations are based on the
              information you provide and the diligence we conduct at the time.
              They are intended to inform your decision-making, not to replace
              independent professional advice.
            </p>
            <p>
              You should obtain your own independent legal, financial, and tax
              advice before completing any property purchase or financing
              arrangement.
            </p>
            <p>
              Terralume does not guarantee investment outcomes, future property
              values, or energy savings, and our exit-strategy analysis reflects
              reasonable projections based on available data, not a guarantee of
              future market conditions.
            </p>
          </div>
        </section>

        <Separator className="my-12" />

        {/* Section 4: Your Responsibilities */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <User className="h-6 w-6" />
            4. Your Responsibilities
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            You agree to:
          </p>
          <ul className="list-disc list-inside space-y-3 text-muted-foreground ml-4">
            <li>
              Provide accurate, complete, and current information in any intake
              or assessment form, since this information directly drives the
              evaluation and acquisition process carried out on your behalf
            </li>
            <li>
              Keep your dashboard login credentials confidential and notify us
              promptly of any suspected unauthorised access
            </li>
            <li>
              Respond to requests for documentation or clarification in a timely
              manner where this is needed to progress your engagement
            </li>
          </ul>
        </section>

        <Separator className="my-12" />

        {/* Section 5: Property Acquisition Engagements */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Building className="h-6 w-6" />
            5. Property Acquisition Engagements
          </h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Terralume conducts title, financial, economic, and exit-strategy
              review on candidate properties before presenting them to you,
              using reasonable diligence and information reasonably available at
              the time. This diligence reduces but does not eliminate
              transaction risk.
            </p>
            <p>
              We do not guarantee the availability of any specific property,
              that a transaction will complete, or any particular timeline, as
              these depend on third parties outside our control.
            </p>
            <p>
              Fees will be disclosed and agreed with you before they are
              incurred.
            </p>
          </div>
        </section>

        <Separator className="my-12" />

        {/* Section 6: Energy Service Engagements */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Zap className="h-6 w-6" />
            6. Energy Service Engagements
          </h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Energy solutions are proposed based on the consumption profile,
              budget, and preferences you provide during the needs assessment.
              Actual performance may vary based on usage patterns, site
              conditions, and equipment factors outside Terralume&apos;s
              control.
            </p>
            <p>
              The applicable ownership model, pricing, and service-level
              commitments will be set out in a separate proposal or contract
              before deployment. Ongoing maintenance and monitoring commitments
              (where applicable) will be specified in your service agreement.
            </p>
          </div>
        </section>

        <Separator className="my-12" />

        {/* Section 7: Fees and Payment */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <DollarSign className="h-6 w-6" />
            7. Fees and Payment
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Terralume does not publish fixed pricing, as both divisions operate
            on a consultative, engagement-specific basis. Applicable fees will
            be disclosed and agreed with you in writing before any chargeable
            work begins.
          </p>
        </section>

        <Separator className="my-12" />

        {/* Section 8: Client Dashboard & Accounts */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Lock className="h-6 w-6" />
            8. Client Dashboard & Accounts
          </h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Access to the client dashboard is provided for the purpose of
              tracking your engagement, accessing documents, and communicating
              with your assigned Terralume team.
            </p>
            <p>
              You are responsible for all activity under your account
              credentials. Terralume may suspend dashboard access where misuse
              or unauthorised access is suspected.
            </p>
          </div>
        </section>

        <Separator className="my-12" />

        {/* Section 9: Confidentiality */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Shield className="h-6 w-6" />
            9. Confidentiality
          </h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              We treat the information you share with us — including title
              documents, financial details, and energy usage data — as
              confidential, used only for the purposes described in our{" "}
              <Link
                href="/privacy-policy"
                className="text-primary hover:underline"
              >
                Privacy Policy
              </Link>
              .
            </p>
            <p>
              You agree to keep confidential any non-public information
              Terralume shares with you in the course of an engagement, such as
              proprietary evaluation findings or proposal terms.
            </p>
          </div>
        </section>

        <Separator className="my-12" />

        {/* Section 10: Intellectual Property */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <FileText className="h-6 w-6" />
            10. Intellectual Property
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            All website content, including the evaluation framework, branding,
            and published insights, is the property of Terralume Limited and may
            not be reproduced without permission, except for your personal,
            non-commercial use in connection with your own engagement.
          </p>
        </section>

        <Separator className="my-12" />

        {/* Section 11: Limitation of Liability */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Scale className="h-6 w-6" />
            11. Limitation of Liability
          </h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              To the maximum extent permitted by law, Terralume&apos;s liability
              arising from any engagement is limited to the fees paid to
              Terralume for the specific service giving rise to the claim.
            </p>
            <p>
              Terralume is not liable for indirect, consequential, or
              speculative losses, including changes in property market value or
              energy cost savings that do not materialise as projected.
            </p>
          </div>
        </section>

        <Separator className="my-12" />

        {/* Section 12: Termination */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">12. Termination</h2>
          <p className="text-muted-foreground leading-relaxed">
            Either party may terminate an engagement in line with the terms of
            the specific service agreement signed for that engagement.
            Termination does not affect fees already earned for work performed,
            or confidentiality obligations, which survive termination.
          </p>
        </section>

        <Separator className="my-12" />

        {/* Section 13: Governing Law & Dispute Resolution */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Scale className="h-6 w-6" />
            13. Governing Law & Dispute Resolution
          </h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              These Terms are governed by the laws of the Federal Republic of
              Nigeria.
            </p>
            <p>
              Any dispute arising from these Terms or an engagement with
              Terralume shall first be addressed through good-faith negotiation,
              and if unresolved, referred to arbitration seated in Lagos,
              Nigeria.
            </p>
          </div>
        </section>

        <Separator className="my-12" />

        {/* Section 14: Changes to These Terms */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">
            14. Changes to These Terms
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            We may update these Terms from time to time. Continued use of our
            services after an update constitutes acceptance of the revised
            Terms.
          </p>
        </section>

        <Separator className="my-12" />

        {/* Section 15: Contact */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">15. Contact</h2>
          <div className="space-y-2">
            <p className="text-muted-foreground">
              <strong>Terralume Limited</strong>
            </p>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <a
                  href="mailto:info@terralume.org"
                  className="text-primary hover:underline"
                >
                  info@terralume.org
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <a
                  href="tel:+2347046676828"
                  className="text-primary hover:underline"
                >
                  +234 704 667 6828
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Legal Notice */}
        <div className="mt-12 p-6 bg-muted/50 rounded-lg border">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong>Working draft:</strong> These Terms of Service should be
            reviewed by Nigerian legal counsel before publication, with
            particular attention to limitation of liability clauses,
            dispute-resolution procedures, and alignment with LASRERA
            regulations.
          </p>
        </div>
      </section>

      <FooterCTA />
    </>
  );
}
