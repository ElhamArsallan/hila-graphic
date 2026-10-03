import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  LayoutDashboard,
  Layers,
  Briefcase,
  Menu as MenuIcon,
  DollarSign,
  Users,
  Image as ImageIcon,
  Settings,
  Plus,
  Trash2,
  Edit2,
  Save,
  Check,
  X,
  Upload,
  ArrowLeft,
  ExternalLink,
  MessageCircle,
  RefreshCw,
  LogOut,
  Sparkles,
  Eye,
  Sliders,
  ShieldCheck,
  Copy,
  AlertCircle,
  Download,
  KeyRound,
  Shield,
  Crown,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useSiteConfig } from '../../context/SiteConfigContext';
import { Logo } from '../common/Logo';
import { ServiceItem, PortfolioItem, MenuItem, PricePackage, ClientItem, MediaItem, Language, FounderProfile } from '../../types';
import { downloadWebsiteZip, downloadReadyToHostZip } from '../../utils/downloadZip';
import { IMAGE_SPECS, formatImageSpec, getRatioWarning, readImageDimensions } from '../../utils/imageSpecs';
import { GalleryManager } from './GalleryManager';

interface AdminDashboardProps {
  onClose: () => void;
}

type AdminTab = 'overview' | 'services' | 'portfolio' | 'menus' | 'pricing' | 'clients' | 'founder' | 'media' | 'settings' | 'security';
const founderAdminText = {
  en: { tab: 'Founder / Leadership', description: 'Manage the profile shown in the public Founder section.', photo: 'Founder photo', noPhoto: 'No founder photo uploaded.', uploadPhoto: 'Upload Photo', replacePhoto: 'Replace Photo', removePhoto: 'Remove Photo', cv: 'Founder CV', noCv: 'No CV uploaded.', uploadCv: 'Upload CV', replaceCv: 'Replace CV', removeCv: 'Remove CV', name: 'Full name', title: 'Position / title', biography: 'Short biography / introduction', professional: 'Professional information', label: 'Information label', value: 'Information', additional: 'Additional information', addInformation: 'Add information row', remove: 'Remove', save: 'Save Changes', saved: 'Founder profile saved.', photoReady: 'Photo uploaded. Save to publish it.', cvReady: 'CV uploaded. Save to publish it.', uploadFailed: 'Upload failed. Please try again.', languages: { en: 'English', ps: 'Pashto', fa: 'Dari' } },
  ps: { tab: 'بنسټګر / مشرتابه', description: 'د عامه بنسټګر برخې پېژندپاڼه اداره کړئ.', photo: 'د بنسټګر انځور', noPhoto: 'د بنسټګر انځور نه دی پورته شوی.', uploadPhoto: 'انځور پورته کړئ', replacePhoto: 'انځور بدل کړئ', removePhoto: 'انځور لرې کړئ', cv: 'د بنسټګر سي وي', noCv: 'سي وي نه دی پورته شوی.', uploadCv: 'سي وي پورته کړئ', replaceCv: 'سي وي بدل کړئ', removeCv: 'سي وي لرې کړئ', name: 'بشپړ نوم', title: 'دنده / عنوان', biography: 'لنډه پېژندنه', professional: 'مسلکي معلومات', label: 'د معلوماتو سرلیک', value: 'معلومات', additional: 'اضافي معلومات', addInformation: 'د معلوماتو قطار زیات کړئ', remove: 'لرې کړئ', save: 'بدلونونه خوندي کړئ', saved: 'د بنسټګر پېژندپاڼه خوندي شوه.', photoReady: 'انځور پورته شو. د خپرولو لپاره یې خوندي کړئ.', cvReady: 'سي وي پورته شو. د خپرولو لپاره یې خوندي کړئ.', uploadFailed: 'پورته کول ناکام شول. بیا هڅه وکړئ.', languages: { en: 'انګلیسي', ps: 'پښتو', fa: 'دري' } },
  fa: { tab: 'بنیان‌گذار / رهبری', description: 'پروفایل بخش عمومی بنیان‌گذار را مدیریت کنید.', photo: 'تصویر بنیان‌گذار', noPhoto: 'تصویری بارگذاری نشده است.', uploadPhoto: 'بارگذاری تصویر', replacePhoto: 'جایگزینی تصویر', removePhoto: 'حذف تصویر', cv: 'رزومه بنیان‌گذار', noCv: 'رزومه‌ای بارگذاری نشده است.', uploadCv: 'بارگذاری رزومه', replaceCv: 'جایگزینی رزومه', removeCv: 'حذف رزومه', name: 'نام کامل', title: 'سمت / عنوان', biography: 'معرفی کوتاه', professional: 'اطلاعات حرفه‌ای', label: 'عنوان اطلاعات', value: 'اطلاعات', additional: 'اطلاعات تکمیلی', addInformation: 'افزودن ردیف اطلاعات', remove: 'حذف', save: 'ذخیره تغییرات', saved: 'پروفایل بنیان‌گذار ذخیره شد.', photoReady: 'تصویر بارگذاری شد. برای انتشار ذخیره کنید.', cvReady: 'رزومه بارگذاری شد. برای انتشار ذخیره کنید.', uploadFailed: 'بارگذاری انجام نشد. دوباره تلاش کنید.', languages: { en: 'انگلیسی', ps: 'پشتو', fa: 'دری' } },
} satisfies Record<Language, {
  tab: string; description: string; photo: string; noPhoto: string; uploadPhoto: string; replacePhoto: string; removePhoto: string; cv: string; noCv: string; uploadCv: string; replaceCv: string; removeCv: string; name: string; title: string; biography: string; professional: string; label: string; value: string; additional: string; addInformation: string; remove: string; save: string; saved: string; photoReady: string; cvReady: string; uploadFailed: string; languages: Record<Language, string>;
}>;

interface AdminSecurityStatus {
  authenticated: boolean;
  sessionCreatedAt: number;
  sessionExpiresAt: number;
  activeSessions: number;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const { language, t, isRtl } = useLanguage();
  const {
    config,
    updateConfig,
    uploadFile,
    updateWhatsAppNumber,
    updateBackgroundImage,
    uploadCustomLogo,
    removeCustomLogo,
    uploadLightLogo,
    uploadDarkLogo,
    removeLightLogo,
    removeDarkLogo,
    uploadFavicon,
    removeFavicon,
    updateLogoScale,
    menuItems,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    services,
    addService,
    updateService,
    deleteService,
    portfolio,
    addPortfolio,
    updatePortfolio,
    deletePortfolio,
    pricePackages,
    addPricePackage,
    updatePricePackage,
    deletePricePackage,
    clients,
    addClient,
    updateClient,
    deleteClient,
    mediaLibrary,
    addMediaItem,
    deleteMediaItem,
    logoutAdmin,
    resetToDefaults,
  } = useSiteConfig();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [securityStatus, setSecurityStatus] = useState<AdminSecurityStatus | null>(null);
  const [securityError, setSecurityError] = useState<string | null>(null);
  const [securityBusy, setSecurityBusy] = useState(false);
  const [passwordFields, setPasswordFields] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  const [founderDraft, setFounderDraft] = useState<FounderProfile>(config.founderProfile);
  const [founderLanguage, setFounderLanguage] = useState<Language>(language);
  const [founderUploadBusy, setFounderUploadBusy] = useState<'photo' | 'cv' | null>(null);
  const [founderError, setFounderError] = useState<string | null>(null);
  const [detectedDimensions, setDetectedDimensions] = useState<Record<string, { width: number; height: number }>>({});

  // Local state for editing modals/drawers
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isCreatingService, setIsCreatingService] = useState(false);

  const [editingPortfolio, setEditingPortfolio] = useState<PortfolioItem | null>(null);
  const [isCreatingPortfolio, setIsCreatingPortfolio] = useState(false);

  const [editingMenu, setEditingMenu] = useState<MenuItem | null>(null);
  const [isCreatingMenu, setIsCreatingMenu] = useState(false);

  const [editingPrice, setEditingPrice] = useState<PricePackage | null>(null);
  const [isCreatingPrice, setIsCreatingPrice] = useState(false);

  const [editingClient, setEditingClient] = useState<ClientItem | null>(null);
  const [isCreatingClient, setIsCreatingClient] = useState(false);

  // Media upload input refs
  const logoFileRef = useRef<HTMLInputElement | null>(null);
  const lightLogoFileRef = useRef<HTMLInputElement | null>(null);
  const darkLogoFileRef = useRef<HTMLInputElement | null>(null);
  const faviconFileRef = useRef<HTMLInputElement | null>(null);
  const bgLightFileRef = useRef<HTMLInputElement | null>(null);
  const bgDarkFileRef = useRef<HTMLInputElement | null>(null);
  const mediaFileRef = useRef<HTMLInputElement | null>(null);
  const founderPhotoFileRef = useRef<HTMLInputElement | null>(null);
  const founderCvFileRef = useRef<HTMLInputElement | null>(null);

  // Google Drive & remote import state
  const [importUrl, setImportUrl] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  const showToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 3000);
  };

  const handleImageSelection = async (file: File, specKey: keyof typeof IMAGE_SPECS) => {
    try {
      const dimensions = await readImageDimensions(file);
      setDetectedDimensions((prev) => ({ ...prev, [specKey]: dimensions }));
      const spec = IMAGE_SPECS[specKey];
      const warning = getRatioWarning(spec, dimensions.width, dimensions.height);
      if (warning && !window.confirm(`${warning}\n\nContinue upload anyway?`)) {
        return false;
      }
    } catch {
      // Ignore dimension read failures; the upload still proceeds.
    }
    return true;
  };

  const renderImageSpec = (specKey: keyof typeof IMAGE_SPECS) => {
    const spec = IMAGE_SPECS[specKey];
    const detected = detectedDimensions[specKey];
    return (
      <div className="rounded-xl border border-black/10 bg-black/[0.02] px-2.5 py-2 text-[10px] text-zinc-600 dark:border-white/10 dark:bg-white/[0.02] dark:text-zinc-300">
        <div className="font-bold text-zinc-800 dark:text-zinc-100">Recommended: {formatImageSpec(spec)}</div>
        <div>Aspect Ratio: {spec.aspectRatio}</div>
        <div>Minimum: {spec.minimumWidth} × {spec.minimumHeight}px</div>
        <div>Max File Size: {spec.maxFileSizeMb} MB</div>
        <div>Formats: {spec.formats.join(', ')}</div>
        {detected ? <div className="mt-1 font-medium text-[#FF5E1E]">Detected: {detected.width} × {detected.height}px</div> : <div className="mt-1 text-zinc-500">Detected after selecting a file</div>}
      </div>
    );
  };

  const updateSocialProfileUrl = (platform: 'Instagram' | 'Facebook', url: string) => {
    const existingLink = config.socialLinks.find((item) => item.platform.toLowerCase() === platform.toLowerCase());
    const socialLinks = existingLink
      ? config.socialLinks.map((item) => item === existingLink ? { ...item, url, label: platform } : item)
      : [...config.socialLinks, { platform, url, label: platform }];
    updateConfig({ socialLinks });
  };

  useEffect(() => {
    setFounderDraft(config.founderProfile);
  }, [config.founderProfile]);

  const founderText = founderAdminText[language];
  const uploadFounderAsset = async (kind: 'photo' | 'cv', file: File) => {
    setFounderUploadBusy(kind);
    setFounderError(null);
    try {
      const uploaded = await uploadFile(file, undefined, kind === 'photo' ? 'founder' : 'documents');
      setFounderDraft((current) => kind === 'photo'
        ? { ...current, photoUrl: uploaded.url }
        : { ...current, cvUrl: uploaded.url });
      showToast(kind === 'photo' ? founderText.photoReady : founderText.cvReady);
    } catch (error) {
      setFounderError(error instanceof Error ? error.message : founderText.uploadFailed);
    } finally {
      setFounderUploadBusy(null);
    }
  };

  // Handle local image file upload into data URL
  const handleFileUpload = (file: File, callback: (dataUrl: string) => void) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') {
        callback(e.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const getCsrfToken = () => {
    const match = document.cookie.match(/(?:^|; )hila_admin_csrf=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
  };

  const loadSecurityStatus = async () => {
    const response = await fetch('/api/admin/security', { credentials: 'same-origin' });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || 'Unable to load security status.');
    setSecurityStatus(data as AdminSecurityStatus);
  };

  const sendSecurityRequest = async (url: string, body: Record<string, string>) => {
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': getCsrfToken() },
      body: JSON.stringify(body),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || 'Security request failed.');
    return data;
  };

  useEffect(() => {
    if (activeTab !== 'security') return;
    let active = true;
    setSecurityError(null);
    loadSecurityStatus().catch((error: unknown) => {
      if (active) setSecurityError(error instanceof Error ? error.message : 'Unable to load security status.');
    });
    return () => { active = false; };
  }, [activeTab]);

  // Upload to backend disk /api/upload with fallback to data URL
  const uploadFileToServer = async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'X-CSRF-Token': getCsrfToken() },
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        if (data.url) return data.url;
      }
    } catch {
      // Fallback
    }
    return new Promise((resolve) => {
      handleFileUpload(file, (dataUrl) => resolve(dataUrl));
    });
  };

  // Google Drive or remote asset importer
  const handleImportMedia = async (targetUrl: string) => {
    if (!targetUrl.trim()) return;
    setIsImporting(true);
    try {
      const res = await fetch('/api/drive/import', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': getCsrfToken(),
        },
        body: JSON.stringify({ url: targetUrl.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          addMediaItem({
            name: data.filename || 'Cloud Imported Asset',
            url: data.url,
            type: 'image',
            size: data.size ? `${(data.size / 1024 / 1024).toFixed(1)} MB` : 'Remote',
          });
          showToast('Media imported to server library successfully.');
          setImportUrl('');
          return;
        }
      }
      // If server import couldn't fetch directly, save URL directly
      addMediaItem({
        name: 'Remote Asset',
        url: targetUrl.trim(),
        type: 'image',
        size: 'External',
      });
      showToast('Remote link saved to media library.');
      setImportUrl('');
    } catch {
      addMediaItem({
        name: 'Remote Asset',
        url: targetUrl.trim(),
        type: 'image',
        size: 'External',
      });
      showToast('Remote link saved to media library.');
      setImportUrl('');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#F4F4F8] dark:bg-[#0A0B0E] text-zinc-900 dark:text-zinc-100 flex flex-col overflow-hidden font-sans">
      
      {/* Toast Notification */}
      {saveToast && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-emerald-600 text-white text-xs font-semibold shadow-xl flex items-center gap-2"
        >
          <Check className="w-4 h-4" />
          <span>{saveToast}</span>
        </motion.div>
      )}

      {/* Top Admin Navigation Header */}
      <header className="flex-shrink-0 h-16 border-b border-black/[0.08] dark:border-white/[0.08] bg-white/80 dark:bg-[#12131A]/80 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between z-30">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 text-xs font-semibold text-zinc-700 dark:text-zinc-200 transition-colors"
          >
            <ArrowLeft className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
            <span>{t.admin.backToSite}</span>
          </button>

          <div className="h-4 w-px bg-black/10 dark:bg-white/10 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5E1E] animate-pulse" />
            <span className="font-display font-extrabold text-sm tracking-tight">
              HILA GRAPHIC • CMS STUDIO
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={resetToDefaults}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500/10 text-xs font-medium transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            <span>{t.admin.resetDefaults}</span>
          </button>

          <button
            onClick={async () => {
              await logoutAdmin();
              onClose();
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-xs font-semibold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t.admin.logout}</span>
          </button>
        </div>
      </header>

      {/* Main Admin Workspace: Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Vertical Tab Navigation */}
        <aside className="w-20 sm:w-60 flex-shrink-0 border-r border-black/[0.08] dark:border-white/[0.08] bg-white/50 dark:bg-[#0E0F14]/50 backdrop-blur-md p-3 sm:p-4 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-1">
            {[
              { id: 'overview', label: t.admin.overview, icon: LayoutDashboard },
              { id: 'services', label: t.admin.servicesManager, icon: Layers },
              { id: 'portfolio', label: t.admin.portfolioManager, icon: Briefcase },
              { id: 'menus', label: t.admin.menusManager, icon: MenuIcon },
              { id: 'pricing', label: t.admin.priceManager, icon: DollarSign },
              { id: 'clients', label: t.admin.clientsManager, icon: Users },
              { id: 'founder', label: founderText.tab, icon: Crown },
              { id: 'media', label: t.admin.mediaLibrary, icon: ImageIcon },
              { id: 'settings', label: t.admin.settingsBrand, icon: Settings },
              { id: 'security', label: 'Security Management', icon: Shield },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as AdminTab)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-start
                    ${isActive
                      ? 'bg-[#FF5E1E] text-white shadow-md'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white'
                    }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden sm:inline truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="p-3 rounded-2xl bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06] text-[11px] text-zinc-500 text-center hidden sm:block">
            <div className="font-semibold text-zinc-700 dark:text-zinc-300">Live Synchronized</div>
            <div className="text-[10px] text-zinc-400 mt-0.5">Changes sync to the configured backend.</div>
          </div>
        </aside>

        {/* Right Scrollable Tab Content View */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 overscroll-contain">
          <div className="max-w-5xl mx-auto pb-16">
            
            {/* 1. OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-6 text-start">
                <div>
                  <h2 className="font-display text-2xl font-bold text-zinc-900 dark:text-white">
                    {t.admin.overview}
                  </h2>
                  <p className="text-xs text-zinc-500 mt-1">
                    System overview and active digital assets for Hila Graphic.
                  </p>
                </div>

                {/* Metrics Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl liquid-glass border border-white/80 dark:border-white/15">
                    <div className="text-xs text-zinc-500 font-medium">Active Services</div>
                    <div className="font-display text-2xl font-extrabold text-[#FF5E1E] mt-1">
                      {services.filter(s => s.active !== false).length}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl liquid-glass border border-white/80 dark:border-white/15">
                    <div className="text-xs text-zinc-500 font-medium">Portfolio Items</div>
                    <div className="font-display text-2xl font-extrabold text-zinc-900 dark:text-white mt-1">
                      {portfolio.length}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl liquid-glass border border-white/80 dark:border-white/15">
                    <div className="text-xs text-zinc-500 font-medium">Price Packages</div>
                    <div className="font-display text-2xl font-extrabold text-zinc-900 dark:text-white mt-1">
                      {pricePackages.length}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl liquid-glass border border-white/80 dark:border-white/15">
                    <div className="text-xs text-zinc-500 font-medium">Media Assets</div>
                    <div className="font-display text-2xl font-extrabold text-zinc-900 dark:text-white mt-1">
                      {mediaLibrary.length}
                    </div>
                  </div>
                </div>

                {/* Brand Logo & Background Status Card */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 rounded-2xl liquid-glass border border-white/80 dark:border-white/15 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-200">
                        Current Brand Logo
                      </h4>
                      <button
                        onClick={() => setActiveTab('settings')}
                        className="text-xs text-[#FF5E1E] hover:underline font-semibold"
                      >
                        Manage
                      </button>
                    </div>

                    <div className="p-4 rounded-xl bg-black/[0.03] dark:bg-white/[0.05] border border-black/5 dark:border-white/10 flex items-center justify-center min-h-[90px]">
                      <Logo size="lg" />
                    </div>

                    <div className="text-xs text-zinc-500">
                      {config.customLogo?.customLogoUrl
                        ? 'Custom uploaded official logo is currently active.'
                        : 'Using built-in official geometric vector mark.'}
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl liquid-glass border border-white/80 dark:border-white/15 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-200">
                        Home Background System
                      </h4>
                      <button
                        onClick={() => setActiveTab('settings')}
                        className="text-xs text-[#FF5E1E] hover:underline font-semibold"
                      >
                        Configure
                      </button>
                    </div>

                    <div className="p-4 rounded-xl bg-black/[0.03] dark:bg-white/[0.05] border border-black/5 dark:border-white/10 flex items-center justify-between text-xs">
                      <span>Status:</span>
                      <span className={`font-semibold ${config.backgroundImage?.enabled ? 'text-emerald-500' : 'text-zinc-400'}`}>
                        {config.backgroundImage?.enabled ? 'Custom Image Active' : 'Atmospheric Gradient Active'}
                      </span>
                    </div>

                    <div className="text-xs text-zinc-500">
                      Automatic high-readability overlay ensures 100% WCAG AA text contrast.
                    </div>
                  </div>
                </div>

                {/* Full Website ZIP Download & Export Card */}
                <div className="p-6 rounded-2xl bg-gradient-to-r from-[#FF5E1E]/15 via-orange-500/10 to-transparent border border-[#FF5E1E]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-sm">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#FF5E1E] text-white uppercase tracking-wider">
                        Full Website (.ZIP)
                      </span>
                      <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 bg-black/5 dark:bg-white/10 px-2 py-0.5 rounded-md">
                        Application Source + Packaged Public Assets
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-zinc-900 dark:text-white">
                      Download Your Complete Full Website
                    </h4>
                    <p className="text-xs text-zinc-600 dark:text-zinc-300 max-w-2xl leading-relaxed">
                      Includes application source, build configuration, and public assets packaged with this server. PostgreSQL CMS data and object-storage media are backed up through their providers, not this ZIP.
                    </p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-zinc-500 dark:text-zinc-400 pt-1">
                      <span className="flex items-center gap-1">✓ Complete Source Code</span>
                      <span className="flex items-center gap-1">✓ All Uploaded Media</span>
                      <span className="flex items-center gap-1">✓ Saved CMS Settings</span>
                      <span className="flex items-center gap-1">✓ Express Backend</span>
                      <span className="flex items-center gap-1">✓ README Documentation</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => downloadWebsiteZip()}
                    className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-[#FF5E1E] hover:bg-[#E84D0E] text-white text-xs font-bold transition-all shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex-shrink-0"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Full Website (.ZIP)</span>
                  </button>
                </div>

                {/* Ready-to-Host Bundle Card */}
                <div className="p-5 rounded-2xl liquid-glass border border-black/10 dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white uppercase tracking-wider">
                        Pre-Compiled Static
                      </span>
                      <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                        Ready-to-Host Website (.ZIP)
                      </div>
                    </div>
                    <div className="text-xs text-zinc-500 max-w-xl">
                      Already compiled into HTML, CSS, and JS. Upload directly to cPanel (<code className="font-mono">public_html</code>), Netlify, Vercel, or Hostinger without needing Node.js or terminal commands. Includes pre-configured <code className="font-mono">.htaccess</code> and routing.
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => downloadReadyToHostZip()}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-[#FF5E1E] hover:text-white text-zinc-800 dark:text-zinc-200 text-xs font-semibold transition-all cursor-pointer flex-shrink-0"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Ready-to-Host (.ZIP)</span>
                  </button>
                </div>

                {/* WhatsApp Quick Dispatch Test */}
                <div className="p-5 rounded-2xl liquid-glass border border-white/80 dark:border-white/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-200">
                      Active WhatsApp Target Number
                    </div>
                    <div className="font-mono text-base font-bold text-[#FF5E1E] mt-0.5">
                      {config.whatsappNumber}
                    </div>
                    <div className="text-xs text-zinc-500 mt-0.5">
                      All customer inquiry buttons across the site link directly to this number.
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('settings')}
                    className="px-4 py-2 rounded-xl bg-[#FF5E1E] text-white text-xs font-bold hover:bg-[#E84D0E] transition-colors"
                  >
                    Change Number
                  </button>
                </div>
              </div>
            )}

            {/* 2. SERVICES MANAGER TAB */}
            {activeTab === 'services' && (
              <div className="space-y-6 text-start">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="font-display text-2xl font-bold text-zinc-900 dark:text-white">
                      {t.admin.servicesManager}
                    </h2>
                    <p className="text-xs text-zinc-500 mt-1">
                      Manage the 5 core fixed categories and dynamic services (Roll-up, Brochure, Flyer, Business Card, Packaging, etc.).
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setIsCreatingService(true);
                      setEditingService({
                        id: `service-${Date.now()}`,
                        slug: `new-service-${Date.now()}`,
                        number: String(services.length + 1).padStart(2, '0'),
                        title: { en: 'New Service', ps: 'نوی خدمت', fa: 'خدمت جدید' },
                        subtitle: { en: 'Service tagline and scope summary', ps: 'د خدمت لنډیز', fa: 'خلاصه خدمت' },
                        description: { en: 'Comprehensive service description', ps: 'د خدمت تفصیلي معلومات', fa: 'توضیحات جامع' },
                        deliverables: { en: ['Deliverable 1', 'Deliverable 2'], ps: ['تحویلي ۱', 'تحویلي ۲'], fa: ['تحویل ۱', 'تحویل ۲'] },
                        tags: ['Design', 'Commercial'],
                        gradient: 'from-orange-500/10 via-amber-500/5 to-transparent',
                        accentColor: '#FF5E1E',
                        posterImage: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=1200&auto=format&fit=crop',
                        active: true,
                        featured: true,
                      });
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF5E1E] text-white text-xs font-bold hover:bg-[#E84D0E] transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{t.admin.addService}</span>
                  </button>
                </div>

                {/* Services List Table / Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.map((svc) => (
                    <div
                      key={svc.id}
                      className="p-4 rounded-2xl liquid-glass border border-white/80 dark:border-white/15 flex flex-col justify-between gap-4"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={svc.posterImage}
                          alt={svc.title.en}
                          className="w-16 h-16 rounded-xl object-cover flex-shrink-0 bg-zinc-900"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-[#FF5E1E]">{svc.number}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 uppercase font-semibold">
                              {svc.tags?.[0] || 'Service'}
                            </span>
                          </div>
                          <h4 className="font-display text-base font-bold truncate mt-0.5">
                            {svc.title[language] || svc.title.en}
                          </h4>
                          <p className="text-xs text-zinc-500 line-clamp-2 mt-0.5">
                            {svc.subtitle[language] || svc.subtitle.en}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-black/5 dark:border-white/10 text-xs">
                        <span className={`font-semibold ${svc.active !== false ? 'text-emerald-500' : 'text-zinc-400'}`}>
                          {svc.active !== false ? '● Active' : '○ Disabled'}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setIsCreatingService(false);
                              setEditingService(svc);
                            }}
                            className="p-1.5 rounded-lg bg-black/5 dark:bg-white/10 hover:bg-[#FF5E1E] hover:text-white transition-colors"
                            title="Edit Service"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete "${svc.title.en}"?`)) {
                                deleteService(svc.id);
                                showToast('Service removed.');
                              }
                            }}
                            className="p-1.5 rounded-lg bg-black/5 dark:bg-white/10 hover:bg-red-500 hover:text-white transition-colors text-red-500"
                            title="Delete Service"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Service Edit / Add Modal */}
                {editingService && (
                  <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
                    <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl liquid-glass border border-white/80 dark:border-white/15 p-6 overflow-hidden">
                      <div className="flex items-center justify-between pb-4 border-b border-black/10 dark:border-white/10 mb-4">
                        <h3 className="font-display text-lg font-bold">
                          {isCreatingService ? t.admin.addService : t.admin.editService}
                        </h3>
                        <button
                          onClick={() => setEditingService(null)}
                          className="p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
                        {/* Poster Image URL */}
                        <div>
                          <label className="block font-bold mb-1">Poster Image URL</label>
                          <input
                            type="text"
                            value={editingService.posterImage}
                            onChange={(e) => setEditingService({ ...editingService, posterImage: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15 text-xs font-mono"
                          />
                        </div>

                        {/* Title in 3 languages */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block font-semibold mb-1">Title (English)</label>
                            <input
                              type="text"
                              value={editingService.title.en}
                              onChange={(e) => setEditingService({ ...editingService, title: { ...editingService.title, en: e.target.value } })}
                              className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15"
                            />
                          </div>
                          <div>
                            <label className="block font-semibold mb-1">Title (Pashto)</label>
                            <input
                              type="text"
                              dir="rtl"
                              value={editingService.title.ps}
                              onChange={(e) => setEditingService({ ...editingService, title: { ...editingService.title, ps: e.target.value } })}
                              className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15"
                            />
                          </div>
                          <div>
                            <label className="block font-semibold mb-1">Title (Dari)</label>
                            <input
                              type="text"
                              dir="rtl"
                              value={editingService.title.fa}
                              onChange={(e) => setEditingService({ ...editingService, title: { ...editingService.title, fa: e.target.value } })}
                              className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15"
                            />
                          </div>
                        </div>

                        {/* Subtitle in 3 languages */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block font-semibold mb-1">Subtitle (English)</label>
                            <textarea
                              rows={2}
                              value={editingService.subtitle.en}
                              onChange={(e) => setEditingService({ ...editingService, subtitle: { ...editingService.subtitle, en: e.target.value } })}
                              className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15"
                            />
                          </div>
                          <div>
                            <label className="block font-semibold mb-1">Subtitle (Pashto)</label>
                            <textarea
                              rows={2}
                              dir="rtl"
                              value={editingService.subtitle.ps}
                              onChange={(e) => setEditingService({ ...editingService, subtitle: { ...editingService.subtitle, ps: e.target.value } })}
                              className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15"
                            />
                          </div>
                          <div>
                            <label className="block font-semibold mb-1">Subtitle (Dari)</label>
                            <textarea
                              rows={2}
                              dir="rtl"
                              value={editingService.subtitle.fa}
                              onChange={(e) => setEditingService({ ...editingService, subtitle: { ...editingService.subtitle, fa: e.target.value } })}
                              className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15"
                            />
                          </div>
                        </div>

                        {/* Full Description in 3 languages */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block font-semibold mb-1">Full Story (English)</label>
                            <textarea
                              rows={3}
                              value={editingService.description.en}
                              onChange={(e) => setEditingService({ ...editingService, description: { ...editingService.description, en: e.target.value } })}
                              className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15"
                            />
                          </div>
                          <div>
                            <label className="block font-semibold mb-1">Full Story (Pashto)</label>
                            <textarea
                              rows={3}
                              dir="rtl"
                              value={editingService.description.ps}
                              onChange={(e) => setEditingService({ ...editingService, description: { ...editingService.description, ps: e.target.value } })}
                              className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15"
                            />
                          </div>
                          <div>
                            <label className="block font-semibold mb-1">Full Story (Dari)</label>
                            <textarea
                              rows={3}
                              dir="rtl"
                              value={editingService.description.fa}
                              onChange={(e) => setEditingService({ ...editingService, description: { ...editingService.description, fa: e.target.value } })}
                              className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15"
                            />
                          </div>
                        </div>

                        {/* Deliverables (Comma separated for English) */}
                        <div>
                          <label className="block font-semibold mb-1">Deliverables (Comma separated)</label>
                          <input
                            type="text"
                            value={editingService.deliverables.en.join(', ')}
                            onChange={(e) => {
                              const arr = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                              setEditingService({
                                ...editingService,
                                deliverables: {
                                  ...editingService.deliverables,
                                  en: arr,
                                  ps: editingService.deliverables.ps.length ? editingService.deliverables.ps : arr,
                                  fa: editingService.deliverables.fa.length ? editingService.deliverables.fa : arr,
                                },
                              });
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15 text-xs"
                          />
                        </div>

                        {/* Video URL and Starting Price */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                          <div>
                            <label className="block font-semibold mb-1">Video Demo URL (MP4 / Stream)</label>
                            <input
                              type="text"
                              value={editingService.videoUrl || ''}
                              onChange={(e) => setEditingService({ ...editingService, videoUrl: e.target.value })}
                              placeholder="https://..."
                              className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15"
                            />
                          </div>
                          <div>
                            <label className="block font-semibold mb-1">Price / Fee (e.g. Starting from $99)</label>
                            <input
                              type="text"
                              value={editingService.price || ''}
                              onChange={(e) => setEditingService({ ...editingService, price: e.target.value })}
                              placeholder="Starting from $99"
                              className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15"
                            />
                          </div>
                        </div>

                        {/* Service Samples / Gallery Management (Unlimited samples with upload, library picker, and reorder) */}
                        <GalleryManager
                          label="Service Gallery Samples"
                          images={editingService.galleryImages || []}
                          onChange={(newImgs) => setEditingService({ ...editingService, galleryImages: newImgs })}
                          mediaLibrary={mediaLibrary}
                          onUploadFile={uploadFileToServer}
                          onAddMediaItem={addMediaItem}
                        />

                        {/* Toggles: Featured & Active */}
                        <div className="flex items-center gap-4 pt-2">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={editingService.featured !== false}
                              onChange={(e) => setEditingService({ ...editingService, featured: e.target.checked })}
                              className="rounded accent-[#FF5E1E]"
                            />
                            <span className="font-semibold text-xs">Featured in Home Showcase</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={editingService.active !== false}
                              onChange={(e) => setEditingService({ ...editingService, active: e.target.checked })}
                              className="rounded accent-[#FF5E1E]"
                            />
                            <span className="font-semibold text-xs">Active Service</span>
                          </label>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-3 pt-4 border-t border-black/10 dark:border-white/10 mt-4">
                        <button
                          onClick={() => setEditingService(null)}
                          className="px-4 py-2 rounded-xl bg-black/5 dark:bg-white/10 text-xs font-semibold"
                        >
                          {t.common.cancel}
                        </button>
                        <button
                          onClick={() => {
                            if (isCreatingService) {
                              addService(editingService);
                              showToast('New service added.');
                            } else {
                              updateService(editingService.id, editingService);
                              showToast('Service updated.');
                            }
                            setEditingService(null);
                          }}
                          className="px-5 py-2 rounded-xl bg-[#FF5E1E] text-white text-xs font-bold hover:bg-[#E84D0E]"
                        >
                          {t.common.save}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 3. PORTFOLIO TAB */}
            {activeTab === 'portfolio' && (
              <div className="space-y-6 text-start">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="font-display text-2xl font-bold text-zinc-900 dark:text-white">
                      {t.admin.portfolioManager}
                    </h2>
                    <p className="text-xs text-zinc-500 mt-1">
                      Add, update or remove agency client projects and case studies.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setIsCreatingPortfolio(true);
                      setEditingPortfolio({
                        id: `proj-${Date.now()}`,
                        title: { en: 'New Case Study', ps: 'نوې پروژه', fa: 'پروژه جدید' },
                        client: 'Client Name',
                        category: 'branding',
                        year: '2025',
                        image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1200&auto=format&fit=crop',
                        description: { en: 'Project outcome and scope', ps: 'د پروژې تفصیل', fa: 'شرح پروژه' },
                        tags: ['Branding', 'Advertising'],
                        featured: true,
                      });
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF5E1E] text-white text-xs font-bold hover:bg-[#E84D0E] transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{t.admin.addProject}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {portfolio.map((proj) => (
                    <div
                      key={proj.id}
                      className="p-4 rounded-2xl liquid-glass border border-white/80 dark:border-white/15 flex flex-col justify-between gap-4"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={proj.image}
                          alt={proj.title.en}
                          className="w-20 h-16 rounded-xl object-cover flex-shrink-0 bg-zinc-900"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] text-zinc-400 uppercase font-semibold">
                            {proj.client} • {proj.year}
                          </div>
                          <h4 className="font-display text-sm font-bold truncate mt-0.5">
                            {proj.title[language] || proj.title.en}
                          </h4>
                          <p className="text-xs text-zinc-500 line-clamp-2 mt-0.5">
                            {proj.description[language] || proj.description.en}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-3 border-t border-black/5 dark:border-white/10">
                        <button
                          onClick={() => {
                            setIsCreatingPortfolio(false);
                            setEditingPortfolio(proj);
                          }}
                          className="p-1.5 rounded-lg bg-black/5 dark:bg-white/10 hover:bg-[#FF5E1E] hover:text-white transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete project "${proj.title.en}"?`)) {
                              deletePortfolio(proj.id);
                              showToast('Project deleted.');
                            }
                          }}
                          className="p-1.5 rounded-lg bg-black/5 dark:bg-white/10 hover:bg-red-500 hover:text-white transition-colors text-red-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Portfolio Edit Modal */}
                {editingPortfolio && (
                  <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
                    <div className="relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-3xl liquid-glass border border-white/80 dark:border-white/15 p-6 overflow-hidden">
                      <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10 mb-4">
                        <h3 className="font-display text-lg font-bold">
                          {isCreatingPortfolio ? t.admin.addProject : 'Edit Project'}
                        </h3>
                        <button onClick={() => setEditingPortfolio(null)}>
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex-1 overflow-y-auto space-y-3 text-xs">
                        <div>
                          <label className="block font-bold mb-1">Image URL</label>
                          <input
                            type="text"
                            value={editingPortfolio.image}
                            onChange={(e) => setEditingPortfolio({ ...editingPortfolio, image: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15 font-mono text-xs"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block font-semibold mb-1">Client</label>
                            <input
                              type="text"
                              value={editingPortfolio.client}
                              onChange={(e) => setEditingPortfolio({ ...editingPortfolio, client: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15"
                            />
                          </div>
                          <div>
                            <label className="block font-semibold mb-1">Year</label>
                            <input
                              type="text"
                              value={editingPortfolio.year}
                              onChange={(e) => setEditingPortfolio({ ...editingPortfolio, year: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-semibold mb-1">Title (English)</label>
                          <input
                            type="text"
                            value={editingPortfolio.title.en}
                            onChange={(e) => setEditingPortfolio({ ...editingPortfolio, title: { ...editingPortfolio.title, en: e.target.value } })}
                            className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold mb-1">Description (English)</label>
                          <textarea
                            rows={3}
                            value={editingPortfolio.description.en}
                            onChange={(e) => setEditingPortfolio({ ...editingPortfolio, description: { ...editingPortfolio.description, en: e.target.value } })}
                            className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15"
                          />
                        </div>

                        {/* Video URL */}
                        <div>
                          <label className="block font-semibold mb-1">Video Demo URL (Optional MP4 / Stream)</label>
                          <input
                            type="text"
                            value={(editingPortfolio as any).videoUrl || ''}
                            onChange={(e) => setEditingPortfolio({ ...editingPortfolio, videoUrl: e.target.value } as any)}
                            placeholder="https://..."
                            className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15"
                          />
                        </div>

                        {/* Portfolio Project Gallery Management (Unlimited samples with upload, library picker, and reorder) */}
                        <GalleryManager
                          label="Project Gallery Samples"
                          images={(editingPortfolio as any).galleryImages || []}
                          onChange={(newImgs) => setEditingPortfolio({ ...editingPortfolio, galleryImages: newImgs } as any)}
                          mediaLibrary={mediaLibrary}
                          onUploadFile={uploadFileToServer}
                          onAddMediaItem={addMediaItem}
                        />

                        {/* Featured Toggle */}
                        <div className="pt-1">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={editingPortfolio.featured !== false}
                              onChange={(e) => setEditingPortfolio({ ...editingPortfolio, featured: e.target.checked })}
                              className="rounded accent-[#FF5E1E]"
                            />
                            <span className="font-semibold text-xs">Featured in Portfolio Grid</span>
                          </label>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-3 pt-4 border-t border-black/10 dark:border-white/10 mt-4">
                        <button
                          onClick={() => setEditingPortfolio(null)}
                          className="px-4 py-2 rounded-xl bg-black/5 dark:bg-white/10 text-xs font-semibold"
                        >
                          {t.common.cancel}
                        </button>
                        <button
                          onClick={() => {
                            if (isCreatingPortfolio) {
                              addPortfolio(editingPortfolio);
                              showToast('Project created.');
                            } else {
                              updatePortfolio(editingPortfolio.id, editingPortfolio);
                              showToast('Project updated.');
                            }
                            setEditingPortfolio(null);
                          }}
                          className="px-5 py-2 rounded-xl bg-[#FF5E1E] text-white text-xs font-bold hover:bg-[#E84D0E]"
                        >
                          {t.common.save}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 4. MENUS MANAGER TAB */}
            {activeTab === 'menus' && (
              <div className="space-y-6 text-start">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="font-display text-2xl font-bold text-zinc-900 dark:text-white">
                      {t.admin.menusManager}
                    </h2>
                    <p className="text-xs text-zinc-500 mt-1">
                      Dynamic navigation links displayed across desktop and mobile headers.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setIsCreatingMenu(true);
                      setEditingMenu({
                        id: `menu-${Date.now()}`,
                        label: { en: 'New Link', ps: 'نوی لینک', fa: 'لینک جدید' },
                        path: 'home',
                        order: menuItems.length + 1,
                        active: true,
                      });
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF5E1E] text-white text-xs font-bold hover:bg-[#E84D0E] transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{t.admin.addMenuItem}</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {menuItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl liquid-glass border border-white/80 dark:border-white/15 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-black/5 dark:bg-white/10 flex items-center justify-center font-mono text-xs font-bold text-[#FF5E1E]">
                          {item.order}
                        </span>
                        <div>
                          <div className="text-sm font-bold">{item.label.en}</div>
                          <div className="text-xs text-zinc-400 font-mono">Target: #{item.path}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateMenuItem(item.id, { active: !item.active })}
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${item.active !== false ? 'bg-emerald-500/15 text-emerald-500' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400'}`}
                        >
                          {item.active !== false ? 'Active' : 'Hidden'}
                        </button>
                        <button
                          onClick={() => {
                            setIsCreatingMenu(false);
                            setEditingMenu(item);
                          }}
                          className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete menu item "${item.label.en}"?`)) {
                              deleteMenuItem(item.id);
                              showToast('Menu item deleted.');
                            }
                          }}
                          className="p-2 rounded-lg hover:bg-red-500/10 text-red-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Menu Item Edit Modal */}
                {editingMenu && (
                  <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="relative w-full max-w-md rounded-3xl liquid-glass border border-white/80 dark:border-white/15 p-6 text-start">
                      <h3 className="font-display text-lg font-bold mb-4">
                        {isCreatingMenu ? t.admin.addMenuItem : 'Edit Menu Link'}
                      </h3>

                      <div className="space-y-3 text-xs">
                        <div>
                          <label className="block font-semibold mb-1">English Label</label>
                          <input
                            type="text"
                            value={editingMenu.label.en}
                            onChange={(e) => setEditingMenu({ ...editingMenu, label: { ...editingMenu.label, en: e.target.value } })}
                            className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold mb-1">Pashto Label</label>
                          <input
                            type="text"
                            dir="rtl"
                            value={editingMenu.label.ps}
                            onChange={(e) => setEditingMenu({ ...editingMenu, label: { ...editingMenu.label, ps: e.target.value } })}
                            className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold mb-1">Dari Label</label>
                          <input
                            type="text"
                            dir="rtl"
                            value={editingMenu.label.fa}
                            onChange={(e) => setEditingMenu({ ...editingMenu, label: { ...editingMenu.label, fa: e.target.value } })}
                            className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold mb-1">Target Section / ID</label>
                          <input
                            type="text"
                            value={editingMenu.path}
                            onChange={(e) => setEditingMenu({ ...editingMenu, path: e.target.value })}
                            placeholder="e.g. home, services, price-list, about, portfolio, contact"
                            className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15 font-mono"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-3 pt-4 border-t border-black/10 dark:border-white/10 mt-4">
                        <button
                          onClick={() => setEditingMenu(null)}
                          className="px-4 py-2 rounded-xl bg-black/5 dark:bg-white/10 text-xs font-semibold"
                        >
                          {t.common.cancel}
                        </button>
                        <button
                          onClick={() => {
                            if (isCreatingMenu) {
                              addMenuItem(editingMenu);
                              showToast('Menu item added.');
                            } else {
                              updateMenuItem(editingMenu.id, editingMenu);
                              showToast('Menu item updated.');
                            }
                            setEditingMenu(null);
                          }}
                          className="px-5 py-2 rounded-xl bg-[#FF5E1E] text-white text-xs font-bold"
                        >
                          {t.common.save}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 5. PRICING MANAGER TAB */}
            {activeTab === 'pricing' && (
              <div className="space-y-6 text-start">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="font-display text-2xl font-bold text-zinc-900 dark:text-white">
                      {t.admin.priceManager}
                    </h2>
                    <p className="text-xs text-zinc-500 mt-1">
                      Configure service tiers, prices, and features shown in the Price List modal.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setIsCreatingPrice(true);
                      setEditingPrice({
                        id: `pkg-${Date.now()}`,
                        name: { en: 'New Package', ps: 'نوې کڅوړه', fa: 'پکیج جدید' },
                        tagline: { en: 'Description of package tier', ps: 'د کڅوړې تفصیل', fa: 'شرح پکیج' },
                        price: '$350',
                        period: { en: 'per project', ps: 'د پروژې لپاره', fa: 'به ازای پروژه' },
                        features: {
                          en: ['Feature 1', 'Feature 2', 'Feature 3'],
                          ps: ['ځانګړتیا ۱', 'ځانګړتیا ۲'],
                          fa: ['ویژگی ۱', 'ویژگی ۲'],
                        },
                        popular: false,
                        active: true,
                        order: pricePackages.length + 1,
                      });
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF5E1E] text-white text-xs font-bold hover:bg-[#E84D0E] transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Package</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {pricePackages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className="p-5 rounded-2xl liquid-glass border border-white/80 dark:border-white/15 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-display text-2xl font-extrabold text-[#FF5E1E]">
                            {pkg.price}
                          </span>
                          {pkg.popular && (
                            <span className="px-2 py-0.5 rounded-full bg-[#FF5E1E] text-white text-[10px] font-bold uppercase">
                              Popular
                            </span>
                          )}
                        </div>
                        <h4 className="font-display text-base font-bold">
                          {pkg.name[language] || pkg.name.en}
                        </h4>
                        <p className="text-xs text-zinc-500 mt-1 line-clamp-2">
                          {pkg.tagline[language] || pkg.tagline.en}
                        </p>

                        <ul className="mt-4 space-y-1.5 text-xs text-zinc-600 dark:text-zinc-300">
                          {(pkg.features[language] || pkg.features.en).slice(0, 4).map((f, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <Check className="w-3.5 h-3.5 text-[#FF5E1E] flex-shrink-0" />
                              <span className="truncate">{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-black/5 dark:border-white/10">
                        <button
                          onClick={() => {
                            setIsCreatingPrice(false);
                            setEditingPrice(pkg);
                          }}
                          className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete package "${pkg.name.en}"?`)) {
                              deletePricePackage(pkg.id);
                              showToast('Package deleted.');
                            }
                          }}
                          className="p-2 rounded-lg hover:bg-red-500/10 text-red-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pricing Edit Modal */}
                {editingPrice && (
                  <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
                    <div className="relative w-full max-w-lg rounded-3xl liquid-glass border border-white/80 dark:border-white/15 p-6 text-start">
                      <h3 className="font-display text-lg font-bold mb-4">
                        {isCreatingPrice ? 'Add Price Package' : 'Edit Package'}
                      </h3>

                      <div className="space-y-3 text-xs">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block font-semibold mb-1">Price Tag</label>
                            <input
                              type="text"
                              value={editingPrice.price}
                              onChange={(e) => setEditingPrice({ ...editingPrice, price: e.target.value })}
                              placeholder="e.g. $240"
                              className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15 font-bold"
                            />
                          </div>
                          <div>
                            <label className="block font-semibold mb-1">Period / Unit</label>
                            <input
                              type="text"
                              value={editingPrice.period.en}
                              onChange={(e) => setEditingPrice({ ...editingPrice, period: { ...editingPrice.period, en: e.target.value } })}
                              placeholder="e.g. per project"
                              className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-semibold mb-1">Package Name (English)</label>
                          <input
                            type="text"
                            value={editingPrice.name.en}
                            onChange={(e) => setEditingPrice({ ...editingPrice, name: { ...editingPrice.name, en: e.target.value } })}
                            className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold mb-1">Features (One per line)</label>
                          <textarea
                            rows={4}
                            value={editingPrice.features.en.join('\n')}
                            onChange={(e) => {
                              const lines = e.target.value.split('\n').filter(Boolean);
                              setEditingPrice({
                                ...editingPrice,
                                features: {
                                  ...editingPrice.features,
                                  en: lines,
                                  ps: editingPrice.features.ps.length ? editingPrice.features.ps : lines,
                                  fa: editingPrice.features.fa.length ? editingPrice.features.fa : lines,
                                },
                              });
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15"
                          />
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                          <input
                            type="checkbox"
                            id="popularCheck"
                            checked={editingPrice.popular}
                            onChange={(e) => setEditingPrice({ ...editingPrice, popular: e.target.checked })}
                            className="rounded accent-[#FF5E1E]"
                          />
                          <label htmlFor="popularCheck" className="font-semibold cursor-pointer">
                            Mark as Most Popular / Featured
                          </label>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-3 pt-4 border-t border-black/10 dark:border-white/10 mt-4">
                        <button
                          onClick={() => setEditingPrice(null)}
                          className="px-4 py-2 rounded-xl bg-black/5 dark:bg-white/10 text-xs font-semibold"
                        >
                          {t.common.cancel}
                        </button>
                        <button
                          onClick={() => {
                            if (isCreatingPrice) {
                              addPricePackage(editingPrice);
                              showToast('Package added.');
                            } else {
                              updatePricePackage(editingPrice.id, editingPrice);
                              showToast('Package updated.');
                            }
                            setEditingPrice(null);
                          }}
                          className="px-5 py-2 rounded-xl bg-[#FF5E1E] text-white text-xs font-bold"
                        >
                          {t.common.save}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 6. CLIENTS MANAGER TAB */}
            {activeTab === 'clients' && (
              <div className="space-y-6 text-start">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="font-display text-2xl font-bold text-zinc-900 dark:text-white">
                      {t.admin.clientsManager}
                    </h2>
                    <p className="text-xs text-zinc-500 mt-1">
                      Commercial partners and corporate brand logos.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setIsCreatingClient(true);
                      setEditingClient({
                        id: `client-${Date.now()}`,
                        name: 'New Corporate Partner',
                        logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
                        industry: { en: 'Commerce & Industry', ps: 'سوداګري او صنعت', fa: 'تجارت و صنعت' },
                        featured: true,
                      });
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF5E1E] text-white text-xs font-bold hover:bg-[#E84D0E] transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Partner</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {clients.map((c) => (
                    <div
                      key={c.id}
                      className="p-4 rounded-2xl liquid-glass border border-white/80 dark:border-white/15 flex flex-col items-center text-center justify-between gap-3"
                    >
                      <img
                        src={c.logoUrl}
                        alt={c.name}
                        className="w-14 h-14 rounded-full object-cover bg-zinc-900"
                      />
                      <div>
                        <div className="font-bold text-xs">{c.name}</div>
                        <div className="text-[10px] text-zinc-400 mt-0.5">{c.industry.en}</div>
                      </div>

                      <button
                        onClick={() => {
                          if (window.confirm(`Delete client "${c.name}"?`)) {
                            deleteClient(c.id);
                            showToast('Client removed.');
                          }
                        }}
                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500 text-xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'founder' && (
              <div className="space-y-6 text-start">
                <div>
                  <h2 className="font-display text-2xl font-bold text-zinc-900 dark:text-white">{founderText.tab}</h2>
                  <p className="mt-1 text-xs text-zinc-500">{founderText.description}</p>
                </div>

                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                  <section className="space-y-4 rounded-2xl border border-white/80 p-5 liquid-glass dark:border-white/15">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-sm font-bold">{founderText.photo}</h3>
                      <input
                        ref={founderPhotoFileRef}
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp,.svg,image/jpeg,image/png,image/webp,image/svg+xml"
                        className="hidden"
                        onChange={async (event) => {
                          const file = event.currentTarget.files?.[0];
                          event.currentTarget.value = '';
                          if (file) {
                            const shouldContinue = await handleImageSelection(file, 'founder');
                            if (!shouldContinue) return;
                            void uploadFounderAsset('photo', file);
                          }
                        }}
                      />
                      <button type="button" disabled={founderUploadBusy !== null} onClick={() => founderPhotoFileRef.current?.click()} className="inline-flex items-center gap-1.5 rounded-xl bg-[#FF5E1E] px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-[#E84D0E] disabled:opacity-50">
                        <Upload className="h-3.5 w-3.5" />
                        {founderUploadBusy === 'photo' ? 'Uploading...' : founderDraft.photoUrl ? founderText.replacePhoto : founderText.uploadPhoto}
                      </button>
                    </div>
                    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-3 dark:border-white/10 dark:bg-white/[0.02]">
                      {renderImageSpec('founder')}
                    </div>
                    <div className="flex min-h-52 items-center justify-center overflow-hidden rounded-xl border border-black/10 bg-black/[0.03] p-3 dark:border-white/10 dark:bg-white/[0.03]">
                      {founderDraft.photoUrl ? <img src={founderDraft.photoUrl} alt={founderDraft.fullName[founderLanguage] || founderText.photo} className="max-h-72 w-full object-contain" /> : <span className="text-xs text-zinc-500">{founderText.noPhoto}</span>}
                    </div>
                    {founderDraft.photoUrl && <button type="button" onClick={() => setFounderDraft((current) => ({ ...current, photoUrl: '' }))} className="text-xs font-semibold text-red-500 hover:text-red-600">{founderText.removePhoto}</button>}
                  </section>

                  <section className="space-y-4 rounded-2xl border border-white/80 p-5 liquid-glass dark:border-white/15">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-sm font-bold">{founderText.cv}</h3>
                      <input
                        ref={founderCvFileRef}
                        type="file"
                        accept=".pdf,application/pdf"
                        className="hidden"
                        onChange={(event) => {
                          const file = event.currentTarget.files?.[0];
                          event.currentTarget.value = '';
                          if (file) void uploadFounderAsset('cv', file);
                        }}
                      />
                      <button type="button" disabled={founderUploadBusy !== null} onClick={() => founderCvFileRef.current?.click()} className="inline-flex items-center gap-1.5 rounded-xl bg-[#FF5E1E] px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-[#E84D0E] disabled:opacity-50">
                        <Upload className="h-3.5 w-3.5" />
                        {founderUploadBusy === 'cv' ? 'Uploading...' : founderDraft.cvUrl ? founderText.replaceCv : founderText.uploadCv}
                      </button>
                    </div>
                    <div className="flex min-h-20 items-center gap-3 rounded-xl border border-black/10 bg-black/[0.03] px-4 py-3 dark:border-white/10 dark:bg-white/[0.03]">
                      <Download className="h-5 w-5 shrink-0 text-[#FF5E1E]" />
                      {founderDraft.cvUrl ? <a href={founderDraft.cvUrl} target="_blank" rel="noopener noreferrer" className="min-w-0 truncate text-xs font-semibold text-[#FF5E1E] hover:underline">{decodeURIComponent(founderDraft.cvUrl.split('/').pop() || founderText.cv)}</a> : <span className="text-xs text-zinc-500">{founderText.noCv}</span>}
                    </div>
                    {founderDraft.cvUrl && <button type="button" onClick={() => setFounderDraft((current) => ({ ...current, cvUrl: '' }))} className="text-xs font-semibold text-red-500 hover:text-red-600">{founderText.removeCv}</button>}
                  </section>
                </div>

                <section className="space-y-5 rounded-2xl border border-white/80 p-5 liquid-glass dark:border-white/15 sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-sm font-bold">{founderText.description}</h3>
                    <div className="flex items-center gap-1 rounded-xl border border-black/[0.06] bg-black/[0.04] p-1 dark:border-white/[0.08] dark:bg-white/[0.05]" role="group" aria-label="Founder content language">
                      {(['ps', 'fa', 'en'] as Language[]).map((code) => (
                        <button key={code} type="button" onClick={() => setFounderLanguage(code)} className={`min-h-9 rounded-lg px-3 text-xs font-semibold transition-colors ${founderLanguage === code ? 'bg-[#FF5E1E] text-white' : 'text-zinc-600 hover:bg-black/5 dark:text-zinc-300 dark:hover:bg-white/10'}`}>
                          {founderText.languages[code]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className="text-xs font-semibold">{founderText.name}
                      <input value={founderDraft.fullName[founderLanguage]} onChange={(event) => setFounderDraft((current) => ({ ...current, fullName: { ...current.fullName, [founderLanguage]: event.target.value } }))} className="mt-1 w-full rounded-xl border border-black/10 bg-black/[0.04] px-3 py-2.5 text-sm dark:border-white/10 dark:bg-white/[0.04]" />
                    </label>
                    <label className="text-xs font-semibold">{founderText.title}
                      <input value={founderDraft.title[founderLanguage]} onChange={(event) => setFounderDraft((current) => ({ ...current, title: { ...current.title, [founderLanguage]: event.target.value } }))} className="mt-1 w-full rounded-xl border border-black/10 bg-black/[0.04] px-3 py-2.5 text-sm dark:border-white/10 dark:bg-white/[0.04]" />
                    </label>
                    <label className="text-xs font-semibold sm:col-span-2">{founderText.biography}
                      <textarea rows={4} value={founderDraft.introduction[founderLanguage]} onChange={(event) => setFounderDraft((current) => ({ ...current, introduction: { ...current.introduction, [founderLanguage]: event.target.value } }))} className="mt-1 w-full resize-y rounded-xl border border-black/10 bg-black/[0.04] px-3 py-2.5 text-sm leading-6 dark:border-white/10 dark:bg-white/[0.04]" />
                    </label>
                  </div>

                  <div className="space-y-3 border-t border-black/[0.07] pt-5 dark:border-white/[0.08]">
                    <div className="flex items-center justify-between gap-3">
                      <h4 className="text-xs font-bold">{founderText.professional}</h4>
                      <button type="button" onClick={() => setFounderDraft((current) => ({ ...current, professionalInformation: [...current.professionalInformation, { label: { en: '', ps: '', fa: '' }, value: { en: '', ps: '', fa: '' } }] }))} className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#FF5E1E] hover:bg-[#FF5E1E]/10"><Plus className="h-3.5 w-3.5" />{founderText.addInformation}</button>
                    </div>
                    {founderDraft.professionalInformation.map((item, index) => (
                      <div key={index} className="grid grid-cols-1 items-end gap-3 rounded-xl border border-black/[0.06] p-3 dark:border-white/[0.08] sm:grid-cols-[1fr_1.5fr_auto]">
                        <label className="text-xs font-semibold">{founderText.label}
                          <input value={item.label[founderLanguage]} onChange={(event) => setFounderDraft((current) => ({ ...current, professionalInformation: current.professionalInformation.map((entry, row) => row === index ? { ...entry, label: { ...entry.label, [founderLanguage]: event.target.value } } : entry) }))} className="mt-1 w-full rounded-xl border border-black/10 bg-black/[0.04] px-3 py-2 text-sm dark:border-white/10 dark:bg-white/[0.04]" />
                        </label>
                        <label className="text-xs font-semibold">{founderText.value}
                          <textarea rows={2} value={item.value[founderLanguage]} onChange={(event) => setFounderDraft((current) => ({ ...current, professionalInformation: current.professionalInformation.map((entry, row) => row === index ? { ...entry, value: { ...entry.value, [founderLanguage]: event.target.value } } : entry) }))} className="mt-1 w-full resize-y rounded-xl border border-black/10 bg-black/[0.04] px-3 py-2 text-sm dark:border-white/10 dark:bg-white/[0.04]" />
                        </label>
                        <button type="button" onClick={() => setFounderDraft((current) => ({ ...current, professionalInformation: current.professionalInformation.filter((_, row) => row !== index) }))} aria-label={founderText.remove} className="inline-flex min-h-9 items-center justify-center gap-1 rounded-lg px-2 text-xs font-semibold text-red-500 hover:bg-red-500/10"><Trash2 className="h-3.5 w-3.5" /><span className="sm:hidden">{founderText.remove}</span></button>
                      </div>
                    ))}
                  </div>

                  <label className="block border-t border-black/[0.07] pt-5 text-xs font-semibold dark:border-white/[0.08]">{founderText.additional}
                    <textarea rows={3} value={founderDraft.additionalInformation[founderLanguage]} onChange={(event) => setFounderDraft((current) => ({ ...current, additionalInformation: { ...current.additionalInformation, [founderLanguage]: event.target.value } }))} className="mt-1 w-full resize-y rounded-xl border border-black/10 bg-black/[0.04] px-3 py-2.5 text-sm leading-6 dark:border-white/10 dark:bg-white/[0.04]" />
                  </label>

                  {founderError && <p role="alert" className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-500">{founderError}</p>}
                  <div className="flex justify-end border-t border-black/[0.07] pt-4 dark:border-white/[0.08]">
                    <button type="button" disabled={founderUploadBusy !== null} onClick={() => { updateConfig({ founderProfile: founderDraft }); setFounderError(null); showToast(founderText.saved); }} className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-[#FF5E1E] px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-[#E84D0E] disabled:opacity-50"><Save className="h-3.5 w-3.5" />{founderText.save}</button>
                  </div>
                </section>
              </div>
            )}

            {/* 7. MEDIA LIBRARY TAB */}
            {activeTab === 'media' && (
              <div className="space-y-6 text-start">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="font-display text-2xl font-bold text-zinc-900 dark:text-white">
                      {t.admin.mediaLibrary}
                    </h2>
                    <p className="text-xs text-zinc-500 mt-1">
                      Upload local files or import directly from Google Drive / Cloud storage URLs.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={mediaFileRef}
                      accept="image/*,video/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        e.target.value = '';
                        if (file) {
                          if (file.type.startsWith('image/')) {
                            const shouldContinue = await handleImageSelection(file, 'gallery');
                            if (!shouldContinue) return;
                          }
                          const url = await uploadFileToServer(file);
                          addMediaItem({
                            name: file.name,
                            url,
                            type: file.type.startsWith('video') ? 'video' : 'image',
                            size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
                          });
                          showToast('Asset uploaded to library.');
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => mediaFileRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF5E1E] text-white text-xs font-bold hover:bg-[#E84D0E] transition-colors cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      <span>{t.admin.uploadMedia}</span>
                    </button>
                  </div>
                </div>
                <div className="max-w-md">
                  {renderImageSpec('gallery')}
                </div>

                {/* Cloud & Google Drive Importer Card */}
                <div className="p-4 rounded-2xl liquid-glass border border-white/80 dark:border-white/15 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-zinc-800 dark:text-zinc-200">
                      <ExternalLink className="w-4 h-4 text-[#FF5E1E]" />
                      <span>Import from Google Drive or Cloud URL</span>
                    </div>
                    <span className="text-[10px] text-zinc-500">Supports Google Drive view/sharing links, CDN URLs, and WebP/PNG/JPG/MP4</span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="Paste Google Drive link (e.g. drive.google.com/file/d/...) or image URL"
                      value={importUrl}
                      onChange={(e) => setImportUrl(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && importUrl.trim()) {
                          handleImportMedia(importUrl);
                        }
                      }}
                      className="flex-1 px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15 text-xs font-mono"
                    />
                    <button
                      type="button"
                      disabled={isImporting || !importUrl.trim()}
                      onClick={() => handleImportMedia(importUrl)}
                      className="px-4 py-2 rounded-xl bg-[#FF5E1E] disabled:opacity-50 text-white text-xs font-bold hover:bg-[#E84D0E] transition-colors flex items-center gap-1.5"
                    >
                      {isImporting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                      <span>{isImporting ? 'Importing...' : 'Import to Library'}</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {mediaLibrary.map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-2xl liquid-glass border border-white/80 dark:border-white/15 flex flex-col justify-between gap-2 group"
                    >
                      <div className="aspect-square rounded-xl overflow-hidden bg-zinc-950 relative">
                        {item.type === 'video' ? (
                          <video src={item.url} className="w-full h-full object-cover" muted playsInline />
                        ) : (
                          <img
                            src={item.url}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        )}
                        <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-mono uppercase bg-black/60 text-white backdrop-blur-sm">
                          {item.type}
                        </span>
                      </div>
                      <div className="text-[11px] truncate font-medium">{item.name}</div>
                      
                      <div className="flex items-center justify-between pt-1 text-[10px] text-zinc-400">
                        <span>{item.size || 'Web'}</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              navigator.clipboard?.writeText(item.url);
                              showToast('URL copied to clipboard.');
                            }}
                            className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/10"
                            title="Copy URL"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => {
                              deleteMediaItem(item.id);
                              showToast('Asset deleted.');
                            }}
                            className="p-1 rounded hover:bg-red-500/10 text-red-500"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 8. SETTINGS TAB (BRAND LOGO, BACKGROUND IMAGE, WHATSAPP, HERO COPY) */}
            {activeTab === 'settings' && (
              <div className="space-y-8 text-start">
                <div>
                  <h2 className="font-display text-2xl font-bold text-zinc-900 dark:text-white">
                    {t.admin.settingsBrand}
                  </h2>
                  <p className="text-xs text-zinc-500 mt-1">
                    Upload real Hila Graphic logo, manage background atmosphere, and set WhatsApp numbers.
                  </p>
                </div>

                {/* Section A: REAL LOGO SYSTEM UPGRADE */}
                <div className="p-6 rounded-3xl liquid-glass border border-white/80 dark:border-white/15 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display text-base font-bold text-zinc-900 dark:text-white">
                        {t.admin.logoManager}
                      </h3>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        Manage theme-specific logos (Light Mode, Dark Mode), browser favicon, and sizing scale.
                      </p>
                    </div>

                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#FF5E1E]/10 text-[#FF5E1E] font-bold uppercase tracking-wider">
                      Official Brand System
                    </span>
                  </div>

                  {/* Logo Sizing Scale Slider */}
                  <div className="p-4 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/5 dark:border-white/10 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span>Logo Display Scale</span>
                      <span className="font-mono text-[#FF5E1E]">{Math.round((config.customLogo?.scale ?? 1.0) * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.7"
                      max="1.5"
                      step="0.05"
                      value={config.customLogo?.scale ?? 1.0}
                      onChange={(e) => updateLogoScale(parseFloat(e.target.value))}
                      className="w-full accent-[#FF5E1E]"
                    />
                  </div>

                  {/* 3-Column Logo Cards: Light Mode, Dark Mode, Favicon */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* 1. Light Mode Logo */}
                    <div className="p-4 rounded-2xl bg-white text-zinc-900 border border-zinc-200 shadow-sm flex flex-col justify-between gap-3">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-zinc-700">Light Mode Logo</span>
                          {config.customLogo?.lightLogoUrl && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 font-bold">Active</span>
                          )}
                        </div>
                        <div className="h-20 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center p-2 overflow-hidden">
                          {config.customLogo?.lightLogoUrl || config.customLogo?.customLogoUrl ? (
                            <img
                              src={config.customLogo?.lightLogoUrl || config.customLogo?.customLogoUrl || ''}
                              alt="Light Logo"
                              className="max-h-full max-w-full object-contain"
                              style={{ transform: `scale(${config.customLogo?.scale ?? 1.0})` }}
                            />
                          ) : (
                            <Logo size="md" />
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <input
                          type="file"
                          ref={lightLogoFileRef}
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const shouldContinue = await handleImageSelection(file, 'logo');
                              if (!shouldContinue) {
                                e.target.value = '';
                                return;
                              }
                              const url = await uploadFileToServer(file);
                              uploadLightLogo(url);
                              showToast('Light mode logo uploaded.');
                            }
                          }}
                        />
                        {renderImageSpec('logo')}
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => lightLogoFileRef.current?.click()}
                            className="flex-1 py-1.5 px-3 rounded-xl bg-[#FF5E1E] text-white text-xs font-bold hover:bg-[#E84D0E] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload</span>
                          </button>
                          {(config.customLogo?.lightLogoUrl || config.customLogo?.customLogoUrl) && (
                            <button
                              type="button"
                              onClick={() => {
                                removeLightLogo();
                                showToast('Light logo reset.');
                              }}
                              className="p-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs"
                              title="Reset"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 2. Dark Mode Logo */}
                    <div className="p-4 rounded-2xl bg-zinc-950 text-white border border-zinc-800 shadow-sm flex flex-col justify-between gap-3">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">Dark Mode Logo</span>
                          {config.customLogo?.darkLogoUrl && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">Active</span>
                          )}
                        </div>
                        <div className="h-20 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center p-2 overflow-hidden">
                          {config.customLogo?.darkLogoUrl ? (
                            <img
                              src={config.customLogo.darkLogoUrl}
                              alt="Dark Logo"
                              className="max-h-full max-w-full object-contain"
                              style={{ transform: `scale(${config.customLogo?.scale ?? 1.0})` }}
                            />
                          ) : (
                            <Logo size="md" />
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <input
                          type="file"
                          ref={darkLogoFileRef}
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const shouldContinue = await handleImageSelection(file, 'logo');
                              if (!shouldContinue) {
                                e.target.value = '';
                                return;
                              }
                              const url = await uploadFileToServer(file);
                              uploadDarkLogo(url);
                              showToast('Dark mode logo uploaded.');
                            }
                          }}
                        />
                        {renderImageSpec('logo')}
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => darkLogoFileRef.current?.click()}
                            className="flex-1 py-1.5 px-3 rounded-xl bg-[#FF5E1E] text-white text-xs font-bold hover:bg-[#E84D0E] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload</span>
                          </button>
                          {config.customLogo?.darkLogoUrl && (
                            <button
                              type="button"
                              onClick={() => {
                                removeDarkLogo();
                                showToast('Dark logo reset.');
                              }}
                              className="p-1.5 rounded-xl border border-red-900 text-red-400 hover:bg-red-950 text-xs"
                              title="Reset"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 3. Favicon */}
                    <div className="p-4 rounded-2xl liquid-glass border border-white/80 dark:border-white/15 flex flex-col justify-between gap-3">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">Browser Favicon</span>
                          {config.customLogo?.faviconUrl && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">Custom</span>
                          )}
                        </div>
                        <div className="h-20 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 flex items-center justify-center p-2">
                          {config.customLogo?.faviconUrl ? (
                            <img
                              src={config.customLogo.faviconUrl}
                              alt="Favicon"
                              className="w-8 h-8 rounded object-contain"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded bg-[#FF5E1E] flex items-center justify-center text-white font-bold text-xs shadow-sm">
                              H
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <input
                          type="file"
                          ref={faviconFileRef}
                          accept="image/png,image/x-icon,image/svg+xml"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const shouldContinue = await handleImageSelection(file, 'favicon');
                              if (!shouldContinue) {
                                e.target.value = '';
                                return;
                              }
                              const url = await uploadFileToServer(file);
                              uploadFavicon(url);
                              showToast('Favicon updated.');
                            }
                          }}
                        />
                        {renderImageSpec('favicon')}
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => faviconFileRef.current?.click()}
                            className="flex-1 py-1.5 px-3 rounded-xl bg-[#FF5E1E] text-white text-xs font-bold hover:bg-[#E84D0E] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload</span>
                          </button>
                          {config.customLogo?.faviconUrl && (
                            <button
                              type="button"
                              onClick={() => {
                                removeFavicon();
                                showToast('Favicon reset.');
                              }}
                              className="p-1.5 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500/10 text-xs"
                              title="Reset"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section B: HOME BACKGROUND MANAGEMENT SYSTEM */}
                <div className="p-6 rounded-3xl liquid-glass border border-white/80 dark:border-white/15 space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display text-base font-bold text-zinc-900 dark:text-white">
                        {t.admin.bgImageManager}
                      </h3>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        Customize background artwork, opacity, blur, and contrast overlay shield.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const current = config.backgroundImage?.enabled;
                        updateBackgroundImage({ enabled: !current });
                        showToast(!current ? 'Custom background enabled.' : 'Background switched to atmospheric gradient.');
                      }}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        config.backgroundImage?.enabled
                          ? 'bg-emerald-500 text-white shadow-md'
                          : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'
                      }`}
                    >
                      {config.backgroundImage?.enabled ? '● Background ON' : '○ Background OFF'}
                    </button>
                  </div>

                  {/* Hidden inputs for direct file upload */}
                  <input
                    type="file"
                    ref={bgLightFileRef}
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const shouldContinue = await handleImageSelection(file, 'background');
                        if (!shouldContinue) {
                          e.target.value = '';
                          return;
                        }
                        const url = await uploadFileToServer(file);
                        updateBackgroundImage({ lightImageUrl: url, enabled: true });
                        showToast('Light mode background updated.');
                      }
                    }}
                  />
                  <input
                    type="file"
                    ref={bgDarkFileRef}
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const shouldContinue = await handleImageSelection(file, 'background');
                        if (!shouldContinue) {
                          e.target.value = '';
                          return;
                        }
                        const url = await uploadFileToServer(file);
                        updateBackgroundImage({ darkImageUrl: url, enabled: true });
                        showToast('Dark mode background updated.');
                      }
                    }}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-3 dark:border-white/10 dark:bg-white/[0.02]">
                      {renderImageSpec('background')}
                    </div>
                    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-3 dark:border-white/10 dark:bg-white/[0.02]">
                      <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-500">Background usage</div>
                      <div className="mt-2 text-zinc-600 dark:text-zinc-300">The home page uses a full-viewport background layer, so the widescreen 16:9 composition stays clean on desktop and mobile without stretching.</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="font-semibold text-zinc-800 dark:text-zinc-200">Light Mode Background Image</label>
                        <button
                          type="button"
                          onClick={() => bgLightFileRef.current?.click()}
                          className="text-[11px] text-[#FF5E1E] font-bold hover:underline flex items-center gap-1"
                        >
                          <Upload className="w-3 h-3" />
                          <span>Upload File</span>
                        </button>
                      </div>
                      <input
                        type="text"
                        value={config.backgroundImage?.lightImageUrl || ''}
                        onChange={(e) => updateBackgroundImage({ lightImageUrl: e.target.value })}
                        placeholder="https://images.unsplash.com/... or /uploads/..."
                        className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15 font-mono text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="font-semibold text-zinc-800 dark:text-zinc-200">Dark Mode Background Image</label>
                        <button
                          type="button"
                          onClick={() => bgDarkFileRef.current?.click()}
                          className="text-[11px] text-[#FF5E1E] font-bold hover:underline flex items-center gap-1"
                        >
                          <Upload className="w-3 h-3" />
                          <span>Upload File</span>
                        </button>
                      </div>
                      <input
                        type="text"
                        value={config.backgroundImage?.darkImageUrl || ''}
                        onChange={(e) => updateBackgroundImage({ darkImageUrl: e.target.value })}
                        placeholder="https://images.unsplash.com/... or /uploads/..."
                        className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15 font-mono text-xs"
                      />
                    </div>
                  </div>

                  {/* Sliders: Opacity, Blur, Overlay Darkness */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-2">
                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold mb-1">
                        <span>Artwork Opacity</span>
                        <span className="font-mono text-[#FF5E1E]">{Math.round((config.backgroundImage?.opacity ?? 0.2) * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0.05"
                        max="0.8"
                        step="0.05"
                        value={config.backgroundImage?.opacity ?? 0.2}
                        onChange={(e) => updateBackgroundImage({ opacity: parseFloat(e.target.value) })}
                        className="w-full accent-[#FF5E1E]"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold mb-1">
                        <span>Background Blur</span>
                        <span className="font-mono text-[#FF5E1E]">{config.backgroundImage?.blur ?? 4}px</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="25"
                        step="1"
                        value={config.backgroundImage?.blur ?? 4}
                        onChange={(e) => updateBackgroundImage({ blur: parseInt(e.target.value) })}
                        className="w-full accent-[#FF5E1E]"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold mb-1">
                        <span>Contrast Shield (Overlay)</span>
                        <span className="font-mono text-[#FF5E1E]">{Math.round((config.backgroundImage?.overlayDarkness ?? 0.6) * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="0.9"
                        step="0.05"
                        value={config.backgroundImage?.overlayDarkness ?? 0.6}
                        onChange={(e) => updateBackgroundImage({ overlayDarkness: parseFloat(e.target.value) })}
                        className="w-full accent-[#FF5E1E]"
                      />
                    </div>
                  </div>

                  {/* Background Action Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        updateBackgroundImage({
                          enabled: false,
                          lightImageUrl: '',
                          darkImageUrl: '',
                          opacity: 0.2,
                          blur: 4,
                          overlayDarkness: 0.6,
                        });
                        showToast('Background settings reset to atmospheric gradient.');
                      }}
                      className="px-3.5 py-1.5 rounded-xl border border-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500/10 text-xs font-medium transition-colors"
                    >
                      Reset / Remove Custom Background
                    </button>
                  </div>
                </div>

                {/* Section C: WHATSAPP & CONTACT DETAILS */}
                <div className="p-6 rounded-3xl liquid-glass border border-white/80 dark:border-white/15 space-y-4">
                  <h3 className="font-display text-base font-bold text-zinc-900 dark:text-white">
                    WhatsApp & Studio Coordinates
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="block font-semibold mb-1">WhatsApp Dispatch Number</label>
                      <input
                        type="text"
                        value={config.whatsappNumber}
                        onChange={(e) => updateWhatsAppNumber(e.target.value)}
                        placeholder="+93799123456"
                        className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15 font-mono text-[#FF5E1E] font-bold"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Display Phone</label>
                      <input
                        type="text"
                        value={config.phoneDisplay}
                        onChange={(e) => updateConfig({ phoneDisplay: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Studio Email</label>
                      <input
                        type="email"
                        value={config.email}
                        onChange={(e) => updateConfig({ email: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-xs">Physical Studio Address (English)</label>
                    <input
                      type="text"
                      value={config.address.en}
                      onChange={(e) => updateConfig({ address: { ...config.address, en: e.target.value } })}
                      className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15 text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 border-t border-black/[0.07] pt-4 text-xs dark:border-white/[0.08] sm:grid-cols-2">
                    {(['Instagram', 'Facebook'] as const).map((platform) => (
                      <label key={platform} className="block font-semibold">
                        {platform} Profile URL
                        <input
                          type="url"
                          value={config.socialLinks.find((item) => item.platform.toLowerCase() === platform.toLowerCase())?.url || ''}
                          onChange={(event) => updateSocialProfileUrl(platform, event.target.value)}
                          aria-label={`${platform} Profile URL`}
                          className="mt-1 w-full rounded-xl border border-black/10 bg-black/5 px-3 py-2 text-xs font-normal dark:border-white/15 dark:bg-white/5"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                {/* Section D: HERO HEADLINE & COPY IN 3 LANGUAGES */}
                <div className="p-6 rounded-3xl liquid-glass border border-white/80 dark:border-white/15 space-y-4">
                  <h3 className="font-display text-base font-bold text-zinc-900 dark:text-white">
                    Hero Section Copy (Multilingual)
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="block font-semibold mb-1">Headline Part 1 (EN)</label>
                      <input
                        type="text"
                        value={config.hero.headlinePart1.en}
                        onChange={(e) => updateConfig({ hero: { ...config.hero, headlinePart1: { ...config.hero.headlinePart1, en: e.target.value } } })}
                        className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Headline Accent (EN)</label>
                      <input
                        type="text"
                        value={config.hero.headlineAccent.en}
                        onChange={(e) => updateConfig({ hero: { ...config.hero, headlineAccent: { ...config.hero.headlineAccent, en: e.target.value } } })}
                        className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15 font-bold text-[#FF5E1E]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Headline Part 2 (EN)</label>
                      <input
                        type="text"
                        value={config.hero.headlinePart2.en}
                        onChange={(e) => updateConfig({ hero: { ...config.hero, headlinePart2: { ...config.hero.headlinePart2, en: e.target.value } } })}
                        className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-xs">Hero Summary Description (English)</label>
                    <textarea
                      rows={2}
                      value={config.hero.description.en}
                      onChange={(e) => updateConfig({ hero: { ...config.hero, description: { ...config.hero.description, en: e.target.value } } })}
                      className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15 text-xs"
                    />
                  </div>
                </div>

              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6 text-start">
                <div>
                  <h2 className="font-display text-2xl font-bold text-zinc-900 dark:text-white">Security Management</h2>
                  <p className="text-xs text-zinc-500 mt-1">Manage administrator authentication and active sessions.</p>
                </div>

                {securityError && (
                  <div role="alert" className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-500">
                    {securityError}
                  </div>
                )}

                <section className="p-6 rounded-3xl liquid-glass border border-white/80 dark:border-white/15 space-y-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <h3 className="font-display text-base font-bold">Authentication Security</h3>
                  </div>
                  {securityStatus ? (
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div><dt className="text-zinc-500">Admin authentication</dt><dd className="mt-1 font-semibold text-emerald-500">Authenticated</dd></div>
                      <div><dt className="text-zinc-500">Current session</dt><dd className="mt-1 font-semibold">Active</dd></div>
                      <div><dt className="text-zinc-500">Last login / session started</dt><dd className="mt-1">{new Date(securityStatus.sessionCreatedAt).toLocaleString()}</dd></div>
                      <div><dt className="text-zinc-500">Session expires</dt><dd className="mt-1">{new Date(securityStatus.sessionExpiresAt).toLocaleString()}</dd></div>
                      <div><dt className="text-zinc-500">Active sessions on this server</dt><dd className="mt-1">{securityStatus.activeSessions}</dd></div>
                    </dl>
                  ) : (
                    <p className="text-xs text-zinc-500">Loading session status...</p>
                  )}
                </section>

                <section className="p-6 rounded-3xl liquid-glass border border-white/80 dark:border-white/15 space-y-4">
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-[#FF5E1E]" />
                    <h3 className="font-display text-base font-bold">Change Admin Password</h3>
                  </div>
                  <form
                    className="space-y-3"
                    onSubmit={async (event) => {
                      event.preventDefault();
                      setSecurityBusy(true);
                      setSecurityError(null);
                      try {
                        await sendSecurityRequest('/api/admin/password', passwordFields);
                        setPasswordFields({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
                        showToast('Password changed. Sign in again with the new password.');
                        await logoutAdmin();
                        onClose();
                      } catch (error) {
                        setSecurityError(error instanceof Error ? error.message : 'Password change failed.');
                      } finally {
                        setSecurityBusy(false);
                      }
                    }}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <label className="text-xs font-semibold">Current Password
                        <input type="password" autoComplete="current-password" required value={passwordFields.currentPassword} onChange={(event) => setPasswordFields({ ...passwordFields, currentPassword: event.target.value })} className="mt-1 w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15" />
                      </label>
                      <label className="text-xs font-semibold">New Password
                        <input type="password" autoComplete="new-password" minLength={12} maxLength={128} required value={passwordFields.newPassword} onChange={(event) => setPasswordFields({ ...passwordFields, newPassword: event.target.value })} className="mt-1 w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15" />
                      </label>
                      <label className="text-xs font-semibold">Confirm New Password
                        <input type="password" autoComplete="new-password" minLength={12} maxLength={128} required value={passwordFields.confirmNewPassword} onChange={(event) => setPasswordFields({ ...passwordFields, confirmNewPassword: event.target.value })} className="mt-1 w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15" />
                      </label>
                    </div>
                    <p className="text-[11px] text-zinc-500">Use 12-128 characters and at least three character types. Changing the password signs out all sessions.</p>
                    <button type="submit" disabled={securityBusy} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF5E1E] text-white text-xs font-bold hover:bg-[#E84D0E] disabled:opacity-50">
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>{securityBusy ? 'Saving...' : 'Change Password'}</span>
                    </button>
                  </form>
                </section>

                <section className="p-6 rounded-3xl liquid-glass border border-white/80 dark:border-white/15 space-y-4">
                  <div className="flex items-center gap-2">
                    <LogOut className="w-4 h-4 text-amber-500" />
                    <h3 className="font-display text-base font-bold">Session Management</h3>
                  </div>
                  <p className="text-xs text-zinc-500">Session controls apply to this server instance.</p>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      disabled={securityBusy || !securityStatus || securityStatus.activeSessions < 2}
                      onClick={async () => {
                        if (!window.confirm('Sign out all other administrator sessions?')) return;
                        setSecurityBusy(true);
                        setSecurityError(null);
                        try {
                          const result = await sendSecurityRequest('/api/admin/sessions/revoke-others', {});
                          await loadSecurityStatus();
                          showToast(`${result.revokedSessions} other session(s) signed out.`);
                        } catch (error) {
                          setSecurityError(error instanceof Error ? error.message : 'Unable to revoke sessions.');
                        } finally {
                          setSecurityBusy(false);
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-black/5 dark:bg-white/10 text-xs font-semibold disabled:opacity-50"
                    >Sign Out Other Sessions</button>
                    <button
                      type="button"
                      disabled={securityBusy}
                      onClick={async () => {
                        if (!window.confirm('Sign out every administrator session, including this one?')) return;
                        setSecurityBusy(true);
                        setSecurityError(null);
                        try {
                          await sendSecurityRequest('/api/admin/sessions/revoke-all', {});
                          await logoutAdmin();
                          onClose();
                        } catch (error) {
                          setSecurityError(error instanceof Error ? error.message : 'Unable to revoke sessions.');
                        } finally {
                          setSecurityBusy(false);
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-semibold disabled:opacity-50"
                    >Sign Out All Sessions</button>
                  </div>
                </section>
              </div>
            )}

          </div>
        </main>

      </div>
    </div>
  );
};
