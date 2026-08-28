"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
   Plus, Trash2, Loader2, Image as ImageIcon,
   LayoutTemplate, Type, Settings, Star,
   CheckCircle2, List, CircleHelp, Mail, Briefcase,
   ChevronRight, X
} from "lucide-react";
import dynamic from "next/dynamic";
import ContentSelector from "@/components/admin/ContentSelector";
import IconSelector from "@/components/admin/IconSelector";
import ImageField from "@/components/admin/ImageField";
import BlogSelector from "@/components/admin/BlogSelector";
import MediaSelector from "@/components/admin/MediaSelector";
const RichTextEditor = dynamic(() => import("@/components/admin/RichTextEditor"), {
   ssr: false,
   loading: () => <div className="h-64 bg-[#f6f7f7] animate-pulse border border-[#c3c4c7] rounded-sm flex items-center justify-center text-[#8c8f94] text-xs">Loading Rich Text Editor...</div>
});
const QuillEditor = dynamic(() => import("@/components/admin/QuillEditor"), {
   ssr: false,
   loading: () => <div className="h-40 bg-[#f6f7f7] animate-pulse border border-[#c3c4c7] rounded-sm flex items-center justify-center text-[#8c8f94] text-xs">Loading editor...</div>
});
import { UI } from "./styles";

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

export default function HomeEditor({ pageId, data, setData }: { pageId: string, data: any, setData: (d: any) => void }) {
   const [activeTab, setActiveTab] = useState("hero");
   const [showPortfolioMedia, setShowPortfolioMedia] = useState(false);

   useEffect(() => {
      if (data && Object.keys(data).length === 0) {
         setData({
            hero: { badge: "", headlines: [{ text: "", highlight: false }], description: "", buttons: [{ text: "", href: "", primary: true }], stats: [], images: [], bgImageAlt: "" },
            about: { badge: "", headline: { prefix: "", highlight: "", suffix: "" }, description: "", image: { src: "", alt: "", badge: "" }, points: [] },
            services: { badge: "", headline: { prefix: "", highlight: "", suffix: "" }, description: [], stats: [], services: [] },
            whyChooseUs: { section: { badge: "", headline: "", description: "" }, features: [], stats: [] },
            leadership: {
               section: { badge: "", headline: "", description: "" },
               ceo: { name: "", title: "", image: { src: "", alt: "" }, badges: { top: "", bottom: "" }, quotes: [""], description: "", socials: [] }
            },
            portfolio: { section: { badge: "", headline: "" }, projects: [], button: { text: "", link: "" } },
            testimonials: { section: { badge: "", headline: "", featured: "" }, stats: { subscribers: "" }, testimonials: [] },
            quote: { section: { badge: "", headline: "", description: "" }, success: { title: "", message: "", buttonText: "" }, services: [], timelines: [] }
         });
      }
   }, [data, setData]);

   if (!data) return <div className="flex items-center justify-center h-64"><Loader2 className="w-5 h-5 text-[#2271b1] animate-spin" /></div>;

   const updateSection = (section: string | null, field: string | null, value: any) => {
      setData((prev: any) => {
         const currentData = prev || {};

         if (!section) {
            let newValue = value;
            if (typeof value === 'function') {
               newValue = value(currentData[field as string]);
            }
            return { ...currentData, [field as string]: newValue };
         }

         const sectionData = currentData[section] || {};
         let newValue = value;
         if (typeof value === 'function') {
            const currentValue = field ? sectionData[field] : sectionData;
            newValue = value(currentValue);
         }

         if (field) {
            return {
               ...currentData,
               [section]: {
                  ...sectionData,
                  [field]: newValue
               }
            };
         }
         return {
            ...currentData,
            [section]: newValue
         };
      });
   };

   const tabs = [
      { id: "hero", label: "Home" },
      { id: "about", label: "About" },
      { id: "services", label: "Services" },
      { id: "whyChooseUs", label: "How We Work" },
      { id: "portfolio", label: "Work" },
      { id: "serviceAreas", label: "Service Areas" },
      { id: "testimonials", label: "Reviews" },
      { id: "faq", label: "FAQ" },
      { id: "quote", label: "Contact Form" },
   ];

   return (
      <div className="bg-white max-w-3xl mx-auto pb-20">
         {/* WP Tabs */}
         <div className="flex flex-wrap items-center gap-1 mb-10 text-[13px] border-b border-[#f0f0f1] pb-1 sticky top-0 bg-white z-10 pt-2">
            {tabs.map((tab: any, idx: number) => (
               <React.Fragment key={tab.id}>
                  <button
                     onClick={() => setActiveTab(tab.id)}
                     className={`px-1 py-1 transition-colors ${activeTab === tab.id ? 'text-[#1d2327] font-bold border-b-2 border-[#2271b1]' : 'text-[#2271b1] hover:text-[#135e96]'}`}
                  >
                     {tab.label}
                  </button>
                  {idx < tabs.length - 1 && <span className="text-[#c3c4c7] px-1">|</span>}
               </React.Fragment>
            ))}
         </div>

         <AnimatePresence mode="wait">
            <motion.div
               key={activeTab}
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
               className="space-y-12"
            >
               {/* HERO SECTION */}
               {activeTab === "hero" && (
                  <div className="space-y-12">
                     <div className="space-y-6">
                        <h3 className={UI.sectionHeader}>1. Main Headline (3-Part Structured)</h3>
                        <div className={UI.card + " space-y-4"}>
                           <div className="space-y-1.5">
                              <label className={UI.label}>Part 1 (White Intro Line)</label>
                              <input
                                 type="text"
                                 value={data.hero?.title?.part1 ?? data.hero?.headlines?.[0]?.text ?? "Illuminate Your"}
                                 onChange={(e) => updateSection("hero", "title", { ...(data.hero?.title || {}), part1: e.target.value })}
                                 className={UI.input}
                                 placeholder="Illuminate Your"
                              />
                           </div>
                           <div className="space-y-1.5">
                              <label className={UI.label}>Part 2 (Gold/Red Highlighted Line)</label>
                              <input
                                 type="text"
                                 value={data.hero?.title?.part2 ?? data.hero?.headlines?.[1]?.text ?? "Holiday Season"}
                                 onChange={(e) => updateSection("hero", "title", { ...(data.hero?.title || {}), part2: e.target.value })}
                                 className={UI.input + " font-bold text-amber-600 border-amber-300"}
                                 placeholder="Holiday Season"
                              />
                           </div>
                           <div className="space-y-1.5">
                              <label className={UI.label}>Part 3 (Gold/Red Accent Line)</label>
                              <input
                                 type="text"
                                 value={data.hero?.title?.part3 ?? data.hero?.headlines?.[2]?.text ?? "With Custom Magic"}
                                 onChange={(e) => updateSection("hero", "title", { ...(data.hero?.title || {}), part3: e.target.value })}
                                 className={UI.input + " font-bold text-amber-600 border-amber-300"}
                                 placeholder="With Custom Magic"
                              />
                           </div>
                        </div>
                     </div>

                     <div className="space-y-6">
                        <h3 className={UI.sectionHeader}>2. Subtitle & Narrative</h3>
                        <div className={UI.card}>
                           <textarea
                              rows={3}
                              value={data.hero?.subtitle ?? data.hero?.description ?? ""}
                              onChange={(e) => {
                                 updateSection("hero", "subtitle", e.target.value);
                                 updateSection("hero", "description", e.target.value);
                              }}
                              className={UI.input + " resize-y"}
                              placeholder="Commercial & residential holiday lighting designed, installed, maintained, and stored for you."
                           />
                        </div>
                     </div>

                     <div className="space-y-6">
                        <h3 className={UI.sectionHeader}>3. Call-To-Action (CTA)</h3>
                        <div className={UI.card + " space-y-4"}>
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                 <label className={UI.label}>Button Text</label>
                                 <input
                                    type="text"
                                    value={data.hero?.cta?.subtext ?? data.hero?.cta?.text ?? data.hero?.buttons?.[0]?.text ?? "Get My Free Quote"}
                                    onChange={(e) => {
                                       const val = e.target.value;
                                       updateSection("hero", "cta", { ...(data.hero?.cta || {}), text: val, subtext: val });
                                    }}
                                    className={UI.input}
                                    placeholder="Get My Free Quote"
                                 />
                              </div>
                              <div className="space-y-1.5">
                                 <label className={UI.label}>Target Link / Anchor</label>
                                 <input
                                    type="text"
                                    value={data.hero?.cta?.link ?? data.hero?.buttons?.[0]?.href ?? "#freequote"}
                                    onChange={(e) => {
                                       updateSection("hero", "cta", { ...(data.hero?.cta || {}), link: e.target.value });
                                    }}
                                    className={UI.input}
                                    placeholder="#freequote or /contact"
                                 />
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="space-y-6">
                        <h3 className={UI.sectionHeader}>4. Hero Visual Assets</h3>
                        <div className="grid grid-cols-1 gap-6">
                           <ImageField
                              label="Main Background Image"
                              value={data.hero?.bgImage || data.hero?.images?.[0] || ""}
                              onChange={(url) => {
                                 updateSection("hero", "bgImage", url);
                                 updateSection("hero", "images", [url]);
                              }}
                              altValue={data.hero?.bgImageAlt || ""}
                              onAltChange={(alt) => updateSection("hero", "bgImageAlt", alt)}
                           />
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <ImageField
                                 label="Left Christmas Tree Image"
                                 value={data.hero?.leftTreeImage || ""}
                                 onChange={(url) => updateSection("hero", "leftTreeImage", url)}
                              />
                              <ImageField
                                 label="Right Christmas Tree Image"
                                 value={data.hero?.rightTreeImage || ""}
                                 onChange={(url) => updateSection("hero", "rightTreeImage", url)}
                              />
                           </div>
                        </div>
                     </div>
                  </div>
               )}

               {/* ABOUT SECTION */}
               {activeTab === "about" && (
                  <div className="space-y-10">
                     <div className="space-y-6">
                        <h3 className={UI.sectionHeader}>1. Section Heading</h3>
                        <div className={UI.card + " space-y-3"}>
                           <label className={UI.label}>Gradient Title Text</label>
                           <input
                              type="text"
                              value={data.about?.headline?.highlight || data.about?.headline?.text || data.about?.title || "Serving Columbus With Stress Free Holiday Lighting"}
                              onChange={(e) => {
                                 const val = e.target.value;
                                 updateSection("about", "headline", { ...(data.about?.headline || {}), highlight: val, text: val });
                                 updateSection("about", "title", val);
                              }}
                              className={UI.input + " font-bold text-amber-700"}
                              placeholder="Serving Columbus With Stress Free Holiday Lighting"
                           />
                        </div>
                     </div>

                     <div className="space-y-6">
                        <h3 className={UI.sectionHeader}>2. Narrative & Paragraphs</h3>
                        <div className={UI.card}>
                           <textarea
                              rows={5}
                              value={data.about?.description || ""}
                              onChange={(e) => updateSection("about", "description", e.target.value)}
                              className={UI.input + " resize-y"}
                              placeholder="The holiday season is all about making memories, and nothing brings that magic to life like a beautifully lit home...&#10;&#10;From custom design and installation to maintenance, removal, and storage, we handle everything..."
                           />
                        </div>
                     </div>

                     <div className="space-y-6">
                        <h3 className={UI.sectionHeader}>3. Action Buttons (CTAs)</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                           <div className={UI.card + " space-y-3"}>
                              <span className="text-[11px] font-bold text-[#646970] uppercase">Primary CTA (Quote Button)</span>
                              <div className="space-y-1.5">
                                 <label className={UI.label}>Button Text</label>
                                 <input
                                    type="text"
                                    value={data.about?.buttons?.[0]?.text ?? "Get My Free Quote"}
                                    onChange={(e) => {
                                       const nb = [...(data.about?.buttons || [{ text: "Get My Free Quote", href: "#freequote" }, { text: "View Gallery", href: "/gallery" }])];
                                       nb[0] = { ...nb[0], text: e.target.value };
                                       updateSection("about", "buttons", nb);
                                    }}
                                    className={UI.input}
                                 />
                              </div>
                              <div className="space-y-1.5">
                                 <label className={UI.label}>Target Link / Anchor</label>
                                 <input
                                    type="text"
                                    value={data.about?.buttons?.[0]?.href ?? "#freequote"}
                                    onChange={(e) => {
                                       const nb = [...(data.about?.buttons || [{ text: "Get My Free Quote", href: "#freequote" }, { text: "View Gallery", href: "/gallery" }])];
                                       nb[0] = { ...nb[0], href: e.target.value };
                                       updateSection("about", "buttons", nb);
                                    }}
                                    className={UI.input}
                                 />
                              </div>
                           </div>

                           <div className={UI.card + " space-y-3"}>
                              <span className="text-[11px] font-bold text-[#646970] uppercase">Secondary CTA (Gallery Button)</span>
                              <div className="space-y-1.5">
                                 <label className={UI.label}>Button Text</label>
                                 <input
                                    type="text"
                                    value={data.about?.buttons?.[1]?.text ?? "View Gallery"}
                                    onChange={(e) => {
                                       const nb = [...(data.about?.buttons || [{ text: "Get My Free Quote", href: "#freequote" }, { text: "View Gallery", href: "/gallery" }])];
                                       if (!nb[1]) nb[1] = { text: "View Gallery", href: "/gallery" };
                                       nb[1] = { ...nb[1], text: e.target.value };
                                       updateSection("about", "buttons", nb);
                                    }}
                                    className={UI.input}
                                 />
                              </div>
                              <div className="space-y-1.5">
                                 <label className={UI.label}>Target Link</label>
                                 <input
                                    type="text"
                                    value={data.about?.buttons?.[1]?.href ?? "/gallery"}
                                    onChange={(e) => {
                                       const nb = [...(data.about?.buttons || [{ text: "Get My Free Quote", href: "#freequote" }, { text: "View Gallery", href: "/gallery" }])];
                                       if (!nb[1]) nb[1] = { text: "View Gallery", href: "/gallery" };
                                       nb[1] = { ...nb[1], href: e.target.value };
                                       updateSection("about", "buttons", nb);
                                    }}
                                    className={UI.input}
                                 />
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="space-y-6">
                        <h3 className={UI.sectionHeader}>4. Owner / Feature Media</h3>
                        <ImageField
                           label="Owner Portrait Image"
                           value={data.about?.image?.src || ""}
                           onChange={(url) => updateSection("about", "image", { ...(data.about?.image || {}), src: url })}
                           altValue={data.about?.image?.alt || ""}
                           onAltChange={(alt) => updateSection("about", "image", { ...(data.about?.image || {}), alt: alt })}
                           description="Vertical owner portrait shown on the left side with festive rounded corner lighting."
                        />
                     </div>
                  </div>
               )}

               {/* SERVICES SECTION */}
               {activeTab === "services" && (
                  <div className="space-y-10">
                     <div className="space-y-6">
                        <h3 className={UI.sectionHeader}>1. Section Heading</h3>
                        <div className={UI.card + " space-y-3"}>
                           <label className={UI.label}>Gradient Title Text</label>
                           <input
                              type="text"
                              value={data.services?.title || data.services?.headline?.highlight || "Premium Christmas Lighting Services"}
                              onChange={(e) => {
                                 const val = e.target.value;
                                 updateSection("services", "title", val);
                                 updateSection("services", "headline", { ...(data.services?.headline || {}), highlight: val, text: val });
                              }}
                              className={UI.input + " font-bold text-amber-700"}
                              placeholder="Premium Christmas Lighting Services"
                           />
                        </div>
                     </div>

                     <div className="space-y-6">
                        <h3 className={UI.sectionHeader}>2. Section Subtitle & Narrative</h3>
                        <div className={UI.card}>
                           <textarea
                              rows={3}
                              value={data.services?.subtitle || (Array.isArray(data.services?.description) ? data.services.description.join(" ") : (data.services?.description || ""))}
                              onChange={(e) => {
                                 updateSection("services", "subtitle", e.target.value);
                                 updateSection("services", "description", e.target.value);
                              }}
                              className={UI.input + " resize-y"}
                              placeholder="Custom residential and commercial holiday lighting designed, installed, maintained, and stored for you in Columbus, OH."
                           />
                        </div>
                     </div>

                     <div className="space-y-6 pt-6 border-t border-[#f0f0f1]">
                        <h3 className={UI.sectionHeader}>3. Featured Services Selector</h3>
                        <ContentSelector
                           type="services"
                           label="Featured Services (Select and Re-order services shown on the homepage)"
                           selectedItems={data.services?.services}
                           onSelect={(items) => updateSection("services", "services", items)}
                        />
                     </div>

                     <div className="space-y-6 pt-6 border-t border-[#f0f0f1]">
                        <h3 className={UI.sectionHeader}>4. Bottom Call to Action</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                           <div className={UI.card + " space-y-1.5"}>
                              <label className={UI.label}>Button Text</label>
                              <input
                                 type="text"
                                 value={data.services?.cta?.buttonText ?? "View All Services"}
                                 onChange={(e) => updateSection("services", "cta", { ...(data.services?.cta || {}), buttonText: e.target.value })}
                                 className={UI.input}
                                 placeholder="View All Services"
                              />
                           </div>
                           <div className={UI.card + " space-y-1.5"}>
                              <label className={UI.label}>Button Target Link</label>
                              <input
                                 type="text"
                                 value={data.services?.cta?.buttonLink ?? "/services"}
                                 onChange={(e) => updateSection("services", "cta", { ...(data.services?.cta || {}), buttonLink: e.target.value })}
                                 className={UI.input}
                                 placeholder="/services"
                              />
                           </div>
                        </div>
                     </div>
                  </div>
               )}
               {/* HOW WE WORK / PROCESS SECTION */}
               {activeTab === "whyChooseUs" && (
                  <div className="space-y-12">
                     <div className="space-y-6">
                        <h3 className={UI.sectionHeader}>1. Section Header</h3>
                        <div className="space-y-1.5">
                           <label className={UI.label}>Badge</label>
                           <input
                              type="text"
                              value={data.howWeWork?.badge ?? data.whyChooseUs?.section?.badge ?? "Simple 3-Step Process"}
                              onChange={(e) => {
                                 updateSection("howWeWork", "badge", e.target.value);
                                 updateSection("whyChooseUs", "section", { ...(data.whyChooseUs?.section || {}), badge: e.target.value });
                              }}
                              className={UI.input}
                              placeholder="Simple 3-Step Process"
                           />
                        </div>
                        <div className="space-y-1.5">
                           <label className={UI.label}>Section Title (Gradient Headline)</label>
                           <input
                              type="text"
                              value={data.howWeWork?.title ?? data.whyChooseUs?.section?.title ?? "Working With Us Couldn't Be Easier"}
                              onChange={(e) => {
                                 updateSection("howWeWork", "title", e.target.value);
                                 updateSection("whyChooseUs", "section", { ...(data.whyChooseUs?.section || {}), title: e.target.value });
                              }}
                              className={UI.input + " font-bold border-[#2271b1]"}
                              placeholder="Working With Us Couldn't Be Easier"
                           />
                        </div>
                        <div className="space-y-1.5">
                           <label className={UI.label}>Subtitle / Narrative</label>
                           <textarea
                              rows={3}
                              value={data.howWeWork?.subtitle ?? data.whyChooseUs?.section?.description ?? "From your initial free quote to final takedown in January, we make holiday lighting completely stress-free."}
                              onChange={(e) => {
                                 updateSection("howWeWork", "subtitle", e.target.value);
                                 updateSection("whyChooseUs", "section", { ...(data.whyChooseUs?.section || {}), description: e.target.value });
                              }}
                              className={UI.input}
                              placeholder="From your initial free quote to final takedown in January, we make holiday lighting completely stress-free."
                           />
                        </div>
                     </div>

                     <div className="space-y-8">
                        <div className="flex justify-between items-center">
                           <h3 className={UI.sectionHeader}>2. Process Steps</h3>
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
                                 updateSection("howWeWork", "steps", [...currentSteps, newStep]);
                              }}
                              className={UI.buttonAdd}
                           >
                              + Add Step
                           </button>
                        </div>

                        <div className="space-y-6">
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
                           ]).map((step: any, i: number) => (
                              <div key={i} className={UI.card + " space-y-4"}>
                                 <div className="flex justify-between items-center pb-2 border-b border-[#f0f0f1]">
                                    <span className="text-xs font-bold text-[#1d2327]">Step #{i + 1} ({step.number || String(i + 1).padStart(2, "0")})</span>
                                    <button
                                       onClick={() => {
                                          const currentSteps = data.howWeWork?.steps || data.whyChooseUs?.features || [];
                                          const filtered = currentSteps.filter((_: any, idx: number) => idx !== i);
                                          updateSection("howWeWork", "steps", filtered);
                                       }}
                                       className="text-[#d63638] hover:text-red-700"
                                    >
                                       <Trash2 className="w-4 h-4" />
                                    </button>
                                 </div>

                                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-1.5">
                                       <label className={UI.label}>Step Number</label>
                                       <input
                                          type="text"
                                          value={step.number || String(i + 1).padStart(2, "0")}
                                          onChange={(e) => {
                                             const currentSteps = [...(data.howWeWork?.steps || data.whyChooseUs?.features || [])];
                                             currentSteps[i] = { ...(currentSteps[i] || {}), number: e.target.value };
                                             updateSection("howWeWork", "steps", currentSteps);
                                          }}
                                          className={UI.input}
                                          placeholder="01"
                                       />
                                    </div>

                                    <div className="space-y-1.5">
                                       <label className={UI.label}>Accent Color</label>
                                       <div className="flex items-center gap-2">
                                          <input
                                             type="color"
                                             value={step.color || "#ef4444"}
                                             onChange={(e) => {
                                                const currentSteps = [...(data.howWeWork?.steps || data.whyChooseUs?.features || [])];
                                                currentSteps[i] = { ...(currentSteps[i] || {}), color: e.target.value };
                                                updateSection("howWeWork", "steps", currentSteps);
                                             }}
                                             className="w-10 h-9 p-0 border border-gray-300 rounded cursor-pointer"
                                          />
                                          <input
                                             type="text"
                                             value={step.color || "#ef4444"}
                                             onChange={(e) => {
                                                const currentSteps = [...(data.howWeWork?.steps || data.whyChooseUs?.features || [])];
                                                currentSteps[i] = { ...(currentSteps[i] || {}), color: e.target.value };
                                                updateSection("howWeWork", "steps", currentSteps);
                                             }}
                                             className={UI.input}
                                             placeholder="#ef4444"
                                          />
                                       </div>
                                    </div>

                                    <div className="space-y-1.5">
                                       <label className={UI.label}>Icon</label>
                                       <select
                                          value={step.icon || "FaQuoteRight"}
                                          onChange={(e) => {
                                             const currentSteps = [...(data.howWeWork?.steps || data.whyChooseUs?.features || [])];
                                             currentSteps[i] = { ...(currentSteps[i] || {}), icon: e.target.value };
                                             updateSection("howWeWork", "steps", currentSteps);
                                          }}
                                          className={UI.input}
                                       >
                                          <option value="FaQuoteRight">Quote / Chat (FaQuoteRight)</option>
                                          <option value="FaCalendarCheck">Calendar / Booking (FaCalendarCheck)</option>
                                          <option value="FaChair">Relax / Chair (FaChair)</option>
                                          <option value="GiFruitTree">Tree / Lighting (GiFruitTree)</option>
                                          <option value="FaPhoneAlt">Phone (FaPhoneAlt)</option>
                                       </select>
                                    </div>
                                 </div>

                                 <div className="space-y-1.5">
                                    <label className={UI.label}>Step Title</label>
                                    <input
                                       type="text"
                                       value={step.title || ""}
                                       onChange={(e) => {
                                          const currentSteps = [...(data.howWeWork?.steps || data.whyChooseUs?.features || [])];
                                          currentSteps[i] = { ...(currentSteps[i] || {}), title: e.target.value };
                                          updateSection("howWeWork", "steps", currentSteps);
                                       }}
                                       className={UI.input + " font-bold"}
                                       placeholder="e.g. Design & Free Quote"
                                    />
                                 </div>

                                 <div className="space-y-1.5">
                                    <label className={UI.label}>Step Description</label>
                                    <textarea
                                       rows={2}
                                       value={step.description || ""}
                                       onChange={(e) => {
                                          const currentSteps = [...(data.howWeWork?.steps || data.whyChooseUs?.features || [])];
                                          currentSteps[i] = { ...(currentSteps[i] || {}), description: e.target.value };
                                          updateSection("howWeWork", "steps", currentSteps);
                                       }}
                                       className={UI.input}
                                       placeholder="Explain what happens during this step..."
                                    />
                                 </div>

                                 <div className="space-y-2 pt-2 border-t border-[#f0f0f1]">
                                    <div className="flex justify-between items-center">
                                       <label className={UI.label}>Bullet Points (Features)</label>
                                       <button
                                          type="button"
                                          onClick={() => {
                                             const currentSteps = [...(data.howWeWork?.steps || data.whyChooseUs?.features || [])];
                                             const currentFeats = currentSteps[i]?.features || [];
                                             currentSteps[i] = {
                                                ...(currentSteps[i] || {}),
                                                features: [...currentFeats, "New benefit feature"]
                                             };
                                             updateSection("howWeWork", "steps", currentSteps);
                                          }}
                                          className="text-xs text-[#2271b1] hover:underline font-semibold"
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
                                                   const currentFeats = [...(currentSteps[i]?.features || [])];
                                                   currentFeats[featIdx] = e.target.value;
                                                   currentSteps[i] = { ...(currentSteps[i] || {}), features: currentFeats };
                                                   updateSection("howWeWork", "steps", currentSteps);
                                                }}
                                                className={UI.input}
                                                placeholder={`Bullet #${featIdx + 1}`}
                                             />
                                             <button
                                                type="button"
                                                onClick={() => {
                                                   const currentSteps = [...(data.howWeWork?.steps || data.whyChooseUs?.features || [])];
                                                   const currentFeats = (currentSteps[i]?.features || []).filter((_: any, fIdx: number) => fIdx !== featIdx);
                                                   currentSteps[i] = { ...(currentSteps[i] || {}), features: currentFeats };
                                                   updateSection("howWeWork", "steps", currentSteps);
                                                }}
                                                className="text-red-500 hover:text-red-700 p-1"
                                             >
                                                <Trash2 className="w-4 h-4" />
                                             </button>
                                          </div>
                                       );
                                    })}
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>

                     {/* 3. BOTTOM CALL TO ACTION (CTA) */}
                     <div className="space-y-6 pt-10 border-t border-[#f0f0f1]">
                        <h3 className={UI.sectionHeader}>3. Bottom Call to Action (CTA Banner)</h3>
                        <div className={UI.card + " space-y-4"}>
                           <div className="space-y-1.5">
                              <label className={UI.label}>CTA Headline Title</label>
                              <input
                                 type="text"
                                 value={data.howWeWork?.cta?.title ?? data.whyChooseUs?.cta?.title ?? "Ready to Transform Your Home?"}
                                 onChange={(e) => {
                                    updateSection("howWeWork", "cta", { ...(data.howWeWork?.cta || {}), title: e.target.value });
                                    updateSection("whyChooseUs", "cta", { ...(data.whyChooseUs?.cta || {}), title: e.target.value });
                                 }}
                                 className={UI.input + " font-bold"}
                                 placeholder="Ready to Transform Your Home?"
                              />
                           </div>

                           <div className="space-y-1.5">
                              <label className={UI.label}>CTA Subtitle / Description</label>
                              <textarea
                                 rows={2}
                                 value={data.howWeWork?.cta?.description ?? data.whyChooseUs?.cta?.description ?? "Join local homeowners who trust us to make their holidays shine"}
                                 onChange={(e) => {
                                    updateSection("howWeWork", "cta", { ...(data.howWeWork?.cta || {}), description: e.target.value });
                                    updateSection("whyChooseUs", "cta", { ...(data.whyChooseUs?.cta || {}), description: e.target.value });
                                 }}
                                 className={UI.input}
                                 placeholder="Join local homeowners who trust us to make their holidays shine"
                              />
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                              <div className="space-y-1.5">
                                 <label className={UI.label}>Primary Button Text</label>
                                 <input
                                    type="text"
                                    value={data.howWeWork?.cta?.buttons?.primary ?? data.howWeWork?.cta?.primaryButtonText ?? "Call Us Now"}
                                    onChange={(e) => {
                                       const currentCta = data.howWeWork?.cta || {};
                                       const currentButtons = currentCta.buttons || {};
                                       updateSection("howWeWork", "cta", { ...currentCta, primaryButtonText: e.target.value, buttons: { ...currentButtons, primary: e.target.value } });
                                    }}
                                    className={UI.input}
                                    placeholder="Call Us Now"
                                 />
                              </div>

                              <div className="space-y-1.5">
                                 <label className={UI.label}>Phone Number (Click to Call)</label>
                                 <input
                                    type="text"
                                    value={data.howWeWork?.cta?.phone ?? data.footer?.contact?.phone ?? "(614) 301-7100"}
                                    onChange={(e) => {
                                       updateSection("howWeWork", "cta", { ...(data.howWeWork?.cta || {}), phone: e.target.value });
                                    }}
                                    className={UI.input}
                                    placeholder="(614) 301-7100"
                                 />
                              </div>

                              <div className="space-y-1.5">
                                 <label className={UI.label}>Secondary Button Text (Modal Trigger)</label>
                                 <input
                                    type="text"
                                    value={data.howWeWork?.cta?.buttons?.secondary ?? data.howWeWork?.cta?.secondaryButtonText ?? "Schedule Free Consultation"}
                                    onChange={(e) => {
                                       const currentCta = data.howWeWork?.cta || {};
                                       const currentButtons = currentCta.buttons || {};
                                       updateSection("howWeWork", "cta", { ...currentCta, secondaryButtonText: e.target.value, buttons: { ...currentButtons, secondary: e.target.value } });
                                    }}
                                    className={UI.input}
                                    placeholder="Schedule Free Consultation"
                                 />
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               )}



               {/* SERVICE AREAS / VAN MAP SECTION */}
               {(activeTab === "serviceAreas") && (
                  <div className="space-y-12">
                     <div className="space-y-6">
                        <h3 className={UI.sectionHeader}>1. Section Header</h3>
                        <div className="space-y-1.5">
                           <label className={UI.label}>Main Title (Gradient Highlighted)</label>
                           <input
                              type="text"
                              value={data.serviceAreas?.title ?? data.leadership?.section?.headline ?? "Areas We Are Serving"}
                              onChange={(e) => {
                                 updateSection("serviceAreas", "title", e.target.value);
                                 updateSection("leadership", "section", { ...(data.leadership?.section || {}), headline: e.target.value });
                              }}
                              className={UI.input}
                              placeholder="e.g. Areas We Are Serving"
                           />
                        </div>
                        <div className="space-y-1.5">
                           <label className={UI.label}>Subtitle / Tagline</label>
                           <input
                              type="text"
                              value={data.serviceAreas?.subtitle ?? data.leadership?.section?.description ?? "Custom lighting installed by professionals."}
                              onChange={(e) => {
                                 updateSection("serviceAreas", "subtitle", e.target.value);
                                 updateSection("leadership", "section", { ...(data.leadership?.section || {}), description: e.target.value });
                              }}
                              className={UI.input}
                              placeholder="e.g. Custom lighting installed by professionals."
                           />
                        </div>
                     </div>

                     <div className="space-y-8 pt-10 border-t border-[#f0f0f1]">
                        <h3 className={UI.sectionHeader}>2. Map & Vehicle Graphics</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <ImageField
                              label="Service Area Background Map"
                              value={data.serviceAreas?.mapImage || "/images/realmap.jpeg"}
                              onChange={(url) => updateSection("serviceAreas", "mapImage", url)}
                              description="Background map image shown under the animated vehicle."
                           />
                           <ImageField
                              label="Service Vehicle (Van / Truck)"
                              value={data.serviceAreas?.vehicleImage || "/images/car2.png"}
                              onChange={(url) => updateSection("serviceAreas", "vehicleImage", url)}
                              description="Transparent PNG vehicle graphic that slides in with dust animations."
                           />
                        </div>
                     </div>

                     <div className="space-y-8 pt-10 border-t border-[#f0f0f1]">
                        <div className="flex justify-between items-center">
                           <h3 className={UI.sectionHeader}>3. Service Highlight Steps</h3>
                           <button
                              type="button"
                              onClick={() => {
                                 const steps = [...(data.serviceAreas?.steps || [])];
                                 steps.push({
                                    number: String(steps.length + 1).padStart(2, "0"),
                                    title: "New Highlight",
                                    description: "Description of service highlight...",
                                    icon: "FaCheckCircle",
                                    color: "#EF4444",
                                    features: ["Feature point 1", "Feature point 2"]
                                 });
                                 updateSection("serviceAreas", "steps", steps);
                              }}
                              className={UI.buttonAdd}
                           >
                              + Add Step
                           </button>
                        </div>

                        <div className="space-y-6">
                           {(data.serviceAreas?.steps || []).map((step: any, idx: number) => (
                              <div key={idx} className="bg-[#f6f7f7] border border-[#c3c4c7] p-4 rounded-sm space-y-4 relative">
                                 <div className="flex justify-between items-center border-b border-[#c3c4c7] pb-2">
                                    <span className="font-bold text-[13px] text-[#1d2327]">Step {step.number || idx + 1}: {step.title}</span>
                                    <button
                                       type="button"
                                       onClick={() => {
                                          const steps = (data.serviceAreas?.steps || []).filter((_: any, i: number) => i !== idx);
                                          updateSection("serviceAreas", "steps", steps);
                                       }}
                                       className="text-[#d63638] hover:text-red-700 text-xs flex items-center gap-1 font-bold"
                                    >
                                       <Trash2 className="w-3.5 h-3.5" /> Remove
                                    </button>
                                 </div>

                                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div className="space-y-1">
                                       <label className={UI.label}>Step Number</label>
                                       <input
                                          type="text"
                                          value={step.number || ""}
                                          onChange={(e) => {
                                             const steps = [...(data.serviceAreas?.steps || [])];
                                             steps[idx] = { ...steps[idx], number: e.target.value };
                                             updateSection("serviceAreas", "steps", steps);
                                          }}
                                          className={UI.input}
                                          placeholder="e.g. 01"
                                       />
                                    </div>
                                    <div className="space-y-1">
                                       <label className={UI.label}>Step Title</label>
                                       <input
                                          type="text"
                                          value={step.title || ""}
                                          onChange={(e) => {
                                             const steps = [...(data.serviceAreas?.steps || [])];
                                             steps[idx] = { ...steps[idx], title: e.target.value };
                                             updateSection("serviceAreas", "steps", steps);
                                          }}
                                          className={UI.input}
                                          placeholder="e.g. Multiple Locations"
                                       />
                                    </div>
                                    <div className="space-y-1">
                                       <label className={UI.label}>Accent Color</label>
                                       <div className="flex gap-2 items-center">
                                          <input
                                             type="color"
                                             value={step.color || "#EF4444"}
                                             onChange={(e) => {
                                                const steps = [...(data.serviceAreas?.steps || [])];
                                                steps[idx] = { ...steps[idx], color: e.target.value };
                                                updateSection("serviceAreas", "steps", steps);
                                             }}
                                             className="w-8 h-8 rounded border border-[#c3c4c7] cursor-pointer"
                                          />
                                          <input
                                             type="text"
                                             value={step.color || "#EF4444"}
                                             onChange={(e) => {
                                                const steps = [...(data.serviceAreas?.steps || [])];
                                                steps[idx] = { ...steps[idx], color: e.target.value };
                                                updateSection("serviceAreas", "steps", steps);
                                             }}
                                             className={UI.input + " flex-1"}
                                          />
                                       </div>
                                    </div>
                                 </div>

                                 <div className="space-y-1">
                                    <label className={UI.label}>Description</label>
                                    <textarea
                                       rows={2}
                                       value={step.description || ""}
                                       onChange={(e) => {
                                          const steps = [...(data.serviceAreas?.steps || [])];
                                          steps[idx] = { ...steps[idx], description: e.target.value };
                                          updateSection("serviceAreas", "steps", steps);
                                       }}
                                       className={UI.input}
                                       placeholder="Description..."
                                    />
                                 </div>

                                 {/* Bullet Features */}
                                 <div className="space-y-2 pt-2 border-t border-gray-200">
                                    <div className="flex justify-between items-center">
                                       <label className="text-[11px] font-bold text-gray-700 uppercase">Feature Bullet Points</label>
                                       <button
                                          type="button"
                                          onClick={() => {
                                             const steps = [...(data.serviceAreas?.steps || [])];
                                             const features = [...(steps[idx]?.features || [])];
                                             features.push("New Feature");
                                             steps[idx] = { ...steps[idx], features };
                                             updateSection("serviceAreas", "steps", steps);
                                          }}
                                          className="text-[#2271b1] hover:underline text-[11px] font-bold"
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
                                                   updateSection("serviceAreas", "steps", steps);
                                                }}
                                                className={UI.input + " text-xs py-1"}
                                                placeholder="Bullet point text..."
                                             />
                                             <button
                                                type="button"
                                                onClick={() => {
                                                   const steps = [...(data.serviceAreas?.steps || [])];
                                                   const features = (steps[idx]?.features || []).filter((_: any, i: number) => i !== fIdx);
                                                   steps[idx] = { ...steps[idx], features };
                                                   updateSection("serviceAreas", "steps", steps);
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
                  </div>
               )}

               {/* PORTFOLIO / WORK SHOWCASE SECTION */}
               {activeTab === "portfolio" && (
                  <div className="space-y-12">
                     <div className="space-y-6">
                        <h3 className={UI.sectionHeader}>1. Section Intro & Headlines</h3>
                        <div className={UI.card + " space-y-4"}>
                           <div className="space-y-1.5">
                              <label className={UI.label}>Badge</label>
                              <input
                                 type="text"
                                 value={data.workShowcase?.badge ?? data.portfolio?.section?.badge ?? "OUR WORK"}
                                 onChange={(e) => {
                                    updateSection("workShowcase", "badge", e.target.value);
                                    updateSection("portfolio", "section", { ...(data.portfolio?.section || {}), badge: e.target.value });
                                 }}
                                 className={UI.input}
                                 placeholder="e.g. OUR WORK"
                              />
                           </div>
                           <div className="space-y-1.5">
                              <label className={UI.label}>Headline Prefix (Top Small Heading)</label>
                              <input
                                 type="text"
                                 value={data.workShowcase?.title?.prefix ?? data.portfolio?.section?.prefix ?? data.portfolio?.section?.headlinePrefix ?? "EXPERIENCE THE MAGIC"}
                                 onChange={(e) => {
                                    const currentTitle = data.workShowcase?.title || {};
                                    updateSection("workShowcase", "title", { ...currentTitle, prefix: e.target.value });
                                    updateSection("portfolio", "section", { ...(data.portfolio?.section || {}), prefix: e.target.value, headlinePrefix: e.target.value });
                                 }}
                                 className={UI.input}
                                 placeholder="e.g. EXPERIENCE THE MAGIC"
                              />
                           </div>
                           <div className="space-y-1.5">
                              <label className={UI.label}>Main Headline (Gradient Gold-to-Red Text)</label>
                              <input
                                 type="text"
                                 value={data.workShowcase?.title?.main ?? data.portfolio?.section?.headline ?? data.portfolio?.section?.title ?? "PORTFOLIO"}
                                 onChange={(e) => {
                                    const currentTitle = data.workShowcase?.title || {};
                                    updateSection("workShowcase", "title", { ...currentTitle, main: e.target.value });
                                    updateSection("portfolio", "section", { ...(data.portfolio?.section || {}), headline: e.target.value, title: e.target.value });
                                 }}
                                 className={UI.inputLarge + " text-[#2271b1] font-bold"}
                                 placeholder="e.g. PORTFOLIO"
                              />
                           </div>
                           <div className="space-y-1.5">
                              <label className={UI.label}>Description / Subtitle</label>
                              <textarea
                                 rows={3}
                                 value={data.workShowcase?.description ?? data.portfolio?.section?.description ?? "Browse our recent holiday lighting displays and permanent architectural lighting installations across Columbus."}
                                 onChange={(e) => {
                                    updateSection("workShowcase", "description", e.target.value);
                                    updateSection("portfolio", "section", { ...(data.portfolio?.section || {}), description: e.target.value });
                                 }}
                                 className={UI.input}
                                 placeholder="Browse our recent holiday lighting displays..."
                              />
                           </div>
                        </div>
                     </div>

                     <div className="space-y-6 pt-6 border-t border-[#f0f0f1]">
                        <h3 className={UI.sectionHeader}>2. Call to Action Button</h3>
                        <div className={UI.card + " space-y-4"}>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                 <label className={UI.label}>Button Text</label>
                                 <input
                                    type="text"
                                    value={data.workShowcase?.cta ?? data.portfolio?.button?.text ?? "View Full Gallery"}
                                    onChange={(e) => {
                                       updateSection("workShowcase", "cta", e.target.value);
                                       updateSection("portfolio", "button", { ...(data.portfolio?.button || {}), text: e.target.value });
                                    }}
                                    className={UI.input}
                                    placeholder="e.g. View Full Gallery"
                                 />
                              </div>
                              <div className="space-y-1.5">
                                 <label className={UI.label}>Destination Link</label>
                                 <input
                                    type="text"
                                    value={data.workShowcase?.ctaLink ?? data.portfolio?.button?.link ?? "/gallery"}
                                    onChange={(e) => {
                                       updateSection("workShowcase", "ctaLink", e.target.value);
                                       updateSection("portfolio", "button", { ...(data.portfolio?.button || {}), link: e.target.value });
                                    }}
                                    className={UI.input}
                                    placeholder="e.g. /gallery"
                                 />
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="space-y-6 pt-6 border-t border-[#f0f0f1]">
                        <h3 className={UI.sectionHeader}>3. Work & Image Selection</h3>
                        <div className="space-y-4">
                           <ContentSelector
                              type="projects"
                              label="Featured Projects (or Custom Showcase)"
                              selectedItems={data.portfolio?.projects}
                              onSelect={(items) => {
                                 updateSection("portfolio", "projects", items);
                                 const extractedImages = items.map((p: any) => p.image || p.src || p.overviewImage || "").filter(Boolean);
                                 if (extractedImages.length > 0) {
                                    updateSection("workShowcase", "images", extractedImages);
                                 }
                              }}
                           />

                           <div className="space-y-4 pt-4 border-t border-[#f0f0f1]">
                              <div className="flex flex-wrap justify-between items-center gap-2">
                                 <div>
                                    <label className={UI.label}>Showcase Gallery Images (Dual Marquees)</label>
                                    <p className="text-[#646970] text-[12px] italic">Add, upload, or remove images displayed in the rotating showcase.</p>
                                 </div>
                                 <div className="flex gap-2">
                                    <button
                                       type="button"
                                       onClick={() => setShowPortfolioMedia(true)}
                                       className="bg-[#2271b1] text-white text-[12px] font-bold px-3 py-1.5 rounded-sm hover:bg-[#135e96] transition-colors shadow-sm flex items-center gap-1"
                                    >
                                       <Plus className="w-3.5 h-3.5" /> Pick / Upload Image
                                    </button>
                                    <button
                                       type="button"
                                       onClick={() => {
                                          const currentImages = [...(data.workShowcase?.images || data.portfolio?.images || [])];
                                          currentImages.push("");
                                          updateSection("workShowcase", "images", currentImages);
                                          updateSection("portfolio", "images", currentImages);
                                       }}
                                       className={UI.buttonAdd}
                                    >
                                       + Add URL
                                    </button>
                                 </div>
                              </div>

                              {/* Visual Thumbnail Grid */}
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
                                 {(data.workShowcase?.images || data.portfolio?.images || []).map((imgUrl: string, idx: number) => (
                                    <div key={idx} className="relative group bg-[#f6f7f7] border border-[#c3c4c7] rounded-sm p-1.5 flex flex-col justify-between overflow-hidden shadow-sm">
                                       <div className="w-full h-24 bg-gray-200 rounded-sm overflow-hidden mb-1 flex items-center justify-center relative">
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
                                                updateSection("workShowcase", "images", newImgs);
                                                updateSection("portfolio", "images", newImgs);
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
                                             updateSection("workShowcase", "images", newImgs);
                                             updateSection("portfolio", "images", newImgs);
                                          }}
                                          className="w-full bg-white border border-[#c3c4c7] text-[11px] px-1.5 py-1 rounded-[2px] outline-none focus:border-[#2271b1]"
                                          placeholder="Image URL..."
                                       />
                                    </div>
                                 ))}
                              </div>
                              {(!data.workShowcase?.images || data.workShowcase.images.length === 0) && (
                                 <p className="text-gray-400 text-xs italic text-center py-4 bg-gray-50 border border-dashed border-gray-300 rounded">
                                    Using default holiday gallery images. Click "+ Pick / Upload Image" to customize your marquee!
                                 </p>
                              )}
                           </div>
                        </div>
                     </div>

                     {/* Media Selector Modal */}
                     <AnimatePresence>
                        {showPortfolioMedia && (
                           <MediaSelector
                              title="Select / Upload Showcase Image"
                              onSelect={(item: any) => {
                                 const currentImages = [...(data.workShowcase?.images || data.portfolio?.images || [])];
                                 currentImages.push(item.url);
                                 updateSection("workShowcase", "images", currentImages);
                                 updateSection("portfolio", "images", currentImages);
                                 setShowPortfolioMedia(false);
                              }}
                              onClose={() => setShowPortfolioMedia(false)}
                           />
                        )}
                     </AnimatePresence>
                  </div>
               )}

               {/* TESTIMONIALS */}
               {activeTab === "testimonials" && (
                  <div className="space-y-12">
                     <div className="space-y-6">
                        <h3 className={UI.sectionHeader}>1. Section Intro & Headlines</h3>
                        <div className="space-y-4">
                           <div className="space-y-1.5">
                              <label className={UI.label}>Badge</label>
                              <input
                                 type="text"
                                 value={data.testimonials?.badge ?? data.testimonials?.section?.badge ?? "CLIENT SUCCESS STORIES"}
                                 onChange={(e) => {
                                    updateSection("testimonials", "badge", e.target.value);
                                    updateSection("testimonials", "section", { ...(data.testimonials?.section || {}), badge: e.target.value });
                                 }}
                                 className={UI.input}
                                 placeholder="e.g. CLIENT SUCCESS STORIES"
                              />
                           </div>
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                 <label className={UI.label}>Title Line 1 (Main Header Top)</label>
                                 <input
                                    type="text"
                                    value={data.testimonials?.title?.line1 ?? data.testimonials?.section?.headlinePrefix ?? "Transforming Columbus Homes"}
                                    onChange={(e) => {
                                       updateSection("testimonials", "title", { ...(data.testimonials?.title || {}), line1: e.target.value });
                                       updateSection("testimonials", "section", { ...(data.testimonials?.section || {}), headlinePrefix: e.target.value });
                                    }}
                                    className={UI.input}
                                    placeholder="e.g. Transforming Columbus Homes"
                                 />
                              </div>
                              <div className="space-y-1.5">
                                 <label className={UI.label}>Title Line 2 (Gradient Highlighted)</label>
                                 <input
                                    type="text"
                                    value={data.testimonials?.title?.line2 ?? data.testimonials?.section?.headlineHighlight ?? data.testimonials?.section?.headline ?? "One Holiday at a Time"}
                                    onChange={(e) => {
                                       updateSection("testimonials", "title", { ...(data.testimonials?.title || {}), line2: e.target.value });
                                       updateSection("testimonials", "section", { ...(data.testimonials?.section || {}), headlineHighlight: e.target.value, headline: e.target.value });
                                    }}
                                    className={UI.input + " font-bold text-[#2271b1] border-[#2271b1]"}
                                    placeholder="e.g. One Holiday at a Time"
                                 />
                              </div>
                           </div>
                           <div className="space-y-1.5">
                              <label className={UI.label}>Subtitle / Description</label>
                              <textarea
                                 rows={2}
                                 value={data.testimonials?.subtitle ?? data.testimonials?.section?.description ?? "Read what your neighbors in New Albany, Dublin, and Bexley have to say about our premium Christmas lighting services."}
                                 onChange={(e) => {
                                    updateSection("testimonials", "subtitle", e.target.value);
                                    updateSection("testimonials", "section", { ...(data.testimonials?.section || {}), description: e.target.value });
                                 }}
                                 className={UI.input}
                                 placeholder="Subtitle text..."
                              />
                           </div>
                        </div>
                     </div>

                     <div className="space-y-6 pt-6 border-t border-[#f0f0f1]">
                        <div className="flex justify-between items-center">
                           <div>
                              <h3 className={UI.sectionHeader}>2. 3D Coverflow Testimonials List</h3>
                              <p className="text-[#646970] text-[12px] italic">Add custom reviews displayed in the animated 3D coverflow carousel.</p>
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
                                 updateSection("testimonials", "items", currentItems);
                                 updateSection("testimonials", "testimonials", currentItems);
                              }}
                              className={UI.buttonAdd}
                           >
                              + Add Testimonial
                           </button>
                        </div>

                        <div className="space-y-4">
                           {(data.testimonials?.items || data.testimonials?.testimonials || defaultTestimonialsList).map((item: any, idx: number) => (
                              <div key={idx} className="bg-[#f6f7f7] border border-[#c3c4c7] p-4 rounded-sm space-y-3 relative">
                                 <div className="flex justify-between items-center border-b border-[#c3c4c7] pb-2">
                                    <span className="font-bold text-[13px] text-[#1d2327]">Testimonial #{idx + 1}: {item.author || item.name}</span>
                                    <button
                                       type="button"
                                       onClick={() => {
                                          const currentItems = (data.testimonials?.items || data.testimonials?.testimonials || defaultTestimonialsList).filter((_: any, i: number) => i !== idx);
                                          updateSection("testimonials", "items", currentItems);
                                          updateSection("testimonials", "testimonials", currentItems);
                                       }}
                                       className="text-[#d63638] hover:text-red-700 text-xs flex items-center gap-1 font-bold"
                                    >
                                       <Trash2 className="w-3.5 h-3.5" /> Remove
                                    </button>
                                 </div>

                                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div className="space-y-1">
                                       <label className={UI.label}>Client / Author Name</label>
                                       <input
                                          type="text"
                                          value={item.author || item.name || ""}
                                          onChange={(e) => {
                                             const currentItems = [...(data.testimonials?.items || data.testimonials?.testimonials || defaultTestimonialsList)];
                                             currentItems[idx] = { ...currentItems[idx], author: e.target.value, name: e.target.value };
                                             updateSection("testimonials", "items", currentItems);
                                             updateSection("testimonials", "testimonials", currentItems);
                                          }}
                                          className={UI.input}
                                          placeholder="e.g. Sarah Jenkins"
                                       />
                                    </div>
                                    <div className="space-y-1">
                                       <label className={UI.label}>Role / Title</label>
                                       <input
                                          type="text"
                                          value={item.role || item.position || ""}
                                          onChange={(e) => {
                                             const currentItems = [...(data.testimonials?.items || data.testimonials?.testimonials || defaultTestimonialsList)];
                                             currentItems[idx] = { ...currentItems[idx], role: e.target.value, position: e.target.value };
                                             updateSection("testimonials", "items", currentItems);
                                             updateSection("testimonials", "testimonials", currentItems);
                                          }}
                                          className={UI.input}
                                          placeholder="e.g. Homeowner"
                                       />
                                    </div>
                                    <div className="space-y-1">
                                       <label className={UI.label}>Location / City</label>
                                       <input
                                          type="text"
                                          value={item.location || ""}
                                          onChange={(e) => {
                                             const currentItems = [...(data.testimonials?.items || data.testimonials?.testimonials || defaultTestimonialsList)];
                                             currentItems[idx] = { ...currentItems[idx], location: e.target.value };
                                             updateSection("testimonials", "items", currentItems);
                                             updateSection("testimonials", "testimonials", currentItems);
                                          }}
                                          className={UI.input}
                                          placeholder="e.g. Dublin, OH"
                                       />
                                    </div>
                                 </div>

                                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div className="space-y-1">
                                       <label className={UI.label}>Service Tag / Badge</label>
                                       <input
                                          type="text"
                                          value={item.service || ""}
                                          onChange={(e) => {
                                             const currentItems = [...(data.testimonials?.items || data.testimonials?.testimonials || defaultTestimonialsList)];
                                             currentItems[idx] = { ...currentItems[idx], service: e.target.value };
                                             updateSection("testimonials", "items", currentItems);
                                             updateSection("testimonials", "testimonials", currentItems);
                                          }}
                                          className={UI.input}
                                          placeholder="e.g. Residential Lighting"
                                       />
                                    </div>
                                    <div className="space-y-1">
                                       <label className={UI.label}>Star Rating (1 - 5)</label>
                                       <select
                                          value={item.rating || 5}
                                          onChange={(e) => {
                                             const currentItems = [...(data.testimonials?.items || data.testimonials?.testimonials || defaultTestimonialsList)];
                                             currentItems[idx] = { ...currentItems[idx], rating: Number(e.target.value) };
                                             updateSection("testimonials", "items", currentItems);
                                             updateSection("testimonials", "testimonials", currentItems);
                                          }}
                                          className={UI.input}
                                       >
                                          <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                                          <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                                          <option value={3}>⭐⭐⭐ (3 Stars)</option>
                                       </select>
                                    </div>
                                    <div className="space-y-1">
                                       <label className={UI.label}>Avatar Photo URL</label>
                                       <input
                                          type="text"
                                          value={item.image || item.avatar || ""}
                                          onChange={(e) => {
                                             const currentItems = [...(data.testimonials?.items || data.testimonials?.testimonials || defaultTestimonialsList)];
                                             currentItems[idx] = { ...currentItems[idx], image: e.target.value, avatar: e.target.value };
                                             updateSection("testimonials", "items", currentItems);
                                             updateSection("testimonials", "testimonials", currentItems);
                                          }}
                                          className={UI.input}
                                          placeholder="https://... or /images/..."
                                       />
                                    </div>
                                 </div>

                                 <div className="space-y-1">
                                    <label className={UI.label}>Review / Quote Text</label>
                                    <textarea
                                       rows={3}
                                       value={item.quote || item.text || ""}
                                       onChange={(e) => {
                                          const currentItems = [...(data.testimonials?.items || data.testimonials?.testimonials || defaultTestimonialsList)];
                                          currentItems[idx] = { ...currentItems[idx], quote: e.target.value, text: e.target.value };
                                          updateSection("testimonials", "items", currentItems);
                                          updateSection("testimonials", "testimonials", currentItems);
                                       }}
                                       className={UI.input}
                                       placeholder="Enter customer feedback..."
                                    />
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               )}



               {/* FAQ SECTION */}
               {activeTab === "faq" && (
                  <div className="space-y-12">
                     <div className="space-y-6">
                        <h3 className={UI.sectionHeader}>1. Section Title</h3>
                        <div className="space-y-4">
                           <div className="space-y-1.5">
                              <label className={UI.label}>Main Title (Gradient Highlighted)</label>
                              <input
                                 type="text"
                                 value={data.faq?.title ?? data.faq?.section?.headline ?? data.faq?.section?.title ?? "Questions & Answers"}
                                 onChange={(e) => {
                                    updateSection("faq", "title", e.target.value);
                                    updateSection("faq", "section", { ...(data.faq?.section || {}), headline: e.target.value, title: e.target.value });
                                 }}
                                 className={UI.inputLarge + " font-bold text-[#2271b1] border-[#2271b1]"}
                                 placeholder="e.g. Questions & Answers"
                              />
                           </div>
                        </div>
                     </div>

                     <div className="space-y-6 pt-6 border-t border-[#f0f0f1]">
                        <div className="flex justify-between items-center">
                           <div>
                              <h3 className={UI.sectionHeader}>2. FAQ Accordion Items</h3>
                              <p className="text-[#646970] text-[12px] italic">Add and manage expandable Q&A accordion items.</p>
                           </div>
                           <button
                              type="button"
                              onClick={() => {
                                 const currentItems = [...(data.faq?.items || data.faq?.faqs || defaultFaqItems)];
                                 currentItems.push({
                                    question: "New Question?",
                                    answer: "Answer to the new question goes here."
                                 });
                                 updateSection("faq", "items", currentItems);
                                 updateSection("faq", "faqs", currentItems);
                              }}
                              className={UI.buttonAdd}
                           >
                              + Add FAQ
                           </button>
                        </div>

                        <div className="space-y-4">
                           {(data.faq?.items || data.faq?.faqs || defaultFaqItems).map((item: any, idx: number) => (
                              <div key={idx} className="bg-[#f6f7f7] border border-[#c3c4c7] p-4 rounded-sm space-y-3 relative">
                                 <div className="flex justify-between items-center border-b border-[#c3c4c7] pb-2">
                                    <span className="font-bold text-[13px] text-[#1d2327]">FAQ #{idx + 1}</span>
                                    <button
                                       type="button"
                                       onClick={() => {
                                          const currentItems = (data.faq?.items || data.faq?.faqs || defaultFaqItems).filter((_: any, i: number) => i !== idx);
                                          updateSection("faq", "items", currentItems);
                                          updateSection("faq", "faqs", currentItems);
                                       }}
                                       className="text-[#d63638] hover:text-red-700 text-xs flex items-center gap-1 font-bold"
                                    >
                                       <Trash2 className="w-3.5 h-3.5" /> Remove
                                    </button>
                                 </div>

                                 <div className="space-y-1">
                                    <label className={UI.label}>Question</label>
                                    <input
                                       type="text"
                                       value={item.question || item.q || ""}
                                       onChange={(e) => {
                                          const currentItems = [...(data.faq?.items || data.faq?.faqs || defaultFaqItems)];
                                          currentItems[idx] = { ...currentItems[idx], question: e.target.value, q: e.target.value };
                                          updateSection("faq", "items", currentItems);
                                          updateSection("faq", "faqs", currentItems);
                                       }}
                                       className={UI.input}
                                       placeholder="e.g. When should I schedule installation?"
                                    />
                                 </div>

                                 <div className="space-y-1">
                                    <label className={UI.label}>Answer</label>
                                    <textarea
                                       rows={3}
                                       value={item.answer || item.a || ""}
                                       onChange={(e) => {
                                          const currentItems = [...(data.faq?.items || data.faq?.faqs || defaultFaqItems)];
                                          currentItems[idx] = { ...currentItems[idx], answer: e.target.value, a: e.target.value };
                                          updateSection("faq", "items", currentItems);
                                          updateSection("faq", "faqs", currentItems);
                                       }}
                                       className={UI.input}
                                       placeholder="Enter the detailed answer..."
                                    />
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               )}

               {/* QUOTE / CONTACT FORM SECTION */}
               {activeTab === "quote" && (
                  <div className="space-y-12">
                     <div className="space-y-6">
                        <h3 className={UI.sectionHeader}>1. Header & Narrative</h3>
                        <div className="space-y-4">
                           <div className="space-y-1.5">
                              <label className={UI.label}>Badge</label>
                              <input
                                 type="text"
                                 value={data.quoteForm?.badge ?? data.quote?.badge ?? data.quote?.section?.badge ?? "Get A Fast Quote"}
                                 onChange={(e) => {
                                    updateSection("quoteForm", "badge", e.target.value);
                                    updateSection("quote", "badge", e.target.value);
                                    updateSection("quote", "section", { ...(data.quote?.section || {}), badge: e.target.value });
                                 }}
                                 className={UI.input}
                                 placeholder="e.g. Get A Fast Quote"
                              />
                           </div>

                           <div className="space-y-1.5">
                              <label className={UI.label}>Title (with Highlight)</label>
                              <input
                                 type="text"
                                 value={data.quoteForm?.title ?? data.quote?.title ?? data.quote?.section?.headline ?? "Get Your Fast Quote"}
                                 onChange={(e) => {
                                    updateSection("quoteForm", "title", e.target.value);
                                    updateSection("quote", "title", e.target.value);
                                    updateSection("quote", "section", { ...(data.quote?.section || {}), headline: e.target.value });
                                 }}
                                 className={UI.inputLarge + " font-bold text-[#2271b1] border-[#2271b1]"}
                                 placeholder="e.g. Get Your Fast Quote"
                              />
                           </div>

                           <div className="space-y-1.5">
                              <label className={UI.label}>Subtitle / Tagline</label>
                              <input
                                 type="text"
                                 value={data.quoteForm?.subtitle ?? data.quote?.subtitle ?? data.quote?.section?.description ?? "We are so excited to light up your property 🙂"}
                                 onChange={(e) => {
                                    updateSection("quoteForm", "subtitle", e.target.value);
                                    updateSection("quote", "subtitle", e.target.value);
                                    updateSection("quote", "section", { ...(data.quote?.section || {}), description: e.target.value });
                                 }}
                                 className={UI.input}
                                 placeholder="e.g. We are so excited to light up your property 🙂"
                              />
                           </div>
                        </div>
                     </div>

                     {/* Benefits Sidebar List */}
                     <div className="space-y-6 pt-6 border-t border-[#f0f0f1]">
                        <div className="flex justify-between items-center">
                           <div>
                              <h3 className={UI.sectionHeader}>2. 'What You Get' Benefits List</h3>
                              <p className="text-[#646970] text-[12px] italic">Benefits displayed with green checkmarks in the sidebar.</p>
                           </div>
                           <button
                              type="button"
                              onClick={() => {
                                 const currentBenefits = [...(data.quoteForm?.benefits || data.quote?.benefits || defaultBenefits)];
                                 currentBenefits.push({ text: "New Customer Benefit" });
                                 updateSection("quoteForm", "benefits", currentBenefits);
                                 updateSection("quote", "benefits", currentBenefits);
                              }}
                              className={UI.buttonAdd}
                           >
                              + Add Benefit
                           </button>
                        </div>

                        <div className="space-y-2">
                           {(data.quoteForm?.benefits || data.quote?.benefits || defaultBenefits).map((benefit: any, idx: number) => (
                              <div key={idx} className="flex gap-2 bg-[#f6f7f7] p-2.5 border border-[#c3c4c7] rounded-sm items-center">
                                 <span className="text-xs font-bold text-gray-500 w-6">#{idx + 1}</span>
                                 <input
                                    type="text"
                                    value={benefit.text || benefit || ""}
                                    onChange={(e) => {
                                       const currentBenefits = [...(data.quoteForm?.benefits || data.quote?.benefits || defaultBenefits)];
                                       currentBenefits[idx] = { text: e.target.value };
                                       updateSection("quoteForm", "benefits", currentBenefits);
                                       updateSection("quote", "benefits", currentBenefits);
                                    }}
                                    className="flex-1 bg-white border border-[#c3c4c7] px-3 py-1.5 text-xs font-semibold rounded"
                                    placeholder="e.g. Custom Lighting Design & Layout"
                                 />
                                 <button
                                    type="button"
                                    onClick={() => {
                                       const currentBenefits = (data.quoteForm?.benefits || data.quote?.benefits || defaultBenefits).filter((_: any, i: number) => i !== idx);
                                       updateSection("quoteForm", "benefits", currentBenefits);
                                       updateSection("quote", "benefits", currentBenefits);
                                    }}
                                    className="text-[#d63638] hover:text-red-700 p-1"
                                 >
                                    <Trash2 className="w-4 h-4" />
                                 </button>
                              </div>
                           ))}
                        </div>
                     </div>

                     {/* Sidebar Contact Info */}
                     <div className="space-y-6 pt-6 border-t border-[#f0f0f1]">
                        <h3 className={UI.sectionHeader}>3. Sidebar Immediate Contact Card</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div className="space-y-1.5">
                              <label className={UI.label}>Phone Number</label>
                              <input
                                 type="text"
                                 value={data.quoteForm?.contactInfo?.phone ?? data.quote?.contactInfo?.phone ?? data.footer?.contact?.phone ?? "(614) 301-7100"}
                                 onChange={(e) => {
                                    const updatedContact = { ...(data.quoteForm?.contactInfo || data.quote?.contactInfo || {}), phone: e.target.value };
                                    updateSection("quoteForm", "contactInfo", updatedContact);
                                    updateSection("quote", "contactInfo", updatedContact);
                                 }}
                                 className={UI.input}
                                 placeholder="(614) 301-7100"
                              />
                           </div>
                           <div className="space-y-1.5">
                              <label className={UI.label}>Email Address</label>
                              <input
                                 type="email"
                                 value={data.quoteForm?.contactInfo?.email ?? data.quote?.contactInfo?.email ?? data.footer?.contact?.email ?? "Info@lightsovercolumbus.com"}
                                 onChange={(e) => {
                                    const updatedContact = { ...(data.quoteForm?.contactInfo || data.quote?.contactInfo || {}), email: e.target.value };
                                    updateSection("quoteForm", "contactInfo", updatedContact);
                                    updateSection("quote", "contactInfo", updatedContact);
                                 }}
                                 className={UI.input}
                                 placeholder="Info@lightsovercolumbus.com"
                              />
                           </div>
                        </div>
                     </div>
                  </div>
               )}

               {/* BLOG SECTION */}
               {activeTab === "blog" && (
                  <div className="space-y-12">
                     <div className="space-y-6">
                        <h3 className={UI.sectionHeader}>1. Header</h3>
                        <div className="space-y-1.5"><label className={UI.label}>Badge</label><input type="text" value={data.blogSection?.subtitle || ""} onChange={(e) => updateSection("blogSection", "subtitle", e.target.value)} className={UI.input} /></div>
                        <div className="space-y-1.5"><label className={UI.label}>Headline</label><input type="text" value={data.blogSection?.title || ""} onChange={(e) => updateSection("blogSection", "title", e.target.value)} className={UI.inputLarge} /></div>
                        <RichTextEditor
                           label="Description Narrative"
                           content={data.blogSection?.description || ""}
                           onChange={(html) => updateSection("blogSection", "description", html)}
                        />
                     </div>
                     <div className="space-y-6">
                        <h3 className={UI.sectionHeader}>2. Selected Posts</h3>
                        <BlogSelector
                           selectedIds={data.blogSection?.selectedPosts || []}
                           onChange={(ids) => updateSection("blogSection", "selectedPosts", ids)}
                        />
                     </div>
                  </div>
               )}
            </motion.div>
         </AnimatePresence>
      </div>
   );
}
