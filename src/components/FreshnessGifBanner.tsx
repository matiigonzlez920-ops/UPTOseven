import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Zap, Citrus } from 'lucide-react';

interface FreshnessGifBannerProps {
  className?: string;
}

const MARQUEE_ITEMS = [
  { text: 'SIENTE EL FRESCOR', icon: 'sparkle', highlight: true },
  { text: '100% SABOR NATURAL DE LIMÓN Y LIMA', icon: 'citrus' },
  { text: 'BURBUJAS CRISTALINAS', icon: 'zap' },
  { text: '7UP • UP YOUR DAY', icon: 'badge', highlight: true },
  { text: 'DESPIERTA TUS SENTIDOS', icon: 'sparkle' },
  { text: 'AUTÉNTICO & REFRESCANTE', icon: 'citrus' },
  { text: 'DISPONIBLE EN ORIGINAL Y ZERO SUGAR', icon: 'zap' },
  { text: 'EXPLOSIÓN CÍTRICA PURA', icon: 'sparkle', highlight: true },
];

export const FreshnessGifBanner: React.FC<FreshnessGifBannerProps> = ({ className = '' }) => {
  // Duplicate items 4 times to ensure seamless infinite horizontal loop
  const repeatedItems = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <div
      id="marquee-divider-banner"
      className={`relative w-full my-8 sm:my-12 overflow-hidden select-none ${className}`}
    >
      {/* Top decorative pixel/dash border */}
      <div className="w-full h-1 bg-repeating-linear from-[#A4D902] via-[#A4D902] to-[#A4D902] opacity-80" />

      {/* Main Marquee Banner Strip - Fondo Verde */}
      <div className="relative py-3 sm:py-4 bg-[#01592A] dark:bg-[#01592A] border-y-2 border-[#A4D902]/50 dark:border-[#A4D902]/30 shadow-lg overflow-hidden flex items-center">
        {/* Subtle ambient light gradient */}
        <div className="absolute inset-0 bg-linear-to-r from-black/20 via-transparent to-black/20 pointer-events-none" />

        {/* Endless Scrolling Track */}
        <motion.div
          className="flex shrink-0 items-center gap-6 sm:gap-8 whitespace-nowrap cursor-default"
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            ease: 'linear',
            duration: 28,
            repeat: Infinity,
          }}
          whileHover={{ animationPlayState: 'paused' }}
        >
          {repeatedItems.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 sm:gap-4 shrink-0">
              {/* Icon / Badge */}
              {item.icon === 'badge' ? (
                <span className="w-6 h-6 rounded-full bg-[#F2081B] text-white font-black text-xs flex items-center justify-center shadow-md border border-white/40">
                  7
                </span>
              ) : item.icon === 'citrus' ? (
                <span className="w-2.5 h-2.5 rounded-full bg-[#A4D902] shadow-[0_0_8px_#A4D902]" />
              ) : item.icon === 'zap' ? (
                <Zap className="w-4 h-4 text-[#A4D902] fill-current" />
              ) : (
                <Sparkles className="w-4 h-4 text-[#A4D902] fill-current" />
              )}

              {/* Text */}
              <span
                className={`text-sm sm:text-base md:text-lg font-black tracking-wider uppercase ${
                  item.highlight
                    ? 'text-[#A4D902] drop-shadow-sm'
                    : 'text-white drop-shadow-xs'
                }`}
              >
                {item.text}
              </span>

              {/* Separator Bullet / Star */}
              <span className="text-[#A4D902]/60 font-bold text-base select-none">
                ✦
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom decorative pixel/dash border */}
      <div className="w-full h-1 bg-repeating-linear from-[#A4D902] via-[#A4D902] to-[#A4D902] opacity-80" />
    </div>
  );
};
