"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import {
  FaArrowRight,
  FaCheckCircle,
  FaStar,
  FaRegGem,
  FaCrown,
  FaLightbulb,
  FaShieldAlt,
} from "react-icons/fa";
import { GiSparkles } from "react-icons/gi";
import { useContent } from "../hooks/useContent";

// Helper icon resolver
const resolveServiceIcon = (iconName: string | any, index: number) => {
  if (typeof iconName === "function") {
    const IconComp = iconName;
    return <IconComp />;
  }

  const normalized = String(iconName || "").toLowerCase();
  if (normalized.includes("crown") || normalized.includes("residential")) return <FaCrown />;
  if (normalized.includes("gem") || normalized.includes("commercial") || normalized.includes("building")) return <FaRegGem />;
  if (normalized.includes("star") || normalized.includes("permanent") || normalized.includes("rgb")) return <FaStar />;
  if (normalized.includes("shield") || normalized.includes("tree") || normalized.includes("landscape")) return <FaShieldAlt />;
  if (normalized.includes("sparkle")) return <GiSparkles />;

  // Default rotation
  const icons = [<FaCrown key="1" />, <FaRegGem key="2" />, <FaStar key="3" />, <FaShieldAlt key="4" />];
  return icons[index % icons.length] || <FaLightbulb />;
};

const defaultServices = [
  {
    title: "Residential Lighting",
    slug: "residential-lighting",
    color: "#f59e0b",
    image: "/images/portfolio/portfolio-1.jpg",
    icon: "Crown",
    description: "Custom holiday lighting displays tailored perfectly to your home's rooflines, pathways, and landscape.",
    features: ["Custom Cut to Roofline", "Commercial Grade C9 LEDs", "Free Maintenance & Takedown"]
  },
  {
    title: "Commercial Lighting",
    slug: "commercial-lighting",
    color: "#ef4444",
    image: "/images/portfolio/portfolio-2.jpg",
    icon: "Gem",
    description: "Eye-catching commercial holiday displays that draw customers, increase foot traffic, and spread holiday cheer.",
    features: ["Storefronts & Plazas", "Fully Insured Installers", "Scheduled Maintenance"]
  },
  {
    title: "Permanent Year-Round Lighting",
    slug: "permanent-lighting",
    color: "#10b981",
    image: "/images/portfolio/portfolio-3.jpg",
    icon: "Star",
    description: "Invisible daytime lighting tracks with millions of programmable colors and patterns controlled from your phone.",
    features: ["Invisible Architectural Tracks", "App-Controlled Automation", "Celebrations for Every Occasion"]
  },
  {
    title: "Tree & Landscape Lighting",
    slug: "tree-landscape-lighting",
    color: "#8b5cf6",
    image: "/images/portfolio/portfolio-4.jpg",
    icon: "Shield",
    description: "Stunning canopy wraps, branch lighting, and pathway borders that transform your outdoor grounds into a winter wonderland.",
    features: ["Trunk & Canopy Wrapping", "Pathway Border Lighting", "Warm White & Multi-Color Glow"]
  }
];

const fallbackColors = ["#f59e0b", "#ef4444", "#10b981", "#8b5cf6"];

const AwardWinningServicesSection = () => {
  const containerRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });

  const content = useContent();
  const servicesContent = content.services;

  useEffect(() => {
    setIsClient(true);
  }, []);

  const sectionTitle = 
    servicesContent?.title || 
    servicesContent?.headline?.highlight || 
    "Premium Christmas Lighting Services";

  const rawSubtitle = 
    servicesContent?.subtitle || 
    (Array.isArray(servicesContent?.description) ? servicesContent.description[0] : servicesContent?.description) || 
    "Custom residential and commercial holiday lighting designed, installed, maintained, and stored for you in Columbus, OH.";
  const subtitle = typeof rawSubtitle === "string" ? rawSubtitle.replace(/<[^>]*>?/gm, '') : "";

  // Get dynamic services from CMS or fallback
  const rawList = 
    servicesContent?.services || 
    (Array.isArray(servicesContent) ? servicesContent : []) || 
    [];

  const extractImage = (item: any, idx: number) => {
    if (typeof item.image === "string" && item.image.trim()) return item.image;
    if (item.image && typeof item.image.src === "string" && item.image.src.trim()) return item.image.src;
    if (typeof item.iconImage === "string" && item.iconImage.trim()) return item.iconImage;
    if (typeof item.overviewImage === "string" && item.overviewImage.trim()) return item.overviewImage;
    if (typeof item.featuredImage === "string" && item.featuredImage.trim()) return item.featuredImage;
    if (typeof item.heroImage === "string" && item.heroImage.trim()) return item.heroImage;
    if (item.hero && typeof item.hero.image === "string" && item.hero.image.trim()) return item.hero.image;
    return `/images/portfolio/portfolio-${(idx % 5) + 1}.jpg`;
  };

  const extractFeatures = (item: any) => {
    const candidateList = item.features || item.overviewStats || item.keyBenefits || item.highlights || item.benefits;
    if (Array.isArray(candidateList) && candidateList.length > 0) {
      return candidateList
        .map((f: any) => {
          if (typeof f === "string") return f;
          return f?.text || f?.label || f?.title || f?.name || "";
        })
        .filter(Boolean);
    }
    return ["Custom Precision Fit", "Commercial Grade Lights", "Complete Takedown & Storage"];
  };

  const services = rawList.length > 0
    ? rawList.map((item: any, idx: number) => {
        const title = item.title || item.name || `Service ${idx + 1}`;
        const rawDesc = item.shortDescription || item.description || item.overview || item.summary || "Professional lighting installation, maintenance, and storage.";
        const cleanDesc = typeof rawDesc === "string" ? rawDesc.replace(/<[^>]*>?/gm, '') : "Professional lighting installation, maintenance, and storage.";

        return {
          title,
          slug: item.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `service-${idx + 1}`,
          color: item.color || fallbackColors[idx % fallbackColors.length],
          image: extractImage(item, idx),
          icon: item.icon || "Lightbulb",
          description: cleanDesc,
          features: extractFeatures(item),
          number: String(idx + 1).padStart(2, "0")
        };
      })
    : defaultServices.map((item, idx) => ({
        ...item,
        number: String(idx + 1).padStart(2, "0")
      }));

  // Fixed positions for floating lights - NO RANDOM
  const floatingLights = [
    { left: 5, top: 10, color: '#f59e0b' },
    { left: 15, top: 25, color: '#ef4444' },
    { left: 25, top: 40, color: '#10b981' },
    { left: 35, top: 55, color: '#f59e0b' },
    { left: 45, top: 70, color: '#ef4444' },
    { left: 55, top: 85, color: '#10b981' },
    { left: 65, top: 15, color: '#f59e0b' },
    { left: 75, top: 30, color: '#ef4444' },
    { left: 85, top: 45, color: '#10b981' },
    { left: 95, top: 60, color: '#f59e0b' },
    { left: 10, top: 75, color: '#ef4444' },
    { left: 20, top: 90, color: '#10b981' },
    { left: 30, top: 5, color: '#f59e0b' },
    { left: 40, top: 20, color: '#ef4444' },
    { left: 50, top: 35, color: '#10b981' },
  ];

  const animationDelays = [0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.4, 1.6, 1.8, 2.0, 2.2, 2.4, 2.6, 2.8];
  const animationDurations = [4, 5, 6, 7, 8, 4, 5, 6, 7, 8, 4, 5, 6, 7, 8];

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number]
      }
    }),
    hover: {
      y: -8,
      boxShadow: "0 30px 40px -20px rgba(0,0,0,0.15), 0 0 0 1px rgba(245,158,11,0.3)",
      transition: {
        duration: 0.3,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <section
      ref={containerRef}
      id="services"
      className="relative w-full overflow-hidden bg-white px-3 xs:px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20"
    >
      {/* Light theme background patterns */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(#fcd34d20_1px,transparent_1px)] bg-[length:24px_24px] sm:bg-[length:32px_32px]" />
        <div className="absolute top-0 left-0 right-0 h-32 sm:h-48 lg:h-64 bg-gradient-to-b from-white to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-32 sm:h-48 lg:h-64 bg-gradient-to-t from-white to-transparent" />
      </div>

      {/* Decorative light elements */}
      <div className="absolute top-20 left-5 sm:left-10 w-40 sm:w-72 lg:w-96 h-40 sm:h-72 lg:h-96 bg-amber-200/30 rounded-full blur-2xl lg:blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-5 sm:right-10 w-48 sm:w-80 lg:w-[500px] h-48 sm:h-80 lg:h-[500px] bg-red-200/30 rounded-full blur-2xl lg:blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] sm:w-[400px] lg:w-[500px] h-[280px] sm:h-[400px] lg:h-[500px] bg-gradient-to-r from-amber-100/30 to-red-100/30 rounded-full blur-2xl lg:blur-3xl pointer-events-none" />

      {/* Floating Christmas lights */}
      {isClient && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {floatingLights.map((light, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full"
              style={{
                left: `${light.left}%`,
                top: `${light.top}%`,
                background: light.color,
                opacity: 0.2,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: animationDurations[i % animationDurations.length],
                repeat: Infinity,
                delay: animationDelays[i % animationDelays.length],
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-8 sm:mb-14 lg:mb-16"
        >
          {/* Title */}
          <h2 className="text-center font-montserrat text-4xl md:text-5xl font-extrabold mb-4 sm:mb-6 leading-tight">
            <span className="bg-gradient-to-r from-red-600 via-amber-500 to-emerald-600 bg-clip-text text-transparent">
              {sectionTitle}
            </span>
          </h2>

          {/* Subtitle */}
          {subtitle && (
            <p className="text-gray-600 font-montserrat text-sm sm:text-base lg:text-lg max-w-3xl mx-auto leading-relaxed font-normal px-3 sm:px-4">
              <span>{subtitle}</span>
            </p>
          )}
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 xl:gap-10">
          {services.map((service: any, index: number) => {
            const serviceUrl = `/services/${service.slug || ''}`;

            return (
              <motion.div
                key={index}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                whileHover="hover"
                onHoverStart={() => setActiveIndex(index)}
                onHoverEnd={() => setActiveIndex(null)}
                className="group relative h-full"
              >
                <Link href={serviceUrl} className="block h-full">
                  <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl overflow-hidden border border-gray-100 h-full min-h-[380px] sm:min-h-[420px] lg:min-h-[440px] flex flex-col cursor-pointer transition-all duration-300 hover:shadow-2xl">
                    {/* Top color bar */}
                    <motion.div
                      className="h-1.5 sm:h-2 w-full flex-shrink-0"
                      style={{ backgroundColor: service.color }}
                      animate={activeIndex === index ? { height: "4px" } : { height: "2px" }}
                    />

                    {/* Image + Content row */}
                    <div className="flex flex-col sm:flex-row flex-1">
                      {/* Image section */}
                      <div className="sm:w-2/5 w-full">
                        <div className="relative w-full h-48 sm:h-full min-h-[180px] sm:min-h-full overflow-hidden bg-slate-100">
                          <img
                            src={service.image}
                            alt={service.title}
                            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                        </div>
                      </div>

                      {/* Content section */}
                      <div className="flex-1 p-4 sm:p-5 lg:p-6 xl:p-8 flex flex-col justify-between">
                        <div>
                          {/* Icon and title row */}
                          <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                            <motion.div
                              className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl flex items-center justify-center text-base sm:text-lg shadow-md flex-shrink-0"
                              style={{
                                background: `linear-gradient(135deg, ${service.color}15, white)`,
                                color: service.color,
                                boxShadow: `0 5px 10px -5px ${service.color}80`,
                              }}
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.5 }}
                            >
                              <div className="flex items-center justify-center w-full h-full">
                                {resolveServiceIcon(service.icon, index)}
                              </div>
                            </motion.div>

                            <div className="flex-1 min-w-0">
                              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-800 leading-tight">
                                {service.title}
                              </h3>
                              <motion.div
                                className="h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent mt-1"
                                animate={activeIndex === index ? { scaleX: 1 } : { scaleX: 0 }}
                                transition={{ duration: 0.3 }}
                              />
                            </div>

                            <span
                              className="text-xl sm:text-2xl lg:text-3xl font-black opacity-10 flex-shrink-0"
                              style={{ color: service.color }}
                            >
                              {service.number}
                            </span>
                          </div>

                          {/* Description */}
                          <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">
                            {service.description.replace(/<[^>]*>?/gm, '')}
                          </p>

                          {/* Features */}
                          <ul className="space-y-1.5 sm:space-y-2 mb-4 lg:mb-6">
                            {(service.features || []).map((feature: string, idx: number) => (
                              <motion.li
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={isInView ? { opacity: 1, x: 0 } : {}}
                                transition={{ delay: index * 0.1 + idx * 0.1 }}
                                className="flex items-center gap-2"
                              >
                                <FaCheckCircle
                                  className="text-xs sm:text-sm flex-shrink-0"
                                  style={{ color: service.color }}
                                />
                                <span className="text-gray-700 text-xs sm:text-sm">{feature}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </div>

                        {/* CTA Button */}
                        <motion.div
                          className="relative w-full overflow-hidden rounded-xl font-semibold text-xs sm:text-sm py-2.5 sm:py-3 px-4 flex items-center justify-center gap-2 transition-all mt-auto"
                          style={{
                            background: `linear-gradient(135deg, ${service.color}10, ${service.color}20)`,
                            color: service.color,
                            border: `1px solid ${service.color}30`,
                          }}
                          whileHover={{
                            scale: 1.02,
                            background: `linear-gradient(135deg, ${service.color}20, ${service.color}30)`,
                          }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span>View Details</span>
                          <FaArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-1" />

                          {/* Shine effect */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                            animate={{
                              x: ['-100%', '100%'],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              repeatDelay: 2,
                            }}
                          />
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-10 sm:mt-14 lg:mt-16 text-center"
        >
          <Link href={servicesContent?.cta?.buttonLink || "/services"}>
            <motion.div
              className="group relative px-6 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-amber-500 to-red-500 rounded-xl text-white font-bold text-sm sm:text-base lg:text-lg shadow-lg hover:shadow-xl cursor-pointer inline-flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 flex items-center gap-2">
                <FaLightbulb className="text-yellow-200 text-sm sm:text-base" />
                <span>{servicesContent?.cta?.buttonText || "View All Services"}</span>
                <FaStar className="text-yellow-200 text-sm sm:text-base" />
              </span>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default AwardWinningServicesSection;