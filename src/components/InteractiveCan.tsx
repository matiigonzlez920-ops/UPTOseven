import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { ProductVariety, ProductVarietyId } from '../types';
import { PRODUCT_VARIETIES } from '../data/products';
import { sound } from '../utils/audio';
import { BubbleParticles } from './BubbleParticles';
import { useCanImage } from '../utils/useCanImages';

interface InteractiveCanProps {
  selectedVarietyId: ProductVarietyId;
  onSelectVariety: (id: ProductVarietyId) => void;
  className?: string;
  showSelector?: boolean;
}

export const InteractiveCan: React.FC<InteractiveCanProps> = ({
  selectedVarietyId,
  onSelectVariety,
  className = '',
  showSelector = true,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [burstCount, setBurstCount] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);

  const currentVariety: ProductVariety = PRODUCT_VARIETIES[selectedVarietyId] || PRODUCT_VARIETIES.original;
  const canImage = useCanImage(selectedVarietyId);

  const handleOpenCan = () => {
    sound.playCanOpen();
    setIsOpen(true);
    setBurstCount((prev) => prev + 1);
  };

  const handleResetCan = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick();
    setIsOpen(false);
  };

  const handleVarietyChange = (id: ProductVarietyId) => {
    sound.playClick();
    setImageError(false);
    onSelectVariety(id);
  };

  const bubbleColor =
    selectedVarietyId === 'cherry'
      ? 'red'
      : selectedVarietyId === 'zero'
      ? 'green'
      : selectedVarietyId === 'tropical'
      ? 'orange'
      : 'lime';

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      {/* Main Stage: Can + Floating Badges + Bubbles */}
      <div className="relative w-80 sm:w-96 lg:w-[420px] h-[520px] sm:h-[580px] flex items-center justify-center">
        {/* Ambient Glow Aura based on selected flavor */}
        <div
          className="absolute w-80 sm:w-96 h-80 sm:h-96 rounded-full blur-3xl -z-10 transition-all duration-700 pointer-events-none"
          style={{
            backgroundColor: currentVariety.canAuraColor,
            transform: isHovered ? 'scale(1.2)' : 'scale(1)',
          }}
        />

        {/* Effervescent Bubbles Canvas */}
        <BubbleParticles
          burstTrigger={burstCount}
          color={bubbleColor}
          density={26}
          className="rounded-3xl"
        />

        {/* Floating Sensory Chip Left */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -left-2 sm:-left-6 lg:-left-10 top-16 z-20 hidden sm:flex flex-col gap-1 p-3 bg-white/95 dark:bg-[#0C2413]/95 backdrop-blur-md rounded-2xl shadow-xl border border-emerald-100 dark:border-emerald-700/50 max-w-[150px]"
        >
          <div className="flex items-center gap-1.5 text-emerald-700 dark:text-[#A4D902] font-extrabold text-xs sm:text-sm">
            <Sparkles className="w-4 h-4 text-[#029F3D]" />
            <span>100% Cítrico</span>
          </div>
          <p className="text-[11px] text-emerald-950/70 dark:text-emerald-200/80 font-medium leading-tight">
            Esencias de limón &amp; lima natural
          </p>
        </motion.div>

        {/* Floating Sensory Chip Right */}
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="absolute -right-2 sm:-right-6 lg:-right-10 bottom-24 z-20 hidden sm:flex flex-col gap-1 p-3 bg-white/95 dark:bg-[#0C2413]/95 backdrop-blur-md rounded-2xl shadow-xl border border-emerald-100 dark:border-emerald-700/50 max-w-[155px]"
        >
          <div className="flex items-center gap-1.5 text-emerald-700 dark:text-[#A4D902] font-extrabold text-xs sm:text-sm">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
            <span>Sonido Real</span>
          </div>
          <p className="text-[11px] text-emerald-950/70 dark:text-emerald-200/80 font-medium leading-tight">
            ¡Hacé click para escuchar el ¡PSSSH!
          </p>
        </motion.div>

        {/* The Interactive Can with Physical Tap & Open Animation */}
        <motion.div
          id="interactive-7up-can"
          role="button"
          tabIndex={0}
          aria-label={`Lata interactiva ${currentVariety.name}. Hacé click para destapar y escuchar el sonido.`}
          onClick={handleOpenCan}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleOpenCan();
            }
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          whileHover={{ scale: 1.04, rotate: -1 }}
          whileTap={{ scale: 0.94 }}
          animate={
            isOpen
              ? {
                  y: [0, -10, 3, 0],
                  transition: { duration: 0.4, ease: 'easeOut' },
                }
              : {}
          }
          className="relative cursor-pointer group flex flex-col items-center focus:outline-hidden"
        >
          {/* VAPOR / CO2 MIST on open */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.5 }}
                animate={{ opacity: [0, 1, 0], y: -50, scale: 1.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.85, ease: 'easeOut' }}
                className="absolute -top-14 left-1/2 -translate-x-1/2 z-40 pointer-events-none flex flex-col items-center"
              >
                <div className="w-20 h-14 bg-radial from-white via-lime-100/70 to-transparent blur-md rounded-full" />
                <div className="text-[12px] font-black text-emerald-800 bg-white/95 px-3 py-1 rounded-full shadow-lg border border-emerald-300 -mt-2 whitespace-nowrap flex items-center gap-1">
                  <span>¡PSSSH!</span>
                  <span>❄️</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Realistic Can Image / Visual Shell */}
          <div className="relative w-64 sm:w-76 lg:w-84 h-[400px] sm:h-[460px] flex items-center justify-center filter drop-shadow-[0_30px_45px_rgba(0,50,20,0.35)]">
            {!imageError ? (
              <img
                src={canImage}
                alt={`Lata de ${currentVariety.name}`}
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
                className={`w-full h-full object-contain transition-transform duration-300 ${
                  isHovered ? 'scale-105' : 'scale-100'
                }`}
              />
            ) : (
              /* Fallback SVG if image not accessible */
              <div
                className="w-56 sm:w-64 h-88 sm:h-96 rounded-3xl p-6 flex flex-col items-center justify-between text-white shadow-2xl relative overflow-hidden"
                style={{ backgroundColor: currentVariety.dominantColor }}
              >
                <div className="w-full text-center text-xs font-black tracking-widest uppercase opacity-80">
                  {currentVariety.badge}
                </div>
                <div className="text-7xl font-black italic tracking-tighter">
                  7<span className="text-[#F2081B] not-italic">.</span>
                </div>
                <div className="w-full text-center text-sm font-extrabold uppercase">
                  {currentVariety.name}
                </div>
              </div>
            )}

            {/* Simulated Open Tab indicator badge overlay at the top rim */}
            {isOpen && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute top-2 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
              >
                <div className="w-9 h-4.5 rounded-full bg-black/60 border border-white/50 shadow-inner flex items-center justify-center">
                  <div className="w-3.5 h-2.5 rounded-full bg-emerald-400 blur-xs animate-pulse" />
                </div>
              </motion.div>
            )}
          </div>

          {/* Action Callout beneath Can */}
          <div className="mt-5 flex flex-col items-center">
            {isOpen ? (
              <div className="flex items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 text-white rounded-full text-xs sm:text-sm font-black shadow-md animate-bounce">
                  <Sparkles className="w-4 h-4" />
                  ¡Lata abierta! 🔊
                </span>
                <button
                  type="button"
                  onClick={handleResetCan}
                  aria-label="Cerrar y volver a destapar"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white dark:bg-[#0C2413] hover:bg-emerald-50 dark:hover:bg-[#15381F] text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-700/50 text-xs sm:text-sm font-bold transition-colors shadow-xs"
                  title="Reiniciar lata para volver a escuchar"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Volver a abrir</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                id="open-can-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenCan();
                }}
                className="group/btn relative inline-flex items-center gap-2.5 px-8 py-3 rounded-full font-black text-sm sm:text-base text-white bg-[#F2081B] hover:bg-[#F2081B] shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95"
              >
                <span>¡APRETÁ LA LATA!</span>
                <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
              </button>
            )}
            <span className="text-xs text-emerald-950/75 dark:text-emerald-200/80 font-bold mt-2 tracking-wide">
              {isOpen ? 'Presioná volver a abrir para escuchar de nuevo' : 'Tocá la lata para escuchar el sonido real'}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Flavor Variety Selector ("ELIGÍ TU 7UP") */}
      {showSelector && (
        <div className="w-full max-w-xl mt-8 flex flex-col items-center px-2">
          <div
            id="variety-selector"
            className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-2 bg-white/95 dark:bg-[#0A1F10]/95 backdrop-blur-sm rounded-2xl sm:rounded-full border border-emerald-200/90 dark:border-emerald-800/60 shadow-sm w-full"
          >
            {(['original', 'zero', 'cherry', 'tropical'] as ProductVarietyId[]).map((vId) => {
              const isSelected = selectedVarietyId === vId;
              return (
                <button
                  key={vId}
                  id={`select-variety-${vId}`}
                  type="button"
                  onClick={() => handleVarietyChange(vId)}
                  className={`py-2.5 px-3 sm:px-4 rounded-xl sm:rounded-full text-xs sm:text-sm font-black transition-all duration-200 whitespace-nowrap text-center ${
                    isSelected
                      ? vId === 'cherry'
                        ? 'bg-[#B30B2D] text-white shadow-md scale-102'
                        : vId === 'zero'
                        ? 'bg-[#01592A] text-[#A4D902] shadow-md scale-102'
                        : vId === 'tropical'
                        ? 'bg-[#008C99] text-[#A4D902] shadow-md scale-102'
                        : 'bg-[#01592A] text-white shadow-md scale-102'
                      : 'text-emerald-900/70 dark:text-emerald-200/70 hover:text-emerald-950 dark:hover:text-white hover:bg-emerald-50/80 dark:hover:bg-emerald-900/40'
                  }`}
                >
                  {vId === 'original' && 'ORIGINAL'}
                  {vId === 'zero' && 'ZERO AZÚCAR'}
                  {vId === 'cherry' && 'CHERRY'}
                  {vId === 'tropical' && 'TROPICAL'}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
