import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Send, CheckCircle2, MessageSquare, Instagram, Youtube, Twitter } from 'lucide-react';
import { PageId } from '../types';
import { sound } from '../utils/audio';

interface ContactProps {
  onNavigate: (page: PageId) => void;
}

export const Contact: React.FC<ContactProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Por favor ingresá tu nombre.';
    if (!formData.email.trim()) {
      errs.email = 'Por favor ingresá tu email.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Por favor ingresá un email válido.';
    }
    if (!formData.subject.trim()) errs.subject = 'Por favor ingresá un asunto.';
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errs.message = 'El mensaje debe contener al menos 10 caracteres.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      sound.playCanOpen();
      setSubmitted(true);
    } else {
      sound.playClick();
    }
  };

  const resetForm = () => {
    sound.playClick();
    setFormData({ name: '', email: '', subject: '', message: '' });
    setSubmitted(false);
  };

  return (
    <div className="w-full flex flex-col pt-24 sm:pt-28 pb-20">
      {/* Hero Header */}
      <section id="contact-hero" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black tracking-widest uppercase mb-4">
          <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
          <span>COMUNIDAD 7UP</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-[#01592A] dark:text-[#F1F6D5] tracking-tight uppercase">
          CONTACTO
        </h1>

        <p className="text-lg sm:text-xl font-extrabold text-[#01592A] dark:text-[#029F3D] max-w-lg mx-auto mt-2 uppercase tracking-wide">
          ¿QUERÉS HABLAR CON NOSOTROS?
        </p>

        <p className="text-sm sm:text-base text-emerald-950/70 dark:text-emerald-200/80 max-w-md mx-auto mt-3 font-medium">
          Envianos tus comentarios, ideas, recuerdos con la marca o consultas. Nos encanta leer a nuestra comunidad.
        </p>
      </section>

      {/* Main Content: Form & Social channels */}
      <section id="contact-form-section" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Form Card */}
          <div className="lg:col-span-7 bg-white dark:bg-[#071F0F] rounded-3xl p-7 sm:p-10 shadow-lg border border-emerald-100 dark:border-emerald-800/60 relative">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 flex flex-col items-center text-center gap-4"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center text-emerald-600 dark:text-[#A4D902] mb-2">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <h3 className="text-2xl font-black text-[#01592A] dark:text-[#F1F6D5]">
                  ¡Mensaje Recibido!
                </h3>

                <p className="text-sm text-emerald-900/75 dark:text-emerald-200/80 max-w-sm leading-relaxed">
                  Gracias por contactarnos, <span className="font-bold">{formData.name}</span>. Tu mensaje ha sido enviado con éxito a nuestro buzón de frescura.
                </p>

                <button
                  type="button"
                  id="reset-contact-form-btn"
                  onClick={resetForm}
                  className="mt-4 px-6 py-2.5 rounded-full font-bold text-xs text-white bg-[#01592A] hover:bg-[#01592A] transition-all hover:scale-105"
                >
                  Enviar otro mensaje
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {/* Nombre */}
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-xs font-black uppercase tracking-wider text-emerald-950 dark:text-emerald-200 mb-1"
                  >
                    Nombre Completo
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Tu nombre"
                    className={`w-full px-4 py-3 rounded-2xl bg-emerald-50/50 dark:bg-[#05170A] border text-sm text-emerald-950 dark:text-emerald-100 focus:outline-hidden transition-all ${
                      errors.name
                        ? 'border-red-400 focus:ring-2 focus:ring-red-200'
                        : 'border-emerald-200 dark:border-emerald-700/60 focus:border-[#01592A] dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100/30'
                    }`}
                  />
                  {errors.name && (
                    <span className="text-[11px] font-bold text-red-600 dark:text-red-400 mt-1 block">
                      {errors.name}
                    </span>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-xs font-black uppercase tracking-wider text-emerald-950 dark:text-emerald-200 mb-1"
                  >
                    Correo Electrónico
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="tu@email.com"
                    className={`w-full px-4 py-3 rounded-2xl bg-emerald-50/50 dark:bg-[#05170A] border text-sm text-emerald-950 dark:text-emerald-100 focus:outline-hidden transition-all ${
                      errors.email
                        ? 'border-red-400 focus:ring-2 focus:ring-red-200'
                        : 'border-emerald-200 dark:border-emerald-700/60 focus:border-[#01592A] dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100/30'
                    }`}
                  />
                  {errors.email && (
                    <span className="text-[11px] font-bold text-red-600 dark:text-red-400 mt-1 block">
                      {errors.email}
                    </span>
                  )}
                </div>

                {/* Asunto */}
                <div>
                  <label
                    htmlFor="contact-subject"
                    className="block text-xs font-black uppercase tracking-wider text-emerald-950 dark:text-emerald-200 mb-1"
                  >
                    Asunto
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    placeholder="Ej: Consulta sobre variedades o historia"
                    className={`w-full px-4 py-3 rounded-2xl bg-emerald-50/50 dark:bg-[#05170A] border text-sm text-emerald-950 dark:text-emerald-100 focus:outline-hidden transition-all ${
                      errors.subject
                        ? 'border-red-400 focus:ring-2 focus:ring-red-200'
                        : 'border-emerald-200 dark:border-emerald-700/60 focus:border-[#01592A] dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100/30'
                    }`}
                  />
                  {errors.subject && (
                    <span className="text-[11px] font-bold text-red-600 dark:text-red-400 mt-1 block">
                      {errors.subject}
                    </span>
                  )}
                </div>

                {/* Mensaje */}
                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-xs font-black uppercase tracking-wider text-emerald-950 dark:text-emerald-200 mb-1"
                  >
                    Mensaje
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder="Escribí tu mensaje aquí..."
                    className={`w-full px-4 py-3 rounded-2xl bg-emerald-50/50 dark:bg-[#05170A] border text-sm text-emerald-950 dark:text-emerald-100 focus:outline-hidden transition-all resize-none ${
                      errors.message
                        ? 'border-red-400 focus:ring-2 focus:ring-red-200'
                        : 'border-emerald-200 dark:border-emerald-700/60 focus:border-[#01592A] dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100/30'
                    }`}
                  />
                  {errors.message && (
                    <span className="text-[11px] font-bold text-red-600 dark:text-red-400 mt-1 block">
                      {errors.message}
                    </span>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  id="contact-submit-btn"
                  className="w-full py-4 rounded-full font-black text-sm text-white bg-[#01592A] hover:bg-[#01592A] shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-98 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>ENVIAR MENSAJE</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Info & Social Channels */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="p-7 rounded-3xl bg-linear-to-br from-[#01592A] to-[#01260F] text-white shadow-lg">
              <h3 className="text-xl font-black tracking-tight text-white mb-2">
                Redes Oficiales
              </h3>
              <p className="text-xs text-emerald-200/80 leading-relaxed mb-6">
                Sumate a la conversación global y descubrí campañas, pósteres y momentos refrescantes.
              </p>

              <div className="space-y-3">
                <a
                  href="#instagram"
                  onClick={(e) => e.preventDefault()}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-pink-600 flex items-center justify-center text-white">
                    <Instagram className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-white">Instagram</span>
                    <span className="text-[11px] text-emerald-300">@7up</span>
                  </div>
                </a>

                <a
                  href="#youtube"
                  onClick={(e) => e.preventDefault()}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white">
                    <Youtube className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-white">YouTube</span>
                    <span className="text-[11px] text-emerald-300">7UP Oficial</span>
                  </div>
                </a>

                <a
                  href="#twitter"
                  onClick={(e) => e.preventDefault()}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-sky-600 flex items-center justify-center text-white">
                    <Twitter className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-white">X / Twitter</span>
                    <span className="text-[11px] text-emerald-300">@7up</span>
                  </div>
                </a>
              </div>
            </div>

            {/* Quick Brand Assurance Pill */}
            <div className="p-6 rounded-3xl bg-emerald-50 dark:bg-[#071F0F] border border-emerald-100 dark:border-emerald-800/60 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#01592A] text-white flex items-center justify-center font-black text-xl shrink-0">
                7
              </div>
              <div className="text-left">
                <span className="text-xs font-extrabold text-[#01592A] dark:text-[#F1F6D5] block">
                  Atención al Consumidor
                </span>
                <span className="text-xs text-emerald-800/80 dark:text-emerald-200/80 leading-relaxed">
                  Lunes a Viernes de 9:00 a 18:00 hs.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
