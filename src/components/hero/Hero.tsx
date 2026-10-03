import React from 'react';
import { motion } from 'motion/react';
import { MessageCircle, ArrowDown, Sparkles } from 'lucide-react';
import { ShowcaseCarousel } from './ShowcaseCarousel';
import { useLanguage } from '../../context/LanguageContext';
import { useSiteConfig } from '../../context/SiteConfigContext';
import { ServiceItem } from '../../types';

interface HeroProps {
  onSelectService?: (service: ServiceItem) => void;
  onExploreServices?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onSelectService, onExploreServices }) => {
  const { isRtl, language, t } = useLanguage();
  const { config, getWhatsAppLink } = useSiteConfig();
  const heroData = config.hero;

  const scrollToServices = () => {
    if (onExploreServices) {
      onExploreServices();
      return;
    }
    const el = document.getElementById('services');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const badgeText = heroData?.badge?.[language] || t.hero.badge;
  const headlinePart1 = heroData?.headlinePart1?.[language] || t.hero.headlinePart1;
  const headlineAccent = heroData?.headlineAccent?.[language] || t.hero.headlineAccent;
  const headlinePart2 = heroData?.headlinePart2?.[language] || t.hero.headlinePart2;
  const descriptionText = heroData?.description?.[language] || t.hero.description;
  const primaryCtaText = heroData?.primaryCta?.[language] || t.hero.primaryCta;
  const secondaryCtaText = heroData?.secondaryCta?.[language] || t.hero.secondaryCta;

  return (
    <section 
      id="home" 
      className="relative lg:min-h-screen flex lg:items-center pt-20 sm:pt-24 lg:pt-24 pb-8 sm:pb-12 lg:pb-16 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Desktop 45% / 55% balanced composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-8 xl:gap-12 items-center">
          
          {/* Main Hero Content (Left on LTR / Right in RTL) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 xl:col-span-5 flex flex-col items-start text-start w-full"
          >
            {/* Small Brand / Category Label Badge */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full liquid-glass border border-black/[0.06] dark:border-white/10 text-[11px] sm:text-xs font-semibold tracking-wider text-zinc-700 dark:text-zinc-300 shadow-sm mb-2.5 sm:mb-4">
              <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-[#FF5E1E] animate-pulse" />
              <span className="uppercase font-bold tracking-widest text-[#FF5E1E]">
                {badgeText}
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-[2.85rem] xl:text-[3.25rem] font-extrabold tracking-tight text-[#12131A] dark:text-white leading-[1.18] sm:leading-[1.12] mb-2.5 sm:mb-4">
              {headlinePart1}
              <span className="relative inline-block text-[#FF5E1E]">
                {headlineAccent}
                {/* Subtle underline stroke accent */}
                <svg
                  className="absolute left-0 -bottom-1 w-full h-2 text-[#FF5E1E]/40"
                  viewBox="0 0 100 12"
                  preserveAspectRatio="none"
                  fill="none"
                >
                  <path
                    d="M0 8 Q 50 0, 100 8"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              {headlinePart2}
            </h1>

            {/* Concise, impactful description */}
            <p className="text-xs sm:text-sm lg:text-base text-zinc-600 dark:text-zinc-300 max-w-lg leading-relaxed mb-4 sm:mb-6 font-normal">
              {descriptionText}
            </p>

            {/* Primary & Secondary Action Buttons: Compact, elegant, balanced */}
            <div className="flex flex-row items-center gap-2 sm:gap-3.5 w-full sm:w-auto mb-5 sm:mb-6">
              {/* Primary CTA: Order on WhatsApp */}
              <a
                href={getWhatsAppLink('Hello Hila Graphic, I would like to discuss a design project.')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 h-11 min-h-[44px] rounded-xl sm:rounded-full text-xs sm:text-sm font-bold text-white bg-[#FF5E1E] hover:bg-[#E84D0E] active:scale-[0.98] transition-all duration-200 orange-glow cursor-pointer shadow-md select-none whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4 flex-shrink-0" />
                <span>{primaryCtaText}</span>
              </a>

              {/* Secondary CTA: Explore Services */}
              <button
                onClick={scrollToServices}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-5 h-11 min-h-[44px] rounded-xl sm:rounded-full text-xs sm:text-sm font-semibold text-zinc-800 dark:text-zinc-100 bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.1] active:scale-[0.98] transition-all duration-200 border border-black/10 dark:border-white/10 cursor-pointer select-none whitespace-nowrap"
              >
                <span>{secondaryCtaText}</span>
                <ArrowDown className="w-3.5 h-3.5 text-[#FF5E1E] flex-shrink-0" />
              </button>
            </div>

            {/* Mobile-Only Service Showcase Slot (Appears immediately after CTAs on mobile, BEFORE statistics) */}
            <div className="w-full lg:hidden mb-5 sm:mb-6">
              <ShowcaseCarousel onSelectService={onSelectService} />
            </div>

            {/* Trust & Craft Metric Strip (Appears AFTER Service Showcase on mobile) */}
            <div className="w-full pt-3.5 sm:pt-4 border-t border-black/[0.07] dark:border-white/[0.08] grid grid-cols-3 gap-3 sm:gap-6">
              <div>
                <div className="font-display text-lg sm:text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                  {config.stats.satisfaction}
                </div>
                <div className="text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {t.hero.stat1Label}
                </div>
              </div>

              <div>
                <div className="font-display text-lg sm:text-2xl font-extrabold text-[#FF5E1E] tracking-tight">
                  {config.stats.completedProjects}
                </div>
                <div className="text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {t.hero.stat2Label}
                </div>
              </div>

              <div>
                <div className="font-display text-lg sm:text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                  {config.stats.experienceYears}
                </div>
                <div className="text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {t.hero.stat3Label}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Desktop-Only Showcase (Right side on desktop, hidden on mobile to prevent duplicate) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:flex lg:col-span-6 xl:col-span-7 justify-center lg:justify-end w-full"
          >
            <ShowcaseCarousel onSelectService={onSelectService} />
          </motion.div>

        </div>
      </div>
    </section>
  );
};
