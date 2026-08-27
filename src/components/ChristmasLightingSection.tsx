"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useContent } from "../hooks/useContent";

const ChristmasLightingSection = () => {
  const boxRef = useRef<HTMLElement>(null);
  const content = useContent();
  const aboutData = content.about;
  const heroData = content.hero;

  // Extract dynamic values with exact fallbacks
  const ownerImageSrc = aboutData?.image?.src || "/images/heroowner.jpg";
  const ownerImageAlt = aboutData?.image?.alt || "Owner - Christmas Lights Over Columbus";

  const headline = 
    aboutData?.headline?.highlight || 
    aboutData?.headline?.text || 
    aboutData?.title || 
    "Serving Columbus With Stress Free Holiday Lighting";

  const descriptionRaw = aboutData?.description || "";
  const paragraphs = descriptionRaw
    ? descriptionRaw.split("\n\n").filter(Boolean)
    : [
        "The holiday season is all about making memories, and nothing brings that magic to life like a beautifully lit home. At Christmas Lights Over Columbus, we take the stress out of decorating with professional Christmas lighting services designed just for you.",
        "From custom design and installation to maintenance, removal, and storage, we handle everything — so all you have to do is enjoy the season. Let us create a stunning display while you focus on what matters most.",
      ];

  const primaryCtaText = 
    aboutData?.buttons?.[0]?.text || 
    aboutData?.cta?.primaryText || 
    heroData?.cta?.subtext || 
    heroData?.cta?.text || 
    "Get My Free Quote";

  const primaryCtaLink = aboutData?.buttons?.[0]?.href || "#freequote";

  const secondaryCtaText = 
    aboutData?.buttons?.[1]?.text || 
    aboutData?.cta?.secondaryText || 
    "View Gallery";

  const secondaryCtaLink = aboutData?.buttons?.[1]?.href || "/gallery";

  const handlePrimaryClick = (e: React.MouseEvent) => {
    if (primaryCtaLink.startsWith("#")) {
      e.preventDefault();
      const targetId = primaryCtaLink.replace("#", "") || "freequote";
      const section = 
        document.getElementById(targetId) || 
        document.getElementById("freequote") || 
        document.getElementById("contact");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <section 
      ref={boxRef} 
      id="about"
      className="relative w-full overflow-hidden bg-white py-12 md:py-16 lg:py-20"
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        {/* TWO DIV LAYOUT */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 xl:gap-16 items-center">
          {/* LEFT DIV - TALL IMAGE for owner's vertical selfie */}
          <div className="w-full lg:w-1/2">
            <div className="relative">
              <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                <div className="relative pb-[100%] lg:pb-[110%]">
                  {ownerImageSrc.startsWith("http") || ownerImageSrc.startsWith("/uploads") || ownerImageSrc.startsWith("/cdn-images") ? (
                    <img
                      src={ownerImageSrc}
                      alt={ownerImageAlt}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <Image
                      src={ownerImageSrc}
                      alt={ownerImageAlt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority
                    />
                  )}
                  {/* Subtle overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                </div>

                {/* Decorative elements */}
                <div className="absolute -bottom-3 -right-3 w-20 h-20 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -top-3 -left-3 w-20 h-20 bg-rose-400/20 rounded-full blur-2xl pointer-events-none" />
              </div>
            </div>
          </div>

          {/* RIGHT DIV - ONLY Heading, Paragraph, Features, CTA */}
          <div className="w-full lg:w-1/2 space-y-4 md:space-y-8">
            {/* Heading */}
            <div className="space-y-2">
              <h2 className="text-left font-montserrat text-4xl md:text-5xl font-extrabold leading-tight">
                <span className="bg-gradient-to-r from-red-600 via-amber-500 to-emerald-600 bg-clip-text text-transparent">
                  {headline}
                </span>
              </h2>
            </div>

            {/* Paragraphs */}
            <div className="space-y-4">
              {paragraphs.map((p: string, idx: number) => (
                <p 
                  key={idx} 
                  className="text-base md:text-lg text-slate-700 leading-relaxed"
                >
                  {p.replace(/<[^>]*>?/gm, '')}
                </p>
              ))}
            </div>

            {/* CTA - Clean buttons */}
            <div className="space-y-4 pt-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={primaryCtaLink}
                  onClick={handlePrimaryClick}
                  className="relative overflow-hidden group inline-flex items-center justify-center px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 bg-gradient-to-r from-yellow-500 to-red-500 text-white font-semibold rounded-lg hover:from-yellow-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base md:text-lg w-auto min-w-[140px] sm:min-w-[160px] md:min-w-[180px] cursor-pointer"
                >
                  <span className="relative z-10 flex items-center justify-center gap-1.5 sm:gap-2">
                    <span>{primaryCtaText}</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-yellow-400 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
                </a>

                <Link
                  href={secondaryCtaLink}
                  className="px-8 py-3.5 sm:py-4 bg-white border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:border-amber-300 hover:bg-amber-50/50 transition-all duration-300 inline-flex items-center justify-center text-sm sm:text-base md:text-lg"
                >
                  {secondaryCtaText}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChristmasLightingSection;
