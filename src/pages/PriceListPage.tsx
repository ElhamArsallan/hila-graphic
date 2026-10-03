import React from 'react';
import { motion } from 'motion/react';
import { Check, MessageCircle, DollarSign, Sparkles, Shield, ArrowLeft, ArrowRight, HelpCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSiteConfig } from '../context/SiteConfigContext';
import { PricePackage } from '../types';

interface PriceListPageProps {
  onNavigate: (route: string) => void;
}

export const PriceListPage: React.FC<PriceListPageProps> = ({ onNavigate }) => {
  const { language, isRtl, t } = useLanguage();
  const { pricePackages, getWhatsAppLink } = useSiteConfig();

  const activePackages = pricePackages
    .filter((p) => p.active !== false)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="pt-28 pb-20 sm:pb-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb / Back Link */}
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
            <DollarSign className="w-3.5 h-3.5" />
            <span>{t.nav.priceList}</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight mb-4">
            {language === 'ps'
              ? 'د لوړ کیفیت ډیزاین کڅوړې او د بیو لست'
              : language === 'fa'
              ? 'پکیج‌های طراحی تخصصی و لیست تعرفه‌ها'
              : 'Transparent Agency Packages & Pricing'}
          </h1>

          <p className="text-zinc-600 dark:text-zinc-300 text-sm sm:text-base leading-relaxed">
            {language === 'ps'
              ? 'د هیلګرافیک له لارې ستاسو د سوداګرۍ لپاره ثابتې، روښانه او معیاري کڅوړې. پرته له پټو لګښتونو، بشپړ مسلکي تضمین.'
              : language === 'fa'
              ? 'پکیج‌های استاندارد و شفاف برای هویت بصری، تبلیغات و خدمات گرافیکی کسب‌وکار شما با گارانتی کیفیت استودیو هیلا گرافیک.'
              : 'Direct, all-inclusive creative investment tiers tailored for growing businesses and high-standard commercial enterprises. Every package includes source files, copyright transfer, and dedicated art direction.'}
          </p>
        </motion.div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {activePackages.map((pkg, idx) => {
            const isPopular = pkg.popular;
            const packageName = pkg.name[language] || pkg.name.en;
            const packageTagline = pkg.tagline[language] || pkg.tagline.en;
            const featuresList = pkg.features[language] || pkg.features.en;
            const periodText = pkg.period ? (pkg.period[language] || pkg.period.en) : 'per project';

            const packageWhatsAppUrl = getWhatsAppLink(
              `Hello Hila Graphic, I would like to order the "${pkg.name.en}" package (${pkg.price}). Please provide initiation steps.`
            );

            return (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                className={`relative rounded-[30px] p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 liquid-glass liquid-glass-specular
                  ${isPopular 
                    ? 'border-2 border-[#FF5E1E] shadow-[0_20px_50px_rgba(255,94,30,0.15)] dark:shadow-[0_25px_60px_rgba(255,94,30,0.25)]' 
                    : 'border border-white/80 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20'
                  }`}
              >
                {/* Popular Pill */}
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#FF5E1E] text-white text-[11px] font-bold uppercase tracking-wider shadow-lg flex items-center gap-1.5 whitespace-nowrap">
                    <Sparkles className="w-3 h-3" />
                    <span>{language === 'ps' ? 'تر ټولو غوره کڅوړه' : language === 'fa' ? 'محبوب‌ترین انتخاب' : 'Most Popular Choice'}</span>
                  </div>
                )}

                <div>
                  {/* Package Title & Subtitle */}
                  <div className="mb-4">
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
                      {packageName}
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                      {packageTagline}
                    </p>
                  </div>

                  {/* Price & Billing */}
                  <div className="flex items-baseline gap-2 pb-5 mb-5 border-b border-black/[0.06] dark:border-white/[0.08]">
                    <span className="font-display text-3xl sm:text-4xl font-extrabold text-[#FF5E1E] tracking-tight">
                      {pkg.price}
                    </span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                      / {periodText}
                    </span>
                  </div>

                  {/* Included Items List */}
                  <div className="space-y-2.5 mb-6">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">
                      {language === 'ps' ? 'شامل خدمات:' : language === 'fa' ? 'موارد شامل پکیج:' : "What's Included:"}
                    </div>
                    {featuresList.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                        <div className="w-4 h-4 rounded-full bg-[#FF5E1E]/10 text-[#FF5E1E] flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Action & Per-Card WhatsApp Contact Button */}
                <div className="pt-4 border-t border-black/[0.06] dark:border-white/[0.08]">
                  <a
                    href={packageWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full py-3 px-4 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-md select-none
                      ${isPopular
                        ? 'bg-[#FF5E1E] hover:bg-[#E84D0E] text-white orange-glow'
                        : 'bg-black/[0.05] dark:bg-white/[0.08] hover:bg-[#FF5E1E] hover:text-white text-zinc-900 dark:text-white'
                      }`}
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{language === 'ps' ? 'په واټساف امر وکړئ' : language === 'fa' ? 'سفارش در واتساپ' : 'Order via WhatsApp'}</span>
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Custom Project Tailored Inquiry Banner */}
        <div className="rounded-[32px] p-6 sm:p-10 liquid-glass liquid-glass-specular border border-white/80 dark:border-white/15 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 text-start">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#FF5E1E] uppercase tracking-wider mb-2">
              <HelpCircle className="w-4 h-4" />
              <span>{language === 'ps' ? 'ځانګړې اړتیا لرئ؟' : language === 'fa' ? 'پروژه اختصاصی دارید؟' : 'Need a Bespoke Solution?'}</span>
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white mb-2">
              {language === 'ps'
                ? 'ستاسو د ځانګړې بودیجې او پروژې لپاره ځانګړی قیمت'
                : language === 'fa'
                ? 'استعلام قیمت و مشاوره بر اساس نیازهای مشخص برند شما'
                : 'Custom Scope, Advertising Campaigns & Retainers'}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              {language === 'ps'
                ? 'که چیرې ستاسو پروژه د پورتنیو کڅوړو څخه بهر وي، موږ ته اړیکه ونیسئ ترڅو ستاسو لپاره مناسب وړاندیز چمتو کړو.'
                : language === 'fa'
                ? 'اگر خدمات مورد نیاز شما فراتر از پکیج‌های فوق است، با تیم ما گفتگو کنید تا یک پیشنهاد اختصاصی دریافت نمایید.'
                : 'For high-volume ongoing creative retainers, full brand redesigns, or national campaign rollouts, contact us directly for an itemized estimate.'}
            </p>
          </div>

          <a
            href={getWhatsAppLink('Hello Hila Graphic, I have a custom design requirement. Could we discuss a tailored quote?')}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-2xl bg-[#FF5E1E] hover:bg-[#E84D0E] text-white font-bold text-sm inline-flex items-center gap-2 orange-glow shadow-lg transition-all flex-shrink-0 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{language === 'ps' ? 'مستقیم مشوره' : language === 'fa' ? 'مشاوره اختصاصی' : 'Discuss Custom Scope'}</span>
          </a>
        </div>

      </div>
    </div>
  );
};
