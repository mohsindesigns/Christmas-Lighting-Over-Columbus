"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import CallToAction from "../CallToAction";
import {
  FaCheckCircle,
  FaArrowRight,
  FaShieldAlt,
  FaClock,
  FaStar,
  FaHome,
  FaBuilding,
  FaTree,
  FaLightbulb,
  FaTools,
  FaBoxOpen,
  FaPhoneAlt,
  FaCalendarAlt,
  FaGem,
  FaRuler,
  FaPalette,
  FaTimes,
  FaUser,
  FaEnvelope,
  FaSpinner,
  FaAward,
  FaQuoteLeft,
  FaTag
} from "react-icons/fa";
import { GiSparkles } from "react-icons/gi";
import { HiOutlineSparkles } from "react-icons/hi";
import { useContent } from "@/hooks/useContent";

const DEFAULT_SERVICES = [
  {
    number: "01",
    title: "Residential Christmas Lighting",
    color: "#10b981",
    description: "Coming home to a beautifully lit house makes the holidays even more special. We design and install custom residential displays tailored to your home and your style. From design to professional installation, we handle everything – so you can skip the ladders and tangled lights.",
    features: [
      "Custom roofline and gutter lighting",
      "Tree and shrub wrapping & festive accents",
      "Ongoing maintenance and season warranty",
      "Full takedown and climate-controlled storage"
    ],
    image: "/images/gallery3.jpg",
    link: "/services/residential-lighting"
  },
  {
    number: "02",
    title: "Commercial Holiday Displays",
    color: "#f59e0b",
    description: "Make your business stand out this holiday season with eye-catching commercial lighting. From storefronts to office buildings and shopping centers, we create professional displays that attract customers and spread holiday cheer.",
    features: [
      "High-visibility roofline & architectural outlines",
      "Commercial-grade ultra-bright LED lighting",
      "Timed automation & energy-efficient setup",
      "Full maintenance, takedown, and storage"
    ],
    image: "/images/gallery2.jpg",
    link: "/services/commercial-lighting"
  },
  {
    number: "03",
    title: "Permanent Smart Lighting",
    color: "#ef4444",
    description: "Enjoy stunning architectural lighting year-round with our invisible, track-mounted permanent LED systems. Control millions of colors, animations, and timers directly from your smartphone for any holiday or special occasion.",
    features: [
      "Invisible daytime profile matching your trim",
      "Smartphone app with 16+ million colors",
      "Year-round preset patterns for all holidays",
      "Commercial-grade weatherproof longevity"
    ],
    image: "/images/gallery4.jpg",
    link: "/services/permanent-lighting"
  }
];

export default function ServicesTemplate({ pageData }: { pageData?: any }) {
  const content = useContent();
  const servicesPageData = pageData?.content?.servicesPage || content?.servicesPage || pageData?.content?.services || content?.services || {};

  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>({});
  const heroRef = useRef<HTMLDivElement>(null);

  // Dynamic CMS fields
  const hero = servicesPageData.hero || {};
  const heroTitlePrefix = typeof hero.titlePrefix === 'string' ? hero.titlePrefix : (typeof hero.headline?.prefix === 'string' ? hero.headline.prefix : "PREMIUM");
  const heroTitleHighlight = typeof hero.titleHighlight === 'string' ? hero.titleHighlight : (typeof hero.headline?.highlight === 'string' ? hero.headline.highlight : "CHRISTMAS LIGHTING");
  const heroSubtitle = typeof hero.subtitle === 'string' 
    ? hero.subtitle 
    : (typeof hero.description === 'string' 
        ? hero.description 
        : (typeof servicesPageData.subtitle === 'string' 
            ? servicesPageData.subtitle 
            : (typeof servicesPageData.description === 'string' 
                ? servicesPageData.description 
                : "Transform your property with professional holiday lighting installations")));
  const heroBgImage = typeof hero.bgImage === 'string' ? hero.bgImage : "/images/hero-background2.jpg";
  const heroCtaText = typeof hero.ctaText === 'string' ? hero.ctaText : (typeof hero.cta === 'string' ? hero.cta : "Get My Free Quote");
  const heroPhone = typeof hero.phone === 'string' ? hero.phone : (typeof content?.footer?.contact?.phone === 'string' ? content.footer.contact.phone : "(614) 301-7100");
  const heroPhoneLink = typeof hero.phoneLink === 'string' ? hero.phoneLink : `tel:${heroPhone.replace(/[^0-9+]/g, '')}`;

  // Collection / Sector items
  const collectionTitle = typeof servicesPageData.collectionTitle === 'string' 
    ? servicesPageData.collectionTitle 
    : (typeof servicesPageData.title === 'string' 
        ? servicesPageData.title 
        : (typeof servicesPageData.headline === 'string' 
            ? servicesPageData.headline 
            : "Our Lighting Collection"));
  const collectionSubtitle = typeof servicesPageData.collectionSubtitle === 'string' 
    ? servicesPageData.collectionSubtitle 
    : (typeof servicesPageData.subtitle === 'string' 
        ? servicesPageData.subtitle 
        : "Professional holiday lighting solutions for every property");
  const masterServices = Array.isArray(content?.services?.services) && content.services.services.length > 0
    ? content.services.services
    : [];

  const rawItems: any[] = Array.isArray(servicesPageData.items) && servicesPageData.items.length > 0
    ? servicesPageData.items
    : (masterServices.length > 0 ? masterServices : DEFAULT_SERVICES);

  const placeholderImage = "/images/hero-background2.jpg";

  useEffect(() => {
    document.title = "Christmas Light Installation Services | Columbus, Ohio";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Serving Columbus With Stress-Free Holiday Lighting");
    }

    setMounted(true);
    window.scrollTo(0, 0);

    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setMousePosition({ x, y });
      }
    };

    const handleScroll = () => {
      if (heroRef.current) {
        const scrollY = window.scrollY;
        const heroHeight = heroRef.current.offsetHeight;
        const progress = Math.min(scrollY / (heroHeight * 0.5), 1);
        setScrollProgress(progress);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleOpenModal = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleCallClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (heroPhone) {
      window.location.href = heroPhoneLink;
    } else {
      window.location.href = "/contact";
    }
  };

  const handleImageError = (index: number) => {
    setImageErrors((prev) => ({ ...prev, [index]: true }));
  };

  if (!mounted) {
    return null;
  }

  return (
    <>
      <main className="overflow-x-hidden w-full bg-white">
        {/* Consultation Modal */}
        <ConsultationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />

        {/* ========================================================================= */}
        {/* 1. HERO SECTION */}
        {/* ========================================================================= */}
        <section
          ref={heroRef}
          className="relative min-h-[90vh] flex items-center w-full overflow-hidden"
        >
          {/* Background Image with Parallax */}
          <div className="absolute inset-0">
            <div
              className="relative w-full h-full transition-transform duration-200 ease-out"
              style={{
                transform: `translate(${mousePosition.x * 5}px, ${mousePosition.y * 5}px) scale(1.05)`,
              }}
            >
              <Image
                src={heroBgImage}
                alt="Services - Christmas Lights Over Columbus"
                fill
                className="object-cover"
                priority
                sizes="100vw"
                quality={100}
                unoptimized
              />
            </div>
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 via-gray-900/90 to-red-500/30"></div>
          </div>

          {/* Animated orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 -left-4 w-96 h-96 bg-emerald-600 rounded-full mix-blend-soft-light filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-96 h-96 bg-amber-600 rounded-full mix-blend-soft-light filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-96 h-96 bg-red-600 rounded-full mix-blend-soft-light filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
          </div>

          {/* Particle grid */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)`,
                backgroundSize: "50px 50px",
              }}
            ></div>
          </div>

          {/* Scroll overlay */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-transparent to-transparent transition-opacity duration-300 pointer-events-none"
            style={{ opacity: scrollProgress }}
          ></div>

          {/* Content */}
          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 z-10">
            <div className="max-w-4xl mx-auto text-center">
              {/* Main Heading with animations */}
              <h1 className="font-montserrat font-extrabold text-5xl sm:text-6xl lg:text-7xl text-white mb-6">
                <span className="block animate-title-slide-up">
                  {heroTitlePrefix}
                </span>
                <span className="block relative animate-title-slide-up animation-delay-200">
                  <span className="relative inline-block">
                    <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-amber-300 to-red-400 bg-[length:200%_200%] animate-gradient-x">
                      {heroTitleHighlight}
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-emerald-400/30 to-amber-400/30 blur-3xl -z-10 scale-150"></span>
                  </span>
                </span>
              </h1>

              {/* Description with animation */}
              <p className="text-xl sm:text-2xl text-white/80 mb-10 leading-relaxed max-w-3xl mx-auto animate-fade-up animation-delay-400">
                {heroSubtitle}
              </p>

              {/* CTA Button with animations */}
              <div className="flex items-center justify-center animate-fade-up animation-delay-600">
                <button
                  onClick={handleOpenModal}
                  className="relative overflow-hidden group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-yellow-500 to-red-500 text-white font-semibold rounded-lg hover:from-yellow-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl text-lg cursor-pointer transform hover:-translate-y-0.5 active:scale-95"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <HiOutlineSparkles className="w-5 h-5" />
                    <span>{heroCtaText}</span>
                    <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-yellow-400 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. SERVICES SECTIONS - ALTERNATING LEFT/RIGHT LAYOUT */}
        {/* ========================================================================= */}
        <section id="services" className="py-16 sm:py-20 md:py-24 bg-white relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, rgba(16,185,129,0.1) 1px, transparent 0)`,
                backgroundSize: "50px 50px",
              }}
            ></div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-7xl mx-auto">
              {/* Section Header */}
              <div className="text-center mb-16 animate-fade-up">
                <h2 className="font-montserrat font-extrabold text-3xl sm:text-4xl md:text-5xl text-gray-900 mt-4 mb-4">
                  <span className="bg-gradient-to-r from-red-600 via-amber-500 to-emerald-600 bg-clip-text text-transparent">
                    {collectionTitle}
                  </span>
                </h2>
                <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                  {collectionSubtitle}
                </p>
              </div>

              {/* Alternating Service Cards with Fixed Height */}
              {rawItems.map((service: any, index: number) => {
                // Determine the correct link
                const serviceLink = service.link || (
                  service.title?.toLowerCase().includes("residential")
                    ? "/services/residential-lighting"
                    : service.title?.toLowerCase().includes("commercial")
                    ? "/services/commercial-lighting"
                    : service.title?.toLowerCase().includes("permanent")
                    ? "/services/permanent-lighting"
                    : `/services/${(service.slug || service.title || "").toLowerCase().replace(/\s+/g, "-")}`
                );                const imageSrc = imageErrors[index] ? placeholderImage : (service.image || service.heroImage || placeholderImage);

                return (
                  <div
                    key={index}
                    className={`grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-stretch py-16 ${
                      index !== 0 ? "border-t border-gray-100" : ""
                    }`}
                  >
                    {/* Content - alternating order */}
                    <div
                      className={`relative order-2 ${
                        index % 2 === 0 ? "lg:order-1" : "lg:order-2"
                      } animate-fade-up h-full`}
                      style={{ animationDelay: `${400 + index * 150}ms` }}
                    >
                      <div className="relative z-10 bg-white rounded-3xl p-8 h-full flex flex-col">
                        {/* Section badge */}
                        <div className="flex justify-center lg:justify-start mb-4">
                          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500/10 to-amber-500/10 backdrop-blur-sm border border-emerald-200/30 rounded-full px-4 py-1.5 shadow-sm">
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: typeof service.color === 'string' ? service.color : "#10b981" }}
                            ></div>
                            <span className="text-emerald-700 text-xs font-bold tracking-wider">
                              {typeof service.number === 'string' || typeof service.number === 'number' ? service.number : `0${index + 1}`}
                            </span>
                          </div>
                        </div>

                        <h2 className="font-montserrat font-extrabold text-3xl sm:text-4xl lg:text-5xl text-gray-900 leading-tight mb-4">
                          <span className="bg-gradient-to-r from-red-600 via-amber-500 to-emerald-600 bg-clip-text text-transparent">
                            {typeof service.title === 'string' ? service.title : (service.title?.text || service.name || "Holiday Lighting")}
                          </span>
                        </h2>

                        {/* Description */}
                        <p className="text-gray-600 text-base sm:text-lg mb-6 leading-relaxed flex-grow">
                          {typeof service.description === 'string' ? service.description.replace(/<[^>]*>?/gm, '') : (typeof service.longDescription === 'string' ? service.longDescription.replace(/<[^>]*>?/gm, '') : (typeof service.shortDescription === 'string' ? service.shortDescription : (service.description?.text || "")))}
                        </p>

                        {/* Features List */}
                        {Array.isArray(service.features) && service.features.length > 0 && (
                          <div className="space-y-3 mb-8">
                            {service.features.slice(0, 4).map((feature: any, idx: number) => {
                              const featureText = typeof feature === 'string'
                                ? feature
                                : (feature?.title || feature?.name || feature?.text || feature?.description || '');
                              if (!featureText) return null;
                              return (
                                <div key={idx} className="flex items-start gap-3">
                                  <FaCheckCircle className="text-emerald-500 mt-1 flex-shrink-0" />
                                  <span className="text-gray-700 text-sm sm:text-base font-medium">{featureText}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* CTA Button */}
                        <div className="flex justify-center lg:justify-start mt-auto">
                          <Link
                            href={serviceLink}
                            className="group relative overflow-hidden inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-amber-400 to-red-500 text-white font-semibold rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300"
                          >
                            <span className="relative z-10 flex items-center gap-2">
                              <HiOutlineSparkles className="w-5 h-5" />
                              <span>Learn More</span>
                              <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-amber-400 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
                          </Link>
                        </div>

                        {/* Decorative elements */}
                        <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-br from-emerald-100 to-amber-100 rounded-full blur-3xl opacity-50 -z-10"></div>
                      </div>
                    </div>

                    {/* Image - alternating order with fixed height */}
                    <div
                      className={`relative order-1 ${
                        index % 2 === 0 ? "lg:order-2" : "lg:order-1"
                      } animate-fade-up h-full`}
                      style={{ animationDelay: `${500 + index * 150}ms` }}
                    >
                      <div className="relative h-full">
                        {/* Fixed height container for images */}
                        <div className="relative h-[400px] lg:h-[500px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl border-4 border-white">
                          <Image
                            src={imageSrc}
                            alt={service.title || "Holiday Lighting"}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                            priority={index === 0}
                            unoptimized
                            onError={() => handleImageError(index)}
                          />
                          {/* Gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                        </div>

                        {/* Color accent */}
                        <div
                          className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-30 pointer-events-none"
                          style={{ backgroundColor: service.color || "#10b981" }}
                        ></div>

                        {/* Decorative gradient */}
                        <div className="absolute -top-4 -left-4 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. CALL TO ACTION BANNER */}
        {/* ========================================================================= */}
        <section className="bg-white p-4 sm:p-8">
          <CallToAction 
            customData={servicesPageData.cta}
            onOpenConsultation={() => setIsModalOpen(true)}
          />
        </section>

        {/* Global Keyframes & Responsive Styles */}
        <style jsx global>{`
          @keyframes blob {
            0%, 100% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
          }

          @keyframes titleSlideUp {
            from {
              opacity: 0;
              transform: translateY(50px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes fadeUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes gradientX {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }

          .animate-blob {
            animation: blob 10s infinite;
          }

          .animate-title-slide-up {
            animation: titleSlideUp 0.8s cubic-bezier(0.2, 0.9, 0.3, 1) forwards;
            opacity: 0;
          }

          .animate-fade-up {
            animation: fadeUp 0.6s cubic-bezier(0.2, 0.9, 0.3, 1) forwards;
            opacity: 0;
          }

          .animate-gradient-x {
            background-size: 200% 200%;
            animation: gradientX 3s ease infinite;
          }

          .animation-delay-200 { animation-delay: 200ms; }
          .animation-delay-400 { animation-delay: 400ms; }
          .animation-delay-600 { animation-delay: 600ms; }
          .animation-delay-800 { animation-delay: 800ms; }
          .animation-delay-2000 { animation-delay: 2000ms; }
          .animation-delay-4000 { animation-delay: 4000ms; }

          @media (max-width: 640px) {
            h1, h2, h3 {
              line-height: 1.2 !important;
            }
            .text-xl {
              font-size: 1.125rem !important;
            }
            .h-\[400px\] {
              height: 300px !important;
            }
          }
        `}</style>
      </main>
    </>
  );
}

// Built-in Consultation Modal
function ConsultationModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    serviceType: "seasonal",
    preferredDate: "",
    preferredTime: "",
    message: "",
    hearAbout: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const initialFocusRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";

      setTimeout(() => {
        if (initialFocusRef.current) {
          initialFocusRef.current.focus();
        }
      }, 100);
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      }
    }
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/schedule-consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({
            name: "",
            email: "",
            phone: "",
            address: "",
            serviceType: "seasonal",
            preferredDate: "",
            preferredTime: "",
            message: "",
            hearAbout: ""
          });
          onClose();
        }, 3000);
      } else {
        const data = await response.json().catch(() => ({}));
        setError(data.message || data.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM",
    "12:00 PM", "1:00 PM", "2:00 PM",
    "3:00 PM", "4:00 PM", "5:00 PM"
  ];

  const serviceTypes = [
    { value: "seasonal", label: "Seasonal Christmas Lighting" },
    { value: "permanent", label: "Permanent Lighting Installation" },
    { value: "commercial", label: "Commercial Property" },
    { value: "consultation", label: "General Consultation" }
  ];

  const hearOptions = [
    "Google Search",
    "Facebook",
    "Instagram",
    "Friend/Family Referral",
    "Previous Customer",
    "Other"
  ];

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] overflow-hidden"
      onClick={() => onClose()}
    >
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity" />
      <div className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none">
        <div
          ref={modalRef}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl transform transition-all pointer-events-auto max-h-[90vh] flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200 shadow-md hover:rotate-90 transform transition-all cursor-pointer"
          >
            <FaTimes className="text-gray-600" />
          </button>

          {isSubmitted ? (
            <div className="p-8 text-center min-h-[300px] flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                <FaCheckCircle className="w-10 h-10 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Consultation Scheduled!
              </h3>
              <p className="text-gray-600 text-sm">
                Thank you for scheduling a consultation. We'll contact you within 24 hours to confirm your appointment.
              </p>
            </div>
          ) : (
            <>
              <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-6 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <GiSparkles className="text-white text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Schedule Free Consultation</h3>
                    <p className="text-emerald-100 text-xs">Christmas Lights Over Columbus</p>
                  </div>
                </div>
              </div>

              <div
                ref={scrollContainerRef}
                className="flex-1 overflow-y-auto overscroll-contain p-6"
              >
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-700 text-xs font-semibold">
                      {error}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        <FaUser className="inline mr-1 text-emerald-600" /> Full Name *
                      </label>
                      <input
                        ref={initialFocusRef}
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        <FaEnvelope className="inline mr-1 text-emerald-600" /> Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        <FaPhoneAlt className="inline mr-1 text-emerald-600" /> Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                        placeholder="(614) 555-0123"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        <FaHome className="inline mr-1 text-emerald-600" /> Service Address *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                        placeholder="123 Main St, Columbus, OH 43215"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        <FaTree className="inline mr-1 text-emerald-600" /> Service Type *
                      </label>
                      <select
                        name="serviceType"
                        value={formData.serviceType}
                        onChange={handleChange}
                        required
                        className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs text-gray-900 outline-none focus:border-emerald-500"
                      >
                        {serviceTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          <FaCalendarAlt className="inline mr-1 text-emerald-600" /> Preferred Date *
                        </label>
                        <input
                          type="date"
                          name="preferredDate"
                          value={formData.preferredDate}
                          onChange={handleChange}
                          required
                          min={new Date().toISOString().split("T")[0]}
                          className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs text-gray-900 outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          <FaClock className="inline mr-1 text-emerald-600" /> Preferred Time *
                        </label>
                        <select
                          name="preferredTime"
                          value={formData.preferredTime}
                          onChange={handleChange}
                          required
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-xs text-gray-900 outline-none focus:border-emerald-500"
                        >
                          <option value="">Select Time</option>
                          {timeSlots.map((time) => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        How did you hear about us?
                      </label>
                      <select
                        name="hearAbout"
                        value={formData.hearAbout}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-xs text-gray-900 outline-none focus:border-emerald-500"
                      >
                        <option value="">Select an option</option>
                        {hearOptions.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Additional Details (Optional)
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs text-gray-900 outline-none focus:border-emerald-500 resize-none"
                        placeholder="Tell us about your vision for your holiday display..."
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-4 py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-bold rounded-xl hover:shadow-lg transition-all text-sm cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? "Scheduling..." : "Schedule Free Consultation"}
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
