import React, { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Gamepad2,
  Sparkles,
  CheckCircle2,
  MapPin,
  Calendar,
  Ticket,
  Coins,
  Store,
  Music,
  Navigation,
  ArrowRight,
  Info,
  Clock,
  Zap,
  Flame,
  Check,
  X,
  Search,
  Trophy,
  ExternalLink,
  ShieldCheck,
  Star,
} from 'lucide-react';
import { PageId } from '../types';
import { sound } from '../utils/audio';
import { FidoDidoIllustration } from '../components/FidoDidoIllustration';

interface GameProps {
  onNavigate: (page: PageId) => void;
}

export type SpotCategory = 'todos' | 'sacoa' | 'eventos' | 'estrategicos';

export interface ArcadeSpot {
  id: string;
  category: 'sacoa' | 'eventos' | 'estrategicos';
  categoryLabel: string;
  name: string;
  location: string;
  city: string;
  province: string;
  badge: string;
  badgeColor: string;
  cabinetType: string;
  perk: string;
  hours: string;
  highlight: string;
  tokensInfo: string;
}

const ARCADE_SPOTS: ArcadeSpot[] = [
  // --- SACOA NACIONAL ---
  {
    id: 'sacoa-mdp-san-martin',
    category: 'sacoa',
    categoryLabel: 'Sacoa Oficial',
    name: 'Sacoa Mar del Plata (Peatonal San Martín)',
    location: 'San Martín 2332, Mar del Plata',
    city: 'Mar del Plata',
    province: 'Buenos Aires',
    badge: 'Cuna Histórica de Sacoa',
    badgeColor: 'bg-[#E51E2B]',
    cabinetType: '2x Gabinetes Dedicados CRT 29" • Palancas Sanwa',
    perk: 'Presentá 2 latas vacías de 7UP en boletería y te cargan 4 fichas gratis en tu tarjeta Sacoa.',
    hours: 'Lunes a Domingos: 10:00 a 02:00 hs',
    highlight: 'El local original donde nació la fiebre arcade argentina. Incluye marquesina retro 7UP iluminada y modo torneo.',
    tokensInfo: 'Acepta Tarjeta Sacoa oficial y Fichas 7UP Doradas conmemorativas.',
  },
  {
    id: 'sacoa-mdp-guemes',
    category: 'sacoa',
    categoryLabel: 'Sacoa Oficial',
    name: 'Sacoa Mar del Plata (Güemes)',
    location: 'Güemes 3144, Mar del Plata',
    city: 'Mar del Plata',
    province: 'Buenos Aires',
    badge: 'Sucursal Clásica',
    badgeColor: 'bg-[#008B3E]',
    cabinetType: 'Gabinete Up to Seven Arcade • Marquesina Neón Verde',
    perk: 'High Score del día se lleva un 6-pack de 7UP helado.',
    hours: 'Todos los días: 12:00 a 01:00 hs',
    highlight: 'Zona comercial Güemes. Gabinete equipado con subwoofer bajo piso para sentir los saltos de Fido Dido.',
    tokensInfo: 'Carga de tarjeta Sacoa disponible en boletería o app.',
  },
  {
    id: 'sacoa-lavalle',
    category: 'sacoa',
    categoryLabel: 'Sacoa Oficial',
    name: 'Sacoa Microcentro (Peatonal Lavalle)',
    location: 'Lavalle 724, Ciudad Autónoma de Buenos Aires',
    city: 'CABA',
    province: 'Buenos Aires',
    badge: 'Punto Porteño Emblemático',
    badgeColor: 'bg-[#FFE600] text-black',
    cabinetType: 'Gabinete 90s Original Restaurado • 60 FPS Chiptune Audio',
    perk: 'Happy Hour de 17 a 19 hs: 2x1 en créditos para el arcade 7UP.',
    hours: 'Lunes a Sábados: 11:00 a 00:00 hs',
    highlight: 'En la calle peatonal donde comenzó el auge de los fichines porteños. Ambientación sonora fiel a 1993.',
    tokensInfo: 'Tarjeta magnética Sacoa recargable.',
  },
  {
    id: 'sacoa-abasto',
    category: 'sacoa',
    categoryLabel: 'Sacoa Oficial',
    name: 'Sacoa Shopping Abasto (Piso 3)',
    location: 'Av. Corrientes 3247, Balvanera, CABA',
    city: 'CABA',
    province: 'Buenos Aires',
    badge: 'Sede Torneos Oficiales',
    badgeColor: 'bg-[#E51E2B]',
    cabinetType: 'Doble Gabinete Enlazado • Batalla Versus 2 Jugadores',
    perk: 'Los viernes torneos relámpago con premios: remeras vintage y latas coleccionables.',
    hours: 'Domingo a Jueves: 10:00 a 22:00 hs | Viernes y Sábados: 10:00 a 00:00 hs',
    highlight: 'Puesto estratégico en el shopping más icónico sobre Av. Corrientes. Tabla de récords sincronizada.',
    tokensInfo: 'Créditos Sacoa o tapitas de 7UP con código promo.',
  },
  {
    id: 'sacoa-unicenter',
    category: 'sacoa',
    categoryLabel: 'Sacoa Oficial',
    name: 'Sacoa Unicenter Shopping',
    location: 'Paraná 3745, Martínez, Gran Buenos Aires Norte',
    city: 'Gran Buenos Aires',
    province: 'Buenos Aires',
    badge: 'Gabinete Deluxe',
    badgeColor: 'bg-[#008B3E]',
    cabinetType: 'Gabinete 4-Player Custom 7UP • Pantalla Curva CRT 33"',
    perk: 'Canje de 1 lata de 7UP fría gratis al superar los 50.000 puntos.',
    hours: 'Lunes a Domingos: 10:00 a 23:00 hs',
    highlight: 'El centro comercial más grande de zona norte. Espacio arcade ambientado con arte de Fido Dido.',
    tokensInfo: 'Tarjeta magnética Sacoa.',
  },
  {
    id: 'sacoa-rosario-cordoba',
    category: 'sacoa',
    categoryLabel: 'Sacoa Oficial',
    name: 'Sacoa Rosario (Peatonal Córdoba)',
    location: 'Córdoba 1140, Centro, Rosario',
    city: 'Rosario',
    province: 'Santa Fe',
    badge: 'Histórico Rosario',
    badgeColor: 'bg-[#E51E2B]',
    cabinetType: 'Gabinete Arcade Clásico • Controles Sanwa Originales',
    perk: '2 fichas gratis los sábados presentando cualquier producto de la línea 7UP.',
    hours: 'Lunes a Domingos: 11:00 a 23:00 hs',
    highlight: 'En pleno corazón de la peatonal rosarina. Parada obligatoria antes de caminar hacia el Monumento.',
    tokensInfo: 'Fichas tradicionales Sacoa y tarjeta digital.',
  },
  {
    id: 'sacoa-rosario-alto',
    category: 'sacoa',
    categoryLabel: 'Sacoa Oficial',
    name: 'Sacoa Alto Rosario Shopping',
    location: 'Junín 501, Rosario',
    city: 'Rosario',
    province: 'Santa Fe',
    badge: 'Zona Gamer Rosario',
    badgeColor: 'bg-[#008B3E]',
    cabinetType: 'Gabinete Custom 7UP con Dispensador de Stickers Fido Dido',
    perk: 'Sticker holográfico de Fido Dido gratis por cada partida completada.',
    hours: 'Todos los días: 10:00 a 22:30 hs',
    highlight: 'Dentro del complejo Alto Rosario, junto al patio de comidas y cines.',
    tokensInfo: 'Tarjeta recargable Sacoa.',
  },
  {
    id: 'sacoa-cordoba-olmos',
    category: 'sacoa',
    categoryLabel: 'Sacoa Oficial',
    name: 'Sacoa Córdoba (Patio Olmos Shopping)',
    location: 'Av. Vélez Sarsfield 361, Córdoba Capital',
    city: 'Córdoba',
    province: 'Córdoba',
    badge: 'Sede Central Córdoba',
    badgeColor: 'bg-[#FFE600] text-black',
    cabinetType: 'Gabinete Retro Iluminado • Sonido Estéreo Alta Fidelidad',
    perk: 'Top 3 del ranking cordobés clasifica al Torneo Nacional 7UP.',
    hours: 'Lunes a Domingos: 10:00 a 22:00 hs',
    highlight: 'Punto de encuentro indiscutido de la juventud cordobesa. Pantalla CRT con filtro retro scanline auténtico.',
    tokensInfo: 'Tarjeta Sacoa.',
  },
  {
    id: 'sacoa-mendoza-palmares',
    category: 'sacoa',
    categoryLabel: 'Sacoa Oficial',
    name: 'Sacoa Mendoza (Palmares Open Mall)',
    location: 'Ruta Panamericana 2650, Godoy Cruz, Mendoza',
    city: 'Mendoza',
    province: 'Mendoza',
    badge: 'Cuyo Oficial',
    badgeColor: 'bg-[#008B3E]',
    cabinetType: 'Gabinete 7UP Fresh Edition • Pantalla CRT 29"',
    perk: 'Canje de merchandising Fido Dido con tickets del juego.',
    hours: 'Lunes a Domingos: 11:00 a 23:00 hs',
    highlight: 'Espacio recreativo al aire libre con sala arcade completa y vistas a la cordillera.',
    tokensInfo: 'Tarjeta magnética Sacoa.',
  },
  {
    id: 'sacoa-bariloche',
    category: 'sacoa',
    categoryLabel: 'Sacoa Oficial',
    name: 'Sacoa Bariloche (Calle Mitre)',
    location: 'Bartolomé Mitre 340, San Carlos de Bariloche',
    city: 'Bariloche',
    province: 'Río Negro',
    badge: 'Edición Invernal',
    badgeColor: 'bg-[#E51E2B]',
    cabinetType: 'Gabinete Calefaccionado con Arte Vintage 7UP en Nieve',
    perk: 'Chocolate caliente con 7UP Mocktail de bienvenida a los mejores récords.',
    hours: 'Lunes a Domingos: 14:00 a 01:00 hs',
    highlight: 'A dos cuadras del Centro Cívico. El refugio perfecto después de esquiar o recorrer el lago Nahuel Huapi.',
    tokensInfo: 'Fichas y Tarjeta Sacoa.',
  },

  // --- EVENTOS SPONSOR 7UP ---
  {
    id: 'evento-lollapalooza',
    category: 'eventos',
    categoryLabel: 'Evento Sponsor 7UP',
    name: 'Lollapalooza Argentina • Domo 7UP Fresh Oasis',
    location: 'Hipódromo de San Isidro, Buenos Aires',
    city: 'Gran Buenos Aires',
    province: 'Buenos Aires',
    badge: 'Festival Sponsor Oficial',
    badgeColor: 'bg-[#7ED957] text-[#05421A]',
    cabinetType: 'Batería de 6 Gabinetes Arcade en Red • Free Play continuo',
    perk: 'Juego libre y gratuito para asistentes del festival + latas heladas de regalo para quienes pasen el nivel 3.',
    hours: 'Durante los 3 días del festival: 12:00 a 01:00 hs',
    highlight: 'El domo gamer inmersivo de 7UP con aire acondicionado, barra de bebidas heladas, DJs y torneos relámpago.',
    tokensInfo: 'Acceso libre (Free Play) para todo el público del festival.',
  },
  {
    id: 'evento-cosquin-rock',
    category: 'eventos',
    categoryLabel: 'Evento Sponsor 7UP',
    name: 'Cosquín Rock • Carpa Retro 7UP',
    location: 'Aeródromo Santa María de Punilla, Valle de Punilla, Córdoba',
    city: 'Córdoba',
    province: 'Córdoba',
    badge: 'Rock & Frescura',
    badgeColor: 'bg-[#FFE600] text-black',
    cabinetType: '4 Gabinetes Blindados de Uso Rudo • Sonido Envolvente',
    perk: 'Descansá del pogo jugando al 7UP Arcade con agua y gaseosa helada bonificada.',
    hours: 'Jornadas del festival: 14:00 a 03:00 hs',
    highlight: 'El espacio de refresco más concurrido del festival. Competición de bandas y público por el High Score.',
    tokensInfo: 'Fichas 7UP distribuidas gratis por promotores.',
  },
  {
    id: 'evento-primavera-sound',
    category: 'eventos',
    categoryLabel: 'Evento Sponsor 7UP',
    name: 'Primavera Sound Buenos Aires • Zona Chill & Arcade',
    location: 'Parque Sarmiento, CABA',
    city: 'CABA',
    province: 'Buenos Aires',
    badge: 'Festival Internacional',
    badgeColor: 'bg-[#7ED957] text-[#05421A]',
    cabinetType: 'Gabinetes con Estética Cyberpunk 90s y Neón Verde',
    perk: 'Gorras vintage Fido Dido exclusivas para quienes completen el juego entero.',
    hours: 'Durante el festival: 13:00 a 02:00 hs',
    highlight: 'Sector ambientado con visuales glitch, sintetizadores y la frescura de 7UP.',
    tokensInfo: 'Free Play presentando pulsera del festival.',
  },
  {
    id: 'evento-bresh-mar-del-plata',
    category: 'eventos',
    categoryLabel: 'Evento Sponsor 7UP',
    name: 'Fiesta Bresh & After Beach 7UP',
    location: 'Silos del Puerto / Mute Club de Mar, Mar del Plata',
    city: 'Mar del Plata',
    province: 'Buenos Aires',
    badge: 'Pop-Up Nocturno',
    badgeColor: 'bg-[#E51E2B]',
    cabinetType: 'Gabinetes Lumínicos LED Reactivos al Ritmo de la Música',
    perk: 'Tragos especiales con 7UP y fichas de regalo al ingresar antes de las 01:00 hs.',
    hours: 'Noches seleccionadas de verano: 23:30 a 06:00 hs',
    highlight: 'El crossover definitivo entre la fiesta más linda y los fichines de la infancia en la costa.',
    tokensInfo: 'Fichas de cortesía en la barra 7UP.',
  },
  {
    id: 'evento-ags',
    category: 'eventos',
    categoryLabel: 'Evento Sponsor 7UP',
    name: 'Argentina Game Show (AGS) • Stand Oficial 7UP',
    location: 'Centro Costa Salguero, Costanera Norte, CABA',
    city: 'CABA',
    province: 'Buenos Aires',
    badge: 'Convención Gamer',
    badgeColor: 'bg-[#008B3E]',
    cabinetType: 'Arena de Competencia Arcade con Transmisión en Pantalla Gigante',
    perk: 'El ganador del torneo se lleva un gabinete arcade real 7UP a escala para su casa.',
    hours: 'Viernes a Domingo: 12:00 a 21:00 hs',
    highlight: 'La fiesta gamer más grande del país. Presencia de Fido Dido en tamaño real y meet & greet.',
    tokensInfo: 'Inscripción gratuita en el stand de 7UP.',
  },

  // --- PUNTOS ESTRATÉGICOS & POP-UPS ---
  {
    id: 'punto-kiosco-corrientes',
    category: 'estrategicos',
    categoryLabel: 'Punto Estratégico',
    name: 'Kiosco Porteño Histórico (Corrientes & Callao)',
    location: 'Av. Corrientes 1780, esquina Callao, CABA',
    city: 'CABA',
    province: 'Buenos Aires',
    badge: 'Bartop Callejero',
    badgeColor: 'bg-[#FFE600] text-black',
    cabinetType: 'Bartop Arcade de Madera Montado en Mostrador de Kiosco',
    perk: 'Comprando una lata de 7UP helada te dan 2 créditos para jugar al paso.',
    hours: 'Abierto 24 Horas',
    highlight: 'Como en los viejos tiempos: jugás tu partida en la vereda mientras esperás el bondi o salís del teatro.',
    tokensInfo: 'Fichas con la compra de latas de 7UP.',
  },
  {
    id: 'punto-la-florida-rosario',
    category: 'estrategicos',
    categoryLabel: 'Punto Estratégico',
    name: 'Parador 7UP La Florida (Costanera Norte Rosario)',
    location: 'Av. Costanera y Escauriza, Balneario La Florida, Rosario',
    city: 'Rosario',
    province: 'Santa Fe',
    badge: 'Playero / Río Paraná',
    badgeColor: 'bg-[#7ED957] text-[#05421A]',
    cabinetType: 'Gabinete Climatizado Resistente a Intemperie frente a la Playa',
    perk: 'Canjeá 3 tapitas doradas por una ficha y un vaso térmico coleccionable.',
    hours: 'Martes a Domingos: 10:00 a 20:00 hs (Temporada de Primavera/Verano)',
    highlight: 'Disfrutá la brisa del Paraná con un 7UP con hielo y jugá al nivel fluvial del videojuego.',
    tokensInfo: 'Canje de tapitas con promotores 7UP.',
  },
  {
    id: 'punto-bunge-pinamar',
    category: 'estrategicos',
    categoryLabel: 'Punto Estratégico',
    name: 'Parador Bunge & Playa 7UP (Pinamar)',
    location: 'Av. Bunge y Costanera, Pinamar, Costa Atlántica',
    city: 'Costa Atlántica',
    province: 'Buenos Aires',
    badge: 'Temporada Verano',
    badgeColor: 'bg-[#E51E2B]',
    cabinetType: 'Pop-Up Truck 7UP con 3 Gabinetes Arcade Retro',
    perk: 'Torneos diarios a las 18:00 hs con packs de 7UP y toallas playeras.',
    hours: 'Diciembre a Marzo: 11:00 a 22:00 hs',
    highlight: 'El spot veraniego por excelencia para cortar la playa y desafiar a tus amigos.',
    tokensInfo: 'Partidas gratis para consumidores de 7UP.',
  },
  {
    id: 'punto-subte-retiro',
    category: 'estrategicos',
    categoryLabel: 'Punto Estratégico',
    name: 'Pop-Up 7UP Estación Retiro & Subte A/D',
    location: 'Hall Central Estación Retiro Mitre, CABA',
    city: 'CABA',
    province: 'Buenos Aires',
    badge: 'Tránsito Diario',
    badgeColor: 'bg-[#008B3E]',
    cabinetType: 'Gabinete Compacto de Alta Velocidad para Partidas Rápidas',
    perk: 'Partida relámpago de 3 minutos para pasar el tiempo mientras llega el tren.',
    hours: 'Lunes a Viernes: 07:00 a 21:00 hs',
    highlight: 'El mismo subte y estación que aparecen dentro del Nivel 1 del juego. ¡Ficción y realidad combinadas!',
    tokensInfo: 'Fichas entregadas por promotoras 7UP.',
  },
  {
    id: 'punto-monumento-rosario',
    category: 'estrategicos',
    categoryLabel: 'Punto Estratégico',
    name: 'Kiosco El Monumento (Av. Belgrano & Rioja)',
    location: 'Av. Belgrano 650, Rosario',
    city: 'Rosario',
    province: 'Santa Fe',
    badge: 'Punto Icónico',
    badgeColor: 'bg-[#FFE600] text-black',
    cabinetType: 'Gabinete Clásico 7UP con marquesina de Fido Dido',
    perk: 'High Score semanal gana foto enmarcada en el hall y pack de latas.',
    hours: 'Lunes a Domingos: 09:00 a 23:00 hs',
    highlight: 'Frente al Parque Nacional a la Bandera. Punto de encuentro de miles de jóvenes y familias.',
    tokensInfo: 'Fichas arcade en mostrador.',
  },
];

export const Game: React.FC<GameProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<SpotCategory>('todos');
  const [selectedCity, setSelectedCity] = useState<string>('todas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSpotModal, setSelectedSpotModal] = useState<ArcadeSpot | null>(null);

  const downloadSectionRef = useRef<HTMLDivElement | null>(null);

  // Filter spots
  const filteredSpots = useMemo(() => {
    return ARCADE_SPOTS.filter((spot) => {
      // Category filter
      if (activeTab !== 'todos' && spot.category !== activeTab) {
        return false;
      }
      // City filter
      if (selectedCity !== 'todas') {
        if (selectedCity === 'caba' && spot.city !== 'CABA' && spot.city !== 'Gran Buenos Aires') {
          return false;
        }
        if (selectedCity === 'mdp' && spot.city !== 'Mar del Plata') {
          return false;
        }
        if (selectedCity === 'rosario' && spot.city !== 'Rosario') {
          return false;
        }
        if (selectedCity === 'cordoba' && spot.city !== 'Córdoba') {
          return false;
        }
        if (selectedCity === 'mendoza' && spot.city !== 'Mendoza') {
          return false;
        }
        if (selectedCity === 'costa' && spot.city !== 'Costa Atlántica' && spot.city !== 'Mar del Plata') {
          return false;
        }
      }
      // Search query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesName = spot.name.toLowerCase().includes(q);
        const matchesLoc = spot.location.toLowerCase().includes(q);
        const matchesCity = spot.city.toLowerCase().includes(q);
        const matchesPerk = spot.perk.toLowerCase().includes(q);
        return matchesName || matchesLoc || matchesCity || matchesPerk;
      }
      return true;
    });
  }, [activeTab, selectedCity, searchQuery]);

  const handleOpenSpotDetails = (spot: ArcadeSpot) => {
    sound.playClick();
    setSelectedSpotModal(spot);
  };

  const handleClaimTokensInfo = () => {
    sound.playBonus();
    // Scroll smoothly or open details
    if (downloadSectionRef.current) {
      downloadSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full flex flex-col pt-24 sm:pt-28 pb-20 overflow-hidden">
      {/* ===================================================
          1. HERO HEADER: INTRODUCCIÓN AL JUEGO
          =================================================== */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 text-center">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-72 rounded-full bg-[#008B3E]/15 blur-3xl -z-10 pointer-events-none" />

        <div className="flex flex-col items-center gap-4 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#008B3E] text-white text-xs font-black tracking-wider uppercase shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FFE600]" />
            <span>NIVEL 1 DEMO OFICIAL EN LÍNEA • EL JUEGO COMPLETO ESTÁ EN LOS ARCADES</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black text-[#05421A] dark:text-[#E8F8EC] tracking-tight leading-[1.08]"
          >
            7UP: ATRAPA LA FRESCURA
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-emerald-950/75 dark:text-emerald-200/80 leading-relaxed font-medium"
          >
            ¡Probá la demo oficial del Nivel 1 acá mismo en el navegador! Para jugar el juego entero con todos los mundos y batallas finales, encontrá las maquinitas arcade físicas en todos los Sacoa del país, eventos sponsor 7UP y puntos estratégicos.
          </motion.p>
        </div>
      </section>

      {/* ===================================================
          2. JUEGO ARCADE EN VIVO (UP TO SEVEN: NIVEL 1)
          =================================================== */}
      <section id="arcade-game-section" className="w-full max-w-[1600px] mx-auto px-2 sm:px-4 lg:px-6 py-2 sm:py-4">
        <div className="relative rounded-[32px] sm:rounded-[40px] bg-[#071F11] border-4 border-[#0F6B3A] dark:border-[#25D366]/40 p-2.5 sm:p-5 shadow-2xl overflow-hidden">
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-3 px-2 border-b border-emerald-800/60">
            <div className="flex items-center gap-3">
              <div className="w-3.5 h-3.5 rounded-full bg-[#E51E2B] animate-pulse" />
              <div className="w-3.5 h-3.5 rounded-full bg-[#FFE600]" />
              <div className="w-3.5 h-3.5 rounded-full bg-[#25D366]" />
              <span className="font-['Press_Start_2P',monospace] text-xs sm:text-sm text-[#FFE600] tracking-wider ml-2">
                UP TO SEVEN • ARCADE 90s
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#B8CDB0] hidden sm:inline">
                🎮 Controles: Flechas / A-D • Espacio / W para saltar • S para subte
              </span>
            </div>
          </div>

          {/* Game iFrame Container (Much larger, full viewport height presence) */}
          <div className="relative w-full h-[80vh] min-h-[620px] sm:min-h-[760px] lg:min-h-[860px] rounded-2xl overflow-hidden mt-3 bg-black shadow-inner border-2 border-black">
            <iframe
              src="/game.html"
              title="Up to Seven: nivel 1, Buenos Aires"
              className="w-full h-full border-0 block"
              allow="fullscreen; autoplay"
            />
          </div>

          {/* Quick instructions bar */}
          <div className="mt-4 pt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-[#B8CDB0] font-mono px-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-[#0F6B3A]/60 text-white font-bold border border-emerald-600/40">
                Limas &amp; Tapitas
              </span>
              <span>¡Juntá las 7 tapitas y llegá al kiosco para canjear tu Seven Up helada!</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#FFE600] font-bold">Demo jugable en navegador • El juego completo en maquinitas</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          3. SECCIÓN DEL JUEGO COMPLETO: MAQUINITAS ARCADE REALES
             (EN TODOS LOS SACOA, EVENTOS 7UP Y PUNTOS ESTRATÉGICOS)
          =================================================== */}
      <section
        ref={downloadSectionRef}
        id="descargar-seccion"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24"
      >
        <div className="relative rounded-[36px] bg-linear-to-br from-[#042B12] via-[#02200D] to-[#011408] border-2 border-emerald-500/30 p-6 sm:p-12 lg:p-14 text-white shadow-2xl overflow-hidden">
          {/* Ambient Glows */}
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#7ED957]/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-[#E51E2B]/15 blur-3xl pointer-events-none" />

          {/* Section Main Header */}
          <div className="relative z-10 mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E51E2B] text-white font-black text-xs uppercase tracking-wider shadow-md mb-4">
              <Gamepad2 className="w-4 h-4 text-white animate-pulse" />
              <span>GABINETES ARCADE FÍSICOS • EXPERIENCIA 90s EXCLUSIVA</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              ¿QUERÉS JUGAR EL JUEGO ENTERO? <br />
              <span className="text-[#7ED957]">BUSCÁ LAS MAQUINITAS ARCADE DE 7UP</span>
            </h2>

            <p className="text-sm sm:text-base text-emerald-100/80 mt-3 max-w-3xl leading-relaxed">
              El juego completo no se descarga en computadoras ni celulares: <strong>se juega en persona con palanca y botones reales</strong>. Para desbloquear todos los mundos y clasificar en el High Score, encontrá los gabinetes arcade oficiales de 7UP en las salas Sacoa de todo el país, festivales sponsor y puntos estratégicos.
            </p>
          </div>

          {/* Interactive Spot Finder Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10 pt-2">
            {/* Left 8 Cols: Filter Controls & Spots Grid */}
            <div className="lg:col-span-8 flex flex-col gap-5 text-left">
              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setActiveTab('todos');
                  }}
                  className={`px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                    activeTab === 'todos'
                      ? 'bg-[#7ED957] text-[#05421A] shadow-md'
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
                >
                  Todos los puntos ({ARCADE_SPOTS.length})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setActiveTab('sacoa');
                  }}
                  className={`px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'sacoa'
                      ? 'bg-[#E51E2B] text-white shadow-md'
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
                >
                  <Gamepad2 className="w-3.5 h-3.5" />
                  <span>Salas Sacoa (Nacional)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setActiveTab('eventos');
                  }}
                  className={`px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'eventos'
                      ? 'bg-[#008B3E] text-white shadow-md'
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
                >
                  <Music className="w-3.5 h-3.5" />
                  <span>Eventos Sponsor 7UP</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setActiveTab('estrategicos');
                  }}
                  className={`px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'estrategicos'
                      ? 'bg-[#FFE600] text-black shadow-md'
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>Puntos Estratégicos</span>
                </button>
              </div>

              {/* Search & City Filter Bar */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-300/60" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar por sucursal, ciudad o festival..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-emerald-500/25 text-white placeholder-emerald-300/40 text-xs focus:outline-none focus:border-[#7ED957]"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-xs"
                    >
                      Limpiar
                    </button>
                  )}
                </div>

                {/* City Quick Pills / Select */}
                <select
                  value={selectedCity}
                  onChange={(e) => {
                    sound.playClick();
                    setSelectedCity(e.target.value);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-black/40 border border-emerald-500/25 text-white text-xs font-bold focus:outline-none focus:border-[#7ED957] cursor-pointer"
                >
                  <option value="todas">Todas las Ciudades</option>
                  <option value="caba">Buenos Aires &amp; CABA</option>
                  <option value="mdp">Mar del Plata</option>
                  <option value="rosario">Rosario</option>
                  <option value="cordoba">Córdoba</option>
                  <option value="mendoza">Mendoza</option>
                  <option value="costa">Costa Atlántica</option>
                </select>
              </div>

              {/* Spots Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-2 max-h-[560px] overflow-y-auto pr-1">
                {filteredSpots.length === 0 ? (
                  <div className="col-span-full p-8 text-center bg-black/30 rounded-2xl border border-white/10">
                    <p className="text-sm text-emerald-200/70">
                      No se encontraron puntos para ese filtro. Probá seleccionando "Todas las ciudades" o limpiando el buscador.
                    </p>
                  </div>
                ) : (
                  filteredSpots.map((spot) => (
                    <div
                      key={spot.id}
                      onClick={() => handleOpenSpotDetails(spot)}
                      className="p-4 rounded-2xl bg-black/40 border border-emerald-500/20 hover:border-emerald-400/50 hover:bg-black/60 transition-all cursor-pointer flex flex-col justify-between group"
                    >
                      <div>
                        {/* Header Badges */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${spot.badgeColor}`}
                          >
                            {spot.badge}
                          </span>
                          <span className="text-[10px] font-mono text-emerald-300/70">
                            {spot.city}
                          </span>
                        </div>

                        <h4 className="text-sm font-black text-white group-hover:text-[#7ED957] transition-colors leading-snug">
                          {spot.name}
                        </h4>

                        <div className="flex items-start gap-1.5 mt-1 text-[11px] text-emerald-100/70">
                          <MapPin className="w-3.5 h-3.5 text-[#FFE600] shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{spot.location}</span>
                        </div>

                        <p className="text-[11px] text-emerald-300/80 mt-2 line-clamp-2">
                          🕹️ {spot.cabinetType}
                        </p>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px]">
                        <span className="text-[#FFE600] font-bold">Ver cómo jugar</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#7ED957] group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right 4 Cols: Mascot Message & Arcade Guide */}
            <div className="lg:col-span-4 flex flex-col items-center">
              <div className="w-full relative p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#071F0F] text-[#05421A] dark:text-[#E8F8EC] shadow-2xl border-4 border-[#05421A] dark:border-emerald-600 flex flex-col items-center">
                {/* 90s Badge */}
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-sm bg-[#FFE600] text-black font-mono text-[10px] font-black tracking-widest uppercase border border-black/20">
                  FILOSOFÍA ARCADE • FIDO DIDO
                </div>

                {/* Fido Illustration */}
                <div className="w-44 h-52 flex items-center justify-center mt-2">
                  <FidoDidoIllustration className="w-40 h-52" pose="thumbs_up" />
                </div>

                {/* Speech Card */}
                <div className="mt-2 p-3 rounded-2xl bg-emerald-50 dark:bg-[#0C2A15] border border-emerald-200 dark:border-emerald-700/60 text-center w-full">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#008B3E] dark:text-[#50E528] font-bold block">
                    MENSAJE DE FIDO DIDO
                  </span>
                  <p className="text-xs font-bold text-[#05421A] dark:text-[#E8F8EC] mt-1 leading-relaxed">
                    &ldquo;Los clásicos no se juegan en un teclado. Se juegan parado frente a la máquina, con palanca de fierro, botones de verdad y un 7UP helado al lado.&rdquo;
                  </p>
                </div>

                {/* 3 Steps Guide for Arcade */}
                <div className="w-full mt-4 pt-3 border-t border-emerald-100 dark:border-emerald-800/60 flex flex-col gap-2.5 text-xs text-left">
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-[#008B3E] text-white font-mono text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </div>
                    <div>
                      <strong className="block text-[#05421A] dark:text-white">Llevá tu lata o tapita 7UP</strong>
                      <span className="text-emerald-900/70 dark:text-emerald-300/70 text-[11px]">
                        En Sacoa y eventos sponsor te acreditan fichas bonus en boletería.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-[#008B3E] text-white font-mono text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </div>
                    <div>
                      <strong className="block text-[#05421A] dark:text-white">Jugá los 5 niveles completos</strong>
                      <span className="text-emerald-900/70 dark:text-emerald-300/70 text-[11px]">
                        Superá Buenos Aires, Rosario, Córdoba, la Costa y la Fábrica Secreta.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-[#008B3E] text-white font-mono text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                      3
                    </div>
                    <div>
                      <strong className="block text-[#05421A] dark:text-white">Grabá tus 3 iniciales en el High Score</strong>
                      <span className="text-emerald-900/70 dark:text-emerald-300/70 text-[11px]">
                        El Top 10 del mes gana camperas retro Fido Dido y 7UP gratis por un año.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="w-full mt-5 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => onNavigate('productos')}
                    className="w-full py-3 px-4 rounded-full bg-[#008B3E] hover:bg-[#007333] text-white font-black text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <MapPin className="w-4 h-4" />
                    <span>Ver Mapa de Puntos 7UP</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleClaimTokensInfo}
                    className="w-full py-2.5 px-4 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-[#05421A] dark:text-emerald-100 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Coins className="w-3.5 h-3.5 text-[#008B3E] dark:text-[#7ED957]" />
                    <span>Reglamento de Fichas</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          4. MODAL INTERACTIVO DE DETALLES DEL GABINETE ARCADE
          =================================================== */}
      <AnimatePresence>
        {selectedSpotModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#082010] text-[#05421A] dark:text-[#E8F8EC] border-4 border-[#008B3E] dark:border-emerald-500 shadow-2xl overflow-hidden"
            >
              {/* Close button */}
              <button
                type="button"
                id="close-spot-modal-btn"
                onClick={() => setSelectedSpotModal(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-emerald-900/60 dark:text-emerald-200/70 hover:text-emerald-950 dark:hover:text-white hover:bg-emerald-100 dark:hover:bg-emerald-800/40 transition-colors"
                aria-label="Cerrar detalles del arcade"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col text-left">
                {/* Badge Category */}
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${selectedSpotModal.badgeColor}`}
                  >
                    {selectedSpotModal.categoryLabel}
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300">
                    {selectedSpotModal.city}, {selectedSpotModal.province}
                  </span>
                </div>

                <h3 className="text-2xl font-black text-[#05421A] dark:text-[#E8F8EC] leading-tight">
                  {selectedSpotModal.name}
                </h3>

                <div className="flex items-center gap-2 text-xs text-emerald-900/80 dark:text-emerald-200/80 mt-2">
                  <MapPin className="w-4 h-4 text-[#E51E2B] shrink-0" />
                  <span className="font-bold">{selectedSpotModal.location}</span>
                </div>

                <div className="mt-4 p-4 rounded-2xl bg-emerald-50 dark:bg-[#0C2A15] border border-emerald-200 dark:border-emerald-700/60 flex flex-col gap-2.5 text-xs">
                  <div>
                    <strong className="text-[#05421A] dark:text-emerald-200 block text-[11px] uppercase tracking-wider">
                      🕹️ Hardware &amp; Gabinete:
                    </strong>
                    <span className="text-emerald-950/80 dark:text-emerald-100 font-medium">
                      {selectedSpotModal.cabinetType}
                    </span>
                  </div>

                  <div>
                    <strong className="text-[#05421A] dark:text-emerald-200 block text-[11px] uppercase tracking-wider">
                      ⭐ Beneficio / Promoción 7UP:
                    </strong>
                    <span className="text-emerald-950/80 dark:text-emerald-100 font-medium">
                      {selectedSpotModal.perk}
                    </span>
                  </div>

                  <div>
                    <strong className="text-[#05421A] dark:text-emerald-200 block text-[11px] uppercase tracking-wider">
                      🪙 Fichas y Créditos:
                    </strong>
                    <span className="text-emerald-950/80 dark:text-emerald-100 font-medium">
                      {selectedSpotModal.tokensInfo}
                    </span>
                  </div>

                  <div>
                    <strong className="text-[#05421A] dark:text-emerald-200 block text-[11px] uppercase tracking-wider">
                      🕒 Horarios de Atención:
                    </strong>
                    <span className="text-emerald-950/80 dark:text-emerald-100 font-medium">
                      {selectedSpotModal.hours}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-emerald-900/70 dark:text-emerald-200/70 mt-3 leading-relaxed">
                  {selectedSpotModal.highlight}
                </p>

                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedSpotModal(null)}
                    className="flex-1 py-3 px-4 rounded-full bg-[#008B3E] hover:bg-[#007333] text-white font-black text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer text-center"
                  >
                    ¡Entendido, voy a jugar ahí!
                  </button>

                  {selectedSpotModal.city === 'Rosario' && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedSpotModal(null);
                        onNavigate('productos');
                      }}
                      className="py-3 px-4 rounded-full bg-emerald-100 dark:bg-emerald-900/60 hover:bg-emerald-200 dark:hover:bg-emerald-800/60 text-[#05421A] dark:text-emerald-100 font-bold text-xs uppercase transition-colors cursor-pointer text-center"
                    >
                      Ver en Mapa Rosario
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

