import React, { useState, useEffect } from 'react';
import { Menu, X, Volume2, VolumeX, Sparkles, Gamepad2, Moon, Sun } from 'lucide-react';
import { PageId } from '../types';
import { sound } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(sound.getMuted());
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (page: PageId) => {
    sound.playClick();
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  const toggleSound = () => {
    const next = sound.toggleMute();
    setIsMuted(next);
  };

  const navItems: { id: PageId; label: string; badge?: string }[] = [
    { id: 'home', label: 'Inicio' },
    { id: 'historia', label: 'Historia', badge: 'La Época' },
    { id: 'productos', label: 'Cápsula' },
    { id: 'juego', label: 'Juego' },
    { id: 'contacto', label: 'Contacto' },
  ];

  return (
    <header
      id="global-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'py-2.5 sm:py-3 bg-[#01592A]/95 dark:bg-[#031508]/95 backdrop-blur-md shadow-lg border-b border-emerald-500/30 dark:border-emerald-500/20'
          : 'py-3.5 sm:py-4 bg-[#01592A] dark:bg-[#04190A]/95 shadow-md border-b border-emerald-600/40 dark:border-emerald-600/25'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo (Links to Home) */}
          <button
            type="button"
            id="logo-button"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 group focus:outline-hidden"
            aria-label="Volver al inicio - 7UP"
          >
            {/* 7UP Brand Logo (sin contenedor) */}
            <img
              src="/7up-logo-transparent.svg"
              alt="7UP"
              className="h-9 sm:h-11 w-auto object-contain transition-transform duration-200 group-hover:scale-105 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)]"
            />
          </button>

          {/* Desktop Navigation Links (Capsule Dock) */}
          <nav
            id="desktop-nav"
            className="hidden md:flex items-center gap-1.5 p-1.5 bg-[#01592A]/70 dark:bg-[#02220C]/85 backdrop-blur-md rounded-full border border-white/20 dark:border-emerald-500/20 shadow-inner"
          >
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-5 py-2 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-white dark:bg-[#01592A] text-[#01592A] dark:text-white shadow-sm'
                      : 'text-white/90 hover:text-white hover:bg-white/15 dark:hover:bg-white/10'
                  }`}
                >
                  {item.label}
                  {item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-full font-black ${
                        isActive
                          ? 'bg-[#F2081B] text-white'
                          : 'bg-[#A4D902] text-[#01592A]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action: Theme Toggle, Sound Toggle & Quick Explore CTA */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Dark / Light Mode Toggle */}
            <button
              type="button"
              id="header-theme-toggle"
              onClick={toggleTheme}
              aria-label={isDark ? 'Cambiar a modo diurno' : 'Cambiar a modo nocturno'}
              title={isDark ? 'Modo Nocturno activo (Click para diurno)' : 'Modo Diurno activo (Click para nocturno)'}
              className="p-2.5 rounded-full bg-white/15 hover:bg-white/25 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/80 text-white border border-white/25 dark:border-emerald-500/30 shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
            >
              {isDark ? (
                <Moon className="w-4 h-4 text-[#A4D902] fill-[#A4D902]/30" />
              ) : (
                <Sun className="w-4 h-4 text-[#A4D902]" />
              )}
            </button>

            {/* Sound Toggle */}
            <button
              type="button"
              id="header-sound-toggle"
              onClick={toggleSound}
              aria-label={isMuted ? 'Activar efectos de sonido' : 'Silenciar sonido'}
              title={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
              className="p-2.5 rounded-full bg-white/15 hover:bg-white/25 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/80 text-white border border-white/25 dark:border-emerald-500/30 shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-rose-300" />
              ) : (
                <Volume2 className="w-4 h-4 text-[#A4D902]" />
              )}
            </button>

            <button
              type="button"
              id="header-cta-button"
              onClick={() => handleNavClick('historia')}
              className="hidden lg:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#F2081B] hover:bg-[#F2081B] text-white text-xs font-black tracking-wide shadow-md hover:shadow-lg transition-all hover:scale-102 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>LA ÉPOCA</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/25 shadow-xs"
              aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu-drawer"
          className="md:hidden mt-2 mx-4 p-4 bg-[#01592A] dark:bg-[#031A0B] text-white rounded-3xl border border-emerald-500/40 dark:border-emerald-500/30 shadow-2xl flex flex-col gap-2 animate-in fade-in slide-in-from-top-3 duration-200"
        >
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                id={`mobile-nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`w-full py-3 px-4 rounded-2xl text-sm font-extrabold flex items-center justify-between text-left transition-all ${
                  isActive
                    ? 'bg-white dark:bg-[#01592A] text-[#01592A] dark:text-white shadow-sm'
                    : 'text-white/90 hover:bg-white/15 dark:hover:bg-white/10'
                }`}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      isActive
                        ? 'bg-[#F2081B] text-white'
                        : 'bg-[#A4D902] text-[#01592A]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-2 border-t border-white/15 flex items-center justify-between px-2">
            <span className="text-xs font-semibold text-white/80">
              Efectos de sonido:
            </span>
            <button
              type="button"
              onClick={toggleSound}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-white/20 text-white"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-300" /> : <Volume2 className="w-3.5 h-3.5 text-[#A4D902]" />}
              <span>{isMuted ? 'Silenciado' : 'Activado'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
