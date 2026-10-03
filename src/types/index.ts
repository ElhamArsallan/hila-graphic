export type Language = 'ps' | 'fa' | 'en';
export type Theme = 'light' | 'dark';
export type PageRoute = 'home' | 'services' | 'price-list' | 'about' | 'portfolio' | 'contact' | 'admin';

export interface ServiceItem {
  id: string;
  slug: string;
  number: string;
  title: Record<Language, string>;
  subtitle: Record<Language, string>;
  description: Record<Language, string>;
  deliverables: Record<Language, string[]>;
  tags: string[];
  gradient: string;
  accentColor: string;
  posterImage: string;
  galleryImages?: string[];
  samples?: { id?: string; url: string; title?: string; description?: string }[];
  videoUrl?: string;
  price?: string;
  featured: boolean;
  active?: boolean;
  order?: number;
  category?: string;
}

export interface PortfolioItem {
  id: string;
  slug?: string;
  title: Record<Language, string>;
  client: string;
  category: 'branding' | 'logo' | 'poster' | 'motion' | 'profile' | 'other' | string;
  year: string;
  image: string;
  galleryImages?: string[];
  samples?: { id?: string; url: string; title?: string; description?: string }[];
  videoUrl?: string;
  description: Record<Language, string>;
  tags: string[];
  featured: boolean;
  active?: boolean;
  order?: number;
  relatedService?: string;
}

export interface MenuItem {
  id: string;
  label: Record<Language, string>;
  path: PageRoute | string;
  order: number;
  active: boolean;
}

export interface BackgroundImageConfig {
  enabled: boolean;
  lightImageUrl: string;
  darkImageUrl: string;
  opacity: number; // 0 to 1
  blur: number; // 0 to 20
  overlayDarkness?: number; // 0 to 1
}

export interface CustomLogoConfig {
  customLogoUrl: string | null;
  lightLogoUrl?: string | null;
  darkLogoUrl?: string | null;
  faviconUrl?: string | null;
  width: number;
  scale?: number;
}

export interface PricePackage {
  id: string;
  name: Record<Language, string>;
  tagline: Record<Language, string>;
  price: string;
  period: Record<Language, string>;
  features: Record<Language, string[]>;
  popular: boolean;
  active: boolean;
  order: number;
}

export interface ClientItem {
  id: string;
  name: string;
  logoUrl: string;
  industry: Record<Language, string>;
  featured: boolean;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'logo';
  createdAt: string;
  size?: string;
}

export interface HeroConfig {
  badge: Record<Language, string>;
  headlinePart1: Record<Language, string>;
  headlineAccent: Record<Language, string>;
  headlinePart2: Record<Language, string>;
  description: Record<Language, string>;
  primaryCta: Record<Language, string>;
  secondaryCta: Record<Language, string>;
}

export interface AboutConfig {
  badge: Record<Language, string>;
  title: Record<Language, string>;
  previewText: Record<Language, string>;
  fullStory1: Record<Language, string>;
  fullStory2: Record<Language, string>;
  agencyCardTitle: Record<Language, string>;
  agencyCardDesc: Record<Language, string>;
}

export interface FounderProfile {
  photoUrl: string;
  cvUrl: string;
  fullName: Record<Language, string>;
  title: Record<Language, string>;
  introduction: Record<Language, string>;
  professionalInformation: { label: Record<Language, string>; value: Record<Language, string> }[];
  additionalInformation: Record<Language, string>;
}

export interface SiteConfig {
  brandName: string;
  brandTagline: Record<Language, string>;
  whatsappNumber: string; // e.g. "+93799123456"
  phoneDisplay: string;
  email: string;
  address: Record<Language, string>;
  socialLinks: {
    platform: string;
    url: string;
    label: string;
  }[];
  stats: {
    satisfaction: string;
    experienceYears: string;
    completedProjects: string;
    activeClients: string;
  };
  customLogo: CustomLogoConfig;
  backgroundImage: BackgroundImageConfig;
  hero: HeroConfig;
  about: AboutConfig;
  founderProfile: FounderProfile;
}
