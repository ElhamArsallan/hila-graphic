import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowUpRight, MessageCircle, CheckCircle, Sparkles, DollarSign } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSiteConfig } from '../context/SiteConfigContext';
import { ServiceItem } from '../types';

interface ServicesPageProps {
  onNavigate: (route: string) => void;
  onSelectService: (service: ServiceItem) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onNavigate, onSelectService }) => {
  const { language, isRtl, t } = useLanguage();
  const { services, getWhatsAppLink } = useSiteConfig();

  const activeServices = services.filter((s) => s.active !== false);

  return (
    <div className="pt-28 pb-20 sm:pb-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <div className="mb-6">
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-[#FF5E1E] transition-colors cursor-pointer"
          >
            <ArrowLeft className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
            <span>{isRtl ? 'بېرته کور پاڼې ته' : 'Back to Home'}</span>
          </button>
        </div>

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mb-12 sm:mb-16 text-start"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5E1E]/10 text-[#FF5E1E] text-xs font-bold tracking-widest uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.services.badge}</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight mb-4">
            {language === 'ps'
              ? 'د هیلګرافیک ټول مسلکي خدمتونه'
              : language === 'fa'
              ? 'خدمات جامع طراحی گرافیک و تبلیغات'
              : 'Full Creative & Advertising Capabilities'}
          </h1>

          <p className="text-zinc-600 dark:text-zinc-300 text-sm sm:text-base leading-relaxed">
            {language === 'ps'
              ? 'له لوګو ډیزاین او برانډینګ څخه تر اعلاناتو، موشن ګرافیک او چاپي موادو پورې، هر خدمت په ځانګړي مهارت او نړیوال کیفیت وړاندې کیږي.'
              : language === 'fa'
              ? 'از طراحی هویت بصری و لوگو تا ساخت تیزرهای موشن، پوسترهای تبلیغاتی و کاتالوگ‌های حرفه‌ای؛ با بالاترین دقت هنری و استانداردهای روز دنیا.'
              : 'End-to-end design and advertising solutions calibrated for corporate distinction, brand equity, and commercial growth.'}
          </p>
        </motion.div>

        {/* Grid of All Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16">
          {activeServices.map((service, index) => {
            const whatsappUrl = getWhatsAppLink(
              `Hello Hila Graphic, I am inquiring about the "${service.title.en}" service. Please share availability and scope.`
            );

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
                className="group relative rounded-[30px] liquid-glass liquid-glass-specular border border-white/80 dark:border-white/10 p-5 sm:p-6 flex flex-col justify-between hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <div>
                  {/* Poster Showcase Preview */}
                  <div 
                    onClick={() => onSelectService(service)}
                    className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-zinc-950 mb-5 cursor-pointer"
                  >
                    <img
                      src={service.posterImage}
                      alt={service.title[language]}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

                    {/* Top Floating Badge */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-xs font-semibold text-white">
                      <span className="px-2.5 py-1 rounded-full bg-black/55 backdrop-blur-md border border-white/20 font-mono text-[11px] text-[#FF5E1E] font-bold">
                        {service.number}
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-[10px] uppercase tracking-wider text-zinc-200">
                        {service.tags?.[0] || 'Service'}
                      </span>
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 
                    onClick={() => onSelectService(service)}
                    className="font-display text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white tracking-tight mb-2 group-hover:text-[#FF5E1E] transition-colors cursor-pointer"
                  >
                    {service.title[language]}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed line-clamp-3 mb-5">
                    {service.subtitle[language]}
                  </p>

                  {/* Deliverables Checklist */}
                  {service.deliverables?.[language] && (
                    <div className="space-y-2 mb-6 pt-4 border-t border-black/[0.05] dark:border-white/[0.08]">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1.5">
                        {t.services.deliverablesLabel}:
                      </div>
                      {service.deliverables[language].slice(0, 4).map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-zinc-700 dark:text-zinc-300">
                          <CheckCircle className="w-3.5 h-3.5 text-[#FF5E1E] flex-shrink-0" />
                          <span className="truncate">{item}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Action Footers */}
                <div className="flex items-center gap-2.5 pt-4 border-t border-black/[0.05] dark:border-white/[0.08]">
                  <button
                    onClick={() => onSelectService(service)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-semibold text-zinc-800 dark:text-zinc-100 bg-black/[0.04] dark:bg-white/[0.05] hover:bg-[#FF5E1E] hover:text-white transition-all cursor-pointer"
                  >
                    <span>{t.services.exploreService}</span>
                    <ArrowUpRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-[-90deg]' : ''}`} />
                  </button>

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

        {/* Pricing Navigation Teaser */}
        <div className="rounded-[30px] p-6 sm:p-8 liquid-glass liquid-glass-specular border border-white/80 dark:border-white/15 flex flex-col sm:flex-row items-center justify-between gap-6 text-start">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#FF5E1E] uppercase tracking-wider mb-1">
              <DollarSign className="w-4 h-4" />
              <span>{t.nav.priceList}</span>
            </div>
            <h3 className="font-display text-xl font-bold text-zinc-900 dark:text-white">
              {language === 'ps' ? 'غواړئ د کڅوړو نرخونه وګورئ؟' : language === 'fa' ? 'مایلید پکیج‌ها و تعرفه‌ها را بررسی کنید؟' : 'Looking for Fixed Investment Packages?'}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              {language === 'ps' ? 'زموږ د پوره روښانه بیو لست وګورئ.' : language === 'fa' ? 'لیست قیمت‌های شفاف ما را ملاحظه فرمایید.' : 'Explore our complete Price List page with tiered deliverables.'}
            </p>
          </div>

          <button
            onClick={() => onNavigate('price-list')}
            className="px-6 py-3 rounded-2xl bg-[#FF5E1E] hover:bg-[#E84D0E] text-white font-bold text-xs sm:text-sm inline-flex items-center gap-2 orange-glow shadow-md flex-shrink-0 cursor-pointer"
          >
            <span>{t.nav.priceList}</span>
            <ArrowUpRight className={`w-4 h-4 ${isRtl ? 'rotate-[-90deg]' : ''}`} />
          </button>
        </div>

      </div>
    </div>
  );
};
