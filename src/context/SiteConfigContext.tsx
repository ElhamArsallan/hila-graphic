import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import {
  SiteConfig,
  MenuItem,
  ServiceItem,
  PortfolioItem,
  PricePackage,
  ClientItem,
  MediaItem,
  BackgroundImageConfig,
  CustomLogoConfig,
} from '../types';
import {
  defaultSiteConfig,
  defaultMenuItems,
  defaultPricePackages,
  defaultClients,
  buildWhatsAppUrl,
} from '../config/site';
import { servicesData } from '../data/services';
import { portfolioData } from '../data/portfolio';

interface SiteConfigContextType {
  // Core Config
  config: SiteConfig;
  updateConfig: (partial: Partial<SiteConfig>) => void;
  updateWhatsAppNumber: (num: string) => void;
  updateBackgroundImage: (bg: Partial<BackgroundImageConfig>) => void;
  uploadCustomLogo: (dataUrl: string) => void;
  removeCustomLogo: () => void;

  // Dynamic Menus
  menuItems: MenuItem[];
  addMenuItem: (item: Omit<MenuItem, 'id' | 'order'>) => void;
  updateMenuItem: (id: string, partial: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  reorderMenuItems: (items: MenuItem[]) => void;

  // Dynamic Services
  services: ServiceItem[];
  addService: (service: Omit<ServiceItem, 'id'>) => void;
  updateService: (id: string, partial: Partial<ServiceItem>) => void;
  deleteService: (id: string) => void;

  // Dynamic Portfolio
  portfolio: PortfolioItem[];
  addPortfolio: (item: Omit<PortfolioItem, 'id'>) => void;
  updatePortfolio: (id: string, partial: Partial<PortfolioItem>) => void;
  deletePortfolio: (id: string) => void;

  // Dynamic Pricing Packages
  pricePackages: PricePackage[];
  addPricePackage: (pkg: Omit<PricePackage, 'id' | 'order'>) => void;
  updatePricePackage: (id: string, partial: Partial<PricePackage>) => void;
  deletePricePackage: (id: string) => void;

  // Clients
  clients: ClientItem[];
  addClient: (client: Omit<ClientItem, 'id'>) => void;
  updateClient: (id: string, partial: Partial<ClientItem>) => void;
  deleteClient: (id: string) => void;

  // Media Library
  mediaLibrary: MediaItem[];
  addMediaItem: (item: Omit<MediaItem, 'id' | 'createdAt'>) => void;
  deleteMediaItem: (id: string) => void;

  // Admin Auth
  isAdminAuthenticated: boolean;
  validateAdminSession: () => Promise<boolean>;
  loginAdmin: (passcode: string) => Promise<boolean>;
  logoutAdmin: () => Promise<void>;

  // Real Persistent File Upload
  uploadFile: (file: File, onProgress?: (pct: number) => void, category?: string) => Promise<{ url: string; name: string; type: string; size: string }>;
  uploadLightLogo: (url: string) => void;
  uploadDarkLogo: (url: string) => void;
  removeLightLogo: () => void;
  removeDarkLogo: () => void;
  uploadFavicon: (url: string) => void;
  removeFavicon: () => void;
  updateLogoScale: (scale: number) => void;

  // Helpers
  getWhatsAppLink: (customMessage?: string) => string;
  resetToDefaults: () => void;
}

const SiteConfigContext = createContext<SiteConfigContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CONFIG: 'hilagraphic_cms_config_v2',
  MENUS: 'hilagraphic_cms_menus_v2',
  SERVICES: 'hilagraphic_cms_services_v2',
  PORTFOLIO: 'hilagraphic_cms_portfolio_v2',
  PRICES: 'hilagraphic_cms_prices_v2',
  CLIENTS: 'hilagraphic_cms_clients_v2',
  MEDIA: 'hilagraphic_cms_media_v2',
};

export const SiteConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Site Config
  const [config, setConfig] = useState<SiteConfig>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.CONFIG);
      if (saved) {
        try {
          return { ...defaultSiteConfig, ...JSON.parse(saved) };
        } catch {}
      }
    }
    return defaultSiteConfig;
  });

  // 2. Menu Items
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.MENUS);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return defaultMenuItems;
  });

  // 3. Services
  const [services, setServices] = useState<ServiceItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.SERVICES);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return servicesData;
  });

  // 4. Portfolio
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.PORTFOLIO);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return portfolioData;
  });

  // 5. Price Packages
  const [pricePackages, setPricePackages] = useState<PricePackage[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.PRICES);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return defaultPricePackages;
  });

  // 6. Clients
  const [clients, setClients] = useState<ClientItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.CLIENTS);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return defaultClients;
  });

  // 7. Media Library
  const [mediaLibrary, setMediaLibrary] = useState<MediaItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.MEDIA);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return [
      {
        id: 'media-1',
        name: 'Hila Signature Hero Visual',
        url: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=1200&auto=format&fit=crop',
        type: 'image',
        createdAt: '2025-01-10',
        size: '1.4 MB',
      },
      {
        id: 'media-2',
        name: 'Logo Geometric Study',
        url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=1200&auto=format&fit=crop',
        type: 'image',
        createdAt: '2025-01-12',
        size: '2.1 MB',
      },
    ];
  });

  // 8. Admin Auth
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const csrfTokenRef = useRef<string | null>(null);

  const refreshAdminSession = async (): Promise<string | null> => {
    try {
      const res = await fetch('/api/admin/session', { credentials: 'same-origin' });
      if (!res.ok) {
        setIsAdminAuthenticated(false);
        csrfTokenRef.current = null;
        return null;
      }

      const data = await res.json();
      const tokenMatch = document.cookie.match(/(?:^|; )hila_admin_csrf=([^;]+)/);
      const token = data?.authenticated && tokenMatch ? decodeURIComponent(tokenMatch[1]) : null;
      csrfTokenRef.current = token;
      setIsAdminAuthenticated(Boolean(data?.authenticated && token));
      return token;
    } catch {
      setIsAdminAuthenticated(false);
      csrfTokenRef.current = null;
      return null;
    }
  };

  const validateAdminSession = async () => Boolean(await refreshAdminSession());

  useEffect(() => {
    refreshAdminSession();
  }, []);

  useEffect(() => {
    if (!isAdminAuthenticated) return;
    const refreshVisibleSession = () => {
      if (document.visibilityState === 'visible') refreshAdminSession();
    };
    const interval = window.setInterval(refreshVisibleSession, 30_000);
    window.addEventListener('focus', refreshVisibleSession);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener('focus', refreshVisibleSession);
    };
  }, [isAdminAuthenticated]);

  // Hydration & Infinite Loop Prevention Refs
  const isHydratedRef = useRef(false);
  const isApplyingServerDataRef = useRef(false);
  const lastSavedDataRef = useRef<string>('');
  const syncLockRef = useRef(false);
  const syncVersionRef = useRef(0);

  // Load persistent server data on mount
  useEffect(() => {
    let active = true;
    fetch('/api/data')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch site data');
        return res.json();
      })
      .then((data) => {
        if (!active || !data || !data.exists || !data.data) return;
        const d = data.data;
        isApplyingServerDataRef.current = true;
        if (d.config) setConfig((prev) => ({ ...prev, ...d.config }));
        if (d.menuItems) setMenuItems(d.menuItems);
        if (d.services) setServices(d.services);
        if (d.portfolio) setPortfolio(d.portfolio);
        if (d.pricePackages) setPricePackages(d.pricePackages);
        if (d.clients) setClients(d.clients);
        if (d.mediaLibrary) setMediaLibrary(d.mediaLibrary);

        // Record last saved data signature to prevent echo POST
        lastSavedDataRef.current = JSON.stringify({
          config: d.config ? { ...defaultSiteConfig, ...d.config } : defaultSiteConfig,
          menuItems: d.menuItems || defaultMenuItems,
          services: d.services || servicesData,
          portfolio: d.portfolio || portfolioData,
          pricePackages: d.pricePackages || defaultPricePackages,
          clients: d.clients || defaultClients,
          mediaLibrary: d.mediaLibrary || [],
        });
      })
      .catch((err) => {
        console.warn('Site data hydration fallback to client cache:', err);
      })
      .finally(() => {
        if (active) {
          isHydratedRef.current = true;
        }
      });

    return () => {
      active = false;
    };
  }, []);

  // Sync to LocalStorage & Remote Database (Debounced, skipping initial hydration echo)
  useEffect(() => {
    // 1. Always update local storage for instant offline/client cache
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
    localStorage.setItem(STORAGE_KEYS.MENUS, JSON.stringify(menuItems));
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
    localStorage.setItem(STORAGE_KEYS.PORTFOLIO, JSON.stringify(portfolio));
    localStorage.setItem(STORAGE_KEYS.PRICES, JSON.stringify(pricePackages));
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
    localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(mediaLibrary));

    // 2. Prevent infinite save loop: do not POST before hydration is completed
    if (!isHydratedRef.current) {
      return;
    }

    // 3. Skip the immediate persistence triggered by server hydration state application
    if (isApplyingServerDataRef.current) {
      isApplyingServerDataRef.current = false;
      return;
    }

    if (syncLockRef.current) {
      return;
    }

    const currentPayload = {
      config,
      menuItems,
      services,
      portfolio,
      pricePackages,
      clients,
      mediaLibrary,
    };
    const currentPayloadString = JSON.stringify(currentPayload);

    // 4. Do not POST if data is unchanged from last saved state
    if (lastSavedDataRef.current && lastSavedDataRef.current === currentPayloadString) {
      return;
    }

    const timeout = setTimeout(async () => {
      const token = await refreshAdminSession();
      const requestVersion = ++syncVersionRef.current;
      fetch('/api/data', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'X-CSRF-Token': token } : {}),
        },
        body: currentPayloadString,
      })
        .then((res) => {
          if (requestVersion !== syncVersionRef.current) return;
          if (res.ok) {
            lastSavedDataRef.current = currentPayloadString;
          }
        })
        .catch(() => {
          // Backend sync warning handled gracefully
        });
    }, 1000);

    return () => clearTimeout(timeout);
  }, [config, menuItems, services, portfolio, pricePackages, clients, mediaLibrary]);

  // Real Persistent File Upload (Connected to Server Disk / Cloud Storage)
  const uploadFile = async (
    file: File,
    onProgress?: (pct: number) => void,
    category = 'media'
  ): Promise<{ url: string; name: string; type: string; size: string }> => {
    syncLockRef.current = true;
    return new Promise(async (resolve, reject) => {
      try {
        if (file.size > 100 * 1024 * 1024) {
          reject(new Error('File size exceeds 100MB limit. Please upload a smaller asset.'));
          return;
        }

        const token = await refreshAdminSession();
        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', category);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/upload', true);
        xhr.withCredentials = true;
        if (token) {
          xhr.setRequestHeader('X-CSRF-Token', token);
        }

        if (onProgress && xhr.upload) {
          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
              const pct = Math.round((e.loaded / e.total) * 100);
              onProgress(pct);
            }
          };
        }

        xhr.onload = () => {
          try {
            if (xhr.status >= 200 && xhr.status < 300) {
              const res = JSON.parse(xhr.responseText);
              if (res.success && res.url) {
                if (res.type !== 'document') {
                  const newMediaItem: MediaItem = {
                    id: `media-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                    name: file.name,
                    url: res.url,
                    type: res.type === 'video' ? 'video' : 'image',
                    createdAt: new Date().toISOString().split('T')[0],
                    size: res.size,
                  };
                  setMediaLibrary((prev) => [newMediaItem, ...prev]);
                }
                resolve({
                  url: res.url,
                  name: file.name,
                  type: res.type,
                  size: res.size,
                });
                return;
              }
              reject(new Error(res.error || 'Server rejected file upload.'));
              return;
            }

            try {
              const errRes = JSON.parse(xhr.responseText);
              reject(new Error(errRes.error || `Upload failed with status code ${xhr.status}.`));
            } catch {
              reject(new Error(`Upload failed with status code ${xhr.status}.`));
            }
          } catch {
            reject(new Error('Invalid response from server during upload.'));
          } finally {
            syncLockRef.current = false;
          }
        };

        xhr.onerror = () => {
          syncLockRef.current = false;
          reject(new Error('Network error during file upload. Please verify connectivity.'));
        };

        xhr.send(formData);
      } catch (error) {
        syncLockRef.current = false;
        reject(error instanceof Error ? error : new Error('Upload failed.'));
      }
    });
  };

  // Auth methods
  const loginAdmin = async (passcode: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passcode }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        setIsAdminAuthenticated(false);
        csrfTokenRef.current = null;
        return false;
      }

      const session = await refreshAdminSession();
      return Boolean(session);
    } catch {
      setIsAdminAuthenticated(false);
      csrfTokenRef.current = null;
      return false;
    }
  };

  const logoutAdmin = async (): Promise<void> => {
    try {
      const res = await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          ...(csrfTokenRef.current ? { 'X-CSRF-Token': csrfTokenRef.current } : {}),
        },
      });

      if (res.ok) {
        const sessionState = await refreshAdminSession();
        if (!sessionState) {
          setIsAdminAuthenticated(false);
        }
      }
    } catch {
      // Ignore logout errors and clear client state.
    } finally {
      csrfTokenRef.current = null;
      setIsAdminAuthenticated(false);
    }
  };

  // Config methods
  const updateConfig = (partial: Partial<SiteConfig>) => {
    setConfig((prev) => ({ ...prev, ...partial }));
  };

  const updateWhatsAppNumber = (num: string) => {
    setConfig((prev) => ({ ...prev, whatsappNumber: num }));
  };

  const updateBackgroundImage = (bg: Partial<BackgroundImageConfig>) => {
    setConfig((prev) => ({
      ...prev,
      backgroundImage: { ...prev.backgroundImage, ...bg },
    }));
  };

  const uploadCustomLogo = (dataUrl: string) => {
    setConfig((prev) => ({
      ...prev,
      customLogo: {
        ...prev.customLogo,
        customLogoUrl: dataUrl,
        lightLogoUrl: dataUrl,
      },
    }));
  };

  const uploadLightLogo = (url: string) => {
    setConfig((prev) => ({
      ...prev,
      customLogo: {
        ...prev.customLogo,
        lightLogoUrl: url,
        customLogoUrl: url,
      },
    }));
  };

  const uploadDarkLogo = (url: string) => {
    setConfig((prev) => ({
      ...prev,
      customLogo: {
        ...prev.customLogo,
        darkLogoUrl: url,
      },
    }));
  };

  const removeLightLogo = () => {
    setConfig((prev) => ({
      ...prev,
      customLogo: {
        ...prev.customLogo,
        lightLogoUrl: null,
        customLogoUrl: prev.customLogo?.darkLogoUrl || null,
      },
    }));
  };

  const removeDarkLogo = () => {
    setConfig((prev) => ({
      ...prev,
      customLogo: {
        ...prev.customLogo,
        darkLogoUrl: null,
      },
    }));
  };

  const uploadFavicon = (url: string) => {
    setConfig((prev) => ({
      ...prev,
      customLogo: {
        ...prev.customLogo,
        faviconUrl: url,
      },
    }));
    // Also update document link rel="icon"
    if (typeof document !== 'undefined') {
      const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
      if (link) link.href = url;
    }
  };

  const removeFavicon = () => {
    setConfig((prev) => ({
      ...prev,
      customLogo: {
        ...prev.customLogo,
        faviconUrl: null,
      },
    }));
  };

  const updateLogoScale = (scale: number) => {
    setConfig((prev) => ({
      ...prev,
      customLogo: {
        ...prev.customLogo,
        scale: Math.max(0.6, Math.min(2.0, scale)),
      },
    }));
  };

  const removeCustomLogo = () => {
    setConfig((prev) => ({
      ...prev,
      customLogo: {
        ...prev.customLogo,
        customLogoUrl: null,
        lightLogoUrl: null,
        darkLogoUrl: null,
        faviconUrl: null,
      },
    }));
  };

  // Menu methods
  const addMenuItem = (item: Omit<MenuItem, 'id' | 'order'>) => {
    const newItem: MenuItem = {
      ...item,
      id: `menu-${Date.now()}`,
      order: menuItems.length + 1,
    };
    setMenuItems((prev) => [...prev, newItem]);
  };

  const updateMenuItem = (id: string, partial: Partial<MenuItem>) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...partial } : item))
    );
  };

  const deleteMenuItem = (id: string) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
  };

  const reorderMenuItems = (items: MenuItem[]) => {
    setMenuItems(items);
  };

  // Service methods
  const addService = (service: Omit<ServiceItem, 'id'>) => {
    const newService: ServiceItem = {
      ...service,
      id: `service-${Date.now()}`,
      number: String(services.length + 1).padStart(2, '0'),
    };
    setServices((prev) => [...prev, newService]);
  };

  const updateService = (id: string, partial: Partial<ServiceItem>) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...partial } : s))
    );
  };

  const deleteService = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  // Portfolio methods
  const addPortfolio = (item: Omit<PortfolioItem, 'id'>) => {
    const newItem: PortfolioItem = {
      ...item,
      id: `proj-${Date.now()}`,
    };
    setPortfolio((prev) => [newItem, ...prev]);
  };

  const updatePortfolio = (id: string, partial: Partial<PortfolioItem>) => {
    setPortfolio((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...partial } : p))
    );
  };

  const deletePortfolio = (id: string) => {
    setPortfolio((prev) => prev.filter((p) => p.id !== id));
  };

  // Pricing methods
  const addPricePackage = (pkg: Omit<PricePackage, 'id' | 'order'>) => {
    const newPkg: PricePackage = {
      ...pkg,
      id: `pkg-${Date.now()}`,
      order: pricePackages.length + 1,
    };
    setPricePackages((prev) => [...prev, newPkg]);
  };

  const updatePricePackage = (id: string, partial: Partial<PricePackage>) => {
    setPricePackages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...partial } : p))
    );
  };

  const deletePricePackage = (id: string) => {
    setPricePackages((prev) => prev.filter((p) => p.id !== id));
  };

  // Client methods
  const addClient = (client: Omit<ClientItem, 'id'>) => {
    const newClient: ClientItem = {
      ...client,
      id: `client-${Date.now()}`,
    };
    setClients((prev) => [...prev, newClient]);
  };

  const updateClient = (id: string, partial: Partial<ClientItem>) => {
    setClients((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...partial } : c))
    );
  };

  const deleteClient = (id: string) => {
    setClients((prev) => prev.filter((c) => c.id !== id));
  };

  // Media methods
  const addMediaItem = (item: Omit<MediaItem, 'id' | 'createdAt'>) => {
    const newMedia: MediaItem = {
      ...item,
      id: `media-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setMediaLibrary((prev) => [newMedia, ...prev]);
  };

  const deleteMediaItem = (id: string) => {
    setMediaLibrary((prev) => prev.filter((m) => m.id !== id));
  };

  // WhatsApp link generator
  const getWhatsAppLink = (customMessage?: string) => {
    return buildWhatsAppUrl(config.whatsappNumber, customMessage);
  };

  // Reset to original defaults
  const resetToDefaults = () => {
    if (window.confirm('Reset all CMS content to original studio defaults?')) {
      const defaultPayload = {
        config: defaultSiteConfig,
        menuItems: defaultMenuItems,
        services: servicesData,
        portfolio: portfolioData,
        pricePackages: defaultPricePackages,
        clients: defaultClients,
        mediaLibrary: [],
      };

      setConfig(defaultSiteConfig);
      setMenuItems(defaultMenuItems);
      setServices(servicesData);
      setPortfolio(portfolioData);
      setPricePackages(defaultPricePackages);
      setClients(defaultClients);
      setMediaLibrary([]);
      localStorage.clear();

      refreshAdminSession().then((token) => {
        fetch('/api/data', {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'X-CSRF-Token': token } : {}),
          },
          body: JSON.stringify(defaultPayload),
        }).finally(() => {
          window.location.reload();
        });
      });
    }
  };

  return (
    <SiteConfigContext.Provider
      value={{
        config,
        updateConfig,
        updateWhatsAppNumber,
        updateBackgroundImage,
        uploadCustomLogo,
        removeCustomLogo,
        uploadFile,
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
        reorderMenuItems,
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
        isAdminAuthenticated,
        validateAdminSession,
        loginAdmin,
        logoutAdmin,
        getWhatsAppLink,
        resetToDefaults,
      }}
    >
      {children}
    </SiteConfigContext.Provider>
  );
};

export const useSiteConfig = (): SiteConfigContextType => {
  const context = useContext(SiteConfigContext);
  if (!context) {
    throw new Error('useSiteConfig must be used within a SiteConfigProvider');
  }
  return context;
};
