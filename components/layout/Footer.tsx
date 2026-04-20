import Link from "next/link";
import { MapPin, Mail, Phone } from "lucide-react";

const footerLinks = {
  services: [
    { label: "Rental Advisory (Starter)", href: "/services#starter" },
    { label: "Purchase Advisory (Standard)", href: "/services#standard" },
    { label: "Investment Advisory (Premium)", href: "/services#premium" },
    { label: "Corporate Relocation", href: "/services#corporate" },
  ],
  company: [
    { label: "About Terralume", href: "/about" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "Our Team", href: "/team" },
    { label: "Client Testimonials", href: "/#social-proof" },
  ],
  resources: [
    { label: "Market Intelligence", href: "/market-intelligence" },
    { label: "Buyer Guides", href: "/market-intelligence?cat=guides" },
    { label: "Due Diligence Checklist", href: "/resources/due-diligence" },
    { label: "Free Consultation", href: "/consultation" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-navy-dark text-white">
      {/* Top border accent */}
      <div className="h-0.75 bg-linear-to-r from-crimson via-navy to-transparent" />

      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Main grid */}
        <div className="py-16 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          {/* Brand column */}
          <div>
            <Link href="/" className="inline-block mb-5">
              <span className="font-display text-2xl font-bold">
                Terra<span className="text-crimson">lume</span>
              </span>
            </Link>
            <p className="text-white/55 text-sm leading-relaxed max-w-70 mb-8">
              Nigeria&apos;s leading buyer-side real estate advisory. We work
              exclusively for buyers — never sellers, landlords, or developers.
            </p>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-3 mb-8">
              {["LASRERA Registered", "CAC Registered"].map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white/60"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-crimson" />
                  {badge}
                </span>
              ))}
            </div>

            {/* Contact */}
            <ul className="space-y-2.5 text-sm text-white/55">
              <li className="flex items-center gap-2.5">
                <MapPin size={13} className="text-crimson shrink-0" />
                <span>Lagos, Nigeria</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={13} className="text-crimson shrink-0" />
                <a
                  href="mailto:info@terralume.com"
                  className="hover:text-white transition-colors"
                >
                  info@terralume.com
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={13} className="text-crimson shrink-0" />
                <a
                  href="tel:+2347046676828"
                  className="hover:text-white transition-colors"
                >
                  +234 704 667 6828
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-widest text-white/40 mb-5">
              Services
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.services.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/55 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-widest text-white/40 mb-5">
              Company
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.company.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/55 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-widest text-white/40 mb-5">
              Resources
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.resources.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/55 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/8 py-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] text-white/30">
            © {new Date().getFullYear()} Terralume Ltd. All rights reserved.
            Registered in Nigeria (CAC No. RC-XXXXXXX). LASRERA Member.
          </p>
          <div className="flex gap-5">
            {[
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Terms", href: "/terms" },
              { label: "Disclaimer", href: "/disclaimer" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-[12px] text-white/30 hover:text-white/60 transition-colors"
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
