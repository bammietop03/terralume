"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "How It Works", href: "/how-it-works" },
  { label: "Services", href: "/services" },
  { label: "Area Guides", href: "/area-guides" },
  { label: "Market Intelligence", href: "/market-intelligence" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-navy-dark/90 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/25"
          : "bg-navy-dark",
      )}
    >
      <div className="mx-auto max-w-360 px-6 lg:px-12">
        <div className="flex h-17 items-center justify-between gap-8">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-0 shrink-0 group"
            aria-label="Terralume home"
          >
            <span className="font-display text-[22px] font-bold text-white tracking-tight">
              Terra
            </span>
            <span className="font-display text-[22px] font-bold text-crimson tracking-tight">
              lume
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-7 flex-1 justify-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[14px] font-medium text-white/75 hover:text-white transition-colors duration-200 tracking-wide"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3 shrink-0">
            <Button
              asChild
              size="sm"
              variant="primary"
              className="hidden lg:inline-flex"
            >
              <Link href="/get-started">Get Started</Link>
            </Button>
            <Button
              asChild
              size="sm"
              variant="outline-white"
              className="hidden lg:inline-flex"
            >
              <Link href="/login">Log In</Link>
            </Button>
            <button
              className="lg:hidden p-2 rounded-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "lg:hidden overflow-hidden transition-all duration-300",
          mobileOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="bg-navy-dark border-t border-white/10 px-6 py-6 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex py-2.5 text-[15px] font-medium text-white/70 hover:text-white transition-colors border-b border-white/5"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4">
            <Button asChild variant="primary" className="w-full">
              <Link href="/get-started" onClick={() => setMobileOpen(false)}>
                Get Started
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
