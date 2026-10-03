import { SiteConfig, MenuItem, PricePackage, ClientItem } from '../types';
import { defaultFounderProfile } from '../data/founderProfile';

export const defaultMenuItems: MenuItem[] = [
  {
    id: 'home',
    label: { en: 'Home', ps: 'لومړی مخ', fa: 'صفحه نخست' },
    path: 'home',
    order: 1,
    active: true,
  },
  {
    id: 'services',
    label: { en: 'Services', ps: 'خدمتونه', fa: 'خدمات' },
    path: 'services',
    order: 2,
    active: true,
  },
  {
    id: 'price-list',
    label: { en: 'Price List', ps: 'د بیو لست', fa: 'لیست قیمت‌ها' },
    path: 'price-list',
    order: 3,
    active: true,
  },
  {
    id: 'about',
    label: { en: 'About Us', ps: 'زموږ په اړه', fa: 'درباره ما' },
    path: 'about',
    order: 4,
    active: true,
  },
  {
    id: 'portfolio',
    label: { en: 'Portfolio', ps: 'نمونې او پروژې', fa: 'نمونه کارها' },
    path: 'portfolio',
    order: 5,
    active: true,
  },
  {
    id: 'contact',
    label: { en: 'Contact', ps: 'اړیکه', fa: 'تماس با ما' },
    path: 'contact',
    order: 6,
    active: true,
  },
];

export const defaultPricePackages: PricePackage[] = [
  {
    id: 'logo-suite',
    name: {
      en: 'Signature Logo Suite',
      ps: 'د ځانګړي لوګو مسلکي کڅوړه',
      fa: 'پکیج تخصصی نشان و لوگو',
    },
    tagline: {
      en: 'For startups & focused brands requiring an unmistakable brand mark.',
      ps: 'د نویو سوداګریو لپاره د بې ساري لوګو جوړول.',
      fa: 'مناسب برای استارتاپ‌ها و برندهای نیازمند نشان متمایز.',
    },
    price: '$240',
    period: { en: 'per project', ps: 'د هرې پروژې لپاره', fa: 'به ازای پروژه' },
    features: {
      en: [
        '3 Distinct Geometric & Typographic Concepts',
        'Master Vector Packages (AI, EPS, SVG, PDF, High-Res PNG)',
        'Dark, Light & Monochrome Color Lockups',
        'Official Typography & Color Palette Code Guide',
        'Social Media Favicon & Circular Avatar Suite',
        'Full Commercial Copyright Transfer',
      ],
      ps: [
        'د لوګو ۳ بې‌ساري او ښکلي کانسپټونه',
        'ټول اصلي وکتور فایلونه (لوړ کیفیت AI، EPS، SVG)',
        'د تورې، سپینې او رنګینې بڼې ځانګړي فایلونه',
        'د فونټ او رنګونو رسمي لارښود او کودونه',
        'د ټولنیزو شبکو لپاره د پروفایل سایزونه',
        'د چاپي او ډیجیټل حق بشپړ انتقال',
      ],
      fa: [
        '۳ اتود اختصاصی، هندسی و تایپوگرافی',
        'تمامی فایل‌های سورس برداری (AI, EPS, SVG, PNG)',
        'نسخه‌های ویژه زمینه تیره، روشن و تک‌رنگ',
        'راهنمای رنگی سازمانی و کدهای دقیق چاپ',
        'کیت آیکون‌ها و فاوآیکون شبکه‌های اجتماعی',
        'انتقال کامل حقوق مالکیت و لایسنس تجاری',
      ],
    },
    popular: false,
    active: true,
    order: 1,
  },
  {
    id: 'full-branding',
    name: {
      en: 'Corporate Identity System',
      ps: 'د برانډینګ بشپړ او جامع سیستم',
      fa: 'سیستم جامع برندینگ و هویت سازمانی',
    },
    tagline: {
      en: 'End-to-end brand authority designed for market leaders and growing enterprises.',
      ps: 'د پیاوړو شرکتونو لپاره د برانډینګ بشپړ نظام او لوړ اعتبار.',
      fa: 'بالاترین استاندارد سازمانی برای تسخیر بازار و جایگاه لوکس.',
    },
    price: '$580',
    period: { en: 'complete suite', ps: 'بشپړه کڅوړه', fa: 'بسته کامل' },
    features: {
      en: [
        'Complete Comprehensive Brand Book (35+ Pages)',
        'Signature Logo, Sub-marks & Monogram Ecosystem',
        'Stationery Suite (Business Cards, Letterheads, Envelopes, Folders)',
        'Commercial Social Media Post & Story Design System',
        'Product Packaging or Environmental Signage Mockups',
        'Dedicated Senior Art Director & Priority Turnaround',
      ],
      ps: [
        'د برانډ بشپړ لارښود کتاب (Brand Book ۳۵+ مخه)',
        'د لوګو، مونوګرام او فرعي نښو بشپړ اکوسیستم',
        'رسمي اداري پاڼې، کارټونه، پوښۍ او پاکټونه',
        'د ټولنیزو رسنیو لپاره د پوسټ او سټوري ډیزاین سیستم',
        'د تابلوی، لوحې او بسته‌بندۍ مسلکي نمونې',
        'د ډیزاین له مشر سره ځانګړې همغږي او چټک کار',
      ],
      fa: [
        'دفترچه استاندارد برند (Brand Manual ۳۵+ صفحه جامع)',
        'اکوسیستم کامل لوگو، نشان دوم و مونوگرام',
        'ست کامل اوراق اداری (کارت ویزیت، سربرگ، فولدر، پاکت)',
        'سیستم دیزاین پست‌ها و استوری‌های سوشال مدیا',
        'موک‌آپ‌های محیطی، تابلوی شرکتی و بسته‌بندی',
        'مدیر هنری اختصاصی و پشتیبانی اولویت‌دار',
      ],
    },
    popular: true,
    active: true,
    order: 2,
  },
  {
    id: 'campaign-suite',
    name: {
      en: 'Advertising & Motion Retainer',
      ps: 'د اعلاناتو او موشن ګرافیک کڅوړه',
      fa: 'پکیج تبلیغاتی و کمپین موشن گرافیک',
    },
    tagline: {
      en: 'High-impact conversion posters, billboards, and kinetic commercial animations.',
      ps: 'د اعلاناتي کمپاینونو او ویډیویي اعلاناتو غوره ټولګه.',
      fa: 'پوسترهای بیلبوردی، انیمیشن‌های تبلیغاتی و کمپین‌های پربازده.',
    },
    price: '$420',
    period: { en: 'per campaign', ps: 'د هر کمپاین لپاره', fa: 'به ازای هر کمپین' },
    features: {
      en: [
        'Large-Format Billboard & Street Posters (Print-Ready CMYK)',
        '15s & 30s High-Conversion Kinetic Motion Graphic Commercials',
        'Multi-Size Meta & Google Ad Creative Formats',
        'Corporate Company Profile / Catalog (Up to 16 Pages)',
        'Audio SFX Mixing & Dynamic Sound Design',
        'Direct Creative Director Strategy Support',
      ],
      ps: [
        'د بیلبورډونو او ښاري اعلاناتو لپاره لوړ کیفیت پوسټرونه',
        '۱۵ او ۳۰ ثانیې متحرک موشن ګرافیک سوداګریز اعلانات',
        'د ګوګل او ټولنیزو شبکو اعلاناتي اندازې',
        'د شرکت جامع کاتالوګ او بروشور (تر ۱۶ مخه)',
        'د غږ او میوزیک مسلکي تدوین',
        'مستقیمه استراتیژیکه او اعلاناتي همغږي',
      ],
      fa: [
        'طراحی پوسترهای بزرگ شهری و بیلبوردهای لارج‌فرمت',
        'انیمیشن‌های موشن گرافیک تبلیغاتی ۱۵ و ۳۰ ثانیه‌ای',
        'فرمت‌های متنوع تبلیغات آنلاین و بنرهای وب',
        'کاتالوگ یا پروفایل جامع شرکتی (تا ۱۶ صفحه اختصاصی)',
        'میکس افکت‌های صوتی و تدوین باکیفیت',
        'پشتیبانی مستقیم و استراتژی تبلیغاتی',
      ],
    },
    popular: false,
    active: true,
    order: 3,
  },
];

export const defaultClients: ClientItem[] = [
  {
    id: 'client-1',
    name: 'Kabul Prime Logistics',
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
    industry: { en: 'Transportation & Logistics', ps: 'ټرانسپورټ او لوژستیک', fa: 'حمل و نقل و لجستیک' },
    featured: true,
  },
  {
    id: 'client-2',
    name: 'Pamir Mineral Water Co.',
    logoUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200&auto=format&fit=crop&q=80',
    industry: { en: 'Beverage & Consumer Goods', ps: 'څښاک او خوراکي توکي', fa: 'نوشیدنی و صنایع غذایی' },
    featured: true,
  },
  {
    id: 'client-3',
    name: 'Aryana Telecom Systems',
    logoUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&auto=format&fit=crop&q=80',
    industry: { en: 'Telecommunications', ps: 'مخابرات او ټکنالوژي', fa: 'ارتباطات و مخابرات' },
    featured: true,
  },
  {
    id: 'client-4',
    name: 'Spinzar Trading Group',
    logoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&auto=format&fit=crop&q=80',
    industry: { en: 'International Commerce', ps: 'نړیواله سوداګري', fa: 'تجارت بین‌الملل' },
    featured: true,
  },
];

export const defaultSiteConfig: SiteConfig = {
  brandName: 'Hila Graphic',
  brandTagline: {
    en: 'Where Visionary Design Powers Impactful Advertising',
    ps: 'چیرې چې نوښتګر ډیزاین اغېزمن اعلانونه رامنځته کوي',
    fa: 'جایی که دیزاین خلاقانه تبلیغات ماندگار خلق می‌کند',
  },
  whatsappNumber: '+93799123456',
  email: 'contact@hilagraphic.com',
  phoneDisplay: '+93 (0) 799 123 456',
  address: {
    en: 'District 4, Shahr-e Naw, Kabul, Afghanistan & Remote Global Studio',
    ps: 'څلورمه ناحیه، شهر نو، کابل، افغانستان او نړیوال ډیجیټل سټوډیو',
    fa: 'ناحیه ۴، شهر نو، کابل، افغانستان و استودیوی دیجیتال بین‌المللی',
  },
  socialLinks: [
    { platform: 'Behance', url: 'https://behance.net', label: 'Behance' },
    { platform: 'Instagram', url: 'https://instagram.com', label: 'Instagram' },
    { platform: 'LinkedIn', url: 'https://linkedin.com', label: 'LinkedIn' },
    { platform: 'Dribbble', url: 'https://dribbble.com', label: 'Dribbble' },
  ],
  stats: {
    satisfaction: '99.4%',
    experienceYears: '8+',
    completedProjects: '650+',
    activeClients: '180+',
  },
  customLogo: {
    customLogoUrl: null,
    lightLogoUrl: null,
    darkLogoUrl: null,
    width: 140,
  },
  backgroundImage: {
    enabled: false,
    lightImageUrl: '',
    darkImageUrl: '',
    opacity: 0.18,
    blur: 6,
  },
  hero: {
    badge: {
      en: 'HILA GRAPHIC • CREATIVE AGENCY',
      ps: 'هیله ګرافیک • د اعلاناتو او ډیزاین سټوډیو',
      fa: 'هیله گرافیک • آژانس خلاقیت و تبلیغات',
    },
    headlinePart1: {
      en: 'Crafting ',
      ps: 'د اغېزمنو ',
      fa: 'خلق ',
    },
    headlineAccent: {
      en: 'Iconic Brands',
      ps: 'برانډونو او اعلاناتو',
      fa: 'برندهای ماندگار',
    },
    headlinePart2: {
      en: ' & High-Impact Advertising',
      ps: ' مسلکي ډیزاین',
      fa: ' و تبلیغات پربازده',
    },
    description: {
      en: 'We are a premier graphic design and advertising company engineered to build unforgettable visual identities, high-conversion advertising campaigns, and motion systems that command market authority.',
      ps: 'هیله ګرافیک د ګرافیک ډیزاین او اعلاناتو یو پیاوړی او نوښتګر شرکت دی، چې ستاسو د سوداګرۍ لپاره بې‌ساري بصري هویت، د لوړ پلور اعلاناتي کمپاینونه او متحرک اعلانونه جوړوي.',
      fa: 'هیله گرافیک استودیوی پیشرو در حوزه گرافیک دیزاین و تبلیغات است که هویت‌های بصری ممتاز، کمپین‌های تبلیغاتی تأثیرگذار و سیستم‌های موشن گرافیک حرفه‌ای را برای تسخیر بازار خلق می‌کند.',
    },
    primaryCta: {
      en: 'Order on WhatsApp',
      ps: 'په واټساپ امر وکړئ',
      fa: 'سفارش در واتساپ',
    },
    secondaryCta: {
      en: 'Explore Our Services',
      ps: 'زموږ خدمتونه وګورئ',
      fa: 'مشاهده خدمات ما',
    },
  },
  about: {
    badge: {
      en: 'ABOUT HILA GRAPHIC',
      ps: 'د هیله ګرافیک په اړه',
      fa: 'درباره هیله گرافیک',
    },
    title: {
      en: 'A New Standard in Visual Excellence & Strategic Advertising',
      ps: 'په بصري ډیزاین او سوداګریزو اعلاناتو کې نوی معیار',
      fa: 'استانداردی نو در دیزاین بصری و تبلیغات هدفمند',
    },
    previewText: {
      en: 'At Hila Graphic, we fuse artistic mastery with commercial strategy. We design unforgettable visual identities, motion graphics, and high-impact advertising that establish lasting market leadership.',
      ps: 'په هیله ګرافیک کې، موږ هنر او سوداګریزه پوهه سره یوځای کوو. موږ داسې لوګوګانې او اعلانونه ډیزاین کوو چې ستاسو سوداګري په بازار کې تلپاتې او مخکښه کړي.',
      fa: 'در هیله گرافیک، ما هنر دیزاین را با استراتژی تجاری تلفیق می‌کنیم. هویت‌های ماندگار و تبلیغات پربازده‌ای خلق می‌کنیم که برند شما را در بالاترین جایگاه بازار قرار می‌دهد.',
    },
    fullStory1: {
      en: 'Founded with a relentless commitment to visual distinction, Hila Graphic has grown into a trusted creative partner for ambitious enterprises, commercial brands, and institutions across Afghanistan and international markets.',
      ps: 'هیله ګرافیک په افغانستان او نړیوال بازار کې د باکیفیته ډیزاین او اعلاناتو د وړاندې کولو په موخه رامنځته شوی ترڅو سوداګریو ته لوړ ارزښت وروبښي.',
      fa: 'هیله گرافیک با هدف ارائه سطحی بی‌سابقه از دیزاین مدرن و اعلانات تجاری در افغانستان و بازارهای فرامرزی پایه‌گذاری شد.',
    },
    fullStory2: {
      en: 'Our multidisciplinary studio combines deep cultural resonance with international design benchmarks, ensuring your brand stands proud on both local streets and global digital platforms.',
      ps: 'زموږ مسلکي ټیم د نړیوالو معیارونو او افغاني کلتور په پام کې نیولو سره، داسې ډیزاینونه جوړوي چې په هر ډګر کې غوره وي.',
      fa: 'تیم حرفه‌ای ما پیوندی عمیق میان ارزش‌های بومی و مدرن‌ترین تکنیک‌های دیزاین جهان برقرار می‌کند تا برند شما همواره پیشتاز باشد.',
    },
    agencyCardTitle: {
      en: 'Crafted with Precision. Delivered with Authority.',
      ps: 'په پوره دقت ډیزاین، په پوره مسلکیتوب وړاندې کول.',
      fa: 'طراحی‌شده با دقت ریاضی. ارائه‌شده با اقتدار.',
    },
    agencyCardDesc: {
      en: 'Every curved bezier, typographic baseline, and visual asset is meticulously calibrated to establish your company as a category leader.',
      ps: 'زموږ هره لیکه، رنګ او فونټ په خورا دقت سره ټاکل کېږي ترڅو ستاسو شرکت په بازار کې د نورو ترمنځ ځانګړی وځلېږي.',
      fa: 'تمام خطوط، فواصل و تایپوگرافی پروژه‌های شما با استانداردهای بین‌المللی کالیبره می‌شوند تا برند شما همواره پیشتاز بماند.',
    },
  },
  founderProfile: defaultFounderProfile,
};

export function buildWhatsAppUrl(phone: string, message?: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const baseUrl = `https://wa.me/${cleanPhone}`;
  if (!message) return baseUrl;
  return `${baseUrl}?text=${encodeURIComponent(message)}`;
}
