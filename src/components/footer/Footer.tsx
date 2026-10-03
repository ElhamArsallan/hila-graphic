import React from 'react';
import { Logo } from '../common/Logo';
import { useLanguage } from '../../context/LanguageContext';
import { useSiteConfig } from '../../context/SiteConfigContext';
import { MessageCircle, Mail, MapPin, ExternalLink, Settings, Lock, Download } from 'lucide-react';
import { downloadWebsiteZip, downloadReadyToHostZip } from '../../utils/downloadZip';

interface FooterProps {
  currentRoute?: string;
  onNavigate?: (route: string) => void;
  onOpenConfigModal?: () => void;
  onOpenPriceModal?: () => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ 
  currentRoute = 'home',
  onNavigate,
  onOpenConfigModal, 
  onOpenPriceModal, 
  onOpenAdmin 
}) => {
  const { language, isRtl, t } = useLanguage();
  const { config, services, getWhatsAppLink, isAdminAuthenticated } = useSiteConfig();

  const handleLinkClick = (id: string) => {
    if (id === 'admin') {
      onOpenAdmin?.();
      return;
    }

    if (onNavigate) {
      onNavigate(id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="relative pt-16 pb-12 border-t border-black/[0.06] dark:border-white/[0.08] bg-black/[0.015] dark:bg-black/40 text-start">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-black/[0.06] dark:border-white/[0.08]">
          
          {/* Brand Column (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <a href="#home" onClick={(e) => { e.preventDefault(); handleLinkClick('home'); }} className="mb-4">
              <Logo size="md" showSubtitle={true} />
            </a>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-sm mb-6">
              {t.footer.brandBio}
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-2">
              {config.socialLinks.map((social) => (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-full text-xs font-semibold text-zinc-600 dark:text-zinc-300 bg-black/[0.04] dark:bg-white/[0.05] hover:bg-[#FF5E1E] hover:text-white transition-all cursor-pointer"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links Column (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="font-display text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider mb-4">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { id: 'home', label: t.nav.home },
                { id: 'services', label: t.nav.services },
                { id: 'price-list', label: t.nav.priceList },
                { id: 'about', label: t.nav.aboutUs },
                { id: 'portfolio', label: t.nav.portfolio },
                { id: 'contact', label: t.nav.contact },
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => handleLinkClick(link.id)}
                    className="text-zinc-500 dark:text-zinc-400 hover:text-[#FF5E1E] transition-colors cursor-pointer"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Core Services Column (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="font-display text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider mb-4">
              {t.footer.servicesTitle}
            </h4>
            <ul className="space-y-2.5 text-sm">
              {services.slice(0, 6).map((service) => (
                <li key={service.id}>
                  <a
                    href="#services"
                    className="text-zinc-500 dark:text-zinc-400 hover:text-[#FF5E1E] transition-colors line-clamp-1"
                  >
                    {service.title[language] || service.title.en}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Studio Contact Inquiries (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="font-display text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider mb-4">
              {t.footer.contactTitle}
            </h4>
            <div className="space-y-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#FF5E1E] flex-shrink-0 mt-0.5" />
                <span>{config.address[language] || config.address.en}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#FF5E1E] flex-shrink-0" />
                <a href={`mailto:${config.email}`} className="hover:text-[#FF5E1E] transition-colors">
                  {config.email}
                </a>
              </div>
              <div className="flex items-center gap-2.5 pt-2">
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] hover:bg-[#FF5E1E] hover:text-white text-zinc-800 dark:text-zinc-200 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-[#FF5E1E] group-hover:text-white" />
                  <span>{t.footer.directChat}</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Admin Portal Gateway */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 dark:text-zinc-400">
          <div>
            © {new Date().getFullYear()} {config.brandName}. {t.footer.allRightsReserved}
          </div>

          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            {/* Download Full Website (Complete Source, Uploads, CMS Data, Server) */}
            {isAdminAuthenticated && (
              <>
                <button
                  type="button"
                  onClick={() => downloadWebsiteZip()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FF5E1E] hover:bg-[#E84D0E] text-white transition-all font-semibold shadow-sm hover:shadow cursor-pointer"
                  title="Download Full Website: Complete React/TS Code, Media Uploads, CMS Data & Server (.ZIP)"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Full Website (.ZIP)</span>
                </button>

                <button
                  type="button"
                  onClick={() => downloadReadyToHostZip()}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/5 dark:bg-white/10 hover:bg-[#FF5E1E] hover:text-white text-zinc-700 dark:text-zinc-300 transition-colors font-medium cursor-pointer"
                  title="Download Pre-compiled Website for cPanel, Netlify, Vercel, or Hostinger"
                >
                  <Download className="w-3 h-3" />
                  <span>Ready-to-Host (.ZIP)</span>
                </button>

                <span>•</span>
              </>
            )}

            {/* Direct Studio CMS Access */}
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/5 dark:bg-white/10 hover:bg-[#FF5E1E] hover:text-white text-zinc-700 dark:text-zinc-300 transition-colors font-medium cursor-pointer"
              title="Studio Administration Portal"
            >
              <Lock className="w-3 h-3 text-[#FF5E1E]" />
              <span>Studio CMS</span>
            </button>

            {isAdminAuthenticated && (
              <>
                <span>•</span>
                <button
                  onClick={onOpenConfigModal}
                  className="inline-flex items-center gap-1 hover:text-[#FF5E1E] transition-colors cursor-pointer"
                  title="Site & WhatsApp Settings"
                >
                  <Settings className="w-3 h-3" />
                  <span>{t.footer.configWhatsApp}</span>
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
};
