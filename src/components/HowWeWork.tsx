"use client";

import React, { useRef, useEffect, useState } from "react";
import CallToAction, { ConsultationModal } from "./CallToAction";
import {
  FaPhoneAlt,
  FaCalendarAlt,
  FaQuoteRight,
  FaCalendarCheck,
  FaChair,
} from "react-icons/fa";
import { GiFruitTree } from "react-icons/gi";
import { useContent } from "../hooks/useContent";

// Icon mapping
const iconMap: Record<string, React.ComponentType<any>> = {
  FaQuoteRight,
  FaCalendarCheck,
  FaChair,
  FaPhoneAlt,
  FaCalendarAlt,
  GiFruitTree,
};

// Custom CheckCircle component
const CheckCircleIcon = ({ color, size = "text-sm", className = "" }: { color?: string; size?: string; className?: string }) => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 512 512"
    className={`${size} ${className}`}
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
    style={{ color: color || undefined }}
  >
    <path d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"></path>
  </svg>
);

// Safe icon component
const SafeIconComponent = ({ iconName, color, className }: { iconName?: string; color?: string; className?: string }) => {
  const [isClient, setIsClient] = useState(false);
  const Icon = iconName ? iconMap[iconName] : null;

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className={`w-6 h-6 ${className} bg-gray-200 animate-pulse rounded`} />
    );
  }

  if (!Icon) {
    return (
      <FaQuoteRight className={className} style={{ color: color || undefined }} />
    );
  }

  return <Icon className={className} style={{ color: color || undefined }} />;
};

const defaultSteps = [
  {
    number: "01",
    title: "Design & Free Quote",
    description: "We discuss your vision, evaluate your property, and provide a custom design preview with guaranteed upfront pricing.",
    color: "#ef4444",
    icon: "FaQuoteRight",
    features: ["Free Custom Design Preview", "Transparent Written Estimate", "No Obligation Consultation"]
  },
  {
    number: "02",
    title: "Professional Installation",
    description: "Our certified, fully insured installers custom-fit commercial-grade lights to your roofline and landscape with precision.",
    color: "#f59e0b",
    icon: "FaCalendarCheck",
    features: ["Commercial-Grade C9 LEDs", "Custom Cut & Fitted", "Timer & Power Setup Included"]
  },
  {
    number: "03",
    title: "Maintenance & Takedown",
    description: "Relax all season long. We handle any bulb replacements, takedown in January, and store everything in climate-controlled storage.",
    color: "#10b981",
    icon: "FaChair",
    features: ["24-48hr Maintenance Guarantee", "Careful Post-Holiday Removal", "Secure Storage for Next Year"]
  }
];

const fallbackColors = ["#ef4444", "#f59e0b", "#10b981", "#8b5cf6"];
const fallbackIcons = ["FaQuoteRight", "FaCalendarCheck", "FaChair", "FaTree"];

const HowWeWorkSection = () => {
  const containerRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [gradientPositions, setGradientPositions] = useState<Array<{ left: number; top: number; width: number; height: number }>>([]);
  const [isClient, setIsClient] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const content = useContent();
  const workData = content.howWeWork || content.whyChooseUs || {};

  const badge = workData?.badge || workData?.section?.badge || "Simple 3-Step Process";
  const title = workData?.title || workData?.section?.title || "Working With Us Couldn't Be Easier";
  const subtitle = workData?.subtitle || workData?.section?.description || "From your initial free quote to final takedown in January, we make holiday lighting completely stress-free.";

  const rawSteps = workData?.steps || workData?.features || [];

  const steps = rawSteps.length > 0
    ? rawSteps.map((step: any, idx: number) => ({
        number: step.number || String(idx + 1).padStart(2, "0"),
        title: step.title || `Step ${idx + 1}`,
        description: typeof step.description === "string" ? step.description.replace(/<[^>]*>?/gm, '') : "Professional step in our stress-free lighting process.",
        color: step.color || fallbackColors[idx % fallbackColors.length],
        icon: step.icon || fallbackIcons[idx % fallbackIcons.length],
        features: Array.isArray(step.features)
          ? step.features.map((f: any) => typeof f === "string" ? f : f?.text || f?.label || String(f))
          : (Array.isArray(step.trustBadges)
              ? step.trustBadges
              : ["Guaranteed Quality", "Certified Professional", "Complete Hassle-Free"])
      }))
    : defaultSteps;

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: "-50px" },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Detect screen size and generate positions only on client side
  useEffect(() => {
    setIsClient(true);
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
    };

    checkScreenSize();

    const count = window.innerWidth < 768 ? 3 : 6;
    const positions = Array(count)
      .fill(null)
      .map(() => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        width: Math.random() * 200 + 100,
        height: Math.random() * 200 + 100,
      }));

    setGradientPositions(positions);

    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <>
      <section
        ref={containerRef}
        id="howwework"
        className="relative w-full overflow-hidden bg-gradient-to-b from-gray-50 to-white px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 py-10 sm:py-14 md:py-18 lg:py-24"
      >
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 25px 25px, #e5e7eb 2px, transparent 2px)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        {/* Floating Accent Elements */}
        {isClient && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {gradientPositions.map((pos, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  left: `${pos.left}%`,
                  top: `${pos.top}%`,
                  width: `${pos.width}px`,
                  height: `${pos.height}px`,
                  background: `radial-gradient(circle, rgba(239, 68, 68, 0.03) 0%, transparent 70%)`,
                  filter: "blur(40px)",
                }}
              />
            ))}
          </div>
        )}

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Modern Header */}
          <div
            className={`text-center mb-8 sm:mb-12 lg:mb-16 px-1 transition-all duration-700 ${isVisible ? "animate-fadeInUp" : "opacity-0 translate-y-4"}`}
          >
            {/* Minimal Badge */}
            {badge && (
              <div
                className={`inline-flex items-center gap-2 px-4 py-1.5 bg-white rounded-full shadow-sm mb-4 border border-gray-100 transition-all duration-700 delay-100 ${isVisible ? "animate-fadeInScale" : "opacity-0 scale-95"}`}
              >
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-gray-700 uppercase tracking-wide">
                  {badge}
                </span>
              </div>
            )}

            {/* Main Title */}
            <h2 className="text-center font-montserrat text-4xl md:text-5xl font-extrabold mb-4 sm:mb-6 leading-tight">
              <span className="bg-gradient-to-r from-red-600 via-amber-500 to-emerald-600 bg-clip-text text-transparent">
                {title}
              </span>
            </h2>

            {/* Subtitle */}
            {subtitle && (
              <p
                className={`text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto px-3 leading-relaxed text-center transition-all duration-700 delay-300 ${isVisible ? "animate-fadeInUp" : "opacity-0 translate-y-4"}`}
                dangerouslySetInnerHTML={{ __html: subtitle }}
              />
            )}
          </div>

          {/* Modern Steps */}
          <div className="relative">
            {/* Connection Line - Desktop Only */}
            {!isMobile && isClient && (
              <div className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 hidden md:block pointer-events-none">
                <div className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500 opacity-20" />
              </div>
            )}

            {/* Steps Container */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {steps.map((step: any, index: number) => {
                const delay = 400 + index * 150;
                return (
                  <div
                    key={index}
                    className={`relative group transition-all duration-700 w-full ${isVisible ? "animate-fadeInUp" : "opacity-0 translate-y-8"}`}
                    style={{
                      animationDelay: `${delay}ms`,
                      animationFillMode: "both",
                    }}
                  >
                    {/* Step Number Badge */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                      <div
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:rotate-12"
                        style={{ backgroundColor: step.color, color: "white" }}
                      >
                        <span className="text-sm sm:text-base font-bold">
                          {step.number}
                        </span>
                      </div>
                    </div>

                    {/* Modern White Card */}
                    <div className="relative h-full bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col pt-8 sm:pt-10">
                      {/* Accent Border Top */}
                      <div
                        className="absolute top-0 left-0 right-0 h-1.5 transition-all duration-300 group-hover:h-2"
                        style={{ backgroundColor: step.color }}
                      />

                      {/* Icon */}
                      <div className="flex justify-center mt-2 mb-4">
                        <div
                          className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shadow-md transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
                          style={{
                            backgroundColor: `${step.color}15`,
                            color: step.color,
                          }}
                        >
                          <SafeIconComponent
                            iconName={step.icon}
                            color={step.color}
                            className="text-2xl sm:text-3xl"
                          />
                        </div>
                      </div>

                      {/* Step Title */}
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 text-center leading-tight transition-all duration-300 group-hover:text-gray-800">
                        {step.title}
                      </h3>

                      {/* Step Description */}
                      <div className="mb-4 flex-grow">
                        <p className="text-gray-600 text-xs sm:text-sm text-center leading-relaxed">
                          {step.description}
                        </p>
                      </div>

                      {/* Features List */}
                      <div className="space-y-2 mt-auto pt-3 border-t border-gray-100">
                        {step.features.map((feature: string, idx: number) => (
                          <div
                            key={idx}
                            className="flex items-start gap-2 transition-all duration-300 hover:translate-x-1"
                          >
                            <div
                              className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center mt-0.5 transition-all duration-300 group-hover:scale-110"
                              style={{ backgroundColor: `${step.color}15` }}
                            >
                              <CheckCircleIcon
                                color={step.color}
                                className="text-xs transition-all duration-300 group-hover:rotate-12"
                              />
                            </div>
                            <span className="text-gray-700 text-xs sm:text-sm flex-1 leading-relaxed">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Decorative Corner */}
                      <div
                        className="absolute -bottom-4 -right-4 w-16 h-16 sm:w-20 sm:h-20 opacity-10 group-hover:opacity-20 transition-all duration-500 group-hover:scale-125 pointer-events-none"
                        style={{ backgroundColor: step.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom CTA Banner */}
          <section className="mt-8">
            <CallToAction onOpenConsultation={() => setIsModalOpen(true)} />
          </section>
        </div>

        {/* Global Styles */}
        <style jsx global>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes fadeInScale {
            from {
              opacity: 0;
              transform: scale(0.9);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          .animate-fadeInUp {
            animation: fadeInUp 0.6s ease-out forwards;
          }

          .animate-fadeInScale {
            animation: fadeInScale 0.5s ease-out forwards;
          }
        `}</style>
      </section>

      {/* Consultation Modal */}
      <ConsultationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default HowWeWorkSection;
