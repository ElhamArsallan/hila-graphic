import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, MessageCircle, Phone, Mail, MapPin, Clock, Send, Check, Sparkles, Instagram, Facebook } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSiteConfig } from '../context/SiteConfigContext';

interface ContactPageProps {
  onNavigate: (route: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const { language, isRtl, t } = useLanguage();
  const { config, getWhatsAppLink } = useSiteConfig();

  const [clientName, setClientName] = useState('');
  const [clientService, setClientService] = useState('Full Branding');
  const [clientBudget, setClientBudget] = useState('$200 - $500');
  const [clientMessage, setClientMessage] = useState('');

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formatted = `Hello Hila Graphic Studio!
My name is: ${clientName || 'Valued Client'}
Service interested in: ${clientService}
Estimated budget: ${clientBudget}
Project Details: ${clientMessage || 'I would like to consult on my design project.'}`;

    const url = getWhatsAppLink(formatted);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const addressText = config.address?.[language] || config.address?.en || 'Kabul, Afghanistan';
  const socialProfileUrl = (platform: 'Instagram' | 'Facebook') => {
    const configuredUrl = config.socialLinks.find((item) => item.platform.toLowerCase() === platform.toLowerCase())?.url.trim();
    if (!configuredUrl) return null;

    try {
      const parsedUrl = new URL(configuredUrl);
      const host = parsedUrl.hostname.toLowerCase();
      const isPlatformHost = platform === 'Instagram'
        ? host === 'instagram.com' || host.endsWith('.instagram.com')
        : host === 'facebook.com' || host.endsWith('.facebook.com') || host === 'fb.com' || host.endsWith('.fb.com');
      return parsedUrl.protocol === 'https:' && isPlatformHost && parsedUrl.pathname.replace(/\/+$/, '') ? configuredUrl : null;
    } catch {
      return null;
    }
  };
  const socialLabels = {
    en: { heading: 'Follow Hila Graphic', instagram: 'Follow Hila Graphic on Instagram', facebook: 'Follow Hila Graphic on Facebook' },
    ps: { heading: 'هیلګرافیک تعقیب کړئ', instagram: 'هیلګرافیک په انسټاګرام کې تعقیب کړئ', facebook: 'هیلګرافیک په فېسبوک کې تعقیب کړئ' },
    fa: { heading: 'هیلا گرافیک را دنبال کنید', instagram: 'هیلا گرافیک را در اینستاگرام دنبال کنید', facebook: 'هیلا گرافیک را در فیسبوک دنبال کنید' },
  }[language];

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

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mb-12 sm:mb-16 text-start"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5E1E]/10 text-[#FF5E1E] text-xs font-bold tracking-widest uppercase mb-3">
            <MessageCircle className="w-3.5 h-3.5" />
            <span>{t.nav.contact}</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight mb-4">
            {language === 'ps'
              ? 'له هیلګرافیک استودیو سره اړیکه ونیسئ'
              : language === 'fa'
              ? 'ارتباط مستقیم با استودیو هیلا گرافیک'
              : 'Direct Creative Collaboration & Studio Contact'}
          </h1>

          <p className="text-zinc-600 dark:text-zinc-300 text-sm sm:text-base leading-relaxed">
            {language === 'ps'
              ? 'موږ ستاسو پوښتنو او پروژو ته په سمدستي توګه ځواب وایو. د واټساف، تلیفون یا لاندې فورمې له لارې له موږ سره اړیکه ټینګه کړئ.'
              : language === 'fa'
              ? 'پروژه خود را با تیم ما در میان بگذارید. پاسخگویی سریع از طریق واتساپ مستقیم، تماس و فرم هوشمند استودیو.'
              : 'Direct communication channels with our design directors. Send your brief or connect instantly on WhatsApp.'}
          </p>
        </motion.div>

        {/* Contact Layout: Info Cards on Left, WhatsApp Form on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Coordinates Column */}
          <div className="lg:col-span-5 space-y-6 text-start">
            
            {/* WhatsApp Priority Card */}
            <div className="p-6 sm:p-7 rounded-[28px] liquid-glass liquid-glass-specular border-2 border-[#FF5E1E]/40 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FF5E1E] text-white flex items-center justify-center orange-glow shadow-md">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-zinc-900 dark:text-white">
                    {language === 'ps' ? 'رسمي واټساف' : language === 'fa' ? 'واتساپ اختصاصی استودیو' : 'Official WhatsApp Line'}
                  </h3>
                  <span className="text-xs text-[#FF5E1E] font-bold">Instant Response • 24/7</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mb-5 leading-relaxed">
                {language === 'ps'
                  ? 'تر ټولو چټکه لار! زموږ سره په واټساف خبرې وکړئ او په څو دقیقو کې مشوره ترلاسه کړئ.'
                  : language === 'fa'
                  ? 'سریع‌ترین روش شروع پروژه و ارسال نمونه و جزئیات به صورت مستقیم.'
                  : 'Fastest consultation channel for voice notes, brief files, reference images, and instant proposals.'}
              </p>
              <a
                href={getWhatsAppLink('Hello Hila Graphic Studio, I would like to consult on a design project.')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-2xl bg-[#FF5E1E] hover:bg-[#E84D0E] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 orange-glow shadow-md transition-all select-none"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{config.whatsappNumber}</span>
              </a>
            </div>

            {/* Studio Info Details */}
            <div className="p-6 rounded-[28px] liquid-glass border border-white/80 dark:border-white/10 space-y-5">
              
              {/* Phone */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] flex items-center justify-center text-[#FF5E1E] flex-shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    Phone / Call
                  </div>
                  <div className="text-sm font-semibold text-zinc-900 dark:text-white mt-0.5">
                    {config.phoneDisplay || config.whatsappNumber}
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] flex items-center justify-center text-[#FF5E1E] flex-shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    Email Inquiries
                  </div>
                  <div className="text-sm font-semibold text-zinc-900 dark:text-white mt-0.5">
                    {config.email}
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] flex items-center justify-center text-[#FF5E1E] flex-shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    Physical Studio
                  </div>
                  <div className="text-sm font-semibold text-zinc-900 dark:text-white mt-0.5">
                    {addressText}
                  </div>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] flex items-center justify-center text-[#FF5E1E] flex-shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    Working Hours
                  </div>
                  <div className="text-sm font-semibold text-zinc-900 dark:text-white mt-0.5">
                    Saturday – Thursday: 8:30 AM – 6:00 PM
                  </div>
                </div>
              </div>

              <div className="border-t border-black/[0.07] dark:border-white/[0.08] pt-4">
                <h3 className="mb-3 text-[11px] font-bold text-zinc-500 dark:text-zinc-400">{socialLabels.heading}</h3>
                <div className="flex flex-wrap items-center gap-2">
                  {([
                    { platform: 'Instagram' as const, Icon: Instagram, url: socialProfileUrl('Instagram'), label: socialLabels.instagram },
                    { platform: 'Facebook' as const, Icon: Facebook, url: socialProfileUrl('Facebook'), label: socialLabels.facebook },
                  ]).map(({ platform, Icon, url, label }) => {
                    const buttonClass = 'inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/70 bg-white/35 px-3 text-xs font-semibold text-zinc-700 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] backdrop-blur-xl transition-all duration-200 dark:border-white/10 dark:bg-white/[0.05] dark:text-zinc-200 dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]';
                    return url ? (
                      <a key={platform} href={url} target="_blank" rel="noopener noreferrer" aria-label={label} className={`${buttonClass} hover:-translate-y-0.5 hover:border-[#FF5E1E]/30 hover:text-[#FF5E1E] hover:shadow-[0_6px_18px_rgba(255,94,30,0.14)]`}>
                        <Icon className="h-4 w-4" aria-hidden="true" />
                        <span>{platform}</span>
                      </a>
                    ) : (
                      <button key={platform} type="button" disabled aria-label={label} title="Configure the official profile URL in Admin Settings" className={`${buttonClass} cursor-not-allowed opacity-55`}>
                        <Icon className="h-4 w-4" aria-hidden="true" />
                        <span>{platform}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>

          {/* Quick Inquiry Form on Right */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-[30px] liquid-glass liquid-glass-specular border border-white/80 dark:border-white/10 shadow-xl text-start">
              
              <div className="flex items-center gap-2 mb-2 text-xs font-bold text-[#FF5E1E] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Quick Inquiry Form</span>
              </div>
              <h2 className="font-display text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                {language === 'ps'
                  ? 'خپله پروژه تشریح کړئ'
                  : language === 'fa'
                  ? 'ثبت درخواست و ارسال به واتساپ'
                  : 'Describe Your Design Project'}
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                {language === 'ps'
                  ? 'دا فورمه ډکه کړئ، دا به په اتوماتیک ډول ستاسو معلومات چمتو او په واټساف کې پرانیزي.'
                  : language === 'fa'
                  ? 'مشخصات اولیه را وارد کنید تا پیام آماده شده مستقیماً در واتساپ استودیو ارسال شود.'
                  : 'Fill in your details below to generate a pre-formatted project brief directly sent to WhatsApp.'}
              </p>

              <form onSubmit={handleWhatsAppSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                    {language === 'ps' ? 'ستاسو نوم / شرکت' : language === 'fa' ? 'نام شما / نام شرکت' : 'Your Name / Business Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Ahmad Karimi / Horizon Logistics"
                    className="w-full px-4 py-3 rounded-2xl bg-black/[0.04] dark:bg-white/[0.05] border border-black/10 dark:border-white/10 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-[#FF5E1E]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                      {language === 'ps' ? 'د خدمت ډول' : language === 'fa' ? 'نوع خدمت درخواستی' : 'Service Needed'}
                    </label>
                    <select
                      value={clientService}
                      onChange={(e) => setClientService(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-black/[0.04] dark:bg-white/[0.05] border border-black/10 dark:border-white/10 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-[#FF5E1E]"
                    >
                      <option value="Full Branding System">Full Branding & Identity</option>
                      <option value="Signature Logo Suite">Signature Logo Design</option>
                      <option value="Advertising Posters & Banners">Advertising & Posters</option>
                      <option value="Motion Graphics & Teaser">Motion Graphics & Video</option>
                      <option value="Company Profile & Editorial">Company Profile / Catalog</option>
                      <option value="Other Custom Design">Other Graphic Design</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                      {language === 'ps' ? 'تخمیني بودیجه' : language === 'fa' ? 'بودجه تقریبی' : 'Approximate Budget'}
                    </label>
                    <select
                      value={clientBudget}
                      onChange={(e) => setClientBudget(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-black/[0.04] dark:bg-white/[0.05] border border-black/10 dark:border-white/10 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-[#FF5E1E]"
                    >
                      <option value="Under $200">Under $200</option>
                      <option value="$200 - $500">$200 – $500</option>
                      <option value="$500 - $1,200">$500 – $1,200</option>
                      <option value="$1,200+">$1,200+ (Comprehensive)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                    {language === 'ps' ? 'د پروژې لنډیز او معلومات' : language === 'fa' ? 'توضیحات و اهداف پروژه' : 'Project Brief & Scope'}
                  </label>
                  <textarea
                    rows={4}
                    value={clientMessage}
                    onChange={(e) => setClientMessage(e.target.value)}
                    placeholder="Tell us about your brand, deadlines, target audience, or specific requirements..."
                    className="w-full px-4 py-3 rounded-2xl bg-black/[0.04] dark:bg-white/[0.05] border border-black/10 dark:border-white/10 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-[#FF5E1E]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 px-6 rounded-2xl bg-[#FF5E1E] hover:bg-[#E84D0E] text-white font-bold text-sm inline-flex items-center justify-center gap-2 orange-glow shadow-lg transition-all cursor-pointer select-none"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {language === 'ps'
                      ? 'په واټساف کې یې ولیږئ'
                      : language === 'fa'
                      ? 'ارسال مستقیم پیام به واتساپ'
                      : 'Send via WhatsApp'}
                  </span>
                </button>
              </form>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
