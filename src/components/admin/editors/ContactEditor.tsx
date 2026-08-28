"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2, Type, Globe, CheckCircle, Search, HelpCircle,
  Plus, Trash2, ShieldCheck, Mail, Phone, MapPin, Award,
  Sparkles, DollarSign, Check, ListChecks
} from "lucide-react";
import { UI } from "./styles";

const DEFAULT_BENEFITS = [
  "Free consultation & design",
  "Professional installation",
  "Commercial-grade LEDs",
  "Maintenance included",
  "Take-down & storage"
];

const DEFAULT_BUDGET_OPTIONS = [
  "What Is Your Lighting Budget",
  "$900 - $1200 (Standard Front Rooflines)",
  "$1200 - $1500",
  "$1500 - $2500",
  "$2500 - $4000",
  "$4000 and up",
  "Give me your best lighting design, money is not a factor."
];

export default function ContactEditor({ pageId, data, setData }: { pageId: string, data: any, setData: (d: any) => void }) {
  const [activeTab, setActiveTab] = useState("header");

  useEffect(() => {
    if (!data.contactPage) {
      setData({
        ...data,
        contactPage: {
          header: {
            badge: "Get A Fast Quote",
            headline: "Contact Us For Your Fast Free Quote",
            description: "We look forward to helping light up your property 🙂"
          },
          benefits: DEFAULT_BENEFITS,
          budgetOptions: DEFAULT_BUDGET_OPTIONS,
          info: {
            phone: "(614) 301-7100",
            email: "Info@lightsovercolumbus.com"
          }
        }
      });
    }
  }, []);

  if (!data) return <div className="flex items-center justify-center h-64"><Loader2 className="w-5 h-5 text-[#2271b1] animate-spin" /></div>;

  const contactPage = data.contactPage || {};
  const header = contactPage.header || {};
  const benefits: string[] = Array.isArray(contactPage.benefits) ? contactPage.benefits : DEFAULT_BENEFITS;
  const budgetOptions: string[] = Array.isArray(contactPage.budgetOptions) ? contactPage.budgetOptions : DEFAULT_BUDGET_OPTIONS;
  const info = contactPage.info || {};

  const updateHeader = (field: string, value: any) => {
    setData({
      ...data,
      contactPage: {
        ...contactPage,
        header: {
          ...(contactPage.header || {}),
          [field]: value
        }
      }
    });
  };

  const updateInfo = (field: string, value: any) => {
    setData({
      ...data,
      contactPage: {
        ...contactPage,
        info: {
          ...(contactPage.info || {}),
          [field]: value
        }
      }
    });
  };

  const updateBenefits = (newBenefits: string[]) => {
    setData({
      ...data,
      contactPage: {
        ...contactPage,
        benefits: newBenefits
      }
    });
  };

  const updateBudgetOptions = (newOptions: string[]) => {
    setData({
      ...data,
      contactPage: {
        ...contactPage,
        budgetOptions: newOptions
      }
    });
  };

  const tabs = [
    { id: "header", label: "Page Header & Intro", icon: Type, title: "Header & Narrative" },
    { id: "benefits", label: "What You Get (Benefits)", icon: ListChecks, title: "Benefits Card List" },
    { id: "info", label: "Direct Contact Info", icon: Phone, title: "Contact Numbers & Email" },
    { id: "budget", label: "Budget Ranges", icon: DollarSign, title: "Budget Dropdown Options" },
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
            {/* TAB 1: HEADER & INTRO */}
            {/* ========================================================================= */}
            {activeTab === "header" && (
              <div className="max-w-3xl space-y-4">
                <div className="bg-[#f9f9f9] border border-[#c3c4c7] p-4 rounded-sm space-y-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Pill Badge</label>
                    <input
                      type="text"
                      value={header.badge || "Get A Fast Quote"}
                      onChange={(e) => updateHeader("badge", e.target.value)}
                      className="w-full border border-[#c3c4c7] px-3 py-1.5 text-xs font-semibold rounded-[3px] focus:border-[#2271b1] outline-none bg-white uppercase"
                      placeholder="Get A Fast Quote"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Page Headline</label>
                    <input
                      type="text"
                      value={header.headline || header.title || "Contact Us For Your Fast Free Quote"}
                      onChange={(e) => updateHeader("headline", e.target.value)}
                      className="w-full border border-[#c3c4c7] px-3 py-2 text-xs font-bold rounded-[3px] focus:border-[#2271b1] outline-none bg-white"
                      placeholder="Contact Us For Your Fast Free Quote"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Subtitle Narrative</label>
                    <textarea
                      rows={2}
                      value={header.description || ""}
                      onChange={(e) => updateHeader("description", e.target.value)}
                      className="w-full border border-[#c3c4c7] px-3 py-2 text-xs rounded-[3px] focus:border-[#2271b1] outline-none bg-white"
                      placeholder="We look forward to helping light up your property 🙂"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 2: BENEFITS / WHAT YOU GET */}
            {/* ========================================================================= */}
            {activeTab === "benefits" && (
              <div className="max-w-3xl space-y-4">
                <div className="flex items-center justify-between bg-[#f6f7f7] p-3 border border-[#c3c4c7] rounded-sm">
                  <div>
                    <h3 className="text-sm font-bold text-[#1d2327]">What You Get Bullet Points</h3>
                    <p className="text-xs text-[#646970]">Displayed in the right-side benefits card next to the quote form.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateBenefits([...benefits, "New Benefit Item"])}
                    className="bg-[#2271b1] text-white text-xs font-semibold px-3 py-1.5 rounded-[3px] hover:bg-[#135e96] transition-colors cursor-pointer"
                  >
                    + Add Benefit
                  </button>
                </div>

                <div className="space-y-2">
                  {benefits.map((b, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-white border border-[#c3c4c7] rounded-sm">
                      <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                        ✓
                      </div>
                      <input
                        type="text"
                        value={b}
                        onChange={(e) => {
                          const updated = [...benefits];
                          updated[idx] = e.target.value;
                          updateBenefits(updated);
                        }}
                        className="w-full border border-[#c3c4c7] px-2.5 py-1 text-xs font-medium rounded-[3px] outline-none focus:border-[#2271b1]"
                        placeholder="Benefit text..."
                      />
                      <button
                        type="button"
                        onClick={() => updateBenefits(benefits.filter((_, i) => i !== idx))}
                        className="p-1 text-red-500 hover:bg-red-50 rounded cursor-pointer"
                        title="Delete Benefit"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 3: DIRECT CONTACT INFO */}
            {/* ========================================================================= */}
            {activeTab === "info" && (
              <div className="max-w-3xl space-y-4">
                <div className="bg-[#f9f9f9] border border-[#c3c4c7] p-4 rounded-sm space-y-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Phone Number (Call 24/7)</label>
                    <input
                      type="text"
                      value={info.phone || "(614) 301-7100"}
                      onChange={(e) => updateInfo("phone", e.target.value)}
                      className="w-full border border-[#c3c4c7] px-3 py-1.5 text-xs font-bold rounded-[3px] focus:border-[#2271b1] outline-none bg-white"
                      placeholder="(614) 301-7100"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Email Address</label>
                    <input
                      type="email"
                      value={info.email || "Info@lightsovercolumbus.com"}
                      onChange={(e) => updateInfo("email", e.target.value)}
                      className="w-full border border-[#c3c4c7] px-3 py-1.5 text-xs font-bold rounded-[3px] focus:border-[#2271b1] outline-none bg-white"
                      placeholder="Info@lightsovercolumbus.com"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 4: BUDGET OPTIONS */}
            {/* ========================================================================= */}
            {activeTab === "budget" && (
              <div className="max-w-3xl space-y-4">
                <div className="flex items-center justify-between bg-[#f6f7f7] p-3 border border-[#c3c4c7] rounded-sm">
                  <div>
                    <h3 className="text-sm font-bold text-[#1d2327]">Budget Dropdown Options</h3>
                    <p className="text-xs text-[#646970]">Available tiers selectable in the quote request dropdown.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateBudgetOptions([...budgetOptions, "$5000 - $7500"])}
                    className="bg-[#2271b1] text-white text-xs font-semibold px-3 py-1.5 rounded-[3px] hover:bg-[#135e96] transition-colors cursor-pointer"
                  >
                    + Add Option
                  </button>
                </div>

                <div className="space-y-2">
                  {budgetOptions.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-white border border-[#c3c4c7] rounded-sm">
                      <span className="text-xs text-slate-400 font-mono w-6">#{idx + 1}</span>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const updated = [...budgetOptions];
                          updated[idx] = e.target.value;
                          updateBudgetOptions(updated);
                        }}
                        className="w-full border border-[#c3c4c7] px-2.5 py-1 text-xs font-medium rounded-[3px] outline-none focus:border-[#2271b1]"
                      />
                      <button
                        type="button"
                        onClick={() => updateBudgetOptions(budgetOptions.filter((_, i) => i !== idx))}
                        className="p-1 text-red-500 hover:bg-red-50 rounded cursor-pointer"
                        title="Delete Option"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
