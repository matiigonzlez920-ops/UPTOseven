import React, { useRef, useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { sound } from '../utils/audio';

interface CommercialSpotHeroProps {
  onExploreClick?: () => void;
}

export const CommercialSpotHero: React.FC<CommercialSpotHeroProps> = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<any>(null);
  const [isMuted, setIsMuted] = useState<boolean>(true);

  // Initialize Vimeo Player instance if available
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).Vimeo?.Player && iframeRef.current) {
      try {
        playerRef.current = new (window as any).Vimeo.Player(iframeRef.current);
      } catch (err) {
        console.warn('Vimeo Player init:', err);
      }
    }
  }, []);

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick();
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    if (playerRef.current) {
      playerRef.current.setMuted(nextMuted).catch(() => {});
      if (!nextMuted) {
        playerRef.current.setVolume(1).catch(() => {});
      }
    } else if (typeof window !== 'undefined' && (window as any).Vimeo?.Player && iframeRef.current) {
      try {
        const player = new (window as any).Vimeo.Player(iframeRef.current);
        playerRef.current = player;
        player.setMuted(nextMuted).catch(() => {});
        if (!nextMuted) {
          player.setVolume(1).catch(() => {});
        }
      } catch (err) {
        console.warn('Vimeo sound control error:', err);
      }
    } else if (iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage(
        JSON.stringify({ method: 'setVolume', value: nextMuted ? 0 : 1 }),
        '*'
      );
    }
  };

  return (
    <section
      id="commercial-spot-section"
      className="relative w-full h-screen min-h-[580px] lg:min-h-[700px] bg-black overflow-hidden flex flex-col justify-start"
    >
      {/* 100% Full-bleed background video container (fills entire section) */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <iframe
          ref={iframeRef}
          src="https://player.vimeo.com/video/1229653108?background=1&autoplay=1&loop=1&byline=0&title=0&portrait=0&controls=0&badge=0&autopause=0&muted=1"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          title="7UP Commercial Spot"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[177.78vh] min-w-full h-[56.25vw] min-h-full pointer-events-none"
        />
      </div>

      {/* Cinematic subtle Vignettes / Gradients */}
      <div className="absolute inset-x-0 top-0 h-44 bg-linear-to-b from-black/80 via-black/30 to-transparent pointer-events-none z-10" />
      <div className="absolute inset-x-0 bottom-0 h-36 bg-linear-to-t from-black/80 via-black/25 to-transparent pointer-events-none z-10" />

      {/* Top Banner Audio Controls: Positioned below fixed global header */}
      <div className="relative z-20 w-full px-4 sm:px-8 pt-24 sm:pt-28 flex items-center justify-end pointer-events-auto">
        {/* Audio Toggle Button (Icon only) */}
        <button
          type="button"
          onClick={toggleSound}
          aria-label={isMuted ? 'Activar audio' : 'Silenciar audio'}
          title={isMuted ? 'Activar audio' : 'Silenciar audio'}
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center bg-black/65 hover:bg-black/85 backdrop-blur-md border border-white/20 hover:border-[#7ED957]/60 text-white transition-all shadow-xl hover:scale-110 active:scale-95 cursor-pointer"
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5 text-white/75" />
          ) : (
            <Volume2 className="w-5 h-5 text-[#7ED957] animate-pulse" />
          )}
        </button>
      </div>
    </section>
  );
};
