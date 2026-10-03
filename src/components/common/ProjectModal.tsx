import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MessageCircle, CheckCircle, Share2, Check, Tag, Sparkles, DollarSign, Film, Image as ImageIcon } from 'lucide-react';
import { PortfolioItem, ServiceItem } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useSiteConfig } from '../../context/SiteConfigContext';
import { ProjectImageGallery } from './ProjectImageGallery';
import { VideoPlayer } from './VideoPlayer';

interface ProjectModalProps {
  item: PortfolioItem | ServiceItem | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ item, onClose }) => {
  const { language, isRtl, t } = useLanguage();
  const { getWhatsAppLink } = useSiteConfig();
  const [copied, setCopied] = useState(false);
  const [mediaView, setMediaView] = useState<'gallery' | 'video'>('gallery');

  // Keyboard accessibility (ESC to close) and body scroll lock - MUST run unconditionally
  React.useEffect(() => {
    if (!item) return;
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
  }, [item, onClose]);

  if (!item) return null;

  const isService = 'deliverables' in item;
  const title = item.title[language] || item.title.en;
  const description = item.description[language] || item.description.en;
  const image = isService ? (item as ServiceItem).posterImage : (item as PortfolioItem).image;
  const subtitle = isService ? (item as ServiceItem).subtitle?.[language] || (item as ServiceItem).subtitle?.en : '';
  const serviceNumber = isService ? (item as ServiceItem).number : undefined;
  const galleryImages = (item as any).galleryImages || [];
  const videoUrl = (item as any).videoUrl;
  const price = (item as any).price;

  const inquiryUrl = getWhatsAppLink(
    `Hello Hila Graphic, I am inquiring about "${title}". Could you please provide consultation, timeline, and pricing?`
  );

  const handleShare = () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}#${isService ? 'service' : 'project'}=${item.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

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

        {/* Modal Window: Strictly Contained in Viewport (max-w-5xl, max-h-[88vh]) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-5xl max-h-[88vh] flex flex-col rounded-[28px] sm:rounded-[36px] liquid-glass liquid-glass-specular border border-white/80 dark:border-white/15 shadow-2xl overflow-hidden z-10 text-start"
        >
          {/* Header Bar */}
          <div className="flex-shrink-0 flex items-center justify-between px-5 sm:px-7 py-3.5 border-b border-black/[0.06] dark:border-white/[0.08] bg-white/70 dark:bg-black/40 backdrop-blur-md z-20">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF5E1E]" />
              {serviceNumber && (
                <span className="font-mono text-xs font-bold text-[#FF5E1E] bg-[#FF5E1E]/10 px-2 py-0.5 rounded">
                  {serviceNumber}
                </span>
              )}
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-200">
                {isService ? t.services.badge : (item as PortfolioItem).category}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 text-xs font-medium text-zinc-700 dark:text-zinc-200 transition-colors cursor-pointer"
                title={t.common.share}
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5 text-[#FF5E1E]" />}
                <span>{copied ? t.common.copied : t.common.share}</span>
              </button>

              <button
                onClick={onClose}
                className="p-1.5 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 text-zinc-700 dark:text-zinc-200 transition-colors cursor-pointer"
                aria-label={t.common.close}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Balanced 2-Column Content Body (Desktop) / Stacked (Mobile) */}
          <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-0">
            
            {/* LEFT COLUMN: Media Showcase Artwork (Desktop 5 cols, sticky) */}
            <div className="md:col-span-5 relative bg-zinc-950 flex flex-col items-center justify-center p-3 sm:p-5 overflow-hidden flex-shrink-0">
              
              {/* Media Switcher Tab (Images vs Video) if video is present */}
              {videoUrl && (
                <div className="flex items-center gap-1 p-1 rounded-xl bg-black/60 border border-white/15 mb-3 z-20 w-fit">
                  <button
                    type="button"
                    onClick={() => setMediaView('gallery')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      mediaView === 'gallery'
                        ? 'bg-[#FF5E1E] text-white font-semibold'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Images</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMediaView('video')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      mediaView === 'video'
                        ? 'bg-[#FF5E1E] text-white font-semibold'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Film className="w-3.5 h-3.5" />
                    <span>Motion / Video</span>
                  </button>
                </div>
              )}

              {/* Media Stage with Contain Mode to prevent cropping artwork */}
              <div className="relative w-full h-full min-h-[220px] md:min-h-[380px] rounded-2xl overflow-hidden shadow-xl flex items-center justify-center bg-black">
                {videoUrl && mediaView === 'video' ? (
                  <VideoPlayer src={videoUrl} poster={image} title={title} className="w-full h-full" />
                ) : (
                  <ProjectImageGallery
                    mainImage={image}
                    galleryImages={galleryImages}
                    alt={title}
                    fitMode="contain"
                    className="w-full h-full"
                  />
                )}

                {/* Subtle Bottom Credit Badge */}
                <div className="absolute bottom-2.5 left-3 right-3 text-white pointer-events-none flex items-center justify-between text-[11px] bg-black/40 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10">
                  <span>{!isService && (item as PortfolioItem).client ? `${(item as PortfolioItem).client} • ${(item as PortfolioItem).year}` : 'Hila Graphic Studio'}</span>
                  <span className="font-mono text-[#FF5E1E] uppercase tracking-wider text-[10px]">Masterwork</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Service / Project Details (Desktop 7 cols, Internal Scroll Area Only) */}
            <div className="md:col-span-7 flex flex-col justify-between overflow-hidden min-h-0">
              
              {/* Scrollable Information Body */}
              <div className="flex-1 overflow-y-auto overscroll-contain p-5 sm:p-8 space-y-5">
                
                {/* Header Titles */}
                <div>
                  {subtitle && (
                    <div className="text-xs font-semibold text-[#FF5E1E] uppercase tracking-wider mb-1.5">
                      {subtitle}
                    </div>
                  )}
                  <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-snug">
                    {title}
                  </h2>
                </div>

                {/* Optional Price Rate Display */}
                {price && (
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#FF5E1E]/10 border border-[#FF5E1E]/20 text-[#FF5E1E]">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase tracking-wider text-zinc-600 dark:text-zinc-300">Package Rate:</span>
                    <span className="font-display font-extrabold text-base text-[#FF5E1E]">{price}</span>
                  </div>
                )}

                {/* Long Description */}
                <div>
                  <h4 className="font-display text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                    {t.admin.description}:
                  </h4>
                  <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-200 leading-relaxed font-normal">
                    {description}
                  </p>
                </div>

                {/* Deliverables Section (for Services) */}
                {isService && (item as ServiceItem).deliverables?.[language] && (
                  <div>
                    <h4 className="font-display text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-3">
                      {t.services.deliverablesLabel}:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {(item as ServiceItem).deliverables[language].map((deliverable, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-xl bg-black/[0.03] dark:bg-white/[0.05] border border-black/[0.04] dark:border-white/[0.08] flex items-center gap-2.5 text-xs font-medium text-zinc-700 dark:text-zinc-200"
                        >
                          <CheckCircle className="w-4 h-4 text-[#FF5E1E] flex-shrink-0" />
                          <span>{deliverable}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags Strip */}
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-2">
                    <span className="text-xs text-zinc-400 flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5" />
                    </span>
                    {item.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-xs px-2.5 py-1 rounded-lg bg-black/[0.04] dark:bg-white/[0.05] text-zinc-600 dark:text-zinc-300 font-mono"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

              </div>

              {/* Fixed Bottom Action Strip (Always Accessible) */}
              <div className="flex-shrink-0 p-4 sm:p-5 border-t border-black/[0.06] dark:border-white/[0.08] bg-white/70 dark:bg-black/50 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-zinc-500 dark:text-zinc-400 text-center sm:text-start">
                  {isService ? 'Direct art director dispatch & consultation.' : 'Verified agency portfolio project.'}
                </div>

                <a
                  href={inquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-white bg-[#FF5E1E] hover:bg-[#E84D0E] orange-glow transition-all cursor-pointer shadow-lg select-none"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{t.whatsapp.ctaButton}</span>
                </a>
              </div>

            </div>

          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
