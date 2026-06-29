"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Building2,
  Zap,
  MapPin,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Award,
} from "lucide-react";

const slides = [
  {
    id: "main",
    eyebrow: "Real Estate Acquisition and Renewable Energy Intelligence.",
    title: (
      <>
        Intelligent Real Estate Acquisition.{" "}
        <span className="text-gold">Renewable Energy Solutions.</span>
        <br />
        <span className="text-white/85">One Integrated Strategy.</span>
      </>
    ),
    description:
      "Terralume combines data-driven property acquisition with clean energy infrastructure — helping investors and developers build high-performance assets across Nigeria.",
    buttons: [
      {
        label: "Explore Real Estate",
        href: "#real-estate",
        icon: Building2,
        variant: "gold" as const,
      },
      {
        label: "Explore Energy",
        href: "#energy",
        icon: Zap,
        variant: "white" as const,
      },
    ],
    image: "/images/lagos2.jpg",
  },
  {
    id: "real-estate",
    eyebrow: "Strategic Property Acquisition",
    title: (
      <>
        <span className="text-gold">Intelligent Real Estate</span> Investment
        and Acquisition.
      </>
    ),
    description:
      "Access exclusive off-market properties across Lagos, Ibadan, and Ogun State. Our intelligence platform identifies high-growth locations before the market catches on.",
    buttons: [
      {
        label: "Explore Real Estate",
        href: "/real-estate",
        icon: Building2,
        variant: "gold" as const,
      },
      {
        label: "Market Intelligence",
        href: "/market-intelligence",
        icon: TrendingUp,
        variant: "white" as const,
      },
    ],
    image: "/images/lagos3.webp", // Replace with real estate specific image
  },
  {
    id: "energy",
    eyebrow: "Clean Energy Infrastructure",
    title: (
      <>
        <span className="text-gold">Need Focused</span> Renewable Energy
        Solutions.
      </>
    ),
    description:
      "Future-proof your properties with solar, backup power, and smart energy management. Reduce operational costs by up to 70% while increasing property value.",
    buttons: [
      {
        label: "Energy Solutions",
        href: "/energy",
        icon: Zap,
        variant: "gold" as const,
      },
      {
        label: "Market Intelligence",
        href: "/market-intelligence",
        icon: TrendingUp,
        variant: "white" as const,
      },
    ],
    image: "/images/energy.jpg", // Replace with energy specific image
  },
  {
    id: "satisfaction",
    eyebrow: "Proven Excellence & Trust",
    title: (
      <>
        <span className="text-gold">Your Trusted Partner</span> in Real Estate &
        Energy Excellence.
        <br />
        <span className="text-white/85">Delivering Results That Matter.</span>
      </>
    ),
    description:
      "Join 67 active clients who trust Terralume for integrated real estate and energy solutions. From acquisition to energy integration, we deliver results.",
    buttons: [
      {
        label: "View Case Studies",
        href: "/about",
        icon: Award,
        variant: "gold" as const,
      },
      {
        label: "Get Started",
        href: "/consultation",
        icon: Zap,
        variant: "white" as const,
      },
    ],
    image: "/images/lagos.jpg", // Replace with client success image
  },
];

export function HeroSectionV2() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Auto-advance slides (pause on hover)
  useEffect(() => {
    if (isHovered) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000); // Change slide every 7 seconds

    return () => clearInterval(timer);
  }, [isHovered]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      // Swiped left - go to next slide
      nextSlide();
    }

    if (distance < -minSwipeDistance) {
      // Swiped right - go to previous slide
      prevSlide();
    }

    // Reset
    setTouchStart(0);
    setTouchEnd(0);
  };

  const currentSlideData = slides[currentSlide];

  return (
    <section
      className="relative min-h-screen flex flex-col justify-end overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background images with cross-fade */}
      {slides.map((slide, index) => (
        <Image
          key={slide.id}
          src={slide.image}
          alt={`${slide.id} background`}
          fill
          className={`object-cover object-center scale-105 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
          priority={index === 0}
          quality={90}
        />
      ))}

      {/* Overlays */}
      <div className="absolute inset-0 bg-linear-to-b from-navy-dark/70 via-navy-dark/60 to-navy-dark/90" />
      <div className="absolute inset-0 bg-linear-to-r from-navy-dark/50 to-transparent" />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "128px",
        }}
      />

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-all items-center justify-center"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-all items-center justify-center"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-24 pt-40 lg:px-12 lg:pb-32">
        {/* Animated content */}
        <div
          key={currentSlide}
          className="animate-in fade-in slide-in-from-bottom-4 duration-700"
        >
          {/* Eyebrow tag */}
          <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/8 px-5 py-2 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/75">
              {currentSlideData.eyebrow}
            </span>
          </div>

          {/* Headline */}
          <h1 className="max-w-4xl font-display text-5xl font-bold leading-[1.06] text-white lg:text-[66px] xl:text-[76px]">
            {currentSlideData.title}
          </h1>

          {/* Subheadline */}
          <p className="mt-7 max-w-2xl text-[18px] leading-relaxed text-white/60">
            {currentSlideData.description}
          </p>

          {/* Location badge */}
          {currentSlide === 0 && (
            <div className="mt-6 flex items-center gap-2">
              <MapPin size={15} className="text-gold shrink-0" />
              <span className="text-[14px] text-white uppercase tracking-[0.12em]">
                Lagos &middot; Ibadan &middot; Ogun State
              </span>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="mt-12 flex flex-wrap gap-4">
            {currentSlideData.buttons.map((button, index) => {
              const Icon = button.icon;
              const isGold = button.variant === "gold";
              return (
                <Button
                  key={index}
                  asChild
                  size="lg"
                  className={
                    isGold
                      ? "bg-gold-gradient text-white border border-white/20 gap-2 px-7 h-13 text-[15px] font-semibold "
                      : "bg-white hover:bg-white/85 text-navy border border-white/20 font-semibold gap-2 px-7 h-13 text-[15px]"
                  }
                >
                  <Link href={button.href}>
                    <Icon size={17} />
                    {button.label}
                    <ArrowRight size={15} className="ml-1" />
                  </Link>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Slide indicators */}
        <div className="mt-16 flex items-center gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-gold w-12"
                  : "bg-white/30 hover:bg-white/50 w-1.5"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Divider metrics bar */}
        <div className="mt-20 flex flex-wrap items-center gap-x-10 gap-y-5 border-t border-white/10 pt-9">
          <HeroMetric value="120+" label="Transactions" />
          <div className="hidden sm:block h-6 w-px bg-white/15" />
          <HeroMetric value="67" label="Active Clients" />
          <div className="hidden sm:block h-6 w-px bg-white/15" />
          <HeroMetric value="12%" label="Avg. ROI Range" />
          <div className="hidden sm:block h-6 w-px bg-white/15" />
          <HeroMetric value="4.5/5" label="Client Satisfaction" />
          <div className="hidden lg:block h-6 w-px bg-white/15" />
          <div className="flex items-center gap-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
            <span className="text-[12px] text-white/50 uppercase tracking-widest">
              CAC &amp; LASRERA Registered
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroMetric({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="font-display text-3xl font-bold text-white leading-none">
        {value}
      </span>
      <span className="text-[11px] uppercase tracking-widest text-white/45">
        {label}
      </span>
    </div>
  );
}
