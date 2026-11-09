import React from 'react';
import { Gamepad2, MapPin, Sparkles } from 'lucide-react';
import { PageId } from '../types';
import { sound } from '../utils/audio';

interface HomeGameTeaserProps {
  onNavigate: (page: PageId) => void;
}

export const HomeGameTeaser: React.FC<HomeGameTeaserProps> = ({ onNavigate }) => {
  const handleGoToGame = () => {
    sound.playClick();
    onNavigate('juego');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoToArcadeSpots = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playBonus();
    onNavigate('juego');
    setTimeout(() => {
      const el = document.getElementById('descargar-seccion');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 200);
  };

  return (
    <section id="home-game-download-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="relative rounded-3xl bg-linear-to-r from-[#032610] via-[#021d0c] to-[#011408] border-2 border-emerald-500/25 p-6 sm:p-8 text-white shadow-xl overflow-hidden">
        {/* Glow ambient accent */}
        <div className="absolute top-0 right-1/4 w-72 h-32 bg-[#A4D902]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          {/* Left: Info & Badges */}
          <div className="flex items-center gap-4 sm:gap-6 text-left">
            {/* Visual Icon Box */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-2xl bg-linear-to-br from-[#01592A] to-[#043314] border border-emerald-400/30 flex items-center justify-center p-2 relative shadow-lg">
              <img
                src="/7up.png"
                alt="7UP Arcade Can"
                className="w-full h-full object-contain filter drop-shadow-md"
              />
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#F2081B] text-white text-[10px] font-black flex items-center justify-center border border-white/40 shadow-xs">
                7
              </span>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-md bg-[#A4D902] text-[#01592A] font-mono text-[10px] font-black uppercase tracking-wider">
                  ARCADE OFICIAL 90s
                </span>
                <span className="text-[11px] font-mono text-emerald-300/80 hidden sm:inline-block">
                  Sacoa Nacional • Eventos Sponsor 7UP • Pop-Ups
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                7UP: Atrapa la Frescura
              </h3>

              <p className="text-xs sm:text-sm text-emerald-100/70 max-w-lg mt-0.5 leading-relaxed">
                Probá el Nivel 1 en el navegador. Para jugar el juego entero, ¡encontrá las máquinas arcade físicas en todos los Sacoa del país y eventos sponsor!
              </p>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3 w-full md:w-auto shrink-0 justify-end flex-wrap sm:flex-nowrap">
            <button
              type="button"
              id="home-play-demo-btn"
              onClick={handleGoToGame}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg active:scale-95 bg-[#A4D902] hover:bg-[#A4D902] text-[#01592A] hover:scale-105"
            >
              <Gamepad2 className="w-4 h-4 text-[#01592A]" />
              <span>Jugar Demo Online</span>
            </button>

            <button
              type="button"
              id="home-view-arcades-btn"
              onClick={handleGoToArcadeSpots}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer border border-white/15 hover:border-white/30"
            >
              <MapPin className="w-3.5 h-3.5 text-[#A4D902]" />
              <span>Buscar Maquinitas</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
