import React from 'react';
import { ArrowUp, Sparkles } from 'lucide-react';
import { PageId } from '../types';
import { sound } from '../utils/audio';

interface FooterProps {
  onNavigate: (page: PageId) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const scrollToTop = () => {
    sound.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNav = (page: PageId) => {
    sound.playClick();
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="global-footer" className="relative bg-[#01592A] dark:bg-[#031509] text-white pt-16 pb-12 overflow-hidden border-t border-transparent dark:border-emerald-950">
      {/* Decorative Wave Accent at Top */}
      <div className="absolute top-0 left-0 right-0 h-3 bg-linear-to-r from-[#A4D902] via-[#029F3D] to-[#A4D902]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-emerald-900/80 dark:border-emerald-950">
          {/* Brand Col */}
          <div className="md:col-span-5 flex flex-col items-start gap-4">
            <div className="flex items-center gap-3">
              <img
                src="/7up-logo-transparent.svg"
                alt="7UP"
                className="h-11 w-auto object-contain filter drop-shadow-md"
              />
            </div>

            <p className="text-emerald-200/80 text-sm max-w-sm leading-relaxed">
              Explorando el universo cítrico de 7UP desde 1929. Auténtica frescura de limón y lima que despierta los sentidos y trasciende generaciones.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-900/60 dark:bg-emerald-950/80 border border-emerald-700/50 dark:border-emerald-800/50 text-xs font-semibold text-[#A4D902]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Frescura 100% Cítrica • Sin Cafeína</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-4 flex flex-col gap-3">
            <span className="text-xs font-black uppercase tracking-widest text-[#A4D902]">
              Explorar el Sitio
            </span>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => handleNav('home')}
                className="text-left text-sm text-emerald-100 hover:text-white transition-colors"
              >
                Inicio
              </button>
              <button
                type="button"
                onClick={() => handleNav('productos')}
                className="text-left text-sm text-emerald-100 hover:text-white transition-colors"
              >
                Colección Cápsula
              </button>
              <button
                type="button"
                onClick={() => handleNav('historia')}
                className="text-left text-sm text-emerald-100 hover:text-white transition-colors flex items-center gap-2"
              >
                <span>La Época (Historia Scrollytelling)</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F2081B] text-white font-bold">
                  Destacado
                </span>
              </button>
              <button
                type="button"
                onClick={() => handleNav('juego')}
                className="text-left text-sm text-emerald-100 hover:text-white transition-colors flex items-center gap-2"
              >
                <span>7UP Arcade (Juego Cítrico)</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#A4D902] text-[#01592A] font-bold">
                  Arcade
                </span>
              </button>
              <button
                type="button"
                onClick={() => handleNav('contacto')}
                className="text-left text-sm text-emerald-100 hover:text-white transition-colors"
              >
                Contacto &amp; Comunidad
              </button>
            </div>
          </div>

          {/* Brand Manifesto Quote & Scroll to Top */}
          <div className="md:col-span-3 flex flex-col justify-between items-start md:items-end gap-6">
            <div className="text-left md:text-right">
              <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold block mb-1">
                Manifiesto
              </span>
              <p className="text-sm font-extrabold text-white leading-snug">
                &ldquo;Las épocas cambian.
                <br />
                La frescura permanece.&rdquo;
              </p>
            </div>

            <button
              type="button"
              id="footer-scroll-top"
              onClick={scrollToTop}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-900/80 dark:bg-emerald-950 hover:bg-emerald-800 dark:hover:bg-emerald-900 text-white text-xs font-bold border border-emerald-700/60 dark:border-emerald-800/70 shadow-xs transition-all hover:scale-105"
            >
              <span>Subir</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Bottom copyright notice */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-400/70">
          <p>© {new Date().getFullYear()} Experiencia digital conmemorativa 7UP. Todos los derechos reservados.</p>
          <p className="text-center sm:text-right">7UP® y The Uncola son marcas comerciales registradas. Sin fines transaccionales.</p>
        </div>
      </div>
    </footer>
  );
};
