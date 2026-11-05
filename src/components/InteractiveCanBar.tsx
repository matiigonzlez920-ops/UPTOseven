import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Sparkles, Info } from 'lucide-react';
import { ProductVariety, ProductVarietyId } from '../types';
import { PRODUCT_LIST } from '../data/products';
import { useAllCanImages } from '../utils/useCanImages';

interface InteractiveCanBarProps {
  onSelectProduct?: (id: ProductVarietyId) => void;
  selectedId?: ProductVarietyId;
}

export const InteractiveCanBar: React.FC<InteractiveCanBarProps> = ({
  onSelectProduct,
  selectedId,
}) => {
  const canImages = useAllCanImages();

  // Current active product index (0 to 3) for the carousel
  const initialIndex = selectedId
    ? Math.max(0, PRODUCT_LIST.findIndex((p) => p.id === selectedId))
    : 3; // defaults to tropical

  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex >= 0 ? initialIndex : 3);

  const activeProduct: ProductVariety = PRODUCT_LIST[currentIndex] || PRODUCT_LIST[0];

  const handleSelectProduct = (product: ProductVariety) => {
    const idx = PRODUCT_LIST.findIndex((p) => p.id === product.id);
    if (idx !== -1) {
      setCurrentIndex(idx);
    }

    if (onSelectProduct) {
      onSelectProduct(product.id);
    }
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % PRODUCT_LIST.length;
    setCurrentIndex(nextIdx);
    if (onSelectProduct) {
      onSelectProduct(PRODUCT_LIST[nextIdx].id);
    }
  };

  const handlePrev = () => {
    const prevIdx = (currentIndex - 1 + PRODUCT_LIST.length) % PRODUCT_LIST.length;
    setCurrentIndex(prevIdx);
    if (onSelectProduct) {
      onSelectProduct(PRODUCT_LIST[prevIdx].id);
    }
  };

  return (
    <section
      id="interactive-can-sound-bar"
      className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16"
    >
      {/* Background Decorative Glow */}
      <div className="absolute inset-0 bg-radial from-emerald-100/40 via-transparent to-transparent -z-10 pointer-events-none rounded-3xl" />

      {/* Header with Call to Action */}
      <div className="flex flex-col items-center text-center mb-8 sm:mb-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E51E2B] text-white text-xs font-black tracking-wider uppercase shadow-sm mb-3"
        >
          <Sparkles className="w-4 h-4" />
          <span>CATÁLOGO DE PRODUCTOS 7UP</span>
        </motion.div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#05421A] dark:text-[#E8F8EC] tracking-tight uppercase">
          NUESTROS PRODUCTOS Y SABORES
        </h2>

        <p className="text-sm sm:text-base text-emerald-950/75 dark:text-emerald-200/80 max-w-2xl mt-2 font-medium">
          Seleccioná cualquiera de las 4 variedades para consultar su información nutricional detallada, calorías e ingredientes completos.
        </p>
      </div>

      {/* 1. TOP SELECTOR BAR: 4 uniform clickable can cards with carousel navigation */}
      <div className="relative mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {PRODUCT_LIST.map((prod, idx) => {
            const isSelected = idx === currentIndex;

            return (
              <button
                key={prod.id}
                id={`can-card-${prod.id}`}
                type="button"
                onClick={() => handleSelectProduct(prod)}
                className={`relative flex flex-col items-center justify-between p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl border text-left transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? 'bg-white dark:bg-[#0F2D18] border-2 border-[#008B3E] ring-4 ring-[#7ED957]/30 dark:ring-[#7ED957]/20 shadow-lg scale-[1.02]'
                    : 'bg-white/80 dark:bg-[#0A1F10]/80 hover:bg-white dark:hover:bg-[#0E2816] border-emerald-100 dark:border-emerald-800/60 hover:border-emerald-300 dark:hover:border-emerald-600/60 shadow-xs hover:shadow-md'
                }`}
              >
                {/* Flavor mini aura */}
                <div
                  className="absolute top-2 w-20 h-20 rounded-full blur-xl opacity-20 pointer-events-none"
                  style={{ backgroundColor: prod.canAuraColor }}
                />

                {/* Top Badge */}
                <div className="w-full flex items-center justify-between gap-1 mb-1 z-10">
                  <span
                    className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full text-white shadow-xs"
                    style={{ backgroundColor: prod.dominantColor }}
                  >
                    {prod.badge}
                  </span>
                </div>

                {/* Can Mini Image */}
                <div className="relative py-2 flex items-center justify-center w-full h-32 sm:h-36">
                  <img
                    src={canImages[prod.id] || prod.imageSrc}
                    alt={prod.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain filter drop-shadow-[0_8px_12px_rgba(0,40,15,0.18)] transition-transform duration-300 hover:scale-105"
                  />
                </div>

                {/* Name & Calories */}
                <div className="w-full text-center mt-1 z-10">
                  <span className="block text-xs sm:text-sm font-black text-[#05421A] dark:text-[#E8F8EC] truncate">
                    {prod.name}
                  </span>
                  <span className="text-[10px] text-[#008B3E] dark:text-[#7ED957] font-bold block truncate">
                    {prod.calories}
                  </span>
                </div>

                {/* Active Indicator Arrow pointing to showcase */}
                {isSelected && (
                  <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-[#0F2D18] border-b-2 border-r-2 border-[#008B3E] rotate-45 z-20" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. THE MAIN SHOWCASE & NUTRITION CONTAINER (Desplegado continuo hacia abajo) */}
      <div className="relative bg-white dark:bg-[#08190D] rounded-3xl p-6 sm:p-8 lg:p-10 border-2 border-emerald-100 dark:border-emerald-800/50 shadow-xl overflow-hidden">
        {/* Top colored accent line with smooth color transition */}
        <div
          className="absolute top-0 left-0 right-0 h-2.5 transition-colors duration-500 ease-out"
          style={{ backgroundColor: activeProduct.dominantColor }}
        />

        {/* Showcase Header: Navigation Controls & Flavor Name */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-emerald-100 dark:border-emerald-800/50">
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#05421A] dark:text-[#E8F8EC] tracking-tight">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={activeProduct.id}
                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -3 }}
                    transition={{ duration: 0.18 }}
                    className="inline-block"
                  >
                    {activeProduct.name}
                  </motion.span>
                </AnimatePresence>
              </h3>
              <span
                className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full text-white shadow-xs transition-colors duration-300"
                style={{ backgroundColor: activeProduct.dominantColor }}
              >
                {activeProduct.badge}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-[#008B3E] dark:text-[#50E528] mt-1 transition-opacity duration-300">
              {activeProduct.tagline}
            </p>
          </div>

          {/* Carousel Navigation Arrows */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center gap-1 bg-emerald-50 dark:bg-[#0C2413] p-1 rounded-full border border-emerald-200 dark:border-emerald-700/50">
              <button
                type="button"
                onClick={handlePrev}
                className="p-2 rounded-full hover:bg-white dark:hover:bg-emerald-900/50 text-emerald-900 dark:text-emerald-200 shadow-xs transition-colors cursor-pointer"
                aria-label="Sabor anterior"
                title="Sabor anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-black px-2.5 text-emerald-950 dark:text-emerald-100">
                {currentIndex + 1} / {PRODUCT_LIST.length}
              </span>
              <button
                type="button"
                onClick={handleNext}
                className="p-2 rounded-full hover:bg-white dark:hover:bg-emerald-900/50 text-emerald-900 dark:text-emerald-200 shadow-xs transition-colors cursor-pointer"
                aria-label="Siguiente sabor"
                title="Siguiente sabor"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Description Block */}
        <div className="py-5 border-b border-emerald-100 dark:border-emerald-800/50 min-h-[72px] flex items-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={activeProduct.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="text-base sm:text-lg text-emerald-950 dark:text-emerald-100 font-medium leading-relaxed"
            >
              {activeProduct.description}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Content Grid: Left (Large Product Can + Highlight Stats) / Right (Nutrition Table & Ingredients) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 items-start">
          {/* Left Column: Product Can & Highlights */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative py-4 flex flex-col items-center justify-center w-full min-h-[260px]">
              <div className="relative w-44 h-64 sm:w-48 sm:h-72 flex items-center justify-center filter drop-shadow-[0_16px_22px_rgba(0,40,15,0.22)]">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeProduct.id}
                    src={canImages[activeProduct.id] || activeProduct.imageSrc}
                    alt={`Lata ${activeProduct.name}`}
                    referrerPolicy="no-referrer"
                    initial={{ opacity: 0, scale: 0.94, y: 6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.94, y: -6 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                    className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                  />
                </AnimatePresence>
              </div>
            </div>

            {/* Calories & Serving Highlights */}
            <div className="grid grid-cols-2 gap-3 w-full mt-4">
              <div className="bg-emerald-50/80 dark:bg-[#0C2413] border border-emerald-200/80 dark:border-emerald-700/50 rounded-2xl p-4 flex flex-col justify-center">
                <span className="text-[11px] uppercase font-extrabold tracking-wider text-emerald-800 dark:text-emerald-300">
                  Calorías
                </span>
                <div className="text-3xl sm:text-4xl font-black text-[#05421A] dark:text-[#E8F8EC] mt-0.5 overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={activeProduct.id + '-cal'}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.18 }}
                      className="inline-block"
                    >
                      {activeProduct.caloriesNumber ?? activeProduct.calories.split(' ')[0]}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>

              <div className="bg-emerald-50/80 dark:bg-[#0C2413] border border-emerald-200/80 dark:border-emerald-700/50 rounded-2xl p-4 flex flex-col justify-center">
                <span className="text-[11px] uppercase font-extrabold tracking-wider text-emerald-800 dark:text-emerald-300">
                  Para porción
                </span>
                <div className="text-sm sm:text-base font-black text-[#008B3E] dark:text-[#50E528] mt-0.5">
                  {activeProduct.servingSize || '12.00 fl oz (355 ml)'}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Nutrition Table & Ingredients */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            {/* Nutrition Facts Table: Permanent structure with continuous in-place value updates */}
            <div className="bg-white dark:bg-[#0B2011] border border-emerald-200/80 dark:border-emerald-700/50 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b-2 border-emerald-900 dark:border-emerald-500">
                <span className="text-sm font-black uppercase tracking-wider text-emerald-950 dark:text-emerald-100">
                  Nutrición Por
                </span>
                <span className="text-sm font-black uppercase tracking-wider text-emerald-950 dark:text-emerald-100">
                  % VD
                </span>
              </div>

              <div className="divide-y divide-emerald-100 dark:divide-emerald-800/50">
                {(
                  activeProduct.nutritionRows || [
                    { label: 'Grasa Total (Total Fat)', amount: '0 g', percentDailyValue: '0%' },
                    { label: 'Sodio (Sodium)', amount: '40 mg', percentDailyValue: '2%' },
                    { label: 'Carbohidratos Totales (Total Carbohydrates)', amount: '39 g', percentDailyValue: '14%' },
                    { label: 'Azúcares (Sugar)', amount: '38 g', percentDailyValue: '' },
                    { label: 'Proteínas (Protein)', amount: '0 g', percentDailyValue: '0%' },
                  ]
                ).map((row, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-2.5 text-sm"
                  >
                    <span className="font-semibold text-emerald-950 dark:text-emerald-100 flex items-center">
                      <span>{row.label}</span>
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={`${activeProduct.id}-${idx}-amt`}
                          initial={{ opacity: 0, y: 3 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -3 }}
                          transition={{ duration: 0.18 }}
                          className="font-bold text-[#008B3E] dark:text-[#50E528] ml-1.5 inline-block"
                        >
                          {row.amount}
                        </motion.span>
                      </AnimatePresence>
                    </span>
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={`${activeProduct.id}-${idx}-vd`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        className="font-black text-emerald-900 dark:text-emerald-200 min-w-[32px] text-right inline-block"
                      >
                        {row.percentDailyValue || '—'}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              {/* Footnote */}
              <p className="text-xs text-emerald-800/80 dark:text-emerald-300/80 font-medium italic pt-3 mt-1 border-t border-emerald-100 dark:border-emerald-800/50">
                {activeProduct.nutritionNote ||
                  '*Los porcentajes de Valores Diarios (%VD) están basados en una dieta de 2,000 calorías.'}
              </p>
            </div>

            {/* Ingredients Block: Permanent card container, smooth text transition */}
            <div className="bg-emerald-50/50 dark:bg-[#0B2011] border border-emerald-200/70 dark:border-emerald-700/50 rounded-2xl p-5">
              <h4 className="text-xs font-black uppercase tracking-wider text-emerald-900 dark:text-emerald-200 mb-2 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-emerald-700 dark:text-[#50E528]" />
                <span>Ingredientes</span>
              </h4>
              <div className="min-h-[52px]">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={activeProduct.id + '-ing'}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-xs font-mono font-medium text-emerald-950/85 dark:text-emerald-200/85 leading-relaxed tracking-tight"
                  >
                    {activeProduct.ingredientsText}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
