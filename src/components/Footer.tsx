"use client";

import { useState, useEffect, memo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaEnvelope,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
import { BsPinterest, BsFillTelephoneFill } from "react-icons/bs";
import { SiTiktok } from "react-icons/si";
import { useContent } from "../hooks/useContent";

interface LightPosition {
  id: number;
  left: string;
  top: string;
  color: string;
  animationDelay: string;
  duration: string;
}

const iconMap: Record<string, any> = {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaEnvelope,
  FaLinkedinIn,
  FaYoutube,
  BsPinterest,
  BsFillTelephoneFill,
  SiTiktok,
  facebook: FaFacebookF,
  instagram: FaInstagram,
  twitter: FaTwitter,
  pinterest: BsPinterest,
  tiktok: SiTiktok,
  linkedin: FaLinkedinIn,
  youtube: FaYoutube,
};

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [lightPositions, setLightPositions] = useState<LightPosition[]>([]);
  const content = useContent();
  const { footer, settings, navbar, services: servicesData } = content;

  useEffect(() => {
    // Generate fewer lights for better performance on small screens
    const positions: LightPosition[] = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      color: Math.random() > 0.5 ? "#FFD700" : "#FF0000",
      animationDelay: `${Math.random() * 2}s`,
      duration: `${2 + Math.random() * 3}s`,
    }));
    setLightPositions(positions);
  }, []);

  const companyName = footer?.company?.name || settings?.siteTitle || "Luminous Holiday";
  const logoSrc = footer?.company?.logo || navbar?.logo || "/images/mainlogo.png";
  const year = footer?.bottom?.year || currentYear;
  
  // Contact details
  const phone = footer?.contact?.phone || navbar?.phone || settings?.phone || "(614) 301-7100";
  const phoneHours = footer?.contact?.hours || "Mon - Sun: 8:00 AM - 8:00 PM";
  const email = footer?.contact?.email || navbar?.email || settings?.email || "Info@lightsovercolumbus.com";
  const emailSupport = footer?.contact?.support || "24/7 Customer Support";

  // Published services from CMS
  const publishedServices = (servicesData?.services || []).filter(
    (s: any) => !s.status || s.status === "published"
  );

  const dynamicServicesLinks = publishedServices.length > 0
    ? publishedServices.map((s: any) => ({
        label: s.title,
        href: `/services/${s.slug}`,
      }))
    : [
        { label: "Residential Lighting", href: "/services/residential-lighting" },
        { label: "Commercial Lighting", href: "/services/commercial-lighting" },
        { label: "Permanent Lighting", href: "/services/permanent-lighting" },
      ];

  const quickLinks = (footer?.bottom?.links && footer.bottom.links.length > 0)
    ? footer.bottom.links
    : [
        { label: "Home", href: "/" },
        { label: "About Us", href: "/about" },
        { label: "Gallery", href: "/gallery" },
        { label: "Service Area", href: "/service-area" },
        { label: "Contact Us", href: "/contact" },
      ];

  // Dynamic link categories
  const categoriesLinks: Record<string, { label: string; href: string }[]> = footer?.links || {
    "Our Services": dynamicServicesLinks,
    "Quick Links": quickLinks,
  };

  // Social media links
  const socialMediaList = (footer?.social && Array.isArray(footer.social) && footer.social.length > 0)
    ? footer.social
    : [
        { key: "fb", href: "https://facebook.com", icon: "FaFacebookF", label: "Facebook" },
        { key: "ig", href: "https://instagram.com", icon: "FaInstagram", label: "Instagram" },
        { key: "tw", href: "https://twitter.com", icon: "FaTwitter", label: "Twitter" },
        { key: "pin", href: "https://pinterest.com", icon: "BsPinterest", label: "Pinterest" },
        { key: "tik", href: "https://tiktok.com", icon: "SiTiktok", label: "TikTok" },
      ];

  const certificationsText = typeof footer?.certifications === "string"
    ? footer.certifications
    : Array.isArray(footer?.certifications) && footer.certifications.length > 0
    ? footer.certifications.map((c: any) => c.cert || c).join(" • ")
    : "Licensed, Bonded & Insured • Certified Lighting Specialists • 100% Satisfaction Guaranteed";

  return (
    <footer className="bg-[#0a1128] border-t border-[#ff0000]/30 relative overflow-hidden text-[#f5f5dc]">
      {/* Background Pattern - Optimized for mobile */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1128] via-[#0a1128] to-[#0a1128]/95"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#ff0000]/5 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-[#ffd700]/5 via-transparent to-transparent"></div>

        {/* Christmas Lights */}
        <div className="hidden sm:block absolute inset-0 overflow-hidden pointer-events-none">
          {lightPositions.length > 0 &&
            lightPositions.map((light) => (
              <div
                key={`light-${light.id}`}
                className="absolute rounded-full"
                style={{
                  left: light.left,
                  top: light.top,
                  width: "4px",
                  height: "4px",
                  background: `radial-gradient(circle, ${light.color} 40%, transparent 70%)`,
                  filter: "blur(1px)",
                  animationName: "twinkle",
                  animationDuration: light.duration,
                  animationIterationCount: "infinite",
                  animationDirection: "alternate",
                  animationTimingFunction: "ease-in-out",
                  animationDelay: light.animationDelay,
                }}
              />
            ))}
        </div>
      </div>

      {/* Main Container */}
      <div className="w-full mx-auto px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-12 lg:px-12 lg:py-16 xl:px-16 2xl:px-20 relative z-10">
        {/* Main Footer Content - Three columns layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 mb-8 lg:mb-16">
          {/* Column 1: Brand Column - Logo only */}
          <div className="lg:col-span-3 flex flex-col items-center lg:items-start">
            <Link href="/" className="block">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36">
                {logoSrc.startsWith("http") || logoSrc.startsWith("/uploads") || logoSrc.startsWith("/cdn-images") ? (
                  <img
                    src={logoSrc}
                    alt={companyName}
                    className="object-contain w-full h-full drop-shadow-xl"
                  />
                ) : (
                  <Image
                    src={logoSrc}
                    alt={companyName}
                    width={144}
                    height={144}
                    className="object-contain w-full h-full drop-shadow-xl"
                    priority={false}
                  />
                )}
              </div>
            </Link>
          </div>

          {/* Column 2: Links/Services Column */}
          <div className="lg:col-span-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              {Object.entries(categoriesLinks).map(([category, linkItems]) => (
                <div key={`category-${category}`} className="col-span-1">
                  <h4 className="text-white font-semibold text-base sm:text-lg md:text-xl mb-3 pb-2 border-b border-[#ffd700]/20 relative">
                    <span>{category}</span>
                    <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-[#ff0000] to-[#ffd700]"></div>
                  </h4>
                  <ul className="space-y-2">
                    {(Array.isArray(linkItems) ? linkItems : []).map((link: any, lIdx: number) => (
                      <li key={`link-${link.label || lIdx}`}>
                        <Link
                          href={link.href || "#"}
                          className="text-white/70 hover:text-[#ffd700] transition-all duration-200 flex items-center group text-sm sm:text-base hover:pl-2"
                        >
                          <span className="w-1.5 h-0.5 bg-gradient-to-r from-[#ff0000] to-[#ffd700] opacity-0 group-hover:opacity-100 mr-2 transition-all duration-200"></span>
                          <span className="break-words">{link.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: Get in Touch Column */}
          <div className="lg:col-span-4">
            <h3 className="text-white font-bold text-lg sm:text-xl md:text-2xl mb-4 text-center lg:text-left">
              Get in Touch
            </h3>
            <div className="space-y-4">
              <a
                href={`tel:${phone.replace(/[^0-9+]/g, "")}`}
                className="flex items-center space-x-3 text-white/80 group hover:text-white transition-colors duration-200"
              >
                <BsFillTelephoneFill className="text-[#ffd700] flex-shrink-0 text-base sm:text-lg" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm sm:text-base break-words font-medium">
                    {phone}
                  </div>
                  <div className="text-xs sm:text-sm text-white/60">
                    {phoneHours}
                  </div>
                </div>
              </a>

              <a
                href={`mailto:${email}`}
                className="flex items-center space-x-3 text-white/80 group hover:text-white transition-colors duration-200"
              >
                <FaEnvelope className="text-[#ff0000] flex-shrink-0 text-base sm:text-lg" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm sm:text-base break-words font-medium">
                    {email}
                  </div>
                  <div className="text-xs sm:text-sm text-white/60">
                    {emailSupport}
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 sm:pt-8 lg:pt-12 border-t border-[#ff0000]/20">
          {/* Social Media */}
          <div className="mb-6">
            <h4 className="text-white font-semibold text-base sm:text-lg mb-3 text-center lg:text-left">
              Follow Our Journey
            </h4>
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
              {socialMediaList.map((social: any, sIdx: number) => {
                const IconComponent =
                  iconMap[social.icon] || iconMap[social.platform] || FaFacebookF;
                return (
                  <a
                    key={social.key || social.platform || sIdx}
                    href={social.href || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-lg border border-[#ffd700]/30 bg-[#0a1128]/50 backdrop-blur-sm text-[#ffd700] hover:bg-gradient-to-r hover:from-[#ff0000] hover:via-[#ffd700] hover:to-[#ff0000] hover:text-[#0a1128] transition-all duration-300 flex items-center justify-center hover:scale-110 hover:shadow-lg hover:shadow-[#ffd700]/20 text-sm sm:text-base"
                    aria-label={social.label || social.platform || "Social Media"}
                  >
                    <IconComponent />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <div className="text-center sm:text-left">
              <p className="text-white/60 text-sm sm:text-base">
                © {year} {companyName}. Designed by{" "}
                <a
                  href="https://mohsindesigns.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white transition-colors duration-300 font-medium hover:underline underline-offset-2"
                >
                  Mohsin Designs
                </a>
                . All rights reserved.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              <Link
                href="/privacy"
                className="text-white/60 hover:text-[#ffd700] transition-all duration-200 text-sm sm:text-base whitespace-nowrap"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-white/60 hover:text-[#ff0000] transition-all duration-200 text-sm sm:text-base whitespace-nowrap"
              >
                Terms
              </Link>
            </div>
          </div>

          {/* Certifications */}
          {certificationsText && (
            <div className="mt-6 sm:mt-8 text-center">
              <p className="text-white/40 text-xs sm:text-sm px-4">
                {certificationsText}
              </p>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

export default memo(Footer);