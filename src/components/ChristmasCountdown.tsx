'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

// Commercial C9 Faceted Bulb Colors
const BULB_COLORS = [
  { color: '#EF4444', glow: 'rgba(239, 68, 68, 0.95)', name: 'Ruby Red' },
  { color: '#10B981', glow: 'rgba(16, 185, 129, 0.95)', name: 'Pine Emerald' },
  { color: '#F59E0B', glow: 'rgba(245, 158, 11, 0.95)', name: 'Champagne Gold' },
  { color: '#38BDF8', glow: 'rgba(56, 189, 248, 0.95)', name: 'Arctic Cyan' },
  { color: '#EC4899', glow: 'rgba(236, 72, 153, 0.95)', name: 'Royal Magenta' },
  { color: '#FACC15', glow: 'rgba(250, 204, 21, 0.95)', name: 'Warm Amber' },
  { color: '#06D6A0', glow: 'rgba(6, 214, 160, 0.95)', name: 'Crisp Mint' },
  { color: '#EF4444', glow: 'rgba(239, 68, 68, 0.95)', name: 'Ruby Red' },
  { color: '#3B82F6', glow: 'rgba(59, 130, 246, 0.95)', name: 'Cobalt Sapphire' },
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

// ── REALISTIC COMMERCIAL FACETED C9 BULB (SVG) ──
const C9FacetedBulb: React.FC<{
  bulb: { color: string; glow: string; name: string };
  idx: number;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}> = ({ bulb, idx, isHovered, onMouseEnter, onMouseLeave }) => {
  // Graceful staggered drop offsets along wire curve
  const dropY = [10, 18, 9, 20, 10, 19, 9, 20, 10][idx % 9];

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`relative flex flex-col items-center cursor-pointer transition-all duration-300 ${
        isHovered ? '' : 'animate-bulb-sync-wave'
      }`}
      style={
        {
          '--bulb-glow': bulb.glow,
          '--drop-y': `${dropY}px`,
          animationDelay: `${idx * 0.28}s`,
          transform: `translateY(${dropY}px)`,
        } as React.CSSProperties
      }
    >
      {/* Soft Ambient Volumetric Light Bloom Behind Bulb */}
      <div
        className="absolute top-2 w-10 sm:w-14 h-12 sm:h-16 rounded-full pointer-events-none transition-opacity duration-300 -z-10 blur-md"
        style={{
          background: `radial-gradient(circle at 50% 40%, ${bulb.glow} 0%, rgba(0,0,0,0) 70%)`,
          opacity: isHovered ? 0.95 : 0.45,
        }}
      />

      {/* SVG Commercial C9 Faceted Diamond Bulb */}
      <svg
        className="w-5 h-9 sm:w-6 sm:h-11 overflow-visible filter drop-shadow-md"
        viewBox="0 0 24 44"
        fill="none"
      >
        <defs>
          <linearGradient id={`c9-grad-${idx}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="25%" stopColor={bulb.color} stopOpacity="0.95" />
            <stop offset="80%" stopColor={bulb.color} stopOpacity="1" />
            <stop offset="100%" stopColor="#0a0a0a" stopOpacity="0.35" />
          </linearGradient>
        </defs>

        {/* Commercial Dark-Green Socket Base */}
        <path
          d="M 6 0 L 18 0 L 17 8.5 L 7 8.5 Z"
          fill="#132c1c"
          stroke="#0a1910"
          strokeWidth="0.8"
        />
        {/* Mounting Clip Ear */}
        <path
          d="M 6 2.5 C 4 2.5 4 6 6 6"
          stroke="#0e2316"
          strokeWidth="1.2"
          fill="none"
        />
        {/* Brass Thread Collar Ring */}
        <rect x="7.5" y="8" width="9" height="2.5" rx="0.5" fill="#c59b27" />
        <line x1="8" y1="9.3" x2="16" y2="9.3" stroke="#7e600f" strokeWidth="0.6" />

        {/* C9 Diamond Strawberry Cone Silhouette */}
        <path
          d="M 8 10.5 C 4.5 14 2.5 18.5 2.5 23.5 C 2.5 30.5 7.5 37 12 42.5 C 16.5 37 21.5 30.5 21.5 23.5 C 21.5 18.5 19.5 14 16 10.5 Z"
          fill={`url(#c9-grad-${idx})`}
          stroke={bulb.color}
          strokeWidth="0.5"
        />

        {/* Authentic Diamond Facets Lattice Mesh */}
        <g stroke="rgba(255, 255, 255, 0.32)" strokeWidth="0.65" fill="none">
          {/* Central Ridge Line */}
          <line x1="12" y1="10.5" x2="12" y2="42.5" stroke="rgba(255, 255, 255, 0.45)" />
          {/* Diamond Cut Diagonal Layers */}
          <path d="M 6 15 L 12 21 L 18 15" />
          <path d="M 3.5 22 L 12 29 L 20.5 22" />
          <path d="M 5 30 L 12 36 L 19 30" />
          <path d="M 2.5 23.5 L 12 23.5 L 21.5 23.5" stroke="rgba(255, 255, 255, 0.2)" />
        </g>

        {/* Glowing SMD LED Core */}
        <ellipse
          cx="12"
          cy="22"
          rx="1.4"
          ry="4.5"
          fill="#ffffff"
          opacity={isHovered ? 1 : 0.85}
        />

        {/* Specular Glass Highlight */}
        <path
          d="M 5 16.5 C 4 20.5 4.5 25 7 28"
          stroke="#ffffff"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.7"
        />
      </svg>
    </div>
  );
};

// ── CALENDAR PAGE FLIP CARD (UPSIDE DOWN FOLD) ──
interface CalendarFlipCardProps {
  value: number;
  label: string;
  sublabel: string;
  accent: string;
  glow: string;
  borderColor: string;
  lightColor: string;
  mounted: boolean;
}

const CalendarFlipCard: React.FC<CalendarFlipCardProps> = ({
  value,
  label,
  sublabel,
  accent,
  glow,
  borderColor,
  lightColor,
  mounted,
}) => {
  const formatted = mounted ? String(value).padStart(2, '0') : '--';
  const [currentVal, setCurrentVal] = useState<string>(formatted);
  const [prevVal, setPrevVal] = useState<string>(formatted);
  const [isFlipping, setIsFlipping] = useState<boolean>(false);

  useEffect(() => {
    if (formatted !== currentVal) {
      setPrevVal(currentVal);
      setCurrentVal(formatted);
      setIsFlipping(true);
      const timer = setTimeout(() => {
        setIsFlipping(false);
      }, 520);
      return () => clearTimeout(timer);
    }
  }, [formatted, currentVal]);

  return (
    <div
      className={`relative group rounded-2xl p-2.5 xs:p-3 sm:p-4 md:p-5 flex flex-col items-center justify-between border ${borderColor} bg-gradient-to-b from-white/[0.08] via-white/[0.03] to-black/40 backdrop-blur-xl transition-all duration-300 hover:shadow-2xl overflow-hidden`}
      style={{
        boxShadow: `0 10px 28px -10px ${glow}`,
      }}
    >
      {/* Top light indicator pip */}
      <div
        className="absolute top-2 right-2 xs:top-2.5 xs:right-2.5 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all"
        style={{
          backgroundColor: lightColor,
          boxShadow: `0 0 8px 2px ${lightColor}`,
        }}
      />

      {/* Decorative metallic calendar rings/hinges at the top */}
      <div className="absolute top-1.5 inset-x-0 flex justify-center gap-6 sm:gap-8 pointer-events-none opacity-60">
        <div className="w-1.5 h-2 rounded-full bg-gradient-to-b from-amber-300 via-amber-100 to-amber-500 shadow-sm" />
        <div className="w-1.5 h-2 rounded-full bg-gradient-to-b from-amber-300 via-amber-100 to-amber-500 shadow-sm" />
      </div>

      {/* Card Header Label */}
      <div className="text-[9px] xs:text-[10px] sm:text-[11px] font-extrabold tracking-[0.18em] text-white/60 uppercase mb-1 mt-0.5 z-20">
        {label}
      </div>

      {/* ── CALENDAR PAGE FLIP CONTAINER ── */}
      <div className="relative w-full h-18 xs:h-22 sm:h-26 md:h-30 my-1 perspective-calendar flex items-center justify-center">
        {/* Full Card Body */}
        <div className="relative w-full h-full rounded-xl overflow-hidden shadow-inner bg-[#0c1222]/90 border border-white/10 flex flex-col">
          {/* Static Top Half (Shows Next Value) */}
          <div className="relative w-full h-1/2 overflow-hidden bg-white/[0.06] border-b border-black/40 flex items-end justify-center">
            <span
              className={`font-heading font-black text-3xl xs:text-4xl sm:text-5xl md:text-6xl tracking-tight tabular-nums bg-gradient-to-b ${accent} bg-clip-text text-transparent transform translate-y-1/2 select-none`}
            >
              {currentVal}
            </span>
            {/* Subtle top gloss sheen */}
            <div className="absolute inset-x-0 top-0 h-[1px] bg-white/25 pointer-events-none" />
          </div>

          {/* Static Bottom Half (Shows Current/Old Value until flip finishes) */}
          <div className="relative w-full h-1/2 overflow-hidden bg-white/[0.02] flex items-start justify-center">
            <span
              className={`font-heading font-black text-3xl xs:text-4xl sm:text-5xl md:text-6xl tracking-tight tabular-nums bg-gradient-to-b ${accent} bg-clip-text text-transparent transform -translate-y-1/2 select-none`}
            >
              {isFlipping ? prevVal : currentVal}
            </span>
          </div>

          {/* ── THE FLIPPING LEAF (Calendar Page Flipping Upside Down) ── */}
          <AnimatePresence>
            {isFlipping && (
              <motion.div
                key={`flip-${currentVal}`}
                initial={{ rotateX: 0 }}
                animate={{ rotateX: -180 }}
                transition={{ duration: 0.52, ease: [0.45, 0.05, 0.55, 0.95] }}
                className="absolute top-0 inset-x-0 h-1/2 calendar-leaf z-30"
              >
                {/* Front of flipping leaf (Top half of old value, folds downwards) */}
                <div className="absolute inset-0 backface-hidden overflow-hidden bg-gradient-to-b from-[#141d33] to-[#0c1222] border-b border-black/50 rounded-t-xl flex items-end justify-center shadow-lg">
                  <span
                    className={`font-heading font-black text-3xl xs:text-4xl sm:text-5xl md:text-6xl tracking-tight tabular-nums bg-gradient-to-b ${accent} bg-clip-text text-transparent transform translate-y-1/2 select-none`}
                  >
                    {prevVal}
                  </span>
                  {/* Dynamic fold shadow */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    transition={{ duration: 0.25 }}
                    className="absolute inset-0 bg-black/60 pointer-events-none"
                  />
                </div>

                {/* Back of flipping leaf (Bottom half of new value, landing on bottom) */}
                <div
                  className="absolute inset-0 backface-hidden overflow-hidden bg-gradient-to-b from-[#0c1222] to-[#141d33] rounded-b-xl flex items-start justify-center shadow-2xl"
                  style={{ transform: 'rotateX(180deg)' }}
                >
                  <span
                    className={`font-heading font-black text-3xl xs:text-4xl sm:text-5xl md:text-6xl tracking-tight tabular-nums bg-gradient-to-b ${accent} bg-clip-text text-transparent transform -translate-y-1/2 select-none`}
                  >
                    {currentVal}
                  </span>
                  {/* Sheen clearing on land */}
                  <motion.div
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 0.3, delay: 0.22 }}
                    className="absolute inset-0 bg-white/20 pointer-events-none"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Central Crease Line & Side Hinges */}
          <div className="absolute top-1/2 inset-x-0 h-[1.5px] bg-black/70 -translate-y-1/2 z-40 flex items-center justify-between px-1">
            <div className="w-1 h-1 rounded-full bg-slate-500 shadow-inner" />
            <div className="w-1 h-1 rounded-full bg-slate-500 shadow-inner" />
          </div>
        </div>
      </div>

      {/* Card Subtitle */}
      <div className="text-[9px] xs:text-[10px] sm:text-[11px] text-white/50 font-medium tracking-wide mt-1 z-20 text-center">
        {sublabel}
      </div>

      {/* Ambient Floor Glow on Hover */}
      <div
        className="absolute -bottom-6 inset-x-0 h-10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl pointer-events-none"
        style={{ backgroundColor: lightColor }}
      />
    </div>
  );
};

// ── MAIN CHRISTMAS COUNTDOWN COMPONENT ──
const ChristmasCountdown: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [activeBulb, setActiveBulb] = useState<number | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [stars, setStars] = useState<StarParticle[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const targetDate = useMemo(() => getTargetChristmas(), []);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft(targetDate));

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
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

  // Click celebration stardust (tap anywhere)
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
    for (let i = 0; i < 24; i++) {
      const angle = (Math.PI * 2 * i) / 24;
      const speed = 2 + Math.random() * 4.5;
      newStars.push({
        id: Date.now() + i,
        x: clickX,
        y: clickY,
        color: colors[i % colors.length],
        size: 3 + Math.random() * 4,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        life: 1,
      });
    }

    setStars((prev) => [...prev.slice(-36), ...newStars]);
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
      accent: 'from-rose-400 via-red-500 to-amber-500',
      glow: 'rgba(239, 68, 68, 0.4)',
      borderColor: 'border-red-500/30 hover:border-red-400/80',
      lightColor: '#EF4444',
    },
    {
      id: 'hours',
      value: timeLeft.hours,
      label: 'HOURS',
      sublabel: 'Holiday Hours',
      accent: 'from-amber-300 via-yellow-400 to-orange-500',
      glow: 'rgba(245, 158, 11, 0.4)',
      borderColor: 'border-amber-500/30 hover:border-amber-400/80',
      lightColor: '#F59E0B',
    },
    {
      id: 'minutes',
      value: timeLeft.minutes,
      label: 'MINUTES',
      sublabel: 'Glowing Moments',
      accent: 'from-emerald-300 via-teal-400 to-emerald-500',
      glow: 'rgba(16, 185, 129, 0.4)',
      borderColor: 'border-emerald-500/30 hover:border-emerald-400/80',
      lightColor: '#10B981',
    },
    {
      id: 'seconds',
      value: timeLeft.seconds,
      label: 'SECONDS',
      sublabel: 'Pure Excitement',
      accent: 'from-cyan-300 via-sky-400 to-blue-500',
      glow: 'rgba(56, 189, 248, 0.4)',
      borderColor: 'border-cyan-500/30 hover:border-cyan-400/80',
      lightColor: '#38BDF8',
    },
  ];

  return (
    <div
      ref={containerRef}
      onClick={triggerStardust}
      className="relative w-full max-w-4xl mx-auto my-4 sm:my-6 px-2 sm:px-4 select-none cursor-pointer"
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
      <div className="absolute -inset-3 sm:-inset-4 bg-gradient-to-r from-red-600/20 via-yellow-500/15 via-emerald-600/20 to-blue-600/20 rounded-[32px] sm:rounded-[40px] blur-2xl sm:blur-3xl opacity-70 pointer-events-none -z-10 animate-pulse-slow" />

      {/* Main Solid Glass Deck Container (Zero Tilt) */}
      <div className="relative rounded-2xl sm:rounded-3xl backdrop-blur-2xl bg-gradient-to-b from-[#0e1628]/90 via-[#0b1020]/95 to-[#070b16]/98 border border-white/15 p-3.5 xs:p-4 sm:p-6 md:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* ── DRAPED COMMERCIAL C9 LIGHT GARLAND WITH SYNCHRONIZED WAVE GLOW ── */}
        <div className="relative w-full mb-5 sm:mb-7 pt-0.5">
          {/* Heavy-Duty Commercial Dark Green Twisted Wire SVG */}
          <svg
            className="w-full h-7 sm:h-9 overflow-visible"
            viewBox="0 0 800 30"
            fill="none"
            preserveAspectRatio="none"
          >
            {/* Primary Dark Pine Cord */}
            <path
              d="M 0 7 Q 100 23, 200 7 Q 300 23, 400 7 Q 500 23, 600 7 Q 700 23, 800 7"
              stroke="#132c1c"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
            {/* Secondary Twisted Commercial Wire Winding */}
            <path
              d="M 0 6.5 Q 100 22.5, 200 6.5 Q 300 22.5, 400 6.5 Q 500 22.5, 600 6.5 Q 700 22.5, 800 6.5"
              stroke="#1e462d"
              strokeWidth="1.4"
              strokeDasharray="6 3.5"
            />
          </svg>

          {/* 9 Authentic Commercial Faceted C9 Bulbs with Synchronized Wave Animation */}
          <div className="absolute inset-x-0 top-0 flex justify-between px-1.5 xs:px-3 sm:px-6 pointer-events-auto">
            {BULB_COLORS.map((bulb, idx) => (
              <C9FacetedBulb
                key={idx}
                bulb={bulb}
                idx={idx}
                isHovered={activeBulb === idx}
                onMouseEnter={() => {
                  setActiveBulb(idx);
                  if (soundEnabled) playChimeTone(587.33 + idx * 65);
                }}
                onMouseLeave={() => setActiveBulb(null)}
              />
            ))}
          </div>
        </div>

        {/* ── 4 CALENDAR FLIP UNITS (DAYS, HOURS, MINUTES, SECONDS) ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 xs:gap-3 sm:gap-4 md:gap-5 mt-2 sm:mt-3">
          {units.map((u) => (
            <CalendarFlipCard
              key={u.id}
              value={u.value}
              label={u.label}
              sublabel={u.sublabel}
              accent={u.accent}
              glow={u.glow}
              borderColor={u.borderColor}
              lightColor={u.lightColor}
              mounted={mounted}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChristmasCountdown;
