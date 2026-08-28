"use client";

import React, { useState } from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaShieldAlt, FaClock } from "react-icons/fa";
import { HiOutlineSparkles } from "react-icons/hi";
import { useContent } from "@/hooks/useContent";

interface ChristmasLightingMapProps {
  iframeUrl?: string;
  title?: string;
  badge?: string;
  subtitle?: string;
}

export default function ChristmasLightingMap({
  iframeUrl,
  title,
  badge,
  subtitle
}: ChristmasLightingMapProps) {
  const content = useContent();
  const serviceAreaData = content?.serviceArea || content?.serviceAreas || {};
  const mapData = serviceAreaData?.map || {};

  const activeIframe = iframeUrl || mapData.iframeUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d195601.37890983802!2d-83.14925895742188!3d39.98295140000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x883889c1b990de71%3A0xe43266f8cfb8c521!2sColumbus%2C%20OH!5e0!3m2!1sen!2sus!4v1700000000000";
  const activeTitle = title || mapData.title || "Central Ohio Service Coverage";
  const activeBadge = badge || mapData.badge || "INTERACTIVE SERVICE MAP";
  const activeSubtitle = subtitle || mapData.description || "We proudly install, maintain, and remove holiday lighting displays throughout all of Franklin County and surrounding Central Ohio communities.";

  return (
    <div className="w-full bg-white py-8 sm:py-12 border-b border-gray-100">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-800 text-xs px-3 py-1 rounded-full font-bold uppercase mb-3">
            <HiOutlineSparkles className="w-3.5 h-3.5 text-amber-600" />
            {activeBadge}
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            {activeTitle}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            {activeSubtitle}
          </p>
        </div>

        {/* Map Container */}
        <div className="relative w-full h-[380px] sm:h-[450px] md:h-[500px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-slate-100">
          <iframe
            src={activeIframe}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Christmas Lights Over Columbus Service Area Map"
            className="w-full h-full"
          />

          {/* Floating Coverage Pill Badge */}
          <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-gray-200 hidden sm:flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 -ml-4"></span>
            <span className="text-xs font-bold text-gray-900">
              Active Installation Zone • 45-Mile Radius
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
