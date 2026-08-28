"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Type, Image as ImageIcon, Plus, Trash2, Loader2,
  ArrowUp, ArrowDown, Sparkles, MapPin, Tag, Megaphone,
  Phone, Link as LinkIcon
} from "lucide-react";
import React from "react";
import ImageField from "@/components/admin/ImageField";
import { UI } from "./styles";

const DEFAULT_GALLERY_IMAGES = [
  { id: "1", src: "/images/portfolio/portfolio-1.jpg", title: "Residential Roofline Display", location: "Upper Arlington, OH", category: "Residential" },
  { id: "2", src: "/images/portfolio/portfolio-2.jpg", title: "Commercial Plaza Lighting", location: "Downtown Columbus, OH", category: "Commercial" },
  { id: "3", src: "/images/portfolio/portfolio-3.jpg", title: "Tree & Shrub Wrapping", location: "Dublin, OH", category: "Residential" },
  { id: "4", src: "/images/portfolio/portfolio-4.jpg", title: "Custom Architectural Lighting", location: "New Albany, OH", category: "Residential" },
  { id: "5", src: "/images/portfolio/portfolio-5.jpg", title: "Warm White Gutter LEDs", location: "Westerville, OH", category: "Residential" },
  { id: "6", src: "/images/portfolio/portfolio1.png", title: "Estate Holiday Showcase", location: "Powell, OH", category: "Residential" },
  { id: "7", src: "/images/portfolio/portfolio2.jpg", title: "Vibrant Multi-Color Setup", location: "Bexley, OH", category: "Residential" },
  { id: "8", src: "/images/portfolio/portfolio3.jpg", title: "Courtyard & Walkway Lighting", location: "Grandview Heights, OH", category: "Residential" },
  { id: "9", src: "/images/portfolio/portfolio4.jpg", title: "Full Property Transformation", location: "Hilliard, OH", category: "Residential" },
  { id: "10", src: "/images/portfolio/portfolio5.jpg", title: "Peak & Dormer Lighting Detail", location: "Worthington, OH", category: "Residential" },
  { id: "11", src: "/images/portfolio/portfolio7.jpg", title: "Retail Center Holiday Lights", location: "Easton, OH", category: "Commercial" }
];

export default function GalleryEditor({ pageId, data, setData }: { pageId: string, data: any, setData: (d: any) => void }) {
  const [activeTab, setActiveTab] = useState("header");

  useEffect(() => {
    if (!data.galleryPage) {
      setData({
        ...data,
        galleryPage: {
          header: {
            badge: "OUR PORTFOLIO",
            titlePrefix: "HOLIDAY LIGHTING",
            titleHighlight: "GALLERY",
            description: "Explore our collection of stunning residential and commercial transformations",
            bgImage: "/images/portfolio/portfolio-1.jpg",
            ctaText: "Get My Free Quote",
            ctaLink: "#quote",
            phone: "(614) 301-7100"
          },
          images: DEFAULT_GALLERY_IMAGES,
          ctaSection: {
            title: "Ready to Create Your Own Masterpiece?",
            description: "Let our expert team transform your property into a breathtaking holiday destination.",
            primaryButtonText: "Call Us Now",
            secondaryButtonText: "Schedule Free Consultation",
            phone: "(614) 301-7100"
          }
        }
      });
    } else if (!data.galleryPage.images || data.galleryPage.images.length === 0) {
      // If legacy projects exist, convert them or fallback
      const initialImages = Array.isArray(data.galleryPage?.projects) && data.galleryPage.projects.length > 0
        ? data.galleryPage.projects.map((p: any, idx: number) => ({
            id: p.id || String(idx + 1),
            src: p.image || p.src || "/images/portfolio/portfolio-1.jpg",
            title: p.title || `Holiday Display #${idx + 1}`,
            location: p.location || p.category || "Columbus, OH",
            category: p.category || "Residential"
          }))
        : DEFAULT_GALLERY_IMAGES;

      setData({
        ...data,
        galleryPage: {
          ...data.galleryPage,
          images: initialImages
        }
      });
    }
  }, []);

  if (!data) return <div className="flex items-center justify-center h-64"><Loader2 className="w-5 h-5 text-[#2271b1] animate-spin" /></div>;

  const header = data.galleryPage?.header || {};
  const images: any[] = data.galleryPage?.images || DEFAULT_GALLERY_IMAGES;
  const ctaSection = data.galleryPage?.ctaSection || data.galleryPage?.bottomCta || {};

  const updateHeader = (field: string, value: any) => {
    setData({
      ...data,
      galleryPage: {
        ...(data.galleryPage || {}),
        header: {
          ...(data.galleryPage?.header || {}),
          [field]: value
        }
      }
    });
  };

  const updateImages = (newImages: any[]) => {
    setData({
      ...data,
      galleryPage: {
        ...(data.galleryPage || {}),
        images: newImages,
        galleryImages: newImages
      }
    });
  };

  const updateCtaSection = (field: string, value: any) => {
    setData({
      ...data,
      galleryPage: {
        ...(data.galleryPage || {}),
        ctaSection: {
          ...(data.galleryPage?.ctaSection || {}),
          [field]: value
        }
      }
    });
  };

  const handleAddImage = () => {
    const newImg = {
      id: Date.now().toString(),
      src: "/images/portfolio/portfolio-1.jpg",
      title: "New Holiday Lighting Display",
      location: "Columbus, OH",
      category: "Residential"
    };
    updateImages([newImg, ...images]);
  };

  const handleUpdateImage = (index: number, field: string, value: any) => {
    const updated = [...images];
    updated[index] = { ...updated[index], [field]: value };
    updateImages(updated);
  };

  const handleDeleteImage = (index: number) => {
    if (!confirm("Are you sure you want to remove this picture?")) return;
    const updated = images.filter((_, i) => i !== index);
    updateImages(updated);
  };

  const handleMoveImage = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;
    const updated = [...images];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    updateImages(updated);
  };

  const tabs = [
    { id: "header", label: "Hero Header & Introduction", icon: Type, title: "Hero Introduction" },
    { id: "images", label: "Gallery Pictures & Photos", icon: ImageIcon, title: "Manage Gallery Pictures" },
    { id: "cta", label: "Call-To-Action Banner", icon: Megaphone, title: "Bottom CTA Banner" },
  ];

  const activeTabTitle = tabs.find(t => t.id === activeTab)?.title;

  return (
    <div className="bg-white">
      {/* WP Style Sub-tabs */}
      <div className="flex flex-wrap items-center gap-1 mb-6 text-[13px] border-b border-[#f0f0f1] pb-1">
        {tabs.map((tab: any, idx: number) => (
          <React.Fragment key={tab.id}>
            <button 
              type="button"
              onClick={() => setActiveTab(tab.id)} 
              className={`px-1 py-1 transition-colors cursor-pointer ${
                activeTab === tab.id 
                  ? 'text-[#1d2327] font-bold border-b-2 border-[#2271b1]' 
                  : 'text-[#2271b1] hover:text-[#135e96]'
              }`}
            >
              {tab.label}
            </button>
            {idx < tabs.length - 1 && <span className="text-[#c3c4c7] px-1">|</span>}
          </React.Fragment>
        ))}
      </div>

      <div className="space-y-6">
        <div className="mb-4">
          <h2 className="text-base font-bold text-[#1d2327]">{activeTabTitle}</h2>
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab} 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="space-y-6"
          >
            {/* ========================================================================= */}
            {/* TAB 1: PICTURES / PHOTOS MANAGEMENT */}
            {/* ========================================================================= */}
            {activeTab === "images" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#f6f7f7] p-4 border border-[#c3c4c7] rounded-sm">
                  <div>
                    <h3 className="text-sm font-bold text-[#1d2327]">Gallery Pictures ({images.length} Photos)</h3>
                    <p className="text-xs text-[#646970] mt-0.5">
                      Add, upload, and organize photos for the top marquee, featured carousel, and bottom marquee.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="inline-flex items-center gap-1.5 bg-[#2271b1] text-white text-xs font-semibold px-4 py-2 rounded-[3px] hover:bg-[#135e96] transition-colors cursor-pointer shadow-sm self-start sm:self-auto"
                  >
                    <Plus className="w-4 h-4" />
                    Add Picture / Upload Photo
                  </button>
                </div>

                {/* Picture Cards List */}
                <div className="space-y-4">
                  {images.length === 0 ? (
                    <div className="p-8 text-center border border-dashed border-[#c3c4c7] bg-[#f9f9f9] rounded-sm text-sm text-[#646970]">
                      No pictures in gallery yet. Click <strong>"Add Picture / Upload Photo"</strong> above to get started.
                    </div>
                  ) : (
                    images.map((img: any, idx: number) => (
                      <div
                        key={img.id || idx}
                        className="p-4 bg-white border border-[#c3c4c7] rounded-sm shadow-sm hover:shadow-md transition-all space-y-3"
                      >
                        <div className="flex items-center justify-between border-b border-[#f0f0f1] pb-2">
                          <span className="text-xs font-bold text-slate-700 font-mono">Photo #{idx + 1}</span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleMoveImage(idx, 'up')}
                              disabled={idx === 0}
                              className="p-1 text-gray-500 hover:text-black hover:bg-gray-100 rounded disabled:opacity-30 cursor-pointer"
                              title="Move Up"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveImage(idx, 'down')}
                              disabled={idx === images.length - 1}
                              className="p-1 text-gray-500 hover:text-black hover:bg-gray-100 rounded disabled:opacity-30 cursor-pointer"
                              title="Move Down"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteImage(idx)}
                              className="p-1 text-red-500 hover:bg-red-50 rounded ml-2 cursor-pointer"
                              title="Delete Photo"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                          {/* Image Field */}
                          <div>
                            <ImageField
                              label="Picture Upload / URL"
                              value={img.src || img.image || ""}
                              onChange={(v) => handleUpdateImage(idx, "src", v)}
                            />
                          </div>

                          {/* Picture Metadata Inputs */}
                          <div className="md:col-span-2 space-y-3">
                            <div className="space-y-1">
                              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                Picture Title
                              </label>
                              <input
                                type="text"
                                value={img.title || ""}
                                onChange={(e) => handleUpdateImage(idx, "title", e.target.value)}
                                className="w-full border border-[#c3c4c7] px-3 py-1.5 text-xs font-semibold rounded-[3px] focus:border-[#2271b1] outline-none bg-white"
                                placeholder="e.g. Residential Roofline Display"
                              />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-slate-400" /> Location / Subtitle
                                </label>
                                <input
                                  type="text"
                                  value={img.location || ""}
                                  onChange={(e) => handleUpdateImage(idx, "location", e.target.value)}
                                  className="w-full border border-[#c3c4c7] px-3 py-1.5 text-xs rounded-[3px] focus:border-[#2271b1] outline-none bg-white"
                                  placeholder="e.g. Upper Arlington, OH"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                                  <Tag className="w-3 h-3 text-slate-400" /> Category Tag
                                </label>
                                <input
                                  type="text"
                                  value={img.category || "Residential"}
                                  onChange={(e) => handleUpdateImage(idx, "category", e.target.value)}
                                  className="w-full border border-[#c3c4c7] px-3 py-1.5 text-xs rounded-[3px] focus:border-[#2271b1] outline-none bg-white uppercase"
                                  placeholder="Residential / Commercial"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 2: HERO HEADER & INTRO */}
            {/* ========================================================================= */}
            {activeTab === "header" && (
              <div className="max-w-4xl space-y-6">
                <div className="bg-[#f9f9f9] border border-[#c3c4c7] p-4 rounded-sm space-y-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Pill Badge</label>
                    <input
                      type="text"
                      value={header.badge || "OUR PORTFOLIO"}
                      onChange={(e) => updateHeader("badge", e.target.value)}
                      className="w-full border border-[#c3c4c7] px-3 py-2 text-xs font-semibold rounded-[3px] focus:border-[#2271b1] outline-none bg-white uppercase"
                      placeholder="OUR PORTFOLIO"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Main Headline (2-Part Animated Gradient)</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] text-slate-500 font-bold">Part 1 (White Intro)</label>
                        <input
                          type="text"
                          value={header.titlePrefix || header.titlePart1 || "HOLIDAY LIGHTING"}
                          onChange={(e) => updateHeader("titlePrefix", e.target.value)}
                          className="w-full border border-[#c3c4c7] px-3 py-1.5 text-xs font-bold rounded-[3px] focus:border-[#2271b1] outline-none bg-white uppercase"
                          placeholder="HOLIDAY LIGHTING"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-[#2271b1] font-bold">Part 2 (Gold/Red Highlighted Line)</label>
                        <input
                          type="text"
                          value={header.titleHighlight || header.titlePart2 || "GALLERY"}
                          onChange={(e) => updateHeader("titleHighlight", e.target.value)}
                          className="w-full border border-[#c3c4c7] px-3 py-1.5 text-xs font-bold rounded-[3px] focus:border-[#2271b1] outline-none bg-amber-50 text-amber-900 uppercase"
                          placeholder="GALLERY"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Intro Subtitle Narrative</label>
                    <textarea
                      rows={3}
                      value={header.description || ""}
                      onChange={(e) => updateHeader("description", e.target.value)}
                      className="w-full border border-[#c3c4c7] px-3 py-2 text-xs rounded-[3px] focus:border-[#2271b1] outline-none bg-white"
                      placeholder="Explore our collection of stunning residential and commercial transformations"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#f0f0f1]">
                    {/* Primary Button */}
                    <div className="space-y-2 p-3 bg-white border border-[#c3c4c7] rounded-sm">
                      <span className="text-[11px] font-bold text-emerald-700 uppercase">Primary CTA Button</span>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500">Button Text</label>
                        <input
                          type="text"
                          value={header.ctaText || "Get My Free Quote"}
                          onChange={(e) => updateHeader("ctaText", e.target.value)}
                          className="w-full border border-[#c3c4c7] px-2.5 py-1 text-xs font-bold rounded-[3px] bg-white outline-none focus:border-[#2271b1]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500">Target Link</label>
                        <input
                          type="text"
                          value={header.ctaLink || "#quote"}
                          onChange={(e) => updateHeader("ctaLink", e.target.value)}
                          className="w-full border border-[#c3c4c7] px-2.5 py-1 text-xs font-mono rounded-[3px] bg-white outline-none focus:border-[#2271b1]"
                          placeholder="#quote or /services"
                        />
                      </div>
                      <p className="text-[10px] text-[#646970]">
                        💡 Tip: Enter <code className="text-[#2271b1] font-mono font-bold">#quote</code> to open the Quick Quote modal on click.
                      </p>
                    </div>

                    {/* Phone Button */}
                    <div className="space-y-2 p-3 bg-white border border-[#c3c4c7] rounded-sm">
                      <span className="text-[11px] font-bold text-amber-700 uppercase">Phone Button</span>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500">Phone Label</label>
                        <input
                          type="text"
                          value={header.phone || "(614) 301-7100"}
                          onChange={(e) => updateHeader("phone", e.target.value)}
                          className="w-full border border-[#c3c4c7] px-2.5 py-1 text-xs font-bold rounded-[3px] bg-white outline-none focus:border-[#2271b1]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500">Phone Link (tel:)</label>
                        <input
                          type="text"
                          value={header.phoneLink || "tel:6143017100"}
                          onChange={(e) => updateHeader("phoneLink", e.target.value)}
                          className="w-full border border-[#c3c4c7] px-2.5 py-1 text-xs font-mono rounded-[3px] bg-white outline-none focus:border-[#2271b1]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#f0f0f1]">
                    <ImageField
                      label="Hero Background Image"
                      value={header.bgImage || header.heroImage || ""}
                      onChange={(v) => updateHeader("bgImage", v)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 3: CTA BANNER */}
            {/* ========================================================================= */}
            {activeTab === "cta" && (
              <div className="max-w-4xl space-y-6">
                <div className="bg-[#f9f9f9] border border-[#c3c4c7] p-4 rounded-sm space-y-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Banner Headline</label>
                    <input
                      type="text"
                      value={ctaSection.title || "Ready to Create Your Own Masterpiece?"}
                      onChange={(e) => updateCtaSection("title", e.target.value)}
                      className="w-full border border-[#c3c4c7] px-3 py-2 text-xs font-bold rounded-[3px] focus:border-[#2271b1] outline-none bg-white"
                      placeholder="Ready to Create Your Own Masterpiece?"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Banner Description</label>
                    <input
                      type="text"
                      value={ctaSection.description || "Let our expert team transform your property into a breathtaking holiday destination."}
                      onChange={(e) => updateCtaSection("description", e.target.value)}
                      className="w-full border border-[#c3c4c7] px-3 py-2 text-xs rounded-[3px] focus:border-[#2271b1] outline-none bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#f0f0f1]">
                    {/* Primary Button */}
                    <div className="space-y-2 p-3 bg-white border border-[#c3c4c7] rounded-sm">
                      <span className="text-[11px] font-bold text-emerald-700 uppercase">Primary Button (Call)</span>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Button Text</label>
                        <input
                          type="text"
                          value={ctaSection.primaryButtonText || "Call Us Now"}
                          onChange={(e) => updateCtaSection("primaryButtonText", e.target.value)}
                          className="w-full border border-[#c3c4c7] px-2.5 py-1.5 text-xs font-bold rounded-[3px] bg-white outline-none focus:border-[#2271b1]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Button Link / Action</label>
                        <input
                          type="text"
                          value={ctaSection.primaryButtonLink || "tel:6143017100"}
                          onChange={(e) => updateCtaSection("primaryButtonLink", e.target.value)}
                          className="w-full border border-[#c3c4c7] px-2.5 py-1.5 text-xs font-mono rounded-[3px] bg-white outline-none focus:border-[#2271b1]"
                          placeholder="tel:6143017100"
                        />
                      </div>
                    </div>

                    {/* Secondary Button */}
                    <div className="space-y-2 p-3 bg-white border border-[#c3c4c7] rounded-sm">
                      <span className="text-[11px] font-bold text-[#2271b1] uppercase">Secondary Button (Modal)</span>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Button Text</label>
                        <input
                          type="text"
                          value={ctaSection.secondaryButtonText || "Schedule Free Consultation"}
                          onChange={(e) => updateCtaSection("secondaryButtonText", e.target.value)}
                          className="w-full border border-[#c3c4c7] px-2.5 py-1.5 text-xs font-bold rounded-[3px] bg-white outline-none focus:border-[#2271b1]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Target Link</label>
                        <input
                          type="text"
                          value={ctaSection.secondaryButtonLink || "#quote"}
                          onChange={(e) => updateCtaSection("secondaryButtonLink", e.target.value)}
                          className="w-full border border-[#c3c4c7] px-2.5 py-1.5 text-xs font-mono rounded-[3px] bg-white outline-none focus:border-[#2271b1]"
                          placeholder="#quote"
                        />
                      </div>
                      <p className="text-[10px] text-[#646970]">
                        💡 Tip: Enter <code className="text-[#2271b1] font-mono font-bold">#quote</code> to open the consultation modal on click.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Phone Number</label>
                    <input
                      type="text"
                      value={ctaSection.phone || "(614) 301-7100"}
                      onChange={(e) => updateCtaSection("phone", e.target.value)}
                      className="w-full border border-[#c3c4c7] px-3 py-1.5 text-xs rounded-[3px] bg-white outline-none focus:border-[#2271b1]"
                    />
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
