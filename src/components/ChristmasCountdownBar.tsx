'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

interface MiniFlipUnitProps {
  value: number;
  suffix: string;
  mounted: boolean;
}

// Same "calendar page flip" mechanic as the hero countdown, tuned into a slim navbar card.
const MiniFlipUnit: React.FC<MiniFlipUnitProps> = ({ value, suffix, mounted }) => {
  const formatted = mounted ? String(value).padStart(2, '0') : '--';
  const [currentVal, setCurrentVal] = useState(formatted);
  const [prevVal, setPrevVal] = useState(formatted);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (formatted !== currentVal) {
      setPrevVal(currentVal);
      setCurrentVal(formatted);
      setIsFlipping(true);
      const timer = setTimeout(() => setIsFlipping(false), 520);
      return () => clearTimeout(timer);
    }
  }, [formatted, currentVal]);

  const digitClass =
    'font-heading font-black text-base sm:text-lg md:text-xl leading-none select-none tabular-nums text-[#ffd700]';
  const digitStyle = { textShadow: '0 0 8px rgba(255,215,0,0.35)' };

  return (
    <div className="flex items-end gap-1">
      <div className="relative w-8 h-9 sm:w-9 sm:h-10 md:w-10 md:h-11 perspective-calendar flex-shrink-0">
        <div className="relative w-full h-full rounded-[5px] overflow-hidden bg-gradient-to-b from-[#182545] to-[#080d1f] border border-[#ffd700]/20 flex flex-col shadow-[0_3px_8px_rgba(0,0,0,0.6)]">
          {/* Static top half (next value) */}
          <div className="relative w-full h-1/2 overflow-hidden flex items-end justify-center">
            <span className={digitClass} style={{ ...digitStyle, transform: 'translateY(50%)' }}>
              {currentVal}
            </span>
            <div className="absolute inset-x-0 top-0 h-px bg-white/20 pointer-events-none" />
          </div>
          {/* Static bottom half (old value until flip lands) */}
          <div className="relative w-full h-1/2 overflow-hidden flex items-start justify-center">
            <span className={digitClass} style={{ ...digitStyle, transform: 'translateY(-50%)' }}>
              {isFlipping ? prevVal : currentVal}
            </span>
          </div>

          {/* Flipping leaf */}
          <AnimatePresence>
            {isFlipping && (
              <motion.div
                key={`flip-${currentVal}`}
                initial={{ rotateX: 0 }}
                animate={{ rotateX: -180 }}
                transition={{ duration: 0.5, ease: [0.45, 0.05, 0.55, 0.95] }}
                className="absolute top-0 inset-x-0 h-1/2 calendar-leaf z-30"
              >
                {/* Front (old value folding down) */}
                <div className="absolute inset-0 backface-hidden overflow-hidden bg-gradient-to-b from-[#20305c] to-[#101a38] flex items-end justify-center">
                  <span className={digitClass} style={{ ...digitStyle, transform: 'translateY(50%)' }}>
                    {prevVal}
                  </span>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.55 }}
                    transition={{ duration: 0.28 }}
                    className="absolute inset-0 bg-black pointer-events-none"
                  />
                </div>
                {/* Back (new value landing) */}
                <div
                  className="absolute inset-0 backface-hidden overflow-hidden bg-gradient-to-b from-[#0d1730] to-[#050914] flex items-start justify-center"
                  style={{ transform: 'rotateX(180deg)' }}
                >
                  <span className={digitClass} style={{ ...digitStyle, transform: 'translateY(-50%)' }}>
                    {currentVal}
                  </span>
                  <motion.div
                    initial={{ opacity: 0.45 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 0.35, delay: 0.25 }}
                    className="absolute inset-0 bg-[#ffd700]/40 pointer-events-none"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
      <span className="text-[9px] sm:text-[10px] text-[#f5f5dc]/45 font-bold mb-0.5 select-none uppercase">
        {suffix}
      </span>
    </div>
  );
};

const UNITS: Array<{ key: keyof TimeLeft; suffix: string }> = [
  { key: 'days', suffix: 'd' },
  { key: 'hours', suffix: 'h' },
  { key: 'minutes', suffix: 'm' },
  { key: 'seconds', suffix: 's' },
];

const ChristmasCountdownBar: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const targetDate = useMemo(() => getTargetChristmas(), []);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft(targetDate));

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const isChristmasDay =
    mounted &&
    timeLeft.days === 0 &&
    timeLeft.hours === 0 &&
    timeLeft.minutes === 0 &&
    timeLeft.seconds === 0;

  return (
    <div className="relative w-full bg-gradient-to-b from-[#0a1128] to-[#060a1a] border-b border-[#ffd700]/20 py-1.5 sm:py-2 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ffd700]/50 to-transparent" />
      <div className="flex items-center gap-1.5 sm:gap-2.5 px-2 sm:px-3">
        <svg
          className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#ffd700] flex-shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.539 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        {isChristmasDay ? (
          <span className="text-xs sm:text-sm font-bold tracking-wide text-[#ffd700]">
            Merry Christmas!
          </span>
        ) : (
          <>
            {/* Mobile: label stacked in two short lines to save horizontal room */}
            <div className="flex sm:hidden flex-col items-start leading-[1.15]">
              <span className="text-[9px] uppercase tracking-wide text-[#f5f5dc]/60 font-bold">
                Christmas
              </span>
              <span className="text-[9px] uppercase tracking-wide text-[#f5f5dc]/60 font-bold">
                Countdown
              </span>
            </div>
            {/* sm and up: single-line label */}
            <span className="hidden sm:inline text-[10px] uppercase tracking-[0.15em] text-[#f5f5dc]/60 font-bold whitespace-nowrap">
              Christmas Countdown
            </span>
            <div className="flex items-end gap-1 sm:gap-2">
              {UNITS.map((u) => (
                <MiniFlipUnit key={u.key} value={timeLeft[u.key]} suffix={u.suffix} mounted={mounted} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChristmasCountdownBar;
