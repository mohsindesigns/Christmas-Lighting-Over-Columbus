"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2, Type, Globe, CheckCircle, Search, HelpCircle,
  Plus, Trash2, ShieldCheck, Mail, Phone, MapPin, Award,
  Sparkles, DollarSign, Check, ListChecks, Megaphone, User, Image as ImageIcon,
  ArrowUp, ArrowDown, Grid, LayoutGrid, Layers, Eye, ExternalLink, RefreshCw
} from "lucide-react";
import ImageField from "@/components/admin/ImageField";
import { UI } from "./styles";

export default function ServicesEditor({ pageId, data, setData }: { pageId: string, data: any, setData: (d: any) => void }) {
  const [activeTab, setActiveTab] = useState("collection");
  const [availableMasterServices, setAvailableMasterServices] = useState<any[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Load master services from CMS
  useEffect(() => {
    const fetchServices = async () => {
      setLoadingServices(true);
      try {
        const res = await fetch("/api/content");
        const json = await res.json();
        const masterList = json?.services?.services || [];
        setAvailableMasterServices(masterList);
      } catch (err) {
        console.error("Failed to fetch master services:", err);
      } finally {
        setLoadingServices(false);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    if (!data.servicesPage && !data.services) {
      setData({
        ...data,
        servicesPage: {
          hero: {
            titlePrefix: "PREMIUM",
            titleHighlight: "CHRISTMAS LIGHTING",
            subtitle: "Transform your property with professional holiday lighting installations",
            bgImage: "/images/hero-background2.jpg",
            ctaText: "Get My Free Quote",
            phone: "(614) 301-7100",
            phoneLink: "tel:6143017100"
          },
          collectionTitle: "Our Lighting Collection",
          collectionSubtitle: "Professional holiday lighting solutions for every property",
          selectedServiceSlugs: [],
          items: [],
          cta: {
            title: "Ready to Transform Your Home Into a Holiday Wonderland?",
            description: "Join hundreds of satisfied Central Ohio families and businesses who trust us for stress-free lighting. Get your free quote today!",
            primaryButtonText: "Call Us: (614) 301-7100",
            secondaryButtonText: "Schedule Free Consultation"
          }
        }
      });
    }
  }, []);

  if (!data) return <div className="flex items-center justify-center h-64"><Loader2 className="w-5 h-5 text-[#2271b1] animate-spin" /></div>;

  const servicesPage = data.servicesPage || data.services || {};
  const hero = servicesPage.hero || {};
  const items: any[] = Array.isArray(servicesPage.items) ? servicesPage.items : [];
  const cta = servicesPage.cta || {};

  const masterList = availableMasterServices.length > 0
    ? availableMasterServices
    : (data?.services?.services || []);

  const updateHero = (field: string, value: any) => {
    setData({
      ...data,
      servicesPage: {
        ...servicesPage,
        hero: {
          ...(servicesPage.hero || {}),
          [field]: value
        }
      }
    });
  };

  const updateServicesPageField = (field: string, value: any) => {
    setData({
      ...data,
      servicesPage: {
        ...servicesPage,
        [field]: value
      }
    });
  };

  const updateCta = (field: string, value: any) => {
    setData({
      ...data,
      servicesPage: {
        ...servicesPage,
        cta: {
          ...(servicesPage.cta || {}),
          [field]: value
        }
      }
    });
  };

  // Helper to extract feature bullets from master service
  const extractFeatures = (master: any): string[] => {
    if (Array.isArray(master.features) && master.features.length > 0) {
      return master.features.map((f: any) =>
        typeof f === "string" ? f : (f?.title || f?.name || f?.text || f?.description || "")
      ).filter(Boolean);
    }
    if (Array.isArray(master.whyFeatures) && master.whyFeatures.length > 0) {
      return master.whyFeatures.map((f: any) => typeof f === "string" ? f : (f?.title || "")).filter(Boolean);
    }
    return [
      "Custom design & warrantied installation",
      "Maintenance, removal, and storage included"
    ];
  };

  // Select/Add master service to collection
  const handleSelectMasterService = (master: any) => {
    const slug = master.slug || master.id || master.title?.toLowerCase().replace(/\s+/g, "-");
    const existingIndex = items.findIndex((it: any) => it.slug === slug || it.serviceId === master.id || it.title === master.title);

    if (existingIndex >= 0) {
      // Already exists, toggle removal
      const updated = items.filter((_, i) => i !== existingIndex);
      updateServicesPageField("items", updated);
      return;
    }

    const nextNumber = String(items.length + 1).padStart(2, "0");
    const newItem = {
      serviceId: master.id || master._id || slug,
      slug: slug,
      number: master.number || nextNumber,
      title: master.title || "Lighting Service",
      color: master.color || (items.length === 0 ? "#10b981" : items.length === 1 ? "#f59e0b" : "#ef4444"),
      description: master.longDescription || master.description || "Professional lighting installation tailored to your property.",
      image: master.image || master.heroImage || "/images/gallery3.jpg",
      features: extractFeatures(master),
      link: `/services/${slug}`
    };

    updateServicesPageField("items", [...items, newItem]);
  };

  // Select all master services
  const handleSelectAllMasterServices = () => {
    const newItems = masterList.map((master: any, idx: number) => {
      const slug = master.slug || master.id || master.title?.toLowerCase().replace(/\s+/g, "-");
      return {
        serviceId: master.id || master._id || slug,
        slug: slug,
        number: master.number || String(idx + 1).padStart(2, "0"),
        title: master.title || "Lighting Service",
        color: master.color || (idx === 0 ? "#10b981" : idx === 1 ? "#f59e0b" : "#ef4444"),
        description: master.longDescription || master.description || "Professional lighting installation tailored to your property.",
        image: master.image || master.heroImage || "/images/gallery3.jpg",
        features: extractFeatures(master),
        link: `/services/${slug}`
      };
    });
    updateServicesPageField("items", newItems);
  };

  const handleUpdateItem = (index: number, field: string, value: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    updateServicesPageField("items", updated);
  };

  const handleDeleteItem = (index: number) => {
    const updated = items.filter((_, i) => i !== index);
    updateServicesPageField("items", updated);
  };

  const handleMoveItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    const updated = [...items];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    updateServicesPageField("items", updated);
  };

  const handleUpdateFeatures = (itemIndex: number, text: string) => {
    const featuresArray = text.split("\n").filter((f) => f.trim().length > 0);
    handleUpdateItem(itemIndex, "features", featuresArray);
  };

  const tabs = [
    { id: "hero", label: "Hero Header", icon: Type, title: "Hero Introduction" }, { id: "collection", label: "Lighting Collection (Services Sector)", icon: LayoutGrid, title: "Services Sector & Collection" },

    { id: "cta", label: "Call-To-Action Banner", icon: Megaphone, title: "Bottom CTA Banner" },
  ];

  const activeTabTitle = tabs.find(t => t.id === activeTab)?.title;

  const filteredMasterServices = masterList.filter((s: any) =>
    (s.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.description || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white">
      {/* WP Style Sub-tabs */}
      <div className="flex flex-wrap items-center gap-1 mb-6 text-[13px] border-b border-[#f0f0f1] pb-1">
        {tabs.map((tab: any, idx: number) => (
          <React.Fragment key={tab.id}>
            <button
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-1 py-1 transition-colors cursor-pointer ${activeTab === tab.id
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
            {/* TAB 1: LIGHTING COLLECTION (SERVICE SELECTOR & ALTERNATING CARDS) */}
            {/* ========================================================================= */}
            {activeTab === "collection" && (
              <div className="max-w-4xl space-y-6">
                {/* Section Header Controls */}
                <div className="p-4 bg-[#f9f9f9] border border-[#c3c4c7] rounded-sm space-y-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Collection Section Heading</label>
                    <input
                      type="text"
                      value={servicesPage.collectionTitle || "Our Lighting Collection"}
                      onChange={(e) => updateServicesPageField("collectionTitle", e.target.value)}
                      className="w-full border border-[#c3c4c7] px-3 py-1.5 text-xs font-bold rounded-[3px] focus:border-[#2271b1] outline-none bg-white"
                      placeholder="Our Lighting Collection"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Collection Subtitle</label>
                    <input
                      type="text"
                      value={servicesPage.collectionSubtitle || "Professional holiday lighting solutions for every property"}
                      onChange={(e) => updateServicesPageField("collectionSubtitle", e.target.value)}
                      className="w-full border border-[#c3c4c7] px-3 py-1.5 text-xs rounded-[3px] focus:border-[#2271b1] outline-none bg-white"
                      placeholder="Professional holiday lighting solutions for every property"
                    />
                  </div>
                </div>

                {/* 🌟 SERVICE SELECTOR PANEL */}
                <div className="border border-[#2271b1]/40 rounded-sm bg-blue-50/20 p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2271b1]/20 pb-3">
                    <div>
                      <h3 className="text-sm font-bold text-[#1d2327] flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-[#2271b1]" />
                        Select Services from Your Database
                      </h3>
                      <p className="text-xs text-[#646970]">
                        Click any service below to toggle it on this page. All title, image, description, and feature points will be pulled automatically!
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleSelectAllMasterServices}
                      className="text-xs bg-[#2271b1] text-white px-3 py-1.5 rounded-[3px] hover:bg-[#135e96] transition-colors cursor-pointer font-semibold flex items-center gap-1 self-start sm:self-auto"
                    >
                      <Check className="w-3.5 h-3.5" /> Select All Services ({masterList.length})
                    </button>
                  </div>

                  {/* Search box for services */}
                  {masterList.length > 3 && (
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search services..."
                        className="w-full pl-8 pr-3 py-1.5 text-xs border border-[#c3c4c7] rounded-[3px] bg-white outline-none focus:border-[#2271b1]"
                      />
                    </div>
                  )}

                  {/* Services Grid Selector */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                    {filteredMasterServices.map((master: any, idx: number) => {
                      const slug = master.slug || master.id || master.title?.toLowerCase().replace(/\s+/g, "-");
                      const isSelected = items.some((it: any) => it.slug === slug || it.serviceId === master.id || it.title === master.title);

                      return (
                        <div
                          key={master.id || slug || idx}
                          onClick={() => handleSelectMasterService(master)}
                          className={`p-3 rounded-sm border transition-all cursor-pointer flex flex-col justify-between ${isSelected
                            ? "bg-emerald-50 border-emerald-500 shadow-sm ring-1 ring-emerald-400/50"
                            : "bg-white border-[#c3c4c7] hover:border-[#2271b1] hover:bg-slate-50"
                            }`}
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold font-mono uppercase px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded">
                                {master.number || `0${idx + 1}`}
                              </span>
                              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${isSelected ? "bg-emerald-600 text-white font-bold" : "border border-slate-300"
                                }`}>
                                {isSelected && "✓"}
                              </span>
                            </div>

                            <h4 className="text-xs font-bold text-[#1d2327] line-clamp-1">
                              {master.title || "Untitled Service"}
                            </h4>

                            <p className="text-[11px] text-[#646970] line-clamp-2 leading-snug">
                              {master.description || master.longDescription || "No description provided."}
                            </p>
                          </div>

                          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-medium">
                            <span>{Array.isArray(master.features) ? `${master.features.length} points` : "Ready"}</span>
                            <span className={isSelected ? "text-emerald-700 font-bold" : "text-[#2271b1]"}>
                              {isSelected ? "Selected" : "+ Add to Page"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 📋 SELECTED SERVICES ON THIS PAGE */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between bg-[#f6f7f7] p-3 border border-[#c3c4c7] rounded-sm">
                    <div>
                      <h3 className="text-sm font-bold text-[#1d2327]">
                        Active Collection Services ({items.length} Selected)
                      </h3>
                      <p className="text-xs text-[#646970]">
                        These services will be displayed in the alternating layout on the Services page.
                      </p>
                    </div>
                  </div>

                  {items.length === 0 ? (
                    <div className="p-8 text-center bg-[#f9f9f9] border border-dashed border-[#c3c4c7] rounded-sm text-slate-500 text-xs">
                      No services selected yet. Click any service card in the selector above to add it!
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {items.map((item: any, idx: number) => (
                        <div key={idx} className="p-5 bg-white border border-[#c3c4c7] rounded-sm shadow-sm space-y-4">
                          <div className="flex items-center justify-between border-b border-[#f0f0f1] pb-2">
                            <div className="flex items-center gap-2">
                              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color || "#10b981" }}></span>
                              <span className="text-xs font-bold text-slate-800">
                                #{idx + 1}: {item.title || "Untitled Service"} ({item.number || `0${idx + 1}`})
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleMoveItem(idx, 'up')}
                                disabled={idx === 0}
                                className="p-1 text-gray-500 hover:text-black hover:bg-gray-100 rounded disabled:opacity-30 cursor-pointer"
                                title="Move Up"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleMoveItem(idx, 'down')}
                                disabled={idx === items.length - 1}
                                className="p-1 text-gray-500 hover:text-black hover:bg-gray-100 rounded disabled:opacity-30 cursor-pointer"
                                title="Move Down"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteItem(idx)}
                                className="p-1 text-red-500 hover:bg-red-50 rounded ml-1 cursor-pointer"
                                title="Remove from Collection"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Number Badge</label>
                              <input
                                type="text"
                                value={item.number || ""}
                                onChange={(e) => handleUpdateItem(idx, "number", e.target.value)}
                                className="w-full border border-[#c3c4c7] px-2.5 py-1.5 text-xs font-mono font-bold rounded-[3px] bg-white outline-none focus:border-[#2271b1]"
                                placeholder="01"
                              />
                            </div>

                            <div className="sm:col-span-2 space-y-1">
                              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Service Name</label>
                              <input
                                type="text"
                                value={item.title || ""}
                                onChange={(e) => handleUpdateItem(idx, "title", e.target.value)}
                                className="w-full border border-[#c3c4c7] px-2.5 py-1.5 text-xs font-bold rounded-[3px] focus:border-[#2271b1] outline-none bg-white"
                                placeholder="Residential Christmas Lighting"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Accent Dot Color</label>
                              <div className="flex items-center gap-1.5">
                                <input
                                  type="color"
                                  value={item.color || "#10b981"}
                                  onChange={(e) => handleUpdateItem(idx, "color", e.target.value)}
                                  className="w-7 h-7 rounded border border-[#c3c4c7] cursor-pointer p-0.5"
                                />
                                <input
                                  type="text"
                                  value={item.color || "#10b981"}
                                  onChange={(e) => handleUpdateItem(idx, "color", e.target.value)}
                                  className="w-full border border-[#c3c4c7] px-1.5 py-1 text-[11px] font-mono rounded-[3px] bg-white uppercase"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Description Narrative</label>
                            <textarea
                              rows={3}
                              value={item.description || ""}
                              onChange={(e) => handleUpdateItem(idx, "description", e.target.value)}
                              className="w-full border border-[#c3c4c7] px-2.5 py-1.5 text-xs rounded-[3px] focus:border-[#2271b1] outline-none bg-white"
                              placeholder="Coming home to a beautifully lit house makes the holidays even more special..."
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Detail Link (e.g. /services/residential-lighting)</label>
                            <input
                              type="text"
                              value={item.link || ""}
                              onChange={(e) => handleUpdateItem(idx, "link", e.target.value)}
                              className="w-full border border-[#c3c4c7] px-2.5 py-1.5 text-xs font-mono rounded-[3px] bg-white outline-none focus:border-[#2271b1]"
                              placeholder="/services/residential-lighting"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#f0f0f1]">
                            <ImageField
                              label="Service Showcase Image"
                              value={item.image || "/images/gallery3.jpg"}
                              onChange={(v) => handleUpdateItem(idx, "image", v)}
                            />

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                Feature Bullet Points (One per line)
                              </label>
                              <textarea
                                rows={4}
                                value={(item.features || []).join("\n")}
                                onChange={(e) => handleUpdateFeatures(idx, e.target.value)}
                                className="w-full border border-[#c3c4c7] px-2.5 py-1.5 text-xs rounded-[3px] bg-white outline-none focus:border-[#2271b1]"
                                placeholder="Custom roofline and gutter lighting&#10;Tree and shrub wrapping&#10;Full takedown and storage"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 2: HERO HEADER */}
            {/* ========================================================================= */}
            {activeTab === "hero" && (
              <div className="max-w-4xl space-y-6">
                <div className="bg-[#f9f9f9] border border-[#c3c4c7] p-4 rounded-sm space-y-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Main Headline (2-Part Animated Gradient)</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] text-slate-500 font-bold">Part 1 (White Intro)</label>
                        <input
                          type="text"
                          value={hero.titlePrefix || "PREMIUM"}
                          onChange={(e) => updateHero("titlePrefix", e.target.value)}
                          className="w-full border border-[#c3c4c7] px-3 py-1.5 text-xs font-bold rounded-[3px] focus:border-[#2271b1] outline-none bg-white uppercase"
                          placeholder="PREMIUM"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-emerald-700 font-bold">Part 2 (Gradient Highlight Line)</label>
                        <input
                          type="text"
                          value={hero.titleHighlight || "CHRISTMAS LIGHTING"}
                          onChange={(e) => updateHero("titleHighlight", e.target.value)}
                          className="w-full border border-[#c3c4c7] px-3 py-1.5 text-xs font-bold rounded-[3px] focus:border-[#2271b1] outline-none bg-emerald-50 text-emerald-900 uppercase"
                          placeholder="CHRISTMAS LIGHTING"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Subtitle Narrative</label>
                    <textarea
                      rows={3}
                      value={hero.subtitle || hero.description || ""}
                      onChange={(e) => updateHero("subtitle", e.target.value)}
                      className="w-full border border-[#c3c4c7] px-3 py-2 text-xs rounded-[3px] focus:border-[#2271b1] outline-none bg-white"
                      placeholder="Transform your property with professional holiday lighting installations"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#f0f0f1]">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-500 uppercase">Primary CTA Button</label>
                      <input
                        type="text"
                        value={hero.ctaText || "Get My Free Quote"}
                        onChange={(e) => updateHero("ctaText", e.target.value)}
                        className="w-full border border-[#c3c4c7] px-2.5 py-1.5 text-xs font-bold rounded-[3px] bg-white outline-none focus:border-[#2271b1]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-500 uppercase">Direct Phone Number</label>
                      <input
                        type="text"
                        value={hero.phone || "(614) 301-7100"}
                        onChange={(e) => updateHero("phone", e.target.value)}
                        className="w-full border border-[#c3c4c7] px-2.5 py-1.5 text-xs font-bold rounded-[3px] bg-white outline-none focus:border-[#2271b1]"
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#f0f0f1]">
                    <ImageField
                      label="Hero Background Image"
                      value={hero.bgImage || "/images/hero-background2.jpg"}
                      onChange={(v) => updateHero("bgImage", v)}
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
                      value={cta.title || "Ready to Transform Your Home Into a Holiday Wonderland?"}
                      onChange={(e) => updateCta("title", e.target.value)}
                      className="w-full border border-[#c3c4c7] px-3 py-2 text-xs font-bold rounded-[3px] focus:border-[#2271b1] outline-none bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Banner Description</label>
                    <input
                      type="text"
                      value={cta.description || "Join hundreds of satisfied Central Ohio families and businesses who trust us for stress-free lighting. Get your free quote today!"}
                      onChange={(e) => updateCta("description", e.target.value)}
                      className="w-full border border-[#c3c4c7] px-3 py-2 text-xs rounded-[3px] focus:border-[#2271b1] outline-none bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#f0f0f1]">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-500 uppercase">Primary Button Label</label>
                      <input
                        type="text"
                        value={cta.primaryButtonText || "Call Us: (614) 301-7100"}
                        onChange={(e) => updateCta("primaryButtonText", e.target.value)}
                        className="w-full border border-[#c3c4c7] px-3 py-1.5 text-xs font-bold rounded-[3px] bg-white outline-none focus:border-[#2271b1]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-500 uppercase">Secondary Button Label</label>
                      <input
                        type="text"
                        value={cta.secondaryButtonText || "Schedule Free Consultation"}
                        onChange={(e) => updateCta("secondaryButtonText", e.target.value)}
                        className="w-full border border-[#c3c4c7] px-3 py-1.5 text-xs font-bold rounded-[3px] bg-white outline-none focus:border-[#2271b1]"
                      />
                    </div>
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
