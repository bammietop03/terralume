import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import { FooterCTA } from "@/components/home/FooterCTA";
import { EnquiryForm } from "@/components/contact/EnquiryForm";
import { Mail, MapPin, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Terralume — Start Your Property Advisory",
  description:
    "Get in touch with Terralume's buyer advisory team. No obligation — just an honest first conversation about your property goals in Lagos.",
};

const CONTACT_DETAILS = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@terralume.com",
    href: "mailto:hello@terralume.com",
  },
  {
    icon: MapPin,
    label: "Base",
    value: "Lagos, Nigeria",
    href: null,
  },
  {
    icon: Clock,
    label: "Response time",
    value: "Within one business day",
    href: null,
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Get in touch"
        title={
          <>
            Start the
            <br />
            <span className="text-crimson">conversation.</span>
          </>
        }
        description="Tell us what you're looking for and we'll come back with an honest, no-obligation overview of how we can help."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />

      <section className="bg-surface py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-14 lg:grid-cols-5">
            {/* ── Form (3/5) */}
            <div className="lg:col-span-3">
              <EnquiryForm />
            </div>

            {/* ── Sidebar (2/5) */}
            <aside className="space-y-8 lg:col-span-2 lg:sticky lg:top-24 lg:self-start">
              {/* What happens next */}
              <div>
                <h2 className="font-display text-xl font-bold text-on-surface">
                  What happens next
                </h2>
                <ol className="mt-5 space-y-4">
                  {[
                    {
                      step: "1",
                      title: "We review your enquiry",
                      body: "An advisor reads your message and identifies the most useful starting point for your situation.",
                    },
                    {
                      step: "2",
                      title: "You get a personal response",
                      body: "Within one business day — not a template, an actual reply from the team member who will handle your advisory.",
                    },
                    {
                      step: "3",
                      title: "We schedule a brief call",
                      body: "15–20 minutes to understand your brief properly, at a time that works for your timezone.",
                    },
                    {
                      step: "4",
                      title: "We propose the right package",
                      body: "If there's a fit, we'll recommend the service tier that matches your transaction and budget — no pressure to proceed.",
                    },
                  ].map(({ step, title, body }) => (
                    <li key={step} className="flex gap-4">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy text-xs font-bold text-white">
                        {step}
                      </span>
                      <div>
                        <p className="font-semibold text-on-surface">{title}</p>
                        <p className="mt-0.5 text-sm text-on-surface-muted">
                          {body}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Divider */}
              <div className="h-px bg-divider" />

              {/* Contact details */}
              <div>
                <h2 className="font-display text-xl font-bold text-on-surface">
                  Direct contact
                </h2>
                <ul className="mt-4 space-y-3">
                  {CONTACT_DETAILS.map(({ icon: Icon, label, value, href }) => (
                    <li key={label} className="flex items-center gap-3 text-sm">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-navy-light">
                        <Icon className="h-4 w-4 text-navy" />
                      </span>
                      <span>
                        <span className="block text-xs text-on-surface-muted">
                          {label}
                        </span>
                        {href ? (
                          <a
                            href={href}
                            className="font-medium text-navy underline-offset-2 hover:underline"
                          >
                            {value}
                          </a>
                        ) : (
                          <span className="font-medium text-on-surface">
                            {value}
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Divider */}
              <div className="h-px bg-divider" />

              {/* Not sure which service? */}
              <div className="rounded-2xl bg-surface-alt p-5">
                <p className="font-semibold text-on-surface">
                  Not sure which service fits?
                </p>
                <p className="mt-1 text-sm text-on-surface-muted">
                  Browse the different advisory packages and compare what&apos;s
                  included before getting in touch.
                </p>
                <Link
                  href="/services"
                  className="mt-3 inline-block text-sm font-medium text-navy underline-offset-2 hover:underline"
                >
                  View service packages →
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <FooterCTA />
    </>
  );
}
