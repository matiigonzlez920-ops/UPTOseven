import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Gamepad2, ArrowRight, Quote, Heart, Music, Smile } from 'lucide-react';
import { FidoDidoIllustration } from './FidoDidoIllustration';
import { PageId } from '../types';
import { sound } from '../utils/audio';

interface FidoDidoSectionProps {
  onNavigate: (page: PageId) => void;
}

const FIDO_PHILOSOPHY = [
  {
    title: 'Fido es para Fido',
    text: 'Fido no intenta impresionar a nadie más. Se viste cómodo, camina tranquilo y vive a su propio ritmo.',
  },
  {
    title: 'Ser vos mismo está genial',
    text: 'La autenticidad es tu mayor superpoder. No sigas modas ajenas cuando podés crear tu propia frescura.',
  },
  {
    title: 'Fido no hace daño',
    text: 'Cero toxicidad, cero negatividad. La verdadera buena onda no necesita pasar por encima de nadie.',
  },
  {
    title: 'Fido ve con claridad',
    text: 'Al igual que un 7UP bien transparente, la simpleza sin filtros es la mejor manera de ver las cosas.',
  },
];

export const FidoDidoSection: React.FC<FidoDidoSectionProps> = ({ onNavigate }) => {
  const [activeRule, setActiveRule] = useState(0);
  const [fidoMood, setFidoMood] = useState<'chill' | 'thumbs_up'>('chill');

  const handleRuleClick = (index: number) => {
    sound.playPoint();
    setActiveRule(index);
    setFidoMood('thumbs_up');
    setTimeout(() => setFidoMood('chill'), 1200);
  };

  const handlePlayArcade = () => {
    sound.playCanOpen();
    onNavigate('juego');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section
      id="fido-dido-section"
      className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24"
    >
      {/* Background Retro Comic Halftone / Grid Pattern */}
      <div className="relative rounded-[36px] bg-linear-to-br from-[#042B12] via-[#02200D] to-[#011408] border-2 border-emerald-500/25 p-8 sm:p-14 overflow-hidden shadow-2xl">
        {/* Glow circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#A4D902]/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#F2081B]/15 blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center relative z-10">
          {/* Left Column (7 cols): Editorial & Rules */}
          <div className="lg:col-span-7 flex flex-col items-start gap-5 text-left text-white">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F2081B] text-white text-xs font-black tracking-widest uppercase shadow-md">
              <Smile className="w-3.5 h-3.5" />
              <span>ÍCONO DE LOS 90s • LA VOZ DE LA FRESCURA</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              FIDO DIDO: <br />
              <span className="text-[#A4D902]">&ldquo;ESTÁ GENIAL SER VOS MISMO&rdquo;</span>
            </h2>

            <p className="text-sm sm:text-base text-emerald-100/80 leading-relaxed font-medium">
              Con su pelo en punta, remera holgada y zapatillas flojas, Fido Dido demostró que no necesitás complicarte para ser auténtico. Creado en una servilleta de café, se convirtió en el rostro más querido de 7UP en todo el mundo.
            </p>

            {/* Interactive Rules Selector */}
            <div className="w-full mt-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#A4D902] block mb-3">
                Hacé clic en los mandamientos de Fido:
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                {FIDO_PHILOSOPHY.map((rule, idx) => {
                  const isSelected = activeRule === idx;
                  return (
                    <button
                      key={rule.title}
                      type="button"
                      id={`fido-rule-btn-${idx}`}
                      onClick={() => handleRuleClick(idx)}
                      className={`p-2.5 rounded-xl border text-xs font-black transition-all cursor-pointer text-center ${
                        isSelected
                          ? 'bg-[#A4D902] text-[#01592A] border-[#A4D902] shadow-lg scale-105'
                          : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span>#{idx + 1}</span>
                      <span className="block truncate text-[11px] mt-0.5">{rule.title}</span>
                    </button>
                  );
                })}
              </div>

              {/* Active Rule Card */}
              <div className="p-5 rounded-2xl bg-black/40 border border-emerald-500/30 backdrop-blur-md">
                <div className="flex items-center gap-2 mb-1 text-[#A4D902]">
                  <Quote className="w-4 h-4" />
                  <span className="text-xs font-mono font-bold uppercase">
                    Regla {activeRule + 1}: {FIDO_PHILOSOPHY[activeRule].title}
                  </span>
                </div>
                <p className="text-sm text-emerald-100/90 leading-relaxed">
                  {FIDO_PHILOSOPHY[activeRule].text}
                </p>
              </div>
            </div>

            {/* CTA Button to play arcade with Fido */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                type="button"
                id="fido-cta-arcade"
                onClick={handlePlayArcade}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#A4D902] hover:bg-[#A4D902] text-[#01592A] font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Gamepad2 className="w-4 h-4" />
                <span>Ver Trailer &amp; Descargar</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onNavigate('historia');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm transition-all"
              >
                <span>Leer la historia de los 90s</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column (5 cols): Visual Character Showcase */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative p-6 sm:p-8 rounded-3xl bg-white shadow-2xl border-4 border-[#01592A] flex flex-col items-center max-w-xs w-full rotate-1 hover:rotate-0 transition-transform duration-500 group">
              {/* Comic Strip Tape Detail */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-sm bg-[#A4D902] text-black font-mono text-[10px] font-black tracking-widest uppercase border border-black/20 rotate-[-1deg]">
                ORIGINAL SKETCH • 7UP
              </div>

              {/* Fido Character Illustration */}
              <div className="w-52 h-64 flex items-center justify-center mt-2 group-hover:scale-105 transition-transform duration-300">
                <FidoDidoIllustration className="w-48 h-64" pose={fidoMood} />
              </div>

              {/* Speech bubble */}
              <div className="mt-3 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-center w-full">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#01592A] font-bold block">
                  FILOSOFÍA CÍTIRCA
                </span>
                <p className="text-xs font-bold text-[#01592A] mt-0.5">
                  &ldquo;La vida es muy corta para tomar bebidas aburridas.&rdquo;
                </p>
              </div>

              <div className="mt-3 flex items-center justify-between w-full px-2 text-[10px] font-bold text-[#01592A]/60">
                <span>© 7UP x Joanna Ferrone</span>
                <span className="text-[#F2081B] font-black">100% COOL</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
