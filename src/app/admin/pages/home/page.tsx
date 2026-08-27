"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, Loader2, LayoutTemplate, Type, Image as ImageIcon, ChevronRight, Star, Phone, Plus, Trash2, Mail, Users, CircleHelp, BookOpen } from "lucide-react";
import Link from "next/link";
import ImageField from "@/components/admin/ImageField";
import ContentSelector from "@/components/admin/ContentSelector";
import MediaSelector from "@/components/admin/MediaSelector";
import BlogSelector from "@/components/admin/BlogSelector";
import dynamic from "next/dynamic";
const RichTextEditor = dynamic(() => import("@/components/admin/RichTextEditor"), { 
  ssr: false,
  loading: () => <div className="h-64 bg-[#f6f7f7] animate-pulse border border-[#c3c4c7] rounded-sm flex items-center justify-center text-[#8c8f94] text-xs">Loading Rich Text Editor...</div>
});

const defaultTestimonialsList = [
  {
    id: "1",
    author: "Sarah & Michael Jenkins",
    role: "Homeowner",
    company: "",
    location: "Dublin, OH",
    service: "Residential Lighting",
    quote: "Our house was the highlight of the neighborhood! The crew was prompt, respectful, and the lights looked breathtaking all season long without a single bulb going out.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "2",
    author: "David Miller",
    role: "Property Manager",
    company: "Metro Commercial",
    location: "New Albany, OH",
    service: "Commercial Display",
    quote: "They handled our entire shopping center plaza display with incredible professionalism. Commercial-grade lighting, fast installation, and zero hassle.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "3",
    author: "Emily Thompson",
    role: "Homeowner",
    company: "",
    location: "Bexley, OH",
    service: "Permanent Lighting",
    quote: "We upgraded to the permanent lighting system and couldn't be happier. We switch between holiday colors and warm architectural lighting with the phone app!",
    rating: 5,
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "4",
    author: "Robert Henderson",
    role: "Estate Owner",
    company: "",
    location: "Upper Arlington, OH",
    service: "Holiday Magic",
    quote: "The team took down and packed everything away neatly in January. We didn't have to climb a ladder once. Worth every penny for the peace of mind.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "5",
    author: "Jessica Williams",
    role: "Homeowner",
    company: "",
    location: "Powell, OH",
    service: "Custom Design",
    quote: "From the custom design consultation to the takedown service, CLOC provided 5-star service. Our children were mesmerized by the roofline and tree wraps.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
  },
];

const defaultFaqItems = [
  {
    question: "What services are included with professional Christmas light installation?",
    answer: "Our professional installation includes custom lighting design tailored to your home or business, all Christmas lights and décor provided and professionally installed, ongoing maintenance throughout the holiday season, full takedown after the season ends, and all lights removed and stored at our facility — no storage required on your end."
  },
  {
    question: "What kind of lights do you install?",
    answer: "We install commercial-grade LED lights in C9 and C7 sizes, mini lights for trees and bushes, lit wreaths, garland, and permanent smart lighting systems. All commercial-grade LEDs are custom-cut to your roofline for a clean, professional finish."
  },
  {
    question: "When should I schedule my holiday lighting installation?",
    answer: "We recommend scheduling as early as September or October to secure your preferred installation date. Our schedule fills up quickly as the holiday season approaches, but we install through December."
  },
  {
    question: "What happens if a bulb goes out or a strand falls down?",
    answer: "Our service includes 100% free proactive maintenance and 24-hour service guarantee throughout the entire holiday season. If a bulb burns out or a timer gets knocked off, simply let us know and our service crew will fix it promptly at no extra charge."
  },
  {
    question: "When do you take the lights down in January?",
    answer: "Takedown service begins the first week of January and continues through the month. We carefully label, pack, and store all lighting and equipment in our climate-controlled warehouse until next season."
  },
  {
    question: "Do you offer permanent year-round lighting options?",
    answer: "Yes! We install premium smart architectural permanent lighting (such as Celebright & Trimlight systems) that sit discreetly under your eaves. You can control colors, patterns, and timers directly from your smartphone for any holiday or occasion all year long."
  }
];

const defaultBenefits = [
  { text: "Custom Lighting Design & Layout" },
  { text: "Commercial-Grade LED Lights & Custom Wiring" },
  { text: "Professional Installation & Heavy-Duty Clips" },
  { text: "Proactive In-Season Maintenance (24h Guarantee)" },
  { text: "Timely Takedown in January" },
  { text: "Safe Climate-Controlled Storage Included" }
];

export default function HomeEditor() {
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("hero");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [showPortfolioMedia, setShowPortfolioMedia] = useState(false);

  useEffect(() => {
    // Fetch the raw content from the API directly to get the latest DB state
    fetch("/api/content")
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error("Failed to load content:", err));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setMessage("Homepage content saved successfully!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("Failed to save content.");
      }
    } catch (err) {
      setMessage("Error saving content.");
    } finally {
      setSaving(false);
    }
  };

  const updateSection = (section: string, field: string, value: any) => {
    setData((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  const tabs = [
    { id: "hero", label: "Hero Section", icon: LayoutTemplate },
    { id: "about", label: "About Section", icon: Type },
    { id: "services", label: "Services Section", icon: LayoutTemplate },
    { id: "whyChooseUs", label: "How We Work (Process)", icon: ImageIcon },
    { id: "portfolio", label: "Portfolio Section", icon: ImageIcon },
    { id: "serviceAreas", label: "Service Areas (Van & Map)", icon: Users },
    { id: "testimonials", label: "Testimonials", icon: Type },
    { id: "faq", label: "FAQ Section", icon: CircleHelp },
    { id: "quote", label: "Homepage Contact", icon: Mail },
    { id: "blog", label: "Blog Section", icon: BookOpen },
  ];

  return (
    <div className="max-w-5xl mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Link href="/admin/pages" className="hover:text-gray-900 transition-colors">Pages</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-900">Home</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Homepage</h1>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-5 py-2.5 rounded-xl font-medium transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-xl mb-6 text-sm font-medium ${message.includes("success") ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="md:col-span-1 space-y-1">
          {tabs.map((tab: any) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id
                  ? "bg-primary/10 text-primary border border-primary/20 hover:bg-gray-100"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                  }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Editor Area */}
        <div className="md:col-span-3 bg-white shadow-sm border border-gray-200 rounded-2xl p-6">
          <AnimatePresence mode="wait">
            {activeTab === "hero" && (
              <motion.div key="hero" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <h2 className="text-2xl font-extrabold text-slate-900 mb-8 border-b border-slate-100 pb-6">Hero Section</h2>

                {/* Main Headline (3-Part Structured) */}
                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 space-y-4">
                  <h3 className="text-sm font-bold text-gray-900">Main Headline (3-Part Structured)</h3>
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Part 1 (White Intro Line)</label>
                      <input
                        type="text"
                        value={data.hero?.title?.part1 ?? data.hero?.headlines?.[0]?.text ?? "Illuminate Your"}
                        onChange={(e) => updateSection("hero", "title", { ...(data.hero?.title || {}), part1: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:border-primary focus:outline-none"
                        placeholder="Illuminate Your"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs uppercase tracking-wider text-amber-600 font-bold">Part 2 (Gold/Red Highlighted Line)</label>
                      <input
                        type="text"
                        value={data.hero?.title?.part2 ?? data.hero?.headlines?.[1]?.text ?? "Holiday Season"}
                        onChange={(e) => updateSection("hero", "title", { ...(data.hero?.title || {}), part2: e.target.value })}
                        className="w-full bg-white border border-amber-300 font-bold text-amber-700 rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
                        placeholder="Holiday Season"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs uppercase tracking-wider text-amber-600 font-bold">Part 3 (Gold/Red Accent Line)</label>
                      <input
                        type="text"
                        value={data.hero?.title?.part3 ?? data.hero?.headlines?.[2]?.text ?? "With Custom Magic"}
                        onChange={(e) => updateSection("hero", "title", { ...(data.hero?.title || {}), part3: e.target.value })}
                        className="w-full bg-white border border-amber-300 font-bold text-amber-700 rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
                        placeholder="With Custom Magic"
                      />
                    </div>
                  </div>
                </div>

                {/* Subtitle / Description */}
                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 space-y-2">
                  <label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Subtitle & Narrative</label>
                  <textarea
                    rows={3}
                    value={data.hero?.subtitle ?? data.hero?.description ?? ""}
                    onChange={(e) => {
                      updateSection("hero", "subtitle", e.target.value);
                      updateSection("hero", "description", e.target.value);
                    }}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:border-primary focus:outline-none"
                    placeholder="Commercial & residential holiday lighting designed, installed, maintained, and stored for you."
                  />
                </div>

                {/* CTA Buttons */}
                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 space-y-4">
                  <h3 className="text-sm font-bold text-gray-900">Call-To-Action (CTA)</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Button Text</label>
                      <input
                        type="text"
                        value={data.hero?.cta?.subtext ?? data.hero?.cta?.text ?? data.hero?.buttons?.[0]?.text ?? "Get My Free Quote"}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateSection("hero", "cta", { ...(data.hero?.cta || {}), text: val, subtext: val });
                        }}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:border-primary focus:outline-none"
                        placeholder="Get My Free Quote"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Target Link / Anchor</label>
                      <input
                        type="text"
                        value={data.hero?.cta?.link ?? data.hero?.buttons?.[0]?.href ?? "#freequote"}
                        onChange={(e) => updateSection("hero", "cta", { ...(data.hero?.cta || {}), link: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:border-primary focus:outline-none"
                        placeholder="#freequote or /contact"
                      />
                    </div>
                  </div>
                </div>

                {/* Imagery */}
                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 space-y-4">
                  <h3 className="text-sm font-bold text-gray-900">Hero Imagery & Christmas Tree Assets</h3>
                  <ImageField 
                    label="Main Background Image"
                    value={data.hero?.bgImage || data.hero?.images?.[0] || ""}
                    onChange={(url) => {
                      updateSection("hero", "bgImage", url);
                      updateSection("hero", "images", [url]);
                    }}
                    altValue={data.hero?.bgImageAlt || ""}
                    onAltChange={(alt) => updateSection("hero", "bgImageAlt", alt)}
                    description="High-resolution hero background night image."
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <ImageField 
                      label="Left Christmas Tree Image"
                      value={data.hero?.leftTreeImage || ""}
                      onChange={(url) => updateSection("hero", "leftTreeImage", url)}
                      description="Left bottom corner tree graphic."
                    />
                    <ImageField 
                      label="Right Christmas Tree Image"
                      value={data.hero?.rightTreeImage || ""}
                      onChange={(url) => updateSection("hero", "rightTreeImage", url)}
                      description="Right bottom corner tree graphic."
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "about" && (
              <motion.div key="about" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <h2 className="text-2xl font-extrabold text-slate-900 mb-8 border-b border-slate-100 pb-6">About Section (Holiday Lighting Intro)</h2>

                {/* Heading */}
                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 space-y-3">
                  <label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Gradient Title Text</label>
                  <input
                    type="text"
                    value={data.about?.headline?.highlight || data.about?.headline?.text || data.about?.title || "Serving Columbus With Stress Free Holiday Lighting"}
                    onChange={(e) => {
                      const val = e.target.value;
                      updateSection("about", "headline", { ...(data.about?.headline || {}), highlight: val, text: val });
                      updateSection("about", "title", val);
                    }}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 text-sm font-bold focus:border-primary focus:outline-none"
                    placeholder="Serving Columbus With Stress Free Holiday Lighting"
                  />
                </div>

                {/* Description Narrative */}
                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 space-y-2">
                  <label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Narrative & Paragraphs</label>
                  <textarea
                    rows={5}
                    value={data.about?.description || ""}
                    onChange={(e) => updateSection("about", "description", e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:border-primary focus:outline-none"
                    placeholder="The holiday season is all about making memories, and nothing brings that magic to life like a beautifully lit home...&#10;&#10;From custom design and installation to maintenance, removal, and storage, we handle everything..."
                  />
                </div>

                {/* Buttons (CTAs) */}
                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 space-y-4">
                  <h3 className="text-sm font-bold text-gray-900">Call to Action Buttons</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-3">
                      <p className="text-xs font-bold text-primary uppercase tracking-wider">Primary CTA (Quote Button)</p>
                      <div className="space-y-1.5">
                        <label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Button Text</label>
                        <input
                          type="text"
                          value={data.about?.buttons?.[0]?.text ?? "Get My Free Quote"}
                          onChange={(e) => {
                            const nb = [...(data.about?.buttons || [{ text: "Get My Free Quote", href: "#freequote" }, { text: "View Gallery", href: "/gallery" }])];
                            nb[0] = { ...nb[0], text: e.target.value };
                            updateSection("about", "buttons", nb);
                          }}
                          className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-gray-900 text-sm focus:border-primary focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Link (href / #anchor)</label>
                        <input
                          type="text"
                          value={data.about?.buttons?.[0]?.href ?? "#freequote"}
                          onChange={(e) => {
                            const nb = [...(data.about?.buttons || [{ text: "Get My Free Quote", href: "#freequote" }, { text: "View Gallery", href: "/gallery" }])];
                            nb[0] = { ...nb[0], href: e.target.value };
                            updateSection("about", "buttons", nb);
                          }}
                          className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-gray-900 text-sm focus:border-primary focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-3">
                      <p className="text-xs font-bold text-primary uppercase tracking-wider">Secondary CTA (Gallery Button)</p>
                      <div className="space-y-1.5">
                        <label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Button Text</label>
                        <input
                          type="text"
                          value={data.about?.buttons?.[1]?.text ?? "View Gallery"}
                          onChange={(e) => {
                            const nb = [...(data.about?.buttons || [{ text: "Get My Free Quote", href: "#freequote" }, { text: "View Gallery", href: "/gallery" }])];
                            if (!nb[1]) nb[1] = { text: "View Gallery", href: "/gallery" };
                            nb[1] = { ...nb[1], text: e.target.value };
                            updateSection("about", "buttons", nb);
                          }}
                          className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-gray-900 text-sm focus:border-primary focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Link (href / page)</label>
                        <input
                          type="text"
                          value={data.about?.buttons?.[1]?.href ?? "/gallery"}
                          onChange={(e) => {
                            const nb = [...(data.about?.buttons || [{ text: "Get My Free Quote", href: "#freequote" }, { text: "View Gallery", href: "/gallery" }])];
                            if (!nb[1]) nb[1] = { text: "View Gallery", href: "/gallery" };
                            nb[1] = { ...nb[1], href: e.target.value };
                            updateSection("about", "buttons", nb);
                          }}
                          className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-gray-900 text-sm focus:border-primary focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Media */}
                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 space-y-4">
                  <h3 className="text-sm font-bold text-gray-900">Owner Portrait / Section Image</h3>
                  <ImageField 
                    label="Owner Portrait Image"
                    value={data.about?.image?.src || ""}
                    onChange={(url) => {
                      setData((prev: any) => ({ 
                        ...prev, 
                        about: { 
                          ...prev.about, 
                          image: { ...prev.about?.image, src: url } 
                        } 
                      }));
                    }}
                    altValue={data.about?.image?.alt || ""}
                    onAltChange={(alt) => {
                      setData((prev: any) => ({
                        ...prev,
                        about: {
                          ...prev.about,
                          image: { ...prev.about?.image, alt: alt }
                        }
                      }));
                    }}
                    description="Vertical owner portrait shown on the left side."
                  />
                </div>
              </motion.div>
            )}

            {activeTab === "services" && (
              <motion.div key="services" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <h2 className="text-2xl font-extrabold text-slate-900 mb-8 border-b border-slate-100 pb-6">Services Section (Award-Winning Lighting)</h2>

                {/* Heading */}
                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 space-y-3">
                  <label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Gradient Title Text</label>
                  <input
                    type="text"
                    value={data.services?.title || data.services?.headline?.highlight || "Premium Christmas Lighting Services"}
                    onChange={(e) => {
                      const val = e.target.value;
                      updateSection("services", "title", val);
                      updateSection("services", "headline", { ...(data.services?.headline || {}), highlight: val, text: val });
                    }}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 text-sm font-bold focus:border-primary focus:outline-none"
                    placeholder="Premium Christmas Lighting Services"
                  />
                </div>

                {/* Subtitle & Narrative */}
                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 space-y-2">
                  <label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Subtitle / Section Summary</label>
                  <textarea
                    rows={3}
                    value={data.services?.subtitle || (Array.isArray(data.services?.description) ? data.services.description.join(" ") : (data.services?.description || ""))}
                    onChange={(e) => {
                      updateSection("services", "subtitle", e.target.value);
                      updateSection("services", "description", e.target.value);
                    }}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:border-primary focus:outline-none"
                    placeholder="Custom residential and commercial holiday lighting designed, installed, maintained, and stored for you in Columbus, OH."
                  />
                </div>

                {/* Featured Services Selector */}
                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 space-y-4">
                  <h3 className="text-sm font-bold text-gray-900">Featured Services Selection</h3>
                  <p className="text-xs text-slate-500">Pick and reorder which services are featured on the homepage cards grid.</p>
                  <ContentSelector
                    type="services"
                    label="Homepage Featured Services"
                    selectedItems={data.services?.services}
                    onSelect={(items) => updateSection("services", "services", items)}
                  />
                </div>

                {/* Bottom CTA */}
                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 space-y-4">
                  <h3 className="text-sm font-bold text-gray-900">Bottom Call to Action Button</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-2">
                      <label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Button Text</label>
                      <input
                        type="text"
                        value={data.services?.cta?.buttonText ?? "View All Services"}
                        onChange={(e) => updateSection("services", "cta", { ...(data.services?.cta || {}), buttonText: e.target.value })}
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-gray-900 text-sm focus:border-primary focus:outline-none"
                        placeholder="View All Services"
                      />
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-2">
                      <label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Button Target Link</label>
                      <input
                        type="text"
                        value={data.services?.cta?.buttonLink ?? "/services"}
                        onChange={(e) => updateSection("services", "cta", { ...(data.services?.cta || {}), buttonLink: e.target.value })}
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-gray-900 text-sm focus:border-primary focus:outline-none"
                        placeholder="/services"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {(activeTab === "serviceAreas" || activeTab === "leadership") && (
              <motion.div key="serviceAreas" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Service Areas & Animated Van Section</h2>
                    <p className="text-gray-500 text-sm mt-1">Configure service area headlines, background map, service vehicle, and feature step cards.</p>
                  </div>
                  <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">Section 6</span>
                </div>

                {/* 1. Header Intro */}
                <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6 shadow-xl space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <Type className="w-5 h-5 text-primary" />
                    1. Section Header
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Main Title (Gradient Highlighted)</label>
                      <input
                        type="text"
                        value={data.serviceAreas?.title ?? data.leadership?.section?.headline ?? "Areas We Are Serving"}
                        onChange={(e) => {
                          setData((prev: any) => ({
                            ...prev,
                            serviceAreas: { ...(prev.serviceAreas || {}), title: e.target.value },
                            leadership: { ...(prev.leadership || {}), section: { ...(prev.leadership?.section || {}), headline: e.target.value } }
                          }));
                        }}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all"
                        placeholder="e.g. Areas We Are Serving"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Subtitle / Tagline</label>
                      <input
                        type="text"
                        value={data.serviceAreas?.subtitle ?? data.leadership?.section?.description ?? "Custom lighting installed by professionals."}
                        onChange={(e) => {
                          setData((prev: any) => ({
                            ...prev,
                            serviceAreas: { ...(prev.serviceAreas || {}), subtitle: e.target.value },
                            leadership: { ...(prev.leadership || {}), section: { ...(prev.leadership?.section || {}), description: e.target.value } }
                          }));
                        }}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all"
                        placeholder="e.g. Custom lighting installed by professionals."
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Map & Vehicle Media */}
                <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6 shadow-xl space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-primary" />
                    2. Map & Service Vehicle Media
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ImageField
                      label="Service Area Background Map"
                      value={data.serviceAreas?.mapImage || "/images/realmap.jpeg"}
                      onChange={(url) => {
                        setData((prev: any) => ({
                          ...prev,
                          serviceAreas: { ...(prev.serviceAreas || {}), mapImage: url }
                        }));
                      }}
                      description="Background map shown beneath the sliding vehicle."
                    />
                    <ImageField
                      label="Service Vehicle (Van / Truck)"
                      value={data.serviceAreas?.vehicleImage || "/images/car2.png"}
                      onChange={(url) => {
                        setData((prev: any) => ({
                          ...prev,
                          serviceAreas: { ...(prev.serviceAreas || {}), vehicleImage: url }
                        }));
                      }}
                      description="Vehicle PNG image with shadow and interactive dust animation."
                    />
                  </div>
                </div>

                {/* 3. Highlight Step Cards */}
                <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6 shadow-xl space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      3. Service Highlight Steps
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        const steps = [...(data.serviceAreas?.steps || [
                          { number: "01", title: "Multiple Locations", description: "With strategically located stores across the region, we deliver premium service right at your doorstep—fast, reliable, and professional.", icon: "FaMapMarkerAlt", color: "#EF4444", features: ["4+ store locations", "Local service teams", "Fast response times"] },
                          { number: "02", title: "24/7 Availability", description: "Our dedicated team is available around the clock to handle your Christmas lighting needs, ensuring timely service whenever you need it.", icon: "FaClock", color: "#F59E0B", features: ["Always available", "Emergency services", "Flexible scheduling"] },
                          { number: "03", title: "Fast Response", description: "We pride ourselves on quick response times with an average of 30 minutes from inquiry to on-site assessment for your lighting project.", icon: "FaCar", color: "#10B981", features: ["30min avg response", "Quick assessments", "Rapid installation"] }
                        ])];
                        steps.push({
                          number: String(steps.length + 1).padStart(2, "0"),
                          title: "New Highlight",
                          description: "Highlight description...",
                          icon: "FaCheckCircle",
                          color: "#EF4444",
                          features: ["Feature point 1", "Feature point 2"]
                        });
                        setData((prev: any) => ({
                          ...prev,
                          serviceAreas: { ...(prev.serviceAreas || {}), steps }
                        }));
                      }}
                      className="px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 text-xs font-bold rounded-lg transition-colors"
                    >
                      + Add Step Card
                    </button>
                  </div>

                  <div className="space-y-6">
                    {(data.serviceAreas?.steps || [
                      { number: "01", title: "Multiple Locations", description: "With strategically located stores across the region, we deliver premium service right at your doorstep—fast, reliable, and professional.", icon: "FaMapMarkerAlt", color: "#EF4444", features: ["4+ store locations", "Local service teams", "Fast response times"] },
                      { number: "02", title: "24/7 Availability", description: "Our dedicated team is available around the clock to handle your Christmas lighting needs, ensuring timely service whenever you need it.", icon: "FaClock", color: "#F59E0B", features: ["Always available", "Emergency services", "Flexible scheduling"] },
                      { number: "03", title: "Fast Response", description: "We pride ourselves on quick response times with an average of 30 minutes from inquiry to on-site assessment for your lighting project.", icon: "FaCar", color: "#10B981", features: ["30min avg response", "Quick assessments", "Rapid installation"] }
                    ]).map((step: any, idx: number) => (
                      <div key={idx} className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-4 relative">
                        <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                          <span className="font-bold text-sm text-gray-900">Card {step.number || idx + 1}: {step.title}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const steps = (data.serviceAreas?.steps || []).filter((_: any, i: number) => i !== idx);
                              setData((prev: any) => ({
                                ...prev,
                                serviceAreas: { ...(prev.serviceAreas || {}), steps }
                              }));
                            }}
                            className="text-red-500 hover:text-red-700 text-xs font-bold flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Remove Card
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Number</label>
                            <input
                              type="text"
                              value={step.number || ""}
                              onChange={(e) => {
                                const steps = [...(data.serviceAreas?.steps || [])];
                                steps[idx] = { ...steps[idx], number: e.target.value };
                                setData((prev: any) => ({ ...prev, serviceAreas: { ...(prev.serviceAreas || {}), steps } }));
                              }}
                              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-slate-900"
                              placeholder="01"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Title</label>
                            <input
                              type="text"
                              value={step.title || ""}
                              onChange={(e) => {
                                const steps = [...(data.serviceAreas?.steps || [])];
                                steps[idx] = { ...steps[idx], title: e.target.value };
                                setData((prev: any) => ({ ...prev, serviceAreas: { ...(prev.serviceAreas || {}), steps } }));
                              }}
                              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-slate-900"
                              placeholder="Multiple Locations"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Accent Color</label>
                            <div className="flex gap-2 items-center">
                              <input
                                type="color"
                                value={step.color || "#EF4444"}
                                onChange={(e) => {
                                  const steps = [...(data.serviceAreas?.steps || [])];
                                  steps[idx] = { ...steps[idx], color: e.target.value };
                                  setData((prev: any) => ({ ...prev, serviceAreas: { ...(prev.serviceAreas || {}), steps } }));
                                }}
                                className="w-9 h-9 rounded-lg border border-gray-200 cursor-pointer"
                              />
                              <input
                                type="text"
                                value={step.color || "#EF4444"}
                                onChange={(e) => {
                                  const steps = [...(data.serviceAreas?.steps || [])];
                                  steps[idx] = { ...steps[idx], color: e.target.value };
                                  setData((prev: any) => ({ ...prev, serviceAreas: { ...(prev.serviceAreas || {}), steps } }));
                                }}
                                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-slate-900"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Description</label>
                          <textarea
                            rows={2}
                            value={step.description || ""}
                            onChange={(e) => {
                              const steps = [...(data.serviceAreas?.steps || [])];
                              steps[idx] = { ...steps[idx], description: e.target.value };
                              setData((prev: any) => ({ ...prev, serviceAreas: { ...(prev.serviceAreas || {}), steps } }));
                            }}
                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-slate-900"
                            placeholder="Description..."
                          />
                        </div>

                        {/* Bullet Points */}
                        <div className="space-y-2 pt-2 border-t border-gray-200">
                          <div className="flex justify-between items-center">
                            <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Feature Bullets</label>
                            <button
                              type="button"
                              onClick={() => {
                                const steps = [...(data.serviceAreas?.steps || [])];
                                const features = [...(steps[idx]?.features || [])];
                                features.push("New Feature");
                                steps[idx] = { ...steps[idx], features };
                                setData((prev: any) => ({ ...prev, serviceAreas: { ...(prev.serviceAreas || {}), steps } }));
                              }}
                              className="text-primary hover:underline text-xs font-bold"
                            >
                              + Add Bullet
                            </button>
                          </div>
                          <div className="space-y-1.5">
                            {(step.features || []).map((feat: string, fIdx: number) => (
                              <div key={fIdx} className="flex gap-2 items-center">
                                <input
                                  type="text"
                                  value={feat}
                                  onChange={(e) => {
                                    const steps = [...(data.serviceAreas?.steps || [])];
                                    const features = [...(steps[idx]?.features || [])];
                                    features[fIdx] = e.target.value;
                                    steps[idx] = { ...steps[idx], features };
                                    setData((prev: any) => ({ ...prev, serviceAreas: { ...(prev.serviceAreas || {}), steps } }));
                                  }}
                                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-slate-900"
                                  placeholder="Bullet point text..."
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const steps = [...(data.serviceAreas?.steps || [])];
                                    const features = (steps[idx]?.features || []).filter((_: any, i: number) => i !== fIdx);
                                    steps[idx] = { ...steps[idx], features };
                                    setData((prev: any) => ({ ...prev, serviceAreas: { ...(prev.serviceAreas || {}), steps } }));
                                  }}
                                  className="text-red-500 hover:text-red-700 text-xs px-1"
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "portfolio" && (
              <motion.div key="portfolio" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Portfolio & Work Showcase Section</h2>
                    <p className="text-gray-500 text-sm mt-1">Configure headers, marquee settings, and call-to-action button for the homepage showcase.</p>
                  </div>
                  <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">Section 5</span>
                </div>

                {/* Intro Panel */}
                <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6 shadow-xl space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <Type className="w-5 h-5 text-primary" />
                    1. Section Intro & Headlines
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Section Badge</label>
                      <input
                        type="text"
                        value={data.workShowcase?.badge ?? data.portfolio?.section?.badge ?? "OUR WORK"}
                        onChange={(e) => {
                          setData((prev: any) => ({
                            ...prev,
                            workShowcase: { ...(prev.workShowcase || {}), badge: e.target.value },
                            portfolio: { ...(prev.portfolio || {}), section: { ...(prev.portfolio?.section || {}), badge: e.target.value } }
                          }));
                        }}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all"
                        placeholder="e.g. OUR WORK"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Headline Prefix (Top Small Heading)</label>
                      <input
                        type="text"
                        value={data.workShowcase?.title?.prefix ?? data.portfolio?.section?.prefix ?? data.portfolio?.section?.headlinePrefix ?? "EXPERIENCE THE MAGIC"}
                        onChange={(e) => {
                          setData((prev: any) => ({
                            ...prev,
                            workShowcase: {
                              ...(prev.workShowcase || {}),
                              title: { ...(prev.workShowcase?.title || {}), prefix: e.target.value }
                            },
                            portfolio: {
                              ...(prev.portfolio || {}),
                              section: { ...(prev.portfolio?.section || {}), prefix: e.target.value, headlinePrefix: e.target.value }
                            }
                          }));
                        }}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all"
                        placeholder="e.g. EXPERIENCE THE MAGIC"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Main Headline (Gradient Gold-to-Red Highlight)</label>
                      <input
                        type="text"
                        value={data.workShowcase?.title?.main ?? data.portfolio?.section?.headline ?? data.portfolio?.section?.title ?? "PORTFOLIO"}
                        onChange={(e) => {
                          setData((prev: any) => ({
                            ...prev,
                            workShowcase: {
                              ...(prev.workShowcase || {}),
                              title: { ...(prev.workShowcase?.title || {}), main: e.target.value }
                            },
                            portfolio: {
                              ...(prev.portfolio || {}),
                              section: { ...(prev.portfolio?.section || {}), headline: e.target.value, title: e.target.value }
                            }
                          }));
                        }}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all font-bold"
                        placeholder="e.g. PORTFOLIO"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Section Description</label>
                      <textarea
                        rows={3}
                        value={data.workShowcase?.description ?? data.portfolio?.section?.description ?? "Browse our recent holiday lighting displays and permanent architectural lighting installations across Columbus."}
                        onChange={(e) => {
                          setData((prev: any) => ({
                            ...prev,
                            workShowcase: { ...(prev.workShowcase || {}), description: e.target.value },
                            portfolio: { ...(prev.portfolio || {}), section: { ...(prev.portfolio?.section || {}), description: e.target.value } }
                          }));
                        }}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all"
                        placeholder="Browse our recent holiday lighting displays..."
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom CTA Panel */}
                <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6 shadow-xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <ChevronRight className="w-5 h-5 text-primary" />
                    2. Call to Action Button
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Button Text</label>
                      <input
                        type="text"
                        value={data.workShowcase?.cta ?? data.portfolio?.button?.text ?? "View Full Gallery"}
                        onChange={(e) => {
                          setData((prev: any) => ({
                            ...prev,
                            workShowcase: { ...(prev.workShowcase || {}), cta: e.target.value },
                            portfolio: { ...(prev.portfolio || {}), button: { ...(prev.portfolio?.button || {}), text: e.target.value } }
                          }));
                        }}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all"
                        placeholder="e.g. View Full Gallery"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Destination Link</label>
                      <input
                        type="text"
                        value={data.workShowcase?.ctaLink ?? data.portfolio?.button?.link ?? "/gallery"}
                        onChange={(e) => {
                          setData((prev: any) => ({
                            ...prev,
                            workShowcase: { ...(prev.workShowcase || {}), ctaLink: e.target.value },
                            portfolio: { ...(prev.portfolio || {}), button: { ...(prev.portfolio?.button || {}), link: e.target.value } }
                          }));
                        }}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all"
                        placeholder="e.g. /gallery"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Custom Showcase Images */}
                <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6 shadow-xl space-y-4">
                  <div className="flex flex-wrap justify-between items-center gap-2">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-primary" />
                        3. Showcase Gallery Images (Dual Marquees)
                      </h3>
                      <p className="text-gray-500 text-xs">Add, upload, or remove images displayed in the rotating showcase.</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setShowPortfolioMedia(true)}
                        className="px-3 py-1.5 bg-primary text-white hover:bg-primary/90 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" /> Pick / Upload Image
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const currentImages = [...(data.workShowcase?.images || data.portfolio?.images || [])];
                          currentImages.push("");
                          setData((prev: any) => ({
                            ...prev,
                            workShowcase: { ...(prev.workShowcase || {}), images: currentImages },
                            portfolio: { ...(prev.portfolio || {}), images: currentImages }
                          }));
                        }}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg transition-colors"
                      >
                        + Add URL
                      </button>
                    </div>
                  </div>
                  
                  {/* Visual Thumbnail Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
                    {(data.workShowcase?.images || data.portfolio?.images || []).map((imgUrl: string, idx: number) => (
                      <div key={idx} className="relative group bg-gray-50 border border-gray-200 rounded-xl p-2 flex flex-col justify-between overflow-hidden shadow-sm">
                        <div className="w-full h-24 bg-gray-200 rounded-lg overflow-hidden mb-2 flex items-center justify-center relative">
                          {imgUrl ? (
                            <img
                              src={imgUrl}
                              alt={`Showcase ${idx + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e: any) => {
                                e.target.onerror = null;
                                e.target.src = "https://images.unsplash.com/photo-1575425187336-d5ec5d0a1451?auto=format&fit=crop&w=400&q=80";
                              }}
                            />
                          ) : (
                            <span className="text-gray-400 text-[10px] italic">No image URL</span>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              const newImgs = (data.workShowcase?.images || data.portfolio?.images || []).filter((_: any, i: number) => i !== idx);
                              setData((prev: any) => ({
                                ...prev,
                                workShowcase: { ...(prev.workShowcase || {}), images: newImgs },
                                portfolio: { ...(prev.portfolio || {}), images: newImgs }
                              }));
                            }}
                            className="absolute top-1 right-1 bg-red-600/90 text-white rounded-full p-1 shadow hover:bg-red-700 transition-colors"
                            title="Remove image"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={imgUrl}
                          onChange={(e) => {
                            const newImgs = [...(data.workShowcase?.images || data.portfolio?.images || [])];
                            newImgs[idx] = e.target.value;
                            setData((prev: any) => ({
                              ...prev,
                              workShowcase: { ...(prev.workShowcase || {}), images: newImgs },
                              portfolio: { ...(prev.portfolio || {}), images: newImgs }
                            }));
                          }}
                          className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs text-slate-900 focus:border-primary/50 focus:outline-none"
                          placeholder="Image URL..."
                        />
                      </div>
                    ))}
                  </div>
                  {(!data.workShowcase?.images || data.workShowcase.images.length === 0) && (
                    <p className="text-gray-400 text-xs italic text-center py-4 bg-gray-50 border border-dashed border-gray-300 rounded-xl">
                      Using default holiday gallery images. Click "+ Pick / Upload Image" to customize your marquee!
                    </p>
                  )}
                </div>

                {/* Media Selector Modal */}
                <AnimatePresence>
                  {showPortfolioMedia && (
                    <MediaSelector
                      title="Select / Upload Showcase Image"
                      onSelect={(item: any) => {
                        const currentImages = [...(data.workShowcase?.images || data.portfolio?.images || [])];
                        currentImages.push(item.url);
                        setData((prev: any) => ({
                          ...prev,
                          workShowcase: { ...(prev.workShowcase || {}), images: currentImages },
                          portfolio: { ...(prev.portfolio || {}), images: currentImages }
                        }));
                        setShowPortfolioMedia(false);
                      }}
                      onClose={() => setShowPortfolioMedia(false)}
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {activeTab === "testimonials" && (
              <motion.div key="testimonials" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">3D Coverflow Testimonials Section</h2>
                    <p className="text-gray-500 text-sm mt-1">Configure section badge, dual-line title, subtitle, and dynamic customer reviews.</p>
                  </div>
                  <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">Section 7</span>
                </div>

                {/* Section Header */}
                <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6 shadow-xl space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Type className="w-5 h-5 text-primary" />
                    1. Section Intro & Headlines
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Section Badge</label>
                      <input
                        type="text"
                        value={data.testimonials?.badge ?? data.testimonials?.section?.badge ?? "CLIENT SUCCESS STORIES"}
                        onChange={(e) => setData((prev: any) => ({
                          ...prev,
                          testimonials: {
                            ...(prev.testimonials || {}),
                            badge: e.target.value,
                            section: { ...(prev.testimonials?.section || {}), badge: e.target.value }
                          }
                        }))}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all"
                        placeholder="e.g. CLIENT SUCCESS STORIES"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Title Line 1 (Main Header Top)</label>
                      <input
                        type="text"
                        value={data.testimonials?.title?.line1 ?? data.testimonials?.section?.headlinePrefix ?? "Transforming Columbus Homes"}
                        onChange={(e) => setData((prev: any) => ({
                          ...prev,
                          testimonials: {
                            ...(prev.testimonials || {}),
                            title: { ...(prev.testimonials?.title || {}), line1: e.target.value },
                            section: { ...(prev.testimonials?.section || {}), headlinePrefix: e.target.value }
                          }
                        }))}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all"
                        placeholder="e.g. Transforming Columbus Homes"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Title Line 2 (Gradient Highlighted)</label>
                      <input
                        type="text"
                        value={data.testimonials?.title?.line2 ?? data.testimonials?.section?.headlineHighlight ?? "One Holiday at a Time"}
                        onChange={(e) => setData((prev: any) => ({
                          ...prev,
                          testimonials: {
                            ...(prev.testimonials || {}),
                            title: { ...(prev.testimonials?.title || {}), line2: e.target.value },
                            section: { ...(prev.testimonials?.section || {}), headlineHighlight: e.target.value, headline: e.target.value }
                          }
                        }))}
                        className="w-full bg-white border border-primary/40 rounded-xl px-4 py-3 text-primary text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all"
                        placeholder="e.g. One Holiday at a Time"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Subtitle / Description</label>
                      <textarea
                        rows={2}
                        value={data.testimonials?.subtitle ?? data.testimonials?.section?.description ?? "Read what your neighbors in New Albany, Dublin, and Bexley have to say about our premium Christmas lighting services."}
                        onChange={(e) => setData((prev: any) => ({
                          ...prev,
                          testimonials: {
                            ...(prev.testimonials || {}),
                            subtitle: e.target.value,
                            section: { ...(prev.testimonials?.section || {}), description: e.target.value }
                          }
                        }))}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all"
                        placeholder="Subtitle text..."
                      />
                    </div>
                  </div>
                </div>

                {/* Testimonials List */}
                <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6 shadow-xl space-y-4">
                  <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Star className="w-5 h-5 text-amber-500" />
                        2. 3D Coverflow Testimonials List
                      </h3>
                      <p className="text-gray-500 text-xs mt-0.5">Add and customize client review cards in the 3D rotating carousel.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const currentItems = [...(data.testimonials?.items || data.testimonials?.testimonials || defaultTestimonialsList)];
                        currentItems.push({
                          id: String(Date.now()),
                          author: "New Client",
                          role: "Homeowner",
                          location: "Columbus, OH",
                          service: "Residential Lighting",
                          rating: 5,
                          quote: "Great experience working with the team! The lights look amazing.",
                          image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                        });
                        setData((prev: any) => ({
                          ...prev,
                          testimonials: {
                            ...(prev.testimonials || {}),
                            items: currentItems,
                            testimonials: currentItems
                          }
                        }));
                      }}
                      className="bg-primary hover:bg-primary/90 text-white font-medium text-xs px-4 py-2 rounded-xl transition-all shadow-sm"
                    >
                      + Add Testimonial
                    </button>
                  </div>

                  <div className="space-y-4">
                    {(data.testimonials?.items || data.testimonials?.testimonials || defaultTestimonialsList).map((item: any, idx: number) => (
                      <div key={idx} className="bg-slate-50 border border-slate-200 p-5 rounded-xl space-y-4 relative">
                        <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                          <span className="font-bold text-sm text-slate-800">
                            Card #{idx + 1}: {item.author || item.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const currentItems = (data.testimonials?.items || data.testimonials?.testimonials || defaultTestimonialsList).filter((_: any, i: number) => i !== idx);
                              setData((prev: any) => ({
                                ...prev,
                                testimonials: {
                                  ...(prev.testimonials || {}),
                                  items: currentItems,
                                  testimonials: currentItems
                                }
                              }));
                            }}
                            className="text-red-500 hover:text-red-700 text-xs font-semibold flex items-center gap-1"
                          >
                            <Trash2 className="w-4 h-4" /> Remove
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-700">Client / Author Name</label>
                            <input
                              type="text"
                              value={item.author || item.name || ""}
                              onChange={(e) => {
                                const currentItems = [...(data.testimonials?.items || data.testimonials?.testimonials || defaultTestimonialsList)];
                                currentItems[idx] = { ...currentItems[idx], author: e.target.value, name: e.target.value };
                                setData((prev: any) => ({
                                  ...prev,
                                  testimonials: { ...(prev.testimonials || {}), items: currentItems, testimonials: currentItems }
                                }));
                              }}
                              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm"
                              placeholder="e.g. Sarah Jenkins"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-700">Role / Title</label>
                            <input
                              type="text"
                              value={item.role || item.position || ""}
                              onChange={(e) => {
                                const currentItems = [...(data.testimonials?.items || data.testimonials?.testimonials || defaultTestimonialsList)];
                                currentItems[idx] = { ...currentItems[idx], role: e.target.value, position: e.target.value };
                                setData((prev: any) => ({
                                  ...prev,
                                  testimonials: { ...(prev.testimonials || {}), items: currentItems, testimonials: currentItems }
                                }));
                              }}
                              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm"
                              placeholder="e.g. Homeowner"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-700">Location / City</label>
                            <input
                              type="text"
                              value={item.location || ""}
                              onChange={(e) => {
                                const currentItems = [...(data.testimonials?.items || data.testimonials?.testimonials || defaultTestimonialsList)];
                                currentItems[idx] = { ...currentItems[idx], location: e.target.value };
                                setData((prev: any) => ({
                                  ...prev,
                                  testimonials: { ...(prev.testimonials || {}), items: currentItems, testimonials: currentItems }
                                }));
                              }}
                              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm"
                              placeholder="e.g. Dublin, OH"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-700">Service Tag / Badge</label>
                            <input
                              type="text"
                              value={item.service || ""}
                              onChange={(e) => {
                                const currentItems = [...(data.testimonials?.items || data.testimonials?.testimonials || defaultTestimonialsList)];
                                currentItems[idx] = { ...currentItems[idx], service: e.target.value };
                                setData((prev: any) => ({
                                  ...prev,
                                  testimonials: { ...(prev.testimonials || {}), items: currentItems, testimonials: currentItems }
                                }));
                              }}
                              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm"
                              placeholder="e.g. Residential Lighting"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-700">Star Rating</label>
                            <select
                              value={item.rating || 5}
                              onChange={(e) => {
                                const currentItems = [...(data.testimonials?.items || data.testimonials?.testimonials || defaultTestimonialsList)];
                                currentItems[idx] = { ...currentItems[idx], rating: Number(e.target.value) };
                                setData((prev: any) => ({
                                  ...prev,
                                  testimonials: { ...(prev.testimonials || {}), items: currentItems, testimonials: currentItems }
                                }));
                              }}
                              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm"
                            >
                              <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                              <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                              <option value={3}>⭐⭐⭐ (3 Stars)</option>
                            </select>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-700">Avatar Photo URL</label>
                            <input
                              type="text"
                              value={item.image || item.avatar || ""}
                              onChange={(e) => {
                                const currentItems = [...(data.testimonials?.items || data.testimonials?.testimonials || defaultTestimonialsList)];
                                currentItems[idx] = { ...currentItems[idx], image: e.target.value, avatar: e.target.value };
                                setData((prev: any) => ({
                                  ...prev,
                                  testimonials: { ...(prev.testimonials || {}), items: currentItems, testimonials: currentItems }
                                }));
                              }}
                              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm"
                              placeholder="https://... or /images/..."
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-700">Review / Quote Text</label>
                          <textarea
                            rows={3}
                            value={item.quote || item.text || ""}
                            onChange={(e) => {
                              const currentItems = [...(data.testimonials?.items || data.testimonials?.testimonials || defaultTestimonialsList)];
                              currentItems[idx] = { ...currentItems[idx], quote: e.target.value, text: e.target.value };
                              setData((prev: any) => ({
                                ...prev,
                                testimonials: { ...(prev.testimonials || {}), items: currentItems, testimonials: currentItems }
                              }));
                            }}
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm"
                            placeholder="Enter customer feedback..."
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "whyChooseUs" && (
              <motion.div key="whyChooseUs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">How We Work (Process Section)</h2>
                    <p className="text-gray-500 text-sm mt-1">Manage the header, process steps, colors, icons, and features.</p>
                  </div>
                  <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">Section 7</span>
                </div>

                {/* Section Headers */}
                <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6 space-y-4">
                  <h3 className="text-lg font-bold text-gray-900">1. Section Header</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Badge</label>
                      <input
                        type="text"
                        value={data.howWeWork?.badge ?? data.whyChooseUs?.section?.badge ?? "Simple 3-Step Process"}
                        onChange={(e) => {
                          setData((prev: any) => ({
                            ...prev,
                            howWeWork: { ...prev.howWeWork, badge: e.target.value },
                            whyChooseUs: { ...prev.whyChooseUs, section: { ...(prev.whyChooseUs?.section || {}), badge: e.target.value } }
                          }));
                        }}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all"
                        placeholder="Simple 3-Step Process"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Section Title (Gradient Headline)</label>
                      <input
                        type="text"
                        value={data.howWeWork?.title ?? data.whyChooseUs?.section?.title ?? "Working With Us Couldn't Be Easier"}
                        onChange={(e) => {
                          setData((prev: any) => ({
                            ...prev,
                            howWeWork: { ...prev.howWeWork, title: e.target.value },
                            whyChooseUs: { ...prev.whyChooseUs, section: { ...(prev.whyChooseUs?.section || {}), title: e.target.value } }
                          }));
                        }}
                        className="w-full bg-white border border-primary/30 rounded-xl px-4 py-3 text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all font-bold"
                        placeholder="Working With Us Couldn't Be Easier"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Subtitle / Narrative</label>
                      <textarea 
                        rows={3}
                        value={data.howWeWork?.subtitle ?? data.whyChooseUs?.section?.description ?? "From your initial free quote to final takedown in January, we make holiday lighting completely stress-free."} 
                        onChange={(e) => {
                          setData((prev: any) => ({
                            ...prev,
                            howWeWork: { ...prev.howWeWork, subtitle: e.target.value },
                            whyChooseUs: { ...prev.whyChooseUs, section: { ...(prev.whyChooseUs?.section || {}), description: e.target.value } }
                          }));
                        }}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Steps */}
                <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">2. Process Steps</h3>
                    <button
                      onClick={() => {
                        const currentSteps = data.howWeWork?.steps || data.whyChooseUs?.features || [];
                        const nextNum = String(currentSteps.length + 1).padStart(2, "0");
                        const newStep = {
                          number: nextNum,
                          title: `Step ${currentSteps.length + 1}`,
                          description: "Briefly explain this step in the process.",
                          color: "#ef4444",
                          icon: "FaQuoteRight",
                          features: ["Guaranteed Quality", "Certified Professional", "Complete Hassle-Free"]
                        };
                        const updated = [...currentSteps, newStep];
                        setData((prev: any) => ({
                          ...prev,
                          howWeWork: { ...prev.howWeWork, steps: updated },
                          whyChooseUs: { ...prev.whyChooseUs, features: updated }
                        }));
                      }}
                      className="text-xs bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1.5 rounded-lg font-semibold transition-colors"
                    >
                      + Add Step
                    </button>
                  </div>

                  <div className="space-y-4">
                    {(data.howWeWork?.steps || data.whyChooseUs?.features || [
                      {
                        number: "01",
                        title: "Design & Free Quote",
                        description: "We discuss your vision, evaluate your property, and provide a custom design preview with guaranteed upfront pricing.",
                        color: "#ef4444",
                        icon: "FaQuoteRight",
                        features: ["Free Custom Design Preview", "Transparent Written Estimate", "No Obligation Consultation"]
                      },
                      {
                        number: "02",
                        title: "Professional Installation",
                        description: "Our certified, fully insured installers custom-fit commercial-grade lights to your roofline and landscape with precision.",
                        color: "#f59e0b",
                        icon: "FaCalendarCheck",
                        features: ["Commercial-Grade C9 LEDs", "Custom Cut & Fitted", "Timer & Power Setup Included"]
                      },
                      {
                        number: "03",
                        title: "Maintenance & Takedown",
                        description: "Relax all season long. We handle any bulb replacements, takedown in January, and store everything in climate-controlled storage.",
                        color: "#10b981",
                        icon: "FaChair",
                        features: ["24-48hr Maintenance Guarantee", "Careful Post-Holiday Removal", "Secure Storage for Next Year"]
                      }
                    ]).map((step: any, idx: number) => (
                      <div key={idx} className="border border-gray-200 rounded-xl p-5 bg-gray-50 relative group space-y-4">
                        <button
                          onClick={() => {
                            const currentSteps = [...(data.howWeWork?.steps || data.whyChooseUs?.features || [])];
                            currentSteps.splice(idx, 1);
                            setData((prev: any) => ({
                              ...prev,
                              howWeWork: { ...prev.howWeWork, steps: currentSteps },
                              whyChooseUs: { ...prev.whyChooseUs, features: currentSteps }
                            }));
                          }}
                          className="absolute top-4 right-4 text-xs font-semibold text-red-500 hover:text-red-700 transition-colors"
                        >
                          Delete Step
                        </button>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase text-gray-500 font-bold">Step Number</label>
                            <input
                              type="text"
                              value={step.number || String(idx + 1).padStart(2, "0")}
                              onChange={(e) => {
                                const currentSteps = [...(data.howWeWork?.steps || data.whyChooseUs?.features || [])];
                                currentSteps[idx] = { ...currentSteps[idx], number: e.target.value };
                                setData((prev: any) => ({
                                  ...prev,
                                  howWeWork: { ...prev.howWeWork, steps: currentSteps },
                                  whyChooseUs: { ...prev.whyChooseUs, features: currentSteps }
                                }));
                              }}
                              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-primary/50 focus:outline-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] uppercase text-gray-500 font-bold">Accent Color</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={step.color || "#ef4444"}
                                onChange={(e) => {
                                  const currentSteps = [...(data.howWeWork?.steps || data.whyChooseUs?.features || [])];
                                  currentSteps[idx] = { ...currentSteps[idx], color: e.target.value };
                                  setData((prev: any) => ({
                                    ...prev,
                                    howWeWork: { ...prev.howWeWork, steps: currentSteps },
                                    whyChooseUs: { ...prev.whyChooseUs, features: currentSteps }
                                  }));
                                }}
                                className="w-9 h-8 p-0 border border-gray-300 rounded cursor-pointer"
                              />
                              <input
                                type="text"
                                value={step.color || "#ef4444"}
                                onChange={(e) => {
                                  const currentSteps = [...(data.howWeWork?.steps || data.whyChooseUs?.features || [])];
                                  currentSteps[idx] = { ...currentSteps[idx], color: e.target.value };
                                  setData((prev: any) => ({
                                    ...prev,
                                    howWeWork: { ...prev.howWeWork, steps: currentSteps },
                                    whyChooseUs: { ...prev.whyChooseUs, features: currentSteps }
                                  }));
                                }}
                                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-primary/50 focus:outline-none"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] uppercase text-gray-500 font-bold">Icon</label>
                            <select
                              value={step.icon || "FaQuoteRight"}
                              onChange={(e) => {
                                const currentSteps = [...(data.howWeWork?.steps || data.whyChooseUs?.features || [])];
                                currentSteps[idx] = { ...currentSteps[idx], icon: e.target.value };
                                setData((prev: any) => ({
                                  ...prev,
                                  howWeWork: { ...prev.howWeWork, steps: currentSteps },
                                  whyChooseUs: { ...prev.whyChooseUs, features: currentSteps }
                                }));
                              }}
                              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-primary/50 focus:outline-none"
                            >
                              <option value="FaQuoteRight">Quote / Chat (FaQuoteRight)</option>
                              <option value="FaCalendarCheck">Calendar / Booking (FaCalendarCheck)</option>
                              <option value="FaChair">Relax / Chair (FaChair)</option>
                              <option value="GiFruitTree">Tree / Lighting (GiFruitTree)</option>
                              <option value="FaPhoneAlt">Phone (FaPhoneAlt)</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] uppercase text-gray-500 font-bold">Step Title</label>
                          <input
                            type="text"
                            value={step.title || ""}
                            onChange={(e) => {
                              const currentSteps = [...(data.howWeWork?.steps || data.whyChooseUs?.features || [])];
                              currentSteps[idx] = { ...currentSteps[idx], title: e.target.value };
                              setData((prev: any) => ({
                                ...prev,
                                howWeWork: { ...prev.howWeWork, steps: currentSteps },
                                whyChooseUs: { ...prev.whyChooseUs, features: currentSteps }
                              }));
                            }}
                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-bold focus:border-primary/50 focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] uppercase text-gray-500 font-bold">Step Description</label>
                          <textarea
                            rows={2}
                            value={step.description || ""}
                            onChange={(e) => {
                              const currentSteps = [...(data.howWeWork?.steps || data.whyChooseUs?.features || [])];
                              currentSteps[idx] = { ...currentSteps[idx], description: e.target.value };
                              setData((prev: any) => ({
                                ...prev,
                                howWeWork: { ...prev.howWeWork, steps: currentSteps },
                                whyChooseUs: { ...prev.whyChooseUs, features: currentSteps }
                              }));
                            }}
                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-primary/50 focus:outline-none"
                          />
                        </div>

                        <div className="space-y-2 pt-2 border-t border-gray-200">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] uppercase text-gray-500 font-bold">Bullet Points (Features)</label>
                            <button
                              type="button"
                              onClick={() => {
                                const currentSteps = [...(data.howWeWork?.steps || data.whyChooseUs?.features || [])];
                                const currentFeats = currentSteps[idx]?.features || [];
                                currentSteps[idx] = {
                                  ...currentSteps[idx],
                                  features: [...currentFeats, "New benefit point"]
                                };
                                setData((prev: any) => ({
                                  ...prev,
                                  howWeWork: { ...prev.howWeWork, steps: currentSteps },
                                  whyChooseUs: { ...prev.whyChooseUs, features: currentSteps }
                                }));
                              }}
                              className="text-xs text-primary hover:underline font-semibold"
                            >
                              + Add Bullet
                            </button>
                          </div>

                          {(step.features || []).map((feat: any, featIdx: number) => {
                            const featText = typeof feat === "string" ? feat : feat?.text || "";
                            return (
                              <div key={featIdx} className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={featText}
                                  onChange={(e) => {
                                    const currentSteps = [...(data.howWeWork?.steps || data.whyChooseUs?.features || [])];
                                    const currentFeats = [...(currentSteps[idx]?.features || [])];
                                    currentFeats[featIdx] = e.target.value;
                                    currentSteps[idx] = { ...currentSteps[idx], features: currentFeats };
                                    setData((prev: any) => ({
                                      ...prev,
                                      howWeWork: { ...prev.howWeWork, steps: currentSteps },
                                      whyChooseUs: { ...prev.whyChooseUs, features: currentSteps }
                                    }));
                                  }}
                                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:border-primary/50 focus:outline-none"
                                  placeholder={`Bullet #${featIdx + 1}`}
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const currentSteps = [...(data.howWeWork?.steps || data.whyChooseUs?.features || [])];
                                    const currentFeats = (currentSteps[idx]?.features || []).filter((_: any, fIdx: number) => fIdx !== featIdx);
                                    currentSteps[idx] = { ...currentSteps[idx], features: currentFeats };
                                    setData((prev: any) => ({
                                      ...prev,
                                      howWeWork: { ...prev.howWeWork, steps: currentSteps },
                                      whyChooseUs: { ...prev.whyChooseUs, features: currentSteps }
                                    }));
                                  }}
                                  className="text-red-500 hover:text-red-700 text-xs px-1"
                                >
                                  ✕
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Bottom Call to Action (CTA) */}
                <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6 space-y-4">
                  <h3 className="text-lg font-bold text-gray-900">3. Bottom Call to Action (CTA Banner)</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">CTA Headline Title</label>
                      <input
                        type="text"
                        value={data.howWeWork?.cta?.title ?? data.whyChooseUs?.cta?.title ?? "Ready to Transform Your Home?"}
                        onChange={(e) => {
                          setData((prev: any) => ({
                            ...prev,
                            howWeWork: { ...prev.howWeWork, cta: { ...(prev.howWeWork?.cta || {}), title: e.target.value } },
                            whyChooseUs: { ...prev.whyChooseUs, cta: { ...(prev.whyChooseUs?.cta || {}), title: e.target.value } }
                          }));
                        }}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all font-bold"
                        placeholder="Ready to Transform Your Home?"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">CTA Subtitle / Description</label>
                      <textarea
                        rows={2}
                        value={data.howWeWork?.cta?.description ?? data.whyChooseUs?.cta?.description ?? "Join local homeowners who trust us to make their holidays shine"}
                        onChange={(e) => {
                          setData((prev: any) => ({
                            ...prev,
                            howWeWork: { ...prev.howWeWork, cta: { ...(prev.howWeWork?.cta || {}), description: e.target.value } },
                            whyChooseUs: { ...prev.whyChooseUs, cta: { ...(prev.whyChooseUs?.cta || {}), description: e.target.value } }
                          }));
                        }}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all"
                        placeholder="Join local homeowners who trust us to make their holidays shine"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase text-gray-500 font-bold">Primary Button Text</label>
                        <input
                          type="text"
                          value={data.howWeWork?.cta?.buttons?.primary ?? data.howWeWork?.cta?.primaryButtonText ?? "Call Us Now"}
                          onChange={(e) => {
                            setData((prev: any) => ({
                              ...prev,
                              howWeWork: {
                                ...prev.howWeWork,
                                cta: {
                                  ...(prev.howWeWork?.cta || {}),
                                  primaryButtonText: e.target.value,
                                  buttons: { ...(prev.howWeWork?.cta?.buttons || {}), primary: e.target.value }
                                }
                              }
                            }));
                          }}
                          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-primary/50 focus:outline-none"
                          placeholder="Call Us Now"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase text-gray-500 font-bold">Phone Number (Click to Call)</label>
                        <input
                          type="text"
                          value={data.howWeWork?.cta?.phone ?? data.footer?.contact?.phone ?? "(614) 301-7100"}
                          onChange={(e) => {
                            setData((prev: any) => ({
                              ...prev,
                              howWeWork: {
                                ...prev.howWeWork,
                                cta: {
                                  ...(prev.howWeWork?.cta || {}),
                                  phone: e.target.value
                                }
                              }
                            }));
                          }}
                          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-primary/50 focus:outline-none"
                          placeholder="(614) 301-7100"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase text-gray-500 font-bold">Secondary Button (Modal Trigger)</label>
                        <input
                          type="text"
                          value={data.howWeWork?.cta?.buttons?.secondary ?? data.howWeWork?.cta?.secondaryButtonText ?? "Schedule Free Consultation"}
                          onChange={(e) => {
                            setData((prev: any) => ({
                              ...prev,
                              howWeWork: {
                                ...prev.howWeWork,
                                cta: {
                                  ...(prev.howWeWork?.cta || {}),
                                  secondaryButtonText: e.target.value,
                                  buttons: { ...(prev.howWeWork?.cta?.buttons || {}), secondary: e.target.value }
                                }
                              }
                            }));
                          }}
                          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-primary/50 focus:outline-none"
                          placeholder="Schedule Free Consultation"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "faq" && (
              <motion.div key="faq" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">FAQ Section</h2>
                    <p className="text-gray-500 text-sm mt-1">Configure the main gradient title and expandable Q&A accordion items.</p>
                  </div>
                  <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">Section 8</span>
                </div>

                {/* Section Title */}
                <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6 shadow-xl space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Type className="w-5 h-5 text-primary" />
                    1. Section Heading
                  </h3>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Main Title (Gradient Highlighted)</label>
                    <input
                      type="text"
                      value={data.faq?.title ?? data.faq?.section?.headline ?? data.faq?.section?.title ?? "Questions & Answers"}
                      onChange={(e) => setData((prev: any) => ({
                        ...prev,
                        faq: {
                          ...(prev.faq || {}),
                          title: e.target.value,
                          section: { ...(prev.faq?.section || {}), headline: e.target.value, title: e.target.value }
                        }
                      }))}
                      className="w-full bg-white border border-primary/40 rounded-xl px-4 py-3 text-primary text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all"
                      placeholder="e.g. Questions & Answers"
                    />
                  </div>
                </div>

                {/* FAQ Items */}
                <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6 shadow-xl space-y-4">
                  <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <CircleHelp className="w-5 h-5 text-primary" />
                        2. Expandable FAQ Accordion Items
                      </h3>
                      <p className="text-gray-500 text-xs mt-0.5">Manage question & answer accordion pairs.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const currentItems = [...(data.faq?.items || data.faq?.faqs || defaultFaqItems)];
                        currentItems.push({
                          question: "New Question?",
                          answer: "Answer to the new question goes here."
                        });
                        setData((prev: any) => ({
                          ...prev,
                          faq: {
                            ...(prev.faq || {}),
                            items: currentItems,
                            faqs: currentItems
                          }
                        }));
                      }}
                      className="bg-primary hover:bg-primary/90 text-white font-medium text-xs px-4 py-2 rounded-xl transition-all shadow-sm"
                    >
                      + Add FAQ
                    </button>
                  </div>

                  <div className="space-y-4">
                    {(data.faq?.items || data.faq?.faqs || defaultFaqItems).map((item: any, idx: number) => (
                      <div key={idx} className="bg-slate-50 border border-slate-200 p-5 rounded-xl space-y-3 relative">
                        <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                          <span className="font-bold text-sm text-slate-800">
                            FAQ #{idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const currentItems = (data.faq?.items || data.faq?.faqs || defaultFaqItems).filter((_: any, i: number) => i !== idx);
                              setData((prev: any) => ({
                                ...prev,
                                faq: {
                                  ...(prev.faq || {}),
                                  items: currentItems,
                                  faqs: currentItems
                                }
                              }));
                            }}
                            className="text-red-500 hover:text-red-700 text-xs font-semibold flex items-center gap-1"
                          >
                            <Trash2 className="w-4 h-4" /> Remove
                          </button>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-700">Question</label>
                          <input
                            type="text"
                            value={item.question || item.q || ""}
                            onChange={(e) => {
                              const currentItems = [...(data.faq?.items || data.faq?.faqs || defaultFaqItems)];
                              currentItems[idx] = { ...currentItems[idx], question: e.target.value, q: e.target.value };
                              setData((prev: any) => ({
                                ...prev,
                                faq: { ...(prev.faq || {}), items: currentItems, faqs: currentItems }
                              }));
                            }}
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-primary/50 focus:outline-none"
                            placeholder="e.g. When should I schedule installation?"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-700">Answer</label>
                          <textarea
                            rows={3}
                            value={item.answer || item.a || ""}
                            onChange={(e) => {
                              const currentItems = [...(data.faq?.items || data.faq?.faqs || defaultFaqItems)];
                              currentItems[idx] = { ...currentItems[idx], answer: e.target.value, a: e.target.value };
                              setData((prev: any) => ({
                                ...prev,
                                faq: { ...(prev.faq || {}), items: currentItems, faqs: currentItems }
                              }));
                            }}
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-primary/50 focus:outline-none"
                            placeholder="Enter the detailed answer..."
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "quote" && (
              <motion.div key="quote" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Homepage Fast Quote Form</h2>
                    <p className="text-gray-500 text-sm mt-1">Configure header, sidebar benefits, and contact channels for the quote form.</p>
                  </div>
                  <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">Section 9</span>
                </div>

                {/* 1. Header Narrative */}
                <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6 space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Type className="w-5 h-5 text-primary" />
                    1. Header & Badge
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Section Badge</label>
                      <input
                        type="text"
                        value={data.quoteForm?.badge ?? data.quote?.badge ?? data.quote?.section?.badge ?? "Get A Fast Quote"}
                        onChange={(e) => setData((prev: any) => ({
                          ...prev,
                          quoteForm: { ...(prev.quoteForm || {}), badge: e.target.value },
                          quote: { ...(prev.quote || {}), badge: e.target.value, section: { ...(prev.quote?.section || {}), badge: e.target.value } }
                        }))}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all"
                        placeholder="Get A Fast Quote"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Section Title</label>
                      <input
                        type="text"
                        value={data.quoteForm?.title ?? data.quote?.title ?? data.quote?.section?.headline ?? "Get Your Fast Quote"}
                        onChange={(e) => setData((prev: any) => ({
                          ...prev,
                          quoteForm: { ...(prev.quoteForm || {}), title: e.target.value },
                          quote: { ...(prev.quote || {}), title: e.target.value, section: { ...(prev.quote?.section || {}), headline: e.target.value } }
                        }))}
                        className="w-full bg-white border border-primary/40 rounded-xl px-4 py-3 text-primary text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all"
                        placeholder="Get Your Fast Quote"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Subtitle / Description</label>
                    <textarea
                      rows={2}
                      value={data.quoteForm?.subtitle ?? data.quote?.subtitle ?? data.quote?.section?.description ?? "We are so excited to light up your property 🙂"}
                      onChange={(e) => setData((prev: any) => ({
                        ...prev,
                        quoteForm: { ...(prev.quoteForm || {}), subtitle: e.target.value },
                        quote: { ...(prev.quote || {}), subtitle: e.target.value, section: { ...(prev.quote?.section || {}), description: e.target.value } }
                      }))}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all"
                      placeholder="We are so excited to light up your property 🙂"
                    />
                  </div>
                </div>

                {/* 2. Benefits List */}
                <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6 space-y-4">
                  <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Users className="w-5 h-5 text-primary" />
                        2. 'What You Get' Benefits List
                      </h3>
                      <p className="text-gray-500 text-xs mt-0.5">Benefits displayed in the right sidebar with green checkmarks.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const currentBenefits = [...(data.quoteForm?.benefits || data.quote?.benefits || defaultBenefits)];
                        currentBenefits.push({ text: "New Customer Benefit" });
                        setData((prev: any) => ({
                          ...prev,
                          quoteForm: { ...(prev.quoteForm || {}), benefits: currentBenefits },
                          quote: { ...(prev.quote || {}), benefits: currentBenefits }
                        }));
                      }}
                      className="bg-primary hover:bg-primary/90 text-white font-medium text-xs px-4 py-2 rounded-xl transition-all shadow-sm"
                    >
                      + Add Benefit
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(data.quoteForm?.benefits || data.quote?.benefits || defaultBenefits).map((benefit: any, idx: number) => (
                      <div key={idx} className="flex gap-2 bg-slate-50 p-3 border border-slate-200 rounded-xl items-center">
                        <span className="text-xs font-bold text-slate-500 w-7 text-center">#{idx + 1}</span>
                        <input
                          type="text"
                          value={benefit.text || benefit || ""}
                          onChange={(e) => {
                            const currentBenefits = [...(data.quoteForm?.benefits || data.quote?.benefits || defaultBenefits)];
                            currentBenefits[idx] = { text: e.target.value };
                            setData((prev: any) => ({
                              ...prev,
                              quoteForm: { ...(prev.quoteForm || {}), benefits: currentBenefits },
                              quote: { ...(prev.quote || {}), benefits: currentBenefits }
                            }));
                          }}
                          className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium focus:border-primary/50 focus:outline-none"
                          placeholder="e.g. Custom Lighting Design & Layout"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const currentBenefits = (data.quoteForm?.benefits || data.quote?.benefits || defaultBenefits).filter((_: any, i: number) => i !== idx);
                            setData((prev: any) => ({
                              ...prev,
                              quoteForm: { ...(prev.quoteForm || {}), benefits: currentBenefits },
                              quote: { ...(prev.quote || {}), benefits: currentBenefits }
                            }));
                          }}
                          className="text-red-500 hover:text-red-700 p-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Immediate Contact Card */}
                <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6 space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Phone className="w-5 h-5 text-primary" />
                    3. Sidebar Immediate Help Contact
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Direct Phone</label>
                      <input
                        type="text"
                        value={data.quoteForm?.contactInfo?.phone ?? data.quote?.contactInfo?.phone ?? data.footer?.contact?.phone ?? "(614) 301-7100"}
                        onChange={(e) => {
                          const updatedContact = { ...(data.quoteForm?.contactInfo || data.quote?.contactInfo || {}), phone: e.target.value };
                          setData((prev: any) => ({
                            ...prev,
                            quoteForm: { ...(prev.quoteForm || {}), contactInfo: updatedContact },
                            quote: { ...(prev.quote || {}), contactInfo: updatedContact }
                          }));
                        }}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all"
                        placeholder="(614) 301-7100"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Direct Email</label>
                      <input
                        type="email"
                        value={data.quoteForm?.contactInfo?.email ?? data.quote?.contactInfo?.email ?? data.footer?.contact?.email ?? "Info@lightsovercolumbus.com"}
                        onChange={(e) => {
                          const updatedContact = { ...(data.quoteForm?.contactInfo || data.quote?.contactInfo || {}), email: e.target.value };
                          setData((prev: any) => ({
                            ...prev,
                            quoteForm: { ...(prev.quoteForm || {}), contactInfo: updatedContact },
                            quote: { ...(prev.quote || {}), contactInfo: updatedContact }
                          }));
                        }}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all"
                        placeholder="Info@lightsovercolumbus.com"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "blog" && (
              <motion.div key="blog" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Homepage Blog Section</h2>
                    <p className="text-gray-500 text-sm mt-1">Configure section heading, description narrative, and featured blog posts.</p>
                  </div>
                  <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">Section 10</span>
                </div>

                {/* 1. Header Narrative */}
                <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6 space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Type className="w-5 h-5 text-primary" />
                    1. Header & Description
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Section Badge</label>
                      <input
                        type="text"
                        value={data.blogSection?.subtitle || ""}
                        onChange={(e) => setData((prev: any) => ({
                          ...prev,
                          blogSection: { ...(prev.blogSection || {}), subtitle: e.target.value }
                        }))}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all"
                        placeholder="e.g. Latest Insights"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Section Headline</label>
                      <input
                        type="text"
                        value={data.blogSection?.title || ""}
                        onChange={(e) => setData((prev: any) => ({
                          ...prev,
                          blogSection: { ...(prev.blogSection || {}), title: e.target.value }
                        }))}
                        className="w-full bg-white border border-primary/40 rounded-xl px-4 py-3 text-primary text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all"
                        placeholder="e.g. Tips, Ideas & Holiday Inspiration"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Description Narrative</label>
                    <RichTextEditor
                      content={data.blogSection?.description || ""}
                      onChange={(html) => setData((prev: any) => ({
                        ...prev,
                        blogSection: { ...(prev.blogSection || {}), description: html }
                      }))}
                    />
                  </div>
                </div>

                {/* 2. Selected Posts */}
                <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6 space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    2. Select Featured Blog Posts
                  </h3>
                  <p className="text-gray-500 text-xs mt-0.5">Select which blog posts appear on the homepage.</p>
                  <BlogSelector
                    selectedIds={data.blogSection?.selectedPosts || []}
                    onChange={(ids) => setData((prev: any) => ({
                      ...prev,
                      blogSection: { ...(prev.blogSection || {}), selectedPosts: ids }
                    }))}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
