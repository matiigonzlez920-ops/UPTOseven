import { useState, useEffect } from 'react';
import { PageId } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { History } from './pages/History';
import { Game } from './pages/Game';
import { Contact } from './pages/Contact';
import { FidoDidoCompanion } from './components/FidoDidoCompanion';
import { ThemeProvider } from './context/ThemeContext';
import { CampaignPopup } from './components/CampaignPopup';

// Helper to determine PageId from URL path
function getPageFromPath(path: string): PageId {
  const clean = path.toLowerCase().replace(/\/$/, '');
  if (clean === '/productos' || clean === '/products') return 'productos';
  if (clean === '/historia' || clean === '/la-epoca' || clean === '/history') return 'historia';
  if (clean === '/juego' || clean === '/game' || clean === '/arcade') return 'juego';
  if (clean === '/contacto' || clean === '/contact') return 'contacto';
  return 'home';
}

function getPathFromPage(page: PageId): string {
  switch (page) {
    case 'productos':
      return '/productos';
    case 'historia':
      return '/historia';
    case 'juego':
      return '/juego';
    case 'contacto':
      return '/contacto';
    case 'home':
    default:
      return '/';
  }
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>(() => {
    if (typeof window !== 'undefined') {
      return getPageFromPath(window.location.pathname);
    }
    return 'home';
  });

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const page = getPageFromPath(window.location.pathname);
      setCurrentPage(page);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (page: PageId) => {
    setCurrentPage(page);
    const path = getPathFromPage(page);
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-[#F1F6D5] dark:bg-[#061208] text-[#01592A] dark:text-[#F1F6D5] font-sans antialiased selection:bg-[#A4D902] selection:text-[#01592A] transition-colors duration-300">
        {/* Sticky Global Header */}
        <Header currentPage={currentPage} onNavigate={handleNavigate} />

        {/* Dynamic Page Views */}
        <main className="flex-1">
          {currentPage === 'home' && <Home onNavigate={handleNavigate} />}
          {currentPage === 'productos' && <Products onNavigate={handleNavigate} />}
          {currentPage === 'historia' && <History onNavigate={handleNavigate} />}
          {currentPage === 'juego' && <Game onNavigate={handleNavigate} />}
          {currentPage === 'contacto' && <Contact onNavigate={handleNavigate} />}
        </main>

        {/* Floating Fido Dido Companion */}
        <FidoDidoCompanion onNavigate={handleNavigate} />

        {/* Global Footer */}
        <Footer onNavigate={handleNavigate} />
        {(currentPage === 'historia' || currentPage === 'productos') && (
          <CampaignPopup key={currentPage} campaign={currentPage === 'historia' ? 'lego' : 'festival'} />
        )}
      </div>
    </ThemeProvider>
  );
}
