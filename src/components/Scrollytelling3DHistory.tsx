import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Rotate3d,
  Volume2,
  VolumeX,
  Compass,
  ArrowRight,
  BookOpen,
  Eye,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import { PageId } from '../types';
import { sound } from '../utils/audio';
import { Story3DScene } from './Story3DScene';

// Register GSAP ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface StoryChapter {
  id: string;
  number: string;
  title: string;
  year: string;
  subtitle: string;
  tagline: string;
  keyDetails: { label: string; value: string }[];
  narrative: string[];
  quote?: { text: string; author: string };
  badge: string;
  accentColor: string;
  ambientBg: string;
  artifactTitle: string;
  artifactDesc: string;
}

export const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: '01-experiment',
    number: '01',
    title: 'THE EXPERIMENT',
    year: '1929',
    subtitle: 'Charles Leiper Grigg • 11 formulas',
    tagline: 'El nacimiento de una receta artesanal para desafiar a las bebidas oscuras.',
    keyDetails: [
      { label: 'AÑO', value: '1929' },
      { label: 'CREADOR', value: 'Charles Leiper Grigg' },
      { label: 'ENSAYOS', value: '11 fórmulas' },
      { label: 'ORIGEN', value: 'The Howdy Corp (St. Louis)' },
    ],
    narrative: [
      'En St. Louis, Missouri, el veterano formulador Charles Leiper Grigg pasó más de dos años buscando un elixir limpio y cítrico.',
      'Tras evaluar exactamente 11 formulaciones distintas, dio con la combinación perfecta de aceites esenciales de limón, lima y sales de litio.',
      'Bautizada inicialmente como "Bib-Label Lithiated Lemon-Lime Soda", fue envasada en botellas de botica dos semanas antes del colapso de Wall Street en octubre de 1929.',
    ],
    quote: {
      text: 'No buscábamos imitar a ninguna cola oscura. Buscábamos la efervescencia pura que despierta el paladar.',
      author: 'Charles Leiper Grigg, 1929',
    },
    badge: 'GÉNESIS 1929',
    accentColor: '#E6A838',
    ambientBg: 'from-[#1a1409] via-[#24190c] to-[#0d160f]',
    artifactTitle: 'Botella Medicinal Ámbar 1929',
    artifactDesc: 'Vidrio soplado medicinal con tapón de corcho y matraz de laboratorio alquímico.',
  },
  {
    id: '02-drink',
    number: '02',
    title: 'THE DRINK',
    year: 'The birth of 7UP',
    subtitle: 'El bautismo legendario de un icono mundial',
    tagline: 'Siete ingredientes naturales y siete onzas de pura efervescencia.',
    keyDetails: [
      { label: 'ORIGEN', value: 'The birth of 7UP' },
      { label: 'SIGNIFICADO', value: '7 Ingredientes / 7 Oz' },
      { label: 'ESPÍRITU', value: 'Up (Elevar el ánimo)' },
      { label: 'EMPRESA', value: 'The Seven-Up Company' },
    ],
    narrative: [
      'El extenso nombre original resultaba casi imposible de pedir en las ruidosas fuentes de soda. En 1936, Grigg lo rebautizó con un monograma conciso: 7UP.',
      'El mítico "7" encierra el misterio de sus 7 ingredientes botánicos originales, su botella inicial de 7 onzas y su pH neutro superior.',
      'El "UP" consagró la ascensión de sus microburbujas carbónicas que refrescaban y levantaban el ánimo de quienes buscaban optimismo.',
    ],
    quote: {
      text: 'Siete ingredientes puros, una botella inconfundible y un nombre que se pronuncia en un chasquido.',
      author: 'Crónica The Seven-Up Company, 1936',
    },
    badge: 'EL BAUTISMO',
    accentColor: '#50E528',
    ambientBg: 'from-[#072412] via-[#0b331a] to-[#05180c]',
    artifactTitle: 'Nacimiento de la Botella Verde',
    artifactDesc: 'Silueta de vidrio esmeralda con escudo 7 y 7 orbes cítricos en órbita gravitacional.',
  },
  {
    id: '03-expansion',
    number: '03',
    title: 'THE EXPANSION',
    year: '1930s–1940s',
    subtitle: 'La mítica botella 8-Bubbles y el alcance nacional',
    tagline: 'Superando la Gran Depresión hasta conquistar los hogares del mundo.',
    keyDetails: [
      { label: 'PERÍODO', value: '1930s–1940s' },
      { label: 'ENVASE', value: 'Botella Verde 8-Bubbles' },
      { label: 'SLOGAN', value: 'You like it... It likes you' },
      { label: 'MERCADO', value: '3.ª bebida más consumida' },
    ],
    narrative: [
      'A contracorriente de la parálisis industrial, 7UP tejió una vanguardista red de franquicias embotelladoras independientes que abastecieron a todo Estados Unidos.',
      'Se diseñó la célebre botella verde con 8 burbujas grabadas en relieve de vidrio, permitiendo reconocer la marca con los dedos incluso a oscuras en una hielera.',
      'Durante la Segunda Guerra Mundial y la posguerra, 7UP se convirtió en el acompañamiento indispensable en las mesas familiares.',
    ],
    quote: {
      text: 'You like it... It likes you. Nothing does it like Seven-Up!',
      author: 'Lema Nacional Oficial 1936–1948',
    },
    badge: 'ERA DORADA',
    accentColor: '#7ED957',
    ambientBg: 'from-[#0a2817] via-[#05381a] to-[#041d0e]',
    artifactTitle: 'Botella Verde 8-Bubbles',
    artifactDesc: 'Vidrio esmeralda con relieve táctil de 8 burbujas y chapa corona dorada.',
  },
  {
    id: '04-evolution',
    number: '04',
    title: 'THE EVOLUTION',
    year: '1960s–1970s',
    subtitle: 'La transición a la lata de aluminio y el nacimiento de The Spot',
    tagline: 'La revolución geométrica moderna: tipografía bold y el punto rojo.',
    keyDetails: [
      { label: 'PERÍODO', value: '1960s–1970s' },
      { label: 'INNOVACIÓN', value: 'Lata de Aluminio' },
      { label: 'IDENTIDAD', value: 'The Red Spot' },
      { label: 'DISEÑO', value: 'Pop Art & Mid-Century' },
    ],
    narrative: [
      'La modernidad de los años sesenta impulsó la adopción masiva del envase de aluminio, liviano, ultrafrío y listo para llevar.',
      'Se incorporó formalmente el punto rojo escarlata ("The Spot") entre el 7 y el UP, transformando un signo de puntuación en un orbe gravitacional lleno de energía.',
      'La paleta gráfica evolucionó hacia verdes cítricos resplandecientes que dominaron las góndolas de los supermercados.',
    ],
    quote: {
      text: 'Un punto rojo que dotó de alma y latido propio a una marca inmortal.',
      author: 'Advertising Age, Retrospectiva Visual',
    },
    badge: 'MODERNIDAD',
    accentColor: '#FF3B30',
    ambientBg: 'from-[#182618] via-[#0d3b1b] to-[#1a0f0f]',
    artifactTitle: 'Lata Pop Art 60s & The Spot',
    artifactDesc: 'Cilindro metálico de aluminio vintage con The Red Spot 3D pulsando en su corazón.',
  },
  {
    id: '05-fido-dido',
    number: '05',
    title: 'FIDO DIDO',
    year: '1980s–1990s',
    subtitle: 'El rey de la calma, videojuegos de 16-bits y "It\'s cool to be you"',
    tagline: 'El manifiesto noventero que cambió las reglas de la cultura pop juvenil.',
    keyDetails: [
      { label: 'DÉCADAS', value: '1980s–1990s' },
      { label: 'PERSONAJES', value: 'Fido Dido & Cool Spot' },
      { label: 'FILOSOFÍA', value: "It's Cool to Be You" },
      { label: 'GAMING', value: 'Super Nintendo & Sega' },
    ],
    narrative: [
      'Dibujado en una servilleta de papel por Joanna Ferrone y Sue Rose, Fido Dido —el chico zen de pelo electrizado— se convirtió en el embajador mundial de la autenticidad.',
      'Fido no juzgaba, vivía desapegado de las presiones y enseñaba que lo más valioso era ser uno mismo sin pretensiones.',
      'Simultáneamente, "Cool Spot" protagonizó videojuegos aclamados en consolas de 16-bits, combinando patinetas, gafas oscuras y synth-funk.',
    ],
    quote: {
      text: 'Fido no juzga, Fido es inocencia, Fido ve con claridad. Está genial ser vos mismo.',
      author: 'Manifiesto de Fido Dido, 1990',
    },
    badge: 'CULTURA POP',
    accentColor: '#A6FF00',
    ambientBg: 'from-[#072412] via-[#0d381c] to-[#04170a]',
    artifactTitle: 'Cool Spot 3D & Fido Canvas',
    artifactDesc: 'Esfera escarlata con gafas oscuras de sol y panel flotante con boceto a tinta de Fido Dido.',
  },
  {
    id: '06-the-uncola',
    number: '06',
    title: 'THE UNCOLA',
    year: 'Brand identity',
    subtitle: 'La mayor contracultura publicitaria y el vaso invertido',
    tagline: 'Definirse con orgullo por lo que NO eres para celebrar la autenticidad.',
    keyDetails: [
      { label: 'IDENTIDAD', value: 'The UNCOLA' },
      { label: 'AGENCIA', value: 'J. Walter Thompson' },
      { label: 'VOZ', value: 'Geoffrey Holder' },
      { label: 'DISEÑO', value: 'Vaso Invertido (Upside-Down)' },
    ],
    narrative: [
      'En lugar de competir tímidamente a la sombra de los gigantes de cola oscura, 7UP declaró una revolución: "No es una cola. Es la UNCOLA".',
      'El memorable actor teatral Geoffrey Holder popularizó la campaña con su risa barítona inconfundible y carisma hipnótico.',
      'Nació el legendario vaso Uncola invertido (con la boca abajo y la base en alto), además de una serie de pósteres psicodélicos creados por Milton Glaser y Peter Max.',
    ],
    quote: {
      text: 'No es una cola. Es la UNCOLA. Hay quienes siguen la corriente... y quienes creamos la nuestra.',
      author: 'Geoffrey Holder, 1968',
    },
    badge: 'REVOLUCIÓN',
    accentColor: '#FFCC00',
    ambientBg: 'from-[#172605] via-[#0f3616] to-[#041c0d]',
    artifactTitle: 'El Vaso Invertido Uncola 3D',
    artifactDesc: 'Cáliz de cristal invertido con burbujas suspendidas, rodaja tridimensional y anillos psicodélicos.',
  },
  {
    id: '07-today',
    number: '07',
    title: 'TODAY',
    year: '2026',
    subtitle: 'La lata clásica contemporánea: frescura 100% natural y vanguardia 3D',
    tagline: 'Casi un siglo después, la chispa original vive con máxima potencia y pureza.',
    keyDetails: [
      { label: 'AÑO', value: '2026' },
      { label: 'SABOR', value: '100% Aromas Naturales' },
      { label: 'INTERACTIVO', value: 'Modelo 3D GLB Oficial' },
      { label: 'COMPROMISO', value: 'Zero Azúcar & Aluminio Reciclable' },
    ],
    narrative: [
      'Hoy, en 2026, 7UP une casi un siglo de legado con una estética moderna de líneas limpias, sombras angulares y un verde cítrico electrizante.',
      'Elaborada sin cafeína, sin conservantes y con aceites esenciales de limón y lima 100% naturales.',
      'Explorá el modelo 3D oficial de la lata: rotalo libremente en 360°, apreciá los brillos del aluminio y sentí la frescura intacta de 1929.',
    ],
    quote: {
      text: 'Las épocas cambian. Las modas pasan. La frescura auténtica permanece intocable.',
      author: 'Filosofía Global 7UP, 2026',
    },
    badge: 'ACTUALIDAD 2026',
    accentColor: '#25C44B',
    ambientBg: 'from-[#032e15] via-[#05421a] to-[#021a0c]',
    artifactTitle: 'Lata Clásica 7UP 3D Oficial (GLB)',
    artifactDesc: 'Modelo 3D interactivo real con texturas metálicas, iluminación de estudio y rotación 360° en tiempo real.',
  },
];

interface Scrollytelling3DHistoryProps {
  onNavigate?: (page: PageId) => void;
  showFullPageLink?: boolean;
}

export const Scrollytelling3DHistory: React.FC<Scrollytelling3DHistoryProps> = ({
  onNavigate,
  showFullPageLink = false,
}) => {
  const [activeChapterIdx, setActiveChapterIdx] = useState<number>(0);
  const [isInteractiveMode, setIsInteractiveMode] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [overallProgress, setOverallProgress] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);
  const scrollTriggerInstancesRef = useRef<ScrollTrigger[]>([]);

  // Setup GSAP ScrollTrigger
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clean up any existing instances
    scrollTriggerInstancesRef.current.forEach((st) => st.kill());
    scrollTriggerInstancesRef.current = [];

    const ctx = gsap.context(() => {
      // Overall Master ScrollTrigger
      const masterST = ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          setOverallProgress(self.progress);
        },
      });
      scrollTriggerInstancesRef.current.push(masterST);

      // Chapter-specific ScrollTriggers
      sectionsRef.current.forEach((sec, idx) => {
        if (!sec) return;
        const st = ScrollTrigger.create({
          trigger: sec,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => {
            setActiveChapterIdx(idx);
            sound.playPoint();
          },
          onEnterBack: () => {
            setActiveChapterIdx(idx);
            sound.playPoint();
          },
        });
        scrollTriggerInstancesRef.current.push(st);
      });
    }, container);

    return () => {
      ctx.revert();
      scrollTriggerInstancesRef.current.forEach((st) => st.kill());
      scrollTriggerInstancesRef.current = [];
    };
  }, []);

  const jumpToChapter = (idx: number) => {
    sound.playClick();
    const target = sectionsRef.current[idx];
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const nextChapter = () => {
    const nextIdx = Math.min(STORY_CHAPTERS.length - 1, activeChapterIdx + 1);
    jumpToChapter(nextIdx);
  };

  const prevChapter = () => {
    const prevIdx = Math.max(0, activeChapterIdx - 1);
    jumpToChapter(prevIdx);
  };

  const toggleSound = () => {
    const nextMute = sound.toggleMute();
    setIsMuted(nextMute);
    if (!nextMute) sound.playClick();
  };

  const currentChapter = STORY_CHAPTERS[activeChapterIdx] || STORY_CHAPTERS[0];

  return (
    <div
      ref={containerRef}
      id="story-scrolly-container"
      className="relative w-full bg-[#05180C] text-white font-sans selection:bg-[#25C44B] selection:text-white"
    >
      {/* Top Scrollytelling Brand Bar */}
      <div className="sticky top-16 z-30 w-full px-4 sm:px-8 py-3 bg-[#05180C]/85 backdrop-blur-md border-b border-emerald-800/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#E51E2B] flex items-center justify-center font-black text-white text-xs shadow-md">
            7UP
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-black tracking-wider uppercase text-white">
                7UP — THE STORY
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-[10px] font-mono font-bold text-[#7ED957]">
                THREE.JS • GSAP SCROLLTRIGGER
              </span>
            </div>
            <p className="text-[11px] text-emerald-300/70 font-mono hidden md:block">
              Capítulo {currentChapter.number} de 07: {currentChapter.title} ({currentChapter.year})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Audio toggle */}
          <button
            type="button"
            onClick={toggleSound}
            aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
            className="p-2 rounded-full bg-emerald-900/60 hover:bg-emerald-800/80 text-emerald-200 border border-emerald-700/50 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#7ED957]" />}
          </button>

          {/* Prev / Next controls */}
          <div className="flex items-center bg-emerald-950/80 rounded-full p-0.5 border border-emerald-700/50">
            <button
              type="button"
              onClick={prevChapter}
              disabled={activeChapterIdx === 0}
              aria-label="Capítulo anterior"
              className="p-1.5 rounded-full hover:bg-emerald-800/60 text-emerald-300 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 text-xs font-mono font-bold text-emerald-200">
              {currentChapter.number}/07
            </span>
            <button
              type="button"
              onClick={nextChapter}
              disabled={activeChapterIdx === STORY_CHAPTERS.length - 1}
              aria-label="Siguiente capítulo"
              className="p-1.5 rounded-full hover:bg-emerald-800/60 text-emerald-300 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Scrollytelling Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
        {/* LEFT / STICKY COLUMN: Interactive 3D Three.js Scene */}
        <div className="lg:col-span-6 lg:sticky lg:top-36 z-20 flex flex-col items-center">
          <div className="relative w-full h-[380px] sm:h-[460px] lg:h-[540px] rounded-3xl overflow-hidden bg-radial from-[#0c391b] via-[#05210f] to-[#031107] border border-emerald-600/30 shadow-2xl">
            {/* Ambient Vignette & Gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(#7ED957_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none" />

            {/* Three.js 3D WebGL Canvas */}
            <Story3DScene
              activeChapterIdx={activeChapterIdx}
              chapterProgress={0.5}
              isInteractiveMode={isInteractiveMode}
              onToggleInteractive={() => setIsInteractiveMode((prev) => !prev)}
            />

            {/* Floating 3D Artifact Metadata Overlay */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
              <div className="px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-white shadow-lg">
                <span className="text-[10px] font-mono tracking-widest text-[#7ED957] font-bold block uppercase">
                  OBJETO 3D DEL CAPÍTULO {currentChapter.number}
                </span>
                <span className="text-xs font-bold text-white block truncate">
                  {currentChapter.artifactTitle}
                </span>
              </div>

              <div className="px-2.5 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-[10px] font-mono font-bold text-emerald-300">
                {currentChapter.year}
              </div>
            </div>

            {/* Floating Era Description Badge at bottom */}
            <div className="absolute bottom-12 left-4 right-4 pointer-events-none hidden sm:block">
              <p className="text-[11px] text-emerald-200/70 font-sans text-center bg-black/50 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/5">
                {currentChapter.artifactDesc}
              </p>
            </div>
          </div>

          {/* Quick instructions under canvas */}
          <div className="mt-3 flex items-center justify-between w-full px-2 text-[11px] font-mono text-emerald-400/70">
            <span className="flex items-center gap-1.5">
              <Rotate3d className="w-3.5 h-3.5 text-[#50E528]" />
              Podés girar e inclinar el modelo con el cursor o el dedo.
            </span>
            <span className="hidden sm:inline-block">Scrollytelling fluido</span>
          </div>
        </div>

        {/* RIGHT / SCROLLING COLUMN: The 7 Chapters Narrative */}
        <div className="lg:col-span-6 flex flex-col gap-24 py-8 lg:py-12 z-10">
          {STORY_CHAPTERS.map((chapter, idx) => {
            const isActive = activeChapterIdx === idx;

            return (
              <div
                key={chapter.id}
                ref={(el) => {
                  sectionsRef.current[idx] = el;
                }}
                id={`chapter-${chapter.id}`}
                className={`relative p-6 sm:p-8 rounded-3xl transition-all duration-500 border ${
                  isActive
                    ? 'bg-[#082915]/90 border-emerald-500/70 shadow-2xl ring-1 ring-emerald-400/30 translate-x-0'
                    : 'bg-[#061c0e]/50 border-emerald-900/40 opacity-55 hover:opacity-85'
                }`}
              >
                {/* Chapter Number & Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="text-2xl sm:text-3xl font-black font-mono tracking-tighter"
                      style={{ color: chapter.accentColor }}
                    >
                      {chapter.number}
                    </span>
                    <span className="h-4 w-[1px] bg-emerald-700/60" />
                    <span className="text-xs font-mono font-bold tracking-widest text-emerald-300 uppercase">
                      {chapter.year}
                    </span>
                  </div>

                  <span
                    className="px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase border"
                    style={{
                      borderColor: `${chapter.accentColor}50`,
                      color: chapter.accentColor,
                      backgroundColor: `${chapter.accentColor}15`,
                    }}
                  >
                    {chapter.badge}
                  </span>
                </div>

                {/* Chapter Title */}
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white uppercase mb-2">
                  {chapter.title}
                </h2>

                <p
                  className="text-sm sm:text-base font-bold mb-4"
                  style={{ color: chapter.accentColor }}
                >
                  {chapter.subtitle}
                </p>

                <p className="text-xs sm:text-sm text-emerald-200/90 italic font-serif mb-6 leading-relaxed border-l-2 pl-3 border-emerald-500/40">
                  "{chapter.tagline}"
                </p>

                {/* Key Details Pill Grid */}
                <div className="grid grid-cols-2 gap-2.5 mb-6">
                  {chapter.keyDetails.map((detail, dIdx) => (
                    <div
                      key={dIdx}
                      className="p-2.5 rounded-xl bg-black/40 border border-emerald-800/30 flex flex-col"
                    >
                      <span className="text-[9px] font-mono tracking-wider text-emerald-400/70 uppercase">
                        {detail.label}
                      </span>
                      <span className="text-xs font-bold text-white truncate">
                        {detail.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Narrative Paragraphs */}
                <div className="space-y-3 text-xs sm:text-sm text-emerald-100/80 leading-relaxed font-sans mb-6">
                  {chapter.narrative.map((par, pIdx) => (
                    <p key={pIdx}>{par}</p>
                  ))}
                </div>

                {/* Historic Quote */}
                {chapter.quote && (
                  <div className="p-4 rounded-2xl bg-black/30 border border-white/5 relative">
                    <p className="text-xs text-emerald-200/90 italic font-serif leading-relaxed">
                      "{chapter.quote.text}"
                    </p>
                    <span className="block mt-2 text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                      — {chapter.quote.author}
                    </span>
                  </div>
                )}

                {/* Quick Chapter Focus Action */}
                <div className="mt-6 pt-4 border-t border-emerald-900/50 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-emerald-400/60">
                    Capítulo {chapter.number} de 07
                  </span>

                  <button
                    type="button"
                    onClick={() => jumpToChapter(idx)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7ED957] hover:text-white transition-colors"
                  >
                    <span>Ver objeto en 3D</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Bottom Navigation Dock (The 7 Chapters) */}
      <div className="sticky bottom-4 z-40 w-full flex justify-center px-4 pointer-events-none">
        <div className="pointer-events-auto max-w-[96vw] overflow-x-auto p-1.5 rounded-full bg-[#03150a]/90 backdrop-blur-lg border border-emerald-600/40 shadow-2xl flex items-center gap-1">
          {STORY_CHAPTERS.map((ch, idx) => {
            const isAct = activeChapterIdx === idx;
            return (
              <button
                key={ch.id}
                type="button"
                onClick={() => jumpToChapter(idx)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-mono font-black tracking-tight transition-all duration-200 whitespace-nowrap flex items-center gap-1.5 ${
                  isAct
                    ? 'bg-[#50E528] text-[#05210f] shadow-md scale-105'
                    : 'text-emerald-300/80 hover:text-white hover:bg-emerald-900/50'
                }`}
              >
                <span>{ch.number}</span>
                <span className="hidden sm:inline">
                  {ch.id === '01-experiment'
                    ? 'EXPERIMENT'
                    : ch.id === '02-drink'
                    ? 'DRINK'
                    : ch.id === '03-expansion'
                    ? 'EXPANSION'
                    : ch.id === '04-evolution'
                    ? 'EVOLUTION'
                    : ch.id === '05-fido-dido'
                    ? 'FIDO DIDO'
                    : ch.id === '06-the-uncola'
                    ? 'UNCOLA'
                    : 'TODAY'}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
