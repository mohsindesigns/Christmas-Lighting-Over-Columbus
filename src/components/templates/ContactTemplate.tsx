"use client";

import React, { useState, useCallback, memo } from "react";
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
  FaStar,
  FaClock,
  FaDollarSign,
  FaImage
} from "react-icons/fa";
import { GiSparkles } from "react-icons/gi";
import { useContent } from "@/hooks/useContent";

// Move ALL static data outside component
const DEFAULT_BUDGET_OPTIONS = [
  "What Is Your Lighting Budget",
  "$900 - $1200 (Standard Front Rooflines)",
  "$1200 - $1500",
  "$1500 - $2500",
  "$2500 - $4000",
  "$4000 and up",
  "Give me your best lighting design, money is not a factor."
];

const LIGHTING_AREAS = [
  { id: "house", label: "House", emoji: "🏠" },
  { id: "ground", label: "Ground Lighting", emoji: "✨" },
  { id: "trees", label: "Trees", emoji: "🌲" },
  { id: "shrubs", label: "Shrubs / Bushes", emoji: "🌿" }
];

const DEFAULT_BENEFITS = [
  "Free consultation & design",
  "Professional installation",
  "Commercial-grade LEDs",
  "Maintenance included",
  "Take-down & storage"
];

const INITIAL_FORM_STATE = {
  fname: "", lname: "", email: "", phone: "", address: "", city: "",
  budget: "", notes: "", lightingAreas: { house: false, ground: false, trees: false, shrubs: false } as Record<string, boolean>
};

// Pre-defined classNames for better performance
const INPUT_CLASSES = "w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none text-gray-900 placeholder-gray-500";
const LABEL_CLASSES = "block text-gray-700 text-sm font-medium mb-1.5";

export default function ContactTemplate({ pageData }: { pageData?: any }) {
  const content = useContent();
  const contactData = pageData?.content?.contactPage || content?.contactPage || {};

  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Dynamic CMS fields with defaults
  const badge = contactData.header?.badge || "Get A Fast Quote";
  const title = contactData.header?.headline || contactData.header?.title || "Contact Us For Your Fast Free Quote";
  const subtitle = contactData.header?.description || "We look forward to helping light up your property  🙂";
  const phone = contactData.info?.phone || content?.footer?.contact?.phone || "(614) 301-7100";
  const email = contactData.info?.email || content?.footer?.contact?.email || "Info@lightsovercolumbus.com";
  const benefits: string[] = Array.isArray(contactData.benefits) && contactData.benefits.length > 0
    ? contactData.benefits.map((b: any) => typeof b === 'string' ? b : (b.text || b.title))
    : DEFAULT_BENEFITS;
  const budgetOptions: string[] = Array.isArray(contactData.budgetOptions) && contactData.budgetOptions.length > 0
    ? contactData.budgetOptions
    : DEFAULT_BUDGET_OPTIONS;

  // Ultra-fast handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAreaChange = (areaId: string) => {
    setFormData(prev => ({
      ...prev,
      lightingAreas: { ...prev.lightingAreas, [areaId]: !prev.lightingAreas[areaId] }
    }));
  };

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
        setFormData(INITIAL_FORM_STATE);
        setFiles([]);
        setTimeout(() => setIsSubmitted(false), 4000);
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fileCount = files.length;
  const hasFiles = fileCount > 0;

  // Set page title
  React.useEffect(() => {
    document.title = 'Christmas Lighting Over Columbus | Contact';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Serving Columbus With Stress-Free Holiday Lighting');
    }
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-8 px-4 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Simple Header */}
        <div className="text-center mb-8 lg:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600/10 via-amber-500/10 to-red-600/10 rounded-full border border-amber-500/30 mb-4">
            <GiSparkles className="text-sm text-amber-500" />
            <span className="text-sm font-medium text-gray-800 uppercase">{badge}</span>
          </div>

          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            {title.includes("Fast Free") ? (
              <>
                Contact Us For Your{" "}
                <span className="bg-gradient-to-r from-red-600 via-amber-500 to-emerald-600 bg-clip-text text-transparent">
                  Fast Free
                </span>{" "}
                Quote
              </>
            ) : (
              title
            )}
          </h1>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Success Message */}
        {isSubmitted && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center gap-3">
              <FaCheckCircle className="text-green-600 text-lg flex-shrink-0" />
              <div>
                <h3 className="text-base font-bold text-green-800">Quote Request Sent!</h3>
                <p className="text-green-600 text-sm">We'll contact you within 24 hours.</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              {/* Form Header */}
              <div className="p-4 sm:p-6 bg-gradient-to-r from-red-600/5 via-amber-500/5 to-red-600/5 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-amber-500 rounded-lg flex items-center justify-center">
                    <FaQuoteRight className="text-white text-lg" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">Quote Details</h2>
                    <p className="text-gray-600 text-xs sm:text-sm">* Required fields</p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5">
                {/* Name Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField
                    label="First Name *"
                    name="fname"
                    value={formData.fname}
                    onChange={handleChange}
                    placeholder="John"
                    required
                  />
                  <InputField
                    label="Last Name *"
                    name="lname"
                    value={formData.lname}
                    onChange={handleChange}
                    placeholder="Smith"
                    required
                  />
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField
                    label="Email *"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Info@lightsovercolumbus.com"
                    required
                  />
                  <InputField
                    label="Phone *"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(614) 301-7100"
                    required
                  />
                </div>

                {/* Address & City */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <InputField
                      label="Address *"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="123 Main St"
                      required
                    />
                  </div>
                  <InputField
                    label="City *"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Columbus"
                    required
                  />
                </div>

                {/* Budget Select */}
                <div>
                  <label className={LABEL_CLASSES}>Budget Range *</label>
                  <div className="relative">
                    <FaDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm z-10" />
                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-8 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none appearance-none text-gray-900"
                    >
                      <option value="">Select your budget...</option>
                      {budgetOptions.map((option, index) => (
                        <option key={index} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Lighting Areas */}
                <div>
                  <label className={LABEL_CLASSES}>Select Areas To Be Lit Up</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {LIGHTING_AREAS.map((area) => (
                      <div
                        key={area.id}
                        onClick={() => handleAreaChange(area.id)}
                        className={`relative p-3 sm:p-4 bg-gray-50 border-2 rounded-xl text-center cursor-pointer transition-colors ${formData.lightingAreas[area.id]
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-gray-200 hover:border-amber-200'
                          }`}
                      >
                        <div className={`text-2xl sm:text-3xl mb-2 ${formData.lightingAreas[area.id] ? 'scale-110 text-amber-600' : 'text-gray-600'}`}>
                          {area.emoji}
                        </div>
                        <p className="text-xs sm:text-sm text-gray-900 font-medium">{area.label}</p>
                        {formData.lightingAreas[area.id] && (
                          <div className="absolute top-1 right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
                            <FaCheckCircle className="text-white text-xs" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Notes */}
                <div>
                  <label className={LABEL_CLASSES}>Additional Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none resize-none text-gray-900 placeholder-gray-500"
                    placeholder="Any details to help create your quote..."
                  />
                </div>

                {/* Photo Upload */}
                <div>
                  <p className="text-gray-700 text-sm mb-2 bg-amber-50 p-2 rounded-lg">
                    Upload a front-facing photo for faster quotes 🙂
                  </p>
                  <FileUpload
                    files={files}
                    onFileChange={handleFileChange}
                    hasFiles={hasFiles}
                    fileCount={fileCount}
                  />
                </div>

                {/* Submit Button */}
                <SubmitButton isSubmitting={isSubmitting} />

                <p className="text-center text-gray-500 text-xs sm:text-sm">
                  By submitting, you agree to our Privacy Policy.
                </p>
              </form>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="space-y-6">
            <BenefitsSection benefits={benefits} />
            <ContactInfo phone={phone} email={email} />
          </div>
        </div>
      </div>
    </main>
  );
}

// Simple Input Field
const InputField = memo(({ label, type = "text", ...props }: any) => (
  <div>
    <label className={LABEL_CLASSES}>{label}</label>
    <input
      type={type}
      className={INPUT_CLASSES}
      {...props}
    />
  </div>
));
InputField.displayName = 'InputField';

// FileUpload Component
const FileUpload = memo(({ files, onFileChange, hasFiles, fileCount }: any) => (
  <div>
    <input type="file" id="file-upload" onChange={onFileChange} multiple accept="image/*" className="hidden" />
    <label htmlFor="file-upload" className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-amber-500">
      <FaUpload className="text-gray-400" />
      <span className="text-gray-900 text-sm">
        {hasFiles ? `${fileCount} file(s) selected` : 'Click to upload photos'}
      </span>
    </label>
    {hasFiles && (
      <div className="mt-2 space-y-1">
        {files.map((file: File, index: number) => (
          <div key={index} className="flex items-center gap-2 text-xs text-gray-900 bg-gray-50 p-2 rounded">
            <FaImage className="text-amber-500 flex-shrink-0" />
            <span className="truncate">{file.name}</span>
            <span className="text-gray-600 flex-shrink-0">{(file.size / 1024).toFixed(0)}KB</span>
          </div>
        ))}
      </div>
    )}
  </div>
));
FileUpload.displayName = 'FileUpload';

// Submit Button
const SubmitButton = memo(({ isSubmitting }: { isSubmitting: boolean }) => (
  <button
    type="submit"
    disabled={isSubmitting}
    className="w-full bg-gradient-to-r from-red-600 via-amber-500 to-red-600 hover:from-red-500 hover:via-amber-400 hover:to-red-500 text-white font-semibold rounded-lg py-3.5 px-4 shadow-lg active:scale-[0.98] transition-all disabled:opacity-70 cursor-pointer"
  >
    <div className="flex items-center justify-center gap-2">
      {isSubmitting ? (
        <>
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          <span className="font-bold">Get My Lighting Quote</span>
          <FaArrowRight className="text-sm" />
        </>
      )}
    </div>
  </button>
));
SubmitButton.displayName = 'SubmitButton';

// Benefits Section
const BenefitsSection = memo(({ benefits }: { benefits: string[] }) => (
  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
    <h3 className="text-xl font-bold text-gray-900 mb-4">What You Get</h3>
    <div className="space-y-3">
      {benefits.map((text, index) => (
        <div key={index} className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 flex items-center justify-center flex-shrink-0">
            <FaCheckCircle className="text-white text-xs" />
          </div>
          <span className="text-sm font-medium text-gray-900">{text}</span>
        </div>
      ))}
    </div>
  </div>
));
BenefitsSection.displayName = 'BenefitsSection';

// Contact Info
const ContactInfo = memo(({ phone, email }: { phone: string; email: string }) => {
  const phoneClean = phone.replace(/[^0-9+]/g, '');

  return (
    <div className="bg-gradient-to-r from-red-600 to-amber-500 rounded-2xl shadow-lg p-6 text-white">
      <h3 className="text-xl font-bold text-white mb-3">Need Immediate Help?</h3>
      <div className="space-y-3">
        <a href={`tel:${phoneClean}`} className="flex items-center gap-3 hover:opacity-90">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <FaPhone className="text-sm text-white" />
          </div>
          <div>
            <div className="text-xs text-white/80">Call us 24/7</div>
            <div className="text-base font-bold text-white">{phone}</div>
          </div>
        </a>
        <a href={`mailto:${email}`} className="flex items-center gap-3 hover:opacity-90">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <FaEnvelope className="text-sm text-white" />
          </div>
          <div>
            <div className="text-xs text-white/80">Email us</div>
            <div className="text-sm font-bold text-white break-all">{email}</div>
          </div>
        </a>
      </div>
    </div>
  );
});
ContactInfo.displayName = 'ContactInfo';