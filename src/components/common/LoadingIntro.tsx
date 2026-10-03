import React, { useLayoutEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Logo } from './Logo';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

interface LoadingIntroProps {
  onComplete: () => void;
}

export const LoadingIntro: React.FC<LoadingIntroProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const { t } = useLanguage();
  const { theme } = useTheme();
  const shouldReduceMotion = useReducedMotion();
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useLayoutEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = reducedMotion ? 300 : 950;
    let completionTimer: number | undefined;
    const timer = window.setTimeout(() => {
      setIsVisible(false);
      completionTimer = window.setTimeout(() => onCompleteRef.current(), reducedMotion ? 20 : 200);
    }, duration);

    return () => {
      window.clearTimeout(timer);
      if (completionTimer !== undefined) window.clearTimeout(completionTimer);
    };
  }, []);

  const handleSkip = () => {
    setIsVisible(false);
    setTimeout(onComplete, 200);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, filter: 'blur(10px)', scale: 1.015 }}
          transition={{ duration: shouldReduceMotion ? 0.01 : 0.2, ease: [0.16, 1, 0.3, 1] }}
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center select-none overflow-hidden ${theme === 'dark' ? 'bg-[#0C0D11] text-white' : 'bg-[#F5F5F4] text-zinc-900'}`}
          onClick={handleSkip}
        >
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: theme === 'dark' ? [0.42, 0.72, 0.48] : [0.3, 0.58, 0.36], scale: shouldReduceMotion ? 1 : [0.99, 1.02, 1] }}
            transition={{ duration: shouldReduceMotion ? 0.01 : 2.2, ease: 'easeInOut', repeat: shouldReduceMotion ? 0 : Infinity }}
            className="pointer-events-none absolute inset-0"
            style={{ background: theme === 'dark' ? 'radial-gradient(ellipse at 50% 43%, rgba(255,94,30,0.14), transparent 48%), radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.055), transparent 62%)' : 'radial-gradient(ellipse at 50% 43%, rgba(255,94,30,0.11), transparent 48%), radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.85), transparent 64%)' }}
          />
          
          <motion.div
            initial={{ opacity: 1, scale: 0.985, y: 7 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.01 : 0.42, ease: [0.16, 1, 0.3, 1] }}
            className={"relative mx-5 flex flex-col items-center justify-center overflow-hidden rounded-[30px] border px-8 py-9 backdrop-blur-3xl sm:px-12 sm:py-10 " + (theme === 'dark' ? "border-white/20 bg-white/[0.07] shadow-[0_35px_100px_rgba(0,0,0,0.58),inset_0_1px_1px_rgba(255,255,255,0.25)]" : "border-white/95 bg-white/60 shadow-[0_35px_100px_rgba(20,20,25,0.12),inset_0_1px_1px_rgba(255,255,255,0.98)]")}
          >
            <motion.div
              aria-hidden="true"
              initial={{ opacity: 0, scale: 0.82 }}
              animate={{ opacity: shouldReduceMotion ? 0.18 : [0.12, 0.28, 0.16], scale: shouldReduceMotion ? 1 : [0.92, 1.08, 1] }}
              transition={{ duration: 1.6, delay: 0.12, ease: 'easeOut' }}
              className={`pointer-events-none absolute left-1/2 top-1/2 h-36 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl ${theme === 'dark' ? 'bg-[#FF5E1E]/25' : 'bg-[#FF5E1E]/12'}`}
            />
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent dark:via-white/45" />
            <motion.div
              initial={shouldReduceMotion ? { opacity: 0.96 } : { opacity: 0.92, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: shouldReduceMotion ? 0.01 : 0.38, delay: shouldReduceMotion ? 0 : 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 drop-shadow-[0_12px_28px_rgba(14,16,24,0.24)]"
            >
              <Logo size="xl" showSubtitle={true} />
            </motion.div>

            {!shouldReduceMotion && (
              <motion.div
                aria-hidden="true"
                initial={{ x: '-180%', opacity: 0 }}
                animate={{ x: '180%', opacity: [0, 0.95, 0] }}
                transition={{ duration: 0.9, delay: 0.32, ease: 'easeInOut' }}
                className="pointer-events-none absolute inset-y-7 z-0 w-1/2 -skew-x-12 blur-[1px]"
                style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,94,30,0.06) 30%, rgba(255,122,50,0.62) 44%, rgba(255,255,255,0.98) 50%, rgba(255,122,50,0.55) 57%, transparent 76%)', filter: 'drop-shadow(0 0 7px rgba(255,255,255,0.62)) drop-shadow(0 0 18px rgba(255,94,30,0.72))' }}
              />
            )}

            <div className="relative z-10 mt-7 flex h-3 items-center justify-center gap-2.5" role="status" aria-label={t.common.loading}>
              {[0, 1, 2].map((dot) => (
                <motion.span
                  key={dot}
                  aria-hidden="true"
                  animate={shouldReduceMotion ? { opacity: [0.55, 0.85, 0.55] } : { opacity: [0.32, 1, 0.32], y: [0, -4, 0], scale: [0.88, 1, 0.88] }}
                  transition={{ duration: shouldReduceMotion ? 1.1 : 0.9, delay: shouldReduceMotion ? 0 : dot * 0.16, repeat: Infinity, ease: 'easeInOut' }}
                  className={`h-1.5 w-1.5 rounded-full ${dot === 1 ? 'bg-[#FF5E1E]' : theme === 'dark' ? 'bg-white/85' : 'bg-zinc-500/70'} ${theme === 'dark' ? 'shadow-[0_0_12px_rgba(255,255,255,0.32)]' : 'shadow-[0_0_10px_rgba(255,94,30,0.22)]'}`}
                />
              ))}
            </div>
          </motion.div>

          {/* Discreet click to enter prompt */}
          <motion.button
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 5 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: shouldReduceMotion ? 0 : 0.8, duration: shouldReduceMotion ? 0.01 : 0.5 }}
            onClick={(event) => { event.stopPropagation(); handleSkip(); }}
            className={`mt-8 text-xs font-medium tracking-widest transition-colors duration-200 uppercase ${theme === 'dark' ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-zinc-900'}`}
          >
            {t.common.skip}
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
