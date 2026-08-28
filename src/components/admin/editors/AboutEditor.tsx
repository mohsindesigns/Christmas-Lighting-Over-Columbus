"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2, Type, Globe, CheckCircle, Search, HelpCircle,
  Plus, Trash2, ShieldCheck, Mail, Phone, MapPin, Award,
  Sparkles, DollarSign, Check, ListChecks, Megaphone, User, Image as ImageIcon,
  Truck, ArrowUp, ArrowDown, HelpCircle as FaQuestionCircle
} from "lucide-react";
import ImageField from "@/components/admin/ImageField";
import { UI } from "./styles";

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

const DEFAULT_FAQS = [
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
  }
];

export default function AboutEditor({ pageId, data, setData }: { pageId: string, data: any, setData: (d: any) => void }) {
  const [activeTab, setActiveTab] = useState("hero");

  useEffect(() => {
    if (!data.aboutPage && !data.about) {
      setData({
        ...data,
        aboutPage: {
          hero: {
            badge: "ABOUT US",
            titlePrefix: "GET TO KNOW",
            titleHighlight: "YOUR LIGHTING TEAM",
            description: "We're your neighbors in Central Ohio dedicated to making your holiday season magical and stress-free.",
            bgImage: "/images/hero-background2.jpg",
            ctaText: "Get My Free Quote",
            phone: "(614) 301-7100",
            phoneLink: "tel:6143017100"
          },
          story: {
            badge: "INSTALLING CHRISTMAS LIGHTS",
            titlePrefix: "Serving your",
            titleHighlight: "family",
            founderQuote: "Hi, I'm Ethen, owner of Christmas Lights Over Columbus. We help families across Central Ohio create beautiful, welcoming holiday displays without the stress of ladders or tangled lights.",
            narrative: "From custom design and installation to takedown after the season, my team takes care of everything so you can focus on what truly matters—making memories and enjoying time with the people you love.",
            mission: "Making holiday memories stress-free",
            founderImage: "/images/aboutownerfamily.JPEG?t=1",
            experienceBadgeText: "Serving Central Ohio families"
          },
          faq: {
            title: "Frequently Asked Questions",
            items: DEFAULT_FAQS
          },
          cta: {
            title: "Ready to Transform Your Home Into a Holiday Wonderland?",
            description: "Join hundreds of satisfied Central Ohio families who trust us to make their holiday lighting stress-free and spectacular. Get your free, no-obligation quote today!",
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
    }
  }, []);

  if (!data) return <div className="flex items-center justify-center h-64"><Loader2 className="w-5 h-5 text-[#2271b1] animate-spin" /></div>;

  const aboutPage = data.aboutPage || data.about || {};
  const hero = aboutPage.hero || {};
  const story = aboutPage.story || {};
  const faqData = aboutPage.faq || aboutPage.faqsSection || {};
  const faqItems: any[] = Array.isArray(faqData.items) ? faqData.items : (Array.isArray(faqData.faqs) ? faqData.faqs : DEFAULT_FAQS);
  const cta = aboutPage.cta || aboutPage.ctaSection || {};
  const serviceAreasData = data.serviceAreas || {};
  const steps: any[] = serviceAreasData.steps || DEFAULT_STEPS;

  const updateHero = (field: string, value: any) => {
    setData({
      ...data,
      aboutPage: {
        ...aboutPage,
        hero: {
          ...(aboutPage.hero || {}),
          [field]: value
        }
      }
    });
  };

  const updateStory = (field: string, value: any) => {
    setData({
      ...data,
      aboutPage: {
        ...aboutPage,
        story: {
          ...(aboutPage.story || {}),
          [field]: value
        }
      }
    });
  };

  const updateFaq = (field: string, value: any) => {
    setData({
      ...data,
      aboutPage: {
        ...aboutPage,
        faq: {
          ...(aboutPage.faq || {}),
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

  const updateCta = (field: string, value: any) => {
    setData({
      ...data,
      aboutPage: {
        ...aboutPage,
        cta: {
          ...(aboutPage.cta || {}),
          [field]: value
        }
      }
    });
  };

  // FAQ Handlers
  const handleAddFaq = () => {
    const newItems = [...faqItems, { question: "New Question?", answer: "Answer details here..." }];
    updateFaq("items", newItems);
  };

  const handleUpdateFaq = (index: number, field: string, value: string) => {
    const updated = [...faqItems];
    updated[index] = { ...updated[index], [field]: value };
    updateFaq("items", updated);
  };

  const handleDeleteFaq = (index: number) => {
    if (!confirm("Are you sure you want to delete this FAQ item?")) return;
    const updated = faqItems.filter((_, i) => i !== index);
    updateFaq("items", updated);
  };

  const handleMoveFaq = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= faqItems.length) return;
    const updated = [...faqItems];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    updateFaq("items", updated);
  };

  const tabs = [
    { id: "hero", label: "Hero Header & Intro", icon: Type, title: "Hero Introduction" },
    { id: "story", label: "Founder Story & Family", icon: User, title: "Founder & Team Story" },
    { id: "vanMap", label: "Van & Map Section (VanMap)", icon: Truck, title: "Van & Real Map Section" },
    { id: "faq", label: "FAQ Section", icon: FaQuestionCircle, title: "Frequently Asked Questions" },
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
            {/* TAB 1: HERO HEADER & INTRO */}
            {/* ========================================================================= */}
            {activeTab === "hero" && (
              <div className="max-w-4xl space-y-6">
                <div className="bg-[#f9f9f9] border border-[#c3c4c7] p-4 rounded-sm space-y-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Pill Badge</label>
                    <input
                      type="text"
                      value={hero.badge || "ABOUT US"}
                      onChange={(e) => updateHero("badge", e.target.value)}
                      className="w-full border border-[#c3c4c7] px-3 py-1.5 text-xs font-semibold rounded-[3px] focus:border-[#2271b1] outline-none bg-white uppercase"
                      placeholder="ABOUT US"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Main Headline (2-Part Animated Gradient)</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] text-slate-500 font-bold">Part 1 (White Intro)</label>
                        <input
                          type="text"
                          value={hero.titlePrefix || hero.titlePart1 || "GET TO KNOW"}
                          onChange={(e) => updateHero("titlePrefix", e.target.value)}
                          className="w-full border border-[#c3c4c7] px-3 py-1.5 text-xs font-bold rounded-[3px] focus:border-[#2271b1] outline-none bg-white uppercase"
                          placeholder="GET TO KNOW"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-[#2271b1] font-bold">Part 2 (Gold/Red Highlighted Line)</label>
                        <input
                          type="text"
                          value={hero.titleHighlight || hero.titlePart2 || "YOUR LIGHTING TEAM"}
                          onChange={(e) => updateHero("titleHighlight", e.target.value)}
                          className="w-full border border-[#c3c4c7] px-3 py-1.5 text-xs font-bold rounded-[3px] focus:border-[#2271b1] outline-none bg-amber-50 text-amber-900 uppercase"
                          placeholder="YOUR LIGHTING TEAM"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Intro Subtitle Narrative</label>
                    <textarea
                      rows={3}
                      value={hero.subtitle || hero.description || ""}
                      onChange={(e) => updateHero("subtitle", e.target.value)}
                      className="w-full border border-[#c3c4c7] px-3 py-2 text-xs rounded-[3px] focus:border-[#2271b1] outline-none bg-white"
                      placeholder="We're your neighbors in Central Ohio dedicated to making your holiday season magical and stress-free."
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
                      <label className="text-[11px] font-bold text-slate-500 uppercase">Phone Number</label>
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
                      value={hero.bgImage || hero.image || ""}
                      onChange={(v) => updateHero("bgImage", v)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 2: FOUNDER STORY & FAMILY */}
            {/* ========================================================================= */}
            {activeTab === "story" && (
              <div className="max-w-4xl space-y-6">
                <div className="bg-[#f9f9f9] border border-[#c3c4c7] p-4 rounded-sm space-y-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Section Badge</label>
                    <input
                      type="text"
                      value={story.badge || "INSTALLING CHRISTMAS LIGHTS"}
                      onChange={(e) => updateStory("badge", e.target.value)}
                      className="w-full border border-[#c3c4c7] px-3 py-1.5 text-xs font-semibold rounded-[3px] focus:border-[#2271b1] outline-none bg-white uppercase"
                      placeholder="INSTALLING CHRISTMAS LIGHTS"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Section Headline (2-Part Animated Gradient)</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] text-slate-500 font-bold">Prefix (e.g. Serving your)</label>
                        <input
                          type="text"
                          value={story.titlePrefix || "Serving your"}
                          onChange={(e) => updateStory("titlePrefix", e.target.value)}
                          className="w-full border border-[#c3c4c7] px-3 py-1.5 text-xs font-bold rounded-[3px] focus:border-[#2271b1] outline-none bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-amber-700 font-bold">Highlight Word (e.g. family)</label>
                        <input
                          type="text"
                          value={story.titleHighlight || "family"}
                          onChange={(e) => updateStory("titleHighlight", e.target.value)}
                          className="w-full border border-[#c3c4c7] px-3 py-1.5 text-xs font-bold rounded-[3px] focus:border-[#2271b1] outline-none bg-amber-50 text-amber-900"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Founder Quote (Prominent Paragraph)</label>
                    <textarea
                      rows={3}
                      value={story.founderQuote || ""}
                      onChange={(e) => updateStory("founderQuote", e.target.value)}
                      className="w-full border border-[#c3c4c7] px-3 py-2 text-xs rounded-[3px] focus:border-[#2271b1] outline-none bg-white font-medium"
                      placeholder="Hi, I'm Ethen, owner of Christmas Lights Over Columbus. We help families across Central Ohio create beautiful, welcoming holiday displays without the stress of ladders or tangled lights."
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Secondary Narrative Paragraph</label>
                    <textarea
                      rows={3}
                      value={story.narrative || ""}
                      onChange={(e) => updateStory("narrative", e.target.value)}
                      className="w-full border border-[#c3c4c7] px-3 py-2 text-xs rounded-[3px] focus:border-[#2271b1] outline-none bg-white"
                      placeholder="From custom design and installation to takedown after the season, my team takes care of everything so you can focus on what truly matters—making memories and enjoying time with the people you love."
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#f0f0f1]">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-500 uppercase">Mission Highlight</label>
                      <input
                        type="text"
                        value={story.mission || "Making holiday memories stress-free"}
                        onChange={(e) => updateStory("mission", e.target.value)}
                        className="w-full border border-[#c3c4c7] px-3 py-1.5 text-xs font-semibold rounded-[3px] bg-white outline-none focus:border-[#2271b1]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-500 uppercase">Experience Floating Badge</label>
                      <input
                        type="text"
                        value={story.experienceBadgeText || "Serving Central Ohio families"}
                        onChange={(e) => updateStory("experienceBadgeText", e.target.value)}
                        className="w-full border border-[#c3c4c7] px-3 py-1.5 text-xs font-semibold rounded-[3px] bg-white outline-none focus:border-[#2271b1]"
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#f0f0f1]">
                    <ImageField
                      label="Founder & Family Photo (aboutownerfamily.JPEG)"
                      value={story.founderImage || story.image || ""}
                      onChange={(v) => updateStory("founderImage", v)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 3: VAN & REAL MAP SECTION (VanMapSection) */}
            {/* ========================================================================= */}
            {activeTab === "vanMap" && (
              <div className="max-w-4xl space-y-6">
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
            {/* TAB 4: FAQ SECTION */}
            {/* ========================================================================= */}
            {activeTab === "faq" && (
              <div className="max-w-4xl space-y-6">
                <div className="p-4 bg-[#f9f9f9] border border-[#c3c4c7] rounded-sm space-y-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">FAQ Section Heading</label>
                    <input
                      type="text"
                      value={faqData.title || "Frequently Asked Questions"}
                      onChange={(e) => updateFaq("title", e.target.value)}
                      className="w-full border border-[#c3c4c7] px-3 py-1.5 text-xs font-bold rounded-[3px] focus:border-[#2271b1] outline-none bg-white"
                      placeholder="Frequently Asked Questions"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between bg-[#f6f7f7] p-3 border border-[#c3c4c7] rounded-sm">
                  <div>
                    <h3 className="text-sm font-bold text-[#1d2327]">Questions & Answers ({faqItems.length} Items)</h3>
                    <p className="text-xs text-[#646970]">Accordion questions shown on the About page.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddFaq}
                    className="bg-[#2271b1] text-white text-xs font-semibold px-3 py-1.5 rounded-[3px] hover:bg-[#135e96] transition-colors cursor-pointer"
                  >
                    + Add Question
                  </button>
                </div>

                <div className="space-y-3">
                  {faqItems.map((item: any, idx: number) => (
                    <div key={idx} className="p-3 bg-white border border-[#c3c4c7] rounded-sm shadow-sm space-y-2">
                      <div className="flex items-center justify-between border-b border-[#f0f0f1] pb-1.5">
                        <span className="text-[11px] font-bold text-slate-500 font-mono">Q#{idx + 1}</span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleMoveFaq(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1 text-gray-500 hover:text-black hover:bg-gray-100 rounded disabled:opacity-30 cursor-pointer"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveFaq(idx, 'down')}
                            disabled={idx === faqItems.length - 1}
                            className="p-1 text-gray-500 hover:text-black hover:bg-gray-100 rounded disabled:opacity-30 cursor-pointer"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteFaq(idx)}
                            className="p-1 text-red-500 hover:bg-red-50 rounded ml-1 cursor-pointer"
                            title="Delete Question"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Question</label>
                          <input
                            type="text"
                            value={item.question || ""}
                            onChange={(e) => handleUpdateFaq(idx, "question", e.target.value)}
                            className="w-full border border-[#c3c4c7] px-2.5 py-1 text-xs font-bold rounded-[3px] focus:border-[#2271b1] outline-none bg-white"
                            placeholder="e.g. What services are included?"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Answer</label>
                          <textarea
                            rows={3}
                            value={item.answer || ""}
                            onChange={(e) => handleUpdateFaq(idx, "answer", e.target.value)}
                            className="w-full border border-[#c3c4c7] px-2.5 py-1.5 text-xs rounded-[3px] focus:border-[#2271b1] outline-none bg-white"
                            placeholder="Provide the comprehensive answer here..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 5: CTA BANNER */}
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
                      value={cta.description || "Join hundreds of satisfied Central Ohio families who trust us to make their holiday lighting stress-free and spectacular. Get your free, no-obligation quote today!"}
                      onChange={(e) => updateCta("description", e.target.value)}
                      className="w-full border border-[#c3c4c7] px-3 py-2 text-xs rounded-[3px] focus:border-[#2271b1] outline-none bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#f0f0f1]">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-500 uppercase">Primary Button Label (Call)</label>
                      <input
                        type="text"
                        value={cta.primaryButtonText || "Call Us Now"}
                        onChange={(e) => updateCta("primaryButtonText", e.target.value)}
                        className="w-full border border-[#c3c4c7] px-3 py-1.5 text-xs font-bold rounded-[3px] bg-white outline-none focus:border-[#2271b1]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-500 uppercase">Secondary Button Label (Modal)</label>
                      <input
                        type="text"
                        value={cta.secondaryButtonText || "Schedule Free Consultation"}
                        onChange={(e) => updateCta("secondaryButtonText", e.target.value)}
                        className="w-full border border-[#c3c4c7] px-3 py-1.5 text-xs font-bold rounded-[3px] bg-white outline-none focus:border-[#2271b1]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Phone Number</label>
                    <input
                      type="text"
                      value={cta.phone || "(614) 301-7100"}
                      onChange={(e) => updateCta("phone", e.target.value)}
                      className="w-full border border-[#c3c4c7] px-3 py-1.5 text-xs font-bold rounded-[3px] bg-white outline-none focus:border-[#2271b1]"
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
