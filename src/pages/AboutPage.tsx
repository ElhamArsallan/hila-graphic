import React from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Sparkles, 
  Layers, 
  Target, 
  Compass, 
  ShieldCheck, 
  MessageCircle, 
  Award, 
  CheckCircle,
  Eye,
  Flame,
  Clock
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSiteConfig } from '../context/SiteConfigContext';

interface AboutPageProps {
  onNavigate: (route: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const { language, isRtl, t } = useLanguage();
  const { config, getWhatsAppLink } = useSiteConfig();

  const values = [
    {
      icon: Target,
      title: language === 'ps' ? 'هدفمند ډیزاین' : language === 'fa' ? 'طراحی هدفمند تجاری' : 'Commercial Precision',
      desc: language === 'ps' 
        ? 'هر ډیزاین باید ستاسو د سوداګرۍ ارزښت او پلور زیات کړي.' 
        : language === 'fa' 
        ? 'طراحی صرفاً زیبایی نیست؛ بلکه موتور محرک رشد فروش و ارزش‌آفرینی برند است.' 
        : 'Every stroke, palette, and layout is engineered to elevate market standing and customer conversion.',
    },
    {
      icon: Layers,
      title: language === 'ps' ? 'بشپړ بصري هویت' : language === 'fa' ? 'سیستم‌های هویت جامع' : 'Systematic Cohesion',
      desc: language === 'ps'
        ? 'د لوګو څخه تر اعلاناتو او ټولنیزو شبکو پورې یو منظم او ځواکمن شتون.'
        : language === 'fa'
        ? 'حفظ یکپارچگی دیداری از لوگو تا ست تبلیغاتی، کاتالوگ و رسانه‌های دیجیتال.'
        : 'We craft comprehensive brand languages that speak with unified authority across digital and physical media.',
    },
    {
      icon: Compass,
      title: language === 'ps' ? 'نړیوال معیارونه' : language === 'fa' ? 'کیفیت در تراز جهانی' : 'International Standard',
      desc: language === 'ps'
        ? 'له کابل څخه د نړۍ تر ټولو لوړو او عصري ډیزاین معیارونو ته لاسرسی.'
        : language === 'fa'
        ? 'ارائه آثاری با بالاترین استانداردهای بصری مدرن و اجرایی.'
        : 'Combining localized cultural depth with world-class Apple-grade aesthetic refinement and geometric balance.',
    },
  ];

  const steps = [
    {
      number: '01',
      title: language === 'ps' ? 'کره څېړنه او درک' : language === 'fa' ? 'کشف و تحلیل نیازها' : 'Strategic Discovery',
      desc: language === 'ps'
        ? 'ستاسو د نښې، موخو، مخاطبانو او بازار دقیق تحلیل او پلان جوړونه.'
        : language === 'fa'
        ? 'درک عمیق از ماهیت کسب‌وکار، تحلیل رقبا، و شناخت دقیق سلیقه مخاطب هدف.'
        : 'Deep audit of your enterprise objectives, industry landscape, and psychological consumer touchpoints.',
    },
    {
      number: '02',
      title: language === 'ps' ? 'مفکوره او لومړني خاکې' : language === 'fa' ? 'خلق ایده و کانسپت' : 'Conceptual Synthesis',
      desc: language === 'ps'
        ? 'د څو بېلابېلو او ځانګړو نوښتګرو مفکورو رامنځته کول او ارزول.'
        : language === 'fa'
        ? 'طراحی اتودهای چندگانه و بررسی زوایای فرم، نمادشناسی و هارمونی تایپوگرافی.'
        : 'Exploration of multiple distinct visual directions and mathematical grid structures.',
    },
    {
      number: '03',
      title: language === 'ps' ? 'مسلکي اجرا او سمون' : language === 'fa' ? 'اجرای دقیق و پولیش' : 'Craft & Vector Polish',
      desc: language === 'ps'
        ? 'د لوړ دقت سره د ویکتور، رنګونو او ټایپوګرافۍ کمال ته رسول.'
        : language === 'fa'
        ? 'تبدیل کانسپت برگزیده به وکتورهای نهایی با بالاترین رزولوشن و قوانین تایپوگرافی.'
        : 'Surgical refinement of Bezier curves, micro-typography, optical kerning, and color balances.',
    },
    {
      number: '04',
      title: language === 'ps' ? 'وروستی تحویل او ملاتړ' : language === 'fa' ? 'تحویل جامع و پشتیبانی' : 'Asset Delivery & Launch',
      desc: language === 'ps'
        ? 'ټول اصلي فایلونه، لارښود کتابچه، او د سوداګریز کارونې پوره حقونه.'
        : language === 'fa'
        ? 'ارائه تمام فرمت‌های استاندارد چاپ و وب همراه با راهنمای استفاده و مالکیت رسمی.'
        : 'Handover of organized production archives, print-ready packages, color profiles, and style books.',
    },
  ];

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

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mb-16 text-start"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5E1E]/10 text-[#FF5E1E] text-xs font-bold tracking-widest uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.about.badge}</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight mb-6">
            {language === 'ps'
              ? 'د هیلګرافیک کیسه: د خلاقیت او هنر یوځای والی'
              : language === 'fa'
              ? 'داستان هیلا گرافیک: تلاقی هنر، استراتژی و هویت بصری'
              : 'Architecting Visual Authority & Advertising Excellence'}
          </h1>

          <p className="text-zinc-600 dark:text-zinc-300 text-base sm:text-lg leading-relaxed mb-6 font-normal">
            {language === 'ps'
              ? 'هیلګرافیک د افغانستان او سیمې په کچه د لوړ کیفیت ګرافیک ډیزاین او اعلاناتو مخکښ استودیو ده. موږ باور لرو چې د هر بریالي برانډ بنسټ په روښانه او اغېزناک لید ولاړ دی.'
              : language === 'fa'
              ? 'هیلا گرافیک به عنوان یک استودیوی پیشرو در طراحی گرافیک و تبلیغات، با تلفیق هنر معاصر و اصول برندینگ بین‌المللی، هویت‌هایی خلق می‌کند که در ذهن مخاطب ماندگار می‌مانند.'
              : 'Hila Graphic is a boutique design and advertising agency committed to transforming ambitious companies into market-defining visual leaders through disciplined craft, strategic rigor, and modern aesthetics.'}
          </p>
        </motion.div>

        {/* Agency Big Visual & Philosophy */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-20">
          
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-[32px] overflow-hidden liquid-glass border border-white/80 dark:border-white/10 p-3 shadow-2xl">
              <div className="relative aspect-[4/3] rounded-[24px] overflow-hidden bg-zinc-900">
                <img
                  src="https://images.unsplash.com/photo-1542744094-3a31f272c490?q=80&w=1200&auto=format&fit=crop"
                  alt="Hila Graphic Studio"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                <div className="absolute bottom-4 left-4 right-4 p-5 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/15 text-white">
                  <div className="font-display font-bold text-lg text-white">
                    Hila Graphic Studio
                  </div>
                  <div className="text-xs text-zinc-300 mt-1">
                    Design & Advertising • Kabul & Beyond
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col justify-center text-start">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white mb-4">
              {language === 'ps'
                ? 'زموږ لید او تګلاره'
                : language === 'fa'
                ? 'دیدگاه و تعهد استودیو'
                : 'Our Philosophy & Creative Discipline'}
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4">
              {t.about.paragraph1}
            </p>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed mb-6">
              {t.about.paragraph2}
            </p>

            <div className="flex items-center gap-6 pt-4 border-t border-black/[0.06] dark:border-white/[0.08]">
              <div>
                <div className="font-display text-2xl font-extrabold text-[#FF5E1E]">
                  {config.stats.completedProjects}
                </div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                  {t.hero.stat2Label}
                </div>
              </div>
              <div className="w-px h-8 bg-black/10 dark:bg-white/10" />
              <div>
                <div className="font-display text-2xl font-extrabold text-zinc-900 dark:text-white">
                  {config.stats.satisfaction}
                </div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                  {t.hero.stat1Label}
                </div>
              </div>
              <div className="w-px h-8 bg-black/10 dark:bg-white/10" />
              <div>
                <div className="font-display text-2xl font-extrabold text-zinc-900 dark:text-white">
                  {config.stats.experienceYears}
                </div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                  {t.hero.stat3Label}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Pillars / Values */}
        <div className="mb-20">
          <div className="text-start mb-10">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#FF5E1E] uppercase tracking-wider mb-2">
              <Award className="w-4 h-4" />
              <span>Core Values</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white">
              {language === 'ps'
                ? 'هغه اصول چې زموږ کار ټاکي'
                : language === 'fa'
                ? 'ارزش‌هایی که در هر پروژه جریان دارند'
                : 'The Standards Guiding Every Design'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <div
                  key={i}
                  className="p-6 rounded-[28px] liquid-glass liquid-glass-specular border border-white/80 dark:border-white/10 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-[#FF5E1E]/10 text-[#FF5E1E] flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-zinc-900 dark:text-white mb-2">
                      {v.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                      {v.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Proven 4-Step Methodology */}
        <div className="mb-20">
          <div className="text-start mb-10">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#FF5E1E] uppercase tracking-wider mb-2">
              <Clock className="w-4 h-4" />
              <span>Methodology</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white">
              {language === 'ps'
                ? 'موږ څنګه کار کوو؟'
                : language === 'fa'
                ? 'فرایند کاری چهار مرحله‌ای ما'
                : 'How We Deliver Guaranteed Quality'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="p-6 rounded-[26px] liquid-glass border border-white/80 dark:border-white/10 relative"
              >
                <div className="font-mono text-3xl font-extrabold text-[#FF5E1E] mb-3">
                  {step.number}
                </div>
                <h3 className="font-display text-base font-bold text-zinc-900 dark:text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Collaboration CTA */}
        <div className="rounded-[32px] p-8 sm:p-12 liquid-glass liquid-glass-specular border border-white/80 dark:border-white/15 shadow-xl text-center flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-[#FF5E1E]/10 text-[#FF5E1E] flex items-center justify-center mb-4">
            <MessageCircle className="w-7 h-7" />
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white mb-3 max-w-xl">
            {language === 'ps'
              ? 'ایا چمتو یاست چې خپل برانډ نوي کچې ته ورسوئ؟'
              : language === 'fa'
              ? 'آماده‌اید هویت برند خود را متحول کنید؟'
              : 'Ready to Transform Your Commercial Image?'}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 max-w-md mb-6 leading-relaxed">
            {language === 'ps'
              ? 'همدا اوس په مستقیم ډول په واټساف کې زموږ له ډیزاینرانو سره اړیکه ونیسئ.'
              : language === 'fa'
              ? 'همین حالا از طریق واتساپ گفتگوی صمیمانه با تیم ما را آغاز نمایید.'
              : 'Connect directly with our lead creative art director via WhatsApp for immediate consultation.'}
          </p>
          <a
            href={getWhatsAppLink('Hello Hila Graphic, I read your studio story and would like to start a design project.')}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 rounded-full bg-[#FF5E1E] hover:bg-[#E84D0E] text-white font-bold text-sm inline-flex items-center gap-2.5 orange-glow shadow-xl transition-all select-none cursor-pointer"
          >
            <MessageCircle className="w-5 h-5" />
            <span>{t.whatsapp.ctaButton}</span>
          </a>
        </div>

      </div>
    </div>
  );
};
