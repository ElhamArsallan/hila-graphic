import React from 'react';
import { motion } from 'motion/react';
import { useTheme } from '../../context/ThemeContext';
import { useSiteConfig } from '../../context/SiteConfigContext';

export const BackgroundCanvas: React.FC = () => {
  const { theme } = useTheme();
  const { config } = useSiteConfig();
  const bgConfig = config.backgroundImage;

  const isDarkMode = theme === 'dark';
  const lightBgUrl = bgConfig?.lightImageUrl?.trim();
  const darkBgUrl = bgConfig?.darkImageUrl?.trim();
  const customBgUrl = isDarkMode ? (darkBgUrl || lightBgUrl) : (lightBgUrl || darkBgUrl);
  const hasCustomBg = Boolean(bgConfig?.enabled && customBgUrl);

  const [bgLoadError, setBgLoadError] = React.useState(false);

  // Reset load error if URL changes
  React.useEffect(() => {
    setBgLoadError(false);
  }, [customBgUrl]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none transition-colors duration-700">
      
      {/* 1. Base Neutral Tone Canvas */}
      <div className="absolute inset-0 bg-[#FAFAFC] dark:bg-[#0A0B0F] transition-colors duration-700" />

      {/* 2. Custom Uploaded Background Image (Layered with crisp visibility) */}
      {hasCustomBg && !bgLoadError && customBgUrl && (
        <div className="absolute inset-0 transition-opacity duration-700">
          <img
            key={customBgUrl}
            src={customBgUrl}
            alt="Hila Graphic Background"
            referrerPolicy="no-referrer"
            onError={() => setBgLoadError(true)}
            className="w-full h-full object-cover object-center transition-all duration-700"
            style={{
              opacity: Math.max(0.4, bgConfig?.opacity ?? 0.55),
              filter: `blur(${Math.min(3, bgConfig?.blur ?? 1.5)}px)`,
            }}
          />
          {/* Subtle Contrast Veil to keep text readable without obliterating the artwork */}
          <div 
            className="absolute inset-0 transition-all duration-700" 
            style={{
              backgroundColor: isDarkMode 
                ? `rgba(10, 11, 15, ${Math.min(0.45, bgConfig?.overlayDarkness ?? 0.35)})`
                : `rgba(250, 250, 252, ${Math.min(0.35, bgConfig?.overlayDarkness ?? 0.25)})`,
            }}
          />
        </div>
      )}

      {/* 3. Slow Atmospheric Floating Warm Orange Light Spheres */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            x: [0, 40, -30, 0],
            y: [0, -50, 30, 0],
            scale: [1, 1.08, 0.95, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-[12%] right-[15%] w-[550px] lg:w-[750px] h-[550px] lg:h-[750px] rounded-full bg-[#FF5E1E]/[0.055] dark:bg-[#FF5E1E]/[0.08] blur-[150px] transform-gpu"
        />

        <motion.div
          animate={{
            x: [0, -35, 25, 0],
            y: [0, 45, -35, 0],
            scale: [1, 0.96, 1.06, 1],
          }}
          transition={{
            duration: 26,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-[45%] left-[8%] w-[500px] lg:w-[680px] h-[500px] lg:h-[680px] rounded-full bg-amber-500/[0.035] dark:bg-[#FF7A00]/[0.05] blur-[140px] transform-gpu"
        />

        <motion.div
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -30, 40, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute bottom-[5%] right-[25%] w-[450px] h-[450px] rounded-full bg-zinc-400/[0.04] dark:bg-orange-600/[0.03] blur-[130px] transform-gpu"
        />

        {/* Subtle Precision Geometric Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.035] dark:opacity-[0.05]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: '48px 48px',
          }}
        />

        {/* Subtle Radial Vignette for Content Focus */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/[0.02] dark:to-black/[0.3]" />
      </div>

    </div>
  );
};
