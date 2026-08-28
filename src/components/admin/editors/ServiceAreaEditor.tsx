"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2, Type, Globe, CheckCircle, Search, HelpCircle,
  Plus, Trash2, ShieldCheck, Mail, Map, MapPin, BarChart3, Settings, ClipboardList,
  Layers, Star, ShieldAlert, Wrench, Home, Building2, Building, Droplets, Award, Clock,
  ArrowUp, ArrowDown, Megaphone, Phone, Tag, Car, Truck
} from "lucide-react";
import {
  FaCity, FaBuilding, FaMapMarkerAlt, FaHome, FaTree, FaRoad, FaCheckCircle, FaStar,
  FaClock, FaCar, FaShieldAlt
} from "react-icons/fa";
import ImageField from "@/components/admin/ImageField";
import { UI } from "./styles";

const AVAILABLE_COMMUNITY_ICONS = [
  { value: "FaCity", label: "🏙️ City / Metro", icon: FaCity },
  { value: "FaBuilding", label: "🏢 Commercial / Building", icon: FaBuilding },
  { value: "FaMapMarkerAlt", label: "📍 Map Marker Pin", icon: FaMapMarkerAlt },
  { value: "FaHome", label: "🏠 Residential / Home", icon: FaHome },
  { value: "FaTree", label: "🌲 Suburban / Trees", icon: FaTree },
  { value: "FaRoad", label: "🛣️ Parkway / Highway", icon: FaRoad },
  { value: "FaCheckCircle", label: "✅ Verified Area", icon: FaCheckCircle },
  { value: "FaStar", label: "⭐ Priority Area", icon: FaStar },
];

const AVAILABLE_STEP_ICONS = [
  { value: "FaMapMarkerAlt", label: "📍 Map Marker (Locations)", icon: FaMapMarkerAlt },
  { value: "FaClock", label: "⏰ Clock (24/7 Availability)", icon: FaClock },
  { value: "FaCar", label: "🚗 Service Van (Fast Response)", icon: FaCar },
  { value: "FaStar", label: "⭐ 5-Star Quality", icon: FaStar },
  { value: "FaShieldAlt", label: "🛡️ Season Warranty", icon: FaShieldAlt },
  { value: "FaCheckCircle", label: "✅ Guaranteed Service", icon: FaCheckCircle },
];

const DEFAULT_COMMUNITIES = [
  { id: "1", city: "Columbus, OH", icon: "FaCity" },
  { id: "2", city: "Dublin, OH", icon: "FaCity" },
  { id: "3", city: "Delaware, OH", icon: "FaCity" },
  { id: "4", city: "Marysville, OH", icon: "FaCity" },
  { id: "5", city: "Powell, OH", icon: "FaCity" },
  { id: "6", city: "Westerville, OH", icon: "FaCity" },
  { id: "7", city: "New Albany, OH", icon: "FaCity" },
  { id: "8", city: "Johnstown, OH", icon: "FaCity" },
  { id: "9", city: "Sunbury, OH", icon: "FaCity" },
  { id: "10", city: "Pataskala, OH", icon: "FaCity" },
  { id: "11", city: "Granville, OH", icon: "FaCity" },
  { id: "12", city: "Newark, OH", icon: "FaCity" },
  { id: "13", city: "Pickerington, OH", icon: "FaCity" },
  { id: "14", city: "Canal Winchester, OH", icon: "FaCity" },
  { id: "15", city: "Carroll, OH", icon: "FaCity" },
  { id: "16", city: "Groveport, OH", icon: "FaCity" },
  { id: "17", city: "Lockbourne, OH", icon: "FaCity" },
  { id: "18", city: "Asheville, OH", icon: "FaCity" },
  { id: "19", city: "Circleville, OH", icon: "FaCity" },
  { id: "20", city: "Gahanna, OH", icon: "FaCity" },
  { id: "21", city: "Grove City, OH", icon: "FaCity" },
  { id: "22", city: "Blacklick, OH", icon: "FaCity" },
  { id: "23", city: "Hilliard, OH", icon: "FaCity" },
  { id: "24", city: "Lancaster, OH", icon: "FaCity" },
  { id: "25", city: "Upper Arlington, OH", icon: "FaCity" },
  { id: "26", city: "Lewis Center, OH", icon: "FaCity" },
];

const DEFAULT_STEPS = [
  {
    number: "01",
    title: "Multiple Locations",
    description: "With strategically located stores across the region, we deliver premium service right at your doorstep—fast, reliable, and professional.",
    icon: "FaMapMarkerAlt",
    color: "#EF4444",
    features: ["4+ store locations", "Local service teams", "Fast response times"]
  },
  {
    number: "02",
    title: "24/7 Availability",
    description: "Our dedicated team is available around the clock to handle your Christmas lighting needs, ensuring timely service whenever you need it.",
    icon: "FaClock",
    color: "#F59E0B",
    features: ["Always available", "Emergency services", "Flexible scheduling"]
  },
  {
    number: "03",
    title: "Fast Response",
    description: "We pride ourselves on quick response times with an average of 30 minutes from inquiry to on-site assessment for your lighting project.",
    icon: "FaCar",
    color: "#10B981",
    features: ["30min avg response", "Quick assessments", "Rapid installation"]
  }
];

export default function ServiceAreaEditor({ pageId, data, setData }: { pageId: string, data: any, setData: (d: any) => void }) {
  const [activeTab, setActiveTab] = useState("header");

  useEffect(() => {
    if (!data.serviceArea) {
      setData({
        ...data,
        serviceArea: {
          header: {
            badge: "OUR SERVICE AREA",
            titlePrefix: "CENTRAL OHIO",
            titleHighlight: "SERVICE AREA",
            description: "Proudly serving Columbus and surrounding communities with premium holiday lighting services",
            bgImage: "/images/hero-background2.jpg",
            ctaText: "Get My Free Quote",
            ctaLink: "#quote",
            phone: "(614) 301-7100",
            phoneLink: "tel:6143017100"
          },
          communitiesTitle: "Communities We Serve",
          communitiesSubtitle: "From bustling city centers to quiet suburban neighborhoods, we bring holiday cheer to homes and businesses throughout Central Ohio.",
          communities: DEFAULT_COMMUNITIES,
          ctaSection: {
            title: "Ready to Transform Your Property?",
            description: "Contact our Central Ohio holiday lighting experts today for a custom design and free estimate.",
            primaryButtonText: "Call Us Now",
            secondaryButtonText: "Schedule Free Consultation",
            phone: "(614) 301-7100"
          }
        },
        serviceAreas: data.serviceAreas || {
          title: "Areas We Are Serving",
          subtitle: "Custom lighting installed by professionals.",
          mapImage: "/images/realmap.jpeg",
          vehicleImage: "/images/car2.png",
          steps: DEFAULT_STEPS
        }
      });
    } else if (!data.serviceArea.communities || data.serviceArea.communities.length === 0) {
      setData({
        ...data,
        serviceArea: {
          ...data.serviceArea,
          communities: DEFAULT_COMMUNITIES
        }
      });
    }
  }, []);

  if (!data) return <div className="flex items-center justify-center h-64"><Loader2 className="w-5 h-5 text-[#2271b1] animate-spin" /></div>;

  const serviceArea = data.serviceArea || {};
  const header = serviceArea.header || {};
  const serviceAreasData = data.serviceAreas || {};
  const communities: any[] = serviceArea.communities || DEFAULT_COMMUNITIES;
  const steps: any[] = serviceAreasData.steps || DEFAULT_STEPS;
  const ctaSection = serviceArea.ctaSection || serviceArea.bottomCta || {};

  const updateHeader = (field: string, value: any) => {
    setData({
      ...data,
      serviceArea: {
        ...serviceArea,
        header: {
          ...(serviceArea.header || {}),
          [field]: value
        }
      }
    });
  };

  const updateServiceAreasSection = (field: string, value: any) => {
    setData({
      ...data,
      serviceAreas: {
        ...(data.serviceAreas || {}),
        [field]: value
      }
    });
  };

  const updateCommunities = (newCommunities: any[]) => {
    setData({
      ...data,
      serviceArea: {
        ...serviceArea,
        communities: newCommunities,
        locations: newCommunities
      }
    });
  };

  const updateCtaSection = (field: string, value: any) => {
    setData({
      ...data,
      serviceArea: {
        ...serviceArea,
        ctaSection: {
          ...(serviceArea.ctaSection || {}),
          [field]: value
        }
      }
    });
  };

  const handleAddCommunity = () => {
    const newComm = {
      id: Date.now().toString(),
      city: "New Area, OH",
      icon: "FaCity"
    };
    updateCommunities([...communities, newComm]);
  };

  const handleUpdateCommunity = (index: number, field: string, value: any) => {
    const updated = [...communities];
    updated[index] = { ...updated[index], [field]: value };
    updateCommunities(updated);
  };

  const handleDeleteCommunity = (index: number) => {
    if (!confirm("Are you sure you want to remove this community?")) return;
    const updated = communities.filter((_, i) => i !== index);
    updateCommunities(updated);
  };

  const handleMoveCommunity = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= communities.length) return;
    const updated = [...communities];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    updateCommunities(updated);
  };

  const tabs = [
    { id: "header", label: "Hero Header & Intro", icon: Type, title: "Hero Introduction" },
    { id: "vanMap", label: "Van & Map Section (VanMap)", icon: Truck, title: "Van & Real Map Section" },
    { id: "communities", label: "Communities We Serve", icon: MapPin, title: "Manage Service Locations" },
    { id: "cta", label: "Call-To-Action Banner", icon: Megaphone, title: "Bottom CTA Banner" },
  ];

  const activeTabTitle = tabs.find(t => t.id === activeTab)?.title;

  const renderIconPreview = (iconValue: string) => {
    const match = AVAILABLE_COMMUNITY_ICONS.find(i => i.value === iconValue);
    if (match) {
      const IconComp = match.icon;
      return <IconComp className="w-4 h-4 text-amber-500" />;
    }
    return <FaCity className="w-4 h-4 text-amber-500" />;
  };

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
            {/* TAB 1: COMMUNITIES WE SERVE */}
            {/* ========================================================================= */}
            {activeTab === "communities" && (
              <div className="space-y-6">
                {/* Section Titles */}
                <div className="p-4 bg-[#f9f9f9] border border-[#c3c4c7] rounded-sm space-y-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Section Title</label>
                    <input
                      type="text"
                      value={serviceArea.communitiesTitle || "Communities We Serve"}
                      onChange={(e) => setData({
                        ...data,
                        serviceArea: { ...serviceArea, communitiesTitle: e.target.value }
                      })}
                      className="w-full border border-[#c3c4c7] px-3 py-1.5 text-xs font-bold rounded-[3px] focus:border-[#2271b1] outline-none bg-white"
                      placeholder="Communities We Serve"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Section Subtitle Narrative</label>
                    <input
                      type="text"
                      value={serviceArea.communitiesSubtitle || ""}
                      onChange={(e) => setData({
                        ...data,
                        serviceArea: { ...serviceArea, communitiesSubtitle: e.target.value }
                      })}
                      className="w-full border border-[#c3c4c7] px-3 py-1.5 text-xs rounded-[3px] focus:border-[#2271b1] outline-none bg-white"
                      placeholder="From bustling city centers to quiet suburban neighborhoods, we bring holiday cheer to homes and businesses throughout Central Ohio."
                    />
                  </div>
                </div>

                {/* Top Action Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#f6f7f7] p-4 border border-[#c3c4c7] rounded-sm">
                  <div>
                    <h3 className="text-sm font-bold text-[#1d2327]">Service Communities Grid ({communities.length} Locations)</h3>
                    <p className="text-xs text-[#646970] mt-0.5">
                      Each card displays an icon and city name in the responsive service area grid.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddCommunity}
                    className="inline-flex items-center gap-1.5 bg-[#2271b1] text-white text-xs font-semibold px-4 py-2 rounded-[3px] hover:bg-[#135e96] transition-colors cursor-pointer shadow-sm self-start sm:self-auto"
                  >
                    <Plus className="w-4 h-4" />
                    + Add Community Location
                  </button>
                </div>

                {/* Communities List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {communities.map((comm: any, idx: number) => (
                    <div
                      key={comm.id || idx}
                      className="p-3 bg-white border border-[#c3c4c7] rounded-sm shadow-sm hover:shadow-md transition-all space-y-2 flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between border-b border-[#f0f0f1] pb-1.5">
                        <span className="text-[11px] font-bold text-slate-500 font-mono">Location #{idx + 1}</span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleMoveCommunity(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1 text-gray-500 hover:text-black hover:bg-gray-100 rounded disabled:opacity-30 cursor-pointer"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveCommunity(idx, 'down')}
                            disabled={idx === communities.length - 1}
                            className="p-1 text-gray-500 hover:text-black hover:bg-gray-100 rounded disabled:opacity-30 cursor-pointer"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCommunity(idx)}
                            className="p-1 text-red-500 hover:bg-red-50 rounded ml-1 cursor-pointer"
                            title="Delete Community"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">City / Location Name</label>
                          <input
                            type="text"
                            value={comm.city || ""}
                            onChange={(e) => handleUpdateCommunity(idx, "city", e.target.value)}
                            className="w-full border border-[#c3c4c7] px-2.5 py-1 text-xs font-bold rounded-[3px] focus:border-[#2271b1] outline-none bg-white"
                            placeholder="e.g. Columbus, OH"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Icon</label>
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded border border-[#c3c4c7] bg-white flex items-center justify-center flex-shrink-0">
                              {renderIconPreview(comm.icon || "FaCity")}
                            </div>
                            <select
                              value={comm.icon || "FaCity"}
                              onChange={(e) => handleUpdateCommunity(idx, "icon", e.target.value)}
                              className="w-full border border-[#c3c4c7] bg-white text-xs px-2 py-1 rounded-[3px] outline-none focus:border-[#2271b1]"
                            >
                              {AVAILABLE_COMMUNITY_ICONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 2: VAN & REAL MAP SECTION (VanMapSection) */}
            {/* ========================================================================= */}
            {activeTab === "vanMap" && (
              <div className="max-w-4xl space-y-6">
                {/* Section Titles */}
                <div className="p-4 bg-[#f9f9f9] border border-[#c3c4c7] rounded-sm space-y-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Section Headline</label>
                    <input
                      type="text"
                      value={serviceAreasData.title ?? "Areas We Are Serving"}
                      onChange={(e) => updateServiceAreasSection("title", e.target.value)}
                      className="w-full border border-[#c3c4c7] px-3 py-1.5 text-xs font-bold rounded-[3px] focus:border-[#2271b1] outline-none bg-white"
                      placeholder="Areas We Are Serving"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Section Subtitle</label>
                    <input
                      type="text"
                      value={serviceAreasData.subtitle ?? "Custom lighting installed by professionals."}
                      onChange={(e) => updateServiceAreasSection("subtitle", e.target.value)}
                      className="w-full border border-[#c3c4c7] px-3 py-1.5 text-xs rounded-[3px] focus:border-[#2271b1] outline-none bg-white"
                      placeholder="Custom lighting installed by professionals."
                    />
                  </div>
                </div>

                {/* Images */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <ImageField
                    label="Background Map Graphic (realmap.jpeg)"
                    value={serviceAreasData.mapImage || "/images/realmap.jpeg"}
                    onChange={(url) => updateServiceAreasSection("mapImage", url)}
                  />
                  <ImageField
                    label="Service Vehicle / Van Graphic (car2.png)"
                    value={serviceAreasData.vehicleImage || "/images/car2.png"}
                    onChange={(url) => updateServiceAreasSection("vehicleImage", url)}
                  />
                </div>

                {/* Steps / Highlights List */}
                <div className="space-y-4 pt-4 border-t border-[#f0f0f1]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-[#1d2327]">Feature Cards ({steps.length} Steps)</h3>
                      <p className="text-xs text-[#646970]">Highlights displayed alongside the interactive map and service van.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newSteps = [...steps];
                        newSteps.push({
                          number: String(newSteps.length + 1).padStart(2, "0"),
                          title: "New Highlight Feature",
                          description: "Describe the coverage benefit here.",
                          icon: "FaMapMarkerAlt",
                          color: "#EF4444",
                          features: ["Highlight bullet 1", "Highlight bullet 2"]
                        });
                        updateServiceAreasSection("steps", newSteps);
                      }}
                      className="bg-white border border-[#2271b1] text-[#2271b1] hover:bg-[#f0f6fb] text-xs font-semibold px-3 py-1.5 rounded-[3px] transition-colors cursor-pointer"
                    >
                      + Add Feature Card
                    </button>
                  </div>

                  <div className="space-y-4">
                    {steps.map((step: any, idx: number) => (
                      <div key={idx} className="p-4 bg-[#f9f9f9] border border-[#c3c4c7] rounded-sm space-y-3">
                        <div className="flex items-center justify-between border-b border-[#c3c4c7] pb-2">
                          <span className="text-xs font-bold text-slate-700">Card #{idx + 1} ({step.number || `0${idx + 1}`})</span>
                          <button
                            type="button"
                            onClick={() => {
                              const newSteps = steps.filter((_: any, i: number) => i !== idx);
                              updateServiceAreasSection("steps", newSteps);
                            }}
                            className="p-1 text-red-500 hover:bg-red-50 rounded cursor-pointer"
                            title="Delete Card"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Number</label>
                            <input
                              type="text"
                              value={step.number || ""}
                              onChange={(e) => {
                                const newSteps = [...steps];
                                newSteps[idx] = { ...newSteps[idx], number: e.target.value };
                                updateServiceAreasSection("steps", newSteps);
                              }}
                              className="w-full border border-[#c3c4c7] px-2 py-1 text-xs font-mono font-bold rounded-[3px] bg-white outline-none focus:border-[#2271b1]"
                              placeholder="01"
                            />
                          </div>

                          <div className="sm:col-span-2 space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Title</label>
                            <input
                              type="text"
                              value={step.title || ""}
                              onChange={(e) => {
                                const newSteps = [...steps];
                                newSteps[idx] = { ...newSteps[idx], title: e.target.value };
                                updateServiceAreasSection("steps", newSteps);
                              }}
                              className="w-full border border-[#c3c4c7] px-2 py-1 text-xs font-bold rounded-[3px] bg-white outline-none focus:border-[#2271b1]"
                              placeholder="Multiple Locations"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Accent Color</label>
                            <div className="flex items-center gap-1.5">
                              <input
                                type="color"
                                value={step.color || "#EF4444"}
                                onChange={(e) => {
                                  const newSteps = [...steps];
                                  newSteps[idx] = { ...newSteps[idx], color: e.target.value };
                                  updateServiceAreasSection("steps", newSteps);
                                }}
                                className="w-7 h-7 rounded border border-[#c3c4c7] cursor-pointer p-0.5 bg-white"
                              />
                              <input
                                type="text"
                                value={step.color || "#EF4444"}
                                onChange={(e) => {
                                  const newSteps = [...steps];
                                  newSteps[idx] = { ...newSteps[idx], color: e.target.value };
                                  updateServiceAreasSection("steps", newSteps);
                                }}
                                className="w-full border border-[#c3c4c7] px-1.5 py-1 text-[11px] font-mono rounded-[3px] bg-white uppercase"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">Description</label>
                          <textarea
                            rows={2}
                            value={step.description || ""}
                            onChange={(e) => {
                              const newSteps = [...steps];
                              newSteps[idx] = { ...newSteps[idx], description: e.target.value };
                              updateServiceAreasSection("steps", newSteps);
                            }}
                            className="w-full border border-[#c3c4c7] px-2.5 py-1.5 text-xs rounded-[3px] bg-white outline-none focus:border-[#2271b1]"
                            placeholder="Describe this service coverage advantage..."
                          />
                        </div>

                        {/* Bullets / Features list */}
                        <div className="space-y-1.5 pt-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">Feature Bullet Tags (One per line)</label>
                          <textarea
                            rows={3}
                            value={(step.features || []).join("\n")}
                            onChange={(e) => {
                              const newSteps = [...steps];
                              newSteps[idx] = { ...newSteps[idx], features: e.target.value.split("\n").filter(Boolean) };
                              updateServiceAreasSection("steps", newSteps);
                            }}
                            className="w-full border border-[#c3c4c7] px-2.5 py-1.5 text-xs rounded-[3px] bg-white font-mono outline-none focus:border-[#2271b1]"
                            placeholder="4+ store locations&#10;Local service teams&#10;Fast response times"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 3: HERO HEADER & INTRO */}
            {/* ========================================================================= */}
            {activeTab === "header" && (
              <div className="max-w-4xl space-y-6">
                <div className="bg-[#f9f9f9] border border-[#c3c4c7] p-4 rounded-sm space-y-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Pill Badge</label>
                    <input
                      type="text"
                      value={header.badge || "OUR SERVICE AREA"}
                      onChange={(e) => updateHeader("badge", e.target.value)}
                      className="w-full border border-[#c3c4c7] px-3 py-2 text-xs font-semibold rounded-[3px] focus:border-[#2271b1] outline-none bg-white uppercase"
                      placeholder="OUR SERVICE AREA"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Main Headline (2-Part Animated Gradient)</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] text-slate-500 font-bold">Part 1 (White Intro)</label>
                        <input
                          type="text"
                          value={header.titlePrefix || header.titlePart1 || "CENTRAL OHIO"}
                          onChange={(e) => updateHeader("titlePrefix", e.target.value)}
                          className="w-full border border-[#c3c4c7] px-3 py-1.5 text-xs font-bold rounded-[3px] focus:border-[#2271b1] outline-none bg-white uppercase"
                          placeholder="CENTRAL OHIO"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-[#2271b1] font-bold">Part 2 (Gold/Red Highlighted Line)</label>
                        <input
                          type="text"
                          value={header.titleHighlight || header.titlePart2 || "SERVICE AREA"}
                          onChange={(e) => updateHeader("titleHighlight", e.target.value)}
                          className="w-full border border-[#c3c4c7] px-3 py-1.5 text-xs font-bold rounded-[3px] focus:border-[#2271b1] outline-none bg-amber-50 text-amber-900 uppercase"
                          placeholder="SERVICE AREA"
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
                      placeholder="Proudly serving Columbus and surrounding communities with premium holiday lighting services"
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
                        />
                      </div>
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
            {/* TAB 4: CTA BANNER */}
            {/* ========================================================================= */}
            {activeTab === "cta" && (
              <div className="max-w-4xl space-y-6">
                <div className="bg-[#f9f9f9] border border-[#c3c4c7] p-4 rounded-sm space-y-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Banner Headline</label>
                    <input
                      type="text"
                      value={ctaSection.title || "Ready to Transform Your Property?"}
                      onChange={(e) => updateCtaSection("title", e.target.value)}
                      className="w-full border border-[#c3c4c7] px-3 py-2 text-xs font-bold rounded-[3px] focus:border-[#2271b1] outline-none bg-white"
                      placeholder="Ready to Transform Your Property?"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Banner Description</label>
                    <input
                      type="text"
                      value={ctaSection.description || "Contact our Central Ohio holiday lighting experts today for a custom design and free estimate."}
                      onChange={(e) => updateCtaSection("description", e.target.value)}
                      className="w-full border border-[#c3c4c7] px-3 py-2 text-xs rounded-[3px] focus:border-[#2271b1] outline-none bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#f0f0f1]">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-500 uppercase">Primary Button (Call)</label>
                      <input
                        type="text"
                        value={ctaSection.primaryButtonText || "Call Us Now"}
                        onChange={(e) => updateCtaSection("primaryButtonText", e.target.value)}
                        className="w-full border border-[#c3c4c7] px-3 py-1.5 text-xs font-bold rounded-[3px] bg-white outline-none focus:border-[#2271b1]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-500 uppercase">Secondary Button (Modal)</label>
                      <input
                        type="text"
                        value={ctaSection.secondaryButtonText || "Schedule Free Consultation"}
                        onChange={(e) => updateCtaSection("secondaryButtonText", e.target.value)}
                        className="w-full border border-[#c3c4c7] px-3 py-1.5 text-xs font-bold rounded-[3px] bg-white outline-none focus:border-[#2271b1]"
                      />
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
