"use client";

import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import PageTransition from "./PageTransition";
import QuickQuote from "./QuickQuote";
import SmoothScroll from "./SmoothScroll";
import { usePathname } from "next/navigation";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  const [isClient, setIsClient] = useState(false);
  const [snowflakes] = useState(() => {
    const flakes = [];
    for (let i = 0; i < 120; i++) {
      flakes.push({
        id: i,
        left: Math.random() * 100,
        size: Math.random() * 4 + 1,
        speed: Math.random() * 8 + 4,
        delay: Math.random() * 10,
      });
    }
    return flakes;
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  // If we are on an admin route, we completely bypass the standard SiteLayout wrapper
  if (isAdmin) {
    return <div className="relative min-h-screen bg-[#080808]">{children}</div>;
  }

  return (
    <>
      {/* STABLE SNOWFALL - Never changes */}
      {isClient && (
        <div
          className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden"
          style={{ zIndex: 40 }}
        >
          {snowflakes.map((flake) => (
            <div
              key={flake.id}
              className="absolute rounded-full bg-white"
              style={{
                left: `${flake.left}%`,
                top: "-10%",
                width: `${flake.size}px`,
                height: `${flake.size}px`,
                opacity: 0.4,
                animation: `snowfall ${flake.speed}s linear infinite`,
                animationDelay: `${flake.delay}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* STABLE NAVBAR & FLOATING QUICK QUOTE */}
      <Navbar />
      <QuickQuote />

      {/* SMOOTH SCROLL WRAPPER */}
      <SmoothScroll>
        {/* PAGE CONTENT */}
        <main className="min-h-screen">
          <PageTransition>{children}</PageTransition>
        </main>
      </SmoothScroll>

      {/* STABLE FOOTER */}
      <Footer />
    </>
  );
}