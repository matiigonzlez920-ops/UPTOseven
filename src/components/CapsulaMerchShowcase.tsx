import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Package, Check, Tag } from 'lucide-react';
import { CAPSULA_MERCH_ITEMS, CapsulaMerchItem } from '../data/capsulaSpots';
import { sound } from '../utils/audio';

export const CapsulaMerchShowcase: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [selectedItem, setSelectedItem] = useState<CapsulaMerchItem>(CAPSULA_MERCH_ITEMS[0]);

  const categories = ['Todos', 'Ropa', 'Accesorios'];

  const filteredItems =
    activeCategory === 'Todos'
      ? CAPSULA_MERCH_ITEMS
      : CAPSULA_MERCH_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <div id="capsula-merch-showcase" className="w-full max-w-7xl mx-auto my-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#A4D902] text-[#01592A] text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3 h-3 fill-current" />
            CONTENIDO DE LA CÁPSULA
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#01592A] dark:text-[#F1F6D5] tracking-tight uppercase">
            ROPA & MERCH EDICIÓN LIMITADA
          </h2>
          <p className="text-sm sm:text-base text-emerald-900/80 dark:text-emerald-200/80 font-medium mt-1 max-w-2xl">
            Cada cápsula cilíndrica hermética dispensada contiene una prenda o artículo de la colección streetwear 7UP.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 bg-emerald-100/70 dark:bg-[#071F10] p-1.5 rounded-full self-start md:self-auto border border-emerald-200 dark:border-emerald-800/60">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                sound.playClick();
                setActiveCategory(cat);
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all ${
                activeCategory === cat
                  ? 'bg-[#01592A] text-white shadow-xs'
                  : 'text-emerald-900 dark:text-emerald-200 hover:bg-white/50 dark:hover:bg-emerald-800/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Capsule Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -6 }}
            className="bg-white dark:bg-[#0A1F10] rounded-3xl p-5 border-2 border-emerald-100 dark:border-emerald-800/60 hover:border-[#01592A] dark:hover:border-emerald-500 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Image Container with Badges */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-neutral-100 dark:bg-[#05160A] mb-4 border border-emerald-50 dark:border-emerald-900/40">
                <img
                  src={item.image}
                  alt={item.name}
                  className={item.id.startsWith('tshirt-')
                    ? 'w-full h-full object-contain'
                    : 'w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'}
                />
                <div className="absolute top-2 left-2">
                  <span className="px-2.5 py-1 rounded-full bg-[#01592A] text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
                    {item.badge}
                  </span>
                </div>
                <div className="absolute top-2 right-2">
                  <span className="px-2 py-0.5 rounded-full bg-white/90 dark:bg-black/70 backdrop-blur-xs text-neutral-800 dark:text-white text-[10px] font-mono font-bold shadow-xs">
                    {item.rarity}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 dark:text-[#A4D902]">
                  {item.category}
                </span>
              </div>

              <h3 className="text-base font-black text-[#01592A] dark:text-[#F1F6D5] leading-snug group-hover:text-[#01592A] dark:group-hover:text-[#A4D902] transition-colors">
                {item.name}
              </h3>

              <p className="text-xs text-neutral-600 dark:text-emerald-200/70 font-medium mt-1 line-clamp-2">
                {item.tagline}
              </p>
            </div>

            {/* Bottom Sizes or Spec */}
            <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-emerald-800/50 flex items-center justify-between">
              <div className="text-[10px] font-mono font-bold text-neutral-500 dark:text-emerald-300/60">
                {item.sizes ? item.sizes.join(' • ') : 'Talle Único'}
              </div>
              <div className="w-6 h-6 rounded-full bg-emerald-50 dark:bg-emerald-900/50 text-[#01592A] dark:text-[#A4D902] flex items-center justify-center font-bold text-xs group-hover:bg-[#01592A] group-hover:text-white transition-colors">
                <Package className="w-3.5 h-3.5" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
