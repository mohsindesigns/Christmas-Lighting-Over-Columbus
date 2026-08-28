"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import CallToAction, { ConsultationModal } from "../CallToAction";
import VanMapSection from "../VanMapSection";
import {
  FaArrowRight,
  FaShieldAlt,
  FaStar,
  FaClock,
  FaPhoneAlt,
  FaTimes,
  FaUser,
  FaEnvelope,
  FaHome,
  FaTree,
  FaCalendarAlt,
  FaSpinner,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaCity,
  FaRoad,
  FaBuilding,
} from "react-icons/fa";
import { HiOutlineSparkles } from "react-icons/hi";
import { GiFruitTree, GiSparkles } from "react-icons/gi";
import { useContent } from "@/hooks/useContent";

const DEFAULT_COMMUNITIES = [
  { id: "1", city: "Columbus, OH", icon: "FaCity" },
  { id: "2", city: "Dublin, OH", icon: "FaCity" },
  { id: "3", city: "Delaware, OH", icon: "FaCity" },
  { id: "4", city: "Marysville, OH", icon: "FaCity" },
  { id: "5", city: "Powell, OH", icon: "FaCity" },
  { id: "6", city: "Westerville, OH", icon: "FaCity" },
  { id: "7", city: "New Albany, OH", icon: "FaCity" },
  { id: "8", city: "Johnstown, OH", icon: "FaCity" },
  { id: "9", city: "Sunbury, OH", icon: "FaCity" },
  { id: "10", city: "Pataskala, OH", icon: "FaCity" },
  { id: "11", city: "Granville, OH", icon: "FaCity" },
  { id: "12", city: "Newark, OH", icon: "FaCity" },
  { id: "13", city: "Pickerington, OH", icon: "FaCity" },
  { id: "14", city: "Canal Winchester, OH", icon: "FaCity" },
  { id: "15", city: "Carroll, OH", icon: "FaCity" },
  { id: "16", city: "Groveport, OH", icon: "FaCity" },
  { id: "17", city: "Lockbourne, OH", icon: "FaCity" },
  { id: "18", city: "Asheville, OH", icon: "FaCity" },
  { id: "19", city: "Circleville, OH", icon: "FaCity" },
  { id: "20", city: "Gahanna, OH", icon: "FaCity" },
  { id: "21", city: "Grove City, OH", icon: "FaCity" },
  { id: "22", city: "Blacklick, OH", icon: "FaCity" },
  { id: "23", city: "Hilliard, OH", icon: "FaCity" },
  { id: "24", city: "Lancaster, OH", icon: "FaCity" },
  { id: "25", city: "Upper Arlington, OH", icon: "FaCity" },
  { id: "26", city: "Lewis Center, OH", icon: "FaCity" },
];

const renderCommunityIcon = (iconName: string) => {
  switch (iconName) {
    case "FaBuilding":
      return <FaBuilding className="text-amber-500 text-xl sm:text-2xl mx-auto mb-2 group-hover:scale-110 transition-transform" />;
    case "FaMapMarkerAlt":
      return <FaMapMarkerAlt className="text-amber-500 text-xl sm:text-2xl mx-auto mb-2 group-hover:scale-110 transition-transform" />;
    case "FaHome":
      return <FaHome className="text-amber-500 text-xl sm:text-2xl mx-auto mb-2 group-hover:scale-110 transition-transform" />;
    case "FaTree":
      return <FaTree className="text-amber-500 text-xl sm:text-2xl mx-auto mb-2 group-hover:scale-110 transition-transform" />;
    case "FaRoad":
      return <FaRoad className="text-amber-500 text-xl sm:text-2xl mx-auto mb-2 group-hover:scale-110 transition-transform" />;
    case "FaCity":
    default:
      return <FaCity className="text-amber-500 text-xl sm:text-2xl mx-auto mb-2 group-hover:scale-110 transition-transform" />;
  }
};

export default function ServiceAreaTemplate({ pageData }: any) {
  const content = useContent();
  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);

  // Dynamic CMS Data
  const serviceAreaData = pageData?.content?.serviceArea || content?.serviceArea || pageData?.content || {};
  const hero = serviceAreaData.header || serviceAreaData.hero || {};
  const communitiesData = serviceAreaData.communities || serviceAreaData.locations || serviceAreaData.serviceAreas;

  const heroBadge = hero.badge || "OUR SERVICE AREA";
  const titlePrefix = hero.titlePrefix || hero.titlePart1 || "CENTRAL OHIO";
  const titleHighlight = hero.titleHighlight || hero.titlePart2 || "SERVICE AREA";
  const heroDescription = hero.description || "Proudly serving Columbus and surrounding communities with premium holiday lighting services";
  const heroBgImage = hero.bgImage || hero.heroImage || "/images/hero-background2.jpg";
  const heroCtaText = hero.ctaText || "Get My Free Quote";
  const heroCtaLink = hero.ctaLink || "#quote";
  const heroPhone = hero.phone || content?.footer?.contact?.phone || "(614) 301-7100";
  const heroPhoneLink = hero.phoneLink || `tel:${heroPhone.replace(/[^0-9+]/g, '')}`;

  // Section 2: Communities
  const communitiesTitle = serviceAreaData.communitiesTitle || "Communities We Serve";
  const communitiesSubtitle = serviceAreaData.communitiesSubtitle || "From bustling city centers to quiet suburban neighborhoods, we bring holiday cheer to homes and businesses throughout Central Ohio.";
  const communities: any[] = (Array.isArray(communitiesData) && communitiesData.length > 0)
    ? communitiesData.map((c: any, idx: number) => ({
        id: c.id || String(idx + 1),
        city: typeof c === 'string' ? c : (c.city || c.name || `Area ${idx + 1}`),
        icon: c.icon || "FaCity"
      }))
    : DEFAULT_COMMUNITIES;

  const handleCtaClick = (link?: string) => {
    const target = link || heroCtaLink;
    if (!target || target === "#quote" || target === "quote" || target === "modal" || target === "#") {
      setIsModalOpen(true);
    } else if (target.startsWith("tel:") || target.startsWith("mailto:") || target.startsWith("http") || target.startsWith("/")) {
      window.location.href = target;
    } else {
      setIsModalOpen(true);
    }
  };

  // Parallax mouse tracking
  useEffect(() => {
    let rafId: number;
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        targetX = ((e.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 8;
        targetY = ((e.clientY - rect.top - rect.height / 2) / (rect.height / 2)) * 8;
      }
    };

    const animate = () => {
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;
      setMousePosition({ x: currentX, y: currentY });
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // Smooth scroll progress
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrollY = window.scrollY;
        const heroHeight = heroRef.current.offsetHeight;
        const progress = Math.min(scrollY / (heroHeight * 0.5), 1);
        setScrollProgress(progress);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMounted(true);
    window.scrollTo(0, 0);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <main className="overflow-x-hidden w-full bg-white">
        {/* ========================================================================= */}
        {/* 1. HERO SECTION */}
        {/* ========================================================================= */}
        <section
          ref={heroRef}
          className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center w-full overflow-hidden"
        >
          {/* Background Image with Parallax */}
          <div className="absolute inset-0">
            <div
              className="relative w-full h-full will-change-transform scale-105"
              style={{
                transform: `translate3d(${mousePosition.x}px, ${mousePosition.y}px, 0)`,
              }}
            >
              <Image
                src={heroBgImage}
                alt="Service Area - Christmas Lights Over Columbus"
                fill
                className="object-cover"
                priority
                sizes="100vw"
                quality={90}
                unoptimized
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 via-gray-900/90 to-red-500/30"></div>
          </div>

          {/* Animated Ambient Blur Orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 -left-4 w-96 h-96 bg-amber-600 rounded-full mix-blend-soft-light filter blur-3xl opacity-25 animate-blob-slow"></div>
            <div className="absolute top-0 -right-4 w-96 h-96 bg-red-600 rounded-full mix-blend-soft-light filter blur-3xl opacity-25 animate-blob-slow animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-96 h-96 bg-orange-600 rounded-full mix-blend-soft-light filter blur-3xl opacity-20 animate-blob-slow animation-delay-4000"></div>
          </div>

          {/* Scroll Overlay */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-transparent to-transparent transition-opacity duration-300 pointer-events-none"
            style={{ opacity: scrollProgress }}
          ></div>

          {/* Hero Content */}
          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 z-10">
            <div className="max-w-4xl mx-auto text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-red-500/20 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-8 animate-fade-up shadow-lg">
                <HiOutlineSparkles className="w-4 h-4 text-amber-400" />
                <span className="text-white/90 text-sm font-semibold tracking-wider uppercase">
                  {heroBadge}
                </span>
              </div>

              {/* Headline */}
              <h1 className="font-montserrat font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white mb-6 tracking-tight">
                <span className="block animate-title-slide-up">
                  {titlePrefix}{" "}
                </span>
                <span className="block relative animate-title-slide-up animation-delay-200">
                  <span className="relative inline-block">
                    <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-red-400 bg-[length:200%_200%] animate-gradient-x">
                      {titleHighlight}
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-amber-400/30 to-red-400/30 blur-3xl -z-10 scale-150"></span>
                  </span>
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg sm:text-xl md:text-2xl text-white/80 mb-10 leading-relaxed max-w-3xl mx-auto animate-fade-up animation-delay-400 font-light">
                {heroDescription}
              </p>

              {/* Action Button */}
              <div className="flex items-center justify-center animate-fade-up animation-delay-600">
                <button
                  onClick={() => handleCtaClick(heroCtaLink)}
                  className="relative overflow-hidden group inline-flex items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-yellow-500 to-red-500 text-white font-bold rounded-xl hover:from-yellow-600 hover:to-red-600 transition-all duration-300 shadow-xl hover:shadow-2xl text-base cursor-pointer transform hover:-translate-y-0.5 active:scale-95"
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
        {/* 2. VAN MAP SECTION (MATCHING HOMEPAGE) */}
        {/* ========================================================================= */}
        <section id="service-areas">
          <VanMapSection />
        </section>

        {/* ========================================================================= */}
        {/* 3. SERVICE AREAS GRID */}
        {/* ========================================================================= */}
        <section className="py-10 sm:py-16 bg-gray-50/70 border-b border-gray-200">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center mb-8 sm:mb-12">
              <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs px-3 py-1 rounded-full font-bold uppercase mb-3">
                <GiSparkles className="w-3.5 h-3.5 text-emerald-600" />
                CENTRAL OHIO COVERAGE
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                {communitiesTitle}
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
                {communitiesSubtitle}
              </p>
            </div>

            {/* Communities Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {communities.map((comm: any, idx: number) => (
                <div
                  key={comm.id || idx}
                  className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-4 text-center group border border-gray-200 hover:border-amber-300"
                >
                  {renderCommunityIcon(comm.icon || "FaCity")}
                  <h3 className="font-bold text-sm sm:text-base text-gray-900 group-hover:text-primary transition-colors">
                    {comm.city}
                  </h3>
                </div>
              ))}
            </div>

            {/* Callout Notice */}
            <div className="mt-10 sm:mt-12 text-center">
              <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-5 sm:px-8 py-3 shadow-sm">
                <FaBuilding className="text-amber-600 text-sm sm:text-base" />
                <span className="text-xs sm:text-sm md:text-base text-gray-700">
                  Don't see your area?{" "}
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="text-amber-700 font-bold hover:underline cursor-pointer"
                  >
                    Contact us
                  </button>{" "}
                  — we may still serve your neighborhood!
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. CALL TO ACTION BANNER */}
        {/* ========================================================================= */}
        <section className="sm:-mt-8 lg:-mt-12 sm:p-6 lg:p-12 bg-white">
          <CallToAction
            customData={serviceAreaData.ctaSection || serviceAreaData.bottomCta}
            onOpenConsultation={() => setIsModalOpen(true)}
          />
        </section>

        {/* ========================================================================= */}
        {/* 5. CONSULTATION MODAL */}
        {/* ========================================================================= */}
        <ConsultationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />

        {/* CSS KEYFRAMES */}
        <style jsx global>{`
          @keyframes blob-slow {
            0% {
              transform: translate(0px, 0px) scale(1);
            }
            33% {
              transform: translate(20px, -30px) scale(1.05);
            }
            66% {
              transform: translate(-15px, 15px) scale(0.95);
            }
            100% {
              transform: translate(0px, 0px) scale(1);
            }
          }

          .animate-blob-slow {
            animation: blob-slow 15s infinite;
          }

          .animation-delay-2000 {
            animation-delay: 2s;
          }

          .animation-delay-4000 {
            animation-delay: 4s;
          }

          @keyframes fade-up {
            0% {
              opacity: 0;
              transform: translateY(20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fade-up {
            animation: fade-up 0.8s ease-out forwards;
            opacity: 0;
          }

          .animation-delay-200 {
            animation-delay: 0.2s;
          }

          .animation-delay-400 {
            animation-delay: 0.4s;
          }

          .animation-delay-600 {
            animation-delay: 0.6s;
          }

          @keyframes title-slide-up {
            0% {
              opacity: 0;
              transform: translateY(40px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-title-slide-up {
            animation: title-slide-up 0.8s ease-out forwards;
            opacity: 0;
          }

          @keyframes gradient-x {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }

          .animate-gradient-x {
            background-size: 200% 200%;
            animation: gradient-x 3s ease infinite;
          }

          .will-change-transform {
            will-change: transform;
          }
        `}</style>
      </main>
    </>
  );
}
