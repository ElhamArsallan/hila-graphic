import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, ArrowUpRight, MessageCircle, Pause, Play, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useSiteConfig } from '../../context/SiteConfigContext';
import { ServiceItem } from '../../types';

interface ShowcaseCarouselProps {
  onSelectService?: (service: ServiceItem) => void;
}

export const ShowcaseCarousel: React.FC<ShowcaseCarouselProps> = ({ onSelectService }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { language, isRtl, t } = useLanguage();
  const { services, getWhatsAppLink } = useSiteConfig();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Touch swipe handling
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Filter only active services
  const activeServices = services.filter((s) => s.active !== false);
  const currentService = activeServices[currentIndex] || activeServices[0];

  useEffect(() => {
    if (isPaused || activeServices.length <= 1) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeServices.length);
    }, 5500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, activeServices.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeServices.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activeServices.length) % activeServices.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 45;
    if (diff > threshold) {
      // Swiped left
      isRtl ? handlePrev() : handleNext();
    } else if (diff < -threshold) {
      // Swiped right
      isRtl ? handleNext() : handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (!currentService) return null;

  const serviceWhatsAppUrl = getWhatsAppLink(
    `Hello Hila Graphic, I am interested in your "${currentService.title.en}" service. Please share details and pricing.`
  );

  return (
    <div 
      className="relative isolate w-full max-w-[480px] lg:max-w-[500px] xl:max-w-[520px] mx-auto group select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Ambient Glow Under Glass */}
      <div 
        className="absolute -inset-2 z-0 rounded-[36px] bg-gradient-to-tr from-[#FF5E1E]/20 via-[#FF5E1E]/5 to-transparent blur-2xl opacity-60 dark:opacity-40 transition-opacity duration-500 pointer-events-none"
      />

      <span aria-hidden="true" className="showcase-edge-glow" />

      {/* Main Liquid Glass Showcase Container */}
      <div className="relative z-[2] aspect-[4/3.2] sm:aspect-square md:aspect-[4/3.8] lg:aspect-square xl:aspect-[4/3.8] w-full rounded-[22px] sm:rounded-[36px] p-2 sm:p-3.5 liquid-glass liquid-glass-specular border border-white/80 dark:border-white/20 overflow-hidden shadow-[0_20px_50px_-10px_rgba(0,0,0,0.12)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.75)] flex flex-col justify-between">
        
        {/* Poster Media Stage */}
        <div 
          onClick={() => onSelectService?.(currentService)}
          className="relative w-full h-full rounded-[18px] sm:rounded-[28px] overflow-hidden bg-zinc-950 flex items-center justify-center cursor-pointer group/stage"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentService.id}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 w-full h-full"
            >
              {/* Artwork Poster Image */}
              <img
                src={currentService.posterImage}
                alt={currentService.title[language]}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover/stage:scale-105"
              />

              {/* Dark Vignette Gradient for Crisp Typography */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/30 pointer-events-none" />

              {/* Specular Diagonal Reflection */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none" />
            </motion.div>
          </AnimatePresence>

          {/* Top Glass Floating Header */}
          <div className="absolute top-2.5 sm:top-4 left-2.5 sm:left-4 right-2.5 sm:right-4 z-20 flex items-center justify-between pointer-events-auto">
            <div className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-black/60 backdrop-blur-xl border border-white/25 text-white flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold tracking-wider shadow-lg">
              <span className="text-[#FF5E1E] font-bold font-mono">{currentService.number}</span>
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <span className="truncate max-w-[140px] sm:max-w-none">{currentService.title[language]}</span>
            </div>

            {/* Controls: Sample Count Badge & Play/Pause */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              {currentService.galleryImages && currentService.galleryImages.length > 0 && (
                <span className="hidden sm:inline-flex px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-[11px] font-medium font-mono">
                  {currentService.galleryImages.length + 1} Samples
                </span>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPaused(!isPaused);
                }}
                className="p-1 sm:p-1.5 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/25 text-white/90 hover:text-white transition-colors cursor-pointer"
                title={isPaused ? 'Play autoplay' : 'Pause autoplay'}
                aria-label="Toggle autoplay"
              >
                {isPaused ? <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FF5E1E]" /> : <Pause className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
              </button>
            </div>
          </div>

          {/* Bottom Floating Glass Card: Service Details & WhatsApp Action */}
          <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 z-20 pointer-events-auto">
            <motion.div
              key={`card-${currentService.id}`}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.35, delay: 0.05 }}
              className="rounded-xl sm:rounded-2xl bg-white/80 dark:bg-[#0C0E17]/85 backdrop-blur-2xl backdrop-saturate-[180%] border border-white/85 dark:border-white/20 p-2.5 sm:p-4 shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.95),0_16px_36px_-6px_rgba(0,0,0,0.18)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.22),0_24px_50px_-10px_rgba(0,0,0,0.85)] text-start relative overflow-hidden"
            >
              {/* Hairline Specular Top Highlight */}
              <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-white/90 dark:via-white/50 to-transparent pointer-events-none" />

              {/* Controlled Subtle Orange Ambient Light */}
              <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-[#FF5E1E]/12 dark:bg-[#FF5E1E]/15 blur-xl pointer-events-none" />

              <div className="relative z-10 flex items-start justify-between gap-2 sm:gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest text-[#FF5E1E]">
                      {t.hero.showcaseLabel}
                    </span>
                    <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-[#FF5E1E]" />
                    <span className="hidden sm:inline-block text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                      {currentService.tags?.[0]}
                    </span>
                  </div>
                  <h3 className="font-display text-xs sm:text-lg font-bold text-zinc-950 dark:text-white truncate mt-0.5 tracking-tight">
                    {currentService.title[language]}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-zinc-700 dark:text-zinc-300 font-medium line-clamp-1 sm:line-clamp-2 mt-0.5 leading-relaxed">
                    {currentService.subtitle[language]}
                  </p>
                </div>

                {/* Direct Action Buttons */}
                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectService?.(currentService);
                    }}
                    className="p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl bg-black/5 dark:bg-white/10 hover:bg-[#FF5E1E] hover:text-white text-zinc-800 dark:text-zinc-200 transition-colors cursor-pointer border border-black/5 dark:border-white/10"
                    title={t.hero.viewProject}
                  >
                    <ArrowUpRight className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isRtl ? 'rotate-[-90deg]' : ''}`} />
                  </button>

                  <a
                    href={serviceWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl bg-[#FF5E1E] hover:bg-[#E84D0E] text-white transition-all orange-glow flex items-center justify-center cursor-pointer shadow-md"
                    title="Order on WhatsApp"
                  >
                    <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </a>
                </div>
              </div>

              {/* Progress Dots & Nav Chevrons */}
              <div className="relative z-10 flex items-center justify-between pt-1.5 sm:pt-3 mt-1.5 sm:mt-3 border-t border-black/[0.07] dark:border-white/[0.1]">
                {/* Dots indicator */}
                <div className="flex items-center gap-1 sm:gap-1.5">
                  {activeServices.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentIndex(idx);
                      }}
                      className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                        idx === currentIndex
                          ? 'w-5 sm:w-6 bg-[#FF5E1E]'
                          : 'w-1.5 bg-black/25 dark:bg-white/25 hover:bg-black/40 dark:hover:bg-white/40'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>

                {/* Manual Prev / Next Arrow triggers */}
                <div className="flex items-center gap-0.5 sm:gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      isRtl ? handleNext() : handlePrev();
                    }}
                    className="p-1 sm:p-1.5 rounded-md sm:rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
                    aria-label="Previous service"
                  >
                    <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      isRtl ? handlePrev() : handleNext();
                    }}
                    className="p-1 sm:p-1.5 rounded-md sm:rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
                    aria-label="Next service"
                  >
                    <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

        </div>

      </div>
    </div>
  );
};
