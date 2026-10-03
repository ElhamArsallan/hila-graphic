import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sun, 
  Moon, 
  Globe, 
  MessageCircle, 
  Menu, 
  X, 
  Check, 
  ChevronDown,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Logo } from '../common/Logo';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useSiteConfig } from '../../context/SiteConfigContext';
import { Language } from '../../types';

interface NavbarProps {
  currentRoute?: string;
  onNavigate?: (route: string) => void;
  onOpenPriceModal?: () => void;
  onOpenAdmin?: () => void;
  onOpenFounderProfile?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentRoute = 'home',
  onNavigate,
  onOpenPriceModal, 
  onOpenAdmin,
  onOpenFounderProfile,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, isRtl, t } = useLanguage();
  const { menuItems, getWhatsAppLink } = useSiteConfig();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // Filter and sort active menu items
  const activeMenuItems = [
    ...menuItems.filter((item) => item.active !== false && item.path !== 'founder-profile'),
    {
      id: 'founder-profile',
      label: { en: 'Founder', ps: 'بنسټګر', fa: 'بنیان‌گذار' },
      path: 'founder-profile',
      order: 6.5,
      active: true,
    },
  ].sort((a, b) => a.order - b.order);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      
      // Update active section based on scroll position if on home
      if (currentRoute === 'home') {
        const sections = ['home', 'about', 'services', 'portfolio', 'contact'];
        for (const section of sections) {
          const el = document.getElementById(section);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= 160 && rect.bottom >= 160) {
              setActiveSection(section);
              break;
            }
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentRoute]);

  const handleNavClick = (path: string) => {
    setMobileMenuOpen(false);
    
    if (path === 'admin') {
      onOpenAdmin?.();
      return;
    }

    if (path === 'founder-profile') {
      onOpenFounderProfile?.();
      return;
    }

    if (onNavigate) {
      onNavigate(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const targetEl = document.getElementById(path);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const languages: { code: Language; label: string; nativeName: string }[] = [
    { code: 'ps', label: 'Pashto', nativeName: 'پښتو' },
    { code: 'fa', label: 'Dari', nativeName: 'دری' },
    { code: 'en', label: 'English', nativeName: 'English' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 px-3 sm:px-6 lg:px-8 pt-2.5 sm:pt-4 transition-all duration-300 pointer-events-none">
        <div className="relative max-w-7xl mx-auto">
          
          {/* Main Floating Liquid Glass Bar Container */}
          <span aria-hidden="true" className="navbar-orbit-glow" />
          <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className={`relative z-10 w-full pointer-events-auto rounded-2xl lg:rounded-full px-3 sm:px-6 py-2 sm:py-3 transition-all duration-300 flex items-center justify-between
              ${isScrolled 
                ? 'liquid-glass shadow-[0_16px_40px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,0.7)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.65),inset_0_1px_1px_rgba(255,255,255,0.12)] border-white/80 dark:border-white/15' 
                : 'bg-white/85 dark:bg-[#101117]/85 backdrop-blur-2xl border border-white/70 dark:border-white/12 shadow-[0_10px_35px_rgba(0,0,0,0.05)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.5)]'
              }`}
          >
            {/* Left: Hila Graphic Logo */}
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('home');
              }}
              className="flex items-center group cursor-pointer focus:outline-none flex-shrink-0"
              aria-label="Hila Graphic Home"
            >
              <Logo size="md" showSubtitle={true} className="max-w-[125px] sm:max-w-none" />
            </a>

            {/* Center: Dynamic Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-1 xl:gap-1.5 px-3 py-1 rounded-full bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.04] dark:border-white/[0.06]">
              {activeMenuItems.map((link) => {
                const isActive = currentRoute === link.path || (currentRoute === 'home' && activeSection === link.path);
                const localizedLabel = link.label[language] || link.label.en;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.path)}
                    className={`relative px-3.5 py-1.5 text-xs xl:text-sm font-medium rounded-full transition-all duration-200 cursor-pointer select-none whitespace-nowrap
                      ${isActive 
                        ? 'text-[#FF5E1E] font-semibold' 
                        : 'text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                      }`}
                  >
                    {localizedLabel}
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute inset-0 rounded-full bg-[#FF5E1E]/12 border border-[#FF5E1E]/25 -z-10 shadow-sm"
                        transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Right: Controls (Language + Theme + Desktop WhatsApp CTA + Hamburger Toggle) */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              
              {/* Language Selector Dropdown in Header */}
              <div className="relative">
                <button
                  onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                  className="h-10 min-w-[38px] sm:min-w-[42px] px-2 sm:px-2.5 rounded-xl sm:rounded-full text-xs font-bold text-zinc-700 dark:text-zinc-200 hover:bg-black/5 dark:hover:bg-white/10 transition-colors border border-black/5 dark:border-white/10 flex items-center justify-center gap-1 cursor-pointer select-none"
                  aria-label="Select language"
                >
                  <Globe className="w-3.5 h-3.5 text-[#FF5E1E] flex-shrink-0" />
                  <span className="uppercase text-[11px] sm:text-xs font-mono">{language}</span>
                  <ChevronDown className="w-3 h-3 opacity-60 hidden sm:inline" />
                </button>

                <AnimatePresence>
                  {langDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className={`absolute top-full mt-2 ${isRtl ? 'left-0' : 'right-0'} w-36 py-1.5 rounded-2xl liquid-glass liquid-glass-specular border border-white/70 dark:border-white/15 shadow-xl z-50 overflow-hidden text-start`}
                    >
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setLanguage(lang.code);
                            setLangDropdownOpen(false);
                          }}
                          className={`w-full px-3.5 py-2.5 min-h-[40px] text-xs flex items-center justify-between transition-colors cursor-pointer
                            ${language === lang.code 
                              ? 'text-[#FF5E1E] font-bold bg-[#FF5E1E]/10' 
                              : 'text-zinc-700 dark:text-zinc-200 hover:bg-black/5 dark:hover:bg-white/10'
                            }`}
                        >
                          <span>{lang.nativeName}</span>
                          {language === lang.code && <Check className="w-3.5 h-3.5 text-[#FF5E1E]" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Light / Dark Mode Toggle in Header */}
              <button
                onClick={toggleTheme}
                className="w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl sm:rounded-full text-zinc-700 dark:text-zinc-200 hover:bg-black/5 dark:hover:bg-white/10 transition-colors border border-black/5 dark:border-white/10 cursor-pointer select-none"
                aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-zinc-700" />
                )}
              </button>

              {/* Desktop WhatsApp Action Button */}
              <a
                href={getWhatsAppLink('Hello Hila Graphic, I would like to order a design project.')}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-2 px-4 lg:px-5 py-2.5 min-h-[40px] rounded-full text-xs lg:text-sm font-bold text-white bg-[#FF5E1E] hover:bg-[#E84D0E] active:scale-95 transition-all duration-200 orange-glow cursor-pointer shadow-md select-none"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{t.whatsapp.ctaButton}</span>
              </a>

              {/* Mobile Hamburger / Close Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl sm:rounded-2xl liquid-glass liquid-glass-specular border border-white/80 dark:border-white/20 text-zinc-900 dark:text-zinc-100 hover:text-[#FF5E1E] dark:hover:text-[#FF5E1E] shadow-sm active:scale-95 transition-all cursor-pointer select-none"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-5 h-5 text-[#FF5E1E]" /> : <Menu className="w-5 h-5" />}
              </button>

            </div>
          </motion.nav>

          {/* Premium Header-Anchored Liquid Glass Mobile Dropdown Panel */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="lg:hidden pointer-events-auto absolute top-full left-1/2 -translate-x-1/2 w-full max-w-[420px] mt-2.5 z-50 rounded-2xl sm:rounded-3xl liquid-glass liquid-glass-specular border border-white/85 dark:border-white/20 p-3 sm:p-4 shadow-[0_20px_50px_rgba(0,0,0,0.18),inset_0_1px_1px_rgba(255,255,255,0.7)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.75),inset_0_1px_1px_rgba(255,255,255,0.12)] overflow-hidden"
              >
                {/* 1. Navigation items vertical list */}
                <div className="flex flex-col gap-1.5" dir={isRtl ? 'rtl' : 'ltr'}>
                  {activeMenuItems.map((link) => {
                    const isActive = currentRoute === link.path || (currentRoute === 'home' && activeSection === link.path);
                    const localizedLabel = link.label[language] || link.label.en;
                    return (
                      <button
                        key={link.id}
                        type="button"
                        onClick={() => {
                          handleNavClick(link.path);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full h-11 min-h-[44px] px-4 rounded-xl text-sm font-semibold transition-all duration-150 flex items-center justify-between cursor-pointer select-none
                          ${isRtl ? 'text-right' : 'text-left'}
                          ${isActive
                            ? 'bg-[#FF5E1E]/15 text-[#FF5E1E] border border-[#FF5E1E]/30 font-bold shadow-sm'
                            : 'text-zinc-800 dark:text-zinc-200 hover:bg-black/5 dark:hover:bg-white/5 border border-transparent'
                          }`}
                      >
                        <span className="truncate">{localizedLabel}</span>
                        <ArrowRight className={`w-3.5 h-3.5 flex-shrink-0 transition-transform ${isActive ? 'text-[#FF5E1E] opacity-100' : 'opacity-40'} ${isRtl ? 'rotate-180' : ''}`} />
                      </button>
                    );
                  })}
                </div>

                {/* Subtle Divider */}
                <div className="my-2.5 border-t border-black/[0.08] dark:border-white/[0.1]" />

                {/* 2. Separate Controls: Language & Theme */}
                <div className="flex items-center justify-between gap-2" dir={isRtl ? 'rtl' : 'ltr'}>
                  {/* Language segmented control */}
                  <div className="flex items-center gap-1 p-1 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.08]">
                    {languages.map((l) => {
                      const isSelected = language === l.code;
                      return (
                        <button
                          key={l.code}
                          type="button"
                          onClick={() => setLanguage(l.code)}
                          className={`h-8 min-h-[34px] px-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer select-none flex items-center justify-center
                            ${isSelected
                              ? 'bg-[#FF5E1E] text-white shadow-sm font-bold'
                              : 'text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                            }`}
                        >
                          {l.nativeName}
                        </button>
                      );
                    })}
                  </div>

                  {/* Theme Toggle Button */}
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="h-10 min-h-[40px] px-3.5 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.1] border border-black/[0.06] dark:border-white/[0.08] text-zinc-700 dark:text-zinc-200 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors select-none"
                    aria-label="Toggle dark / light mode"
                  >
                    {theme === 'dark' ? (
                      <>
                        <Sun className="w-3.5 h-3.5 text-amber-400" />
                        <span>Light</span>
                      </>
                    ) : (
                      <>
                        <Moon className="w-3.5 h-3.5 text-zinc-700" />
                        <span>Dark</span>
                      </>
                    )}
                  </button>
                </div>

                {/* 3. And finally: Order on WhatsApp */}
                <div className="pt-2.5">
                  <a
                    href={getWhatsAppLink('Hello Hila Graphic, I would like to order a design project.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full h-11 min-h-[44px] inline-flex items-center justify-center gap-2 px-4 rounded-xl text-sm font-bold text-white bg-[#FF5E1E] hover:bg-[#E84D0E] active:scale-[0.98] transition-all orange-glow shadow-md cursor-pointer select-none"
                  >
                    <MessageCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{t.whatsapp.ctaButton}</span>
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Backdrop overlay for dropdown click-outside closing */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-30 lg:hidden bg-black/40 backdrop-blur-[2px]"
          />
        )}
      </AnimatePresence>
    </>
  );
};
