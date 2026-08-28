"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import CallToAction, { ConsultationModal } from '../CallToAction';
import {
  FaArrowRight,
  FaShieldAlt,
  FaStar,
  FaClock,
  FaPhoneAlt,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaExpand,
  FaPause,
  FaPlay,
  FaUser,
  FaEnvelope,
  FaHome,
  FaTree,
  FaCalendarAlt,
  FaSpinner,
  FaCheckCircle
} from 'react-icons/fa';
import { HiOutlineSparkles } from 'react-icons/hi';
import { GiFruitTree, GiSparkles } from 'react-icons/gi';
import { useContent } from "@/hooks/useContent";

const DEFAULT_GALLERY_IMAGES = [
  { id: 1, src: "/images/portfolio/portfolio-1.jpg", title: "Residential Roofline Display", location: "Upper Arlington, OH", category: "Residential" },
  { id: 2, src: "/images/portfolio/portfolio-2.jpg", title: "Commercial Plaza Lighting", location: "Downtown Columbus, OH", category: "Commercial" },
  { id: 3, src: "/images/portfolio/portfolio-3.jpg", title: "Tree & Shrub Wrapping", location: "Dublin, OH", category: "Residential" },
  { id: 4, src: "/images/portfolio/portfolio-4.jpg", title: "Custom Architectural Lighting", location: "New Albany, OH", category: "Residential" },
  { id: 5, src: "/images/portfolio/portfolio-5.jpg", title: "Warm White Gutter LEDs", location: "Westerville, OH", category: "Residential" },
  { id: 6, src: "/images/portfolio/portfolio1.png", title: "Estate Holiday Showcase", location: "Powell, OH", category: "Residential" },
  { id: 7, src: "/images/portfolio/portfolio2.jpg", title: "Vibrant Multi-Color Setup", location: "Bexley, OH", category: "Residential" },
  { id: 8, src: "/images/portfolio/portfolio3.jpg", title: "Courtyard & Walkway Lighting", location: "Grandview Heights, OH", category: "Residential" },
  { id: 9, src: "/images/portfolio/portfolio4.jpg", title: "Full Property Transformation", location: "Hilliard, OH", category: "Residential" },
  { id: 10, src: "/images/portfolio/portfolio5.jpg", title: "Peak & Dormer Lighting Detail", location: "Worthington, OH", category: "Residential" },
  { id: 11, src: "/images/portfolio/portfolio7.jpg", title: "Retail Center Holiday Lights", location: "Easton, OH", category: "Commercial" }
];

// TouchSwipeLightbox Component
const TouchSwipeLightbox = ({ selectedImage, setSelectedImage, filteredImages }: any) => {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Minimum swipe distance
  const minSwipeDistance = 50;

  const onTouchStart = (e: any) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: any) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    const currentIndex = filteredImages.findIndex((img: any) => (img.id === selectedImage.id || img.src === selectedImage.src));

    if (isLeftSwipe && currentIndex < filteredImages.length - 1) {
      setSelectedImage(filteredImages[currentIndex + 1]);
    } else if (isRightSwipe && currentIndex > 0) {
      setSelectedImage(filteredImages[currentIndex - 1]);
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const currentIndex = filteredImages.findIndex((img: any) => (img.id === selectedImage.id || img.src === selectedImage.src));

      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        setSelectedImage(filteredImages[currentIndex - 1]);
      } else if (e.key === 'ArrowRight' && currentIndex < filteredImages.length - 1) {
        setSelectedImage(filteredImages[currentIndex + 1]);
      } else if (e.key === 'Escape') {
        setSelectedImage(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, filteredImages, setSelectedImage]);

  // Reset loaded state when image changes
  useEffect(() => {
    setImageLoaded(false);
  }, [selectedImage]);

  const currentIndex = filteredImages.findIndex((img: any) => (img.id === selectedImage.id || img.src === selectedImage.src));

  return (
    <div
      className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center backdrop-blur-md"
      onClick={() => setSelectedImage(null)}
    >
      <div
        className="relative w-full h-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Close Button */}
        <button
          onClick={() => setSelectedImage(null)}
          className="absolute top-4 right-4 z-30 w-12 h-12 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-black/80 active:bg-black transition-all duration-200 cursor-pointer shadow-lg"
          aria-label="Close"
        >
          <FaTimes className="text-white text-xl" />
        </button>

        {/* Image Counter */}
        {filteredImages.length > 1 && (
          <div className="absolute top-4 left-4 z-30 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10">
            <span className="text-white/90 text-sm font-medium">
              {currentIndex + 1} / {filteredImages.length}
            </span>
          </div>
        )}

        {/* Main Image Container */}
        <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-6 md:p-8">
          <div className="relative w-full max-w-6xl">
            {/* Loading Spinner */}
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              </div>
            )}

            {/* Image */}
            <div className="relative w-full" style={{ height: 'min(80vh, 800px)' }}>
              <Image
                src={selectedImage.src || selectedImage.image || "/images/portfolio/portfolio-1.jpg"}
                alt={selectedImage.title || "Holiday Lighting Gallery"}
                fill
                className={`object-contain transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                sizes="100vw"
                priority
                quality={95}
                unoptimized
                onLoadingComplete={() => setImageLoaded(true)}
              />
            </div>

            {/* Image Info */}
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
              <div className="max-w-3xl mx-auto">
                <h3 className="text-white text-lg sm:text-xl md:text-2xl font-bold mb-1 break-words pr-12">
                  {selectedImage.title}
                </h3>
                <div className="flex flex-wrap items-center gap-2 text-white/80">
                  {selectedImage.location && (
                    <span className="text-sm sm:text-base">
                      {selectedImage.location}
                    </span>
                  )}
                  {selectedImage.category && (
                    <span className="bg-white/20 text-white text-xs px-2.5 py-0.5 rounded-full">
                      {selectedImage.category}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Arrows */}
        {filteredImages.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (currentIndex > 0) {
                  setSelectedImage(filteredImages[currentIndex - 1]);
                }
              }}
              className={`absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/60 backdrop-blur-md rounded-full hidden md:flex items-center justify-center hover:bg-black/80 transition-all duration-200 cursor-pointer shadow-lg ${
                currentIndex === 0 ? 'opacity-30 cursor-not-allowed' : ''
              }`}
              disabled={currentIndex === 0}
              aria-label="Previous image"
            >
              <FaChevronLeft className="text-white text-xl" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (currentIndex < filteredImages.length - 1) {
                  setSelectedImage(filteredImages[currentIndex + 1]);
                }
              }}
              className={`absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/60 backdrop-blur-md rounded-full hidden md:flex items-center justify-center hover:bg-black/80 transition-all duration-200 cursor-pointer shadow-lg ${
                currentIndex === filteredImages.length - 1 ? 'opacity-30 cursor-not-allowed' : ''
              }`}
              disabled={currentIndex === filteredImages.length - 1}
              aria-label="Next image"
            >
              <FaChevronRight className="text-white text-xl" />
            </button>
          </>
        )}

        {/* Mobile Swipe Hint */}
        {filteredImages.length > 1 && (
          <div className="absolute bottom-24 left-0 right-0 flex justify-center pointer-events-none md:hidden">
            <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 animate-fade-out">
              <span className="text-white/80 text-xs">← swipe to navigate →</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function GalleryTemplate({ pageData }: any) {
  const content = useContent();
  const [mounted, setMounted] = useState(false);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isHovering, setIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);

  // Merge CMS dynamic data
  const galleryData = pageData?.content?.galleryPage || content?.galleryPage || {};
  const hero = galleryData.header || galleryData.hero || {};

  const heroBadge = hero.badge || "OUR PORTFOLIO";
  const titlePrefix = hero.titlePrefix || hero.titlePart1 || "HOLIDAY LIGHTING";
  const titleHighlight = hero.titleHighlight || hero.titlePart2 || "GALLERY";
  const heroDescription = hero.description || "Explore our collection of stunning residential and commercial transformations";
  const heroBgImage = hero.bgImage || hero.heroImage || "/images/portfolio/portfolio-1.jpg";
  const heroCtaText = hero.ctaText || "Get My Free Quote";
  const heroCtaLink = hero.ctaLink || "#quote";
  const heroPhone = hero.phone || content?.footer?.contact?.phone || "(614) 301-7100";
  const heroPhoneLink = hero.phoneLink || `tel:${heroPhone.replace(/[^0-9+]/g, '')}`;

  // Gallery Photos Array (support pictures list directly)
  const rawImages = galleryData.images || galleryData.galleryImages || (Array.isArray(galleryData.projects) && galleryData.projects.length > 0 ? galleryData.projects.map((p: any, idx: number) => ({
    id: p.id || idx + 1,
    src: p.image || p.src || "/images/portfolio/portfolio-1.jpg",
    title: p.title || `Holiday Display #${idx + 1}`,
    location: p.location || p.category || "Columbus, OH",
    category: p.category || "Residential"
  })) : null);

  const galleryImages: any[] = (Array.isArray(rawImages) && rawImages.length > 0)
    ? rawImages.map((img: any, idx: number) => ({
        id: img.id || idx + 1,
        src: img.src || img.image || "/images/portfolio/portfolio-1.jpg",
        title: img.title || `Holiday Lighting #${idx + 1}`,
        location: img.location || "Columbus, OH",
        category: img.category || "Residential"
      }))
    : DEFAULT_GALLERY_IMAGES;

  // Filtered images
  const filteredImages = activeFilter === 'all'
    ? galleryImages
    : galleryImages.filter(img => img.category?.toLowerCase() === activeFilter.toLowerCase());

  // Create marquee array with 3x duplicates for seamless infinite scroll
  const marqueeImages = Array(3).fill(filteredImages).flat();

  // Navigation
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % (filteredImages.length || 1));
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + (filteredImages.length || 1)) % (filteredImages.length || 1));

  const handleCtaClick = (link?: string) => {
    const target = link || heroCtaLink;
    if (!target || target === '#quote' || target === 'quote' || target === 'modal' || target === '#') {
      setIsModalOpen(true);
    } else if (target.startsWith('tel:') || target.startsWith('mailto:') || target.startsWith('http') || target.startsWith('/')) {
      window.location.href = target;
    } else {
      setIsModalOpen(true);
    }
  };

  // Parallax tracking
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

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // Scroll Progress
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrollY = window.scrollY;
        const heroHeight = heroRef.current.offsetHeight;
        const progress = Math.min(scrollY / (heroHeight * 0.5), 1);
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Autoplay carousel
  useEffect(() => {
    let interval: any;
    if (autoplay && !isHovering && filteredImages.length > 0) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % filteredImages.length);
      }, 6000);
    }
    return () => clearInterval(interval);
  }, [autoplay, isHovering, filteredImages.length]);

  useEffect(() => {
    setCurrentSlide(0);
  }, [activeFilter]);

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
          {/* Background Image with 3D Parallax */}
          <div className="absolute inset-0">
            <div
              className="relative w-full h-full will-change-transform scale-105"
              style={{
                transform: `translate3d(${mousePosition.x}px, ${mousePosition.y}px, 0)`
              }}
            >
              <Image
                src={heroBgImage}
                alt="Holiday Lighting Gallery"
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

          {/* Animated Glowing Orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 -left-4 w-96 h-96 bg-amber-600 rounded-full mix-blend-soft-light filter blur-3xl opacity-25 animate-blob-slow"></div>
            <div className="absolute top-0 -right-4 w-96 h-96 bg-red-600 rounded-full mix-blend-soft-light filter blur-3xl opacity-25 animate-blob-slow animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-96 h-96 bg-emerald-600 rounded-full mix-blend-soft-light filter blur-3xl opacity-20 animate-blob-slow animation-delay-4000"></div>
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
                <span className="text-white/90 text-sm font-semibold tracking-wider uppercase">{heroBadge}</span>
              </div>

              {/* Headline */}
              <h1 className="font-montserrat font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white mb-6 tracking-tight">
                <span className="block animate-title-slide-up">
                  {titlePrefix}{' '}
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
        {/* 2. GALLERY MARQUEES & FEATURED CAROUSEL */}
        {/* ========================================================================= */}
        <section className="py-8 sm:py-12 bg-white">
          <div className="container mx-auto px-4 max-w-7xl">
            {/* Top Marquee (Slides Right) */}
            <div
              className="relative mb-4 sm:mb-6"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <div className="overflow-hidden rounded-2xl bg-gray-50/50 p-1">
                <div className="flex gap-2.5 sm:gap-3.5 py-2 marquee-right">
                  {marqueeImages.map((image, index) => (
                    <div
                      key={`top-${index}`}
                      className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-xl overflow-hidden shadow-sm cursor-pointer group flex-shrink-0 hover:shadow-xl transition-all duration-300"
                      onClick={() => setSelectedImage(image)}
                    >
                      <Image
                        src={image.src}
                        alt={image.title || "Holiday Lighting Gallery"}
                        fill
                        sizes="(max-width: 640px) 128px, (max-width: 768px) 160px, 192px"
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-2.5">
                          <p className="text-white text-xs sm:text-sm font-bold truncate">{image.title}</p>
                          <p className="text-white/80 text-[10px] sm:text-xs truncate">{image.location}</p>
                        </div>
                      </div>
                      <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <FaExpand className="text-white text-[10px]" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Center Featured Carousel */}
            <div className="relative w-full max-w-4xl mx-auto my-4 sm:my-6 px-2 sm:px-4">
              <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900">
                {filteredImages.length > 0 && (
                  <div
                    className="relative w-full h-full cursor-pointer group"
                    onClick={() => setSelectedImage(filteredImages[currentSlide])}
                  >
                    <Image
                      src={filteredImages[currentSlide]?.src || "/images/portfolio/portfolio-1.jpg"}
                      alt={filteredImages[currentSlide]?.title || "Featured Holiday Display"}
                      fill
                      className="object-cover transition-all duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
                      priority
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                    {/* Slide Caption */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8">
                      <div className="inline-flex items-center gap-1.5 bg-amber-500/80 text-white text-xs px-2.5 py-0.5 rounded-full font-bold mb-2 uppercase">
                        <GiSparkles className="w-3.5 h-3.5" /> Featured Display
                      </div>
                      <h3 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-1">
                        {filteredImages[currentSlide]?.title}
                      </h3>
                      <p className="text-white/80 text-xs sm:text-sm md:text-base font-light">
                        {filteredImages[currentSlide]?.location}
                      </p>
                    </div>
                  </div>
                )}

                {/* Left Arrow */}
                <button
                  onClick={prevSlide}
                  className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 bg-black/50 hover:bg-black/75 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110 cursor-pointer shadow-lg"
                  aria-label="Previous Slide"
                >
                  <FaChevronLeft className="text-sm sm:text-base" />
                </button>

                {/* Right Arrow */}
                <button
                  onClick={nextSlide}
                  className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 bg-black/50 hover:bg-black/75 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110 cursor-pointer shadow-lg"
                  aria-label="Next Slide"
                >
                  <FaChevronRight className="text-sm sm:text-base" />
                </button>

                {/* Autoplay Play/Pause Toggle */}
                <button
                  onClick={() => setAutoplay(!autoplay)}
                  className="absolute top-3 sm:top-5 right-3 sm:right-5 w-9 h-9 sm:w-10 sm:h-10 bg-black/50 hover:bg-black/75 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110 cursor-pointer shadow-lg"
                  aria-label="Toggle Autoplay"
                >
                  {autoplay ? <FaPause className="text-xs sm:text-sm" /> : <FaPlay className="text-xs sm:text-sm" />}
                </button>

                {/* Slide Indicators */}
                <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 z-10">
                  {filteredImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`transition-all duration-300 cursor-pointer ${
                        index === currentSlide
                          ? 'w-6 sm:w-8 h-1.5 sm:h-2 bg-amber-400 rounded-full'
                          : 'w-2 sm:w-2.5 h-1.5 sm:h-2 bg-white/50 rounded-full hover:bg-white/80 hover:scale-110'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Marquee (Slides Left) */}
            <div
              className="relative mt-4 sm:mt-6"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <div className="overflow-hidden rounded-2xl bg-gray-50/50 p-1">
                <div className="flex gap-2.5 sm:gap-3.5 py-2 marquee-left">
                  {marqueeImages.map((image, index) => (
                    <div
                      key={`bottom-${index}`}
                      className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-xl overflow-hidden shadow-sm cursor-pointer group flex-shrink-0 hover:shadow-xl transition-all duration-300"
                      onClick={() => setSelectedImage(image)}
                    >
                      <Image
                        src={image.src}
                        alt={image.title || "Holiday Lighting Gallery"}
                        fill
                        sizes="(max-width: 640px) 128px, (max-width: 768px) 160px, 192px"
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-2.5">
                          <p className="text-white text-xs sm:text-sm font-bold truncate">{image.title}</p>
                          <p className="text-white/80 text-[10px] sm:text-xs truncate">{image.location}</p>
                        </div>
                      </div>
                      <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <FaExpand className="text-white text-[10px]" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. CALL TO ACTION BANNER */}
        {/* ========================================================================= */}
        <section className="sm:-mt-8 lg:-mt-12 sm:p-6 lg:p-12 bg-white">
          <CallToAction 
            customData={galleryData.ctaSection || galleryData.bottomCta} 
            onOpenConsultation={() => setIsModalOpen(true)} 
          />
        </section>

        {/* ========================================================================= */}
        {/* 4. LIGHTBOX MODAL */}
        {/* ========================================================================= */}
        {selectedImage && (
          <TouchSwipeLightbox
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            filteredImages={filteredImages}
          />
        )}

        {/* ========================================================================= */}
        {/* 5. CONSULTATION MODAL */}
        {/* ========================================================================= */}
        <ConsultationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />

        {/* CSS KEYFRAMES */}
        <style jsx global>{`
          @keyframes marqueeRight {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          
          @keyframes marqueeLeft {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0); }
          }
          
          .marquee-right {
            animation: marqueeRight 90s linear infinite;
            animation-play-state: running;
            width: fit-content;
            will-change: transform;
          }
          
          .marquee-left {
            animation: marqueeLeft 90s linear infinite;
            animation-play-state: running;
            width: fit-content;
            will-change: transform;
          }
          
          .marquee-right:hover,
          .marquee-left:hover {
            animation-play-state: paused;
          }
          
          @media (max-width: 640px) {
            .marquee-right {
              animation: marqueeRight 60s linear infinite;
            }
            
            .marquee-left {
              animation: marqueeLeft 60s linear infinite;
            }
          }
          
          @keyframes blob-slow {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(20px, -30px) scale(1.05); }
            66% { transform: translate(-15px, 15px) scale(0.95); }
            100% { transform: translate(0px, 0px) scale(1); }
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
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
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
            0% { opacity: 0; transform: translateY(40px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          
          .animate-title-slide-up {
            animation: title-slide-up 0.8s ease-out forwards;
            opacity: 0;
          }
          
          @keyframes gradient-x {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          
          .animate-gradient-x {
            background-size: 200% 200%;
            animation: gradient-x 3s ease infinite;
          }
          
          @keyframes fade-out {
            0% { opacity: 1; }
            70% { opacity: 1; }
            100% { opacity: 0; }
          }
          
          .animate-fade-out {
            animation: fade-out 3s ease-out forwards;
          }
          
          .will-change-transform {
            will-change: transform;
          }
          
          .break-words {
            word-break: break-word;
            overflow-wrap: break-word;
          }
        `}</style>
      </main>
    </>
  );
}