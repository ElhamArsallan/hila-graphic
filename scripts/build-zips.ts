import fs from 'fs';
import path from 'path';
import * as archiver from 'archiver';

const rootDir = process.cwd();
const publicDir = path.join(rootDir, 'public');
const distDir = path.join(rootDir, 'dist');
const privateDownloadDir = path.join(rootDir, '.admin-downloads');

async function createSourceZip(): Promise<void> {
  const outputPath = path.join(privateDownloadDir, 'hila-graphic-website.zip');
  console.log('Generating full source website zip at:', outputPath);

  const output = fs.createWriteStream(outputPath);
  const archive = new archiver.ZipArchive({ zlib: { level: 9 } });

  return new Promise((resolve, reject) => {
    output.on('close', () => {
      console.log(`Full website zip created (${(archive.pointer() / 1024).toFixed(1)} KB)`);
      resolve();
    });
    archive.on('error', (err: any) => reject(err));

    archive.pipe(output);

    // Add source code
    if (fs.existsSync(path.join(rootDir, 'src'))) {
      archive.directory(path.join(rootDir, 'src'), 'src');
    }

    // Add public directory (excluding existing zips to avoid recursion)
    if (fs.existsSync(publicDir)) {
      archive.glob('**/*', {
        cwd: publicDir,
        ignore: ['*.zip'],
      }, { prefix: 'public' });
    }

    // Add custom CMS data directory
    if (fs.existsSync(path.join(rootDir, 'data'))) {
      archive.directory(path.join(rootDir, 'data'), 'data');
    }

    // Add root project files
    const rootFiles = [
      'index.html',
      'package.json',
      'server.ts',
      'tsconfig.json',
      'vite.config.ts',
      'metadata.json',
      '.env.example',
      '.gitignore',
      'README.md',
    ];

    for (const file of rootFiles) {
      const filePath = path.join(rootDir, file);
      if (fs.existsSync(filePath)) {
        archive.file(filePath, { name: file });
      }
    }

    archive.finalize();
  });
}

async function createReadyToHostZip(): Promise<void> {
  const outputPath = path.join(privateDownloadDir, 'hila-graphic-ready-to-host.zip');
  console.log('Generating ready-to-host website zip at:', outputPath);

  const output = fs.createWriteStream(outputPath);
  const archive = new archiver.ZipArchive({ zlib: { level: 9 } });

  return new Promise((resolve, reject) => {
    output.on('close', () => {
      console.log(`Ready-to-host zip created (${(archive.pointer() / 1024).toFixed(1)} KB)`);
      resolve();
    });
    archive.on('error', (err: any) => reject(err));

    archive.pipe(output);

    // If dist doesn't exist yet, we include static index.html and public assets
    if (fs.existsSync(path.join(distDir, 'index.html'))) {
      archive.file(path.join(distDir, 'index.html'), { name: 'index.html' });
    } else {
      archive.file(path.join(rootDir, 'index.html'), { name: 'index.html' });
    }

    if (fs.existsSync(path.join(distDir, 'assets'))) {
      archive.directory(path.join(distDir, 'assets'), 'assets');
    }

    // Include uploads directory
    const uploadsDir = path.join(publicDir, 'uploads');
    if (fs.existsSync(uploadsDir)) {
      archive.directory(uploadsDir, 'uploads');
    }

    // Include fonts directory
    const fontsDir = path.join(publicDir, 'fonts');
    if (fs.existsSync(fontsDir)) {
      archive.directory(fontsDir, 'fonts');
    }

    // Include .htaccess for cPanel / Apache
    const htaccessContent = `<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json image/svg+xml
</IfModule>
`;
    archive.append(htaccessContent, { name: '.htaccess' });

    // Include _redirects for Netlify / Cloudflare Pages
    archive.append('/*    /index.html   200\n', { name: '_redirects' });

    // Include vercel.json for Vercel
    const vercelConfig = JSON.stringify({
      rewrites: [{ source: '/(.*)', destination: '/index.html' }]
    }, null, 2);
    archive.append(vercelConfig, { name: 'vercel.json' });

    // Include README-HOSTING.txt instructions
    const readmeContent = `=====================================================
HILA GRAPHIC — READY-TO-HOST WEBSITE PACKAGE
=====================================================

This package contains the pre-compiled, high-performance production website.
No Node.js, terminal, or build tools are required.
It is a public static website package and does not include the Express API or admin CMS functionality.

HOW TO DEPLOY:

1. CPANEL / HOSTINGER / APACHE:
   - Log into your hosting cPanel File Manager.
   - Navigate to "public_html" (or your domain folder).
   - Upload and extract all files from this ZIP directly into "public_html".
   - Make sure "index.html", "assets/", and "uploads/" are in public_html.
   - The included .htaccess file handles page routing automatically.

2. NETLIFY:
   - Go to https://app.netlify.com/drop
   - Drag and drop this extracted folder.
   - Your site is live in seconds with HTTPS!

3. VERCEL:
   - Run "vercel deploy --prod" or connect your GitHub repository.
   - The included "vercel.json" handles routing.

4. LOCAL PREVIEW:
   - You can run a simple local server using Python or any tool:
     python3 -m http.server 8080
   - Open http://localhost:8080 in your web browser.

Need support or custom edits? Contact Hila Graphic directly via WhatsApp!
`;
    archive.append(readmeContent, { name: 'README-HOSTING.txt' });

    archive.finalize();
  });
}

async function run() {
  try {
    fs.mkdirSync(privateDownloadDir, { recursive: true });
    await createSourceZip();
    await createReadyToHostZip();
    for (const filename of ['hila-graphic-website.zip', 'hila-graphic-ready-to-host.zip']) {
      fs.rmSync(path.join(distDir, filename), { force: true });
    }
    console.log('Website ZIP archives prepared for authenticated downloads.');
  } catch (err) {
    console.error('Failed to create zips:', err);
    process.exit(1);
  }
}

run();
