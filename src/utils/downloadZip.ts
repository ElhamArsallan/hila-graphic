/**
 * Robust website ZIP downloader for Hila Graphic.
 * 
 * Initiates download of:
 * 1. Full website source code, media uploads, CMS configurations, and server: `hila-graphic-full-website.zip`
 * 2. Pre-compiled ready-to-host website for cPanel, Netlify, Vercel, Hostinger: `hila-graphic-ready-to-host.zip`
 */

function triggerDirectDownload(primaryUrl: string, fallbackUrl: string, filename: string) {
  try {
    const link = document.createElement('a');
    link.href = primaryUrl;
    link.setAttribute('download', filename);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    
    setTimeout(() => {
      if (document.body.contains(link)) {
        document.body.removeChild(link);
      }
    }, 2000);
  } catch (err) {
    console.warn('Direct link failed, attempting location redirect fallback:', err);
    window.location.href = fallbackUrl;
  }
}

/**
 * Downloads the full website project:
 * - Complete TypeScript/React codebase (/src)
 * - All uploaded studio media & graphics (/public/uploads)
 * - Persistent Studio CMS data (/data/site-data.json)
 * - Express backend (/server.ts)
 * - Dependencies, configs, and setup documentation (README.md)
 */
export function downloadWebsiteZip() {
  triggerDirectDownload(
    '/api/download/full-website',
    '/hila-graphic-website.zip',
    'hila-graphic-full-website.zip'
  );
}

/**
 * Downloads the ready-to-host production website:
 * - Compiled HTML, optimized CSS, and JavaScript
 * - High-resolution uploaded graphics
 * - Server configuration files (.htaccess, _redirects, vercel.json)
 * - Hosting deployment instructions (README-HOSTING.txt)
 */
export function downloadReadyToHostZip() {
  triggerDirectDownload(
    '/api/download/ready-to-host',
    '/hila-graphic-ready-to-host.zip',
    'hila-graphic-ready-to-host.zip'
  );
}

/**
 * Fetches real-time status and sizes of website archives from the server.
 */
export async function getArchiveStatus() {
  try {
    const res = await fetch('/api/download/info', {
      credentials: 'same-origin',
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Ignore fallback
  }
  return null;
}
