import { Language } from '../types';

export interface Translations {
  nav: {
    home: string;
    services: string;
    priceList: string;
    aboutUs: string;
    portfolio: string;
    contact: string;
    orderWhatsApp: string;
    menu: string;
    close: string;
    themeToggleLight: string;
    themeToggleDark: string;
    switchLanguage: string;
    adminLink: string;
  };
  hero: {
    badge: string;
    headlinePart1: string;
    headlineAccent: string;
    headlinePart2: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    stat1Label: string;
    stat1Value: string;
    stat2Label: string;
    stat2Value: string;
    stat3Label: string;
    stat3Value: string;
    showcaseLabel: string;
    viewProject: string;
    autoRotate: string;
  };
  about: {
    badge: string;
    title: string;
    paragraph1: string;
    paragraph2: string;
    readMore: string;
    pillar1Title: string;
    pillar1Desc: string;
    pillar2Title: string;
    pillar2Desc: string;
    pillar3Title: string;
    pillar3Desc: string;
    ctaButton: string;
    agencyCardTag: string;
    agencyCardTitle: string;
    agencyCardDesc: string;
    storyTitle: string;
    story1: string;
    story2: string;
    valuesTitle: string;
    statsHeading: string;
  };
  services: {
    badge: string;
    title: string;
    subtitle: string;
    exploreService: string;
    deliverablesLabel: string;
    inquireOnWhatsApp: string;
    viewAllServices: string;
    pricingStartsAt: string;
  };
  portfolio: {
    badge: string;
    title: string;
    subtitle: string;
    filterAll: string;
    filterBranding: string;
    filterLogo: string;
    filterPoster: string;
    filterMotion: string;
    filterProfile: string;
    viewAllProjects: string;
    clientLabel: string;
    yearLabel: string;
    viewCaseStudy: string;
  };
  whatsapp: {
    badge: string;
    title: string;
    subtitle: string;
    ctaButton: string;
    quickPromptsLabel: string;
    prompt1: string;
    prompt2: string;
    prompt3: string;
    prompt4: string;
    statusActive: string;
    responseSpeed: string;
    numberConfigPrompt: string;
  };
  footer: {
    brandBio: string;
    quickLinks: string;
    servicesTitle: string;
    contactTitle: string;
    officeLabel: string;
    directChat: string;
    allRightsReserved: string;
    privacy: string;
    terms: string;
    configWhatsApp: string;
    adminPortal: string;
  };
  admin: {
    portalTitle: string;
    loginPasscodeLabel: string;
    loginButton: string;
    invalidPasscode: string;
    overview: string;
    servicesManager: string;
    portfolioManager: string;
    menusManager: string;
    priceManager: string;
    clientsManager: string;
    mediaLibrary: string;
    settingsBrand: string;
    addService: string;
    editService: string;
    addProject: string;
    addMenuItem: string;
    uploadMedia: string;
    logoManager: string;
    uploadLogo: string;
    removeLogo: string;
    bgImageManager: string;
    backToSite: string;
    resetDefaults: string;
    logout: string;
    description: string;
  };
  common: {
    loading: string;
    skip: string;
    close: string;
    next: string;
    previous: string;
    share: string;
    linkCopied: string;
    copied: string;
    backToSite: string;
    save: string;
    saveChanges: string;
    saved: string;
    cancel: string;
    delete: string;
    edit: string;
    addNew: string;
    search: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    nav: {
      home: 'Home',
      services: 'Services',
      priceList: 'Price List',
      aboutUs: 'About Us',
      portfolio: 'Portfolio',
      contact: 'Contact',
      orderWhatsApp: 'Order on WhatsApp',
      menu: 'Menu',
      close: 'Close',
      themeToggleLight: 'Light Mode',
      themeToggleDark: 'Dark Mode',
      switchLanguage: 'Language',
      adminLink: 'Admin CMS',
    },
    hero: {
      badge: 'HILA GRAPHIC • CREATIVE AGENCY',
      headlinePart1: 'Crafting ',
      headlineAccent: 'Iconic Brands',
      headlinePart2: ' & High-Impact Advertising',
      description: 'We are a premier graphic design and advertising company engineered to build unforgettable visual identities, high-conversion advertising campaigns, and motion systems that command market authority.',
      primaryCta: 'Order on WhatsApp',
      secondaryCta: 'Explore Our Services',
      stat1Label: 'Client Satisfaction',
      stat1Value: '99.4%',
      stat2Label: 'Projects Delivered',
      stat2Value: '650+',
      stat3Label: 'Years of Mastery',
      stat3Value: '8+',
      showcaseLabel: 'FEATURED DISCIPLINE',
      viewProject: 'Explore Service',
      autoRotate: 'Auto-rotating showcase',
    },
    about: {
      badge: 'ABOUT HILA GRAPHIC',
      title: 'A New Standard in Visual Excellence & Strategic Advertising',
      paragraph1: 'At Hila Graphic, we fuse artistic mastery with commercial strategy. We believe design is not merely decoration—it is the catalyst that defines enterprise credibility, market resonance, and enduring consumer loyalty.',
      paragraph2: 'From foundational brand identity architectures and bespoke typography to cinematic motion graphics and high-impact advertising posters, we deliver visual solutions tailored for modern brands.',
      readMore: 'Read Full Story',
      pillar1Title: 'Strategic Brand Systems',
      pillar1Desc: 'Foundational logos, visual design manuals, and corporate identities engineered for longevity.',
      pillar2Title: 'Advertising That Converts',
      pillar2Desc: 'Billboards, digital ad creatives, and high-impact posters engineered to drive decisive commercial response.',
      pillar3Title: 'Meticulous Craftsmanship',
      pillar3Desc: 'Pixel-perfect typography, color science, and spatial restraint inspired by luxury digital design.',
      ctaButton: 'Discover Our Philosophy',
      agencyCardTag: 'DESIGN ETHOS',
      agencyCardTitle: 'Crafted with Precision. Delivered with Authority.',
      agencyCardDesc: 'Every curved bezier, typographic baseline, and visual asset is meticulously calibrated to establish your company as a category leader.',
      storyTitle: 'Our Journey & Philosophy',
      story1: 'Founded with a relentless commitment to visual distinction, Hila Graphic has grown into a trusted creative partner for ambitious enterprises, commercial brands, and institutions across Afghanistan and international markets.',
      story2: 'Our multidisciplinary studio combines deep cultural resonance with international design benchmarks, ensuring your brand stands proud on both local streets and global digital platforms.',
      valuesTitle: 'Our Core Standards',
      statsHeading: 'Proven Track Record',
    },
    services: {
      badge: 'OUR SERVICES',
      title: 'Comprehensive Graphic Design & Advertising Solutions',
      subtitle: 'From initial brand conceptualization to print-ready corporate profiles and dynamic motion campaigns, explore our specialized agency capabilities.',
      exploreService: 'Explore Details',
      deliverablesLabel: 'Key Deliverables',
      inquireOnWhatsApp: 'Inquire on WhatsApp',
      viewAllServices: 'View All Services',
      pricingStartsAt: 'Starting from',
    },
    portfolio: {
      badge: 'CURATED PORTFOLIO',
      title: 'Selected Works & High-Impact Case Studies',
      subtitle: 'A curated showcase of recent brand identity transformations, promotional campaigns, and print architectures executed by our creative studio.',
      filterAll: 'All Works',
      filterBranding: 'Full Branding',
      filterLogo: 'Logo & Identity',
      filterPoster: 'Poster & Ads',
      filterMotion: 'Motion Graphics',
      filterProfile: 'Company Profiles',
      viewAllProjects: 'View All Projects',
      clientLabel: 'Client',
      yearLabel: 'Year',
      viewCaseStudy: 'Inspect Case Study',
    },
    whatsapp: {
      badge: 'DIRECT STUDIO COLLABORATION',
      title: 'Have a project in mind? Let’s create something exceptional together.',
      subtitle: 'Connect directly with Hila Graphic creative directors on WhatsApp. Rapid response, bespoke consultation, and streamlined proposals tailored to your budget.',
      ctaButton: 'Order on WhatsApp',
      quickPromptsLabel: 'Quick Inquiry Shortcuts:',
      prompt1: 'I need a full brand identity package',
      prompt2: 'I want a custom signature logo design',
      prompt3: 'I need advertising posters for our campaign',
      prompt4: 'I need a corporate company profile & brochure',
      statusActive: 'Studio Online & Available',
      responseSpeed: 'Usually responds in under 15 minutes',
      numberConfigPrompt: 'Verified Hila Graphic WhatsApp line',
    },
    footer: {
      brandBio: 'Hila Graphic is a premier graphic design and advertising studio dedicated to creating enduring brand identities, motion graphics, and high-impact advertising architectures.',
      quickLinks: 'Quick Links',
      servicesTitle: 'Services',
      contactTitle: 'Studio Inquiries',
      officeLabel: 'Creative Studio',
      directChat: 'Direct WhatsApp Chat',
      allRightsReserved: 'All rights reserved.',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      configWhatsApp: 'Configure WhatsApp',
      adminPortal: 'Admin Portal',
    },
    admin: {
      portalTitle: 'Admin Authentication',
      loginPasscodeLabel: 'Enter Studio Passcode',
      loginButton: 'Unlock CMS Studio',
      invalidPasscode: 'Incorrect administrator passcode.',
      overview: 'System Overview',
      servicesManager: 'Services & Products',
      portfolioManager: 'Portfolio & Works',
      menusManager: 'Navigation Menus',
      priceManager: 'Price Packages',
      clientsManager: 'Clients & Partners',
      mediaLibrary: 'Media Library',
      settingsBrand: 'Brand & Background',
      addService: 'Add New Service',
      editService: 'Edit Service',
      addProject: 'Add Project',
      addMenuItem: 'Add Menu Link',
      uploadMedia: 'Upload Asset',
      logoManager: 'Official Brand Logo',
      uploadLogo: 'Upload Official Logo',
      removeLogo: 'Revert to Built-in Logo',
      bgImageManager: 'Home Background Image System',
      backToSite: 'Back to Website',
      resetDefaults: 'Reset to Studio Defaults',
      logout: 'Lock & Sign Out',
      description: 'Comprehensive Scope & Description',
    },
    common: {
      loading: 'Loading Hila Graphic...',
      skip: 'Enter Studio',
      close: 'Close',
      next: 'Next',
      previous: 'Previous',
      share: 'Share Link',
      linkCopied: 'Link copied to clipboard!',
      copied: 'Copied!',
      backToSite: 'Back to Website',
      save: 'Save',
      saveChanges: 'Save Changes',
      saved: 'Saved Successfully!',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      addNew: 'Add New',
      search: 'Search...',
    },
  },
  ps: {
    nav: {
      home: 'لومړی مخ',
      services: 'خدمتونه',
      priceList: 'د بیو لست',
      aboutUs: 'زموږ په اړه',
      portfolio: 'نمونې او پروژې',
      contact: 'اړیکه',
      orderWhatsApp: 'واټساپ کې فرمایش',
      menu: 'مینو',
      close: 'بندول',
      themeToggleLight: 'روښانه بڼه',
      themeToggleDark: 'توره بڼه',
      switchLanguage: 'ژبه',
      adminLink: 'مدیریتي پنل',
    },
    hero: {
      badge: 'هیله ګرافیک • خلاق ډیزاین او اعلانات',
      headlinePart1: 'د ځانګړو ',
      headlineAccent: 'برانډونو جوړول',
      headlinePart2: ' او بې‌ساري اعلانات',
      description: 'هیله ګرافیک یو مخکښ ګرافیک ډیزاین او اعلاناتي شرکت دی چې د تلپاتې برانډینګ، پیاوړو اعلاناتي کمپاینونو او مسلکي موشن ګرافیک ډیزاینونو له لارې ستاسو سوداګري په بازار کې بې‌سارې کوي.',
      primaryCta: 'واټساپ کې فرمایش',
      secondaryCta: 'زموږ خدمتونه وګورئ',
      stat1Label: 'د پیرودونکو رضایت',
      stat1Value: '۹۹.۴٪',
      stat2Label: 'بشپړې شوې پروژې',
      stat2Value: '۶۵۰+',
      stat3Label: 'کلونو تجربه',
      stat3Value: '۸+',
      showcaseLabel: 'ځانګړی خدمت',
      viewProject: 'د خدمت تفصیلي معلومات',
      autoRotate: 'د خدمتونو اتومات څرخول',
    },
    about: {
      badge: 'د هیله ګرافیک په اړه',
      title: 'په بصري هنر او اعلاناتو کې یو نوی نړیوال معیار',
      paragraph1: 'په هیله ګرافیک کې موږ هنري لوړوالی د سوداګریز فکر سره یوځای کوو. زموږ باور دا دی چې ډیزاین یوازې ښکلا نه ده، بلکې دا ستاسو د سوداګرۍ ځواک او د بازار د باوري مشرتابه تر ټولو قوي ثبوت دی.',
      paragraph2: 'له بنسټیزو لوګوګانو او هویت جوړونې څخه نیولې تر سینمایي موشن ګرافیک او اغېزمنو بیلبورډ پوسټرونو پورې، موږ د معاصرو سوداګریو لپاره بې‌ساري ډیزاینونه وړاندې کوو.',
      readMore: 'بشپړه کیسه ولولئ',
      pillar1Title: 'د برانډ پیاوړی سیستم',
      pillar1Desc: 'هندسي لوګوګانې، بصري لارښود کتابونه او د شرکت تلپاتې هویت.',
      pillar2Title: 'اغېزمن او ګټور اعلانات',
      pillar2Desc: 'بیلبورډونه، د ټولنیزو رسنیو ډیزاین او پوسټرونه چې مستقیم پلور زیاتوي.',
      pillar3Title: 'لوړ دقت او هنري ښکلا',
      pillar3Desc: 'پکسل په پکسل دقیق رنګونه، غوره فونټونه او د لوکس ډیجیټل معیارونو کارونه.',
      ctaButton: 'زموږ تګلاره وګورئ',
      agencyCardTag: 'د ډیزاین فلسفه',
      agencyCardTitle: 'په پوره دقت ډیزاین شوی. په پوره ویاړ وړاندې شوی.',
      agencyCardDesc: 'ستاسو د ادارې ټول ډیزاینونه په ریاضیاتي تناسباتو برابرېږي څو ستاسو نوم د خپلې برخې تر ټولو باوري نښه شي.',
      storyTitle: 'زموږ سفر او لیدلوری',
      story1: 'هیله ګرافیک د ډیزاین په ډګر کې د لوړ معیار رامنځته کولو لپاره په افغانستان کې پیل شو او نن ورځ د کورنیو او بهرنیو معتبرو شرکتونو یو باوري ملګری دی.',
      story2: 'زموږ سټوډیو افغاني ارزښتونه له نړیوالو عصري معیارونو سره یوځای کوي ترڅو ستاسو برانډ هر ځای ځلانده وي.',
      valuesTitle: 'زموږ بنسټیز اصول',
      statsHeading: 'ثابته شوې مخینه',
    },
    services: {
      badge: 'زموږ خدمتونه',
      title: 'د ګرافیک ډیزاین او اعلاناتو ټولیز خدمات',
      subtitle: 'د برانډ له بنسټیز فکر او لوګو څخه تر لوړ کیفیت لرونکو بروشورونو، کتابونو او اعلاناتي موشن پورې، زموږ ځانګړې وړتیاوې وپلټئ.',
      exploreService: 'تفصیلات وګورئ',
      deliverablesLabel: 'د تحویل وړ اساسي توکي',
      inquireOnWhatsApp: 'واټساپ کې پوښتنه وکړئ',
      viewAllServices: 'ټول خدمتونه کتل',
      pricingStartsAt: 'پیل له',
    },
    portfolio: {
      badge: 'غوره نمونې',
      title: 'زموږ د پروژو او کارونو برگزیده ټولګه',
      subtitle: 'د هغو برانډونو او اعلاناتي کمپاینونو نمونې چې زموږ په سټوډیو کې په لوړ معیار ډیزاین شوي دي.',
      filterAll: 'ټولې پروژې',
      filterBranding: 'بشپړ برانډینګ',
      filterLogo: 'لوګو او نښان',
      filterPoster: 'پوسټر او اعلانات',
      filterMotion: 'موشن ګرافیک',
      filterProfile: 'د شرکت پروفایل',
      viewAllProjects: 'ټولې پروژې لیدل',
      clientLabel: 'پیرودونکی',
      yearLabel: 'کال',
      viewCaseStudy: 'د پروژې سپړنه',
    },
    whatsapp: {
      badge: 'مستقیمه او چټکه اړیکه',
      title: 'پروژه په ذهن کې لرئ؟ راځئ یوځای یو نوی شهکار خلق کړو.',
      subtitle: 'مستقیماً د هیله ګرافیک د ډیزاین مسؤلینو سره واټساپ کې خبرې وکړئ. ګړندی ځواب، مسلکي مشوره او ستاسو د بودیجې سره مناسب وړاندیز.',
      ctaButton: 'واټساپ کې اړیکه',
      quickPromptsLabel: 'د چټک پیغام لنډلارې:',
      prompt1: 'زه د برانډینګ او هویت بشپړه کڅوړه غواړم',
      prompt2: 'زه یو نوی او ځانګړی هندسي لوګو غواړم',
      prompt3: 'زه زموږ د کمپاین لپاره اعلاناتي پوسټرونه غواړم',
      prompt4: 'زه د خپل شرکت لپاره مسلکي پروفایل او بروشور غواړم',
      statusActive: 'سټوډیو همدا اوس فعاله ده',
      responseSpeed: 'معمولاً تر ۱۵ دقیقو په کمه موده کې ځواب',
      numberConfigPrompt: 'د هیله ګرافیک رسمي او باوري واټساپ',
    },
    footer: {
      brandBio: 'هیله ګرافیک د ګرافیک ډیزاین او اعلاناتو یو پیاوړی سټوډیو دی چې د اغېزمنو برانډونو، ویډیویي اعلاناتو او سوداګریزو چارو لپاره ځانګړي حلونه وړاندې کوي.',
      quickLinks: 'ګړندۍ اړیکې',
      servicesTitle: 'خدمتونه',
      contactTitle: 'د سټوډیو اړیکه',
      officeLabel: 'مرکزي سټوډیو',
      directChat: 'مستقیم واټساپ چټ',
      allRightsReserved: 'ټول حقونه خوندي دي.',
      privacy: 'د محرمیت تګلاره',
      terms: 'د کارونې شرایط',
      configWhatsApp: 'د واټساپ شمېره',
      adminPortal: 'مدیریتي پنل',
    },
    admin: {
      portalTitle: 'د اډمین ننوتل',
      loginPasscodeLabel: 'د سټوډیو پټ کوډ داخل کړئ',
      loginButton: 'پنل پرانیستل',
      invalidPasscode: 'پټ کوډ ناسم دی.',
      overview: 'د سیستم لیدنه',
      servicesManager: 'خدمتونه او محصولات',
      portfolioManager: 'پروژې او نمونې',
      menusManager: 'د مینو مدیریت',
      priceManager: 'د بیو کڅوړې',
      clientsManager: 'پیرودونکي او همکاران',
      mediaLibrary: 'د انځورونو کتابتون',
      settingsBrand: 'لوګو او د شالید تنظیمات',
      addService: 'نوی خدمت ورزیات کړئ',
      editService: 'خدمت سمول',
      addProject: 'نوې پروژه ورزیات کړئ',
      addMenuItem: 'نوې مینو ورزیات کړئ',
      uploadMedia: 'فایل اپلوډ کړئ',
      logoManager: 'رسمي لوګو',
      uploadLogo: 'د هیله ګرافیک اصلي لوګو اپلوډ',
      removeLogo: 'اصلي نښان ته بیرته ګرځېدل',
      bgImageManager: 'د مخکینۍ پاڼې شالید',
      backToSite: 'بیرته وېبپاڼې ته',
      resetDefaults: 'اصلي حالت ته اړول',
      logout: 'وتل او قلف کول',
      description: 'بشپړ تفصیلي معلومات',
    },
    common: {
      loading: 'د هیله ګرافیک بارېدل...',
      skip: 'وېبپاڼې ته ننوتل',
      close: 'بندول',
      next: 'بل',
      previous: 'مخکینی',
      share: 'شریکول',
      linkCopied: 'د پروژې لینک کاپي شو!',
      copied: 'کاپي شو!',
      backToSite: 'بیرته وېبپاڼې ته',
      save: 'خوندي کول',
      saveChanges: 'بدلونونه خوندي کړئ',
      saved: 'په بریا سره خوندي شو!',
      cancel: 'لغوه کول',
      delete: 'ړنګول',
      edit: 'سمول',
      addNew: 'نوی ورزیات کړئ',
      search: 'پلټنه...',
    },
  },
  fa: {
    nav: {
      home: 'صفحه نخست',
      services: 'خدمات',
      priceList: 'لیست قیمت‌ها',
      aboutUs: 'درباره ما',
      portfolio: 'نمونه کارها',
      contact: 'تماس با ما',
      orderWhatsApp: 'سفارش در واتساپ',
      menu: 'منو',
      close: 'بستن',
      themeToggleLight: 'حالت روشن',
      themeToggleDark: 'حالت تاریک',
      switchLanguage: 'زبان',
      adminLink: 'پنل مدیریت',
    },
    hero: {
      badge: 'هیله گرافیک • آژانس خلاقیت و تبلیغات',
      headlinePart1: 'خلق ',
      headlineAccent: 'برندهای ماندگار',
      headlinePart2: ' و تبلیغات پربازده',
      description: 'هیله گرافیک استودیوی پیشرو در حوزه گرافیک دیزاین و تبلیغات است که هویت‌های بصری ممتاز، کمپین‌های تبلیغاتی تأثیرگذار و سیستم‌های موشن گرافیک حرفه‌ای را برای تسخیر بازار خلق می‌کند.',
      primaryCta: 'سفارش در واتساپ',
      secondaryCta: 'مشاهده خدمات ما',
      stat1Label: 'رضایت مشتریان',
      stat1Value: '۹۹.۴٪',
      stat2Label: 'پروژه‌های موفق',
      stat2Value: '۶۵۰+',
      stat3Label: 'سال تجربه دیزاین',
      stat3Value: '۸+',
      showcaseLabel: 'دسته شاخص',
      viewProject: 'مشاهده جزئیات خدمت',
      autoRotate: 'نمایش خودکار اسلایدها',
    },
    about: {
      badge: 'درباره هیله گرافیک',
      title: 'استانداردی نو در دیزاین بصری و تبلیغات هدفمند',
      paragraph1: 'در هیله گرافیک، ما هنر دیزاین را با استراتژی تجاری تلفیق می‌کنیم. ما معتقدیم طراحی صرفاً زیبایی نیست، بلکه هویت بنیادین و موتور محرک اعتبار و وفاداری به برند شماست.',
      paragraph2: 'از تدوین کتابچه هویت بصری و طراحی نشان اختصاصی تا انیمیشن‌های موشن گرافیک و پوسترهای چشمگیر تبلیغاتی، متناسب با نیاز برندهای مدرن راهکارهای ممتاز می‌آفرینیم.',
      readMore: 'مطالعه داستان کامل',
      pillar1Title: 'سیستم‌های یکپارچه برند',
      pillar1Desc: 'طراحی لوگوهای هندسی، دفترچه راهنمای هویت و استانداردهای ماندگار بصری برای کسب‌وکارها.',
      pillar2Title: 'تبلیغات نتیجه‌بخش',
      pillar2Desc: 'بیلبوردها، کمپین‌های شبکه‌های اجتماعی و پوسترهای تأثیرگذار با بالاترین نرخ تبدیل مخاطب به مشتری.',
      pillar3Title: 'ظرافت و دقت استثنایی',
      pillar3Desc: 'رعایت دقیق تایپوگرافی، پالت‌های رنگی استاندارد و اصول بصری الهام‌گرفته از محصولات دیجیتال اپل.',
      ctaButton: 'فلسفه کاری و پروژه‌ها',
      agencyCardTag: 'اصول استودیو',
      agencyCardTitle: 'طراحی‌شده با دقت ریاضی. ارائه‌شده با اقتدار.',
      agencyCardDesc: 'تمام خطوط، فواصل و تایپوگرافی پروژه‌های شما با استانداردهای بین‌المللی کالیبره می‌شوند تا برند شما در جایگاه رهبر بازار تثبیت شود.',
      storyTitle: 'مسیر و چشم‌انداز استودیو',
      story1: 'هیله گرافیک با هدف ارائه سطحی بی‌سابقه از دیزاین مدرن و اعلانات تجاری در افغانستان و بازارهای فرامرزی پایه‌گذاری شد.',
      story2: 'تیم حرفه‌ای ما پیوندی عمیق میان ارزش‌های بومی و مدرن‌ترین تکنیک‌های دیزاین جهان برقرار می‌کند تا برند شما همواره پیشتاز باشد.',
      valuesTitle: 'ارزش‌های کلیدی ما',
      statsHeading: 'دستاوردهای مستند استودیو',
    },
    services: {
      badge: 'خدمات تخصصی',
      title: 'راهکارهای جامع گرافیک دیزاین و تبلیغات تجاری',
      subtitle: 'از ایده‌پردازی هویت برند تا آماده‌سازی کاتالوگ‌های لوکس چاپ و انیمیشن‌های موشن گرافیک، توانمندی‌های آژانس ما را کاوش کنید.',
      exploreService: 'مشاهده جزئیات',
      deliverablesLabel: 'اقلام و تحویل‌دادنی‌ها',
      inquireOnWhatsApp: 'استعلام در واتساپ',
      viewAllServices: 'مشاهده همه خدمات',
      pricingStartsAt: 'شروع قیمت از',
    },
    portfolio: {
      badge: 'نمونه پروژه‌ها',
      title: 'آثار برگزیده و نمونه کارهای شاخص آژانس',
      subtitle: 'نگاهی به هویت‌های بصری، سیستم‌های برندینگ و کمپین‌های تبلیغاتی موفق اخیر ما.',
      filterAll: 'همه پروژه‌ها',
      filterBranding: 'برندینگ کامل',
      filterLogo: 'طراحی نشان و لوگو',
      filterPoster: 'پوستر و تبلیغات',
      filterMotion: 'موشن گرافیک',
      filterProfile: 'پروفایل شرکتی',
      viewAllProjects: 'مشاهده همه پروژه‌ها',
      clientLabel: 'مشتری',
      yearLabel: 'سال',
      viewCaseStudy: 'بررسی جزئیات',
    },
    whatsapp: {
      badge: 'همکاری مستقیم و فوری',
      title: 'پروژه‌ای در ذهن دارید؟ بیایید با هم اثری استثنایی خلق کنیم.',
      subtitle: 'مستقیماً با مدیران خلاقیت هیله گرافیک در واتساپ گفتگو کنید. پاسخ سریع، مشاوره تخصصی و برآورد آسان بودجه.',
      ctaButton: 'سفارش در واتساپ',
      quickPromptsLabel: 'پیام‌های آماده جهت ارسال سریع:',
      prompt1: 'به یک هویت بصری و برندینگ کامل نیاز دارم',
      prompt2: 'می‌خواهم یک لوگوی اختصاصی و حرفه‌ای طراحی شود',
      prompt3: 'به پوسترهای تبلیغاتی مدرن برای کمپین شرکت نیاز دارم',
      prompt4: 'به یک کاتالوگ و پروفایل حرفه‌ای برای شرکتمان نیاز دارم',
      statusActive: 'استودیو آماده پاسخگویی',
      responseSpeed: 'معمولاً پاسخگویی در کمتر از ۱۵ دقیقه',
      numberConfigPrompt: 'شماره معتبر و فعال واتساپ هیله گرافیک',
    },
    footer: {
      brandBio: 'هیله گرافیک آژانس پیشرو دیزاین و تبلیغات است که هویت‌های ماندگار، انیمیشن‌های موشن گرافیک و ابزارهای تبلیغاتی استاندارد بین‌المللی خلق می‌کند.',
      quickLinks: 'دسترسی سریع',
      servicesTitle: 'خدمات تخصصی',
      contactTitle: 'ارتباط با استودیو',
      officeLabel: 'استودیوی خلاقیت',
      directChat: 'چت فوری در واتساپ',
      allRightsReserved: 'تمامی حقوق محفوظ است.',
      privacy: 'حریم خصوصی',
      terms: 'شرایط استفاده',
      configWhatsApp: 'تنظیم شماره واتساپ',
      adminPortal: 'پنل مدیریت',
    },
    admin: {
      portalTitle: 'ورود به پنل مدیریت',
      loginPasscodeLabel: 'کد عبور مدیر استودیو را وارد کنید',
      loginButton: 'ورود به استودیو مدیریت',
      invalidPasscode: 'رمز عبور وارد شده نادرست است.',
      overview: 'نمای کلی سیستم',
      servicesManager: 'خدمات و محصولات',
      portfolioManager: 'پروژه‌ها و نمونه‌کارها',
      menusManager: 'منوهای ناوبری',
      priceManager: 'پکیج‌های قیمت',
      clientsManager: 'مشتریان و شرکای تجاری',
      mediaLibrary: 'کتابخانه رسانه‌ها',
      settingsBrand: 'تنظیمات برند و پس‌زمینه',
      addService: 'افزودن خدمت جدید',
      editService: 'ویرایش خدمت',
      addProject: 'افزودن پروژه جدید',
      addMenuItem: 'افزودن لینک منو',
      uploadMedia: 'آپلود رسانه جدید',
      logoManager: 'لوگوی رسمی برند',
      uploadLogo: 'آپلود لوگوی رسمی هیله گرافیک',
      removeLogo: 'بازگشت به نشان پیش‌فرض هندسی',
      bgImageManager: 'سیستم تصویر پس‌زمینه صفحه اصلی',
      backToSite: 'بازگشت به وب‌سایت',
      resetDefaults: 'بازنشانی به پیش‌فرض استودیو',
      logout: 'خروج و قفل پنل',
      description: 'شرح کامل و جزئیات خدمت',
    },
    common: {
      loading: 'در حال بارگذاری هیله گرافیک...',
      skip: 'ورود به وب‌سایت',
      close: 'بستن',
      next: 'بعدی',
      previous: 'قبلی',
      share: 'اشتراک‌گذاری',
      linkCopied: 'لینک پروژه کپی شد!',
      copied: 'کپی شد!',
      backToSite: 'بازگشت به سایت',
      save: 'ذخیره',
      saveChanges: 'ذخیره تغییرات',
      saved: 'با موفقیت ذخیره شد!',
      cancel: 'انصراف',
      delete: 'حذف',
      edit: 'ویرایش',
      addNew: 'افزودن جدید',
      search: 'جستجو...',
    },
  },
};
