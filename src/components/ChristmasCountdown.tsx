'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSnowflake } from 'react-icons/fa';
import { HiOutlineSparkles } from 'react-icons/hi';
import { GiSparkles } from 'react-icons/gi';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTargetChristmas(): Date {
  const now = new Date();
  const currentYear = now.getFullYear();
  let target = new Date(currentYear, 11, 25, 0, 0, 0); // Dec 25 00:00:00
  if (now.getTime() > target.getTime() + 86400000) {
    target = new Date(currentYear + 1, 11, 25, 0, 0, 0);
  }
  return target;
}

function calculateTimeLeft(targetDate: Date): TimeLeft {
  const diff = targetDate.getTime() - new Date().getTime();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / 1000 / 60) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

// C9 Holiday Light Bulb Colors
const BULB_COLORS = [
  { color: '#EF4444', glow: 'rgba(239, 68, 68, 0.9)', name: 'Ruby' },
  { color: '#10B981', glow: 'rgba(16, 185, 129, 0.9)', name: 'Emerald' },
  { color: '#F59E0B', glow: 'rgba(245, 158, 11, 0.9)', name: 'Gold' },
  { color: '#38BDF8', glow: 'rgba(56, 189, 248, 0.9)', name: 'Cyan' },
  { color: '#EC4899', glow: 'rgba(236, 72, 153, 0.9)', name: 'Magenta' },
  { color: '#FACC15', glow: 'rgba(250, 204, 21, 0.9)', name: 'Amber' },
  { color: '#06D6A0', glow: 'rgba(6, 214, 160, 0.9)', name: 'Mint' },
  { color: '#EF4444', glow: 'rgba(239, 68, 68, 0.9)', name: 'Ruby' },
  { color: '#3B82F6', glow: 'rgba(59, 130, 246, 0.9)', name: 'Sapphire' },
];

interface StarParticle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  vx: number;
  vy: number;
  life: number;
}

const ChristmasCountdown: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [activeBulb, setActiveBulb] = useState<number | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [stars, setStars] = useState<StarParticle[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const targetDate = useMemo(() => getTargetChristmas(), []);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft(targetDate));
  const [prevSecs, setPrevSecs] = useState<number>(timeLeft.seconds);
  const [secTick, setSecTick] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const next = calculateTimeLeft(targetDate);
        if (next.seconds !== prev.seconds) {
          setPrevSecs(prev.seconds);
          setSecTick(true);
          setTimeout(() => setSecTick(false), 300);
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  // Audio tone helper
  const playChimeTone = useCallback((freq: number = 880) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch {
      // Audio graceful fallback
    }
  }, []);

  // Mouse 3D tilt tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -16;
    setMouseOffset({ x, y });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  // Click celebration burst
  const triggerStardust = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    if (soundEnabled) {
      playChimeTone(1046.5); // High C
    }

    const newStars: StarParticle[] = [];
    const colors = ['#EF4444', '#10B981', '#F59E0B', '#38BDF8', '#FFFFFF', '#F43F5E'];
    for (let i = 0; i < 28; i++) {
      const angle = (Math.PI * 2 * i) / 28;
      const speed = 2 + Math.random() * 5;
      newStars.push({
        id: Date.now() + i,
        x: clickX,
        y: clickY,
        color: colors[i % colors.length],
        size: 3 + Math.random() * 5,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        life: 1,
      });
    }

    setStars((prev) => [...prev.slice(-40), ...newStars]);
  };

  // Update star particles
  useEffect(() => {
    if (stars.length === 0) return;
    const timer = setInterval(() => {
      setStars((prev) =>
        prev
          .map((s) => ({
            ...s,
            x: s.x + s.vx,
            y: s.y + s.vy + 0.15,
            life: s.life - 0.04,
          }))
          .filter((s) => s.life > 0)
      );
    }, 30);
    return () => clearInterval(timer);
  }, [stars.length]);

  const units = [
    {
      id: 'days',
      value: timeLeft.days,
      label: 'DAYS',
      sublabel: 'Until Christmas',
      accent: 'from-rose-500 via-red-500 to-amber-500',
      glow: 'rgba(239, 68, 68, 0.4)',
      borderColor: 'border-red-500/30 hover:border-red-400/80',
      lightColor: '#EF4444',
    },
    {
      id: 'hours',
      value: timeLeft.hours,
      label: 'HOURS',
      sublabel: 'Holiday Hours',
      accent: 'from-amber-400 via-yellow-400 to-orange-500',
      glow: 'rgba(245, 158, 11, 0.4)',
      borderColor: 'border-amber-500/30 hover:border-amber-400/80',
      lightColor: '#F59E0B',
    },
    {
      id: 'minutes',
      value: timeLeft.minutes,
      label: 'MINUTES',
      sublabel: 'Glowing Moments',
      accent: 'from-emerald-400 via-teal-400 to-emerald-500',
      glow: 'rgba(16, 185, 129, 0.4)',
      borderColor: 'border-emerald-500/30 hover:border-emerald-400/80',
      lightColor: '#10B981',
    },
    {
      id: 'seconds',
      value: timeLeft.seconds,
      label: 'SECONDS',
      sublabel: 'Pure Excitement',
      accent: 'from-cyan-400 via-sky-400 to-blue-500',
      glow: 'rgba(56, 189, 248, 0.4)',
      borderColor: 'border-cyan-500/30 hover:border-cyan-400/80',
      lightColor: '#38BDF8',
    },
  ];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={triggerStardust}
      className="relative w-full max-w-4xl mx-auto my-6 px-3 sm:px-4 select-none cursor-pointer"
      style={{ perspective: 1200 }}
    >
      {/* Interactive Stardust Floating Canvas */}
      {stars.map((s) => (
        <span
          key={s.id}
          className="absolute rounded-full pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: s.x,
            top: s.y,
            width: s.size,
            height: s.size,
            backgroundColor: s.color,
            boxShadow: `0 0 10px ${s.color}`,
            opacity: s.life,
          }}
        />
      ))}

      {/* Outer Ethereal Aurora Glow */}
      <div className="absolute -inset-4 bg-gradient-to-r from-red-600/20 via-yellow-500/15 via-emerald-600/20 to-blue-600/20 rounded-[40px] blur-3xl opacity-70 pointer-events-none -z-10 animate-pulse-slow" />

      {/* Main 3D Tilted Card Deck */}
      <div
        className="relative rounded-3xl backdrop-blur-2xl bg-gradient-to-b from-[#0e1628]/85 via-[#0b1020]/90 to-[#070b16]/95 border border-white/15 p-5 sm:p-7 md:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] transition-transform duration-200 ease-out overflow-hidden"
        style={{
          transform: `rotateY(${mouseOffset.x}deg) rotateX(${mouseOffset.y}deg)`,
        }}
      >
        {/* Spotlight light follower */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40 transition-opacity duration-300 -z-0"
          style={{
            background: `radial-gradient(600px circle at ${50 + mouseOffset.x * 2}% ${50 - mouseOffset.y * 2}%, rgba(255, 215, 0, 0.15), transparent 70%)`,
          }}
        />

        {/* ── DRAPED CHRISTMAS LIGHT STRING ── */}
        <div className="relative w-full mb-6 pt-1">
          {/* Wire SVG */}
          <svg
            className="w-full h-8 overflow-visible"
            viewBox="0 0 800 30"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d="M 0 6 Q 100 24, 200 6 Q 300 24, 400 6 Q 500 24, 600 6 Q 700 24, 800 6"
              stroke="rgba(255, 255, 255, 0.25)"
              strokeWidth="2"
              strokeDasharray="4 2"
            />
          </svg>

          {/* Glowing Bulbs Hanging from Wire */}
          <div className="absolute inset-x-0 top-0 flex justify-between px-2 sm:px-6 pointer-events-auto">
            {BULB_COLORS.map((bulb, idx) => {
              const isHovered = activeBulb === idx;
              const dropY = [12, 22, 10, 24, 11, 23, 10, 24, 12][idx % 9];
              return (
                <div
                  key={idx}
                  onMouseEnter={() => {
                    setActiveBulb(idx);
                    if (soundEnabled) playChimeTone(600 + idx * 75);
                  }}
                  onMouseLeave={() => setActiveBulb(null)}
                  className="flex flex-col items-center cursor-pointer transition-transform duration-200 hover:scale-125"
                  style={{ transform: `translateY(${dropY}px)` }}
                >
                  {/* Socket */}
                  <div className="w-2.5 h-2 bg-slate-700 rounded-t-sm border border-slate-600" />
                  {/* Glass Bulb Body */}
                  <div
                    className="w-3.5 h-5 sm:w-4 sm:h-6 rounded-b-full rounded-t-sm transition-all duration-300"
                    style={{
                      backgroundColor: bulb.color,
                      boxShadow: isHovered
                        ? `0 0 24px 8px ${bulb.glow}, 0 0 10px 2px #fff`
                        : `0 0 14px 2px ${bulb.glow}`,
                      filter: isHovered ? 'brightness(1.5)' : 'brightness(1.1)',
                    }}
                  >
                    {/* Inner filament highlight */}
                    <div className="w-1 h-2 bg-white/70 mx-auto mt-1 rounded-full opacity-80" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── HEADER PILL & CELEBRATION TAG ── */}
        <div className="flex items-center justify-between gap-3 mb-6 mt-4 flex-wrap">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-white/90 shadow-inner">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-400 bg-clip-text text-transparent font-bold tracking-wider uppercase text-[11px]">
              Christmas Magic Countdown
            </span>
            <span className="text-white/30">•</span>
            <span className="text-white/80 text-[11px] font-medium flex items-center gap-1">
              Dec 25, {targetDate.getFullYear()}
            </span>
          </div>

          {/* Interactive Hint & Sound Toggle */}
          <div className="flex items-center gap-2.5">
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-yellow-300/80 font-medium bg-yellow-500/10 px-2.5 py-1 rounded-full border border-yellow-400/20">
              <HiOutlineSparkles className="w-3 h-3 text-yellow-300 animate-spin-slow" />
              Tap anywhere for holiday sparks
            </span>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                const next = !soundEnabled;
                setSoundEnabled(next);
                if (next) playChimeTone(880);
              }}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all duration-200 flex items-center gap-1.5 ${
                soundEnabled
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                  : 'bg-white/5 border-white/15 text-white/50 hover:text-white/80'
              }`}
              title="Toggle Christmas Chimes"
            >
              <span>{soundEnabled ? '🔔 Chimes On' : '🔕 Chimes Off'}</span>
            </button>
          </div>
        </div>

        {/* ── 4 LUXURY DIGIT CARDS ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          {units.map((u) => {
            const isSeconds = u.id === 'seconds';
            return (
              <div
                key={u.id}
                className={`relative group rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center border ${u.borderColor} bg-gradient-to-b from-white/[0.09] via-white/[0.04] to-black/30 backdrop-blur-xl transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl overflow-hidden`}
                style={{
                  boxShadow: `0 12px 32px -8px ${u.glow}`,
                }}
              >
                {/* Glowing light bead on top right */}
                <div
                  className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full transition-all"
                  style={{
                    backgroundColor: u.lightColor,
                    boxShadow: `0 0 10px 2px ${u.lightColor}`,
                  }}
                />

                {/* Card Top Label */}
                <div className="text-[10px] sm:text-[11px] font-extrabold tracking-[0.2em] text-white/60 uppercase mb-1">
                  {u.label}
                </div>

                {/* Giant Digit with Metallic Holiday Gradient & Tick Glow */}
                <div className="relative my-1 flex items-center justify-center">
                  <span
                    className={`font-heading font-black text-4xl sm:text-5xl md:text-6xl tracking-tighter tabular-nums bg-gradient-to-b ${u.accent} bg-clip-text text-transparent drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)] transition-transform duration-200 ${
                      isSeconds && secTick ? 'scale-110' : 'scale-100'
                    }`}
                  >
                    {mounted ? String(u.value).padStart(2, '0') : '--'}
                  </span>

                  {/* Sleek horizontal glass split-flap crease */}
                  <div className="absolute inset-x-0 top-1/2 h-[1px] bg-white/20 pointer-events-none" />
                </div>

                {/* Subtitle description */}
                <div className="text-[10px] text-white/50 font-medium tracking-wide mt-1">
                  {u.sublabel}
                </div>

                {/* Card Ambient Glow on Hover */}
                <div
                  className="absolute -bottom-6 inset-x-0 h-12 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl pointer-events-none"
                  style={{ backgroundColor: u.lightColor }}
                />
              </div>
            );
          })}
        </div>

        {/* ── BOTTOM ACCENT: COLUMBUS LUXURY BADGE ── */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/70 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <GiSparkles className="text-yellow-400 w-4 h-4 animate-star-twinkle-fast" />
            <span className="font-semibold text-white/90 text-[11px] sm:text-xs">
              Central Ohio's Premier Holiday Light Installation Team
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-amber-300 font-bold bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/30">
            <span>✨ Spots Fill Fast Every Autumn</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChristmasCountdown;
