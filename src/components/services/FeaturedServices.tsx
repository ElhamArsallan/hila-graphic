import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, MessageCircle, CheckCircle, Sparkles, Filter } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useSiteConfig } from '../../context/SiteConfigContext';
import { ServiceItem } from '../../types';

interface FeaturedServicesProps {
  onSelectService?: (service: ServiceItem) => void;
  onNavigate?: (route: string) => void;
}

export const FeaturedServices: React.FC<FeaturedServicesProps> = ({ onSelectService, onNavigate }) => {
  const { language, isRtl, t } = useLanguage();
  const { services, getWhatsAppLink } = useSiteConfig();
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');

  // Filter active services
  const activeServices = services.filter((s) => s.active !== false);

  const displayServices = activeCategoryFilter === 'all'
    ? activeServices
    : activeCategoryFilter === 'other'
    ? activeServices.filter((s) => s.id === 'other-services' || s.id.startsWith('other-') || !['branding', 'logo-design', 'poster-design', 'motion-graphics', 'company-profile'].includes(s.id))
    : activeServices.filter((s) => s.id === activeCategoryFilter);

  return (
    <section id="services" className="py-20 sm:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6 text-start">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5E1E]/10 text-[#FF5E1E] text-xs font-bold tracking-widest uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.services.badge}</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight">
              {t.services.title}
            </h2>
          </div>
          <p className="text-zinc-600 dark:text-zinc-300 max-w-md text-sm sm:text-base leading-relaxed">
            {t.services.subtitle}
          </p>
        </div>

        {/* 6 Core Services + Dynamic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {displayServices.map((service, index) => {
            const whatsappUrl = getWhatsAppLink(
              `Hello Hila Graphic, I am interested in your "${service.title.en}" service. Could you please share more details and a quote?`
            );

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: (index % 6) * 0.07 }}
                className="group relative rounded-[28px] liquid-glass liquid-glass-specular border border-white/70 dark:border-white/10 p-4 sm:p-5 flex flex-col justify-between hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-300 hover:-translate-y-1"
              >
                <div>
                  {/* Visual Poster Artwork Preview */}
                  <div 
                    onClick={() => onSelectService?.(service)}
                    className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-zinc-900 mb-5 cursor-pointer"
                  >
                    <img
                      src={service.posterImage}
                      alt={service.title[language]}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                    {/* Top Floating Badge */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-xs font-semibold text-white">
                      <span className="px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/15 font-mono text-[11px] text-[#FF5E1E] font-bold">
                        {service.number}
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-[10px] uppercase tracking-wider text-zinc-200">
                        {service.tags?.[0] || 'Service'}
                      </span>
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 
                    onClick={() => onSelectService?.(service)}
                    className="font-display text-xl font-bold text-zinc-900 dark:text-white tracking-tight mb-2 group-hover:text-[#FF5E1E] transition-colors cursor-pointer"
                  >
                    {service.title[language]}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed line-clamp-3 mb-4">
                    {service.subtitle[language]}
                  </p>

                  {/* Deliverables Preview Tags */}
                  {service.deliverables?.[language] && (
                    <div className="space-y-1.5 mb-6 pt-3 border-t border-black/[0.05] dark:border-white/[0.08]">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1.5">
                        {t.services.deliverablesLabel}:
                      </div>
                      {service.deliverables[language].slice(0, 3).map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-zinc-700 dark:text-zinc-300">
                          <CheckCircle className="w-3.5 h-3.5 text-[#FF5E1E] flex-shrink-0" />
                          <span className="truncate">{item}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Action Buttons */}
                <div className="flex items-center gap-2.5 pt-4 border-t border-black/[0.05] dark:border-white/[0.08]">
                  {/* Explore Details Trigger */}
                  <button
                    onClick={() => onSelectService?.(service)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3.5 rounded-xl text-xs font-semibold text-zinc-800 dark:text-zinc-100 bg-black/[0.04] dark:bg-white/[0.05] hover:bg-black/[0.08] dark:hover:bg-white/[0.1] transition-all cursor-pointer"
                  >
                    <span>{t.services.exploreService}</span>
                    <ArrowUpRight className={`w-3.5 h-3.5 text-[#FF5E1E] ${isRtl ? 'rotate-[-90deg]' : ''}`} />
                  </button>

                  {/* Direct WhatsApp Inquire Button */}
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-[#FF5E1E] hover:bg-[#E84D0E] text-white transition-all orange-glow flex items-center justify-center cursor-pointer shadow-md"
                    title={t.services.inquireOnWhatsApp}
                    aria-label="Inquire on WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* View Full Services & Pricing Action */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => onNavigate ? onNavigate('services') : null}
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-black/[0.04] dark:bg-white/[0.06] hover:bg-[#FF5E1E] hover:text-white text-zinc-800 dark:text-zinc-200 text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <span>{language === 'ps' ? 'د ټولو خدمتونو پوره لیست' : language === 'fa' ? 'مشاهده همه خدمات' : 'View All Services'}</span>
            <ArrowUpRight className={`w-4 h-4 ${isRtl ? 'rotate-[-90deg]' : ''}`} />
          </button>

          <button
            onClick={() => onNavigate ? onNavigate('price-list') : null}
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#FF5E1E]/10 hover:bg-[#FF5E1E] text-[#FF5E1E] hover:text-white text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <span>{t.nav.priceList}</span>
            <ArrowUpRight className={`w-4 h-4 ${isRtl ? 'rotate-[-90deg]' : ''}`} />
          </button>
        </div>

      </div>
    </section>
  );
};
