# Hila Graphic — Studio Portfolio & Creative Agency Website

Welcome to the full codebase of **Hila Graphic (هیله ګرافیک)**, a modern, bilingual (English & Pashto RTL) creative agency portfolio and studio website built with React 19, TypeScript, Tailwind CSS, Motion animations, and a full Express.js backend for content management and asset uploads.

---

## 🚀 Quick Start (Development)

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** (comes with Node.js) or **bun** / **yarn** / **pnpm**

### 2. Installation
Open your terminal in the project directory and run:
```bash
npm install
```

### 3. Run the Development Server
```bash
npm run dev
```
Open your browser and navigate to:
```
http://localhost:3000
```

---

## 📦 Production Build & Deployment

### Build the Full Project
To create an optimized production build:
```bash
npm run build
```
This will:
1. Compile the React frontend with Vite into the `dist/` directory.
2. Bundle the Express server (`server.ts`) into `dist/server.cjs`.

### Start the Production Server
```bash
npm run start
```

Production startup requires `NODE_ENV=production`, `DATABASE_URL`, `STORAGE_PROVIDER=r2` or `s3`, a valid object-storage bucket/access key/secret/public HTTPS URL, and a `SESSION_SECRET` of at least 32 characters. Set a strong `ADMIN_PASSWORD` for first-time setup; after the password is changed in the dashboard, its scrypt hash is stored in PostgreSQL. Production refuses to start with local JSON or local permanent media storage selected.

The hosting provider must inject its dynamic `PORT`; the server honors `HOST` and defaults it to `0.0.0.0`. Terminate HTTPS at the hosting provider or trusted reverse proxy. If proxy headers are used, set `TRUST_PROXY_HOPS` to the exact trusted hop count. Do not expose the Node process directly to the public internet without HTTPS.

PostgreSQL stores all CMS collections, admin sessions, and changed admin credentials. Shared PostgreSQL sessions allow admin authentication across stateless application instances. Uploaded files are streamed from temporary OS staging into the configured S3/R2 bucket; the staging files are removed after each upload. The app does not require persistent local storage for CMS data or uploaded media. Local fonts and build artifacts are deployed with the application.

Before migrating, configure the destination PostgreSQL and object-storage bucket, then run `npm run migrate:data` followed by `npm run migrate:media`. The data migration imports only when the destination CMS table is empty; the media migration updates PostgreSQL references and leaves the source uploads and JSON file untouched. Back up PostgreSQL and the source files before migration. These commands are not run automatically by deployment.

Configure automated PostgreSQL backups/PITR and object-storage versioning or replication at the providers. Application redeployment recovery depends on those provider-level backups; object-storage durability alone is not a substitute for versioning or a backup policy.

Admin sessions are held in process memory, so use one server instance unless a shared session store is added. Password changes persist as a scrypt hash in `.admin-credentials.json`; keep this file on persistent server storage and out of source control.

---

## 🌐 Deploying to Static Hosting (cPanel, Netlify, Vercel, Hostinger)

The static-only deployment below does not include the Express API, so admin login and CMS operations require a Node.js deployment using `npm start`.

If you wish to host the static website without running a Node.js server:
1. Run `npm run build`
2. All frontend files will be generated in the `dist/` directory (HTML, CSS, JS, and images).
3. Upload the entire contents of the `dist/` folder to your web hosting:
   - **cPanel / Apache**: Upload files into the `public_html` directory. Ensure `.htaccess` handles routing.
   - **Netlify**: Drag and drop the `dist/` folder into Netlify Drop.
   - **Vercel**: Connect your repository or run `vercel deploy --prod`.
   - **GitHub Pages**: Deploy the `dist/` folder via GitHub Actions or the `gh-pages` branch.

---

## 📂 Project Architecture

```text
├── data/
│   └── site-data.json      # Local-development fallback only; production uses PostgreSQL
├── public/
│   ├── uploads/            # Local-development fallback only; production uses object storage
│   └── ...                 # Static assets & icons
├── src/
│   ├── components/         # React UI modules (Hero, Navbar, Portfolio, Services, Pricing, Admin, Footer)
│   ├── config/             # Default site configuration & branding
│   ├── context/            # Theme, Language (EN/PS), and CMS State contexts
│   ├── data/               # Default projects, service tiers, and translations
│   ├── pages/              # Multi-page views (Portfolio, Services, Pricing, Orders)
│   ├── types/              # TypeScript interfaces & definitions
│   ├── utils/              # Helper utilities (WhatsApp dispatch, ZIP downloads)
│   ├── App.tsx             # Root application component
│   ├── main.tsx            # React DOM entry point
│   └── index.css           # Tailwind CSS imports & custom liquid-glass styles
├── server.ts               # Express API (media uploads, site data persistence, ZIP download)
├── index.html              # Main HTML entry point
├── package.json            # Project dependencies & build scripts
└── vite.config.ts          # Vite build configuration
```

---

## 🛡️ Admin Studio CMS
- To access the management portal, click the **Studio CMS** button in the website footer.
- For local development, set `ADMIN_PASSWORD` and `SESSION_SECRET` in `.env.local`. In production, configure both as server environment variables.
- Through the CMS, you can upload new logos, custom backgrounds, update WhatsApp order numbers, edit pricing, manage services, and download real-time backups.

---

## 📞 Support & Inquiries
- **Studio**: Hila Graphic (هیله ګرافیک)
- **WhatsApp**: Direct ordering available via the website button.
- **Created with**: React, TypeScript, Tailwind CSS, Motion, and Express.
