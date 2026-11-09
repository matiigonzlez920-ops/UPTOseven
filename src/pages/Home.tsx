import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Clock, CheckCircle2, MapPin, Package } from 'lucide-react';
import { PageId, ProductVarietyId } from '../types';
import { CommercialSpotHero } from '../components/CommercialSpotHero';
import { FreshnessGifBanner } from '../components/FreshnessGifBanner';
import { InteractiveCan } from '../components/InteractiveCan';
import { InteractiveCanBar } from '../components/InteractiveCanBar';
import { HomeGameTeaser } from '../components/HomeGameTeaser';
import { PRODUCT_VARIETIES } from '../data/products';
import { sound } from '../utils/audio';

interface HomeProps {
  onNavigate: (page: PageId) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const [selectedVarietyId, setSelectedVarietyId] = useState<ProductVarietyId>('original');

  const activeVariety = PRODUCT_VARIETIES[selectedVarietyId] || PRODUCT_VARIETIES.original;

  const handleNav = (page: PageId) => {
    sound.playClick();
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full flex flex-col pb-16 overflow-hidden">
      {/* ===================================================
          0. SPOT PUBLICITARIO EN VIDEO (Opening Commercial)
          =================================================== */}
      <CommercialSpotHero
        onExploreClick={() => {
          document.getElementById('hero-section')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* ===================================================
          1. HERO SECTION (Wide screen editorial layout)
          =================================================== */}
      <section id="hero-section" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-24">
        {/* Dynamic backdrop wash matching selected variety */}
        <div
          className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[650px] rounded-full blur-3xl -z-20 opacity-35 transition-all duration-700 pointer-events-none"
          style={{ backgroundColor: activeVariety.secondaryColor }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left Column: Typography & CTAs */}
          <div className="lg:col-span-6 flex flex-col items-start gap-6 sm:gap-8 text-left">
            {/* Giant Punchy Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-[#01592A] dark:text-[#F1F6D5] tracking-[0.02em] font-['Fira_Sans',sans-serif]"
              style={{ fontFamily: "'Fira Sans', sans-serif", letterSpacing: '0.02em', lineHeight: '91.88px' }}
            >
              SIENTE EL FRESCOR
              <br />
              <span className="text-[#01592A] dark:text-[#029F3D] relative inline-block">
                QUE TE DESPIERTA.
                <span className="absolute -bottom-1.5 left-0 w-full h-3 sm:h-4 bg-[#A4D902]/50 dark:bg-[#A4D902]/30 rounded-full -z-10" />
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-[18px] text-emerald-950/80 dark:text-emerald-200/80 max-w-xl leading-relaxed font-normal"
              style={{ fontSize: '18px' }}
            >
              El balance natural entre limón jugoso y lima electrizante con burbujas finas que revitalizan tu día desde el primer sorbo. ¡Tocá la lata para escuchar el auténtico destape con sonido!
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <button
                type="button"
                id="hero-cta-history"
                onClick={() => handleNav('historia')}
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full font-bold text-base sm:text-lg text-[#01592A] dark:text-[#F1F6D5] bg-white dark:bg-[#0D2614] hover:bg-emerald-50 dark:hover:bg-[#16381F] border-2 border-emerald-200/90 dark:border-emerald-700/60 shadow-sm hover:shadow-md transition-all hover:scale-105 active:scale-95"
              >
                <Clock className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                <span>CONOCER LA HISTORIA</span>
              </button>
            </motion.div>

            {/* Quality check badges */}
            <div className="flex items-center flex-nowrap gap-3.5 sm:gap-5 pt-1 text-xs sm:text-sm font-normal text-emerald-950/75 dark:text-emerald-300/80 whitespace-nowrap overflow-x-auto no-scrollbar">
              <span className="flex items-center gap-1.5 shrink-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                Aromas 100% Naturales
              </span>
              <span className="flex items-center gap-1.5 shrink-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                Sin Cafeína
              </span>
              <span className="flex items-center gap-1.5 shrink-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                Sonido de destape interactivo
              </span>
            </div>
          </div>

          {/* Right Column: Interactive 7UP Can Hero with Sound */}
          <div className="lg:col-span-6 flex justify-center items-center">
            <InteractiveCan
              selectedVarietyId={selectedVarietyId}
              onSelectVariety={setSelectedVarietyId}
              showSelector={true}
            />
          </div>
        </div>
      </section>

      {/* ===================================================
          BANNER GIF INTERMEDIO (Fondo verde y animación)
          =================================================== */}
      <FreshnessGifBanner />

      {/* ===================================================
          2. SECCIÓN INTERACTIVA DE 4 LATAS CON SONIDO
          =================================================== */}
      <InteractiveCanBar
        onSelectProduct={setSelectedVarietyId}
        selectedId={selectedVarietyId}
      />

      {/* ===================================================
          CÁPSULA 7UP STREETWEAR & DISPENSERS EN ROSARIO
          =================================================== */}
      <section id="capsula-home-highlight" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-linear-to-r from-white dark:from-[#01592A] via-white dark:via-[#01592A] to-[#F1F6D5] dark:to-[#01592A] rounded-3xl p-6 sm:p-10 border-2 border-[#A4D902]/50 shadow-2xl text-[#01592A] dark:text-white relative overflow-hidden">
          {/* Ambient light */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#A4D902]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#A4D902] text-[#01592A] text-xs font-black uppercase tracking-wider mb-3">
                <MapPin className="w-3.5 h-3.5" />
                <span>EXCLUSIVO ROSARIO, SANTA FE • DISPENSER DE GASEOSA</span>
              </div>
              <h3 className="text-3xl sm:text-5xl font-black tracking-tight uppercase leading-tight text-[#01592A] dark:text-white">
                CONSEGUÍ TU CÁPSULA 7UP
              </h3>
              <p className="text-[#01592A]/80 dark:text-emerald-100 text-sm sm:text-base font-medium mt-2 max-w-xl leading-relaxed">
                La cápsula es literalmente un cilindro con indumentaria oficial (remeras oversize, buzos, gorras) y merch vintage que sale directamente de una máquina expendedora de gaseosa instalada en puntos clave de la ciudad de Rosario.
              </p>


              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  id="home-capsula-cta-btn"
                  onClick={() => handleNav('productos')}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-black text-sm text-[#01592A] bg-[#A4D902] hover:bg-[#A4D902] shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
                >
                  <Package className="w-4 h-4 text-[#01592A]" />
                  <span>VER PUNTOS Y SIMULAR DISPENSER</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right: Expendedora 7UP visual */}
            <div className="lg:col-span-5 flex justify-center items-center">
              <div className="w-full flex items-center justify-center p-0">
                <img
                  src="/Expendedora.png"
                  alt="Expendedora 7UP Rosario"
                  className="w-full max-w-xs sm:max-w-sm lg:max-w-md max-h-[380px] sm:max-h-[440px] object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          3. APARTADO PEQUEÑO: DESCARGAR EL JUEGO
          =================================================== */}
      <HomeGameTeaser onNavigate={handleNav} />

      {/* ===================================================
          4. CIERRE HOME (Generational Brand Statement)
          =================================================== */}
      <section id="closing-home-section" className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-1.5 rounded-full bg-[#F2081B]" />
          <h3 className="text-2xl sm:text-3xl font-black text-[#01592A] dark:text-[#F1F6D5] tracking-tight">
            Las épocas cambian. La frescura permanece.
          </h3>
          <p className="text-sm text-emerald-950/70 dark:text-emerald-200/70 max-w-lg leading-relaxed">
            Desde 1929, acompañando reuniones, comidas familiares, tardes con amigos y momentos únicos con el auténtico golpe cítrico de limón y lima.
          </p>
        </div>
      </section>
    </div>
  );
};
