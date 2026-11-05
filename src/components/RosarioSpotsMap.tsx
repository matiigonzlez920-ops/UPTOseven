import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  MapPin,
  Clock,
  ExternalLink,
  Sparkles,
  Navigation,
  CheckCircle2,
  AlertCircle,
  Package
} from 'lucide-react';
import { ROSARIO_DISPENSER_SPOTS, DispenserSpot } from '../data/capsulaSpots';
import { sound } from '../utils/audio';

interface RosarioSpotsMapProps {
  selectedSpot: DispenserSpot;
  onSelectSpot: (spot: DispenserSpot) => void;
}

export const RosarioSpotsMap: React.FC<RosarioSpotsMapProps> = ({
  selectedSpot,
  onSelectSpot,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('Todos');

  const handleSpotClick = (spot: DispenserSpot) => {
    sound.playClick();
    onSelectSpot(spot);
  };

  const filteredSpots =
    activeFilter === 'Todos'
      ? ROSARIO_DISPENSER_SPOTS
      : ROSARIO_DISPENSER_SPOTS.filter((s) => s.zone === activeFilter);

  const googleMapsEmbedUrl = `https://maps.google.com/maps?q=${selectedSpot.latitude},${selectedSpot.longitude}&t=m&z=16&ie=UTF8&iwloc=&output=embed`;

  return (
    <div id="rosario-spots-section" className="w-full max-w-7xl mx-auto my-12 px-4 sm:px-6 lg:px-8">
      {/* Title & Context */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black uppercase tracking-widest mb-3">
          <MapPin className="w-3.5 h-3.5 text-[#008B3E]" />
          <span>ROSARIO, SANTA FE, ARGENTINA</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-[#05421A] dark:text-[#E8F8EC] tracking-tight uppercase">
          DÓNDE CONSEGUIR TU CÁPSULA
        </h2>
        <p className="text-base sm:text-lg text-emerald-900/80 dark:text-emerald-200/80 font-medium mt-2">
          La colección de ropa y merch se expende exclusivamente a través de nuestros <strong>Dispensers Retro de Gaseosa 7UP</strong> ubicados en los puntos más emblemáticos de la ciudad de Rosario.
        </p>
      </div>

      {/* Step by step guide banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <div className="bg-white dark:bg-[#0A1F10] rounded-2xl p-5 border border-emerald-200/80 dark:border-emerald-800/60 shadow-xs flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-[#008B3E] text-white font-black flex items-center justify-center shrink-0 shadow-md">
            1
          </div>
          <div>
            <h4 className="font-black text-sm uppercase text-[#05421A] dark:text-[#E8F8EC]">Elegí tu punto</h4>
            <p className="text-xs text-neutral-600 dark:text-emerald-200/70 mt-1 leading-relaxed">
              Ubicá el dispenser más cercano en Parque España, Monumento, Plaza San Martín o el Centro Astronómico Municipal.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0A1F10] rounded-2xl p-5 border border-emerald-200/80 dark:border-emerald-800/60 shadow-xs flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-[#FFE600] text-[#00471C] font-black flex items-center justify-center shrink-0 shadow-md">
            2
          </div>
          <div>
            <h4 className="font-black text-sm uppercase text-[#05421A] dark:text-[#E8F8EC]">Acercate a la expendedora</h4>
            <p className="text-xs text-neutral-600 dark:text-emerald-200/70 mt-1 leading-relaxed">
              Las máquinas cuentan con formato de dispenser de gaseosa gigante con iluminación verde 7UP y pantalla digital.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0A1F10] rounded-2xl p-5 border border-emerald-200/80 dark:border-emerald-800/60 shadow-xs flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-[#E51E2B] text-white font-black flex items-center justify-center shrink-0 shadow-md">
            3
          </div>
          <div>
            <h4 className="font-black text-sm uppercase text-[#05421A] dark:text-[#E8F8EC]">Retirá tu cápsula</h4>
            <p className="text-xs text-neutral-600 dark:text-emerald-200/70 mt-1 leading-relaxed">
              Al presionar el botón de la máquina, tu cápsula cilíndrica de ropa o accesorio cae fría y lista por la bandeja.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Map & Spots Grid - Map has primary visual hierarchy */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Dominant Centerpiece: Google Maps Interactive Viewer */}
        <div className="lg:col-span-8 bg-linear-to-b from-[#003816] via-[#004A1F] to-[#01260F] rounded-3xl p-5 sm:p-6 border-2 border-emerald-500/40 shadow-2xl text-white relative overflow-hidden flex flex-col justify-between">
          {/* Map Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E51E2B] animate-ping" />
              <h3 className="text-sm sm:text-base font-black uppercase tracking-wider text-white">
                Punto activo: <span className="text-[#FFE600]">{selectedSpot.name}</span>
              </h3>
            </div>
          </div>

          {/* Large Hero Real Google Maps Display */}
          <div className="relative w-full h-[460px] sm:h-[520px] lg:h-[560px] bg-neutral-950 rounded-2xl border-2 border-white/20 overflow-hidden shadow-inner">
            <iframe
              id="real-rosario-google-map"
              title="Mapa Real de Rosario - Puntos Dispenser 7UP"
              src={googleMapsEmbedUrl}
              className="w-full h-full border-0 filter contrast-105"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Active spot card summary banner below map */}
          <div className="mt-4 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#FFE600] font-bold">
                  {selectedSpot.subname}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#7ED957] text-[#00471C] font-extrabold">
                  {selectedSpot.status}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white font-mono">
                  Stock: {selectedSpot.stockPercent}%
                </span>
              </div>
              <p className="text-xs text-emerald-100/90 mt-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#7ED957] shrink-0" />
                <span>{selectedSpot.address} • {selectedSpot.hours}</span>
              </p>
            </div>

            <a
              href={selectedSpot.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#FFE600] hover:bg-yellow-300 text-[#00471C] text-xs font-black uppercase tracking-wider shadow-md transition-transform hover:scale-105 shrink-0"
            >
              <span>Cómo llegar</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Right: Streamlined Companion Spots Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-900 dark:text-emerald-200">
              Ubicaciones ({ROSARIO_DISPENSER_SPOTS.length})
            </span>
            <span className="text-[11px] text-neutral-500 dark:text-emerald-300/60 font-medium">
              Seleccioná para centrar
            </span>
          </div>

          {/* Compact, clean scrollable card stack matching map height */}
          <div className="flex flex-col gap-2.5 max-h-[660px] overflow-y-auto pr-1">
            {ROSARIO_DISPENSER_SPOTS.map((spot, idx) => {
              const isSelected = selectedSpot.id === spot.id;
              return (
                <div
                  key={spot.id}
                  onClick={() => handleSpotClick(spot)}
                  className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-emerald-50 dark:bg-[#0F2D18] border-[#008B3E] shadow-md ring-2 ring-emerald-500/20'
                      : 'bg-white dark:bg-[#0A1F10] border-emerald-100/80 dark:border-emerald-800/60 hover:border-emerald-300 dark:hover:border-emerald-600/60 hover:bg-emerald-50/40 dark:hover:bg-[#0E2816] shadow-2xs'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl font-black flex items-center justify-center shrink-0 text-xs shadow-2xs ${
                        isSelected
                          ? 'bg-[#008B3E] text-white'
                          : 'bg-emerald-100 dark:bg-[#05451D] text-[#00662D] dark:text-[#7ED957]'
                      }`}
                    >
                      0{idx + 1}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-black text-[#05421A] dark:text-[#E8F8EC] truncate">
                          {spot.name}
                        </h4>
                      </div>
                      <p className="text-[11px] text-neutral-500 dark:text-emerald-200/60 truncate mt-0.5">
                        {spot.address}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-neutral-100 dark:bg-emerald-900/50 text-neutral-600 dark:text-emerald-200">
                          {spot.zone}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-700 dark:text-[#50E528] font-bold">
                          {spot.stockPercent}% stock
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center">
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${
                        isSelected ? 'bg-[#008B3E] scale-125' : 'bg-neutral-300 dark:bg-emerald-800'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
