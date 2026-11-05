import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  MapPin,
  Package,
  ArrowRight,
  Flame,
  Maximize2,
  Box,
  RotateCw,
  Zap,
  Layers,
  Check
} from 'lucide-react';
import { CAPSULA_MERCH_ITEMS, CapsulaMerchItem } from '../data/capsulaSpots';
import { sound } from '../utils/audio';

interface CapsulaHeroDispenserProps {
  onScrollToSimulator?: () => void;
  onScrollToMap?: () => void;
}

export const CapsulaHeroDispenser: React.FC<CapsulaHeroDispenserProps> = ({
  onScrollToSimulator,
  onScrollToMap,
}) => {
  const [activeItemIndex, setActiveItemIndex] = useState<number>(0); // Default to Hoodie
  const [view3D, setView3D] = useState<'isometric' | 'front'>('isometric');
  const [neonActive, setNeonActive] = useState<boolean>(true);
  const [dispenseAnim, setDispenseAnim] = useState<boolean>(false);
  const [mouseTilt, setMouseTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const activeItem = CAPSULA_MERCH_ITEMS[activeItemIndex] || CAPSULA_MERCH_ITEMS[0];

  const handleSelectSlot = (index: number) => {
    sound.playClick();
    setActiveItemIndex(index);
  };

  const handleTriggerVend = () => {
    sound.playDispenserVend();
    setDispenseAnim(true);
    setTimeout(() => {
      setDispenseAnim(false);
    }, 1200);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xPos = (e.clientX - rect.left) / rect.width - 0.5;
    const yPos = (e.clientY - rect.top) / rect.height - 0.5;
    // Gentle tilt range: ±8 degrees
    setMouseTilt({ x: -(yPos * 8), y: xPos * 12 });
  };

  const handleMouseLeave = () => {
    setMouseTilt({ x: 0, y: 0 });
  };

  const handleSimulateVend = () => {
    sound.playDispenserVend();
    if (onScrollToSimulator) {
      onScrollToSimulator();
    } else {
      const el = document.getElementById('soda-dispenser-simulator');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExploreMap = () => {
    sound.playClick();
    if (onScrollToMap) {
      onScrollToMap();
    } else {
      const el = document.getElementById('rosario-spots-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Base 3D rotation angles
  const baseRotateY = view3D === 'isometric' ? -14 : 0;
  const baseRotateX = view3D === 'isometric' ? 6 : 0;
  const totalRotateX = baseRotateX + mouseTilt.x;
  const totalRotateY = baseRotateY + mouseTilt.y;

  return (
    <div className="w-full relative overflow-hidden rounded-3xl bg-linear-to-br from-[#002f12] via-[#00421a] to-[#011a09] border-3 border-[#7ED957]/50 shadow-2xl p-5 sm:p-8 lg:p-10 text-white">
      {/* Ambient background glow & bubbles */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FFE600]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-[#7ED957]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-10 -left-10 w-60 h-60 bg-[#008B3E]/30 rounded-full blur-2xl pointer-events-none" />

      {/* Top Banner Tag */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-6 pb-5 border-b border-white/15">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#E51E2B] text-white text-[11px] font-black uppercase tracking-widest shadow-md animate-pulse">
            <Flame className="w-3.5 h-3.5 fill-current" />
            DROP EXCLUSIVO EN LA CALLE
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[#FFE600] text-[11px] font-mono font-black uppercase">
            <MapPin className="w-3 h-3 text-[#7ED957]" />
            5 DISPENSERS • ROSARIO
          </span>
        </div>

        {/* 3D Mode & Neon Toggles */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setView3D((prev) => (prev === 'isometric' ? 'front' : 'isometric'));
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-black/40 hover:bg-black/60 border border-white/20 text-xs font-mono font-bold text-white transition-all cursor-pointer"
            title="Cambiar perspectiva del mockup 3D"
          >
            <Box className="w-3.5 h-3.5 text-[#FFE600]" />
            <span>{view3D === 'isometric' ? 'Vista Isométrica 3D' : 'Vista Frontal 3D'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setNeonActive((prev) => !prev);
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
              neonActive
                ? 'bg-[#7ED957]/20 border-[#7ED957] text-[#7ED957] shadow-[0_0_12px_rgba(126,217,87,0.4)]'
                : 'bg-black/40 border-white/20 text-neutral-400'
            }`}
            title="Encender/apagar luces neón"
          >
            <Zap className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Neón</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Hero Showcase */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Side: Editorial Typography & Value Proposition */}
        <div className="lg:col-span-6 flex flex-col text-left">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-black tracking-widest text-[#7ED957] uppercase mb-2">
            <Sparkles className="w-4 h-4 text-[#FFE600]" />
            CÁPSULA OFICIAL 7UP STREETWEAR 2026
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight uppercase leading-[0.95] text-white">
            ROPA DE 7UP <br />
            <span className="text-[#FFE600]">EN DISPENSER</span> <br />
            DE GASEOSA
          </h1>

          <p className="text-emerald-100/90 text-sm sm:text-base mt-4 font-normal leading-relaxed max-w-xl">
            Llevamos la experiencia del clásico dispenser de latas al mundo del streetwear. Las máquinas expendedoras vintage de 7UP distribuidas por Rosario no entregan gaseosa: <strong className="text-white">expenden cápsulas cilíndricas herméticas cargadas con prendas oficiales de edición limitada</strong>.
          </p>

          {/* Quick interactive feature badges */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 my-6">
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex flex-col">
              <span className="text-[10px] font-mono text-[#7ED957] font-bold uppercase">Formato</span>
              <span className="text-xs sm:text-sm font-black text-white mt-0.5">Cápsula Fría</span>
              <span className="text-[10px] text-emerald-200/80 mt-0.5">Tubo cilíndrico sellado</span>
            </div>

            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex flex-col">
              <span className="text-[10px] font-mono text-[#FFE600] font-bold uppercase">Prendas</span>
              <span className="text-xs sm:text-sm font-black text-white mt-0.5">Hoodies & Tees</span>
              <span className="text-[10px] text-emerald-200/80 mt-0.5">Algodón pesado 100%</span>
            </div>

            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex flex-col">
              <span className="text-[10px] font-mono text-[#7ED957] font-bold uppercase">Ubicación</span>
              <span className="text-xs sm:text-sm font-black text-white mt-0.5">Rosario (SF)</span>
              <span className="text-[10px] text-emerald-200/80 mt-0.5">5 Máquinas activas</span>
            </div>
          </div>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              id="hero-try-simulator-btn"
              onClick={handleSimulateVend}
              className="px-6 py-3.5 rounded-2xl bg-[#FFE600] hover:bg-yellow-300 text-[#00471C] font-black text-xs sm:text-sm uppercase tracking-wider shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <Package className="w-4 h-4" />
              <span>Simular Dispensado</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              id="hero-see-map-btn"
              onClick={handleExploreMap}
              className="px-5 py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-black text-xs sm:text-sm uppercase tracking-wider border border-white/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-[#7ED957]" />
              <span>Ver Mapa en Rosario</span>
            </button>
          </div>
        </div>

        {/* Right Side: 3D ISOMETRIC MOCKUP OF THE 7UP CUSTOM VENDING DISPENSER */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="lg:col-span-6 flex flex-col items-center justify-center py-4 relative select-none"
          style={{ perspective: '1400px' }}
        >
          {/* Floor Contact Shadow (Reacts with 3D angles) */}
          <div
            className="w-72 sm:w-96 h-12 bg-black/75 rounded-full blur-2xl absolute -bottom-4 z-0 pointer-events-none transition-transform duration-300"
            style={{
              transform: `translate(${totalRotateY * 1.5}px, 20px) scale(${view3D === 'isometric' ? '1.05, 0.65' : '0.95, 0.5'})`,
            }}
          />

          {/* 3D Main Assembly Container */}
          <div
            className="relative transition-transform duration-200 ease-out z-10"
            style={{
              transformStyle: 'preserve-3d',
              transform: `rotateX(${totalRotateX}deg) rotateY(${totalRotateY}deg)`,
            }}
          >
            {/* 3D Extruded Right Side Wall (Creates physical machine depth) */}
            {view3D === 'isometric' && (
              <div
                className="absolute top-0 right-0 w-24 h-full bg-linear-to-b from-[#003816] via-[#01220c] to-[#001407] rounded-r-3xl border-y-4 border-r-4 border-[#01471b] shadow-2xl overflow-hidden flex flex-col justify-between py-8 px-2 z-0 pointer-events-none"
                style={{
                  transformOrigin: 'right center',
                  transform: 'rotateY(90deg) translateZ(-2px)',
                }}
              >
                {/* 3D Side Brand Typography */}
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-[#E51E2B] text-white font-black text-2xl flex items-center justify-center border-2 border-white shadow-lg mb-2">
                    7
                  </div>
                  <span className="text-[12px] font-black tracking-widest text-[#7ED957] uppercase [writing-mode:vertical-rl] rotate-180">
                    7UP VENDING TECH
                  </span>
                </div>

                {/* Industrial Ventilation Slits */}
                <div className="flex flex-col gap-1.5 w-full px-1">
                  {[...Array(7)].map((_, i) => (
                    <div key={i} className="h-1 bg-black/60 rounded-full border-b border-white/10" />
                  ))}
                </div>

                {/* Power Specs & Model Code */}
                <div className="text-[8px] font-mono text-emerald-300/60 leading-tight">
                  MOD: 7UP-ROS-2026<br />
                  220V • 50HZ • R290
                </div>
              </div>
            )}

            {/* FRONT CABINET (7UP Emerald Green Metallic Shell) */}
            <div
              className={`w-[320px] sm:w-[390px] bg-linear-to-b from-[#02441c] via-[#012d12] to-[#001909] rounded-3xl p-4 sm:p-5 border-4 ${
                neonActive ? 'border-[#7ED957]' : 'border-[#008B3E]'
              } shadow-[0_25px_60px_rgba(0,0,0,0.85)] relative overflow-hidden transition-all duration-300`}
            >
              {/* Top Chrome Bevel Highlight */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-linear-to-r from-transparent via-white/50 to-transparent pointer-events-none" />

              {/* 1. TOP ILLUMINATED 3D MARQUEE CANOPY */}
              <div
                className={`rounded-2xl p-3 border-2 shadow-lg flex items-center justify-between relative overflow-hidden mb-3.5 transition-all duration-300 ${
                  neonActive
                    ? 'bg-linear-to-r from-[#008B3E] via-[#00A84B] to-[#008B3E] border-[#FFE600] shadow-[0_0_25px_rgba(126,217,87,0.5)]'
                    : 'bg-linear-to-r from-[#005726] via-[#006f31] to-[#005726] border-white/30'
                }`}
              >
                {/* Glossy light streak */}
                <div className="absolute -top-6 -left-12 w-52 h-20 bg-white/30 rotate-25 blur-xs pointer-events-none" />

                <div className="flex items-center gap-2.5 z-10">
                  {/* 3D 7UP Badge */}
                  <div className="w-10 h-10 rounded-full bg-[#E51E2B] text-white font-black text-xl flex items-center justify-center border-2 border-white shadow-xl ring-2 ring-red-400/40">
                    7
                  </div>
                  <div>
                    <div className="text-sm sm:text-base font-black tracking-wider text-white leading-none uppercase drop-shadow-md">
                      7UP DISPENSER
                    </div>
                    <div className="text-[10px] font-mono font-black text-[#FFE600] tracking-widest uppercase mt-0.5">
                      CÁPSULAS STREETWEAR
                    </div>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="bg-black/55 px-2.5 py-1 rounded-xl border border-white/20 text-right z-10">
                  <span className="text-[8px] font-mono text-emerald-300 block uppercase font-bold">TEMPERATURA</span>
                  <span className="text-[11px] font-mono font-black text-[#7ED957] flex items-center gap-1 justify-end">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7ED957] animate-ping" />
                    4°C READY
                  </span>
                </div>
              </div>

              {/* 2. CHILLED REFRIGERATED GLASS SHOWCASE WITH CYLINDRICAL APPAREL CAPSULES */}
              <div className="relative rounded-2xl bg-linear-to-b from-[#02180a] via-[#001006] to-black border-2 border-white/35 p-3.5 shadow-inner overflow-hidden">
                {/* 3D Glass Surface Reflections & Gradients */}
                <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/8 to-white/20 pointer-events-none z-20" />
                <div className="absolute top-0 right-0 w-32 h-full bg-linear-to-l from-white/10 to-transparent pointer-events-none z-20" />

                {/* Shelf Rack Header & Tag */}
                <div className="flex items-center justify-between mb-2 z-30 relative">
                  <span className="px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md border border-white/20 text-[9px] font-mono font-bold text-[#7ED957] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7ED957] animate-ping" />
                    VITRINA CÁPSULAS 7UP
                  </span>
                  <span className="text-[9px] font-black uppercase text-[#FFE600] bg-black/80 px-2 py-0.5 rounded-md border border-white/20">
                    SELECCIONÁ UN SLOT
                  </span>
                </div>

                {/* Grid of 4 Transparent Cylindrical Capsules inside helical metal coils */}
                <div className="grid grid-cols-2 gap-2.5 relative z-10">
                  {CAPSULA_MERCH_ITEMS.slice(0, 4).map((item, idx) => {
                    const isSelected = activeItemIndex === idx;
                    const slotCodes = ['A-1', 'A-2', 'B-1', 'B-2'];

                    return (
                      <div
                        key={item.id}
                        onClick={() => handleSelectSlot(idx)}
                        className={`relative rounded-2xl p-2.5 border-2 transition-all cursor-pointer flex flex-col items-center justify-between text-center overflow-hidden ${
                          isSelected
                            ? 'bg-[#008B3E]/45 border-[#FFE600] ring-2 ring-[#FFE600]/60 shadow-[0_0_20px_rgba(255,230,0,0.35)] scale-[1.03]'
                            : 'bg-white/5 border-white/20 hover:border-white/50 hover:bg-white/10'
                        }`}
                      >
                        {/* Helical Spiral Coil graphic behind capsule */}
                        <div className="absolute -top-2 inset-x-4 h-6 border-b-2 border-neutral-400/30 rounded-full pointer-events-none" />

                        {/* Top Code & Price Tag */}
                        <div className="w-full flex items-center justify-between text-[10px] font-mono font-black mb-1">
                          <span
                            className={`px-1.5 py-0.5 rounded-md ${
                              isSelected
                                ? 'bg-[#FFE600] text-[#00471C] font-extrabold shadow-xs'
                                : 'bg-white/20 text-white'
                            }`}
                          >
                            {slotCodes[idx]}
                          </span>
                          <span className="text-[#7ED957] text-[9px] font-bold">
                            {item.badge}
                          </span>
                        </div>

                        {/* 3D Cylindrical Capsule Container with garment inside */}
                        <div className="relative w-22 h-24 sm:w-26 sm:h-28 my-1 rounded-2xl p-1 bg-linear-to-b from-white/20 via-transparent to-white/10 border-2 border-white/40 shadow-xl overflow-hidden group">
                          {/* Capsule Acrylic Specular Highlights (Tubular 3D look) */}
                          <div className="absolute top-0 left-2 w-2 h-full bg-white/40 rounded-full blur-[1px] pointer-events-none z-10" />
                          <div className="absolute top-0 right-2 w-1.5 h-full bg-white/20 rounded-full blur-[1px] pointer-events-none z-10" />

                          {/* Top & Bottom Capsule Metal Caps */}
                          <div className="absolute top-0 inset-x-0 h-2 bg-linear-to-r from-neutral-400 via-white to-neutral-500 rounded-t-xl z-10" />
                          <div className="absolute bottom-0 inset-x-0 h-2.5 bg-linear-to-r from-[#006828] via-[#7ED957] to-[#00471C] rounded-b-xl z-10 flex items-center justify-center">
                            <span className="text-[7px] font-black text-black leading-none">7UP</span>
                          </div>

                          {/* Garment Image inside capsule */}
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform duration-300"
                          />

                          {/* 7UP Brand Seal on the glass */}
                          <div className="absolute bottom-3 right-1 w-5 h-5 rounded-full bg-[#E51E2B] text-white text-[10px] font-black flex items-center justify-center border-2 border-white shadow-md z-10">
                            7
                          </div>
                        </div>

                        {/* Merch Name */}
                        <div className="w-full mt-1">
                          <div className="text-[11px] font-black text-white truncate">
                            {item.name}
                          </div>
                          <div className="text-[9px] text-emerald-200/90 truncate font-mono">
                            {item.tagline.split('•')[0]}
                          </div>
                        </div>

                        {/* Push Button Selection */}
                        <div
                          className={`w-full mt-1.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-colors ${
                            isSelected
                              ? 'bg-[#FFE600] text-[#00471C] shadow-md'
                              : 'bg-white/10 text-neutral-300'
                          }`}
                        >
                          {isSelected ? 'SELECCIONADO' : 'ELEGIR'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 3. VENDING INTERFACE CONSOLE (Keypad, LED Display & Coin Return) */}
              <div className="my-3 p-3 rounded-2xl bg-linear-to-r from-[#011a0a] via-[#022810] to-[#011a0a] border-2 border-white/20 flex items-center justify-between shadow-md">
                {/* Glowing LED Dot-Matrix Display */}
                <div className="flex items-center gap-2.5">
                  <div className="px-3 py-1.5 rounded-xl bg-black border border-emerald-500/40 text-left font-mono">
                    <div className="text-[8px] text-emerald-400 uppercase tracking-wider leading-none">
                      DISPLAY DISPENSER
                    </div>
                    <div className="text-xs sm:text-sm font-black text-[#FFE600] tracking-widest animate-pulse leading-tight">
                      [SLOT {activeItemIndex + 1}] • {activeItem.name.slice(0, 14)}
                    </div>
                  </div>
                </div>

                {/* Chrome Mechanical Buttons (1, 2, 3, EJECT) */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleTriggerVend}
                    className="px-3 py-2 rounded-xl bg-linear-to-b from-[#FFE600] to-[#d4b900] text-[#00471C] font-black text-[11px] uppercase tracking-wider shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center gap-1"
                    title="Apretar botón para dispensar cápsula"
                  >
                    <Package className="w-3.5 h-3.5" />
                    <span>VEND</span>
                  </button>
                </div>
              </div>

              {/* 4. HEAVY-DUTY LOWER CHUTE (Compuerta de salida de cápsula) */}
              <div className="relative rounded-2xl bg-linear-to-b from-[#011c0b] to-[#000d05] p-3 border-2 border-white/25 shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between mb-1.5 px-1">
                  <span className="text-[9px] font-mono font-black text-neutral-400 uppercase tracking-widest">
                    COMPUERTA DE RETIRO • EMPUJAR
                  </span>
                  <span className="text-[9px] font-mono font-black text-[#7ED957]">
                    SALIDA CÁPSULA FRÍA
                  </span>
                </div>

                {/* Interactive Flap with Dispensed 7UP Garment Capsule */}
                <div
                  onClick={handleTriggerVend}
                  className={`relative h-20 sm:h-22 bg-neutral-950 rounded-xl border-2 transition-all p-3 flex items-center justify-between cursor-pointer group overflow-hidden ${
                    dispenseAnim
                      ? 'border-[#FFE600] ring-4 ring-[#FFE600]/40 scale-[0.98]'
                      : 'border-neutral-700 hover:border-[#7ED957]'
                  }`}
                >
                  {/* Caution Stripes Flap Frame */}
                  <div className="absolute top-0 inset-x-0 h-1.5 bg-[repeating-linear-gradient(45deg,#000,#000_8px,#FFE600_8px,#FFE600_16px)] opacity-60" />

                  {/* Cold Mist Smoke Effect */}
                  <div className="absolute inset-0 bg-linear-to-r from-emerald-500/15 via-white/15 to-emerald-500/15 animate-pulse pointer-events-none" />

                  {/* Dispensed Item Visual */}
                  <div className="flex items-center gap-3 z-10">
                    <div
                      className={`relative w-14 h-14 rounded-2xl bg-linear-to-b from-white/30 to-[#008B3E]/40 border-2 border-white shadow-xl flex items-center justify-center overflow-hidden shrink-0 transition-transform ${
                        dispenseAnim ? 'scale-125 rotate-6' : 'group-hover:scale-105'
                      }`}
                    >
                      <img
                        src={activeItem.image}
                        alt={activeItem.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-emerald-900/20" />
                      <span className="absolute bottom-1 px-1.5 py-0.2 rounded-full bg-[#E51E2B] text-white text-[8px] font-black">
                        7UP
                      </span>
                    </div>

                    <div className="text-left">
                      <div className="text-xs font-black text-white group-hover:text-[#FFE600] transition-colors flex items-center gap-1.5">
                        <span>{activeItem.name}</span>
                        {dispenseAnim && (
                          <span className="text-[10px] font-mono text-[#7ED957] font-bold">
                            ¡DISPENSADO!
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-emerald-200/90 font-mono mt-0.5">
                        Tubo hermético refrigerado listo para retirar
                      </div>
                    </div>
                  </div>

                  <div className="z-10 px-3 py-1.5 rounded-xl bg-white/10 group-hover:bg-[#FFE600] text-white group-hover:text-[#00471C] text-[10px] font-black uppercase transition-colors shrink-0 shadow-md flex items-center gap-1">
                    <span>{dispenseAnim ? 'LISTO' : 'RETIRE'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
