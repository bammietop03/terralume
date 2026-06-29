import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  FileText,
  Users,
  Globe,
  Clock,
  Scale,
  Mail,
  Phone,
} from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import { FooterCTA } from "@/components/home/FooterCTA";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Privacy Policy — Terralume",
  description:
    "Terralume's privacy policy: how we collect, use, and protect your personal data under the Nigeria Data Protection Act 2023 (NDPA).",
  openGraph: {
    title: "Privacy Policy — Terralume",
    description:
      "Learn about Terralume's data practices and your rights under the NDPA 2023.",
    type: "website",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        description="How Terralume collects, uses, and protects your personal data under the Nigeria Data Protection Act 2023."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Privacy Policy" },
        ]}
      />

      <section className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Effective Date and Contact */}
        <div className="mb-12 space-y-2 text-sm text-muted-foreground">
          <p>
            <strong>Effective date:</strong> June 1, 2026
          </p>
          <p>
            <strong>Data Controller:</strong> Terralume Limited, Lagos, Nigeria
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

        {/* Introduction */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
          <p className="text-muted-foreground leading-relaxed">
            Terralume Limited ("Terralume," "we," "us," "our") operates a
            platform across two divisions — Real Estate Acquisition &
            Intelligence and Renewable Energy Acquisition Service (EaaS) — and
            this policy explains what personal data we collect through{" "}
            <Link href="/" className="text-primary hover:underline">
              terralume.com
            </Link>{" "}
            and the client dashboard, why we collect it, and what rights you
            have under the Nigeria Data Protection Act 2023 (NDPA) and the
            regulations of the Nigeria Data Protection Commission (NDPC).
          </p>
          <p className="text-muted-foreground leading-relaxed mt-4">
            By submitting a property intake, an energy needs assessment, or
            otherwise providing personal data through our website, you
            acknowledge that you have read and understood this policy.
          </p>
        </section>

        <Separator className="my-12" />

        {/* What We Collect */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">2. What We Collect</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">
                    Category
                  </th>
                  <th className="text-left py-3 px-4 font-semibold">
                    Examples
                  </th>
                  <th className="text-left py-3 px-4 font-semibold">
                    Collected when
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="py-3 px-4 font-medium">
                    Identity & contact data
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
                    Full name, phone, email
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
                    Any intake form, contact form, account creation
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">
                    Property-related data
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
                    Target location, budget, ownership purpose, timeline,
                    financing status, title documents
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
                    Real estate intake; document vault uploads
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Financial data</td>
                  <td className="py-3 px-4 text-muted-foreground">
                    Budget range, financing/mortgage status, payment info where
                    applicable
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
                    Real estate and EaaS intake; invoicing
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Energy usage data</td>
                  <td className="py-3 px-4 text-muted-foreground">
                    Property type, grid reliability, consumption pattern,
                    ownership/financing preference
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
                    Energy needs assessment
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">
                    Account & dashboard data
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
                    Login credentials, communication history, document access
                    logs
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
                    Dashboard registration and use
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">
                    Technical & usage data
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
                    IP address, browser/device type, pages visited, cookies
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
                    Automatically, via website use
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <Separator className="my-12" />

        {/* Why We Collect It */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">
            3. Why We Collect It (Purpose & Lawful Basis)
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Purpose</th>
                  <th className="text-left py-3 px-4 font-semibold">
                    Lawful Basis under NDPA
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="py-3 px-4 text-muted-foreground">
                    To evaluate and source suitable property against our
                    four-pillar framework
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
                    Consent / performance of a contract you have requested
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-muted-foreground">
                    To size and propose a renewable energy solution matched to
                    your needs
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
                    Consent / performance of a contract you have requested
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-muted-foreground">
                    To manage your client file and assign you to the relevant
                    Terralume team
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
                    Performance of a contract
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-muted-foreground">
                    To verify title and conduct financial/economic due diligence
                    on your behalf
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
                    Consent, and where applicable, legal obligation
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-muted-foreground">
                    To communicate about your intake, proposal, or active
                    engagement
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
                    Performance of a contract / legitimate interest
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-muted-foreground">
                    To meet regulatory, tax, and record-keeping obligations
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
                    Legal obligation
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-muted-foreground">
                    To improve the website and understand how it is used
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
                    Legitimate interest, subject to your cookie preferences
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-muted-foreground leading-relaxed mt-6 italic">
            In plain terms: the information you give us is the information we
            use to actually find, evaluate, or build the property and energy
            solution you asked for. We do not sell, rent, or use your data for
            unrelated purposes.
          </p>
        </section>

        <Separator className="my-12" />

        {/* Who We Share Data With */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">4. Who We Share Data With</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            We share personal data only where necessary to deliver our services,
            with parties bound by confidentiality and data-protection
            obligations. Recipients include:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li>Title and legal verification partners</li>
            <li>
              Financial institutions where you have engaged us in connection
              with financing
            </li>
            <li>
              Technology and EPC partners (limited to technical specifications
              needed for deployment)
            </li>
            <li>
              Regulatory bodies where disclosure is required by law (e.g. NERC,
              FIRS, NDPC)
            </li>
            <li>
              Professional advisers (lawyers, auditors) where needed for a
              transaction or legal obligation
            </li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-4 font-medium">
            We do not share your data with third parties for their own marketing
            purposes.
          </p>
        </section>

        <Separator className="my-12" />

        {/* Cross-Border Transfers */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Globe className="h-6 w-6" />
            5. Cross-Border Transfers
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Where a diaspora client or engagement involves a party outside
            Nigeria, any transfer of personal data outside Nigeria will only
            take place in line with NDPA requirements — where the receiving
            country or organisation provides adequate data protection, or under
            appropriate safeguards and your informed consent.
          </p>
        </section>

        <Separator className="my-12" />

        {/* Data Retention */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Clock className="h-6 w-6" />
            6. Data Retention
          </h2>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li>
              Active client files are retained for the duration of the
              engagement and a reasonable period afterward.
            </li>
            <li>
              Closed or inactive intake forms with no follow-through are
              retained for a limited period (e.g. 12–24 months) then securely
              deleted.
            </li>
            <li>
              Financial and tax-relevant records are retained as required under
              Nigerian tax and company law.
            </li>
          </ul>
          <p className="text-sm text-muted-foreground mt-4 italic">
            Exact periods should be confirmed by Terralume&apos;s legal/finance
            team before publishing.
          </p>
        </section>

        <Separator className="my-12" />

        {/* Your Rights */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Scale className="h-6 w-6" />
            7. Your Rights Under the NDPA
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Be informed</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                About how your data is collected and used (this policy).
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Access</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                The personal data we hold about you.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Correct</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Inaccurate or incomplete data.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Request erasure</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Of your data, subject to our legal retention obligations.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Restrict or object</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                To certain processing.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Data portability</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Receive your data in a structured, commonly used format.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Withdraw consent</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                At any time, without affecting prior lawful processing.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Lodge a complaint</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                With the Nigeria Data Protection Commission (NDPC).
              </CardContent>
            </Card>
          </div>
          <p className="text-muted-foreground leading-relaxed mt-6">
            To exercise any of these rights, contact us at{" "}
            <a
              href="mailto:info@terralume.org"
              className="text-primary hover:underline"
            >
              info@terralume.org
            </a>
            . We will respond within the timeframe required by the NDPA.
          </p>
        </section>

        <Separator className="my-12" />

        {/* Data Security */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Lock className="h-6 w-6" />
            8. Data Security
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            We apply technical and organisational measures including:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li>
              Encrypted storage for sensitive documents (e.g. title documents in
              the document vault)
            </li>
            <li>
              Role-based access limited to the Terralume staff handling your
              file
            </li>
            <li>Access logging</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-4">
            No system is completely secure; we encourage you to safeguard your
            own dashboard login credentials.
          </p>
        </section>

        <Separator className="my-12" />

        {/* Cookies */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">9. Cookies</h2>
          <p className="text-muted-foreground leading-relaxed">
            Our website uses cookies for core functionality and to understand
            site usage. You can control non-essential cookies through your
            browser settings or any cookie-preference tool provided on the site.
          </p>
        </section>

        <Separator className="my-12" />

        {/* Children's Privacy */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">10. Children's Privacy</h2>
          <p className="text-muted-foreground leading-relaxed">
            Our services are intended for adults entering into property and
            energy transactions. We do not knowingly collect personal data from
            minors.
          </p>
        </section>

        <Separator className="my-12" />

        {/* Changes to This Policy */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">
            11. Changes to This Policy
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            We may update this policy from time to time. Material changes will
            be notified on the website, with the effective date updated
            accordingly.
          </p>
        </section>

        <Separator className="my-12" />

        {/* Contact */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">12. Contact</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Questions, requests, or complaints:
          </p>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">Email:</span>
              <a
                href="mailto:info@terralume.org"
                className="text-primary hover:underline"
              >
                info@terralume.org
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">Phone:</span>
              <a
                href="tel:+2347046676828"
                className="text-primary hover:underline"
              >
                +234 704 667 6828
              </a>
            </div>
          </div>
        </section>

        {/* Legal Notice */}
        <div className="mt-12 p-6 bg-muted/50 rounded-lg border">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong>Working draft:</strong> This privacy policy is built around
            Terralume&apos;s actual data flows and the core obligations of the
            NDPA 2023. Have Nigerian legal counsel review data-retention
            periods, the NDPC complaint mechanism, and liability clauses before
            publishing.
          </p>
        </div>
      </section>

      <FooterCTA />
    </>
  );
}
