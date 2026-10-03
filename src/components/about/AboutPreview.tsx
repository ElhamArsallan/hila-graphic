import React from 'react';
import { motion } from 'motion/react';
import { Layers, Target, Compass, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useSiteConfig } from '../../context/SiteConfigContext';

interface AboutPreviewProps {
  onNavigate?: (route: string) => void;
}

export const AboutPreview: React.FC<AboutPreviewProps> = ({ onNavigate }) => {
  const { isRtl, t, language } = useLanguage();
  const { config } = useSiteConfig();

  const pillars = [
    {
      icon: Layers,
      title: t.about.pillar1Title,
      desc: t.about.pillar1Desc,
    },
    {
      icon: Target,
      title: t.about.pillar2Title,
      desc: t.about.pillar2Desc,
    },
    {
      icon: Compass,
      title: t.about.pillar3Title,
      desc: t.about.pillar3Desc,
    },
  ];

  return (
    <section id="about" className="py-20 sm:py-28 relative overflow-hidden">
      {/* Background ambient accents */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#FF5E1E]/[0.03] dark:bg-[#FF5E1E]/[0.05] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Visual Showcase Glass Area (Left / Order 2 on mobile) */}
          <motion.div
            initial={{ opacity: 0, x: isRtl ? 30 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 order-2 lg:order-1 relative"
          >
            {/* Liquid Glass Showcase Card */}
            <div className="relative rounded-[32px] overflow-hidden liquid-glass border border-white/80 dark:border-white/10 p-3 shadow-2xl">
              {/* Main Visual Agency Artwork */}
              <div className="relative aspect-[4/5] rounded-[24px] overflow-hidden bg-zinc-900">
                <img
                  src="https://images.unsplash.com/photo-1542744094-3a31f272c490?q=80&w=1200&auto=format&fit=crop"
                  alt="Hila Graphic Design Studio"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                {/* Floating Agency Philosophy Card inside the visual */}
                <div className="absolute bottom-4 left-4 right-4 p-5 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/15 text-white">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Sparkles className="w-4 h-4 text-[#FF5E1E]" />
                    <span className="text-[10px] font-bold tracking-widest uppercase text-[#FF5E1E]">
                      {t.about.agencyCardTag}
                    </span>
                  </div>
                  <h4 className="font-display text-base sm:text-lg font-bold leading-tight">
                    {t.about.agencyCardTitle}
                  </h4>
                  <p className="text-xs text-zinc-300 mt-1.5 line-clamp-3 leading-relaxed">
                    {t.about.agencyCardDesc}
                  </p>
                </div>
              </div>

              {/* Floating Verified Excellence Badge */}
              <div className="absolute -top-4 -right-4 sm:-right-6 px-4 py-2.5 rounded-2xl liquid-glass border border-white/80 dark:border-white/15 shadow-xl flex items-center gap-2.5 text-xs font-semibold text-zinc-800 dark:text-white">
                <div className="w-7 h-7 rounded-full bg-[#FF5E1E] text-white flex items-center justify-center font-bold">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-zinc-900 dark:text-white">{config.stats.experienceYears} Years</div>
                  <div className="text-[10px] text-zinc-500 dark:text-zinc-400">Design Mastery</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Narrative & Strategic Pillars (Right / Order 1 on mobile) */}
          <motion.div
            initial={{ opacity: 0, x: isRtl ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 order-1 lg:order-2 flex flex-col text-start"
          >
            {/* Category Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5E1E]/10 text-[#FF5E1E] text-xs font-bold tracking-widest uppercase mb-4 w-fit">
              <span>{t.about.badge}</span>
            </div>

            {/* Title */}
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-[1.18] mb-6">
              {t.about.title}
            </h2>

            {/* Paragraphs */}
            <p className="text-base text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4">
              {t.about.paragraph1}
            </p>
            <p className="text-base text-zinc-600 dark:text-zinc-300 leading-relaxed mb-8">
              {t.about.paragraph2}
            </p>

            {/* 3 Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {pillars.map((pillar, idx) => {
                const Icon = pillar.icon;
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl liquid-glass border border-black/[0.05] dark:border-white/[0.08] hover:border-[#FF5E1E]/30 transition-all duration-300"
                  >
                    <div className="w-8 h-8 rounded-xl bg-[#FF5E1E]/10 text-[#FF5E1E] flex items-center justify-center mb-3">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="font-display text-sm font-bold text-zinc-900 dark:text-white mb-1">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* CTA button to explore full about page */}
            <div>
              <button
                type="button"
                onClick={() => {
                  if (onNavigate) {
                    onNavigate('about');
                  } else {
                    const el = document.getElementById('about');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="inline-flex items-center gap-2 text-sm font-bold text-[#FF5E1E] hover:text-[#E84D0E] group transition-colors cursor-pointer"
              >
                <span>{language === 'ps' ? 'زموږ پوره کیسه ولولئ' : language === 'fa' ? 'مطالعه داستان کامل ما' : 'Read Our Full Story'}</span>
                <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${isRtl ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
