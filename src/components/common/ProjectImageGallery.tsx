import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Play, Film, Image as ImageIcon, Maximize2, X } from 'lucide-react';

interface ProjectImageGalleryProps {
  mainImage: string;
  galleryImages?: string[];
  videoUrl?: string;
  alt: string;
  className?: string;
  fitMode?: 'cover' | 'contain';
  autoSlide?: boolean;
  slideInterval?: number;
  showDots?: boolean;
  showArrowsOnHover?: boolean;
  onVideoClick?: () => void;
}

export const ProjectImageGallery: React.FC<ProjectImageGalleryProps> = ({
  mainImage,
  galleryImages = [],
  videoUrl,
  alt,
  className = 'w-full h-full',
  fitMode = 'cover',
  autoSlide = true,
  slideInterval = 4500,
  showDots = true,
  showArrowsOnHover = true,
  onVideoClick,
}) => {
  // Consolidate images array (mainImage first, then any extra galleryImages without duplicates)
  const allImages = React.useMemo(() => {
    const list: string[] = [];
    if (mainImage) list.push(mainImage);
    if (galleryImages && galleryImages.length > 0) {
      galleryImages.forEach((img) => {
        if (img && !list.includes(img)) list.push(img);
      });
    }
    return list.length > 0 ? list : ['/assets/fallback-graphic.jpg'];
  }, [mainImage, galleryImages]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Auto-slide effect when more than 1 image is present
  useEffect(() => {
    if (!autoSlide || isPaused || lightboxOpen || allImages.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % allImages.length);
    }, slideInterval);

    return () => clearInterval(timer);
  }, [autoSlide, isPaused, lightboxOpen, allImages.length, slideInterval]);

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % allImages.length);
  };

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 40;
    if (diff > threshold) {
      handleNext();
    } else if (diff < -threshold) {
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const currentImg = allImages[currentIndex] || allImages[0];

  return (
    <>
      <div
        className={`relative overflow-hidden group/gallery select-none flex flex-col justify-between ${className}`}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Background container for contain mode */}
        {fitMode === 'contain' && (
          <div className="absolute inset-0 bg-[#0B0C10] -z-10" />
        )}

        {/* Sliding Image Stage */}
        <div className="relative flex-1 w-full min-h-0 overflow-hidden flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.img
              key={`${currentIndex}-${currentImg}`}
              src={currentImg}
              alt={`${alt} (Sample ${currentIndex + 1} of ${allImages.length})`}
              referrerPolicy="no-referrer"
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className={`w-full h-full ${
                fitMode === 'contain' ? 'object-contain' : 'object-cover object-center'
              }`}
            />
          </AnimatePresence>

          {/* Prominent Image Counter Pill Badge (e.g. 01 / 06) */}
          {allImages.length > 1 && (
            <div className="absolute top-3 left-3 z-20 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/65 backdrop-blur-md border border-white/20 text-white text-xs font-mono font-bold shadow-lg">
              <span className="text-[#FF5E1E]">{String(currentIndex + 1).padStart(2, '0')}</span>
              <span className="text-white/40">/</span>
              <span className="text-white/80">{String(allImages.length).padStart(2, '0')}</span>
            </div>
          )}

          {/* Action buttons (Lightbox full screen + video) */}
          <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
            {videoUrl && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onVideoClick?.();
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/65 hover:bg-[#FF5E1E] text-white text-[11px] font-semibold backdrop-blur-md border border-white/20 transition-all cursor-pointer shadow-md"
                title="Video preview available"
              >
                <Film className="w-3.5 h-3.5 text-[#FF5E1E] group-hover:text-white" />
                <span>Video</span>
              </button>
            )}

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxOpen(true);
              }}
              className="p-1.5 rounded-full bg-black/65 hover:bg-black/85 text-white/90 hover:text-white backdrop-blur-md border border-white/20 transition-colors cursor-pointer shadow-md"
              title="Expand full screen"
              aria-label="Expand image"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Multiple Images Arrow Controls */}
          {allImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous artwork sample"
                className={`absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/65 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95 ${
                  showArrowsOnHover ? 'opacity-85 sm:opacity-0 sm:group-hover/gallery:opacity-100' : 'opacity-90'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                aria-label="Next artwork sample"
                className={`absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/65 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95 ${
                  showArrowsOnHover ? 'opacity-85 sm:opacity-0 sm:group-hover/gallery:opacity-100' : 'opacity-90'
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        {/* Interactive Thumbnail Strip for Multiple Samples */}
        {allImages.length > 1 && (
          <div className="flex-shrink-0 z-20 p-2 bg-black/75 backdrop-blur-md border-t border-white/10 flex items-center gap-2 overflow-x-auto scrollbar-none">
            {allImages.map((thumbUrl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                className={`relative flex-shrink-0 w-11 h-11 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                  currentIndex === idx
                    ? 'border-[#FF5E1E] scale-105 shadow-md shadow-[#FF5E1E]/20'
                    : 'border-white/20 opacity-60 hover:opacity-100 hover:border-white/50'
                }`}
              >
                <img
                  src={thumbUrl}
                  alt={`Thumbnail ${idx + 1}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && (
          <div 
            className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4 backdrop-blur-xl"
            onClick={() => setLightboxOpen(false)}
          >
            {/* Close Button */}
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Close fullscreen"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Counter in Lightbox */}
            <div className="absolute top-4 left-4 z-50 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white font-mono text-sm">
              <span className="text-[#FF5E1E] font-bold">{String(currentIndex + 1).padStart(2, '0')}</span> / {String(allImages.length).padStart(2, '0')}
            </div>

            {/* Main Lightbox Image */}
            <div 
              className="relative max-w-6xl max-h-[85vh] w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={currentImg}
                alt={`${alt} Fullscreen`}
                referrerPolicy="no-referrer"
                className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
              />

              {allImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 cursor-pointer"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 cursor-pointer"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
