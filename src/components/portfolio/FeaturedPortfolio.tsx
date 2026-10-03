import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, Sparkles, Filter } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useSiteConfig } from '../../context/SiteConfigContext';
import { PortfolioItem } from '../../types';
import { ProjectImageGallery } from '../common/ProjectImageGallery';

interface FeaturedPortfolioProps {
  onSelectProject?: (project: PortfolioItem) => void;
  onNavigate?: (route: string) => void;
}

export const FeaturedPortfolio: React.FC<FeaturedPortfolioProps> = ({ onSelectProject, onNavigate }) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const { language, isRtl, t } = useLanguage();
  const { portfolio } = useSiteConfig();

  const filterTabs = [
    { id: 'all', label: t.portfolio.filterAll },
    { id: 'branding', label: t.portfolio.filterBranding },
    { id: 'logo', label: t.portfolio.filterLogo },
    { id: 'poster', label: t.portfolio.filterPoster },
    { id: 'motion', label: t.portfolio.filterMotion },
    { id: 'profile', label: t.portfolio.filterProfile },
  ];

  const filteredProjects = activeFilter === 'all'
    ? portfolio
    : portfolio.filter((p) => p.category === activeFilter);

  return (
    <section id="portfolio" className="py-20 sm:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header and Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-14 gap-6 text-start">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5E1E]/10 text-[#FF5E1E] text-xs font-bold tracking-widest uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.portfolio.badge}</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight">
              {t.portfolio.title}
            </h2>
          </div>

          <p className="text-zinc-600 dark:text-zinc-300 max-w-md text-sm sm:text-base leading-relaxed">
            {t.portfolio.subtitle}
          </p>
        </div>

        {/* Filter Tabs (Liquid Glass Capsule) */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl liquid-glass border border-black/[0.06] dark:border-white/10 w-fit mb-10 overflow-x-auto max-w-full">
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer select-none
                  ${isActive
                    ? 'bg-[#FF5E1E] text-white shadow-md'
                    : 'text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Portfolio Showcase Grid */}
        <motion.div 
          layout 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          <AnimatePresence>
            {filteredProjects.map((project, idx) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
                onClick={() => onSelectProject?.(project)}
                className={`group relative rounded-[28px] overflow-hidden liquid-glass border border-white/70 dark:border-white/10 cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1
                  ${idx === 0 ? 'md:col-span-2 aspect-[16/9]' : 'aspect-[4/3]'}
                `}
              >
                {/* Interactive Multi-Image Slideshow Gallery & Video Badge inside Existing Image Frame */}
                <ProjectImageGallery
                  mainImage={project.image}
                  galleryImages={project.galleryImages}
                  videoUrl={project.videoUrl}
                  alt={project.title[language] || project.title.en}
                  className="w-full h-full"
                  onVideoClick={() => onSelectProject?.(project)}
                />

                {/* Dark Vignette Overlay for Crisp Legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300" />

                {/* Top Client and Year Badges */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                  <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white text-xs font-medium">
                    {project.client}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-white/80 text-xs font-mono">
                    {project.year}
                  </span>
                </div>

                {/* Bottom Title & Tags */}
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 text-white text-start">
                  <div className="flex items-center gap-2 mb-1.5">
                    {project.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[10px] font-bold uppercase tracking-widest text-[#FF5E1E] bg-[#FF5E1E]/10 px-2 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-end justify-between gap-4">
                    <h3 className="font-display text-lg sm:text-xl font-bold leading-tight group-hover:text-[#FF5E1E] transition-colors">
                      {project.title[language] || project.title.en}
                    </h3>

                    <div className="w-9 h-9 rounded-full bg-white/10 group-hover:bg-[#FF5E1E] backdrop-blur-md border border-white/20 flex items-center justify-center transition-all group-hover:scale-110 flex-shrink-0">
                      <ArrowUpRight className={`w-4 h-4 text-white ${isRtl ? 'rotate-[-90deg]' : ''}`} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* View Complete Portfolio Button */}
        <div className="mt-12 text-center">
          <button
            onClick={() => onNavigate ? onNavigate('portfolio') : null}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] hover:bg-[#FF5E1E] hover:text-white text-zinc-900 dark:text-white font-bold text-xs sm:text-sm transition-all duration-300 cursor-pointer shadow-sm hover:shadow-lg"
          >
            <span>{language === 'ps' ? 'ټولې پروژې او نمونې وګورئ' : language === 'fa' ? 'مشاهده همه نمونه کارها' : 'Explore Complete Portfolio Archive'}</span>
            <ArrowUpRight className={`w-4 h-4 ${isRtl ? 'rotate-[-90deg]' : ''}`} />
          </button>
        </div>

      </div>
    </section>
  );
};
