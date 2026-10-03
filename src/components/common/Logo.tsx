import React from 'react';
import { useSiteConfig } from '../../context/SiteConfigContext';
import { useTheme } from '../../context/ThemeContext';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  animated?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
  animated = false,
}) => {
  const { config } = useSiteConfig();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const logoConfig = config.customLogo;

  // Determine active logo based on light/dark mode:
  // Light mode strictly uses lightLogoUrl (fallback customLogoUrl)
  // Dark mode strictly uses darkLogoUrl (fallback customLogoUrl if no dark logo specified)
  const lightLogo = logoConfig?.lightLogoUrl?.trim() || logoConfig?.customLogoUrl?.trim() || null;
  const darkLogo = logoConfig?.darkLogoUrl?.trim() || logoConfig?.customLogoUrl?.trim() || null;
  const currentLogoUrl = isDarkMode ? darkLogo : lightLogo;

  // Dimension presets
  const sizeConfig = {
    sm: { height: 28, iconSize: 26, textClass: 'text-base', subClass: 'text-[9px]', imgHeight: 'h-7' },
    md: { height: 38, iconSize: 34, textClass: 'text-xl', subClass: 'text-[10px]', imgHeight: 'h-9 sm:h-10' },
    lg: { height: 48, iconSize: 44, textClass: 'text-2xl', subClass: 'text-xs', imgHeight: 'h-12' },
    xl: { height: 72, iconSize: 64, textClass: 'text-4xl', subClass: 'text-sm', imgHeight: 'h-16' },
  }[size];

  const [imgError, setImgError] = React.useState(false);

  React.useEffect(() => {
    setImgError(false);
  }, [currentLogoUrl]);

  const logoScale = logoConfig?.scale ?? 1.0;

  // If administrator uploaded a real Hila Graphic logo, render with perfect contain and aspect ratio
  if (currentLogoUrl && !imgError) {
    return (
      <div className={`inline-flex items-center select-none ${className}`} style={{ transform: `scale(${logoScale})`, transformOrigin: 'center left' }}>
        <img
          src={currentLogoUrl}
          alt={config.brandName || 'Hila Graphic'}
          onError={() => setImgError(true)}
          className={`${sizeConfig.imgHeight} w-auto max-w-full object-contain transition-transform duration-300 hover:scale-[1.02]`}
          style={{ maxWidth: logoConfig?.width ? `${logoConfig.width}px` : '220px' }}
        />
      </div>
    );
  }

  // Official Precision Geometric Brand Mark
  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`} style={logoScale !== 1.0 ? { transform: `scale(${logoScale})`, transformOrigin: 'center left' } : undefined}>
      <div 
        className="relative flex-shrink-0 flex items-center justify-center transition-transform duration-300 hover:scale-105"
        style={{ width: sizeConfig.iconSize, height: sizeConfig.iconSize }}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full h-full ${animated ? 'animate-pulse' : ''}`}
        >
          <defs>
            <linearGradient id="hilaOrangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF6A28" />
              <stop offset="100%" stopColor="#FA5212" />
            </linearGradient>
            
            <linearGradient id="hilaGlow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Left Vertical Pillar */}
          <rect
            x="14"
            y="12"
            width="18"
            height="76"
            rx="5"
            className="fill-[#14151B] dark:fill-[#F4F5F8] transition-colors duration-300"
          />

          {/* Right Vertical Pillar */}
          <rect
            x="68"
            y="12"
            width="18"
            height="76"
            rx="5"
            className="fill-[#14151B] dark:fill-[#F4F5F8] transition-colors duration-300"
          />

          {/* Dynamic Diagonal Creative Bridge / Orange Apex */}
          <path
            d="M32 38L68 56V68L32 50V38Z"
            fill="url(#hilaOrangeGrad)"
          />

          {/* Precision Center Diamond Accent */}
          <polygon
            points="50,22 62,36 50,50 38,36"
            fill="url(#hilaOrangeGrad)"
          />

          {/* Specular Edge Highlight */}
          <rect
            x="14"
            y="12"
            width="18"
            height="24"
            rx="5"
            fill="url(#hilaGlow)"
          />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col justify-center leading-none text-start">
        <div className="flex items-center gap-1">
          <span className={`font-display font-extrabold tracking-tight text-[#12131A] dark:text-[#FFFFFF] transition-colors duration-300 ${sizeConfig.textClass}`}>
            HILA
          </span>
          <span className={`font-display font-medium tracking-tight text-[#FF5E1E] ${sizeConfig.textClass}`}>
            GRAPHIC
          </span>
        </div>

        {showSubtitle && (
          <div className="hidden sm:flex items-center gap-1.5 mt-0.5">
            <span className={`font-sans tracking-[0.22em] uppercase font-semibold text-[#666B7D] dark:text-[#969BB0] ${sizeConfig.subClass}`}>
              DESIGN & ADVERTISING
            </span>
            <span className="w-1 h-1 rounded-full bg-[#FF5E1E]/80" />
          </div>
        )}
      </div>
    </div>
  );
};
