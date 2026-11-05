import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Upload, RotateCcw, Check, Image as ImageIcon } from 'lucide-react';
import { PRODUCT_LIST } from '../data/products';
import { setProductCustomImage, resetProductCustomImage, resetAllCustomImages } from '../utils/productImages';
import { useAllCanImages } from '../utils/useCanImages';

interface CanImageUploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CanImageUploaderModal: React.FC<CanImageUploaderModalProps> = ({
  isOpen,
  onClose,
}) => {
  const images = useAllCanImages();
  const [activeTab, setActiveTab] = useState<string>('original');
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileDrop = (productId: string, file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor subí un archivo de imagen (PNG, JPG o WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        setProductCustomImage(productId, dataUrl);
        setSuccessMsg(`¡Imagen de ${productId} actualizada con éxito!`);
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (productId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileDrop(productId, file);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-2xl bg-white dark:bg-[#071F0F] rounded-3xl shadow-2xl border border-emerald-100 dark:border-emerald-800/60 overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-emerald-100 dark:border-emerald-800/60 bg-emerald-50/60 dark:bg-[#0A2613]">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-[#008B3E] text-white">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-emerald-950 dark:text-[#E8F8EC] uppercase tracking-tight">
                  Imágenes Reales de Latas 7UP
                </h3>
                <p className="text-xs text-emerald-800/80 dark:text-emerald-200/80 font-medium">
                  Podés arrastrar o seleccionar archivos PNG de lata para personalizar cada variedad.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full text-emerald-900/60 dark:text-emerald-200/70 hover:text-emerald-950 dark:hover:text-white hover:bg-emerald-100 dark:hover:bg-emerald-800/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Success Banner */}
          {successMsg && (
            <div className="bg-emerald-600 text-white text-xs font-bold px-6 py-2 flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Body Content */}
          <div className="p-6 overflow-y-auto space-y-6">
            {/* Tabs for varieties */}
            <div className="flex flex-wrap gap-2">
              {PRODUCT_LIST.map((prod) => (
                <button
                  key={prod.id}
                  type="button"
                  onClick={() => setActiveTab(prod.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                    activeTab === prod.id
                      ? 'bg-[#008B3E] text-white shadow-xs'
                      : 'bg-emerald-50 dark:bg-[#0C2A15] text-emerald-900 dark:text-emerald-200 hover:bg-emerald-100 dark:hover:bg-emerald-800/50'
                  }`}
                >
                  {prod.name}
                </button>
              ))}
            </div>

            {/* Active Variety Dropzone */}
            {PRODUCT_LIST.filter((p) => p.id === activeTab).map((prod) => {
              const currentImg = images[prod.id];
              const isDrag = dragOverId === prod.id;

              return (
                <div key={prod.id} className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-emerald-50/40 dark:bg-[#0C2A15] border border-emerald-100 dark:border-emerald-800/60">
                    {/* Preview Current Image */}
                    <div className="w-28 h-44 shrink-0 flex items-center justify-center p-2 bg-white dark:bg-[#05170A] rounded-xl shadow-xs border border-emerald-100 dark:border-emerald-800/60">
                      <img
                        src={currentImg}
                        alt={prod.name}
                        className="w-full h-full object-contain filter drop-shadow-md"
                      />
                    </div>

                    {/* Drag and Drop Zone */}
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragOverId(prod.id);
                      }}
                      onDragLeave={() => setDragOverId(null)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setDragOverId(null);
                        const file = e.dataTransfer.files?.[0];
                        if (file) handleFileDrop(prod.id, file);
                      }}
                      className={`flex-1 w-full border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                        isDrag
                          ? 'border-[#008B3E] bg-emerald-100/50 dark:bg-emerald-900/40'
                          : 'border-emerald-300 dark:border-emerald-700/60 hover:border-emerald-500 bg-white dark:bg-[#082010]'
                      }`}
                      onClick={() => {
                        document.getElementById(`file-input-${prod.id}`)?.click();
                      }}
                    >
                      <Upload className="w-8 h-8 text-[#008B3E] dark:text-[#50E528] mb-2" />
                      <p className="text-sm font-bold text-emerald-950 dark:text-[#E8F8EC]">
                        Arrastrá y soltá la imagen de la lata aquí
                      </p>
                      <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
                        o hacé click para buscar en tu dispositivo (PNG recomendado)
                      </p>
                      <input
                        id={`file-input-${prod.id}`}
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        className="hidden"
                        onChange={(e) => handleFileInputChange(prod.id, e)}
                      />
                    </div>
                  </div>

                  {/* Reset Actions */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        resetProductCustomImage(prod.id);
                        setSuccessMsg(`Se restauró la imagen de estudio de ${prod.name}`);
                        setTimeout(() => setSuccessMsg(null), 3000);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 hover:text-emerald-950 dark:hover:text-white"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Restaurar imagen oficial de {prod.name}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        resetAllCustomImages();
                        setSuccessMsg('Se restauraron todas las imágenes oficiales');
                        setTimeout(() => setSuccessMsg(null), 3000);
                      }}
                      className="text-xs font-bold text-rose-700 dark:text-rose-400 hover:text-rose-900 dark:hover:text-rose-300"
                    >
                      Restaurar todas las latas
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 bg-emerald-50/60 dark:bg-[#0A2613] border-t border-emerald-100 dark:border-emerald-800/60 flex items-center justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-full bg-[#008B3E] hover:bg-[#007333] text-white font-black text-xs uppercase tracking-wider shadow-sm transition-all"
            >
              Listo
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
