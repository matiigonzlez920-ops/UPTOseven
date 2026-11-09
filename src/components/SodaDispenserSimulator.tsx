import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  RefreshCw,
  MapPin,
  CheckCircle2,
  Package,
  Layers,
  ArrowRight,
  ExternalLink,
  Info
} from 'lucide-react';
import { CAPSULA_MERCH_ITEMS, ROSARIO_DISPENSER_SPOTS, CapsulaMerchItem, DispenserSpot } from '../data/capsulaSpots';
import { sound } from '../utils/audio';

interface SodaDispenserSimulatorProps {
  onSelectSpot?: (spot: DispenserSpot) => void;
  selectedSpot?: DispenserSpot;
}

export const SodaDispenserSimulator: React.FC<SodaDispenserSimulatorProps> = ({
  onSelectSpot,
  selectedSpot = ROSARIO_DISPENSER_SPOTS[0],
}) => {
  const [isVending, setIsVending] = useState<boolean>(false);
  const [dispensedItem, setDispensedItem] = useState<CapsulaMerchItem | null>(null);
  const [isCapsuleOpen, setIsCapsuleOpen] = useState<boolean>(false);
  const [selectedSize, setSelectedSize] = useState<string>('L');

  const handleDispense = () => {
    if (isVending) return;
    setIsVending(true);
    setDispensedItem(null);
    setIsCapsuleOpen(false);

    // Play tactile physical vending sounds (coin/solenoid + mechanical drop + CO2 hiss + fanfare)
    sound.playDispenserVend();

    // Select an item from the collection
    const randomItem =
      CAPSULA_MERCH_ITEMS[Math.floor(Math.random() * CAPSULA_MERCH_ITEMS.length)];

    setTimeout(() => {
      setDispensedItem(randomItem);
      if (randomItem.sizes && randomItem.sizes.length > 0) {
        setSelectedSize(randomItem.sizes[0]);
      }
      setIsVending(false);
    }, 1200);
  };

  const handleOpenCapsule = () => {
    sound.playCanOpen();
    setIsCapsuleOpen(true);
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-8 select-none">
      <div className="bg-linear-to-b from-[#01592A] via-[#01592A] to-[#01592A] rounded-3xl p-6 sm:p-10 border-4 border-[#A4D902]/60 shadow-2xl text-white relative overflow-hidden">
        {/* Subtle background ambient bubbles */}
        <div className="absolute top-0 right-10 w-96 h-96 bg-[#A4D902]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#A4D902]/15 rounded-full blur-2xl pointer-events-none" />

        {/* Top Header info */}
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-white/20">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#A4D902] text-[#01592A] font-black text-xs uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              DISPENSER DE GASEOSA 7UP • VENDING DE CÁPSULAS
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white uppercase">
              SIMULADOR DE DISPENSADO
            </h2>
            <p className="text-emerald-100 text-sm mt-1 max-w-xl">
              Así funciona la máquina en los puntos de Rosario: pulsás el botón de la expendedora y tu cápsula de ropa & merch cae lista para abrir.
            </p>
          </div>

          {/* Current Spot Indicator */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/25">
            <div className="w-3 h-3 rounded-full bg-[#A4D902] animate-ping" />
            <div className="text-left text-xs">
              <div className="text-emerald-200 uppercase font-bold text-[10px]">Dispenser seleccionado</div>
              <div className="font-extrabold text-white">{selectedSpot.name}</div>
            </div>
          </div>
        </div>

        {/* Main Dispenser Machine Layout */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 items-center">
          {/* Left Column: Physical Soda Dispenser Machine Graphic */}
          <div className="lg:col-span-6 flex flex-col items-center">
            {/* The Vending Machine Cabinet */}
            <div className="w-full max-w-xs sm:max-w-sm bg-[#053b16] rounded-3xl p-5 border-4 border-[#002b0f] shadow-2xl relative flex flex-col">
              {/* Machine Top Brand Header */}
              <div className="bg-[#01592A] rounded-2xl p-3 border-2 border-[#A4D902]/80 text-center shadow-md relative overflow-hidden mb-4">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#F2081B] text-white font-black text-sm flex items-center justify-center border border-white shadow-xs">
                    7
                  </div>
                  <span className="font-black text-lg tracking-widest text-white uppercase">
                    7UP CAPSULE VENDOR
                  </span>
                </div>
                <div className="text-[10px] text-[#A4D902] font-mono tracking-widest mt-0.5">
                  ROSARIO STREET EDITION • MODEL 1982
                </div>
              </div>

              {/* Glass Display Window with glowing capsules inside */}
              <div className="relative h-64 bg-linear-to-b from-[#00220d] via-[#013514] to-[#001f0b] rounded-2xl border-2 border-white/20 p-4 overflow-hidden flex flex-col justify-between shadow-inner">
                {/* Internal fluorescent light effect */}
                <div className="absolute top-1 left-4 right-4 h-1.5 bg-white/80 rounded-full blur-[1px]" />

                {/* Grid of capsules inside the illuminated shelves */}
                <div className="grid grid-cols-3 gap-3 my-auto">
                  {[0, 1, 2, 3, 4, 5].map((idx) => (
                    <motion.div
                      key={idx}
                      animate={
                        isVending && idx === 4
                          ? { y: [0, -10, 40], opacity: [1, 1, 0] }
                          : { y: [0, -2, 0] }
                      }
                      transition={{
                        repeat: isVending ? 0 : Infinity,
                        duration: 2.5 + idx * 0.3,
                        ease: 'easeInOut',
                      }}
                      className="relative flex flex-col items-center justify-center p-2 rounded-xl bg-white/10 border border-white/25 shadow-md backdrop-blur-xs group"
                    >
                      {/* Capsule Shape Visual */}
                      <div className="w-12 h-14 rounded-full border-2 border-[#A4D902] bg-linear-to-b from-white/30 via-emerald-400/20 to-[#01592A]/60 flex items-center justify-center shadow-lg relative overflow-hidden">
                        <div className="absolute top-1 left-2 w-3 h-2 bg-white/60 rounded-full blur-[1px]" />
                        <span className="text-[9px] font-black text-[#A4D902] uppercase tracking-tighter">
                          {idx % 2 === 0 ? 'ROPA' : 'MERCH'}
                        </span>
                      </div>
                      <span className="text-[8px] font-mono text-emerald-200 mt-1">#0{idx + 1}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Digital LED Display Banner */}
                <div className="bg-black/90 rounded-lg py-1.5 px-3 border border-[#A4D902]/50 text-center font-mono text-xs">
                  <span className={isVending ? 'text-[#A4D902] animate-pulse' : 'text-[#A4D902]'}>
                    {isVending
                      ? '>>> DISPENSANDO CÁPSULA... <<<'
                      : dispensedItem
                      ? '★ CÁPSULA ENTREGADA EN BANDEJA ★'
                      : 'PRESIONE BOTÓN PARA DISPENSAR'}
                  </span>
                </div>
              </div>

              {/* Action Button & Coin Mechanism Row */}
              <div className="flex items-center justify-between gap-4 mt-4 px-1">
                {/* Big Push Button */}
                <button
                  type="button"
                  id="dispenser-push-button"
                  onClick={handleDispense}
                  disabled={isVending}
                  className={`flex-1 py-3.5 px-4 rounded-2xl font-black text-sm uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-lg border-2 ${
                    isVending
                      ? 'bg-neutral-600 text-neutral-300 border-neutral-500 cursor-not-allowed'
                      : 'bg-linear-to-b from-[#A4D902] to-[#A4D902] text-[#01592A] border-white hover:brightness-105 active:scale-95 shadow-[#A4D902]/40'
                  }`}
                >
                  <RefreshCw className={`w-4 h-4 ${isVending ? 'animate-spin' : ''}`} />
                  <span>{isVending ? 'DISPENSANDO...' : 'PULSAR DISPENSER'}</span>
                </button>

                {/* Coin Slot Accent */}
                <div className="w-14 h-12 bg-neutral-900 rounded-xl border-2 border-neutral-700 flex flex-col items-center justify-center shrink-0">
                  <div className="w-6 h-1 bg-neutral-400 rounded-full mb-1" />
                  <span className="text-[8px] font-mono text-neutral-400 font-bold">7UP COIN</span>
                </div>
              </div>

              {/* Bottom Pickup Flap / Chute */}
              <div className="mt-4 bg-[#01220a] rounded-2xl p-3 border-2 border-neutral-800 text-center relative overflow-hidden shadow-inner">
                <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest mb-1">
                  BANDEJA DE RETIRO DE CÁPSULA
                </div>
                <div
                  onClick={() => {
                    if (dispensedItem && !isCapsuleOpen) handleOpenCapsule();
                  }}
                  className={`h-16 rounded-xl border-2 border-dashed flex items-center justify-center transition-all ${
                    dispensedItem && !isCapsuleOpen
                      ? 'bg-[#01592A]/40 border-[#A4D902] cursor-pointer hover:bg-[#01592A]/60 animate-pulse'
                      : 'bg-black/40 border-neutral-700 text-neutral-500'
                  }`}
                >
                  {dispensedItem ? (
                    <div className="flex items-center gap-3">
                      {/* Bouncing Capsule inside flap */}
                      <div className="w-10 h-10 rounded-full border-2 border-[#A4D902] bg-linear-to-r from-[#A4D902] to-[#A4D902] shadow-lg flex items-center justify-center animate-bounce">
                        <Package className="w-5 h-5 text-[#01592A]" />
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-black text-white">¡CÁPSULA EN BANDEJA!</div>
                        <div className="text-[10px] text-[#A4D902] underline font-bold">
                          {isCapsuleOpen ? 'Cápsula revelada a la derecha' : 'Hacé clic para destaparla'}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs font-medium text-neutral-400">
                      Bandeja vacía • Presioná el botón arriba
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Capsule Unboxing / Revealed Merch Experience */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            {dispensedItem ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border-2 border-white/30 shadow-xl text-left relative overflow-hidden"
              >
                {/* Rarity & Category Pill */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#A4D902] text-[#01592A] font-black text-xs uppercase tracking-wider">
                      {dispensedItem.category}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white font-mono text-xs font-bold">
                      {dispensedItem.rarity}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-[#A4D902] font-bold">
                    {dispensedItem.badge}
                  </span>
                </div>

                {/* Item Image + Details Card */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  <div className="sm:col-span-5 relative rounded-2xl overflow-hidden aspect-square border-2 border-white/30 shadow-lg bg-black/30 group">
                    <img
                      src={dispensedItem.image}
                      alt={dispensedItem.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-2 left-2 right-2 text-center">
                      <span className="text-[10px] font-mono font-bold text-white bg-black/60 px-2 py-0.5 rounded-full">
                        7UP STREETWEAR
                      </span>
                    </div>
                  </div>

                  <div className="sm:col-span-7 flex flex-col gap-2">
                    <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                      {dispensedItem.name}
                    </h3>
                    <p className="text-xs font-bold text-[#A4D902]">
                      {dispensedItem.tagline}
                    </p>
                    <p className="text-xs text-emerald-100/90 leading-relaxed mt-1">
                      {dispensedItem.description}
                    </p>

                    {/* Sizes Selection if applicable */}
                    {dispensedItem.sizes && (
                      <div className="mt-2">
                        <span className="text-[11px] font-mono text-emerald-200 font-bold block mb-1.5">
                          TALLES DISPONIBLES EN DISPENSER:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {dispensedItem.sizes.map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => {
                                sound.playClick();
                                setSelectedSize(s);
                              }}
                              className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all ${
                                selectedSize === s
                                  ? 'bg-[#A4D902] text-[#01592A] shadow-xs'
                                  : 'bg-white/15 text-white hover:bg-white/25'
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Pickup Ticket Bar */}
                <div className="mt-5 p-3.5 rounded-2xl bg-[#004217] border border-[#A4D902]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-[#A4D902] shrink-0" />
                    <div className="text-xs">
                      <span className="text-emerald-300 font-semibold block text-[10px]">
                        Retiro en Rosario, Santa Fe:
                      </span>
                      <span className="font-bold text-white">{selectedSpot.address}</span>
                    </div>
                  </div>
                  <a
                    href={selectedSpot.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-black uppercase tracking-wider transition-all"
                  >
                    <span>Ver ubicación</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Button to dispense another one */}
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={handleDispense}
                    className="inline-flex items-center gap-2 text-xs font-bold text-emerald-200 hover:text-white underline transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Dispensar otra prenda de la colección</span>
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="bg-white/5 border-2 border-dashed border-white/20 rounded-3xl p-8 sm:p-12 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4 text-[#A4D902]">
                  <Package className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight">
                  Tu cápsula te espera
                </h3>
                <p className="text-sm text-emerald-100/80 max-w-md mt-2 leading-relaxed">
                  Presioná el botón <strong>«PULSAR DISPENSER»</strong> en la máquina para activar el mecanismo de gaseosa y recibir una cápsula al azar de la colección 7UP Streetwear & Merch.
                </p>
                <div className="mt-6 flex items-center gap-2 text-xs font-mono text-[#A4D902] bg-black/30 px-3.5 py-1.5 rounded-full border border-white/10">
                  <span>DISPENSERS ACTIVOS EN 5 PUNTOS DE ROSARIO</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
