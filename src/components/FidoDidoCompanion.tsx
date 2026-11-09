import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Gamepad2, ChevronRight } from 'lucide-react';
import { FidoDidoIllustration } from './FidoDidoIllustration';
import { PageId } from '../types';

interface FidoDidoCompanionProps {
  onNavigate?: (page: PageId) => void;
}

const FIDO_QUOTES = [
  'Está genial ser vos mismo. La autenticidad nunca pasa de moda.',
  'Fido es fiel a sí mismo. Fido no hace daño a nadie. Fido ve las cosas con total claridad.',
  'Relajate un poco. El mundo va muy rápido; tomate un 7UP bien helado.',
  'Menos complicaciones, más burbujas de limón y lima.',
  'Si la vida se pone pesada, respondé con frescura liviana y buena onda.',
  'Tu estilo no se compra en ningún shopping: viene con tu propia actitud.',
  'No te tomes las cosas tan en serio. Abrí una lata helada y disfrutá el momento.',
  '¿Sabías que en los 90 me dibujaron en una servilleta de café? De las cosas simples nacen las mejores ideas.',
  'No juzgues a los demás: cada quien vibra a su propio ritmo.',
  'Mantené la mente fresca, la actitud relajada y el corazón liviano.',
];

export const FidoDidoCompanion: React.FC<FidoDidoCompanionProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
    setHasInteracted(true);
  };

  const handleNextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % FIDO_QUOTES.length);
  };

  const handleGoToGame = () => {
    setIsOpen(false);
    if (onNavigate) {
      onNavigate('juego');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleGoToHistory = () => {
    setIsOpen(false);
    if (onNavigate) {
      onNavigate('historia');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end select-none">
      {/* Speech Bubble / Dialogue Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-3 w-80 sm:w-96 p-5 rounded-3xl bg-white dark:bg-white text-[#01592A] dark:text-[#01592A] border-2 border-emerald-800/20 dark:border-emerald-800/30 shadow-2xl relative overflow-hidden"
          >
            {/* Top Bar with close button */}
            <div className="flex items-center justify-between pb-3 border-b border-emerald-100 dark:border-emerald-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F2081B] animate-pulse" />
                <span className="text-xs font-black tracking-wider uppercase text-[#01592A]">
                  FIDO DIDO • FILOSOFÍA 90s
                </span>
              </div>
              <button
                type="button"
                id="close-fido-companion-btn"
                onClick={handleToggle}
                className="p-1 rounded-full text-emerald-900/60 hover:text-emerald-950 hover:bg-emerald-100/60 transition-colors"
                aria-label="Cerrar Fido Dido"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Fido Visual + Speech Text */}
            <div className="flex items-start gap-4 pt-3">
              <div className="shrink-0 w-20 h-28 flex items-center justify-center -ml-2 -mb-2">
                <FidoDidoIllustration className="w-24 h-32 scale-90" pose="chill" />
              </div>

              <div className="flex-1 flex flex-col justify-between min-h-[90px]">
                <div className="relative p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200/60 text-xs sm:text-sm font-medium leading-relaxed text-[#01592A] shadow-xs">
                  {/* Triangle speech pointer */}
                  <div className="absolute top-5 -left-1.5 w-3 h-3 bg-emerald-50 border-b border-l border-emerald-200/60 rotate-45" />
                  &ldquo;{FIDO_QUOTES[quoteIndex]}&rdquo;
                </div>

                <div className="flex items-center justify-between mt-2 pt-1">
                  <span className="text-[10px] text-emerald-900/50 font-bold">
                    Regla {quoteIndex + 1} de {FIDO_QUOTES.length}
                  </span>
                  <button
                    type="button"
                    onClick={handleNextQuote}
                    className="text-[11px] font-black text-[#01592A] hover:text-[#01592A] flex items-center gap-1 underline decoration-2 underline-offset-2 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-[#F2081B]" />
                    <span>Otro consejo</span>
                  </button>
                </div>
              </div>
            </div>

            <p className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs leading-relaxed text-[#01592A]">
              Seguí bajando después de 2023 en Historia: hay un capítulo bloqueado por descubrir.
            </p>

            {/* Quick Actions Shortcuts */}
            <div className="mt-3 pt-3 border-t border-emerald-100 flex items-center gap-2">
              <button
                type="button"
                onClick={handleGoToGame}
                className="flex-1 py-2 px-3 rounded-xl bg-[#A4D902] hover:bg-[#A4D902] text-[#01592A] font-black text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-xs transition-transform active:scale-95"
              >
                <Gamepad2 className="w-3.5 h-3.5" />
                <span>Trailer &amp; Descarga</span>
              </button>

              <button
                type="button"
                onClick={handleGoToHistory}
                className="py-2 px-3 rounded-xl bg-emerald-100/60 hover:bg-emerald-200/60 text-[#01592A] font-bold text-[11px] flex items-center gap-1 transition-colors"
              >
                <span>Ver los 90s</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Button */}
      <motion.button
        type="button"
        id="fido-dido-float-btn"
        whileHover={{ scale: 1.06, y: -2 }}
        whileTap={{ scale: 0.94 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        onClick={handleToggle}
        className="pointer-events-auto relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white dark:bg-white hover:bg-[#F1F6D5] dark:hover:bg-neutral-100 border-2 sm:border-3 border-[#01592A] dark:border-[#A4D902] hover:border-[#A4D902] shadow-xl hover:shadow-2xl flex items-center justify-center p-2 sm:p-2.5 transition-colors cursor-pointer overflow-hidden"
        aria-label="Fido Dido"
      >
        <motion.img
          src="/cara.svg"
          alt="Fido Dido"
          whileHover={{ rotate: [0, -4, 4, 0] }}
          transition={{ duration: 0.4 }}
          className="w-full h-full object-contain pointer-events-none"
        />
      </motion.button>
    </div>
  );
};
