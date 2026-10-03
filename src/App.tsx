import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { SiteConfigProvider, useSiteConfig } from './context/SiteConfigContext';
import { LoadingIntro } from './components/common/LoadingIntro';
import { BackgroundCanvas } from './components/common/BackgroundCanvas';
import { Navbar } from './components/navbar/Navbar';
import { Hero } from './components/hero/Hero';
import { AboutPreview } from './components/about/AboutPreview';
import { FeaturedServices } from './components/services/FeaturedServices';
import { FeaturedPortfolio } from './components/portfolio/FeaturedPortfolio';
import { WhatsAppCta } from './components/cta/WhatsAppCta';
import { Footer } from './components/footer/Footer';
import { ProjectModal } from './components/common/ProjectModal';
import { FounderProfileModal } from './components/common/FounderProfileModal';
import { WhatsAppConfigModal } from './components/common/WhatsAppConfigModal';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { PriceListPage } from './pages/PriceListPage';
import { AboutPage } from './pages/AboutPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { ServicesPage } from './pages/ServicesPage';
import { ContactPage } from './pages/ContactPage';
import { ServiceItem, PortfolioItem } from './types';

function MainContent() {
  const [introCompleted, setIntroCompleted] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ServiceItem | PortfolioItem | null>(null);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);
  const [adminDashboardOpen, setAdminDashboardOpen] = useState(false);
  const [founderProfileOpen, setFounderProfileOpen] = useState(false);
  
  // Dedicated Route State: 'home' | 'price-list' | 'about' | 'portfolio' | 'services' | 'contact'
  const [currentRoute, setCurrentRoute] = useState<string>('home');

  const { isAdminAuthenticated, validateAdminSession } = useSiteConfig();

  // Sync route with URL hash on load and hashchange
  useEffect(() => {
    let active = true;
    const parseHash = async () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      const path = window.location.pathname.replace(/^\//, '').toLowerCase();
      const target = hash || path;

      if (target === 'admin') {
        const authenticated = await validateAdminSession();
        if (!active) return;
        if (authenticated) {
          setAdminLoginOpen(false);
          setAdminDashboardOpen(true);
        } else {
          setAdminDashboardOpen(false);
          setAdminLoginOpen(true);
        }
      } else if (['price-list', 'about', 'portfolio', 'services', 'contact'].includes(target)) {
        setCurrentRoute(target);
      } else {
        setCurrentRoute('home');
      }
    };

    parseHash();
    const handleHashChange = () => { void parseHash(); };
    void parseHash();
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      active = false;
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [isAdminAuthenticated]);

  useEffect(() => {
    if (!isAdminAuthenticated) setAdminDashboardOpen(false);
  }, [isAdminAuthenticated]);

  const navigateTo = (route: string) => {
    if (route === 'admin') {
      handleOpenAdmin();
      return;
    }

    setCurrentRoute(route);
    if (route === 'home') {
      window.location.hash = '';
    } else {
      window.location.hash = `#/${route}`;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAdmin = async () => {
    if (await validateAdminSession()) {
      setAdminDashboardOpen(true);
    } else {
      setAdminDashboardOpen(false);
      setAdminLoginOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-zinc-900 dark:text-[#F1F2F6] transition-colors duration-500 selection:bg-[#FF5E1E] selection:text-white relative font-rokh">
      
      {/* Background Atmosphere Engine (Multi-layer gradient mesh + optional admin image) */}
      <BackgroundCanvas />

      {/* Opening Intro Animation */}
      {!introCompleted && (
        <LoadingIntro onComplete={() => setIntroCompleted(true)} />
      )}

      {/* Floating Liquid Glass Navigation Bar */}
      <Navbar
        currentRoute={currentRoute}
        onNavigate={navigateTo}
        onOpenAdmin={handleOpenAdmin}
        onOpenFounderProfile={() => setFounderProfileOpen(true)}
      />

      {/* Main Routed Content Area */}
      <main className={`relative z-10 ${currentRoute === 'home' ? 'home-ambient-light' : ''}`}>
        {currentRoute === 'price-list' ? (
          <PriceListPage onNavigate={navigateTo} />
        ) : currentRoute === 'about' ? (
          <AboutPage onNavigate={navigateTo} />
        ) : currentRoute === 'portfolio' ? (
          <PortfolioPage 
            onNavigate={navigateTo} 
            onSelectProject={(project) => setSelectedItem(project)} 
          />
        ) : currentRoute === 'services' ? (
          <ServicesPage 
            onNavigate={navigateTo} 
            onSelectService={(service) => setSelectedItem(service)} 
          />
        ) : currentRoute === 'contact' ? (
          <ContactPage onNavigate={navigateTo} />
        ) : (
          /* HOME PAGE */
          <>
            {/* 1. Hero Section with 2-column layout, Carousel & CMS copy */}
            <Hero onSelectService={(service) => setSelectedItem(service)} />

            {/* 2. Compact About Hila Graphic Preview with Read Full Story link */}
            <AboutPreview onNavigate={navigateTo} />

            {/* 3. Featured Services (Core Fixed Categories + Dynamic CMS Items) */}
            <FeaturedServices 
              onSelectService={(service) => setSelectedItem(service)} 
              onNavigate={navigateTo}
            />

            {/* 4. Featured Portfolio / Agency Work Preview with Category Tabs */}
             {/* <FeaturedPortfolio 
              onSelectProject={(project) => setSelectedItem(project)} 
              onNavigate={navigateTo}
            />*/}

            {/* 5. WhatsApp Direct Collaboration CTA */}
            <WhatsAppCta onOpenConfigModal={() => setConfigModalOpen(true)} />
          </>
        )}
      </main>

      {/* Minimal Luxury Footer */}
      <Footer 
        currentRoute={currentRoute}
        onNavigate={navigateTo}
        onOpenConfigModal={() => setConfigModalOpen(true)} 
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Contained 2-Column Liquid Glass Service & Project Detail Modal */}
      <ProjectModal 
        item={selectedItem} 
        onClose={() => setSelectedItem(null)} 
      />

      <FounderProfileModal isOpen={founderProfileOpen} onClose={() => setFounderProfileOpen(false)} />

      {/* Quick WhatsApp Coordinates Modal */}
      <WhatsAppConfigModal 
        isOpen={configModalOpen} 
        onClose={() => setConfigModalOpen(false)} 
      />

      {/* Administrator Passcode Authentication Modal */}
      <AdminLoginModal
        isOpen={adminLoginOpen}
        onClose={() => {
          setAdminLoginOpen(false);
          if (window.location.hash === '#admin') {
            window.history.pushState(null, '', window.location.pathname);
          }
        }}
        onSuccess={() => {
          setAdminLoginOpen(false);
          setAdminDashboardOpen(true);
        }}
      />

      {/* Full Dedicated CMS Admin Dashboard */}
      {adminDashboardOpen && (
        <AdminDashboard
          onClose={() => {
            setAdminDashboardOpen(false);
            if (window.location.hash === '#admin') {
              window.history.pushState(null, '', window.location.pathname);
            }
          }}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <SiteConfigProvider>
          <MainContent />
        </SiteConfigProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
