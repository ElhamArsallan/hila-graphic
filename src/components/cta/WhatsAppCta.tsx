import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MessageCircle, Clock, ShieldCheck, ArrowRight, Settings, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useSiteConfig } from '../../context/SiteConfigContext';

interface WhatsAppCtaProps {
  onOpenConfigModal?: () => void;
}

export const WhatsAppCta: React.FC<WhatsAppCtaProps> = ({ onOpenConfigModal }) => {
  const { isRtl, t } = useLanguage();
  const { config, getWhatsAppLink } = useSiteConfig();
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);

  const quickPrompts = [
    t.whatsapp.prompt1,
    t.whatsapp.prompt2,
    t.whatsapp.prompt3,
    t.whatsapp.prompt4,
  ];

  const currentMessage = selectedPrompt 
    ? `Hello Hila Graphic, ${selectedPrompt}.`
    : `Hello Hila Graphic, I would like to discuss a project.`;

  return (
    <section id="contact" className="py-20 sm:py-28 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#FF5E1E]/[0.08] dark:bg-[#FF5E1E]/[0.12] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-[36px] liquid-glass liquid-glass-specular border border-white/80 dark:border-white/15 p-8 sm:p-12 lg:p-16 shadow-[0_25px_60px_rgba(0,0,0,0.08)] dark:shadow-[0_30px_70px_rgba(0,0,0,0.55)] text-center overflow-hidden"
        >
          {/* Subtle decorative glass badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF5E1E]/10 text-[#FF5E1E] text-xs font-bold tracking-widest uppercase mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.whatsapp.badge}</span>
          </div>

          {/* Heading */}
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-[1.18] max-w-3xl mx-auto mb-6">
            {t.whatsapp.title}
          </h2>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed font-normal">
            {t.whatsapp.subtitle}
          </p>

          {/* Quick Inquiry Pre-fills */}
          <div className="max-w-2xl mx-auto mb-10 text-start">
            <div className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3 text-center">
              {t.whatsapp.quickPromptsLabel}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedPrompt(prompt === selectedPrompt ? null : prompt)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer text-start
                    ${selectedPrompt === prompt
                      ? 'bg-[#FF5E1E] text-white shadow-md'
                      : 'bg-black/[0.04] dark:bg-white/[0.06] text-zinc-700 dark:text-zinc-300 hover:bg-black/[0.08] dark:hover:bg-white/[0.1] border border-black/[0.04] dark:border-white/[0.08]'
                    }`}
                >
                  💬 {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <a
              href={getWhatsAppLink(currentMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-9 py-4 rounded-full text-base font-bold text-white bg-[#FF5E1E] hover:bg-[#E84D0E] active:scale-[0.98] transition-all duration-200 orange-glow cursor-pointer shadow-xl select-none"
            >
              <MessageCircle className="w-5 h-5" />
              <span>{t.whatsapp.ctaButton}</span>
            </a>

            {/* Config Button (Shows Architecture is ready for dynamic number) */}
            {onOpenConfigModal && (
              <button
                onClick={onOpenConfigModal}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-full text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white bg-black/[0.03] dark:bg-white/[0.04] hover:bg-black/[0.06] dark:hover:bg-white/[0.08] transition-all cursor-pointer"
                title="Configure Official WhatsApp Number"
              >
                <Settings className="w-3.5 h-3.5 text-zinc-500" />
                <span>{config.whatsappNumber}</span>
              </button>
            )}
          </div>

          {/* Studio Response Guarantee Strip */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-500 dark:text-zinc-400 pt-6 border-t border-black/[0.06] dark:border-white/[0.08]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-semibold text-zinc-700 dark:text-zinc-300">{t.whatsapp.statusActive}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              <span>{t.whatsapp.responseSpeed}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
              <span>{t.whatsapp.numberConfigPrompt}</span>
            </div>
          </div>

        </motion.div>
      </div>
    </section>
  );
};
