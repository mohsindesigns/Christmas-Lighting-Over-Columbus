"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import FAQ from "../FAQ";
import CallToAction from "../CallToAction";
import VanMapSection from "../VanMapSection";
import {
  FaCheckCircle,
  FaArrowRight,
  FaGift as FaAward,
  FaMedal,
  FaShieldAlt,
  FaClock,
  FaStar,
  FaUsers,
  FaTree,
  FaCalendarAlt,
  FaPhone,
  FaEnvelope,
  FaQuoteLeft,
  FaLightbulb,
  FaHome,
  FaTools,
  FaBoxOpen,
  FaTag,
  FaQuestionCircle,
  FaMinus,
  FaPlus,
  FaRibbon,
  FaGem,
  FaRegSnowflake,
  FaBuilding,
  FaLeaf,
  FaSnowman,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaHeart,
  FaRocket,
  FaUser,
  FaSpinner,
  FaTimes
} from "react-icons/fa";
import { GiSparkles, GiFruitTree, GiCrystalGrowth } from "react-icons/gi";
import { HiOutlineSparkles } from "react-icons/hi";
import { useContent } from "@/hooks/useContent";

export default function AboutTemplate({ pageData }: { pageData?: any }) {
  const content = useContent();
  const aboutData = pageData?.content?.aboutPage || content?.aboutPage || content?.about || {};

  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  // Dynamic CMS fields with defaults from user reference
  const hero = aboutData.hero || {};
  const heroBadge = hero.badge || "ABOUT US";
  const heroTitlePart1 = hero.titlePrefix || hero.titlePart1 || "GET TO KNOW";
  const heroTitleHighlight = hero.titleHighlight || hero.titlePart2 || "YOUR LIGHTING TEAM";
  const heroSubtitle = hero.subtitle || hero.description || "We're your neighbors in Central Ohio dedicated to making your holiday season magical and stress-free.";
  const heroBgImage = hero.bgImage || hero.image || "/images/hero-background2.jpg";
  const heroCtaText = hero.ctaText || hero.cta?.subtext || "Get My Free Quote";
  const heroPhone = hero.phone || content?.footer?.contact?.phone || "(614) 301-7100";
  const heroPhoneLink = hero.phoneLink || `tel:${heroPhone.replace(/[^0-9+]/g, '')}`;

  // Trust Badges
  const trustBadges = (Array.isArray(hero.trustBadges) && hero.trustBadges.length > 0)
    ? hero.trustBadges
    : [
        { icon: "shield", text: "Fully Insured" },
        { icon: "clock", text: "Fast Response" },
        { icon: "medal", text: "Premium Quality" },
        { icon: "star", text: "5-Star Service" }
      ];

  // Story / Founder Section
  const story = aboutData.story || {};
  const storyBadge = story.badge || "INSTALLING CHRISTMAS LIGHTS";
  const storyTitlePrefix = story.titlePrefix || "Serving your";
  const storyTitleHighlight = story.titleHighlight || "family";
  const founderQuote = story.founderQuote || story.quote || "Hi, I'm Ethen, owner of Christmas Lights Over Columbus. We help families across Central Ohio create beautiful, welcoming holiday displays without the stress of ladders or tangled lights.";
  const storyNarrative = story.narrative || "From custom design and installation to takedown after the season, my team takes care of everything so you can focus on what truly matters—making memories and enjoying time with the people you love.";
  const missionText = story.mission || story.philosophy || "Making holiday memories stress-free";
  const founderImage = story.image || story.founderImage || "/images/aboutownerfamily.JPEG?t=1";
  const experienceBadgeText = story.experienceBadgeText || story.expertise || "Serving Central Ohio families";

  useEffect(() => {
    document.title = 'About Christmas Lights Over Columbus | Columbus, Ohio';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Serving Columbus With Stress-Free Holiday Lighting');
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
        const rect = heroRef.current.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, -rect.top / (rect.height * 0.5)));
        setScrollProgress(progress);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (!mounted) return null;

  const handleCallClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (heroPhone) {
      window.location.href = heroPhoneLink;
    } else {
      window.location.href = '/contact';
    }
  };

  const handleOpenModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
  };

  return (
    <>
      <main ref={mainRef} className="overflow-x-hidden w-full bg-white">
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
              className="relative w-full h-full transition-transform duration-200 ease-out scale-105"
              style={{
                transform: `translate(${mousePosition.x * 5}px, ${mousePosition.y * 5}px) scale(1.05)`,
              }}
            >
              <Image
                src={heroBgImage}
                alt="About Christmas Lights Over Columbus"
                fill
                className="object-cover"
                priority
                sizes="100vw"
                quality={90}
                unoptimized
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400/15 via-gray-900/90 to-red-500/30"></div>
          </div>

          {/* Animated Ambient Blur Orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 -left-4 w-96 h-96 bg-amber-600 rounded-full mix-blend-soft-light filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-96 h-96 bg-red-600 rounded-full mix-blend-soft-light filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-96 h-96 bg-orange-600 rounded-full mix-blend-soft-light filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
          </div>

          {/* Particle Grid */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)`,
                backgroundSize: '50px 50px'
              }}
            ></div>
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
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-red-500/20 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8 animate-fade-up shadow-lg">
                <HiOutlineSparkles className="w-4 h-4 text-amber-400" />
                <span className="text-white/90 text-sm font-semibold tracking-wider uppercase">
                  {heroBadge}
                </span>
              </div>

              {/* Main Heading with animations */}
              <h1 className="font-montserrat font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white mb-6 tracking-tight">
                <span className="block animate-title-slide-up">
                  {heroTitlePart1}{" "}
                </span>
                <span className="block relative animate-title-slide-up animation-delay-200">
                  <span className="relative inline-block">
                    <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-red-400 bg-[length:200%_200%] animate-gradient-x">
                      {heroTitleHighlight}
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-amber-400/30 to-red-400/30 blur-3xl -z-10 scale-150"></span>
                  </span>
                </span>
              </h1>

              {/* Subtitle description */}
              <p className="text-lg sm:text-xl md:text-2xl text-white/80 mb-10 leading-relaxed max-w-3xl mx-auto animate-fade-up animation-delay-400 font-light">
                {heroSubtitle}
              </p>

              {/* CTA Button */}
              <div className="flex items-center justify-center mb-12 animate-fade-up animation-delay-600">
                <button
                  onClick={handleOpenModal}
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
        {/* 2. FOUNDER & STORY SECTION */}
        {/* ========================================================================= */}
        <section id="story" className="py-16 sm:py-20 md:py-24 bg-white relative overflow-hidden">
          {/* Decorative background grid */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, rgba(245,158,11,0.1) 1px, transparent 0)`,
                backgroundSize: '50px 50px'
              }}
            ></div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center">
                <div className="relative order-2 lg:order-1 text-center lg:text-left">
                  <div className="relative z-10">
                    {/* Section badge */}
                    <div className="flex justify-center lg:justify-start mb-3 animate-fade-up">
                      <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/10 to-red-500/10 backdrop-blur-sm border border-amber-200/50 rounded-full px-4 py-1.5 shadow-sm">
                        <FaAward className="w-3.5 h-3.5 text-amber-500" />
                        <span className="text-amber-700 text-xs font-bold tracking-wider uppercase">
                          {storyBadge}
                        </span>
                      </div>
                    </div>

                    {/* Main heading */}
                    <h2 className="font-montserrat font-extrabold text-3xl sm:text-4xl lg:text-5xl text-gray-900 leading-tight animate-title-slide-up">
                      <span className="block">{storyTitlePrefix}</span>
                      <span className="block relative -mt-1">
                        <span className="relative inline-block">
                          <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-red-500 bg-[length:200%_200%] animate-gradient-x">
                            {storyTitleHighlight}
                          </span>
                          <span className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-red-400/20 blur-3xl -z-10 scale-150"></span>
                        </span>
                      </span>
                    </h2>

                    {/* Content narrative */}
                    <div className="space-y-4 text-gray-600 leading-relaxed text-base sm:text-lg mt-4 animate-fade-up animation-delay-200">
                      <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed">
                        <FaQuoteLeft className="inline-block w-4 h-4 text-amber-400 mr-2 opacity-60" />
                        {founderQuote}
                      </p>
                      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                        {storyNarrative}
                      </p>

                      <div className="flex items-center justify-center lg:justify-start gap-3 pt-3 animate-fade-up animation-delay-400">
                        <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-red-100 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                          <FaGem className="text-amber-600 text-lg" />
                        </div>
                        <div className="text-left">
                          <div className="text-xs text-gray-500 uppercase font-semibold">Mission</div>
                          <div className="text-base font-bold text-gray-900">{missionText}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Decorative ambient blur */}
                  <div className="absolute -bottom-4 sm:-bottom-6 -left-4 sm:-left-6 w-24 sm:w-32 h-24 sm:h-32 bg-gradient-to-br from-amber-100 to-red-100 rounded-full blur-3xl opacity-50 -z-10"></div>
                </div>

                <div className="relative order-1 lg:order-2 animate-fade-up animation-delay-200">
                  <div className="relative">
                    <div className="aspect-[4/5] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl border-4 border-white bg-slate-100">
                      <Image
                        src={founderImage}
                        alt="Ethen - Owner, Christmas Lights Over Columbus"
                        className="w-full h-full object-cover"
                        width={800}
                        height={1000}
                        priority
                        unoptimized
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                      />
                    </div>

                    {/* Experience Floating Badge */}
                    <div className="absolute -bottom-4 sm:-bottom-6 -left-4 sm:-left-6 bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl shadow-xl max-w-[200px] sm:max-w-xs hidden lg:block border border-amber-100">
                      <div className="flex items-center gap-2 mb-1">
                        <FaCalendarAlt className="text-amber-500 text-base" />
                        <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Serving</span>
                      </div>
                      <div className="text-base sm:text-lg font-bold text-gray-900 leading-snug">{experienceBadgeText}</div>
                    </div>

                    {/* Decorative gradient */}
                    <div className="absolute -top-4 sm:-top-6 -right-4 sm:-right-6 w-32 sm:w-48 h-32 sm:h-48 bg-gradient-to-br from-amber-500/10 to-red-500/10 rounded-full blur-3xl"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. VAN MAP SECTION (MATCHING HOMEPAGE) */}
        {/* ========================================================================= */}
        <section id="service-areas">
          <VanMapSection />
        </section>

        {/* ========================================================================= */}
        {/* 4. FAQ SECTION */}
        {/* ========================================================================= */}
        <FAQ customData={aboutData.faq || aboutData.faqsSection} />

        {/* ========================================================================= */}
        {/* 5. CALL TO ACTION BANNER */}
        {/* ========================================================================= */}
        <section className="sm:-mt-12 lg:-mt-16 sm:p-6 lg:p-12 bg-gray-50">
          <CallToAction 
            customData={aboutData.cta || aboutData.ctaSection}
            onOpenConsultation={() => setIsModalOpen(true)} 
          />
        </section>

        {/* CSS KEYFRAMES */}
        <style jsx global>{`
          @keyframes blob {
            0%, 100% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
          }

          @keyframes titleSlideUp {
            from { opacity: 0; transform: translateY(50px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
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

          .animation-delay-200 {
            animation-delay: 200ms;
          }

          .animation-delay-400 {
            animation-delay: 400ms;
          }

          .animation-delay-600 {
            animation-delay: 600ms;
          }

          .animation-delay-800 {
            animation-delay: 800ms;
          }

          .animation-delay-2000 {
            animation-delay: 2000ms;
          }

          .animation-delay-4000 {
            animation-delay: 4000ms;
          }
        `}</style>
      </main>
    </>
  );
}

// Full Consultation Modal
function ConsultationModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    serviceType: 'seasonal',
    preferredDate: '',
    preferredTime: '',
    message: '',
    hearAbout: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
  const initialFocusRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';

      setTimeout(() => {
        if (initialFocusRef.current) {
          initialFocusRef.current.focus();
        }
      }, 100);
    }

    return () => {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';

      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/schedule-consultation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({
            name: '',
            email: '',
            phone: '',
            address: '',
            serviceType: 'seasonal',
            preferredDate: '',
            preferredTime: '',
            message: '',
            hearAbout: ''
          });
          onClose();
        }, 3000);
      } else {
        const data = await response.json().catch(() => ({}));
        setError(data.error || data.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting consultation form:', err);
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '1:00 PM', '2:00 PM',
    '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  const serviceTypes = [
    { value: 'seasonal', label: 'Seasonal Christmas Lighting' },
    { value: 'permanent', label: 'Permanent Lighting Installation' },
    { value: 'commercial', label: 'Commercial Property' },
    { value: 'consultation', label: 'General Consultation' }
  ];

  const hearOptions = [
    'Google Search',
    'Facebook',
    'Instagram',
    'Friend/Family Referral',
    'Previous Customer',
    'Other'
  ];

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] overflow-hidden flex items-center justify-center p-4"
      onClick={() => onClose()}
    >
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300" />

      <div
        ref={modalRef}
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl z-10 max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all shadow-md hover:scale-105 cursor-pointer"
          aria-label="Close modal"
        >
          <FaTimes className="text-gray-600 w-4 h-4" />
        </button>

        {isSubmitted ? (
          <div className="p-8 text-center min-h-[300px] flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
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
                  <GiFruitTree className="text-white text-2xl" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Schedule Free Consultation</h3>
                  <p className="text-emerald-100 text-xs">Christmas Lights Over Columbus</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      placeholder="123 Main St, Columbus, OH"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Service Type</label>
                    <select
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-xs text-gray-900 outline-none focus:border-emerald-500"
                    >
                      {serviceTypes.map(t => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Preferred Date</label>
                    <input
                      type="date"
                      name="preferredDate"
                      value={formData.preferredDate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs text-gray-900 outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Preferred Time</label>
                    <select
                      name="preferredTime"
                      value={formData.preferredTime}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-xs text-gray-900 outline-none focus:border-emerald-500"
                    >
                      <option value="">Select time</option>
                      {timeSlots.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Additional Details</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs text-gray-900 outline-none focus:border-emerald-500 resize-none"
                    placeholder="Tell us about your holiday lighting vision..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-bold rounded-xl hover:shadow-lg transition-all text-sm cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? "Scheduling Consultation..." : "Schedule Free Consultation"}
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
