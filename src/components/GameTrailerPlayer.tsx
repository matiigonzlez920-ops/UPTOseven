import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Sparkles,
  Zap,
  Flame,
  Award,
  CheckCircle2,
} from 'lucide-react';
import { sound } from '../utils/audio';
import { FidoDidoIllustration } from './FidoDidoIllustration';

interface GameTrailerPlayerProps {
  onDownloadRequest?: () => void;
}

interface Chapter {
  id: number;
  title: string;
  startTime: number;
  duration: number;
}

const CHAPTERS: Chapter[] = [
  { id: 0, title: 'Intro', startTime: 0, duration: 4.5 },
  { id: 1, title: 'Gameplay', startTime: 4.5, duration: 6 },
  { id: 2, title: 'Fido Dido', startTime: 10.5, duration: 5.5 },
  { id: 3, title: 'Fiebre Fizz', startTime: 16, duration: 5 },
  { id: 4, title: 'Lanzamiento', startTime: 21, duration: 5 },
];

const TOTAL_DURATION = 26; // seconds

export const GameTrailerPlayer: React.FC<GameTrailerPlayerProps> = ({ onDownloadRequest }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Gameplay simulation visual state for trailer
  const [simCanX, setSimCanX] = useState<number>(50); // percentage
  const [simCombo, setSimCombo] = useState<number>(1);
  const [simScore, setSimScore] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<number | null>(null);

  // Auto-advance timeline when playing
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const interval = 100; // 100ms ticks
    timerRef.current = window.setInterval(() => {
      setCurrentTime((prev) => {
        const next = prev + 0.1;
        if (next >= TOTAL_DURATION) {
          setIsPlaying(false);
          return TOTAL_DURATION;
        }

        // Trigger sound effects dynamically at specific trailer cues
        if (!isMuted) {
          // Can catch sound at seconds 5.2, 6.4, 7.6, 8.8
          if (
            (next >= 5.2 && next <= 5.3) ||
            (next >= 6.5 && next <= 6.6) ||
            (next >= 7.8 && next <= 7.9) ||
            (next >= 9.1 && next <= 9.2)
          ) {
            sound.playPoint();
          }
          // Fido Dido intro cue at 10.6
          if (next >= 10.6 && next <= 10.7) {
            sound.playCanOpen();
          }
          // Fever mode buzz at 16.2
          if (next >= 16.2 && next <= 16.3) {
            sound.playBonus();
          }
        }

        // Simulate can movement during gameplay chapter
        if (next >= 4.5 && next < 10.5) {
          const t = (next - 4.5) * 2;
          const x = 50 + Math.sin(t * 3) * 30;
          setSimCanX(x);
          setSimCombo((c) => Math.min(10, Math.floor((next - 4.5) * 1.5) + 1));
          setSimScore((s) => s + 35);
        }

        return next;
      });
    }, interval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isMuted]);

  // Determine current chapter
  const currentChapter =
    CHAPTERS.slice()
      .reverse()
      .find((ch) => currentTime >= ch.startTime) || CHAPTERS[0];

  const handleTogglePlay = () => {
    sound.playClick();
    if (currentTime >= TOTAL_DURATION) {
      setCurrentTime(0);
      setSimScore(0);
      setSimCombo(1);
    }
    setIsPlaying((prev) => !prev);
  };

  const handleSeek = (time: number) => {
    sound.playClick();
    setCurrentTime(time);
    if (!isPlaying) setIsPlaying(true);
  };

  const handleToggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = Math.min(100, (currentTime / TOTAL_DURATION) * 100);

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-3xl overflow-hidden bg-black border-2 border-emerald-500/30 shadow-2xl transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none border-none' : 'max-w-5xl mx-auto'
      }`}
    >
      {/* 16:9 Video Canvas Frame */}
      <div className="relative aspect-video w-full overflow-hidden bg-[#021808] flex items-center justify-center select-none">
        {/* CRT Scanline & Grain Texture overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-20 opacity-15"
          style={{
            backgroundImage:
              'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.4) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.04), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.04))',
            backgroundSize: '100% 4px, 6px 100%',
          }}
        />

        {/* Ambient Corner Glows */}
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-[#008B3E]/30 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-[#FFE600]/20 blur-3xl pointer-events-none" />

        {/* Top Header Watermark / Trailer Tag */}
        <div className="absolute top-4 left-5 right-5 z-20 flex items-center justify-between text-xs text-white/70">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E51E2B] animate-pulse" />
            <span className="font-mono font-black tracking-widest uppercase text-[#7ED957]">
              7UP STUDIOS • OFFICIAL GAMEPLAY TRAILER
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-white/10 font-mono text-[10px] font-bold text-white border border-white/10">
              4K 60FPS
            </span>
            <span className="px-2 py-0.5 rounded-md bg-[#008B3E] font-mono text-[10px] font-bold text-white uppercase">
              ARCADE EDITION
            </span>
          </div>
        </div>

        {/* =========================================================
            TRAILER SCENES BASED ON CURRENT TIME
            ========================================================= */}

        {/* SCENE 0: INTRO (0 to 4.5s) */}
        {currentChapter.id === 0 && (
          <motion.div
            key="scene-intro"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center p-6"
          >
            {/* Ambient rising bubble particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(16)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-[#7ED957]/30 animate-bounce"
                  style={{
                    width: `${8 + (i % 6) * 4}px`,
                    height: `${8 + (i % 6) * 4}px`,
                    left: `${(i * 6.5) % 95}%`,
                    bottom: `${(i * 8) % 80}%`,
                    animationDuration: `${1.5 + (i % 4) * 0.5}s`,
                  }}
                />
              ))}
            </div>

            <motion.span
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xs sm:text-sm font-mono tracking-widest text-[#7ED957] uppercase font-black mb-3"
            >
              PREPÁRATE PARA LA EXPERIENCIA MÁS REFRESCANTE
            </motion.span>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6, type: 'spring', damping: 12 }}
              className="relative mb-4"
            >
              <h1 className="text-4xl sm:text-7xl font-black text-white tracking-tight drop-shadow-[0_10px_25px_rgba(0,139,62,0.8)]">
                7UP <span className="text-[#7ED957]">ARCADE</span>
              </h1>
              <span className="block text-lg sm:text-2xl font-black text-[#FFE600] tracking-widest uppercase mt-1">
                ATRAPA LA FRESCURA
              </span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="text-xs sm:text-sm text-emerald-100/70 max-w-md"
            >
              El legendario sabor de limón y lima se transforma en el juego de reflejos más adictivo de la temporada.
            </motion.p>
          </motion.div>
        )}

        {/* SCENE 1: GAMEPLAY ACTION (4.5 to 10.5s) */}
        {currentChapter.id === 1 && (
          <motion.div
            key="scene-gameplay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col justify-between p-6 sm:p-10"
          >
            {/* In-Game HUD overlay simulation */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 rounded-xl bg-black/60 border border-emerald-500/40 text-left">
                  <span className="text-[10px] text-emerald-300 font-mono block">SCORE</span>
                  <span className="text-lg font-black text-[#FFE600] font-mono">{simScore}</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-[#E51E2B] text-white font-black text-xs uppercase animate-pulse">
                  COMBO {simCombo}X
                </div>
              </div>

              <div className="px-3 py-1 rounded-full bg-[#008B3E] text-white text-xs font-black uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>GAMEPLAY REAL</span>
              </div>
            </div>

            {/* Falling items in motion */}
            <div className="relative flex-1 w-full overflow-hidden">
              {/* Falling lemons & limes */}
              <motion.div
                animate={{ y: [0, 220], rotate: [0, 360] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
                className="absolute left-[30%] -top-10 text-3xl"
              >
                🍋
              </motion.div>
              <motion.div
                animate={{ y: [0, 240], rotate: [0, -360] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'linear', delay: 0.3 }}
                className="absolute left-[65%] -top-10 text-3xl"
              >
                🍈
              </motion.div>
              <motion.div
                animate={{ y: [0, 200], rotate: [0, 180] }}
                transition={{ duration: 2.1, repeat: Infinity, ease: 'linear', delay: 0.7 }}
                className="absolute left-[48%] -top-10 text-2xl"
              >
                🧊
              </motion.div>

              {/* Floating score splashes */}
              <motion.div
                animate={{ y: [-10, -50], opacity: [1, 0], scale: [1, 1.3] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="absolute left-[52%] bottom-16 text-lg font-black text-[#FFE600] drop-shadow-md"
              >
                +50 FIZZ!
              </motion.div>

              {/* Simulated 7UP Can tracking simCanX */}
              <div
                className="absolute bottom-4 -translate-x-1/2 transition-all duration-150 ease-out flex flex-col items-center"
                style={{ left: `${simCanX}%` }}
              >
                <div className="w-16 h-28 relative">
                  <img
                    src="/7up.png"
                    alt="7UP Can"
                    className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,139,62,0.8)]"
                  />
                  {/* Catch Aura */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-3 rounded-full bg-[#7ED957] blur-xs animate-ping" />
                </div>
              </div>
            </div>

            {/* Feature Callout Banner */}
            <div className="z-10 p-2.5 rounded-2xl bg-black/75 border border-white/10 text-center flex items-center justify-center gap-2">
              <Zap className="w-4 h-4 text-[#FFE600]" />
              <span className="text-xs sm:text-sm font-black text-white">
                FÍSICA REALISTA DE BURBUJAS • CADENCIA CÍTRICA • CONTROLES FLUIDOS
              </span>
            </div>
          </motion.div>
        )}

        {/* SCENE 2: FIDO DIDO SPECIAL GUEST (10.5 to 16s) */}
        {currentChapter.id === 2 && (
          <motion.div
            key="scene-fido"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center p-6"
          >
            <div className="relative max-w-xl w-full p-6 sm:p-8 rounded-3xl bg-white text-[#05421A] border-4 border-[#008B3E] shadow-2xl flex flex-col sm:flex-row items-center gap-6">
              {/* Comic Strip Style Badge */}
              <div className="absolute -top-3 left-6 px-3 py-1 rounded-md bg-[#FFE600] text-black font-mono text-[10px] font-black uppercase tracking-wider border border-black/20">
                PERSONAJE DESBLOQUEABLE
              </div>

              {/* Fido Dido SVG Illustration */}
              <div className="w-32 h-44 shrink-0 flex items-center justify-center">
                <FidoDidoIllustration className="w-32 h-44 scale-105" pose="thumbs_up" />
              </div>

              {/* Text & Speech */}
              <div className="flex flex-col text-left">
                <div className="inline-flex items-center gap-1.5 text-xs font-black text-[#008B3E] uppercase tracking-wider mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#E51E2B]" />
                  <span>CON LA PARTICIPACIÓN ESPECIAL DE</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-[#05421A] tracking-tight leading-none mb-2">
                  FIDO DIDO
                </h3>
                <p className="text-xs sm:text-sm text-emerald-900/80 font-medium leading-relaxed">
                  &ldquo;It&rsquo;s cool to be you. Relajate, atrapá los limones sin apuro y desbloqueá mis skins noventeras exclusivas.&rdquo;
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                    ★ Coach Oficial
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                    ★ Voces y Consejos
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* SCENE 3: FIEBRE FIZZ & MULTIPLAYER (16 to 21s) */}
        {currentChapter.id === 3 && (
          <motion.div
            key="scene-fever"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-radial from-[#008B3E]/60 via-[#02200D] to-black"
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFE600] text-black font-black text-xs tracking-widest uppercase mb-3 shadow-lg"
            >
              <Flame className="w-4 h-4 text-[#E51E2B]" />
              <span>¡MODO FIEBRE DE BURBUJAS!</span>
            </motion.div>

            <h2 className="text-3xl sm:text-6xl font-black text-white tracking-tight drop-shadow-lg mb-2">
              PUNTOS X2 &amp; TIEMPO CONGELADO
            </h2>

            <p className="text-xs sm:text-base text-emerald-100 max-w-lg mb-6 font-medium">
              Llena tu barra de efervescencia para desatar el poder cítrico, ralentizar el tiempo con cubos de hielo y escalar en el ranking mundial.
            </p>

            {/* 4 Can Varieties Showcase in Row */}
            <div className="flex items-center justify-center gap-3 sm:gap-6">
              {[
                { name: 'Original', img: '/7up.png' },
                { name: 'Zero', img: '/7up-zero-sugar.png' },
                { name: 'Cherry', img: '/7up-cherry.png' },
                { name: 'Tropical', img: '/7up-tropical.png' },
              ].map((can, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <img
                    src={can.img}
                    alt={can.name}
                    className="h-14 sm:h-20 w-auto object-contain filter drop-shadow-md hover:scale-110 transition-transform"
                  />
                  <span className="text-[10px] font-bold text-white/80 mt-1">{can.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* SCENE 4: FINAL TITLE CARD & CTA (21 to 26s) */}
        {currentChapter.id === 4 && (
          <motion.div
            key="scene-final"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-10"
          >
            <div className="w-16 h-16 rounded-full bg-[#E51E2B] flex items-center justify-center mb-3 shadow-xl">
              <span className="text-3xl font-black text-white">7</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-1">
              7UP: ATRAPA LA FRESCURA
            </h2>
            <span className="text-xs sm:text-sm font-mono tracking-widest text-[#7ED957] uppercase font-bold mb-4">
              EDICIÓN ARCADE • DISPONIBLE AHORA
            </span>

            <p className="text-xs sm:text-sm text-emerald-100/80 max-w-md mb-5 font-medium">
              ¡No esperes más! Descargá el juego gratis a continuación para tu PC o dispositivo móvil.
            </p>

            {onDownloadRequest && (
              <button
                type="button"
                onClick={onDownloadRequest}
                className="px-8 py-3.5 rounded-full bg-[#7ED957] hover:bg-[#6ecb47] text-[#05421A] font-black text-xs sm:text-sm uppercase tracking-wider shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#E51E2B]" />
                <span>IR A DESCARGAR ABAJO</span>
              </button>
            )}
          </motion.div>
        )}

        {/* Central Play/Replay Overlay when paused or ended */}
        {!isPlaying && (
          <div className="absolute inset-0 z-30 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center">
            <button
              type="button"
              id="trailer-center-play-btn"
              onClick={handleTogglePlay}
              className="w-20 h-20 rounded-full bg-[#7ED957] hover:bg-[#6ecb47] text-[#05421A] flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all cursor-pointer group"
              aria-label={currentTime >= TOTAL_DURATION ? 'Repetir trailer' : 'Reproducir trailer'}
            >
              {currentTime >= TOTAL_DURATION ? (
                <RotateCcw className="w-8 h-8" />
              ) : (
                <Play className="w-9 h-9 ml-1" />
              )}
            </button>
            <span className="mt-3 text-xs font-mono font-bold text-white uppercase tracking-widest">
              {currentTime >= TOTAL_DURATION ? 'VOLVER A VER EL TRAILER' : 'CONTINUAR REPRODUCCIÓN'}
            </span>
          </div>
        )}
      </div>

      {/* =========================================================
          TRAILER TIMELINE & SCRUBBER CONTROLS
          ========================================================= */}
      <div className="bg-[#042410] border-t border-emerald-500/20 p-3 sm:p-4 flex flex-col gap-2.5">
        {/* Scrubber Progress Bar */}
        <div
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            handleSeek(pos * TOTAL_DURATION);
          }}
          className="relative w-full h-2 rounded-full bg-white/15 cursor-pointer overflow-hidden group hover:h-3 transition-all"
        >
          {/* Progress fill */}
          <div
            className="h-full bg-linear-to-r from-[#008B3E] via-[#7ED957] to-[#FFE600] rounded-full relative"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Chapters Navigation Pills */}
        <div className="flex items-center justify-between gap-1 sm:gap-2 overflow-x-auto py-1 scrollbar-none">
          {CHAPTERS.map((ch) => {
            const isCurrent = currentChapter.id === ch.id;
            return (
              <button
                key={ch.id}
                type="button"
                onClick={() => handleSeek(ch.startTime)}
                className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-mono font-bold transition-all shrink-0 cursor-pointer ${
                  isCurrent
                    ? 'bg-[#7ED957] text-[#05421A] shadow-xs'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                0{ch.id + 1} {ch.title}
              </button>
            );
          })}
        </div>

        {/* Lower Control Bar */}
        <div className="flex items-center justify-between text-white text-xs pt-1">
          <div className="flex items-center gap-3">
            <button
              type="button"
              id="trailer-play-toggle-btn"
              onClick={handleTogglePlay}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label={isPlaying ? 'Pausar trailer' : 'Reproducir trailer'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            <button
              type="button"
              id="trailer-mute-toggle-btn"
              onClick={handleToggleMute}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <span className="font-mono text-xs text-white/70">
              {formatTime(currentTime)} / {formatTime(TOTAL_DURATION)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block text-[11px] font-mono text-emerald-300 font-bold">
              Capítulo: {currentChapter.title}
            </span>

            <button
              type="button"
              id="trailer-fullscreen-btn"
              onClick={handleToggleFullscreen}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Pantalla completa"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
