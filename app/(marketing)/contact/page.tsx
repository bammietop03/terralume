import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Contact Terralume — Real Estate & Energy, Nigeria",
  description:
    "Get in touch with the Terralume team. Email, phone, and social media — we respond within one business day.",
};

const directContacts = [
  {
    icon: Mail,
    label: "Email",
    value: "info@terralume.org",
    href: "mailto:info@terralume.org",
    note: "We respond within one business day.",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+234 704 667 6828",
    href: "tel:+2347046676828",
    note: "Mon – Fri, 9 am – 6 pm WAT.",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Lagos, Nigeria",
    href: null,
    note: "Serving clients across Nigeria and the diaspora.",
  },
];

const socialLinks = [
  {
    platform: "LinkedIn",
    handle: "Terralume",
    href: "https://linkedin.com/company/terralume",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path d="M20.447 20.452H16.89v-5.569c0-1.327-.024-3.037-1.852-3.037-1.854 0-2.137 1.446-2.137 2.94v5.666H9.345V9h3.414v1.561h.049c.476-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a1.982 1.982 0 1 1 0-3.964 1.982 1.982 0 0 1 0 3.964zm1.71 13.019H3.627V9h3.42v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.226.792 24 1.771 24h20.451C23.2 24 24 23.226 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    platform: "Instagram",
    handle: "@terralume",
    href: "https://instagram.com/terralume",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
  {
    platform: "X (Twitter)",
    handle: "@terralume",
    href: "https://x.com/terralume",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
      </svg>
    ),
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Get in touch"
        title={
          <>
            Reach the <em className="italic text-gold">Terralume team.</em>
          </>
        }
        description="Whether you have a property brief, an energy question, or just want to understand what Terralume does — we're reachable by email, phone, and social media."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        minHeight="48vh"
      />

      {/* ── Direct contact ────────────────────────────────────── */}
      <section className="bg-surface py-24 lg:py-32">
        <div className="mx-auto max-w-5xl px-6 lg:px-12">
          <div className="mb-14 max-w-xl">
            <p className="mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
              <span className="h-px w-8 bg-gold" />
              Direct Contact
            </p>
            <h2 className="font-display text-3xl font-bold text-navy lg:text-4xl">
              Talk to a real person.
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-on-surface-muted">
              We don&apos;t route enquiries through a ticketing system. Email or
              call and you&apos;ll hear back from someone on the team.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {directContacts.map(({ icon: Icon, label, value, href, note }) => (
              <div
                key={label}
                className="flex flex-col overflow-hidden rounded-3xl border border-divider bg-surface-card"
              >
                <div className="relative overflow-hidden bg-navy px-7 py-6">
                  <div
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-gold/60 via-gold/20 to-transparent"
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gold/15 blur-3xl"
                  />
                  <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-gold/30 bg-gold/15">
                    <Icon size={20} className="text-gold" />
                  </div>
                  <p className="relative mt-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-white/50">
                    {label}
                  </p>
                </div>
                <div className="flex flex-1 flex-col px-7 py-6">
                  {href ? (
                    <a
                      href={href}
                      className="font-display text-[18px] font-bold text-navy transition-colors hover:text-gold"
                    >
                      {value}
                    </a>
                  ) : (
                    <p className="font-display text-[18px] font-bold text-navy">
                      {value}
                    </p>
                  )}
                  <p className="mt-2 text-[13px] leading-relaxed text-on-surface-muted">
                    {note}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Social media ──────────────────────────────────────── */}
      <section className="bg-navy-light py-20 lg:py-24">
        <div className="mx-auto max-w-5xl px-6 lg:px-12">
          <div className="mb-12 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-navy">
                <span className="h-px w-8 bg-navy" />
                Social Media
              </p>
              <h2 className="font-display text-3xl font-bold text-navy lg:text-4xl">
                Follow the work.
              </h2>
              <p className="mt-3 max-w-md text-[16px] leading-relaxed text-on-surface-muted">
                Market commentary, property insights, and updates on what
                Terralume is building — across all platforms.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {socialLinks.map((s) => (
              <a
                key={s.platform}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between rounded-2xl border border-divider bg-surface p-6 transition-all hover:border-navy/30 hover:shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-light text-navy transition-colors group-hover:bg-navy group-hover:text-white">
                    {s.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-navy">{s.platform}</p>
                    <p className="text-[13px] text-on-surface-muted">
                      {s.handle}
                    </p>
                  </div>
                </div>
                <ArrowRight
                  size={16}
                  className="shrink-0 text-on-surface-muted transition-transform group-hover:translate-x-1 group-hover:text-navy"
                />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Ready to start ────────────────────────────────────── */}
      <section className="bg-surface py-20 lg:py-24">
        <div className="mx-auto max-w-5xl px-6 lg:px-12">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="flex flex-col justify-between rounded-2xl border border-divider bg-surface-card p-8">
              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-gold">
                  Real Estate
                </p>
                <h3 className="font-display text-xl font-bold text-navy">
                  Looking for a property?
                </h3>
                <p className="mt-3 text-[14px] leading-relaxed text-on-surface-muted">
                  Start with a short intake — purpose, location, budget,
                  timeline. We take it from there.
                </p>
              </div>
              <div className="mt-6">
                <Button asChild variant="default">
                  <Link href="/consultation">
                    Start a property intake
                    <ArrowRight size={15} className="ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="flex flex-col justify-between rounded-2xl border border-divider bg-surface-card p-8">
              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-gold">
                  Energy
                </p>
                <h3 className="font-display text-xl font-bold text-navy">
                  Need a power solution?
                </h3>
                <p className="mt-3 text-[14px] leading-relaxed text-on-surface-muted">
                  Tell us about your site, your load, and your budget. We
                  consult before we propose anything.
                </p>
              </div>
              <div className="mt-6">
                <Button asChild variant="secondary">
                  <Link href="/consultation">
                    Start an energy assessment
                    <ArrowRight size={15} className="ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
