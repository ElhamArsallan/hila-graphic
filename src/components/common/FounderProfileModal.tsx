import React, { useEffect } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Download, Sparkles, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useSiteConfig } from '../../context/SiteConfigContext';

interface FounderProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const copy = {
  en: { eyebrow: 'LEADERSHIP', photo: 'Founder portrait to be added', cv: 'Download CV', cvUnavailable: 'CV to be added', details: 'Professional profile', close: 'Close founder profile' },
  ps: { eyebrow: 'رهـبري', photo: 'د بنسټګر انځور دلته ورزیات کړئ', cv: 'سي وي ډاونلوډ کړئ', cvUnavailable: 'سي وي به وروسته ورزیات شي', details: 'مسلکي پېژندنه', close: 'د بنسټګر پېژندپاڼه وتړئ' },
  fa: { eyebrow: 'رهبری', photo: 'تصویر بنیان‌گذار را اضافه کنید', cv: 'دانلود رزومه', cvUnavailable: 'رزومه بعداً اضافه می‌شود', details: 'پروفایل حرفه‌ای', close: 'بستن پروفایل بنیان‌گذار' },
};

const profileTextVariants = {
  hidden: {},
  visible: { transition: { delayChildren: 0.12, staggerChildren: 0.075 } },
};

const profileItemVariants = {
  hidden: { opacity: 0, y: 10, filter: 'blur(5px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.42 } },
};

export const FounderProfileModal: React.FC<FounderProfileModalProps> = ({ isOpen, onClose }) => {
  const { language, isRtl } = useLanguage();
  const { config } = useSiteConfig();
  const shouldReduceMotion = useReducedMotion();
  const text = copy[language];
  const profile = config.founderProfile;

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const localized = (value: Record<string, string>) => value[language] || value.en;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0.01 : 0.34, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6"
          dir={isRtl ? 'rtl' : 'ltr'}
        >
          <motion.button
            type="button"
            aria-label={text.close}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.01 : 0.24 }}
            className="absolute inset-0 bg-zinc-950/25 backdrop-blur-[3px] dark:bg-black/35 dark:backdrop-blur-[4px]"
          />
          <motion.section
            role="dialog"
            aria-modal="true"
            aria-labelledby="founder-profile-name"
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.965, y: 20, filter: 'blur(12px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98, y: 10, filter: 'blur(8px)' }}
            transition={{ duration: shouldReduceMotion ? 0.01 : 0.54, ease: [0.16, 1, 0.3, 1] }}
            className="relative isolate flex max-h-[min(90dvh,860px)] w-full max-w-5xl flex-col overflow-hidden rounded-[30px] border border-white/85 bg-gradient-to-br from-white/65 via-white/48 to-orange-100/30 text-zinc-900 shadow-[0_38px_110px_rgba(15,18,25,0.28),0_12px_38px_rgba(255,94,30,0.12),inset_0_1px_1px_rgba(255,255,255,0.95)] backdrop-blur-[40px] backdrop-saturate-150 dark:border-white/25 dark:from-white/[0.18] dark:via-[#292a32]/55 dark:to-[#ff5e1e]/[0.16] dark:text-zinc-100 dark:shadow-[0_42px_120px_rgba(0,0,0,0.48),0_12px_42px_rgba(255,94,30,0.12),inset_0_1px_1px_rgba(255,255,255,0.28)]"
          >
            <motion.div
              aria-hidden="true"
              initial={{ opacity: 0.2 }}
              animate={{ opacity: shouldReduceMotion ? 0.32 : [0.26, 0.52, 0.3] }}
              transition={{ duration: shouldReduceMotion ? 0.01 : 3.2, repeat: shouldReduceMotion ? 0 : Infinity, ease: 'easeInOut' }}
              className="pointer-events-none absolute inset-0 z-0"
              style={{ background: 'radial-gradient(ellipse at 12% 0%, rgba(255,255,255,0.48), transparent 40%), radial-gradient(ellipse at 88% 100%, rgba(255,94,30,0.16), transparent 42%), linear-gradient(125deg, rgba(255,255,255,0.12), transparent 38%, rgba(255,255,255,0.08))' }}
            />
            {!shouldReduceMotion && (
              <motion.div
                aria-hidden="true"
                initial={{ x: '-125%', opacity: 0 }}
                animate={{ x: '125%', opacity: [0, 0.4, 0] }}
                transition={{ duration: 1.15, delay: 0.2, ease: 'easeInOut' }}
                className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/35 to-transparent"
              />
            )}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FF5E1E]/70 to-transparent" />
            <div className="relative z-10 flex shrink-0 items-center justify-between border-b border-black/[0.07] bg-white/20 px-5 py-4 backdrop-blur-xl dark:border-white/[0.12] dark:bg-white/[0.04] sm:px-7">
              <div className="flex items-center gap-2 text-[11px] font-bold text-[#FF5E1E]">
                <Sparkles className="h-4 w-4" />
                <span>{text.eyebrow}</span>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label={text.close}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/80 bg-white/45 text-zinc-700 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)] backdrop-blur-xl transition-colors hover:bg-[#FF5E1E]/15 hover:text-[#FF5E1E] dark:border-white/20 dark:bg-white/[0.08] dark:text-zinc-100 dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.16)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="relative z-10 grid min-h-0 flex-1 grid-cols-1 overflow-y-auto md:grid-cols-[0.88fr_1.12fr] md:overflow-hidden">
              <motion.div
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, clipPath: 'inset(8% 8% 8% 8% round 26px)', filter: 'blur(10px)' }}
                animate={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0% round 0px)', filter: 'blur(0px)' }}
                transition={{ duration: shouldReduceMotion ? 0.01 : 0.72, delay: shouldReduceMotion ? 0 : 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="relative min-h-[240px] overflow-hidden border-b border-white/55 bg-gradient-to-br from-white/25 via-zinc-200/35 to-[#FF5E1E]/10 p-3 dark:border-white/10 dark:from-white/[0.08] dark:via-[#22232b]/25 dark:to-[#FF5E1E]/[0.12] sm:min-h-[300px] md:min-h-0 md:border-b-0 md:border-e md:p-5"
              >
                <div className="relative flex h-full min-h-[216px] items-center justify-center overflow-hidden rounded-[22px] border border-white/65 bg-white/20 shadow-[0_18px_48px_rgba(30,34,44,0.13),inset_0_1px_1px_rgba(255,255,255,0.88)] backdrop-blur-xl dark:border-white/15 dark:bg-white/[0.045] dark:shadow-[0_20px_55px_rgba(0,0,0,0.25),inset_0_1px_1px_rgba(255,255,255,0.16)] sm:min-h-[268px] md:min-h-0">
                  {profile.photoUrl?.trim() ? (
                    <img src={profile.photoUrl} alt={localized(profile.fullName)} className="absolute inset-0 h-full w-full object-contain p-2 drop-shadow-[0_18px_30px_rgba(0,0,0,0.18)]" />
                  ) : (
                    <span className="px-6 text-center text-sm font-medium text-zinc-600 dark:text-zinc-300">{text.photo}</span>
                  )}
                  <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/35 via-transparent to-[#FF5E1E]/[0.08] dark:from-white/[0.1] dark:to-[#FF5E1E]/[0.09]" />
                  <div aria-hidden="true" className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent dark:via-white/70" />
                </div>
              </motion.div>

              <motion.div
                variants={profileTextVariants}
                initial={shouldReduceMotion ? false : 'hidden'}
                animate="visible"
                exit="hidden"
                className="flex min-h-0 flex-col overflow-y-auto bg-white/15 px-5 py-6 backdrop-blur-xl dark:bg-white/[0.025] sm:px-8 sm:py-8 md:px-10 md:py-10"
                style={{ textAlign: isRtl ? 'right' : 'left' }}
              >
                <motion.div variants={profileItemVariants}>
                  <p className="mb-3 text-xs font-bold text-[#FF5E1E]">{localized(profile.title)}</p>
                  <h2 id="founder-profile-name" className="text-2xl font-semibold leading-tight sm:text-3xl md:text-4xl">
                    {localized(profile.fullName)}
                  </h2>
                  <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-600 dark:text-zinc-300 sm:text-base sm:leading-8">
                    {localized(profile.introduction)}
                  </p>
                </motion.div>

                <motion.div
                  variants={profileItemVariants}
                  className="mt-7 border-t border-black/[0.07] pt-5 dark:border-white/[0.09]"
                >
                  <h3 className="mb-4 text-xs font-bold uppercase text-zinc-500 dark:text-zinc-400">{text.details}</h3>
                  <div className="space-y-4">
                    {profile.professionalInformation.map((item) => (
                      <motion.div key={localized(item.label)} variants={profileItemVariants} className="grid gap-1 rounded-xl border border-white/45 bg-white/20 px-3 py-2.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.65)] dark:border-white/[0.08] dark:bg-white/[0.035] dark:shadow-none sm:grid-cols-[minmax(120px,0.7fr)_1.3fr] sm:gap-4">
                        <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">{localized(item.label)}</span>
                        <span className="text-sm leading-6 text-zinc-700 dark:text-zinc-200">{localized(item.value)}</span>
                      </motion.div>
                    ))}
                  </div>
                  <p className="mt-5 text-sm leading-6 text-zinc-600 dark:text-zinc-300">{localized(profile.additionalInformation)}</p>
                </motion.div>

                <motion.div variants={profileItemVariants} className="mt-7">
                  {profile.cvUrl ? (
                    <a
                      href={profile.cvUrl}
                      download
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#FF5E1E] px-5 text-sm font-bold text-white shadow-[0_10px_28px_rgba(255,94,30,0.28)] transition-all hover:-translate-y-0.5 hover:bg-[#E84D0E] hover:shadow-[0_14px_34px_rgba(255,94,30,0.38)]"
                    >
                      <Download className="h-4 w-4" />
                      {text.cv}
                    </a>
                  ) : (
                    <button type="button" disabled className="inline-flex min-h-12 cursor-not-allowed items-center justify-center gap-2 rounded-full bg-zinc-200/80 px-5 text-sm font-semibold text-zinc-500 dark:bg-white/10 dark:text-zinc-400">
                      <Download className="h-4 w-4" />
                      {text.cvUnavailable}
                    </button>
                  )}
                </motion.div>
              </motion.div>
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
};