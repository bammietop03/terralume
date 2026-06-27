import Link from "next/link";
import { MapPin, Mail, Phone } from "lucide-react";

const footerLinks = {
  realEstate: [
    { label: "Real Estate Overview", href: "/real-estate" },
    {
      label: "Evaluation Framework",
      href: "/real-estate#evaluation-framework",
    },
    {
      label: "How Acquisition Works",
      href: "/real-estate#evaluation-framework",
    },
    { label: "Start a Property Intake", href: "/intake" },
  ],
  energy: [
    { label: "Energy Overview", href: "/energy" },
    { label: "Solutions Library", href: "/energy#solutions-library" },
    { label: "Integrated Solutions", href: "/integrated-solutions" },
    { label: "Start an Energy Assessment", href: "/intake" },
  ],
  company: [
    { label: "How It Works", href: "/how-it-works" },
    { label: "About Terralume", href: "/about" },
    { label: "Market Intelligence", href: "/market-intelligence" },
    { label: "Free Consultation", href: "/consultation" },
    { label: "Contact", href: "/contact" },
  ],
};

const socialLinks = [
  {
    platform: "LinkedIn",
    href: "https://linkedin.com/company/terralume",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-4 w-4"
        aria-hidden="true"
      >
        <path d="M20.447 20.452H16.89v-5.569c0-1.327-.024-3.037-1.852-3.037-1.854 0-2.137 1.446-2.137 2.94v5.666H9.345V9h3.414v1.561h.049c.476-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a1.982 1.982 0 1 1 0-3.964 1.982 1.982 0 0 1 0 3.964zm1.71 13.019H3.627V9h3.42v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.226.792 24 1.771 24h20.451C23.2 24 24 23.226 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    platform: "Instagram",
    href: "https://instagram.com/terralume",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-4 w-4"
        aria-hidden="true"
      >
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
  {
    platform: "X",
    href: "https://x.com/terralume",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-4 w-4"
        aria-hidden="true"
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
      </svg>
    ),
  },
];

export function Footer() {
  return (
    <footer className="bg-navy-dark text-white">
      {/* Top border accent */}
      <div className="h-0.75 bg-linear-to-r from-crimson via-navy to-transparent" />

      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Main grid */}
        <div className="grid grid-cols-1 gap-12 py-16 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          {/* Brand column */}
          <div>
            <Link href="/" className="mb-5 inline-block">
              <span className="font-display text-2xl font-bold">
                Terra<span className="text-crimson">lume</span>
              </span>
            </Link>
            <p className="mb-7 max-w-72 text-sm leading-relaxed text-white/55">
              Real Estate Acquisition &amp; Intelligence and Renewable Energy as
              a Service — one operating model, two divisions, built for Nigeria.
            </p>

            {/* Social links */}
            <div className="mb-7 flex items-center gap-2">
              {socialLinks.map((s) => (
                <a
                  key={s.platform}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.platform}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/50 transition-colors hover:border-white/25 hover:bg-white/10 hover:text-white"
                >
                  {s.icon}
                </a>
              ))}
            </div>

            {/* Trust badges */}
            <div className="mb-7 flex flex-wrap gap-2">
              {["LASRERA Registered", "CAC Registered"].map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white/50"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-crimson" />
                  {badge}
                </span>
              ))}
            </div>

            {/* Contact */}
            <ul className="space-y-2.5 text-sm text-white/50">
              <li className="flex items-center gap-2.5">
                <MapPin size={13} className="shrink-0 text-crimson" />
                <span>Lagos, Nigeria</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={13} className="shrink-0 text-crimson" />
                <a
                  href="mailto:info@terralume.org"
                  className="transition-colors hover:text-white"
                >
                  info@terralume.org
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={13} className="shrink-0 text-crimson" />
                <a
                  href="tel:+2347046676828"
                  className="transition-colors hover:text-white"
                >
                  +234 704 667 6828
                </a>
              </li>
            </ul>
          </div>

          {/* Real Estate */}
          <div>
            <h4 className="mb-5 text-[11px] font-semibold uppercase tracking-widest text-white/35">
              Real Estate
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.realEstate.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/50 transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Energy */}
          <div>
            <h4 className="mb-5 text-[11px] font-semibold uppercase tracking-widest text-white/35">
              Energy
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.energy.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/50 transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-5 text-[11px] font-semibold uppercase tracking-widest text-white/35">
              Company
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.company.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/50 transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-3 border-t border-white/8 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] text-white/30">
            © {new Date().getFullYear()} Terralume Ltd. All rights reserved. ·
            CAC No. RC 1847392 · LASRERA/2024/BUY/00471
          </p>
          <div className="flex gap-5">
            {[
              { label: "Privacy Policy", href: "/privacy-policy" },
              { label: "Terms of Service", href: "/terms-of-service" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-[12px] text-white/30 transition-colors hover:text-white/60"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
