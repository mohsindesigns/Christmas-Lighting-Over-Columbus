"use client";

import { useState, useEffect, useRef, memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useContent } from "../hooks/useContent";

interface DropdownItem {
  path: string;
  label: string;
  description?: string;
  icon?: string;
}

interface NavItem {
  path: string;
  label: string;
  dropdown?: DropdownItem[];
}

const Navbar = () => {
  const content = useContent();
  const { navbar, settings, services: servicesData } = content;

  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const pathname = usePathname();
  const navbarRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Dynamic values with elegant fallbacks
  const logoSrc = navbar?.logo || "/images/mainlogo.png";
  const siteTitle = settings?.siteTitle || navbar?.siteTitle || "Luminous Holiday";
  const phone = navbar?.phone || settings?.phone || "(614) 301-7100";
  const email = navbar?.email || settings?.email || "Info@lightsovercolumbus.com";
  const ctaText = navbar?.ctaText || `Call Now ${phone}`;
  const ctaLink = navbar?.ctaLink || `tel:${phone.replace(/[^0-9+]/g, "")}`;

  // Published services from CMS
  const publishedServices = (servicesData?.services || []).filter(
    (s: any) => !s.status || s.status === "published"
  );

  // Dynamic or Default Navigation items
  const defaultServicesDropdown: DropdownItem[] = publishedServices.length > 0
    ? publishedServices.map((s: any) => ({
        path: `/services/${s.slug}`,
        label: s.title,
        description: s.shortDescription || s.description ? s.description.replace(/<[^>]*>/g, "").slice(0, 45) + "..." : "Professional lighting solution",
        icon: s.icon === "Home" ? "🏠" : s.icon === "Building" ? "🏢" : "✨",
      }))
    : [
        {
          path: "/services/residential-lighting",
          label: "Residential Lighting",
          description: "Custom home lighting solutions",
          icon: "🏠",
        },
        {
          path: "/services/commercial-lighting",
          label: "Commercial Lighting",
          description: "Professional business installations",
          icon: "🏢",
        },
        {
          path: "/services/permanent-lighting",
          label: "Permanent Lighting",
          description: "Year-round architectural lighting",
          icon: "✨",
        },
      ];

  const defaultNavItems: NavItem[] = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    {
      path: "/services",
      label: "Services",
      dropdown: defaultServicesDropdown,
    },
    { path: "/gallery", label: "Gallery" },
    { path: "/service-area", label: "Service Area" },
    { path: "/contact", label: "Contact" },
  ];

  // If companyLinks are explicitly configured in CMS, adapt them; otherwise use defaultNavItems
  const navItems: NavItem[] = (navbar?.companyLinks && navbar.companyLinks.length > 0)
    ? navbar.companyLinks.map((link: any) => {
        if (link.useMegaMenu || link.href === "/services" || (link.subLinks && link.subLinks.length > 0)) {
          const dropdown: DropdownItem[] = (link.subLinks && link.subLinks.length > 0)
            ? link.subLinks.map((sub: any) => ({
                path: sub.href,
                label: sub.label,
                description: sub.description || "Custom lighting solution",
                icon: sub.icon || "✨",
              }))
            : defaultServicesDropdown;
          return {
            path: link.href || "/services",
            label: link.label || "Services",
            dropdown,
          };
        }
        return {
          path: link.href,
          label: link.label,
        };
      })
    : defaultNavItems;

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setServicesDropdownOpen(false);
    setMobileServicesOpen(false);
  }, [pathname]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        navbarRef.current &&
        !navbarRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setMobileServicesOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setServicesDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Add scroll effect with throttling
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check if link is active
  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    if (path === "/services") {
      return pathname.startsWith("/services") && pathname !== "/service-area";
    }
    return pathname.startsWith(path);
  };

  // Check if dropdown item is active
  const isDropdownItemActive = (path: string) => {
    return pathname === path;
  };

  // Handle dropdown hover with delay
  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setServicesDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setServicesDropdownOpen(false);
    }, 300);
  };

  // Toggle mobile services dropdown
  const toggleMobileServices = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMobileServicesOpen(!mobileServicesOpen);
  };

  return (
    <>
      {/* Floating Logo */}
      <div className="fixed left-4 sm:left-6 lg:left-8 xl:left-12 z-[60] pointer-events-none top-2">
        <Link
          href="/"
          className="pointer-events-auto block"
          onClick={() => setIsOpen(false)}
        >
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32">
            {logoSrc.startsWith("http") || logoSrc.startsWith("/uploads") || logoSrc.startsWith("/cdn-images") ? (
              <img
                src={logoSrc}
                alt={siteTitle}
                className="object-contain w-full h-full drop-shadow-xl"
              />
            ) : (
              <Image
                src={logoSrc}
                alt={siteTitle}
                fill
                className="object-contain drop-shadow-xl"
                sizes="(max-width: 640px) 96px, (max-width: 768px) 112px, (max-width: 1024px) 128px, 144px"
                priority
              />
            )}
          </div>
        </Link>
      </div>

      {/* Navbar */}
      <nav
        ref={navbarRef}
        className={`sticky top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "bg-[#0a1128]/95 backdrop-blur-lg shadow-lg shadow-[#ffd700]/10 py-2"
            : "bg-[#0a1128]/90 backdrop-blur-md py-3"
        }`}
      >
        <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="flex items-center justify-between">
            {/* Empty div with original logo size for spacing */}
            <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-18 lg:h-18"></div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center justify-center flex-1 max-w-4xl mx-8">
              <div className="flex items-center space-x-1">
                {navItems.map((item) =>
                  item.dropdown ? (
                    <div
                      key={item.path}
                      className="relative"
                      ref={dropdownRef}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      <Link
                        href={item.path}
                        className={`relative px-5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 group flex items-center gap-1.5 ${
                          isActive(item.path)
                            ? "text-[#ffd700]"
                            : "text-[#f5f5dc] hover:text-[#ffd700]"
                        }`}
                      >
                        <span className="relative z-10 whitespace-nowrap">
                          {item.label}
                        </span>
                        <svg
                          className={`w-4 h-4 transition-all duration-300 ${
                            servicesDropdownOpen
                              ? "rotate-180 text-[#ffd700]"
                              : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                        {isActive(item.path) && (
                          <div className="absolute inset-0 bg-gradient-to-r from-[#ff0000]/10 to-[#ffd700]/10 rounded-lg border border-[#ffd700]/30"></div>
                        )}
                      </Link>

                      {/* Desktop Dropdown Menu */}
                      <div
                        className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 transition-all duration-300 transform origin-top ${
                          servicesDropdownOpen
                            ? "opacity-100 scale-100 pointer-events-auto"
                            : "opacity-0 scale-95 pointer-events-none"
                        }`}
                      >
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 bg-gradient-to-br from-[#ffd700]/30 to-[#ff0000]/30 backdrop-blur-sm"></div>

                        <div className="relative bg-[#0a1128]/95 backdrop-blur-lg rounded-xl border border-[#ffd700]/30 shadow-2xl shadow-black/60 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-[#ff0000]/5 via-[#ffd700]/5 to-[#00ff00]/5 animate-gradient"></div>
                          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ffd700] to-transparent"></div>

                          <div className="relative p-2">
                            {item.dropdown.map((dropdownItem, index) => (
                              <Link
                                key={dropdownItem.path}
                                href={dropdownItem.path}
                                className={`group/dropdown relative block rounded-lg transition-all duration-300 ${
                                  index !== (item.dropdown?.length ?? 0) - 1
                                    ? "mb-1"
                                    : ""
                                }`}
                                onClick={() => setServicesDropdownOpen(false)}
                              >
                                <div
                                  className={`absolute inset-0 rounded-lg transition-all duration-500 ${
                                    isDropdownItemActive(dropdownItem.path)
                                      ? "bg-gradient-to-r from-[#ff0000]/20 to-[#ffd700]/20"
                                      : "opacity-0 group-hover/dropdown:opacity-100 group-hover/dropdown:bg-gradient-to-r group-hover/dropdown:from-[#ff0000]/10 group-hover/dropdown:to-[#ffd700]/10"
                                  }`}
                                ></div>

                                {isDropdownItemActive(dropdownItem.path) && (
                                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-[#ffd700] to-[#ff0000] rounded-r-full"></div>
                                )}

                                <div className="relative flex items-start gap-3 p-3">
                                  <div
                                    className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-lg transition-all duration-300 ${
                                      isDropdownItemActive(dropdownItem.path)
                                        ? "bg-gradient-to-br from-[#ffd700]/20 to-[#ff0000]/20 text-[#ffd700]"
                                        : "bg-[#0a1128]/50 group-hover/dropdown:bg-[#ffd700]/10"
                                    }`}
                                  >
                                    {dropdownItem.icon || "✨"}
                                  </div>

                                  <div className="flex-1">
                                    <div
                                      className={`text-sm font-semibold transition-colors duration-300 ${
                                        isDropdownItemActive(dropdownItem.path)
                                          ? "text-[#ffd700]"
                                          : "text-[#f5f5dc] group-hover/dropdown:text-[#ffd700]"
                                      }`}
                                    >
                                      {dropdownItem.label}
                                    </div>
                                    {dropdownItem.description && (
                                      <div className="text-xs text-[#f5f5dc]/60 group-hover/dropdown:text-[#f5f5dc]/80 transition-colors duration-300 line-clamp-1">
                                        {dropdownItem.description}
                                      </div>
                                    )}
                                  </div>

                                  <div className="absolute top-1/2 right-3 -translate-y-1/2 opacity-0 group-hover/dropdown:opacity-100 transition-opacity duration-300">
                                    <svg
                                      className="w-4 h-4 text-[#ffd700] animate-pulse"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 5 1 5 0 004.304.292l3.404-.728c.969-.207 1.69 1.047.921 1.73l-2.597 2.243a1.5 1.5 0 00-.486 1.472l.838 3.514c.22.922-.79 1.668-1.595 1.122l-2.99-1.792a1.5 1.5 0 00-1.488 0l-2.99 1.792c-.805.546-1.815-.2-1.595-1.122l.838-3.514a1.5 1.5 0 00-.486-1.472l-2.597-2.243c-.769-.683-.048-1.937.921-1.73l3.404.728a1 5 1 5 004.304-.292l1.07-3.292z" />
                                    </svg>
                                  </div>
                                </div>

                                {index !== (item.dropdown?.length ?? 0) - 1 && (
                                  <div className="absolute bottom-0 left-3 right-3 h-px bg-gradient-to-r from-transparent via-[#ffd700]/20 to-transparent"></div>
                                )}
                              </Link>
                            ))}
                          </div>

                          <div className="relative p-3 bg-gradient-to-r from-[#ff0000]/10 to-[#ffd700]/10 border-t border-[#ffd700]/20">
                            <p className="text-xs text-center text-[#f5f5dc]/70">
                              <span className="text-[#ffd700] font-semibold">
                                💡 Lighting experts
                              </span>{" "}
                              - Free consultation
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`relative px-5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 group ${
                        isActive(item.path)
                          ? "text-[#ffd700]"
                          : "text-[#f5f5dc] hover:text-[#ffd700]"
                      }`}
                    >
                      <span className="relative z-10 whitespace-nowrap">
                        {item.label}
                      </span>
                      {isActive(item.path) && (
                        <div className="absolute inset-0 bg-gradient-to-r from-[#ff0000]/10 to-[#ffd700]/10 rounded-lg border border-[#ffd700]/30"></div>
                      )}
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#ff0000]/0 via-[#ffd700]/0 to-[#00ff00]/0 group-hover:from-[#ff0000]/5 group-hover:via-[#ffd700]/5 group-hover:to-[#00ff00]/5 transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
                    </Link>
                  )
                )}
              </div>
            </div>

            {/* Desktop CTA Button */}
            <div className="hidden lg:flex items-center flex-shrink-0">
              <a
                href={ctaLink}
                className="relative overflow-hidden group min-w-[140px] inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gradient-to-r from-[#ff0000] to-[#ffd700] text-white font-semibold hover:shadow-lg transition-all duration-300"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <svg
                    className="w-4 h-4 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span className="truncate">{ctaText}</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#ff0000] via-[#ffd700] to-[#00ff00] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
              </a>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => {
                  setIsOpen(!isOpen);
                  if (!isOpen) setMobileServicesOpen(false);
                }}
                className="relative w-10 h-10 flex flex-col items-center justify-center group"
                aria-label={isOpen ? "Close menu" : "Open menu"}
                aria-expanded={isOpen}
              >
                <span className="sr-only">Menu</span>
                <div
                  className={`w-6 h-0.5 bg-white transition-all duration-300 ${
                    isOpen ? "rotate-45 translate-y-1.5" : "-translate-y-1"
                  }`}
                ></div>
                <div
                  className={`w-6 h-0.5 bg-white transition-all duration-300 mt-1 ${
                    isOpen ? "opacity-0" : "opacity-100"
                  }`}
                ></div>
                <div
                  className={`w-6 h-0.5 bg-white transition-all duration-300 mt-1 ${
                    isOpen ? "-rotate-45 -translate-y-1.5" : "translate-y-1"
                  }`}
                ></div>
                <div className="absolute inset-0 rounded-full bg-[#ffd700]/0 group-hover:bg-[#ffd700]/10 transition-colors duration-300"></div>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div
            className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
              isOpen ? "max-h-[800px] opacity-100 mt-3" : "max-h-0 opacity-0"
            }`}
          >
            <div className="pt-4 pb-6 border-t border-[#ffd700]/20">
              <div className="flex flex-col space-y-1">
                {navItems.map((item) =>
                  item.dropdown ? (
                    <div key={item.path} className="flex flex-col">
                      {/* Mobile Services Button */}
                      <button
                        onClick={toggleMobileServices}
                        className={`relative px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 flex items-center justify-between w-full ${
                          isActive(item.path) || mobileServicesOpen
                            ? "text-[#ffd700] bg-gradient-to-r from-[#ff0000]/5 to-[#ffd700]/5 border border-[#ffd700]/20"
                            : "text-[#f5f5dc] hover:text-[#ffd700] hover:bg-[#0a1128]/50"
                        }`}
                      >
                        <span className="truncate">{item.label}</span>
                        <div className="flex items-center gap-2">
                          {isActive(item.path) && (
                            <div className="w-2 h-2 rounded-full bg-[#ffd700] animate-pulse"></div>
                          )}
                          <svg
                            className={`w-5 h-5 transition-transform duration-300 ${
                              mobileServicesOpen ? "rotate-180" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </button>

                      {/* Mobile Dropdown */}
                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          mobileServicesOpen ? "max-h-96 mt-2" : "max-h-0"
                        }`}
                      >
                        <div className="relative ml-4">
                          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#ffd700]/50 via-[#ff0000]/50 to-[#ffd700]/50"></div>

                          <div className="pl-4 space-y-2">
                            {item.dropdown.map((dropdownItem, index) => (
                              <Link
                                key={dropdownItem.path}
                                href={dropdownItem.path}
                                onClick={() => {
                                  setIsOpen(false);
                                  setMobileServicesOpen(false);
                                }}
                                className={`group relative block rounded-lg transition-all duration-300 overflow-hidden ${
                                  isDropdownItemActive(dropdownItem.path)
                                    ? "bg-gradient-to-r from-[#ff0000]/20 to-[#ffd700]/20"
                                    : "hover:bg-[#0a1128]/50"
                                }`}
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-[#ff0000]/0 via-[#ffd700]/0 to-[#00ff00]/0 group-hover:from-[#ff0000]/10 group-hover:via-[#ffd700]/10 group-hover:to-[#00ff00]/10 transition-all duration-500"></div>

                                {isDropdownItemActive(dropdownItem.path) && (
                                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-[#ffd700] to-[#ff0000] rounded-r-full"></div>
                                )}

                                <div className="relative flex items-start gap-3 p-3">
                                  <div
                                    className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all duration-300 ${
                                      isDropdownItemActive(dropdownItem.path)
                                        ? "bg-gradient-to-br from-[#ffd700]/30 to-[#ff0000]/30 text-[#ffd700]"
                                        : "bg-[#0a1128]/50 text-[#f5f5dc]/70 group-hover:bg-[#ffd700]/10 group-hover:text-[#ffd700]"
                                    }`}
                                  >
                                    {dropdownItem.icon || "✨"}
                                  </div>

                                  <div className="flex-1">
                                    <div
                                      className={`text-sm font-semibold transition-colors duration-300 ${
                                        isDropdownItemActive(dropdownItem.path)
                                          ? "text-[#ffd700]"
                                          : "text-[#f5f5dc] group-hover:text-[#ffd700]"
                                      }`}
                                    >
                                      {dropdownItem.label}
                                    </div>
                                    {dropdownItem.description && (
                                      <div className="text-xs text-[#f5f5dc]/60 group-hover:text-[#f5f5dc]/80 transition-colors duration-300 line-clamp-1">
                                        {dropdownItem.description}
                                      </div>
                                    )}
                                  </div>

                                  <div
                                    className={`absolute top-1/2 right-3 -translate-y-1/2 transition-opacity duration-300 ${
                                      isDropdownItemActive(dropdownItem.path)
                                        ? "opacity-100"
                                        : "opacity-0 group-hover:opacity-100"
                                    }`}
                                  >
                                    <svg
                                      className="w-4 h-4 text-[#ffd700] animate-pulse"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 5 1 5 0 004.304.292l3.404-.728c.969-.207 1.69 1.047.921 1.73l-2.597 2.243a1.5 1.5 0 00-.486 1.472l.838 3.514c.22.922-.79 1.668-1.595 1.122l-2.99-1.792a1.5 1.5 0 00-1.488 0l-2.99 1.792c-.805.546-1.815-.2-1.595-1.122l.838-3.514a1.5 1.5 0 00-.486-1.472l-2.597-2.243c-.769-.683-.048-1.937.921-1.73l3.404.728a1 5 1 5 004.304-.292l1.07-3.292z" />
                                    </svg>
                                  </div>
                                </div>

                                {index !== (item.dropdown?.length ?? 0) - 1 && (
                                  <div className="absolute bottom-0 left-3 right-3 h-px bg-gradient-to-r from-transparent via-[#ffd700]/20 to-transparent"></div>
                                )}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Link
                      key={item.path}
                      href={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`relative px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 group ${
                        isActive(item.path)
                          ? "text-[#ffd700] bg-gradient-to-r from-[#ff0000]/5 to-[#ffd700]/5 border border-[#ffd700]/20"
                          : "text-[#f5f5dc] hover:text-[#ffd700] hover:bg-[#0a1128]/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="truncate">{item.label}</span>
                        {isActive(item.path) && (
                          <div className="w-2 h-2 rounded-full bg-[#ffd700] animate-pulse flex-shrink-0 ml-2"></div>
                        )}
                      </div>
                    </Link>
                  )
                )}

                {/* Mobile CTA Section */}
                <div className="pt-4 mt-2 border-t border-[#ffd700]/20">
                  <a
                    href={ctaLink}
                    className="w-full inline-flex items-center justify-center py-3 text-base rounded-lg bg-gradient-to-r from-[#ff0000] to-[#ffd700] text-white font-semibold hover:shadow-lg transition-all duration-300"
                    onClick={() => {
                      setIsOpen(false);
                      setMobileServicesOpen(false);
                    }}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="w-5 h-5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      {ctaText}
                    </span>
                  </a>

                  <div className="mt-4 pt-4 border-t border-[#ffd700]/10">
                    <div className="flex flex-col space-y-3 text-sm">
                      <a
                        href={`mailto:${email}`}
                        className="flex items-center gap-2 text-[#f5f5dc]/80 hover:text-[#ffd700] transition-colors px-1 py-2 rounded-lg hover:bg-[#0a1128]/30"
                      >
                        <svg
                          className="w-4 h-4 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="truncate">{email}</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative bottom gradient line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ffd700]/30 to-transparent"></div>
      </nav>
    </>
  );
};

export default memo(Navbar);