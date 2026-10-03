import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, MessageCircle, Sparkles, Shield, DollarSign } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useSiteConfig } from '../../context/SiteConfigContext';

interface PriceListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PriceListModal: React.FC<PriceListModalProps> = ({ isOpen, onClose }) => {
  const { language, isRtl, t } = useLanguage();
  const { pricePackages, getWhatsAppLink } = useSiteConfig();

  // Keyboard accessibility (ESC to close) and body scroll lock
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const activePackages = pricePackages.filter((p) => p.active !== false).sort((a, b) => a.order - b.order);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window: Contained in Viewport */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-5xl max-h-[90vh] flex flex-col rounded-[28px] sm:rounded-[36px] liquid-glass liquid-glass-specular border border-white/80 dark:border-white/15 shadow-2xl overflow-hidden z-10 text-start"
        >
          {/* Header */}
          <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-black/[0.06] dark:border-white/[0.08] bg-white/60 dark:bg-black/40 backdrop-blur-md">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-[#FF5E1E]/10 text-[#FF5E1E]">
                <DollarSign className="w-4 h-4" />
              </span>
              <div>
                <h3 className="font-display text-lg sm:text-xl font-bold text-zinc-900 dark:text-white">
                  {t.nav.priceList}
                </h3>
                <p className="text-[11px] text-zinc-500">
                  Transparent investment packages designed for ambitious commercial brands.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 text-zinc-600 dark:text-zinc-300 transition-colors"
              aria-label={t.common.close}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable Pricing Tiers */}
          <div className="flex-1 overflow-y-auto overscroll-contain p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {activePackages.map((pkg) => {
                const isPopular = pkg.popular;
                const packageName = pkg.name[language] || pkg.name.en;
                const packageTagline = pkg.tagline[language] || pkg.tagline.en;
                const featuresList = pkg.features[language] || pkg.features.en;
                const periodText = pkg.period ? (pkg.period[language] || pkg.period.en) : 'per project';

                const packageWhatsAppUrl = getWhatsAppLink(
                  `Hello Hila Graphic, I would like to book the "${pkg.name.en}" package (${pkg.price}).`
                );

                return (
                  <div
                    key={pkg.id}
                    className={`relative rounded-[24px] p-5 sm:p-6 flex flex-col justify-between transition-all duration-300
                      ${isPopular
                        ? 'liquid-glass border-2 border-[#FF5E1E] shadow-[0_20px_45px_rgba(255,94,30,0.15)] dark:shadow-[0_20px_45px_rgba(255,94,30,0.25)]'
                        : 'liquid-glass border border-white/70 dark:border-white/10'
                      }`}
                  >
                    {isPopular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#FF5E1E] text-white text-[10px] font-bold uppercase tracking-wider shadow-md">
                        Most Popular Choice
                      </div>
                    )}

                    <div>
                      {/* Price & Period */}
                      <div className="flex items-baseline gap-1.5 mb-1">
                        <span className="font-display text-3xl font-extrabold text-[#FF5E1E]">
                          {pkg.price}
                        </span>
                        <span className="text-xs text-zinc-500 font-medium">
                          / {periodText}
                        </span>
                      </div>

                      <h4 className="font-display text-lg font-bold text-zinc-900 dark:text-white mt-2">
                        {packageName}
                      </h4>
                      <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed mt-1 mb-5">
                        {packageTagline}
                      </p>

                      {/* Features List */}
                      <div className="space-y-2.5 pt-4 border-t border-black/[0.06] dark:border-white/[0.08]">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                          Included In Suite:
                        </div>
                        {featuresList.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-zinc-700 dark:text-zinc-200">
                            <Check className="w-3.5 h-3.5 text-[#FF5E1E] flex-shrink-0 mt-0.5" />
                            <span className="leading-snug">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Package Action Button */}
                    <div className="pt-6 mt-6 border-t border-black/[0.06] dark:border-white/[0.08]">
                      <a
                        href={packageWhatsAppUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all
                          ${isPopular
                            ? 'bg-[#FF5E1E] hover:bg-[#E84D0E] text-white orange-glow shadow-md'
                            : 'bg-black/5 dark:bg-white/10 hover:bg-[#FF5E1E] hover:text-white text-zinc-800 dark:text-zinc-200'
                          }`}
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Order via WhatsApp</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Modal Footer Guarantee */}
          <div className="flex-shrink-0 px-6 py-3.5 border-t border-black/[0.06] dark:border-white/[0.08] bg-white/60 dark:bg-black/40 backdrop-blur-md flex items-center justify-between text-xs text-zinc-500">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#FF5E1E]" />
              <span>100% Original Vector Master Files & Commercial Copyright Transfer Included.</span>
            </div>
            <button
              onClick={onClose}
              className="text-xs text-[#FF5E1E] font-semibold hover:underline"
            >
              {t.common.close}
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
