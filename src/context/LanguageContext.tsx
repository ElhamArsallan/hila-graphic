import React, { createContext, useContext, useEffect, useState } from 'react';
import { Language } from '../types';
import { translations, Translations } from '../data/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  dir: 'ltr' | 'rtl';
  isRtl: boolean;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('hilagraphic_lang') as Language;
      if (saved === 'ps' || saved === 'fa' || saved === 'en') return saved;
    }
    return 'en'; // Default initial language, with selector in header
  });

  const dir: 'ltr' | 'rtl' = language === 'en' ? 'ltr' : 'rtl';
  const isRtl = dir === 'rtl';

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('dir', dir);
    root.setAttribute('lang', language);
    root.setAttribute('data-lang', language);
    document.body.setAttribute('data-lang', language);
    localStorage.setItem('hilagraphic_lang', language);

    // Apply specific typography class to body based on language
    document.body.classList.remove('font-sans', 'font-arabic', 'font-pashto', 'font-dari');
    if (language === 'ps') {
      document.body.classList.add('font-pashto', 'font-arabic');
    } else if (language === 'fa') {
      document.body.classList.add('font-dari', 'font-arabic');
    } else {
      document.body.classList.add('font-sans');
    }
  }, [language, dir, isRtl]);

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, dir, isRtl, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
