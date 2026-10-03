import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowUpRight, Sparkles, Filter, MessageCircle, Share2, Layers } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSiteConfig } from '../context/SiteConfigContext';
import { PortfolioItem } from '../types';
import { ProjectImageGallery } from '../components/common/ProjectImageGallery';

interface PortfolioPageProps {
  onNavigate: (route: string) => void;
  onSelectProject: (project: PortfolioItem) => void;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({ onNavigate, onSelectProject }) => {
  const { language, isRtl, t } = useLanguage();
  const { portfolio, getWhatsAppLink } = useSiteConfig();
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: language === 'ps' ? 'ټول کارونه' : language === 'fa' ? 'همه آثار' : 'All' },
    { id: 'logo', label: language === 'ps' ? 'د لوګو ډیزاین' : language === 'fa' ? 'طراحی لوگو' : 'Logo Design' },
    { id: 'branding', label: language === 'ps' ? 'برانډینګ او هویت' : language === 'fa' ? 'برندینگ و هویت' : 'Branding' },
    { id: 'poster', label: language === 'ps' ? 'د پوسټر ډیزاین' : language === 'fa' ? 'طراحی پوستر' : 'Poster Design' },
    { id: 'profile', label: language === 'ps' ? 'د کمپنۍ پېژندپاڼه' : language === 'fa' ? 'پروفایل و کاتالوگ' : 'Company Profile' },
    { id: 'social', label: language === 'ps' ? 'سوشل میډیا ډیزاین' : language === 'fa' ? 'طراحی شبکه‌های اجتماعی' : 'Social Media Design' },
    { id: 'motion', label: language === 'ps' ? 'ویډیو او موشن' : language === 'fa' ? 'ویدیو و موشن گرافیک' : 'Video / Motion Graphics' },
    { id: 'other', label: language === 'ps' ? 'نور ګرافیکي خدمات' : language === 'fa' ? 'سایر خدمات گرافیک' : 'Other Graphic Services' },
  ];

  const filteredItems = activeCategory === 'all'
    ? portfolio
    : activeCategory === 'other'
    ? portfolio.filter((p) => !['logo', 'branding', 'poster', 'profile', 'social', 'motion'].includes(p.category))
    : portfolio.filter((p) => p.category === activeCategory);

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

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mb-10 text-start"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5E1E]/10 text-[#FF5E1E] text-xs font-bold tracking-widest uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.portfolio.badge}</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight mb-4">
            {language === 'ps'
              ? 'د هیلګرافیک غوره ډیزاین شوې پروژې'
              : language === 'fa'
              ? 'نمونه آثار منتخب و پروژه‌های شاخص'
              : 'Selected Commercial Portfolio & Case Studies'}
          </h1>

          <p className="text-zinc-600 dark:text-zinc-300 text-sm sm:text-base leading-relaxed">
            {language === 'ps'
              ? 'زموږ د مسلکي ډیزاینرانو لخوا پلي شوي بریالي برانډینګ، لوګو، اعلانات او موشن پروژې وګورئ او خپله پروژه پیل کړئ.'
              : language === 'fa'
              ? 'مجموعه‌ای سازمان‌یافته از هویت‌های بصری، پوسترها، کاتالوگ‌ها و موشن گرافیک‌های طراحی شده توسط استودیو هیلا گرافیک.'
              : 'A curated visual archive demonstrating brand identities, typographic advertising, editorial profiles, and motion design crafted for regional and global enterprises.'}
          </p>
        </motion.div>

        {/* Structured Category Navigation Filters */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl liquid-glass border border-black/[0.06] dark:border-white/10 w-fit mb-12 overflow-x-auto max-w-full">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer select-none
                  ${isActive
                    ? 'bg-[#FF5E1E] text-white shadow-md'
                    : 'text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Organized Project Cards Grid */}
        <motion.div 
          layout 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16"
        >
          <AnimatePresence>
            {filteredItems.map((project) => {
              const projectTitle = project.title[language] || project.title.en;
              const projectDesc = project.description[language] || project.description.en;

              return (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35 }}
                  onClick={() => onSelectProject(project)}
                  className="group relative rounded-[28px] overflow-hidden liquid-glass border border-white/80 dark:border-white/10 cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div>
                    {/* Media Container with 16:10 ratio */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-zinc-950">
                      <ProjectImageGallery
                        mainImage={project.image}
                        galleryImages={project.galleryImages}
                        videoUrl={project.videoUrl}
                        alt={projectTitle}
                        className="w-full h-full"
                        onVideoClick={() => onSelectProject(project)}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-xs">
                        <span className="px-3 py-1 rounded-full bg-black/55 backdrop-blur-md border border-white/20 text-white font-medium">
                          {project.client}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-black/45 backdrop-blur-md border border-white/15 text-white/90 font-mono text-[11px]">
                          {project.year}
                        </span>
                      </div>
                    </div>

                    {/* Card Content Information */}
                    <div className="p-5 text-start">
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-2.5">
                        {project.tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[10px] font-bold uppercase tracking-wider text-[#FF5E1E] bg-[#FF5E1E]/10 px-2 py-0.5 rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Title */}
                      <h3 className="font-display text-lg sm:text-xl font-bold text-zinc-900 dark:text-white group-hover:text-[#FF5E1E] transition-colors line-clamp-1 mb-1.5">
                        {projectTitle}
                      </h3>

                      {/* Description preview */}
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                        {projectDesc}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-black/[0.05] dark:border-white/[0.08]">
                    <span className="text-xs font-semibold text-[#FF5E1E] group-hover:underline">
                      {language === 'ps' ? 'د پروژې کتنه' : language === 'fa' ? 'مشاهده جزئیات' : 'Explore Case Study'}
                    </span>

                    <div className="w-8 h-8 rounded-full bg-black/[0.04] dark:bg-white/[0.06] group-hover:bg-[#FF5E1E] group-hover:text-white text-zinc-700 dark:text-zinc-200 flex items-center justify-center transition-all">
                      <ArrowUpRight className={`w-4 h-4 ${isRtl ? 'rotate-[-90deg]' : ''}`} />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* WhatsApp Inquiry Banner */}
        <div className="rounded-[30px] p-6 sm:p-8 liquid-glass liquid-glass-specular border border-white/80 dark:border-white/15 flex flex-col sm:flex-row items-center justify-between gap-6 text-start">
          <div>
            <h3 className="font-display text-xl font-bold text-zinc-900 dark:text-white mb-1">
              {language === 'ps' ? 'ایا ورته پروژه غواړئ؟' : language === 'fa' ? 'می‌خواهید چنین اثری برای برند شما خلق شود؟' : 'Inspired by Our Creative Work?'}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
              {language === 'ps'
                ? 'موږ سره په واټساف اړیکه ونیسئ ترڅو ستاسو لپاره تر ټولو غوره کار پیل کړو.'
                : language === 'fa'
                ? 'همین حالا در واتساپ پروژه خود را با استودیو هیلا گرافیک هماهنگ کنید.'
                : 'Send us your brief or reference and receive immediate creative feedback and a fixed quote.'}
            </p>
          </div>

          <a
            href={getWhatsAppLink('Hello Hila Graphic, I reviewed your portfolio and would like to hire you for a design project.')}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-2xl bg-[#FF5E1E] hover:bg-[#E84D0E] text-white font-bold text-xs sm:text-sm inline-flex items-center gap-2 orange-glow shadow-md flex-shrink-0"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{t.whatsapp.ctaButton}</span>
          </a>
        </div>

      </div>
    </div>
  );
};
