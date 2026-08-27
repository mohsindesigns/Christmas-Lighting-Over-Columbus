"use client";
import React, { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaHome,
  FaTree,
  FaCheckCircle,
  FaArrowRight,
  FaQuoteRight,
  FaMapMarkerAlt,
  FaUpload,
  FaImage
} from "react-icons/fa";
import { GiSparkles } from "react-icons/gi";
import { useContent } from "../hooks/useContent";

const defaultBenefits = [
  { text: "Custom Lighting Design & Layout" },
  { text: "Commercial-Grade LED Lights & Custom Wiring" },
  { text: "Professional Installation & Heavy-Duty Clips" },
  { text: "Proactive In-Season Maintenance (24h Guarantee)" },
  { text: "Timely Takedown in January" },
  { text: "Safe Climate-Controlled Storage Included" }
];

const ModernQuoteForm = () => {
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    budget: "",
    notes: "",
    colorPref: "",
    lightingAreas: {
      house: false,
      ground: false,
      trees: false,
      shrubs: false
    } as Record<string, boolean>
  });

  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const content = useContent();
  const quoteData: any = content?.quoteForm || content?.quote || content?.qaForm || content?.contact || {};

  const badge = quoteData.badge || quoteData.section?.badge || "Get A Fast Quote";
  const title = quoteData.title || quoteData.headline || quoteData.section?.headline || quoteData.section?.title || "Get Your Fast Quote";
  const subtitle = quoteData.subtitle || quoteData.description || quoteData.section?.description || "We are so excited to light up your property 🙂";
  const benefits = Array.isArray(quoteData.benefits) && quoteData.benefits.length > 0
    ? quoteData.benefits
    : defaultBenefits;
  const phone = quoteData.contactInfo?.phone || content?.footer?.contact?.phone || "(614) 301-7100";
  const email = quoteData.contactInfo?.email || content?.footer?.contact?.email || "Info@lightsovercolumbus.com";

  // Dynamic title renderer with gradient accent
  const renderTitle = () => {
    const rawTitle = title || "Get Your Fast Quote";

    if (typeof rawTitle === "object" && (rawTitle.prefix || rawTitle.highlight || rawTitle.suffix)) {
      return (
        <>
          {rawTitle.prefix}{" "}
          {rawTitle.highlight && (
            <span className="bg-gradient-to-r font-montserrat font-bold from-red-600 via-amber-500 to-emerald-600 bg-clip-text text-transparent">
              {rawTitle.highlight}
            </span>
          )}{" "}
          {rawTitle.suffix}
        </>
      );
    }

    if (typeof rawTitle === "string") {
      const words = rawTitle.trim().split(/\s+/);
      if (words.length <= 1) {
        return (
          <span className="bg-gradient-to-r font-montserrat font-bold from-red-600 via-amber-500 to-emerald-600 bg-clip-text text-transparent">
            {rawTitle}
          </span>
        );
      }
      if (words.length === 2) {
        return (
          <>
            {words[0]}{" "}
            <span className="bg-gradient-to-r font-montserrat font-bold from-red-600 via-amber-500 to-emerald-600 bg-clip-text text-transparent">
              {words[1]}
            </span>
          </>
        );
      }
      // 3 or more words: highlight the middle or second-to-last word
      const prefix = words.slice(0, words.length - 2).join(" ");
      const highlight = words[words.length - 2];
      const suffix = words[words.length - 1];
      return (
        <>
          {prefix ? `${prefix} ` : ""}
          <span className="bg-gradient-to-r font-montserrat font-bold from-red-600 via-amber-500 to-emerald-600 bg-clip-text text-transparent">
            {highlight}
          </span>{" "}
          {suffix}
        </>
      );
    }

    return rawTitle;
  };

  // Lighting areas with icons
  const lightingAreas = [
    {
      id: "house",
      label: "House",
      emoji: "🏠",
      color: "from-red-500 to-red-600"
    },
    {
      id: "ground",
      label: "Ground Lighting",
      emoji: "✨",
      color: "from-amber-500 to-amber-600"
    },
    {
      id: "trees",
      label: "Trees",
      emoji: "🌲",
      color: "from-green-500 to-green-600"
    },
    {
      id: "shrubs",
      label: "Shrubs / Bushes",
      emoji: "🌿",
      color: "from-emerald-500 to-emerald-600"
    }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle checkbox changes for lighting areas
  const handleAreaChange = (areaId: string) => {
    setFormData(prev => ({
      ...prev,
      lightingAreas: {
        ...prev.lightingAreas,
        [areaId]: !prev.lightingAreas[areaId]
      }
    }));
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
        // Reset form
        setFormData({
          fname: "",
          lname: "",
          email: "",
          phone: "",
          address: "",
          city: "",
          budget: "",
          notes: "",
          colorPref: "",
          lightingAreas: {
            house: false,
            ground: false,
            trees: false,
            shrubs: false
          }
        });
        setFiles([]);
        setTimeout(() => setIsSubmitted(false), 5000);
      } else {
        alert('There was an error submitting your request. Please try again.');
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert('There was a network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="freequote" className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-4 px-3 xs:p-4 sm:p-6 md:p-12 lg:py-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 xs:mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600/10 via-amber-500/10 to-red-600/10 rounded-full border border-amber-500/30 mb-4">
            <GiSparkles className="text-sm text-amber-500" />
            <span className="text-sm font-medium text-gray-800 uppercase">{badge}</span>
          </div>

          <h1 className="text-2xl font-montserrat xs:text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
            {renderTitle()}
          </h1>
          <p className="text-sm font-montserrat xs:text-base text-gray-600 max-w-2xl mx-auto px-2">
            {subtitle}
          </p>
        </div>

        {/* Success Message */}
        {isSubmitted && (
          <div className="mb-6 p-4 xs:p-5 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl shadow-sm animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 xs:w-12 xs:h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center">
                <FaCheckCircle className="text-white text-lg xs:text-xl" />
              </div>
              <div>
                <h3 className="text-base xs:text-lg font-bold text-emerald-800">
                  Quote Request Sent!
                </h3>
                <p className="text-emerald-600 text-sm">
                  We'll contact you within 24 hours with your custom quote.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6 xs:gap-8">
          {/* Form Section - Takes 2 columns */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl xs:rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              {/* Form Header */}
              <div className="p-4 xs:p-5 sm:p-6 bg-gradient-to-r from-red-600/5 via-amber-500/5 to-red-600/5 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 xs:w-12 xs:h-12 bg-gradient-to-r from-red-600 to-amber-500 rounded-lg flex items-center justify-center">
                    <FaQuoteRight className="text-white text-lg xs:text-xl" />
                  </div>
                  <div>
                    <h2 className="text-lg xs:text-xl font-bold text-gray-900">
                      Quote Details
                    </h2>
                    <p className="text-gray-600 text-xs xs:text-sm">
                      All fields marked * are required
                    </p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-4 xs:p-5 sm:p-6 space-y-5">
                {/* Name Row - First & Last */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1.5">
                      First Name *
                    </label>
                    <div className="relative group">
                      <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-amber-500 transition-colors text-sm" />
                      <input
                        type="text"
                        name="fname"
                        value={formData.fname}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-3 py-2.5 xs:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none transition text-sm xs:text-base text-gray-900 placeholder-gray-500"
                        placeholder="John"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1.5">
                      Last Name *
                    </label>
                    <div className="relative group">
                      <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-amber-500 transition-colors text-sm" />
                      <input
                        type="text"
                        name="lname"
                        value={formData.lname}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-3 py-2.5 xs:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none transition text-sm xs:text-base text-gray-900 placeholder-gray-500"
                        placeholder="Smith"
                      />
                    </div>
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1.5">
                      Email *
                    </label>
                    <div className="relative group">
                      <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-amber-500 transition-colors text-sm" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-3 py-2.5 xs:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none transition text-sm xs:text-base text-gray-900 placeholder-gray-500"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1.5">
                      Phone *
                    </label>
                    <div className="relative group">
                      <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-amber-500 transition-colors text-sm" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-3 py-2.5 xs:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none transition text-sm xs:text-base text-gray-900 placeholder-gray-500"
                        placeholder="(614) 301-7100"
                      />
                    </div>
                  </div>
                </div>

                {/* Address & City */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-gray-700 text-sm font-medium mb-1.5">
                      Address *
                    </label>
                    <div className="relative group">
                      <FaHome className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-amber-500 transition-colors text-sm" />
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-3 py-2.5 xs:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none transition text-sm xs:text-base text-gray-900 placeholder-gray-500"
                        placeholder="123 Main St"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1.5">
                      City *
                    </label>
                    <div className="relative group">
                      <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-amber-500 transition-colors text-sm" />
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-3 py-2.5 xs:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none transition text-sm xs:text-base text-gray-900 placeholder-gray-500"
                        placeholder="Columbus"
                      />
                    </div>
                  </div>
                </div>

                {/* Lighting Areas */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-3">
                    Select Areas To Be Lit Up
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {lightingAreas.map((area) => (
                      <div
                        key={area.id}
                        className={`relative group cursor-pointer transition-all duration-300`}
                        onClick={() => handleAreaChange(area.id)}
                      >
                        <div className={`p-3 sm:p-4 bg-gray-50 border-2 rounded-xl text-center transition-all duration-300 ${formData.lightingAreas[area.id]
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-gray-200 hover:border-amber-200'
                          }`}>
                          <div className={`text-2xl sm:text-3xl mb-2 ${formData.lightingAreas[area.id] ? 'scale-110 text-amber-600' : 'text-gray-600'
                            } transition-transform`}>
                            {area.emoji}
                          </div>
                          <p className="text-xs sm:text-sm text-gray-900 font-medium">
                            {area.label}
                          </p>
                          {formData.lightingAreas[area.id] && (
                            <div className="absolute top-1 right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
                              <FaCheckCircle className="text-white text-xs" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1.5">
                    Additional Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2.5 xs:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none transition text-sm xs:text-base resize-none text-gray-900 placeholder-gray-500"
                    placeholder="Please let us know any details you would like to share to help us create your quote..."
                  />
                </div>

                {/* Photo Upload Section */}
                <div>
                  <p className="text-gray-700 text-sm mb-2 bg-amber-50 p-2 rounded-lg">
                    For the quickest turn-around time, upload a front facing photo of your home below 🙂
                  </p>
                  <div className="relative">
                    <input
                      type="file"
                      id="file-upload"
                      onChange={handleFileChange}
                      multiple
                      accept="image/*"
                      className="hidden"
                    />
                    <label
                      htmlFor="file-upload"
                      className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-amber-500 hover:bg-amber-50/50 transition-all group"
                    >
                      <FaUpload className="text-gray-400 group-hover:text-amber-500 transition-colors" />
                      <span className="text-gray-900 text-sm">
                        {files.length > 0 ? `${files.length} file(s) selected` : 'Click to upload photos'}
                      </span>
                    </label>
                  </div>
                  {files.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {files.map((file, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs text-gray-900 bg-gray-50 p-2 rounded">
                          <FaImage className="text-amber-500" />
                          <span className="truncate flex-1">{file.name}</span>
                          <span className="text-gray-600">
                            {(file.size / 1024).toFixed(0)}KB
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-red-600 via-amber-500 to-red-600 hover:from-red-500 hover:via-amber-400 hover:to-red-500 text-white font-semibold rounded-lg py-3 xs:py-3.5 px-4 shadow-lg hover:shadow-xl active:scale-[0.98] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  <div className="relative flex items-center justify-center gap-2 xs:gap-3">
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 xs:w-5 xs:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span className="text-sm xs:text-base">
                          Processing...
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-sm xs:text-base font-bold">
                          Submit: Get My Lighting Quote
                        </span>
                        <FaArrowRight className="text-sm xs:text-base transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </div>
                </button>

                {/* Form Footer */}
                <p className="text-center text-gray-500 text-xs xs:text-sm pt-2">
                  By submitting, you agree to our Privacy Policy. No obligation, free quote.
                </p>
              </form>
            </div>
          </div>

          {/* Benefits Section - Takes 1 column */}
          <div className="hidden md:block space-y-6">

            {/* Benefits */}
            <div className="bg-white rounded-xl xs:rounded-2xl shadow-lg border border-gray-100 p-4 xs:p-5 sm:p-6">
              <h3 className="text-lg xs:text-xl font-bold text-gray-900 mb-4">
                What You Get
              </h3>
              <div className="space-y-3">
                {benefits.map((item: any, index: number) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 xs:w-6 xs:h-6 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 flex items-center justify-center flex-shrink-0">
                      <FaCheckCircle className="text-white text-xs" />
                    </div>
                    <span className="text-sm xs:text-base font-medium text-gray-900">
                      {item.text || item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-gradient-to-r from-red-600 to-amber-500 rounded-xl xs:rounded-2xl shadow-lg p-4 xs:p-5 sm:p-6 text-white">
              <h3 className="text-lg xs:text-xl font-bold text-white mb-3">
                Need Immediate Help?
              </h3>
              <div className="space-y-3">
                <a
                  href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                  className="flex items-center gap-3 hover:opacity-90 transition-opacity group"
                >
                  <div className="w-8 h-8 xs:w-10 xs:h-10 bg-white/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FaPhone className="text-sm xs:text-base text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-white/80">Call us 24/7</div>
                    <div className="text-base xs:text-lg font-bold text-white">
                      {phone}
                    </div>
                  </div>
                </a>
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-3 hover:opacity-90 transition-opacity group"
                >
                  <div className="w-8 h-8 xs:w-10 xs:h-10 bg-white/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FaEnvelope className="text-sm xs:text-base text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-white/80">Email us</div>
                    <div className="text-sm xs:text-base font-bold text-white break-all">
                      {email}
                    </div>
                  </div>
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernQuoteForm;
