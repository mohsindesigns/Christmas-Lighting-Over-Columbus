"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, ChevronRight, Loader2, Search, Trash2, X, ExternalLink, Edit3, Check, Copy,
  Info, Briefcase, Sparkles, Award, Globe, LayoutTemplate, Type, Image as GalleryIcon,
  CheckCircle, ArrowRight, Save, Eye, Phone, Palette, Link as LinkIcon, Calendar,
  Megaphone, Home, Trees, Lightbulb, Wrench, Package, Shield, Star, Clock, User, Mail
} from "lucide-react";
import {
  FaHome, FaTree, FaLightbulb, FaTools, FaBoxOpen, FaShieldAlt,
  FaStar, FaAward, FaClock, FaPalette, FaGem, FaCalendarAlt,
  FaCheckCircle, FaPhoneAlt, FaUser, FaEnvelope
} from "react-icons/fa";
import { GiSparkles } from "react-icons/gi";
import ImageField from "@/components/admin/ImageField";
import SeoEditor from "@/components/admin/SeoEditor";
import { BASE_URL } from "@/lib/constants";

const AVAILABLE_ICONS = [
  { value: "FaHome", label: "🏠 Home / Rooflines", icon: FaHome },
  { value: "FaTree", label: "🌲 Tree / Shrub Wrapping", icon: FaTree },
  { value: "FaLightbulb", label: "💡 Commercial LEDs", icon: FaLightbulb },
  { value: "FaTools", label: "🛠️ Pro Installation", icon: FaTools },
  { value: "FaBoxOpen", label: "📦 Free Storage", icon: FaBoxOpen },
  { value: "FaShieldAlt", label: "🛡️ Season Warranty", icon: FaShieldAlt },
  { value: "FaStar", label: "⭐ Premium 5-Star", icon: FaStar },
  { value: "FaAward", label: "🏆 Certified Quality", icon: FaAward },
  { value: "FaClock", label: "⏰ Timely Service", icon: FaClock },
  { value: "FaPalette", label: "🎨 Custom Colors", icon: FaPalette },
  { value: "FaGem", label: "💎 Luxury Trim", icon: FaGem },
  { value: "FaCalendarAlt", label: "📅 Seasonal Schedule", icon: FaCalendarAlt },
  { value: "FaCheckCircle", label: "✅ Guarantee", icon: FaCheckCircle },
  { value: "FaPhoneAlt", label: "📞 Fast Support", icon: FaPhoneAlt },
  { value: "FaUser", label: "👤 Consultation", icon: FaUser },
  { value: "GiSparkles", label: "✨ Holiday Sparkles", icon: GiSparkles }
];

const renderIconPreview = (iconValue: string) => {
  const match = AVAILABLE_ICONS.find(i => i.value === iconValue);
  if (match) {
    const IconComp = match.icon;
    return <IconComp className="w-5 h-5 text-emerald-600" />;
  }
  return <FaLightbulb className="w-5 h-5 text-emerald-600" />;
};

const defaultServiceForm = {
  id: "",
  number: "01",
  tag: "RESIDENTIAL",
  title: "",
  slug: "",
  headline: "Make your home stand out this holiday season",
  description: "Coming home to a beautifully lit house makes the holidays even more special. We design and install custom residential displays tailored to your home and your style.",
  heroImage: "/images/portfolio/portfolio-1.jpg",
  status: "published",

  // Hero CTAs
  heroCtaText: "Get Your Free Quote",
  heroCtaLink: "#quote",
  heroPhone: "(614) 301-7100",
  heroPhoneLink: "tel:6143017100",

  // Overview
  overviewBadge: "OVERVIEW",
  overviewTitle: "Complete Residential Lighting",
  longDescription: "Our residential lighting service transforms your home into a stunning holiday showcase. We start with a consultation to understand your vision, then create a custom design that highlights your home's architectural features.",
  image: "/images/portfolio/portfolio-3.jpg",
  color: "#10B981",

  // What We Offer
  featuresBadge: "WHAT WE OFFER",
  featuresTitle: "Complete Residential Lighting Services",
  featuresSubtitle: "Professional installation with premium materials and full-service support from start to finish.",
  features: [
    { title: "Roof & Gutter Lines", description: "Professional installation along rooflines and gutters for that classic holiday look", icon: "FaHome" },
    { title: "Tree & Shrub Wrapping", description: "Beautifully wrapped trees and bushes to complete your landscape", icon: "FaTree" },
    { title: "Commercial Grade LEDs", description: "3x brighter than store-bought lights with better color consistency", icon: "FaLightbulb" },
    { title: "Professional Installation", description: "Licensed and insured team with years of holiday lighting experience", icon: "FaTools" },
    { title: "Free Storage", description: "We store your lights after the season ends - no clutter in your garage", icon: "FaBoxOpen" },
    { title: "Warranty Included", description: "Full warranty on all lights and installation throughout the season", icon: "FaShieldAlt" }
  ],

  // Why Choose Us
  whyBadge: "WHY CHOOSE US",
  whyTitle: "Professional Quality, Personal Service",
  whyDescription: "We focus on delivering beautiful holiday lighting while making the entire process easy and hassle-free for you.",
  whyPoints: [
    "Free Quotes & Virtual Mockups",
    "Commercial grade LED lights custom fit to your home",
    "In-Season Maintenance & Fast Take Down",
    "Free storage in our climate-controlled facility",
    "Fully insured to protect your home and property"
  ],
  whyCtaText: "Get Your Free Quote",
  whyCtaLink: "#quote",
  whyImage1: "/images/portfolio/portfolio-2.jpg",
  whyImage2: "/images/portfolio/portfolio-4.jpg",
  whyImage3: "/images/portfolio/portfolio-5.jpg",

  // Dedicated Bottom CTA Management
  bottomCtaTitle: "Ready to Transform Your Home?",
  bottomCtaDescription: "Join local homeowners who trust us to make their holidays shine",
  bottomCtaPrimaryText: "Call Us Now",
  bottomCtaPrimaryLink: "tel:6143017100",
  bottomCtaSecondaryText: "Schedule Free Consultation",
  bottomCtaSecondaryLink: "#quote",
  bottomCtaPhone: "(614) 301-7100",

  seo: {}
};

export default function ServicesAdminPage() {
  const [data, setData] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  
  // WP Style Tabs
  const [mainTab, setMainTab] = useState<"content" | "seo">("content");
  const [activeSection, setActiveSection] = useState<"hero" | "overview" | "features" | "why-choose-us" | "cta">("hero");

  const [seo, setSeo] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingServiceQuick, setEditingServiceQuick] = useState<any>(null);
  const [form, setForm] = useState<any>(defaultServiceForm);

  // New Quick Service Form
  const [newQuickService, setNewQuickService] = useState({
    title: "",
    slug: "",
    tag: "RESIDENTIAL",
    status: "published"
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch("/api/content");
      const json = await res.json();
      setData(json);
      setServices(json.services?.services || []);
    } catch (err) {
      console.error("Failed to load services:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (newQuickService.title) {
      const generated = newQuickService.title.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, "-");
      setNewQuickService(prev => ({ ...prev, slug: generated }));
    }
  }, [newQuickService.title]);

  useEffect(() => {
    if (isEditing !== null && form.title && !form.id) {
      const generatedSlug = form.title.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, "-");
      if (form.slug !== generatedSlug) setForm((prev: any) => ({ ...prev, slug: generatedSlug }));
    }
  }, [form.title]);

  const saveToDb = async (newServices: any[], keepEditingIdx?: number, updatedForm?: any) => {
    setSaving(true);
    setMessage("");
    const updatedData = { ...data, services: { ...data?.services, services: newServices } };
    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData)
      });
      if (res.ok) {
        setData(updatedData);
        setServices(newServices);
        setMessage("Service saved successfully!");
        setTimeout(() => setMessage(""), 3000);
        if (keepEditingIdx !== undefined) {
          setIsEditing(keepEditingIdx);
          if (updatedForm) setForm(updatedForm);
        } else {
          setIsEditing(null);
        }
      } else {
        setMessage("Failed to save service.");
      }
    } catch {
      setMessage("Error saving service.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveService = () => {
    if (!form.title || !form.slug) return alert("Service title and URL slug are required.");

    const newServices = [...services];
    const serviceData = {
      ...form,
      seo: seo,
      id: form.id || Date.now().toString(),
      number: form.number || (services.length + 1).toString().padStart(2, '0'),
      bottomCta: {
        title: form.bottomCtaTitle || "Ready to Transform Your Home?",
        description: form.bottomCtaDescription || "Join local homeowners who trust us to make their holidays shine",
        primaryButtonText: form.bottomCtaPrimaryText || "Call Us Now",
        primaryButtonLink: form.bottomCtaPrimaryLink || "tel:6143017100",
        secondaryButtonText: form.bottomCtaSecondaryText || "Schedule Free Consultation",
        secondaryButtonLink: form.bottomCtaSecondaryLink || "#quote",
        phone: form.bottomCtaPhone || "(614) 301-7100"
      }
    };

    let targetIdx = isEditing;
    if (isEditing !== null && isEditing < services.length) {
      newServices[isEditing] = serviceData;
    } else {
      targetIdx = services.length;
      newServices.push(serviceData);
    }
    saveToDb(newServices, targetIdx !== null ? targetIdx : undefined, serviceData);
  };

  const handleCreateQuickService = () => {
    if (!newQuickService.title || !newQuickService.slug) return alert("Title and Slug are required.");

    const newService = {
      ...defaultServiceForm,
      id: Date.now().toString(),
      title: newQuickService.title,
      slug: newQuickService.slug,
      tag: newQuickService.tag,
      status: newQuickService.status,
      number: (services.length + 1).toString().padStart(2, '0')
    };

    const newServices = [...services, newService];
    saveToDb(newServices, newServices.length - 1, newService);
    setShowAddModal(false);
    setNewQuickService({ title: "", slug: "", tag: "RESIDENTIAL", status: "published" });
  };

  const handleEdit = (service: any) => {
    const originalIdx = services.findIndex(orig => orig.id === service.id || orig.slug === service.slug);
    setForm({
      ...defaultServiceForm,
      ...service,
      features: Array.isArray(service.features) && service.features.length > 0 
        ? service.features.map((f: any) => ({ ...f, icon: f.icon || "FaLightbulb" }))
        : defaultServiceForm.features,
      whyPoints: Array.isArray(service.whyPoints) && service.whyPoints.length > 0
        ? service.whyPoints
        : (Array.isArray(service.benefits) && service.benefits.length > 0 ? service.benefits.map((b: any) => typeof b === 'string' ? b : (b.title || b.text || b)) : defaultServiceForm.whyPoints),
      bottomCtaTitle: service.bottomCta?.title || service.bottomCtaTitle || defaultServiceForm.bottomCtaTitle,
      bottomCtaDescription: service.bottomCta?.description || service.bottomCtaDescription || defaultServiceForm.bottomCtaDescription,
      bottomCtaPrimaryText: service.bottomCta?.primaryButtonText || service.bottomCtaPrimaryText || defaultServiceForm.bottomCtaPrimaryText,
      bottomCtaPrimaryLink: service.bottomCta?.primaryButtonLink || service.bottomCtaPrimaryLink || defaultServiceForm.bottomCtaPrimaryLink,
      bottomCtaSecondaryText: service.bottomCta?.secondaryButtonText || service.bottomCtaSecondaryText || defaultServiceForm.bottomCtaSecondaryText,
      bottomCtaSecondaryLink: service.bottomCta?.secondaryButtonLink || service.bottomCtaSecondaryLink || defaultServiceForm.bottomCtaSecondaryLink,
      bottomCtaPhone: service.bottomCta?.phone || service.bottomCtaPhone || defaultServiceForm.bottomCtaPhone,
    });
    setSeo(service.seo || {});
    setIsEditing(originalIdx !== -1 ? originalIdx : 0);
    setMainTab("content");
    setActiveSection("hero");
  };

  const handleQuickEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingServiceQuick) return;
    const newServices = services.map(s => (s.id === editingServiceQuick.id || s.slug === editingServiceQuick.slug) ? editingServiceQuick : s);
    saveToDb(newServices);
    setEditingServiceQuick(null);
  };

  const handleDuplicate = (service: any) => {
    const newService = {
      ...defaultServiceForm,
      ...service,
      id: Date.now().toString(),
      title: `${service.title} (Copy)`,
      slug: `${service.slug}-copy`,
      number: (services.length + 1).toString().padStart(2, '0'),
      status: 'draft'
    };
    const newServices = [...services, newService];
    saveToDb(newServices);
  };

  const handleDelete = (service: any) => {
    if (!confirm(`Permanently delete "${service.title}"?`)) return;
    const newServices = services.filter(s => s.id !== service.id && s.slug !== service.slug);
    saveToDb(newServices);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredServices.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredServices.map(s => s.id || s.slug));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleBulkAction = () => {
    if (!bulkAction || selectedIds.length === 0) return;
    if (bulkAction === 'delete') {
      if (!confirm(`Permanently delete ${selectedIds.length} services?`)) return;
      const newServices = services.filter(s => !selectedIds.includes(s.id || s.slug));
      saveToDb(newServices);
      setSelectedIds([]);
    } else if (bulkAction === 'publish' || bulkAction === 'draft') {
      const newServices = services.map(s => selectedIds.includes(s.id || s.slug) ? { ...s, status: bulkAction === 'publish' ? 'published' : 'draft' } : s);
      saveToDb(newServices);
      setSelectedIds([]);
    }
    setBulkAction("");
  };

  const filteredServices = services.filter(s => {
    const matchesSearch = !search || s.title?.toLowerCase().includes(search.toLowerCase()) || s.slug?.toLowerCase().includes(search.toLowerCase());
    if (filter === "all") return matchesSearch;
    return matchesSearch && s.status === filter;
  });

  const sectionLinks = [
    { id: "hero", label: "Hero" },
    { id: "overview", label: "Overview" },
    { id: "features", label: "What We Offer (Features & Icons)" },
    { id: "why-choose-us", label: "Why Choose Us" },
    { id: "cta", label: "Call-To-Action (CTA)" }
  ];

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#2271b1]" /></div>;

  return (
    <div className="space-y-4">
      {/* Toast Notification */}
      {message && (
        <div className={`p-3 rounded mb-2 text-xs font-semibold ${message.includes("success") ? "bg-green-100 text-green-800 border border-green-300" : "bg-red-100 text-red-800 border border-red-300"}`}>
          {message}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. SERVICES LIST PAGE UI */}
      {/* ========================================================================= */}
      {isEditing === null ? (
        <div className="space-y-4">
          {/* WP Header Area */}
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-[23px] font-normal text-[#1d2327] font-serif m-0">Services</h1>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-white border border-[#2271b1] text-[#2271b1] hover:bg-[#f6f7f7] hover:text-[#135e96] hover:border-[#135e96] px-2 py-1 text-[13px] rounded-[3px] transition-colors cursor-pointer"
            >
              Add New Service
            </button>
          </div>

          {/* Filter Links */}
          <div className="flex items-center gap-2 text-[13px]">
            <button onClick={() => setFilter("all")} className={`${filter === 'all' ? 'text-black font-bold' : 'text-[#2271b1] hover:text-[#135e96] underline decoration-transparent hover:decoration-current'}`}>
              All <span className="text-[#646970] font-normal">({services.length})</span>
            </button>
            <span className="text-[#c3c4c7]">|</span>
            <button onClick={() => setFilter("published")} className={`${filter === 'published' ? 'text-black font-bold' : 'text-[#2271b1] hover:text-[#135e96] underline decoration-transparent hover:decoration-current'}`}>
              Published <span className="text-[#646970] font-normal">({services.filter(s => s.status === 'published').length})</span>
            </button>
            <span className="text-[#c3c4c7]">|</span>
            <button onClick={() => setFilter("draft")} className={`${filter === 'draft' ? 'text-black font-bold' : 'text-[#2271b1] hover:text-[#135e96] underline decoration-transparent hover:decoration-current'}`}>
              Drafts <span className="text-[#646970] font-normal">({services.filter(s => s.status === 'draft').length})</span>
            </button>
          </div>

          {/* Top Bar: Bulk Actions & Search */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <select 
                className="border border-[#8c8f94] bg-white text-[#2c3338] px-2 py-1 text-[13px] rounded-[3px] outline-none focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1]"
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
              >
                <option value="">Bulk actions</option>
                <option value="publish">Mark as Published</option>
                <option value="draft">Mark as Draft</option>
                <option value="delete">Delete Permanently</option>
              </select>
              <button 
                onClick={handleBulkAction}
                className="bg-white border border-[#8c8f94] text-[#2c3338] px-3 py-1 text-[13px] rounded-[3px] hover:bg-[#f6f7f7] transition-colors cursor-pointer"
              >
                Apply
              </button>
            </div>

            <div className="flex items-center gap-2">
               <input
                 type="text"
                 placeholder="Search Services"
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 className="border border-[#8c8f94] bg-white px-3 py-1 text-[13px] rounded-[3px] outline-none focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1]"
               />
               <button className="bg-white border border-[#8c8f94] text-[#2c3338] px-3 py-1 text-[13px] rounded-[3px] hover:bg-[#f6f7f7] transition-colors">Search Services</button>
            </div>
          </div>

          {/* Table Pagination Info */}
          <div className="flex justify-end text-[13px] text-[#50575e]">
             {filteredServices.length} items
          </div>

          {/* WP-Style Table */}
          <div className="bg-white border border-[#c3c4c7] rounded-sm overflow-hidden shadow-[0_1px_1px_rgba(0,0,0,0.04)]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#c3c4c7] text-[#1d2327]">
                  <th className="w-8 py-2 px-3">
                    <input
                      type="checkbox"
                      checked={filteredServices.length > 0 && selectedIds.length === filteredServices.length}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 border-[#8c8f94] rounded-[3px] text-[#2271b1] focus:ring-[#2271b1]"
                    />
                  </th>
                  <th className="py-2 px-3 text-[14px] font-semibold">Service Title</th>
                  <th className="py-2 px-3 text-[14px] font-semibold w-36">Category</th>
                  <th className="py-2 px-3 text-[14px] font-semibold w-48">URL Slug</th>
                  <th className="py-2 px-3 text-[14px] font-semibold w-32">Status</th>
                  <th className="py-2 px-3 text-[14px] font-semibold w-24 text-center">Number</th>
                </tr>
              </thead>
              <tbody className="text-[13px] text-[#2c3338]">
                {filteredServices.length === 0 ? (
                  <tr><td colSpan={6} className="py-6 px-4 text-[#50575e]">No services found.</td></tr>
                ) : (
                  filteredServices.map((service, idx) => (
                    <tr
                      key={service.id || service.slug || idx}
                      className={`border-b border-[#f0f0f1] group ${idx % 2 === 0 ? "bg-[#f9f9f9]" : "bg-white"} hover:bg-[#f0f0f1] transition-colors`}
                    >
                      <td className="py-3 px-3 align-top">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(service.id || service.slug)}
                          onChange={() => toggleSelect(service.id || service.slug)}
                          className="w-4 h-4 border-[#8c8f94] rounded-[3px] text-[#2271b1] focus:ring-[#2271b1]"
                        />
                      </td>
                      <td className="py-3 px-3 align-top">
                        <strong className="text-[#2271b1] block text-[14px] cursor-pointer" onClick={() => handleEdit(service)}>
                          {service.title || "Untitled Service"} — {service.status === 'draft' ? <span className="text-[#646970] font-normal italic">Draft</span> : <span className="text-[#00a32a] font-normal italic">Published</span>}
                        </strong>
                        <div className="flex items-center gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEdit(service)} className="text-[#2271b1] hover:underline text-[12px] cursor-pointer">Edit</button>
                          <span className="text-[#a7aaad]">|</span>
                          <button onClick={() => setEditingServiceQuick(service)} className="text-[#2271b1] hover:underline text-[12px] cursor-pointer">Quick Edit</button>
                          <span className="text-[#a7aaad]">|</span>
                          <button onClick={() => handleDuplicate(service)} className="text-[#2271b1] hover:underline text-[12px] cursor-pointer">Duplicate</button>
                          <span className="text-[#a7aaad]">|</span>
                          <button 
                            onClick={() => {
                              const updated = services.map(s => (s.id === service.id || s.slug === service.slug) ? { ...s, status: s.status === 'published' ? 'draft' : 'published' } : s);
                              saveToDb(updated);
                            }} 
                            className="text-[#2271b1] hover:underline text-[12px] cursor-pointer"
                          >
                            {service.status === 'published' ? 'Keep as Draft' : 'Publish Now'}
                          </button>
                          <span className="text-[#a7aaad]">|</span>
                          <Link href={`/services/${service.slug}`} target="_blank" className="text-[#2271b1] hover:underline text-[12px]">View</Link>
                          <span className="text-[#a7aaad]">|</span>
                          <button onClick={() => handleDelete(service)} className="text-[#d63638] hover:underline text-[12px] cursor-pointer">Delete</button>
                        </div>
                      </td>
                      <td className="py-3 px-3 align-top capitalize text-[#50575e]">
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-2 py-0.5 rounded font-bold uppercase">
                          {service.tag || service.category || "RESIDENTIAL"}
                        </span>
                      </td>
                      <td className="py-3 px-3 align-top font-mono text-xs text-gray-500">
                        /services/{service.slug}
                      </td>
                      <td className="py-3 px-3 align-top">
                        <span className={`font-semibold ${service.status === 'published' ? 'text-[#00a32a]' : 'text-[#d63638]'}`}>
                          {service.status === 'published' ? 'Active' : 'Draft'}
                        </span>
                      </td>
                      <td className="py-3 px-3 align-top text-center font-bold text-gray-400 font-mono">
                        {service.number || (idx + 1).toString().padStart(2, '0')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Quick Edit Modal */}
          <AnimatePresence>
            {editingServiceQuick && (
              <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-lg shadow-xl w-full max-w-lg border border-[#c3c4c7] overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-[#f0f0f1] bg-[#f6f7f7]">
                    <h3 className="font-semibold text-sm text-[#1d2327]">Quick Edit Service</h3>
                    <button onClick={() => setEditingServiceQuick(null)} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
                  </div>
                  <form onSubmit={handleQuickEditSave} className="p-4 space-y-3">
                    <div>
                      <label className="text-xs font-bold text-[#2c3338] uppercase">Service Title</label>
                      <input
                        type="text"
                        value={editingServiceQuick.title || ""}
                        onChange={(e) => setEditingServiceQuick({ ...editingServiceQuick, title: e.target.value })}
                        className="w-full mt-1 px-3 py-1.5 border border-[#8c8f94] rounded text-sm outline-none focus:border-[#2271b1]"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#2c3338] uppercase">URL Slug</label>
                      <input
                        type="text"
                        value={editingServiceQuick.slug || ""}
                        onChange={(e) => setEditingServiceQuick({ ...editingServiceQuick, slug: e.target.value })}
                        className="w-full mt-1 px-3 py-1.5 border border-[#8c8f94] rounded text-sm font-mono outline-none focus:border-[#2271b1]"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-[#2c3338] uppercase">Category Tag</label>
                        <input
                          type="text"
                          value={editingServiceQuick.tag || "RESIDENTIAL"}
                          onChange={(e) => setEditingServiceQuick({ ...editingServiceQuick, tag: e.target.value })}
                          className="w-full mt-1 px-3 py-1.5 border border-[#8c8f94] rounded text-sm uppercase outline-none focus:border-[#2271b1]"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-[#2c3338] uppercase">Status</label>
                        <select
                          value={editingServiceQuick.status || "published"}
                          onChange={(e) => setEditingServiceQuick({ ...editingServiceQuick, status: e.target.value })}
                          className="w-full mt-1 px-3 py-1.5 border border-[#8c8f94] rounded text-sm outline-none focus:border-[#2271b1] bg-white"
                        >
                          <option value="published">Published</option>
                          <option value="draft">Draft</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-3 border-t border-[#f0f0f1]">
                      <button type="button" onClick={() => setEditingServiceQuick(null)} className="px-3 py-1.5 text-xs border border-[#8c8f94] rounded hover:bg-gray-50">Cancel</button>
                      <button type="submit" className="px-4 py-1.5 text-xs font-bold bg-[#2271b1] hover:bg-[#135e96] text-white rounded">Update Service</button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Add New Service Modal */}
          <AnimatePresence>
            {showAddModal && (
              <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-lg shadow-xl w-full max-w-lg border border-[#c3c4c7] overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-[#f0f0f1] bg-[#f6f7f7]">
                    <h3 className="font-semibold text-sm text-[#1d2327]">Add New Service</h3>
                    <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
                  </div>
                  <div className="p-4 space-y-3">
                    <div>
                      <label className="text-xs font-bold text-[#2c3338] uppercase">Service Title</label>
                      <input
                        type="text"
                        placeholder="e.g. Commercial Christmas Lighting"
                        value={newQuickService.title}
                        onChange={(e) => setNewQuickService({ ...newQuickService, title: e.target.value })}
                        className="w-full mt-1 px-3 py-1.5 border border-[#8c8f94] rounded text-sm outline-none focus:border-[#2271b1]"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#2c3338] uppercase">URL Slug</label>
                      <input
                        type="text"
                        placeholder="e.g. commercial-christmas-lighting"
                        value={newQuickService.slug}
                        onChange={(e) => setNewQuickService({ ...newQuickService, slug: e.target.value })}
                        className="w-full mt-1 px-3 py-1.5 border border-[#8c8f94] rounded text-sm font-mono outline-none focus:border-[#2271b1]"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-[#2c3338] uppercase">Category Tag</label>
                        <input
                          type="text"
                          placeholder="COMMERCIAL"
                          value={newQuickService.tag}
                          onChange={(e) => setNewQuickService({ ...newQuickService, tag: e.target.value })}
                          className="w-full mt-1 px-3 py-1.5 border border-[#8c8f94] rounded text-sm uppercase outline-none focus:border-[#2271b1]"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-[#2c3338] uppercase">Status</label>
                        <select
                          value={newQuickService.status}
                          onChange={(e) => setNewQuickService({ ...newQuickService, status: e.target.value })}
                          className="w-full mt-1 px-3 py-1.5 border border-[#8c8f94] rounded text-sm outline-none focus:border-[#2271b1] bg-white"
                        >
                          <option value="published">Published</option>
                          <option value="draft">Draft</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-3 border-t border-[#f0f0f1]">
                      <button type="button" onClick={() => setShowAddModal(false)} className="px-3 py-1.5 text-xs border border-[#8c8f94] rounded hover:bg-gray-50">Cancel</button>
                      <button type="button" onClick={handleCreateQuickService} className="px-4 py-1.5 text-xs font-bold bg-[#2271b1] hover:bg-[#135e96] text-white rounded">Create & Edit Service</button>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        /* ========================================================================= */
        /* 2. SERVICE EDIT PAGE UI (WP EDIT PAGE LAYOUT) */
        /* ========================================================================= */
        <div className="space-y-4">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-1.5 text-[12px] text-[#646970] mb-1">
            <button onClick={() => setIsEditing(null)} className="text-[#2271b1] hover:underline">Services</button>
            <ChevronRight className="w-3 h-3 text-[#a7aaad]" />
            <span className="text-[#646970] truncate">{form.title || "Edit Service"}</span>
          </div>

          {/* WP Header Area */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <h1 className="text-[20px] font-normal text-[#1d2327] font-serif m-0">Edit Service</h1>
              <button
                onClick={() => {
                  setForm({
                    ...defaultServiceForm,
                    id: Date.now().toString(),
                    number: (services.length + 1).toString().padStart(2, '0')
                  });
                  setSeo({});
                  setIsEditing(services.length);
                  setMainTab("content");
                  setActiveSection("hero");
                }}
                className="bg-white border border-[#2271b1] text-[#2271b1] text-[12px] px-1.5 py-0.5 rounded-[3px] hover:bg-[#f0f6fb] transition-colors cursor-pointer"
              >
                Add New
              </button>
              {form.slug && (
                <Link
                  href={`/services/${form.slug}`}
                  target="_blank"
                  className="bg-white border border-[#c3c4c7] text-[#2c3338] text-[12px] px-1.5 py-0.5 rounded-[3px] hover:bg-[#f6f7f7] transition-colors flex items-center gap-1"
                >
                  View Service <ExternalLink className="w-3 h-3" />
                </Link>
              )}
            </div>
          </div>

          {/* 2-COLUMN GUTENBERG / CLASSIC LAYOUT */}
          <div className="flex flex-col lg:flex-row gap-4 items-start">
            {/* LEFT MAIN CONTENT AREA */}
            <div className="flex-1 min-w-0 w-full space-y-4">
              {/* Title Input Field (Large Gutenberg Style) */}
              <div className="bg-white">
                <input
                  type="text"
                  value={form.title || ""}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-[#c3c4c7] px-3 py-1.5 text-[16px] font-medium text-[#1d2327] focus:border-[#2271b1] focus:ring-0 outline-none placeholder:text-[#c3c4c7]"
                  placeholder="Enter service title here"
                />
              </div>

              {/* Permalink Bar */}
              <div className="flex flex-wrap items-center gap-1 text-[12px] text-[#646970] px-1">
                <strong>Permalink:</strong>
                <span className="bg-[#f0f0f1] border border-[#c3c4c7] px-1 rounded-sm text-[#1d2327] break-all">
                  {BASE_URL}/services/{form.slug}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const ns = prompt("Enter new URL slug:", form.slug);
                    if (ns) setForm({ ...form, slug: ns.toLowerCase().replace(/[^a-z0-9-]/g, "") });
                  }}
                  className="bg-white border border-[#c3c4c7] px-1.5 py-0.5 rounded-[3px] text-[#2c3338] hover:bg-[#f6f7f7] cursor-pointer"
                >
                  Edit
                </button>
              </div>

              {/* Main Tab Container */}
              <div className="bg-white border border-[#c3c4c7] shadow-sm overflow-hidden rounded-sm">
                {/* Primary Tabs (Page Content | SEO Settings) */}
                <div className="flex border-b border-[#f0f0f1] bg-[#f6f7f7]">
                  <button
                    type="button"
                    onClick={() => setMainTab("content")}
                    className={`px-3 py-2 text-[12px] font-semibold border-r border-[#c3c4c7] transition-all cursor-pointer ${
                      mainTab === "content" ? "bg-white text-[#1d2327]" : "text-[#2271b1] hover:text-[#135e96]"
                    }`}
                  >
                    Page Content
                  </button>
                  <button
                    type="button"
                    onClick={() => setMainTab("seo")}
                    className={`px-3 py-2 text-[12px] font-semibold border-r border-[#c3c4c7] transition-all cursor-pointer ${
                      mainTab === "seo" ? "bg-white text-[#1d2327]" : "text-[#2271b1] hover:text-[#135e96]"
                    }`}
                  >
                    SEO Settings
                  </button>
                </div>

                {/* Content Tab View */}
                {mainTab === "content" ? (
                  <div className="p-4 sm:p-6 space-y-6">
                    {/* Sub-Tabs Row */}
                    <div className="flex flex-wrap items-center gap-2 text-[13px] border-b border-[#f0f0f1] pb-3">
                      {sectionLinks.map((sec, idx) => (
                        <div key={sec.id} className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setActiveSection(sec.id as any)}
                            className={`cursor-pointer ${
                              activeSection === sec.id
                                ? "text-[#1d2327] font-bold border-b-2 border-[#2271b1] pb-0.5"
                                : "text-[#2271b1] hover:text-[#135e96] underline decoration-transparent hover:decoration-current"
                            }`}
                          >
                            {sec.label}
                          </button>
                          {idx < sectionLinks.length - 1 && <span className="text-[#c3c4c7]">|</span>}
                        </div>
                      ))}
                    </div>

                    {/* SECTION 1: HERO */}
                    {activeSection === "hero" && (
                      <div className="space-y-6">
                        <h2 className="text-lg font-bold text-[#1d2327] border-b border-[#f0f0f1] pb-2">
                          1. Hero Section
                        </h2>

                        {/* Headline */}
                        <div className="space-y-4">
                          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Main Headline & Subtitle</h3>
                          <div className="space-y-3">
                            <div className="space-y-1">
                              <label className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">Main Headline</label>
                              <input
                                type="text"
                                value={form.headline || ""}
                                onChange={(e) => setForm({ ...form, headline: e.target.value })}
                                className="w-full border border-[#c3c4c7] px-3 py-2 text-[14px] font-bold rounded-[3px] focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] outline-none bg-white"
                                placeholder="Make your home stand out this holiday season"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">Subtitle Narrative</label>
                              <textarea
                                rows={3}
                                value={form.description || ""}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                className="w-full border border-[#c3c4c7] px-3 py-2 text-[13px] rounded-[3px] focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] outline-none bg-white"
                                placeholder="Coming home to a beautifully lit house makes the holidays even more special..."
                              />
                            </div>
                          </div>
                        </div>

                        {/* Hero CTAs */}
                        <div className="space-y-4 pt-2 border-t border-[#f0f0f1]">
                          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Hero CTA Button & Link Controls</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Primary CTA */}
                            <div className="p-3 border border-[#c3c4c7] rounded-[3px] bg-[#f9f9f9] space-y-2">
                              <span className="text-[11px] font-bold text-emerald-700 uppercase">Primary Action Button</span>
                              <div className="space-y-1">
                                <label className="text-[11px] text-slate-600 font-bold">Button Text</label>
                                <input
                                  type="text"
                                  value={form.heroCtaText || "Get Your Free Quote"}
                                  onChange={(e) => setForm({ ...form, heroCtaText: e.target.value })}
                                  className="w-full border border-[#c3c4c7] px-2.5 py-1.5 text-xs font-bold rounded-[3px] bg-white outline-none focus:border-[#2271b1]"
                                  placeholder="Get Your Free Quote"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[11px] text-slate-600 font-bold">Action / Target Link</label>
                                <input
                                  type="text"
                                  value={form.heroCtaLink || "#quote"}
                                  onChange={(e) => setForm({ ...form, heroCtaLink: e.target.value })}
                                  className="w-full border border-[#c3c4c7] px-2.5 py-1.5 text-xs font-mono rounded-[3px] bg-white outline-none focus:border-[#2271b1]"
                                  placeholder="#quote"
                                />
                                <p className="text-[10px] text-slate-500">Use <code className="text-[#2271b1] font-mono">#quote</code> for consultation modal.</p>
                              </div>
                            </div>

                            {/* Phone CTA */}
                            <div className="p-3 border border-[#c3c4c7] rounded-[3px] bg-[#f9f9f9] space-y-2">
                              <span className="text-[11px] font-bold text-amber-700 uppercase">Direct Call Button</span>
                              <div className="space-y-1">
                                <label className="text-[11px] text-slate-600 font-bold">Phone Display Label</label>
                                <input
                                  type="text"
                                  value={form.heroPhone || "(614) 301-7100"}
                                  onChange={(e) => setForm({ ...form, heroPhone: e.target.value })}
                                  className="w-full border border-[#c3c4c7] px-2.5 py-1.5 text-xs font-bold rounded-[3px] bg-white outline-none focus:border-[#2271b1]"
                                  placeholder="(614) 301-7100"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[11px] text-slate-600 font-bold">Phone Link (tel:)</label>
                                <input
                                  type="text"
                                  value={form.heroPhoneLink || "tel:6143017100"}
                                  onChange={(e) => setForm({ ...form, heroPhoneLink: e.target.value })}
                                  className="w-full border border-[#c3c4c7] px-2.5 py-1.5 text-xs font-mono rounded-[3px] bg-white outline-none focus:border-[#2271b1]"
                                  placeholder="tel:6143017100"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Parallax Hero Image */}
                        <div className="pt-2 border-t border-[#f0f0f1]">
                          <ImageField
                            label="Hero Parallax Background Image"
                            value={form.heroImage || ""}
                            onChange={(v) => setForm({ ...form, heroImage: v })}
                          />
                        </div>
                      </div>
                    )}

                    {/* SECTION 2: OVERVIEW */}
                    {activeSection === "overview" && (
                      <div className="space-y-6">
                        <h2 className="text-lg font-bold text-[#1d2327] border-b border-[#f0f0f1] pb-2">
                          2. Overview Section
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Badge Title</label>
                            <input
                              type="text"
                              value={form.overviewBadge || "OVERVIEW"}
                              onChange={(e) => setForm({ ...form, overviewBadge: e.target.value })}
                              className="w-full border border-[#c3c4c7] px-3 py-2 text-[14px] rounded-[3px] focus:border-[#2271b1] outline-none bg-white uppercase"
                              placeholder="OVERVIEW"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Section Headline (Gradient)</label>
                            <input
                              type="text"
                              value={form.overviewTitle || ""}
                              onChange={(e) => setForm({ ...form, overviewTitle: e.target.value })}
                              className="w-full border border-[#c3c4c7] px-3 py-2 text-[14px] font-bold text-primary rounded-[3px] focus:border-[#2271b1] outline-none bg-white"
                              placeholder="Complete Residential Lighting"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Overview Detailed Narrative</label>
                          <textarea
                            rows={6}
                            value={form.longDescription || form.overview || ""}
                            onChange={(e) => setForm({ ...form, longDescription: e.target.value, overview: e.target.value })}
                            className="w-full border border-[#c3c4c7] px-3 py-2 text-[13px] rounded-[3px] focus:border-[#2271b1] outline-none bg-white leading-relaxed"
                            placeholder="Our residential lighting service transforms your home into a stunning holiday showcase..."
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#f0f0f1] items-start">
                          <ImageField
                            label="Overview Feature Image"
                            value={form.image || ""}
                            onChange={(v) => setForm({ ...form, image: v })}
                          />
                          <div className="space-y-2 p-3 border border-[#c3c4c7] rounded-[3px] bg-[#f9f9f9]">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Back-Glow Accent Color</label>
                            <div className="flex gap-2 items-center">
                              <input
                                type="color"
                                value={form.color || "#10B981"}
                                onChange={(e) => setForm({ ...form, color: e.target.value })}
                                className="w-8 h-8 rounded border border-[#c3c4c7] cursor-pointer p-0.5 bg-white"
                              />
                              <input
                                type="text"
                                value={form.color || "#10B981"}
                                onChange={(e) => setForm({ ...form, color: e.target.value })}
                                className="border border-[#c3c4c7] px-2.5 py-1 text-xs font-mono rounded-[3px] bg-white flex-1 uppercase"
                                placeholder="#10B981"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SECTION 3: FEATURES GRID & ICON SELECTOR */}
                    {activeSection === "features" && (
                      <div className="space-y-6">
                        <h2 className="text-lg font-bold text-[#1d2327] border-b border-[#f0f0f1] pb-2">
                          3. What We Offer (Features & Icon Management)
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Section Badge</label>
                            <input
                              type="text"
                              value={form.featuresBadge || "WHAT WE OFFER"}
                              onChange={(e) => setForm({ ...form, featuresBadge: e.target.value })}
                              className="w-full border border-[#c3c4c7] px-3 py-2 text-[14px] rounded-[3px] focus:border-[#2271b1] outline-none bg-white uppercase"
                              placeholder="WHAT WE OFFER"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Section Title</label>
                            <input
                              type="text"
                              value={form.featuresTitle || ""}
                              onChange={(e) => setForm({ ...form, featuresTitle: e.target.value })}
                              className="w-full border border-[#c3c4c7] px-3 py-2 text-[14px] font-bold rounded-[3px] focus:border-[#2271b1] outline-none bg-white"
                              placeholder="Complete Residential Lighting Services"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Section Subtitle</label>
                          <input
                            type="text"
                            value={form.featuresSubtitle || ""}
                            onChange={(e) => setForm({ ...form, featuresSubtitle: e.target.value })}
                            className="w-full border border-[#c3c4c7] px-3 py-2 text-[13px] rounded-[3px] focus:border-[#2271b1] outline-none bg-white"
                            placeholder="Professional installation with premium materials and full-service support from start to finish."
                          />
                        </div>

                        {/* Feature Cards Manager with Icon Selection */}
                        <div className="space-y-4 pt-3 border-t border-[#f0f0f1]">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Features Cards List ({form.features?.length || 0})</h3>
                              <p className="text-[11px] text-slate-500">Choose custom icons, title, and description for each card.</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const current = [...(form.features || [])];
                                current.push({ title: "New Feature Title", description: "Describe the feature benefit here.", icon: "FaLightbulb" });
                                setForm({ ...form, features: current });
                              }}
                              className="bg-white border border-[#2271b1] text-[#2271b1] hover:bg-[#f0f6fb] text-xs font-semibold px-2.5 py-1 rounded-[3px] transition-colors cursor-pointer"
                            >
                              + Add Feature Card
                            </button>
                          </div>

                          <div className="space-y-3">
                            {(form.features || []).map((feat: any, idx: number) => (
                              <div key={idx} className="p-3 bg-[#f9f9f9] border border-[#c3c4c7] rounded-[3px] flex flex-col md:flex-row gap-3 items-start">
                                <span className="text-xs font-bold text-slate-400 mt-2">#{idx + 1}</span>

                                {/* Icon Selector Column */}
                                <div className="w-full md:w-48 space-y-1">
                                  <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                                    Icon
                                  </label>
                                  <div className="flex items-center gap-2">
                                    <div className="w-9 h-9 rounded border border-[#c3c4c7] bg-white flex items-center justify-center flex-shrink-0">
                                      {renderIconPreview(feat.icon || "FaLightbulb")}
                                    </div>
                                    <select
                                      value={feat.icon || "FaLightbulb"}
                                      onChange={(e) => {
                                        const current = [...form.features];
                                        current[idx] = { ...current[idx], icon: e.target.value };
                                        setForm({ ...form, features: current });
                                      }}
                                      className="w-full border border-[#c3c4c7] bg-white text-xs px-2 py-1.5 rounded-[3px] outline-none focus:border-[#2271b1]"
                                    >
                                      {AVAILABLE_ICONS.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                          {opt.label}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>

                                {/* Title & Description Column */}
                                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2 w-full">
                                  <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase">Title</label>
                                    <input
                                      type="text"
                                      value={feat.title || ""}
                                      onChange={(e) => {
                                        const current = [...form.features];
                                        current[idx] = { ...current[idx], title: e.target.value };
                                        setForm({ ...form, features: current });
                                      }}
                                      className="w-full border border-[#c3c4c7] px-2 py-1.5 text-xs font-bold rounded-[3px] bg-white outline-none focus:border-[#2271b1]"
                                      placeholder="Feature Title"
                                    />
                                  </div>
                                  <div className="sm:col-span-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase">Description</label>
                                    <input
                                      type="text"
                                      value={feat.description || ""}
                                      onChange={(e) => {
                                        const current = [...form.features];
                                        current[idx] = { ...current[idx], description: e.target.value };
                                        setForm({ ...form, features: current });
                                      }}
                                      className="w-full border border-[#c3c4c7] px-2 py-1.5 text-xs rounded-[3px] bg-white outline-none focus:border-[#2271b1]"
                                      placeholder="Feature Description"
                                    />
                                  </div>
                                </div>

                                {/* Delete button */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const current = form.features.filter((_: any, i: number) => i !== idx);
                                    setForm({ ...form, features: current });
                                  }}
                                  className="p-1 text-red-500 hover:bg-red-50 rounded cursor-pointer mt-1 self-end md:self-center"
                                  title="Delete Card"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SECTION 4: WHY CHOOSE US */}
                    {activeSection === "why-choose-us" && (
                      <div className="space-y-6">
                        <h2 className="text-lg font-bold text-[#1d2327] border-b border-[#f0f0f1] pb-2">
                          4. Why Choose Us & Photo Collage
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Section Badge</label>
                            <input
                              type="text"
                              value={form.whyBadge || "WHY CHOOSE US"}
                              onChange={(e) => setForm({ ...form, whyBadge: e.target.value })}
                              className="w-full border border-[#c3c4c7] px-3 py-2 text-[14px] rounded-[3px] focus:border-[#2271b1] outline-none bg-white uppercase"
                              placeholder="WHY CHOOSE US"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Section Title</label>
                            <input
                              type="text"
                              value={form.whyTitle || "Professional Quality, Personal Service"}
                              onChange={(e) => setForm({ ...form, whyTitle: e.target.value })}
                              className="w-full border border-[#c3c4c7] px-3 py-2 text-[14px] font-bold rounded-[3px] focus:border-[#2271b1] outline-none bg-white"
                              placeholder="Professional Quality, Personal Service"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Section Subtitle Narrative</label>
                          <textarea
                            rows={2}
                            value={form.whyDescription || ""}
                            onChange={(e) => setForm({ ...form, whyDescription: e.target.value })}
                            className="w-full border border-[#c3c4c7] px-3 py-2 text-[13px] rounded-[3px] focus:border-[#2271b1] outline-none bg-white"
                            placeholder="We focus on delivering beautiful holiday lighting while making the entire process easy and hassle-free for you."
                          />
                        </div>

                        {/* Guarantee Checklist */}
                        <div className="space-y-3 pt-3 border-t border-[#f0f0f1]">
                          <div className="flex justify-between items-center">
                            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Service Guarantee Checklist</h3>
                            <button
                              type="button"
                              onClick={() => {
                                const current = [...(form.whyPoints || [])];
                                current.push("New Guarantee Point");
                                setForm({ ...form, whyPoints: current });
                              }}
                              className="bg-white border border-[#2271b1] text-[#2271b1] hover:bg-[#f0f6fb] text-xs font-semibold px-2.5 py-1 rounded-[3px] transition-colors cursor-pointer"
                            >
                              + Add Point
                            </button>
                          </div>

                          <div className="space-y-2">
                            {(form.whyPoints || []).map((pt: any, idx: number) => (
                              <div key={idx} className="flex gap-2 items-center bg-[#f9f9f9] p-2 border border-[#c3c4c7] rounded-[3px]">
                                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                <input
                                  type="text"
                                  value={typeof pt === 'string' ? pt : (pt.title || pt.text || "")}
                                  onChange={(e) => {
                                    const current = [...form.whyPoints];
                                    current[idx] = e.target.value;
                                    setForm({ ...form, whyPoints: current });
                                  }}
                                  className="flex-1 border border-[#c3c4c7] px-2.5 py-1 text-xs rounded-[3px] bg-white outline-none focus:border-[#2271b1]"
                                  placeholder="e.g. Free Quotes & Virtual Mockups"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const current = form.whyPoints.filter((_: any, i: number) => i !== idx);
                                    setForm({ ...form, whyPoints: current });
                                  }}
                                  className="p-1 text-red-500 hover:bg-red-50 rounded cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* CTA Link Management */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#f0f0f1]">
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-600 uppercase">Button Label</label>
                            <input
                              type="text"
                              value={form.whyCtaText || "Get Your Free Quote"}
                              onChange={(e) => setForm({ ...form, whyCtaText: e.target.value })}
                              className="w-full border border-[#c3c4c7] px-2.5 py-1.5 text-xs font-bold rounded-[3px] bg-white outline-none focus:border-[#2271b1]"
                              placeholder="Get Your Free Quote"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-600 uppercase">Action / Target Link</label>
                            <input
                              type="text"
                              value={form.whyCtaLink || "#quote"}
                              onChange={(e) => setForm({ ...form, whyCtaLink: e.target.value })}
                              className="w-full border border-[#c3c4c7] px-2.5 py-1.5 text-xs font-mono rounded-[3px] bg-white outline-none focus:border-[#2271b1]"
                              placeholder="#quote"
                            />
                          </div>
                        </div>

                        {/* 3 Collage Images */}
                        <div className="space-y-3 pt-3 border-t border-[#f0f0f1]">
                          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">3-Layer Photo Collage Images</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <ImageField
                              label="1. Main Image"
                              value={form.whyImage1 || ""}
                              onChange={(v) => setForm({ ...form, whyImage1: v })}
                            />
                            <ImageField
                              label="2. Bottom-Left Inset"
                              value={form.whyImage2 || ""}
                              onChange={(v) => setForm({ ...form, whyImage2: v })}
                            />
                            <ImageField
                              label="3. Top-Right Inset"
                              value={form.whyImage3 || ""}
                              onChange={(v) => setForm({ ...form, whyImage3: v })}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SECTION 5: DEDICATED CTA MANAGEMENT */}
                    {activeSection === "cta" && (
                      <div className="space-y-6">
                        <h2 className="text-lg font-bold text-[#1d2327] border-b border-[#f0f0f1] pb-2 flex items-center gap-2">
                          <Megaphone className="w-5 h-5 text-primary" /> 5. Call-To-Action (CTA Banner) Management
                        </h2>

                        <div className="p-4 bg-[#f9f9f9] border border-[#c3c4c7] rounded-[3px] space-y-4">
                          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Bottom Banner Content</h3>
                          <div className="space-y-3">
                            <div className="space-y-1">
                              <label className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">Banner Headline</label>
                              <input
                                type="text"
                                value={form.bottomCtaTitle || ""}
                                onChange={(e) => setForm({ ...form, bottomCtaTitle: e.target.value })}
                                className="w-full border border-[#c3c4c7] px-3 py-2 text-[14px] font-bold rounded-[3px] focus:border-[#2271b1] outline-none bg-white"
                                placeholder="Ready to Transform Your Home?"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">Banner Subtitle / Description</label>
                              <input
                                type="text"
                                value={form.bottomCtaDescription || ""}
                                onChange={(e) => setForm({ ...form, bottomCtaDescription: e.target.value })}
                                className="w-full border border-[#c3c4c7] px-3 py-2 text-[13px] rounded-[3px] focus:border-[#2271b1] outline-none bg-white"
                                placeholder="Join local homeowners who trust us to make their holidays shine"
                              />
                            </div>
                          </div>
                        </div>

                        {/* CTA Buttons & Target Links */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Primary CTA (Call Us Now) */}
                          <div className="p-4 border border-[#c3c4c7] rounded-[3px] bg-[#f9f9f9] space-y-3">
                            <span className="text-[11px] font-bold text-emerald-700 uppercase flex items-center gap-1">
                              <Phone className="w-3.5 h-3.5" /> Primary Action Button (Call)
                            </span>
                            <div className="space-y-1">
                              <label className="text-[11px] text-slate-600 font-bold">Button Text</label>
                              <input
                                type="text"
                                value={form.bottomCtaPrimaryText || "Call Us Now"}
                                onChange={(e) => setForm({ ...form, bottomCtaPrimaryText: e.target.value })}
                                className="w-full border border-[#c3c4c7] px-2.5 py-1.5 text-xs font-bold rounded-[3px] bg-white outline-none focus:border-[#2271b1]"
                                placeholder="Call Us Now"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[11px] text-slate-600 font-bold">Phone Link (tel:)</label>
                              <input
                                type="text"
                                value={form.bottomCtaPrimaryLink || "tel:6143017100"}
                                onChange={(e) => setForm({ ...form, bottomCtaPrimaryLink: e.target.value })}
                                className="w-full border border-[#c3c4c7] px-2.5 py-1.5 text-xs font-mono rounded-[3px] bg-white outline-none focus:border-[#2271b1]"
                                placeholder="tel:6143017100"
                              />
                            </div>
                          </div>

                          {/* Secondary CTA (Schedule Consultation) */}
                          <div className="p-4 border border-[#c3c4c7] rounded-[3px] bg-[#f9f9f9] space-y-3">
                            <span className="text-[11px] font-bold text-primary uppercase flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" /> Secondary Action Button (Modal)
                            </span>
                            <div className="space-y-1">
                              <label className="text-[11px] text-slate-600 font-bold">Button Text</label>
                              <input
                                type="text"
                                value={form.bottomCtaSecondaryText || "Schedule Free Consultation"}
                                onChange={(e) => setForm({ ...form, bottomCtaSecondaryText: e.target.value })}
                                className="w-full border border-[#c3c4c7] px-2.5 py-1.5 text-xs font-bold rounded-[3px] bg-white outline-none focus:border-[#2271b1]"
                                placeholder="Schedule Free Consultation"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[11px] text-slate-600 font-bold">Target Link</label>
                              <input
                                type="text"
                                value={form.bottomCtaSecondaryLink || "#quote"}
                                onChange={(e) => setForm({ ...form, bottomCtaSecondaryLink: e.target.value })}
                                className="w-full border border-[#c3c4c7] px-2.5 py-1.5 text-xs font-mono rounded-[3px] bg-white outline-none focus:border-[#2271b1]"
                                placeholder="#quote"
                              />
                              <p className="text-[10px] text-slate-500">Use <code className="text-[#2271b1] font-mono">#quote</code> to trigger consultation modal.</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Contact Phone Number</label>
                          <input
                            type="text"
                            value={form.bottomCtaPhone || "(614) 301-7100"}
                            onChange={(e) => setForm({ ...form, bottomCtaPhone: e.target.value })}
                            className="w-full border border-[#c3c4c7] px-3 py-2 text-[13px] rounded-[3px] focus:border-[#2271b1] outline-none bg-white font-medium"
                            placeholder="(614) 301-7100"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* SEO Tab View */
                  <div className="p-4 sm:p-6">
                    <SeoEditor
                      data={seo}
                      setData={setSeo}
                      pageSlug={form.slug || ""}
                      pageTitle={form.title || ""}
                      pageContent={form}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT SIDEBAR META BOXES */}
            <div className="w-full lg:w-72 flex-shrink-0 space-y-4">
              {/* Publish Box */}
              <div className="bg-white border border-[#c3c4c7] shadow-sm rounded-sm overflow-hidden">
                <div className="px-3 py-2 border-b border-[#c3c4c7] bg-[#f6f7f7]">
                  <h2 className="text-[13px] font-semibold text-[#1d2327] m-0">Publish</h2>
                </div>
                <div className="p-3 space-y-2.5 text-[12px] text-[#2c3338]">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-[#646970]">
                      <Eye className="w-3.5 h-3.5" /> Status:
                    </span>
                    <select
                      value={form.status || "published"}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                      className="bg-white border border-[#8c8f94] text-[12px] px-1.5 py-0.5 rounded-[3px] outline-none focus:border-[#2271b1]"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-[#646970]">
                      <Calendar className="w-3.5 h-3.5" /> Date:
                    </span>
                    <strong>{new Date().toLocaleDateString()}</strong>
                  </div>

                  {form.slug && (
                    <div className="pt-2 border-t border-[#f0f0f1] mt-2">
                      <Link
                        href={`/services/${form.slug}`}
                        target="_blank"
                        className="text-[#2271b1] hover:underline flex items-center gap-1 text-[12px]"
                      >
                        View Service <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  )}
                </div>

                <div className="bg-[#f6f7f7] border-t border-[#c3c4c7] px-3 py-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleDelete(form)}
                    className="text-[#d63638] underline text-[12px] hover:text-[#b32d2e] cursor-pointer"
                  >
                    Trash
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveService}
                    disabled={saving}
                    className="bg-[#2271b1] text-white text-[12px] font-semibold px-3 py-1 rounded-[3px] border border-[#135e96] shadow-[0_1px_0_#135e96] hover:bg-[#135e96] disabled:opacity-50 cursor-pointer flex items-center gap-1"
                  >
                    {saving && <Loader2 className="w-3 h-3 animate-spin" />}
                    {saving ? "Updating..." : "Update"}
                  </button>
                </div>
              </div>

              {/* Attributes Box */}
              <div className="bg-white border border-[#c3c4c7] shadow-sm rounded-sm overflow-hidden">
                <div className="px-3 py-2 border-b border-[#c3c4c7] bg-[#f6f7f7]">
                  <h2 className="text-[13px] font-semibold text-[#1d2327] m-0">Attributes</h2>
                </div>
                <div className="p-3 space-y-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-[#1d2327]">Category Tag</label>
                    <input
                      type="text"
                      value={form.tag || "RESIDENTIAL"}
                      onChange={(e) => setForm({ ...form, tag: e.target.value })}
                      className="w-full border border-[#8c8f94] bg-white px-2 py-1 text-[12px] rounded-[3px] outline-none focus:border-[#2271b1] uppercase font-bold text-emerald-700"
                      placeholder="RESIDENTIAL"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-[#1d2327]">Service Number</label>
                    <input
                      type="text"
                      value={form.number || "01"}
                      onChange={(e) => setForm({ ...form, number: e.target.value })}
                      className="w-full border border-[#8c8f94] bg-white px-2 py-1 text-[12px] rounded-[3px] outline-none focus:border-[#2271b1] font-mono"
                      placeholder="01"
                    />
                  </div>
                </div>
              </div>

              {/* Featured Image Box */}
              <div className="bg-white border border-[#c3c4c7] shadow-sm rounded-sm overflow-hidden">
                <div className="px-3 py-2 border-b border-[#c3c4c7] bg-[#f6f7f7]">
                  <h2 className="text-[13px] font-semibold text-[#1d2327] m-0">Featured Image</h2>
                </div>
                <div className="p-3">
                  <ImageField
                    label=""
                    value={form.image || form.heroImage || ""}
                    onChange={(v) => setForm({ ...form, image: v, heroImage: form.heroImage || v })}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
