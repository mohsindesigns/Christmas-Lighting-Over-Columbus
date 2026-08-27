'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { HiOutlineSparkles } from 'react-icons/hi';
import Image from 'next/image';
import { useContent } from '../hooks/useContent';

const Hero = () => {
  const content = useContent();
  const heroData = content.hero;

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [treesReady, setTreesReady] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const leftTreeRef = useRef<HTMLDivElement>(null);
  const rightTreeRef = useRef<HTMLDivElement>(null);

  // Dynamic values with graceful fallbacks
  const titlePart1 = heroData?.title?.part1 || heroData?.headlines?.[0]?.text || "Illuminate Your";
  const titlePart2 = heroData?.title?.part2 || heroData?.headlines?.[1]?.text || "Holiday Season";
  const titlePart3 = heroData?.title?.part3 || heroData?.headlines?.[2]?.text || "With Custom Magic";
  const subtitle = heroData?.subtitle || heroData?.description || "Commercial & residential holiday lighting designed, installed, maintained, and stored for you.";
  const ctaText = heroData?.cta?.subtext || heroData?.cta?.text || heroData?.buttons?.[0]?.text || "Get My Free Quote";
  const ctaLink = heroData?.cta?.link || heroData?.buttons?.[0]?.href || "#freequote";
  const bgImage = heroData?.bgImage || "/images/hero-background2.jpg";
  const leftTreeSrc = heroData?.leftTreeImage || "/images/leftbottom.png";
  const rightTreeSrc = heroData?.rightTreeImage || "/images/rightbottom.png";

  // Mouse parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setMousePosition({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Check when tree refs are attached
  useEffect(() => {
    if (leftTreeRef.current && rightTreeRef.current) {
      setTreesReady(true);
    }
  }, []);

  // Working scroll animation for trees
  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;

      const rect = heroRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const progress = Math.max(0, Math.min(1, -rect.top / (windowHeight * 0.8)));

      const scale = 1 - (progress * 0.35);
      const leftX = -25 * progress;
      const rightX = 25 * progress;
      const opacity = 1 - (progress * 0.15);

      if (leftTreeRef.current) {
        leftTreeRef.current.style.transform = `scale(${scale}) translateX(${leftX}px)`;
        leftTreeRef.current.style.opacity = String(opacity);
      }

      if (rightTreeRef.current) {
        rightTreeRef.current.style.transform = `scale(${scale}) translateX(${rightX}px)`;
        rightTreeRef.current.style.opacity = String(opacity);
      }

      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [treesReady]);

  const handleCtaClick = (e: React.MouseEvent) => {
    if (ctaLink.startsWith('#')) {
      e.preventDefault();
      const targetId = ctaLink.replace('#', '') || 'freequote';
      const section = document.getElementById(targetId) || document.getElementById('contact') || document.getElementById('freequote');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16"
    >
      {/* Ultra-immersive background */}
      <div className="absolute inset-0 z-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0f1e] via-[#1a1f30] to-[#0a0f1e]"></div>

        {/* Background Image with subtle parallax */}
        <div
          className="absolute inset-0 transition-transform duration-200 ease-out"
          style={{
            transform: `translate(${mousePosition.x * 5}px, ${mousePosition.y * 5}px)`,
          }}
        >
          {bgImage.startsWith('http') || bgImage.startsWith('/uploads') || bgImage.startsWith('/cdn-images') ? (
            <img
              src={bgImage}
              alt="Luminous Holiday Lighting"
              className="w-full h-full object-cover object-center opacity-30"
            />
          ) : (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-30"
              style={{ backgroundImage: `url('${bgImage}')` }}
            />
          )}
        </div>

        {/* Animated gradient orbs */}
        <div className="absolute top-0 -left-4 w-48 sm:w-64 md:w-80 lg:w-96 h-48 sm:h-64 md:h-80 lg:h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-48 sm:w-64 md:w-80 lg:w-96 h-48 sm:h-64 md:h-80 lg:h-96 bg-yellow-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-48 sm:w-64 md:w-80 lg:w-96 h-48 sm:h-64 md:h-80 lg:h-96 bg-red-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

        {/* Particle grid */}
        <div className="absolute inset-0 opacity-20 sm:opacity-30 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: '30px 30px',
            }}
          ></div>
        </div>

        {/* Dynamic light streaks */}
        <div className="absolute inset-0 overflow-hidden hidden sm:block pointer-events-none">
          <div className="absolute top-0 left-1/4 w-0.5 h-full bg-gradient-to-b from-transparent via-yellow-400/20 to-transparent animate-scan"></div>
          <div className="absolute top-0 right-1/4 w-0.5 h-full bg-gradient-to-b from-transparent via-red-400/20 to-transparent animate-scan animation-delay-2000"></div>
        </div>
      </div>

      {/* Christmas Trees - Bottom Corners */}
      <div className="absolute bottom-0 left-0 z-40 pointer-events-none">
        <div
          ref={leftTreeRef}
          className="will-change-transform"
          style={{
            transformOrigin: 'bottom left',
            transform: 'scale(1) translateX(0px)',
            opacity: 1,
            transition: 'transform 0.1s ease-out, opacity 0.1s ease-out',
          }}
        >
          {leftTreeSrc.startsWith('http') || leftTreeSrc.startsWith('/uploads') || leftTreeSrc.startsWith('/cdn-images') ? (
            <img
              src={leftTreeSrc}
              alt="Christmas tree left"
              className="w-auto h-auto max-h-[180px] sm:max-h-[300px] md:max-h-[450px] lg:max-h-[600px] object-contain"
            />
          ) : (
            <Image
              src={leftTreeSrc}
              alt="Christmas tree left"
              width={200}
              height={300}
              className="w-auto h-auto max-h-[180px] sm:max-h-[300px] md:max-h-[450px] lg:max-h-[600px] object-contain"
              priority
            />
          )}
        </div>
      </div>

      <div className="absolute bottom-0 right-0 z-40 pointer-events-none">
        <div
          ref={rightTreeRef}
          className="will-change-transform"
          style={{
            transformOrigin: 'bottom right',
            transform: 'scale(1) translateX(0px)',
            opacity: 1,
            transition: 'transform 0.1s ease-out, opacity 0.1s ease-out',
          }}
        >
          {rightTreeSrc.startsWith('http') || rightTreeSrc.startsWith('/uploads') || rightTreeSrc.startsWith('/cdn-images') ? (
            <img
              src={rightTreeSrc}
              alt="Christmas tree right"
              className="w-auto h-auto max-h-[180px] sm:max-h-[300px] md:max-h-[450px] lg:max-h-[600px] object-contain"
            />
          ) : (
            <Image
              src={rightTreeSrc}
              alt="Christmas tree right"
              width={200}
              height={300}
              className="w-auto h-auto max-h-[180px] sm:max-h-[300px] md:max-h-[450px] lg:max-h-[600px] object-contain"
              priority
            />
          )}
        </div>
      </div>

      {/* Main Content */}
      <div
        ref={containerRef}
        className="container heroooo relative z-30 max-w-7xl mx-auto px-3 sm:px-4"
      >
        <div className="flex flex-col textdiv items-center justify-center text-center">

          {/* Main Title */}
          <h1 className="font-extrabold text-5xl xs:text-6xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-4 sm:mb-6 tracking-tight">
            <span className="block text-white/90 mb-1 sm:mb-2 animate-title-slide-up">
              {titlePart1}
            </span>
            <span className="block relative animate-title-slide-up animation-delay-200">
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-yellow-300 via-red-300 to-yellow-300 bg-clip-text text-transparent bg-[length:200%_200%] animate-gradient-x">
                  {titlePart2}
                </span> <br />
                <span className="relative z-10 bg-gradient-to-r from-yellow-300 via-red-300 to-yellow-300 bg-clip-text text-transparent bg-[length:200%_200%] animate-gradient-x">
                  {titlePart3}
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 to-red-400/30 blur-3xl -z-10 scale-150"></span>
              </span>
              <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 sm:w-20 md:w-24 h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></span>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/80 mb-6 sm:mb-8 md:mb-10 max-w-3xl mx-auto leading-relaxed px-2 sm:px-4 animate-fade-up animation-delay-400 group">
            <span className="relative inline-block">
              {subtitle}
              <span className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-red-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
            </span>
          </p>

          {/* CTA Button */}
          <div className="animate-fade-up animation-delay-800 w-full px-3 sm:px-0">
            <a
              href={ctaLink}
              onClick={handleCtaClick}
              className="relative overflow-hidden group inline-flex items-center justify-center px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 bg-gradient-to-r from-yellow-500 to-red-500 text-white font-semibold rounded-lg hover:from-yellow-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base md:text-lg w-auto min-w-[140px] sm:min-w-[160px] md:min-w-[180px] cursor-pointer"
            >
              <span className="relative z-10 flex items-center justify-center gap-1.5 sm:gap-2">
                <HiOutlineSparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                <span>{ctaText}</span>
                <FaArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-yellow-400 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
            </a>
          </div>

        </div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(16)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/25 rounded-full animate-float"
            style={{
              top: `${(i * 19) % 100}%`,
              left: `${(i * 23) % 100}%`,
              animationDelay: `${(i * 0.7) % 5}s`,
              animationDuration: `${6 + ((i * 1.3) % 6)}s`,
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
