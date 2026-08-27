"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import CallToAction, { ConsultationModal } from '@/components/CallToAction';
import {
    FaCheckCircle,
    FaArrowRight,
    FaShieldAlt,
    FaClock,
    FaStar,
    FaHome,
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
    FaQuoteLeft
} from 'react-icons/fa';
import * as FaIcons from 'react-icons/fa';
import * as LucideIcons from 'lucide-react';
import { GiSparkles } from 'react-icons/gi';
import { HiOutlineSparkles } from 'react-icons/hi';
import { useContent } from '@/hooks/useContent';

const defaultFeatures = [
    { icon: "FaHome", title: "Roof & Gutter Lines", description: "Professional installation along rooflines and gutters for that classic holiday look" },
    { icon: "FaTree", title: "Tree & Shrub Wrapping", description: "Beautifully wrapped trees and bushes to complete your landscape" },
    { icon: "FaLightbulb", title: "Commercial Grade LEDs", description: "3x brighter than store-bought lights with better color consistency" },
    { icon: "FaTools", title: "Professional Installation", description: "Licensed and insured team with years of holiday lighting experience" },
    { icon: "FaBoxOpen", title: "Free Storage", description: "We store your lights after the season ends - no clutter in your garage" },
    { icon: "FaShieldAlt", title: "Warranty Included", description: "Full warranty on all lights and installation throughout the season" }
];

const defaultWhyPoints = [
    "Free Quotes & Virtual Mockups",
    "Commercial grade LED lights custom fit to your home",
    "In-Season Maintenance & Fast Take Down",
    "Free storage in our climate-controlled facility",
    "Fully insured to protect your home and property"
];

const renderFeatureIcon = (icon: any) => {
    if (React.isValidElement(icon)) return icon;
    if (typeof icon === 'string' && icon) {
        const FaComp = (FaIcons as any)[icon] || (FaIcons as any)[`Fa${icon}`];
        if (FaComp) return <FaComp className="w-6 h-6" />;
        const LucideComp = (LucideIcons as any)[icon];
        if (LucideComp) return <LucideComp className="w-6 h-6" />;
    }
    return <FaLightbulb className="w-6 h-6" />;
};

const renderHeroHeadline = (headline: string) => {
    if (!headline) {
        return (
            <>
                <span className="block animate-title-slide-up">Make your home stand </span>
                <span className="block relative animate-title-slide-up animation-delay-200">
                    <span className="relative inline-block">
                        <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-amber-300 to-red-400">
                            out this holiday season
                        </span>
                    </span>
                </span>
            </>
        );
    }

    const words = headline.trim().split(/\s+/);
    if (words.length <= 3) {
        return (
            <span className="block animate-title-slide-up">
                <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-amber-300 to-red-400">
                    {headline}
                </span>
            </span>
        );
    }

    const midpoint = Math.ceil(words.length / 2);
    const line1 = words.slice(0, midpoint).join(" ");
    const line2 = words.slice(midpoint).join(" ");

    return (
        <>
            <span className="block animate-title-slide-up">{line1} </span>
            <span className="block relative animate-title-slide-up animation-delay-200">
                <span className="relative inline-block">
                    <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-amber-300 to-red-400">
                        {line2}
                    </span>
                </span>
            </span>
        </>
    );
};

export default function ServiceDetailTemplate({ pageData, params }: { pageData?: any; params?: any }) {
    const [mounted, setMounted] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const heroRef = useRef<HTMLElement | null>(null);

    const content = useContent();
    const rawServices = content?.services?.services || [];
    const targetSlug = params?.slug || pageData?.slug || "residential-christmas-lighting";
    
    const currentService = rawServices.find((s: any) => s.slug === targetSlug) || rawServices[0] || {};

    const service = {
        number: currentService.number || "01",
        category: currentService.tag || currentService.category || "RESIDENTIAL",
        title: currentService.title || "Residential Christmas Lighting",
        headline: currentService.headline || "Make your home stand out this holiday season",
        description: currentService.description || currentService.heroDescription || "Coming home to a beautifully lit house makes the holidays even more special. We design and install custom residential displays tailored to your home and your style. From design to professional installation, we handle everything – so you can skip the ladders and tangled lights.",
        heroImage: currentService.heroImage || currentService.breadcrumbImage || "/images/portfolio/portfolio-1.jpg",

        // Overview Section
        overviewBadge: currentService.overviewBadge || "OVERVIEW",
        overviewTitle: currentService.overviewTitle || (currentService.title ? (currentService.title.includes("Lighting") ? currentService.title : `Complete ${currentService.title}`) : "Complete Residential Lighting"),
        longDescription: currentService.longDescription || currentService.overview || "Our residential lighting service transforms your home into a stunning holiday showcase. We start with a consultation to understand your vision, then create a custom design that highlights your home's architectural features. Our team handles every aspect of the installation, using only commercial-grade LED lights that are 3x brighter than store-bought options. Throughout the season, we provide ongoing maintenance to ensure your display stays perfect. When the holidays end, we return to carefully remove and store everything at our facility.",
        image: currentService.image || currentService.overviewImage || "/images/portfolio/portfolio-3.jpg",
        color: currentService.color || "#10B981",

        // What We Offer / Features Grid
        featuresBadge: currentService.featuresBadge || "WHAT WE OFFER",
        featuresTitle: currentService.featuresTitle || (currentService.title ? `Complete ${currentService.title} Services` : "Complete Residential Lighting Services"),
        featuresSubtitle: currentService.featuresSubtitle || "Professional installation with premium materials and full-service support from start to finish.",
        features: Array.isArray(currentService.features) && currentService.features.length > 0 ? currentService.features : defaultFeatures,

        // Why Choose Us Section
        whyBadge: currentService.whyBadge || "WHY CHOOSE US",
        whyTitle: currentService.whyTitle || "Professional Quality, Personal Service",
        whyDescription: currentService.whyDescription || "We focus on delivering beautiful holiday lighting while making the entire process easy and hassle-free for you.",
        whyPoints: Array.isArray(currentService.whyPoints) && currentService.whyPoints.length > 0 
            ? currentService.whyPoints 
            : (Array.isArray(currentService.benefits) && currentService.benefits.length > 0 
                ? currentService.benefits.map((b: any) => typeof b === 'string' ? b : (b.title || b.text || b)) 
                : defaultWhyPoints),
        whyImage1: currentService.whyImage1 || currentService.galleryImages?.[0] || "/images/portfolio/portfolio-2.jpg",
        whyImage2: currentService.whyImage2 || currentService.galleryImages?.[1] || "/images/portfolio/portfolio-4.jpg",
        whyImage3: currentService.whyImage3 || currentService.galleryImages?.[2] || "/images/portfolio/portfolio-5.jpg",

        // Dynamic CTAs (Label & Link Management)
        heroCtaText: currentService.heroCtaText || currentService.cta?.text || "Get Your Free Quote",
        heroCtaLink: currentService.heroCtaLink || currentService.cta?.link || "#quote",
        heroPhone: currentService.heroPhone || content?.footer?.contact?.phone || "(614) 301-7100",
        heroPhoneLink: currentService.heroPhoneLink || currentService.heroPhone || content?.footer?.contact?.phone || "(614) 301-7100",
        whyCtaText: currentService.whyCtaText || "Get Your Free Quote",
        whyCtaLink: currentService.whyCtaLink || "#quote",

        // Bottom CTA Section
        bottomCta: currentService.bottomCta || {
            title: currentService.bottomCtaTitle || "Ready to Transform Your Home?",
            description: currentService.bottomCtaDescription || "Join local homeowners who trust us to make their holidays shine",
            primaryButtonText: currentService.bottomCtaPrimaryText || "Call Us Now",
            secondaryButtonText: currentService.bottomCtaSecondaryText || "Schedule Free Consultation",
            phone: currentService.bottomCtaPhone || content?.footer?.contact?.phone || "(614) 301-7100"
        },

        phone: content?.footer?.contact?.phone || "(614) 301-7100"
    };

    const handleCtaClick = (link?: string) => {
        if (!link || link === '#quote' || link === 'quote' || link === 'modal' || link === '#') {
            setIsModalOpen(true);
        } else if (link.startsWith('tel:') || link.startsWith('mailto:') || link.startsWith('http') || link.startsWith('/')) {
            window.location.href = link;
        } else {
            setIsModalOpen(true);
        }
    };

    useEffect(() => {
        document.title = `${service.title} | Lights Over Columbus`;
        setMounted(true);
        window.scrollTo(0, 0);

        const handleMouseMove = (e: MouseEvent) => {
            if (heroRef.current) {
                const rect = heroRef.current.getBoundingClientRect();
                setMousePosition({ x: (e.clientX - rect.left) / rect.width - 0.5, y: (e.clientY - rect.top) / rect.height - 0.5 });
            }
        };

        const handleScroll = () => {
            if (heroRef.current) {
                const rect = heroRef.current.getBoundingClientRect();
                setScrollProgress(Math.max(0, Math.min(1, -rect.top / (rect.height * 0.5))));
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('scroll', handleScroll);
        return () => { 
            window.removeEventListener('mousemove', handleMouseMove); 
            window.removeEventListener('scroll', handleScroll); 
        };
    }, [service.title]);

    if (!mounted) return null;

    return (
        <>
            <main className="overflow-x-hidden w-full bg-white">
                {/* Hero Section */}
                <section ref={heroRef} className="relative min-h-[80vh] flex items-center w-full overflow-hidden">
                    <div className="absolute inset-0">
                        <div 
                            className="relative w-full h-full transition-transform duration-200 ease-out" 
                            style={{ transform: `translate(${mousePosition.x * 5}px, ${mousePosition.y * 5}px) scale(1.05)` }}
                        >
                            <Image 
                                src={service.heroImage} 
                                alt={service.title} 
                                fill 
                                className="object-cover" 
                                priority 
                                unoptimized 
                            />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-400/15 via-gray-900/90 to-red-500/30"></div>
                    </div>

                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute top-0 -left-4 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl opacity-20 animate-blob"></div>
                        <div className="absolute bottom-0 -right-4 w-96 h-96 bg-amber-600/20 rounded-full blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                    </div>

                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)`, backgroundSize: '50px 50px' }}></div>

                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-transparent to-transparent transition-opacity duration-300" style={{ opacity: scrollProgress }}></div>

                    <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 z-10">
                        <div className="max-w-4xl mx-auto text-center">
                            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500/20 to-amber-500/20 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8 animate-fade-up">
                                <HiOutlineSparkles className="w-4 h-4 text-emerald-400" />
                                <span className="text-white/90 text-sm font-medium tracking-wider uppercase">
                                    {service.number} • {service.category}
                                </span>
                            </div>

                            <h1 className="font-montserrat font-extrabold text-5xl sm:text-6xl lg:text-7xl text-white mb-6">
                                {renderHeroHeadline(service.headline)}
                            </h1>

                            <p className="text-xl sm:text-2xl text-white/80 mb-10 leading-relaxed max-w-3xl mx-auto animate-fade-up animation-delay-400">
                                {service.description}
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-fade-up animation-delay-600">
                                <button
                                    onClick={() => handleCtaClick(service.heroCtaLink)}
                                    className="relative overflow-hidden group inline-flex items-center justify-center px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 bg-gradient-to-r from-yellow-500 to-red-500 text-white font-semibold rounded-lg hover:from-yellow-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base md:text-lg w-auto min-w-[140px] sm:min-w-[160px] md:min-w-[180px] cursor-pointer"
                                > 
                                    {service.heroCtaText}
                                </button>
                                <a
                                    href={service.heroPhoneLink?.startsWith('tel:') ? service.heroPhoneLink : `tel:${(service.heroPhoneLink || service.heroPhone).replace(/[^0-9+]/g, '')}`}
                                    className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md font-semibold rounded-lg transition-all duration-300 text-sm sm:text-base md:text-lg"
                                >
                                    <FaPhoneAlt className="w-4 h-4 text-amber-400" />
                                    {service.heroPhone}
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Service Details / Overview */}
                <section id="details" className="py-16 sm:py-20 md:py-24 bg-white">
                    <div className="container mx-auto px-4 sm:px-6">
                        <div className="max-w-7xl mx-auto">
                            <div className="grid lg:grid-cols-2 gap-12 items-center">
                                <div className="animate-fade-up">
                                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500/10 to-amber-500/10 backdrop-blur-sm border border-emerald-200/30 rounded-full px-4 py-1.5 mb-4">
                                        <GiSparkles className="w-3.5 h-3.5 text-emerald-500" />
                                        <span className="text-emerald-700 text-xs font-medium tracking-wider uppercase">
                                            {service.overviewBadge}
                                        </span>
                                    </div>

                                    <h2 className="font-montserrat font-extrabold text-3xl sm:text-4xl lg:text-5xl text-gray-900 mb-4">
                                        <span className="bg-gradient-to-r from-red-600 via-amber-500 to-emerald-600 bg-clip-text text-transparent">
                                            {service.overviewTitle}
                                        </span>
                                    </h2>

                                    <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                                        {service.longDescription}
                                    </p>
                                </div>

                                <div className="relative animate-fade-up animation-delay-200">
                                    <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                                        <Image 
                                            src={service.image} 
                                            alt={service.title} 
                                            width={800} 
                                            height={600} 
                                            className="w-full h-full object-cover" 
                                            unoptimized 
                                        />
                                    </div>
                                    <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-30" style={{ backgroundColor: service.color }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* What We Offer / Features Grid */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4 sm:px-6">
                        <div className="max-w-7xl mx-auto">
                            {/* Section Header */}
                            <div className="text-center max-w-2xl mx-auto mb-16">
                                <div className="inline-flex items-center gap-2 bg-emerald-100 rounded-full px-4 py-2 mb-4">
                                    <GiSparkles className="w-4 h-4 text-emerald-600" />
                                    <span className="text-emerald-700 text-sm font-semibold uppercase">
                                        {service.featuresBadge}
                                    </span>
                                </div>
                                <h2 className="font-montserrat font-bold text-4xl text-gray-900 mb-4">
                                    {service.featuresTitle}
                                </h2>
                                <p className="text-gray-600 text-lg">
                                    {service.featuresSubtitle}
                                </p>
                            </div>

                            {/* Features Grid */}
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {service.features.map((feature: any, idx: number) => (
                                    <div
                                        key={idx}
                                        className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                                    >
                                        <div className="w-12 h-12 bg-gradient-to-br from-red-50 to-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 mb-4">
                                            {renderFeatureIcon(feature.icon)}
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                                        <p className="text-gray-600">{feature.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Why Choose Us & Image Collage */}
                <section className="py-12 lg:px-8 bg-white overflow-hidden">
                    <div className="container mx-auto px-4 sm:px-6">
                        <div className="max-w-7xl mx-auto">
                            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

                                {/* Left Column - Content */}
                                <div className="order-2 lg:order-1">
                                    <div className="inline-flex items-center gap-2 bg-emerald-100 rounded-full px-4 py-2 mb-4">
                                        <FaAward className="w-4 h-4 text-emerald-600" />
                                        <span className="text-emerald-700 text-sm font-semibold uppercase">
                                            {service.whyBadge}
                                        </span>
                                    </div>

                                    <h2 className="font-montserrat font-bold text-3xl sm:text-4xl text-gray-900 mb-6">
                                        {service.whyTitle}
                                    </h2>

                                    <p className="text-gray-600 text-base sm:text-lg mb-8">
                                        {service.whyDescription}
                                    </p>

                                    <div className="space-y-4">
                                        {service.whyPoints.map((item: any, idx: number) => (
                                            <div key={idx} className="flex items-start gap-3">
                                                <FaCheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                                <span className="text-gray-700 text-sm sm:text-base">
                                                    {typeof item === 'string' ? item.trim() : (item.title || item.text)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-8">
                                        <button
                                            onClick={() => handleCtaClick(service.whyCtaLink)}
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-yellow-500 text-white font-semibold rounded-lg hover:from-red-700 hover:to-yellow-600 transition-all text-sm sm:text-base cursor-pointer shadow-md hover:shadow-lg"
                                        >
                                            {service.whyCtaText}
                                            <FaArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Right Column - Responsive Image Gallery */}
                                <div className="relative order-1 lg:order-2 mb-8 lg:mb-0 min-h-[300px] sm:min-h-[400px] md:min-h-[450px]">
                                    {/* Main Image Container */}
                                    <div className="relative rounded-2xl overflow-hidden shadow-2xl mx-auto max-w-[90%] sm:max-w-full">
                                        <div className="aspect-[4/3] w-full">
                                            <Image
                                                src={service.whyImage1}
                                                alt={`${service.title} installation`}
                                                fill
                                                className="object-cover"
                                                unoptimized
                                            />
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                                    </div>

                                    {/* Bottom Left Card */}
                                    <div className="absolute -bottom-4 sm:-bottom-8 -left-2 sm:-left-8 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-44 lg:h-44 xl:w-48 xl:h-48 rounded-xl sm:rounded-2xl overflow-hidden shadow-xl border-2 sm:border-4 border-white">
                                        <div className="relative w-full h-full">
                                            <Image
                                                src={service.whyImage2}
                                                alt="Professional lighting detail"
                                                fill
                                                className="object-cover"
                                                unoptimized
                                            />
                                        </div>
                                    </div>

                                    {/* Top Right Card */}
                                    <div className="absolute -top-4 sm:-top-8 -right-2 sm:-right-8 w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 xl:w-40 xl:h-40 rounded-xl sm:rounded-2xl overflow-hidden shadow-xl border-2 sm:border-4 border-white">
                                        <div className="relative w-full h-full">
                                            <Image
                                                src={service.whyImage3}
                                                alt="Holiday lighting display"
                                                fill
                                                className="object-cover"
                                                unoptimized
                                            />
                                        </div>
                                    </div>

                                    {/* Decorative Ambient Elements */}
                                    <div className="absolute top-1/2 -right-6 sm:-right-12 w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 bg-emerald-200/30 rounded-full blur-xl sm:blur-2xl"></div>
                                    <div className="absolute bottom-1/4 -left-6 sm:-left-12 w-20 sm:w-28 md:w-32 h-20 sm:h-28 md:h-32 bg-red-200/30 rounded-full blur-xl sm:blur-2xl"></div>

                                    {/* Sparkle Icons */}
                                    <div className="absolute top-4 sm:top-6 md:top-8 lg:top-10 right-4 sm:right-6 md:right-8 lg:right-10 text-white">
                                        <GiSparkles className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 animate-pulse" />
                                    </div>

                                    <div className="absolute bottom-12 sm:bottom-16 md:bottom-20 left-12 sm:left-16 md:left-20 text-white">
                                        <HiOutlineSparkles className="w-3 h-3 sm:w-4 sm:h-4 animate-pulse animation-delay-200" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Call To Action Banner */}
                <section className="p-4 sm:p-8">
                    <CallToAction customData={service.bottomCta} onOpenConsultation={() => setIsModalOpen(true)} />
                </section>

                {/* Consultation Quote Modal */}
                <ConsultationModal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                />

                <style jsx global>{`
                    @keyframes blob { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(30px,-50px) scale(1.1)} 66%{transform:translate(-20px,20px) scale(0.9)} }
                    @keyframes titleSlideUp { from{opacity:0;transform:translateY(50px)} to{opacity:1;transform:translateY(0)} }
                    @keyframes fadeUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
                    .animate-blob { animation: blob 10s infinite }
                    .animate-title-slide-up { animation: titleSlideUp 0.8s forwards; opacity:0 }
                    .animate-fade-up { animation: fadeUp 0.6s forwards; opacity:0 }
                    .animation-delay-200 { animation-delay:200ms }
                    .animation-delay-400 { animation-delay:400ms }
                    .animation-delay-600 { animation-delay:600ms }
                    .animation-delay-800 { animation-delay:800ms }
                    .animation-delay-2000 { animation-delay:2000ms }
                `}</style>
            </main>
        </>
    );
}
