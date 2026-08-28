"use client";

import { useState, useRef, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { motion } from "framer-motion";
import { useContent } from "../hooks/useContent";

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

interface FAQSectionProps {
  customData?: {
    title?: string;
    items?: Array<{ question: string; answer: string }>;
    faqs?: Array<{ question: string; answer: string }>;
  };
}

const FAQSection = ({ customData }: FAQSectionProps = {}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [heights, setHeights] = useState<{ [key: number]: number }>({});
  const [sparkles, setSparkles] = useState<Array<{ id: number; left: number; top: number; size: number; delay: number; duration: number }>>([]);

  const content = useContent();
  const faqData = customData || content?.faq || {};
  const title = faqData.title || (faqData as any).section?.headline || (faqData as any).section?.title || "Questions & Answers";

  const rawItems = Array.isArray(faqData.items) && faqData.items.length > 0
    ? faqData.items
    : (Array.isArray((faqData as any).faqs) && (faqData as any).faqs.length > 0 ? (faqData as any).faqs : defaultFaqItems);

  const items = rawItems.map((item: any) => ({
    question: item.question || item.q || "Common Question?",
    answer: typeof item.answer === "string" ? item.answer.replace(/<[^>]*>?/gm, "") : (typeof item.a === "string" ? item.a.replace(/<[^>]*>?/gm, "") : "")
  }));

  // Generate subtle background sparkles on mount
  useEffect(() => {
    const generated = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 2.5 + 1.5,
      delay: Math.random() * 4,
      duration: Math.random() * 3 + 2,
    }));
    setSparkles(generated);
  }, []);

  // Measure and store heights on mount and window resize
  useEffect(() => {
    const measureHeights = () => {
      const newHeights: { [key: number]: number } = {};
      contentRefs.current.forEach((ref, index) => {
        if (ref) {
          // Temporarily set height to auto to measure
          ref.style.height = "auto";
          newHeights[index] = ref.scrollHeight;
          ref.style.height = "0px";
        }
      });
      setHeights(newHeights);

      // Set initial open item height
      if (openIndex !== null && contentRefs.current[openIndex]) {
        contentRefs.current[openIndex]!.style.height = newHeights[openIndex] + "px";
      }
    };

    measureHeights();

    // Re-measure on window resize
    window.addEventListener("resize", measureHeights);
    return () => window.removeEventListener("resize", measureHeights);
  }, [items.length]);

  const toggleAccordion = (index: number) => {
    const currentRef = contentRefs.current[index];
    const prevIndex = openIndex;
    const prevRef = prevIndex !== null ? contentRefs.current[prevIndex] : null;

    if (!currentRef) return;

    // If clicking the same item
    if (openIndex === index) {
      // Close it
      currentRef.style.height = heights[index] + "px";
      requestAnimationFrame(() => {
        currentRef.style.height = "0px";
      });
      setOpenIndex(null);
      return;
    }

    // Close previous item if exists
    if (prevRef && prevIndex !== null) {
      prevRef.style.height = heights[prevIndex] + "px";
      requestAnimationFrame(() => {
        prevRef.style.height = "0px";
      });
    }

    // Open new item
    currentRef.style.height = heights[index] + "px";
    setOpenIndex(index);
  };

  return (
    <section className="relative w-full bg-gray-50/80 py-20 sm:py-24 px-4 sm:px-6 overflow-hidden">
      {/* Background Star Sparkles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {sparkles.map((s) => (
          <motion.div
            key={s.id}
            className="absolute rounded-full bg-amber-400/30"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              boxShadow: "0 0 8px rgba(245, 158, 11, 0.4)",
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [0.8, 1.3, 0.8],
            }}
            transition={{
              duration: s.duration,
              delay: s.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Heading */}
        <h2 className="text-center font-montserrat text-4xl sm:text-5xl font-extrabold mb-16 sm:mb-20">
          <span className="bg-gradient-to-r from-red-600 via-amber-500 to-emerald-600 bg-clip-text text-transparent">
            {title}
          </span>
        </h2>

        <div className="space-y-5 sm:space-y-6">
          {items.map((item: any, index: number) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className={`bg-white border border-gray-200/80 rounded-2xl overflow-hidden transition-all duration-300 ${
                  isOpen ? "shadow-lg shadow-gray-200/60 border-gray-300" : "shadow-sm hover:shadow-md"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(index)}
                  className="w-full flex items-center text-left cursor-pointer group"
                >
                  {/* Icon Block */}
                  <div
                    className={`flex items-center justify-center w-14 sm:w-16 h-14 sm:h-16 shrink-0 transition-colors duration-300 relative ${
                      isOpen ? "bg-red-600" : "bg-gray-900 group-hover:bg-gray-800"
                    }`}
                  >
                    {/* Tiny sparkle accent on open red box */}
                    {isOpen && (
                      <div className="absolute inset-0 pointer-events-none opacity-40">
                        <div className="absolute top-1.5 left-2 w-1 h-1 bg-white rounded-full" />
                        <div className="absolute bottom-2 left-3 w-0.5 h-0.5 bg-white rounded-full" />
                        <div className="absolute top-2 right-2 w-0.5 h-0.5 bg-white rounded-full" />
                      </div>
                    )}
                    <FaPlus
                      className={`text-white text-lg transition-transform duration-300 relative z-10 ${
                        isOpen ? "rotate-45" : ""
                      }`}
                    />
                  </div>

                  {/* Question */}
                  <div className="px-5 sm:px-8 py-4 sm:py-6 flex-1">
                    <h3
                      className={`font-montserrat text-base sm:text-lg md:text-xl font-bold transition-colors duration-300 leading-snug ${
                        isOpen ? "text-red-600" : "text-gray-900 group-hover:text-red-600"
                      }`}
                    >
                      {item.question}
                    </h3>
                  </div>
                </button>

                {/* Smooth animation container */}
                <div
                  ref={(el) => {
                    contentRefs.current[index] = el;
                  }}
                  className="overflow-hidden transition-[height] duration-500 ease-in-out"
                  style={{
                    height: isOpen && heights[index] ? heights[index] + "px" : "0px"
                  }}
                >
                  <div className="px-5 sm:px-8 pb-6 sm:pb-8 pt-1 text-gray-600 leading-relaxed text-sm sm:text-base font-normal">
                    {item.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
