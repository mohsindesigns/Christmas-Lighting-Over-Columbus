"use client";

import React from "react";
import { FaPhoneAlt, FaCalendarAlt } from "react-icons/fa";
import { useContent } from "../hooks/useContent";

interface CTASectionProps {
  isVisible?: boolean;
  customData?: any;
}

const CTASection: React.FC<CTASectionProps> = ({ isVisible = true, customData }) => {
  const content = useContent();

  const ctaData = customData || content.howWeWork?.cta || content.whyChooseUs?.cta || {};
  const footerContact = content.footer?.contact || {};

  const title = ctaData.title || "Ready to Transform Your Home?";
  const rawDesc = ctaData.description || "Join local homeowners who trust us to make their holidays shine";
  const description = typeof rawDesc === "string" ? rawDesc.replace(/<[^>]*>?/gm, '') : "";

  const primaryText = ctaData.primaryButtonText || ctaData.buttons?.primary || "Call Us Now";
  const primaryLink = ctaData.primaryButtonLink || ctaData.buttons?.primaryLink || "";
  const secondaryText = ctaData.secondaryButtonText || ctaData.buttons?.secondary || "Schedule Free Consultation";
  const secondaryLink = ctaData.secondaryButtonLink || ctaData.buttons?.secondaryLink || "#quote";
  const phone = ctaData.phone || footerContact.phone || "(614) 301-7100";
  const phoneClean = phone.replace(/[^0-9+]/g, '');

  // The consultation popup was removed, so the secondary button only shows
  // when the admin has pointed it at a real page, phone or email link.
  const hasSecondaryLink = /^(https?:|\/|tel:|mailto:)/.test(secondaryLink);

  const handlePrimaryClick = () => {
    if (primaryLink && primaryLink !== '#quote' && !primaryLink.startsWith('tel:')) {
      if (primaryLink.startsWith('http') || primaryLink.startsWith('/') || primaryLink.startsWith('#')) {
        window.location.href = primaryLink;
        return;
      }
    }
    const targetTel = primaryLink && primaryLink.startsWith('tel:') ? primaryLink : `tel:${phoneClean.startsWith('+') ? phoneClean : '+1' + phoneClean.replace(/^1/, '')}`;
    window.location.href = targetTel;
  };

  const handleSecondaryClick = () => {
    window.location.href = secondaryLink;
  };

  return (
    <>
      {/* CTA Section - Exactly as provided */}
      <div
        className={`mt-8 xs:mt-10 sm:mt-12 md:mt-14 lg:mt-16 xl:mt-20 transition-all duration-700 delay-900 ${
          isVisible ? "animate-fadeInUp" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="bg-gradient-to-r from-emerald-50 via-amber-50 to-red-50 rounded-xl xs:rounded-2xl sm:rounded-3xl p-4 xs:p-5 sm:p-6 md:p-8 lg:p-10 text-center border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 group">
          <h3 className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 xs:mb-3 sm:mb-4 transition-all duration-300 group-hover:text-gray-800">
            {title}
          </h3>
          <p className="text-gray-600 text-xs xs:text-sm sm:text-base md:text-lg mb-4 xs:mb-5 sm:mb-6 max-w-2xl mx-auto leading-relaxed transition-all duration-300 group-hover:text-gray-700">
            {description}
          </p>

          <div className="flex flex-col sm:flex-row gap-2 xs:gap-3 justify-center">
            <button
              className="group/btn relative px-4 xs:px-5 sm:px-6 md:px-8 py-2.5 xs:py-3 sm:py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-lg xs:rounded-xl hover:shadow-lg transition-all duration-300 overflow-hidden w-full sm:w-auto text-center active:scale-95 cursor-pointer"
              aria-label={primaryText}
              onClick={handlePrimaryClick}
            >
              <span className="relative z-10 flex items-center justify-center gap-1.5 xs:gap-2">
                <FaPhoneAlt className="text-xs xs:text-sm" />
                <span className="text-xs xs:text-sm sm:text-base whitespace-nowrap">
                  {primaryText}
                </span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/15 to-white/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
            </button>

            {hasSecondaryLink && (
            <button
              className="px-4 xs:px-5 sm:px-6 md:px-8 py-2.5 xs:py-3 sm:py-3.5 font-semibold text-gray-700 hover:text-gray-900 border-2 border-gray-300 hover:border-gray-400 rounded-lg xs:rounded-xl transition-all duration-300 bg-white hover:bg-gray-50 w-full sm:w-auto text-center active:scale-95 cursor-pointer"
              aria-label={secondaryText}
              onClick={handleSecondaryClick}
            >
              <span className="flex items-center justify-center gap-1.5 xs:gap-2">
                <FaCalendarAlt className="text-xs xs:text-sm" />
                <span className="text-xs xs:text-sm sm:text-base whitespace-nowrap">
                  {secondaryText}
                </span>
              </span>
            </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CTASection;
