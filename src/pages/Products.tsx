import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  ArrowRight,
  Check,
  Droplets,
  Heart,
  Volume2,
  RefreshCw,
  Image as ImageIcon,
  MapPin,
  Package,
  Shirt,
  Wine
} from 'lucide-react';
import { PageId, ProductVariety, ProductVarietyId } from '../types';
import { PRODUCT_LIST, PRODUCT_VARIETIES } from '../data/products';
import { ROSARIO_DISPENSER_SPOTS, DispenserSpot } from '../data/capsulaSpots';
import { sound } from '../utils/audio';
import { useAllCanImages } from '../utils/useCanImages';
import { CanImageUploaderModal } from '../components/CanImageUploaderModal';
import { RosarioSpotsMap } from '../components/RosarioSpotsMap';
import { CapsulaMerchShowcase } from '../components/CapsulaMerchShowcase';
import { CapsulaHeroDispenser } from '../components/CapsulaHeroDispenser';

interface ProductsProps {
  onNavigate: (page: PageId) => void;
}

export const Products: React.FC<ProductsProps> = ({ onNavigate }) => {
  const canImages = useAllCanImages();
  const [viewMode, setViewMode] = useState<'capsula' | 'bebidas'>('capsula');
  const [selectedSpot, setSelectedSpot] = useState<DispenserSpot>(ROSARIO_DISPENSER_SPOTS[0]);
  const [isUploaderOpen, setIsUploaderOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<ProductVarietyId>('original');
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [openedMap, setOpenedMap] = useState<Record<string, boolean>>({});

  const handleNav = (page: PageId) => {
    sound.playClick();
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick();
    setLikedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCanClick = (productId: ProductVarietyId) => {
    sound.playCanOpen();
    setActiveTab(productId);
    setOpenedMap((prev) => ({ ...prev, [productId]: true }));
  };

  const featured = PRODUCT_VARIETIES[activeTab] || PRODUCT_VARIETIES.original;
  const isFeaturedOpen = Boolean(openedMap[featured.id]);

  return (
    <div className="w-full flex flex-col pt-16 sm:pt-20 pb-16">
      {/* ===================================================
          VIEW 1: CÁPSULA STREETWEAR & DISPENSERS EN ROSARIO
          =================================================== */}
      {viewMode === 'capsula' ? (
        <div className="w-full flex flex-col animate-in fade-in duration-300">
          {/* Full-width Banner Hero Cápsula */}
          <section
            id="capsula-hero"
            className="w-full relative overflow-hidden bg-linear-to-r from-white dark:from-[#01592A] via-white dark:via-[#01592A] to-[#F1F6D5] dark:to-[#01592A] text-[#01592A] dark:text-white py-12 sm:py-16 lg:py-20 shadow-xl border-b-4 border-[#A4D902]"
          >
            {/* Ambient decorative glow and patterns */}
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#A4D902]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-[600px] h-[600px] bg-[#A4D902]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* Columna Izquierda: Título y Bajada */}
                <div className="lg:col-span-6 flex flex-col text-left">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#01592A] dark:text-white tracking-tight uppercase leading-[1.05] drop-shadow-md">
                    DISPENSER 7UP: <br />
                    <span className="text-[#01592A] dark:text-[#A4D902]">CÁPSULA EXCLUSIVA</span>
                  </h1>

                  <p className="text-lg sm:text-xl text-[#01592A]/80 dark:text-emerald-100 font-medium mt-5 leading-relaxed max-w-2xl">
                    Encontrá las máquinas expendedoras de 7UP con indumentaria y prendas exclusivas listas para retirar en las calles de Rosario.
                  </p>

                  <p className="text-sm sm:text-base text-[#01592A]/80 dark:text-emerald-200/80 mt-3 font-normal leading-relaxed max-w-xl">
                    Espacio reservado para descripción adicional o bajada complementaria de la campaña.
                  </p>
                </div>

                {/* Columna Derecha: Imagen al Costado */}
                <div className="lg:col-span-6 flex justify-center items-center">
                  <div className="w-full flex items-center justify-center p-0">
                    <img
                      src="/Expendedora.png"
                      alt="Expendedora 7UP Cápsula"
                      className="w-full max-w-lg sm:max-w-xl lg:max-w-2xl max-h-[480px] sm:max-h-[560px] object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)] transition-all duration-300 hover:scale-[1.02]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Rosario Spots Map & Location Directory */}
          <RosarioSpotsMap
            selectedSpot={selectedSpot}
            onSelectSpot={setSelectedSpot}
          />

          {/* Merch & Clothing Items Showcase */}
          <CapsulaMerchShowcase />
        </div>
      ) : (
        /* ===================================================
            VIEW 2: GAMA DE BEBIDAS & SABORES TRADICIONAL
            =================================================== */
        <div className="w-full flex flex-col animate-in fade-in duration-300">
          <section id="products-hero" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black tracking-widest uppercase mb-4"
            >
              <Droplets className="w-3.5 h-3.5 text-emerald-600" />
              <span>GAMA COMPLETA DE BEBIDAS</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-6xl font-black text-[#01592A] dark:text-[#F1F6D5] tracking-tight uppercase"
            >
              PRODUCTOS Y SABORES
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg sm:text-xl font-extrabold text-[#01592A] dark:text-[#029F3D] max-w-xl mx-auto mt-2 uppercase tracking-wide"
            >
              LA FRESCURA EN TODAS SUS FORMAS.
            </motion.p>

            <p className="text-sm sm:text-base text-emerald-950/70 dark:text-emerald-200/80 max-w-2xl mx-auto mt-3 font-medium">
              Diseñado para despertar tus sentidos con el auténtico golpe cítrico de limón y lima. Tocá cualquier lata para destaparla y escuchar el característico efecto de sonido con efervescencia real.
            </p>

            {/* Button to open custom can image manager */}
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={() => setIsUploaderOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-emerald-800 dark:text-emerald-200 bg-emerald-100/80 dark:bg-[#0D2815] hover:bg-emerald-200/80 dark:hover:bg-[#15381F] border border-emerald-300/80 dark:border-emerald-700/60 transition-all hover:scale-105 active:scale-95 shadow-xs"
              >
                <ImageIcon className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                <span>Gestionar / Personalizar imágenes de latas</span>
              </button>
            </div>
          </section>

          {/* Product Cards (Interactive 4-Can Catalog) */}
          <section id="products-catalog-cards" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {PRODUCT_LIST.map((product) => {
                const isSelected = activeTab === product.id;
                const isLiked = likedMap[product.id];
                const isOpen = Boolean(openedMap[product.id]);

                return (
                  <motion.div
                    key={product.id}
                    id={`product-card-${product.id}`}
                    whileHover={{ y: -8 }}
                    onClick={() => handleCanClick(product.id)}
                    className={`relative rounded-3xl p-6 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden border-2 ${
                      isSelected
                        ? 'border-[#01592A] bg-white dark:bg-[#0F2D18] shadow-xl scale-[1.02]'
                        : 'border-emerald-100 dark:border-emerald-800/60 bg-white/80 dark:bg-[#0A1F10]/80 hover:bg-white dark:hover:bg-[#0E2816] hover:border-emerald-300 dark:hover:border-emerald-600/60 shadow-sm'
                    }`}
                  >
                    {/* Top Pill Badges */}
                    <div className="flex items-center justify-between gap-2 z-10">
                      <span
                        className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full text-white shadow-xs"
                        style={{ backgroundColor: product.dominantColor }}
                      >
                        {product.badge}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => toggleLike(product.id, e)}
                        className={`p-1.5 rounded-full transition-colors ${
                          isLiked
                            ? 'text-[#F2081B] bg-red-50'
                            : 'text-neutral-400 hover:text-[#F2081B] hover:bg-neutral-100'
                        }`}
                        aria-label="Me gusta"
                      >
                        <Heart
                          className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`}
                        />
                      </button>
                    </div>

                    {/* Can Graphic Stage */}
                    <div className="relative h-60 my-4 flex items-center justify-center">
                      <img
                        src={canImages[product.id]}
                        alt={product.name}
                        className={`max-h-52 w-auto object-contain transition-all duration-300 filter drop-shadow-[0_12px_16px_rgba(0,0,0,0.15)] ${
                          isOpen ? 'rotate-2 scale-105' : 'hover:scale-105'
                        }`}
                      />
                    </div>

                    {/* Bottom Info */}
                    <div className="z-10 text-left">
                      <h3 className="text-xl font-black text-[#01592A] dark:text-[#F1F6D5] leading-tight">
                        {product.name}
                      </h3>
                      <p className="text-xs font-bold text-[#01592A] dark:text-[#A4D902] mt-0.5">
                        {product.tagline}
                      </p>
                      <p className="text-xs text-neutral-600 dark:text-emerald-200/70 mt-2 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* Featured Variety Deep-Dive */}
          <section
            id="featured-flavor-deepdive"
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
          >
            <div
              className={`rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden transition-all duration-500 bg-linear-to-br ${featured.bgGradient}`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-4 flex justify-center">
                  <img
                    src={canImages[featured.id]}
                    alt={featured.name}
                    className="max-h-72 w-auto object-contain filter drop-shadow-[0_20px_25px_rgba(0,0,0,0.3)]"
                  />
                </div>

                <div className="lg:col-span-8 flex flex-col items-start text-left">
                  <span className="px-3.5 py-1 rounded-full bg-white/20 text-white font-black text-xs uppercase tracking-wider mb-2">
                    {featured.badge}
                  </span>
                  <h3 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
                    {featured.name}
                  </h3>
                  <p className="text-lg text-yellow-300 font-extrabold mt-1">
                    {featured.tagline}
                  </p>
                  <p className="text-sm sm:text-base text-emerald-100 max-w-2xl mt-3 leading-relaxed">
                    {featured.description}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full mt-6">
                    <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
                      <span className="text-[10px] text-emerald-300 font-bold block uppercase">
                        Cafeína
                      </span>
                      <span className="text-sm font-black text-white">
                        {featured.caffeine}
                      </span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
                      <span className="text-[10px] text-emerald-300 font-bold block uppercase">
                        Porción
                      </span>
                      <span className="text-sm font-black text-white">
                        {featured.servingSize}
                      </span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
                      <span className="text-[10px] text-emerald-300 font-bold block uppercase">
                        Burbujas
                      </span>
                      <span className="text-sm font-black text-white">
                        Nivel {featured.fizzLevel}/5
                      </span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
                      <span className="text-[10px] text-emerald-300 font-bold block uppercase">
                        Calorías
                      </span>
                      <span className="text-sm font-black text-white">
                        {featured.calories}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* ===================================================
          CONEXIÓN CON HISTORIA
          =================================================== */}
      <section id="products-history-cta" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-emerald-50 dark:bg-[#091F0E] border border-emerald-200/80 dark:border-emerald-800/60 flex flex-col items-center gap-4 shadow-sm">
          <span className="text-xs font-black uppercase tracking-widest text-[#01592A] dark:text-[#A4D902]">
            UN VIAJE EN EL TIEMPO
          </span>
          <h3 className="text-2xl sm:text-4xl font-black text-[#01592A] dark:text-[#F1F6D5] tracking-tight">
            ¿QUERÉS CONOCER LA HISTORIA DE 7UP?
          </h3>
          <p className="text-sm sm:text-base text-emerald-950/70 dark:text-emerald-200/80 max-w-lg leading-relaxed">
            Descubrí cómo 7UP revolucionó la publicidad con The Uncola, conquistó la cultura psicodélica de los 70 y se convirtió en leyenda pop con Fido Dido.
          </p>

          <button
            type="button"
            id="products-enter-history-btn"
            onClick={() => handleNav('historia')}
            className="mt-2 inline-flex items-center gap-2.5 px-8 py-4 rounded-full font-black text-sm text-white bg-[#01592A] hover:bg-[#01592A] shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95"
          >
            <span>ENTRAR EN LA ÉPOCA</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Can Image Uploader Modal */}
      <CanImageUploaderModal
        isOpen={isUploaderOpen}
        onClose={() => setIsUploaderOpen(false)}
      />
    </div>
  );
};
