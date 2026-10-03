import express from 'express';
import path from 'path';
import fs from 'fs';
import os from 'node:os';
import crypto from 'node:crypto';
import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';
import { config as loadEnv } from 'dotenv';
import * as archiver from 'archiver';
import { createServer as createViteServer } from 'vite';
import multer from 'multer';
import { fileTypeFromFile } from 'file-type';
import { MediaStorage, STORAGE_CATEGORIES } from './server/storage';
import { isSiteData, SiteDataStore } from './server/data-store';

const IS_PRODUCTION = process.env.NODE_ENV === 'production' || path.basename(process.argv[1] || '') === 'server.cjs';
if (!IS_PRODUCTION) {
  const environmentFiles = ['.env.local', '.env']
    .map((file) => path.resolve(process.cwd(), file))
    .filter((file) => fs.existsSync(file));
  for (const file of environmentFiles) {
    loadEnv({ path: file });
  }
}

declare global {
  namespace Express {
    interface Request {
      adminSession?: {
        sessionId: string;
        createdAt: number;
        csrfToken: string;
      };
    }
  }
}

const app = express();
const rawPort = process.env.PORT;
const parsedPort = rawPort && /^\d+$/.test(rawPort) ? Number(rawPort) : Number.NaN;
const isPortValid = !rawPort || (Number.isInteger(parsedPort) && parsedPort > 0 && parsedPort <= 65535);
const DEFAULT_PORT = isPortValid && rawPort ? parsedPort : 3000;
const HOST = process.env.HOST?.trim() || '0.0.0.0';
if (IS_PRODUCTION && !isPortValid) {
  throw new Error('PORT must be a valid integer between 1 and 65535.');
}
const TRUST_PROXY_HOPS = process.env.TRUST_PROXY_HOPS;
if (TRUST_PROXY_HOPS && /^\d+$/.test(TRUST_PROXY_HOPS)) {
  app.set('trust proxy', Number(TRUST_PROXY_HOPS));
}
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const SESSION_SECRET = process.env.SESSION_SECRET;
if (IS_PRODUCTION) assertProductionEnvironment();
const ADMIN_SESSION_COOKIE = 'hila_admin_session';
const CSRF_COOKIE_NAME = 'hila_admin_csrf';
const SESSION_TTL_MS = 1000 * 60 * 60 * 8;
const ADMIN_CREDENTIAL_PATH = path.resolve(process.env.ADMIN_CREDENTIAL_PATH || path.join(process.cwd(), '.admin-credentials.json'));
const PRIVATE_DOWNLOAD_DIR = path.resolve(process.env.PRIVATE_DOWNLOAD_DIR || path.join(process.cwd(), '.admin-downloads'));
type AdminPasswordCredential = { algorithm: 'scrypt'; salt: string; hash: string };
const sessionStore = new Map<string, { createdAt: number; csrfToken: string }>();
const loginAttempts = new Map<string, { count: number; windowStart: number }>();
const uploadAttempts = new Map<string, { count: number; windowStart: number }>();
let lastRateLimitCleanupAt = 0;

function loadAdminPasswordCredential() {
  if (!fs.existsSync(ADMIN_CREDENTIAL_PATH)) {
    return { credential: null as AdminPasswordCredential | null, invalid: false };
  }

  try {
    const value = JSON.parse(fs.readFileSync(ADMIN_CREDENTIAL_PATH, 'utf8')) as Partial<AdminPasswordCredential>;
    if (
      value.algorithm !== 'scrypt' ||
      typeof value.salt !== 'string' || !/^[a-f0-9]{32}$/i.test(value.salt) ||
      typeof value.hash !== 'string' || !/^[a-f0-9]{128}$/i.test(value.hash)
    ) {
      return { credential: null, invalid: true };
    }
    return { credential: value as AdminPasswordCredential, invalid: false };
  } catch {
    return { credential: null, invalid: true };
  }
}

const loadedAdminCredential = IS_PRODUCTION
  ? { credential: null as AdminPasswordCredential | null, invalid: false }
  : loadAdminPasswordCredential();
let adminPasswordCredential = loadedAdminCredential.credential;
let adminCredentialInvalid = loadedAdminCredential.invalid;

function parseCookieHeader(header?: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (!header) return cookies;

  for (const part of header.split(';')) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const equalIndex = trimmed.indexOf('=');
    const key = equalIndex >= 0 ? trimmed.slice(0, equalIndex) : trimmed;
    const value = equalIndex >= 0 ? trimmed.slice(equalIndex + 1) : '';
    try {
      cookies[key] = decodeURIComponent(value);
    } catch {
      cookies[key] = '';
    }
  }

  return cookies;
}

function signValue(value: string) {
  if (!SESSION_SECRET) {
    return crypto.createHash('sha256').update(value).digest('hex');
  }

  return crypto.createHmac('sha256', SESSION_SECRET).update(value).digest('hex');
}

function normalizeFilename(filename: string) {
  const base = path.basename(filename || 'upload');
  return base.replace(/[^a-zA-Z0-9_.-]/g, '_').slice(0, 120);
}

function isPublicAddress(address: string) {
  const version = isIP(address);
  if (version === 4) {
    const parts = address.split('.').map(Number);
    const [first, second, third] = parts;
    return !(
      first === 0 || first === 10 || first === 127 || first >= 224 ||
      (first === 100 && second >= 64 && second <= 127) ||
      (first === 169 && second === 254) ||
      (first === 172 && second >= 16 && second <= 31) ||
      (first === 192 && second === 168) ||
      (first === 192 && second === 0 && (third === 0 || third === 2)) ||
      (first === 198 && (second === 18 || second === 19 || (second === 51 && third === 100))) ||
      (first === 203 && second === 0 && third === 113)
    );
  }
  if (version === 6) {
    const normalized = address.toLowerCase();
    return (normalized.startsWith('2') || normalized.startsWith('3')) &&
      !normalized.startsWith('2001:db8:') && !normalized.startsWith('2001:2:');
  }
  return false;
}

async function validateRemoteAssetUrl(value: string) {
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.username || url.password || (url.port && url.port !== '443')) {
    throw new Error('Remote asset URL is not permitted.');
  }

  const hostname = url.hostname.replace(/^\[|\]$/g, '');
  const addresses = isIP(hostname)
    ? [{ address: hostname }]
    : await lookup(hostname, { all: true, verbatim: true });
  if (!addresses.length || addresses.some(({ address }) => !isPublicAddress(address))) {
    throw new Error('Remote asset destination is not public.');
  }
  return url;
}

function getClientIp(req: express.Request) {
  return req.ip || req.socket.remoteAddress || 'unknown';
}

async function isLoginRateLimited(req: express.Request) {
  const ip = getClientIp(req);
  const current = Date.now();
  if (siteDataStore.databaseBacked) {
    if (current - lastRateLimitCleanupAt > 5 * 60_000) {
      await siteDataStore.cleanupAdminRateLimits(current - 10 * 60_000);
      lastRateLimitCleanupAt = current;
    }
    return siteDataStore.consumeAdminRateLimit('login', ip, 8, 60_000, current);
  }
  for (const [attemptIp, attempt] of loginAttempts) {
    if (current - attempt.windowStart > 60_000) loginAttempts.delete(attemptIp);
  }

  const existing = loginAttempts.get(ip);

  if (!existing) {
    if (loginAttempts.size >= 10_000) return true;
    loginAttempts.set(ip, { count: 1, windowStart: current });
    return false;
  }

  if (current - existing.windowStart > 60_000) {
    loginAttempts.set(ip, { count: 1, windowStart: current });
    return false;
  }

  if (existing.count >= 8) {
    return true;
  }

  loginAttempts.set(ip, { count: existing.count + 1, windowStart: existing.windowStart });
  return false;
}

async function isUploadRateLimited(req: express.Request) {
  const ip = getClientIp(req);
  const current = Date.now();
  if (siteDataStore.databaseBacked) {
    if (current - lastRateLimitCleanupAt > 5 * 60_000) {
      await siteDataStore.cleanupAdminRateLimits(current - 10 * 60_000);
      lastRateLimitCleanupAt = current;
    }
    return siteDataStore.consumeAdminRateLimit('upload', ip, 40, 10 * 60_000, current);
  }
  for (const [attemptIp, attempt] of uploadAttempts) {
    if (current - attempt.windowStart > 10 * 60_000) uploadAttempts.delete(attemptIp);
  }
  const existing = uploadAttempts.get(ip);
  if (!existing || current - existing.windowStart > 10 * 60_000) {
    if (uploadAttempts.size >= 10_000) return true;
    uploadAttempts.set(ip, { count: 1, windowStart: current });
    return false;
  }
  if (existing.count >= 40) return true;
  uploadAttempts.set(ip, { count: existing.count + 1, windowStart: existing.windowStart });
  return false;
}

function setAdminCookies(res: express.Response, sessionId: string, csrfToken: string) {
  const secure = IS_PRODUCTION ? '; Secure' : '';
  const cookieOptions = `Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_TTL_MS / 1000}${secure}`;
  const csrfOptions = `Path=/; SameSite=Lax; Max-Age=${SESSION_TTL_MS / 1000}${secure}`;

  res.setHeader('Set-Cookie', [
    `${ADMIN_SESSION_COOKIE}=${sessionId};${cookieOptions}`,
    `${CSRF_COOKIE_NAME}=${csrfToken};${csrfOptions}`,
  ]);
}

function clearAdminCookies(res: express.Response) {
  const expired = 'Thu, 01 Jan 1970 00:00:00 GMT';
  const secure = IS_PRODUCTION ? '; Secure' : '';
  res.setHeader('Set-Cookie', [
    `${ADMIN_SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Expires=${expired}${secure}`,
    `${CSRF_COOKIE_NAME}=; Path=/; SameSite=Lax; Max-Age=0; Expires=${expired}${secure}`,
  ]);
}

async function getSessionFromRequest(req: express.Request) {
  const cookies = parseCookieHeader(req.headers.cookie);
  const rawSession = cookies[ADMIN_SESSION_COOKIE];
  if (!rawSession) return null;

  const [sessionId, signature, extraPart] = rawSession.split('.');
  if (!sessionId || !signature || extraPart || !/^[a-f0-9]{64}$/i.test(sessionId) || !/^[a-f0-9]{64}$/i.test(signature)) {
    return null;
  }
  const expectedSignature = Buffer.from(signValue(sessionId), 'hex');
  const providedSignature = Buffer.from(signature, 'hex');
  if (providedSignature.length !== expectedSignature.length || !crypto.timingSafeEqual(providedSignature, expectedSignature)) {
    return null;
  }

  const session = siteDataStore.databaseBacked
    ? await siteDataStore.getAdminSession(sessionId)
    : sessionStore.get(sessionId);
  if (!session) return null;
  if (Date.now() - session.createdAt > SESSION_TTL_MS) {
    if (siteDataStore.databaseBacked) await siteDataStore.deleteAdminSession(sessionId);
    else sessionStore.delete(sessionId);
    return null;
  }

  return { ...session, sessionId };
}

function verifyCsrfToken(req: express.Request, session: { csrfToken: string }) {
  const headerToken = Array.isArray(req.headers['x-csrf-token'])
    ? req.headers['x-csrf-token'][0]
    : req.headers['x-csrf-token'];

  const token = typeof headerToken === 'string' ? headerToken : '';
  if (!token) return false;

  const expected = Buffer.from(session.csrfToken);
  const provided = Buffer.from(token);

  if (provided.length !== expected.length) return false;
  return crypto.timingSafeEqual(provided, expected);
}

function verifyAdminPassword(submittedPassword: string, configuredPassword: string) {
  const submitted = Buffer.from(submittedPassword);
  const configured = Buffer.from(configuredPassword);
  return submitted.length === configured.length && crypto.timingSafeEqual(submitted, configured);
}

function deriveAdminPasswordHash(password: string, salt: Buffer) {
  return new Promise<Buffer>((resolve, reject) => {
    crypto.scrypt(password, salt, 64, { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 }, (error, key) => {
      if (error) reject(error);
      else resolve(key as Buffer);
    });
  });
}

async function verifyConfiguredAdminPassword(password: string) {
  if (adminCredentialInvalid) return false;
  const storedCredential = siteDataStore.databaseBacked
    ? await siteDataStore.getAdminPasswordCredential()
    : adminPasswordCredential;
  const credential = storedCredential as Partial<AdminPasswordCredential> | null;
  if (!credential) {
    return Boolean(ADMIN_PASSWORD) && verifyAdminPassword(password, ADMIN_PASSWORD || '');
  }
  if (
    credential.algorithm !== 'scrypt' ||
    typeof credential.salt !== 'string' || !/^[a-f0-9]{32}$/i.test(credential.salt) ||
    typeof credential.hash !== 'string' || !/^[a-f0-9]{128}$/i.test(credential.hash)
  ) return false;

  try {
    const expected = Buffer.from(credential.hash, 'hex');
    const provided = await deriveAdminPasswordHash(password, Buffer.from(credential.salt, 'hex'));
    return provided.length === expected.length && crypto.timingSafeEqual(provided, expected);
  } catch {
    return false;
  }
}

async function cleanupExpiredSessions() {
  const now = Date.now();
  if (siteDataStore.databaseBacked) {
    await siteDataStore.cleanupAdminSessions(now - SESSION_TTL_MS);
    return;
  }
  for (const [sessionId, session] of sessionStore) {
    if (now - session.createdAt > SESSION_TTL_MS) sessionStore.delete(sessionId);
  }
}

async function persistAdminPasswordCredential(credential: AdminPasswordCredential) {
  if (siteDataStore.databaseBacked) {
    await siteDataStore.setAdminPasswordCredential(credential);
    return;
  }
  const temporaryPath = `${ADMIN_CREDENTIAL_PATH}.tmp`;
  try {
    await fs.promises.writeFile(temporaryPath, JSON.stringify(credential), { encoding: 'utf8', mode: 0o600 });
    await fs.promises.rename(temporaryPath, ADMIN_CREDENTIAL_PATH);
  } catch (error) {
    await fs.promises.rm(temporaryPath, { force: true }).catch(() => undefined);
    throw error;
  }
}

function isStrongAdminPassword(password: string) {
  const categories = [/[a-z]/.test(password), /[A-Z]/.test(password), /[0-9]/.test(password), /[^A-Za-z0-9]/.test(password)];
  return password.length >= 12 && password.length <= 128 && categories.filter(Boolean).length >= 3;
}

function assertProductionEnvironment() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required in production.');
  if (!['s3', 'r2'].includes((process.env.STORAGE_PROVIDER || '').toLowerCase())) {
    throw new Error('Set STORAGE_PROVIDER to s3 or r2 in production.');
  }
  if (!SESSION_SECRET || SESSION_SECRET.length < 32) {
    throw new Error('SESSION_SECRET must contain at least 32 characters in production.');
  }
  if (ADMIN_PASSWORD && !isStrongAdminPassword(ADMIN_PASSWORD)) {
    throw new Error('ADMIN_PASSWORD must be 12-128 characters and use at least three character types.');
  }
  if (TRUST_PROXY_HOPS && !/^\d+$/.test(TRUST_PROXY_HOPS)) {
    throw new Error('TRUST_PROXY_HOPS must be a non-negative integer.');
  }
}

async function requireAdminAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      if (!verifyCsrfToken(req, session)) {
        return res.status(403).json({ error: 'Invalid security token.' });
      }
    }

    req.adminSession = session;
    return next();
  } catch {
    return res.status(503).json({ error: 'Authentication service unavailable.' });
  }
}

async function listenOnAvailablePort(startPort: number, maxAttempts = 20): Promise<number> {
  for (let port = startPort; port < startPort + maxAttempts; port += 1) {
    const server = app.listen(port, HOST);
    const result = await new Promise<{ error?: NodeJS.ErrnoException }>((resolve) => {
      server.once('listening', () => resolve({}));
      server.once('error', (error: NodeJS.ErrnoException) => resolve({ error }));
    });
    if (!result.error) return port;
    if (result.error.code !== 'EADDRINUSE') throw result.error;
    if (IS_PRODUCTION) throw result.error;
  }

  throw new Error(`No available port found starting at ${startPort}.`);
}

// Ensure upload, data, and fonts directories exist
const uploadDir = path.resolve(process.env.UPLOAD_DIR || path.join(process.cwd(), 'public', 'uploads'));
const dataDir = path.resolve(process.env.DATA_DIR || path.join(process.cwd(), 'data'));
const DATA_FILE_PATH = path.resolve(process.env.DATA_FILE_PATH || path.join(dataDir, 'site-data.json'));
const fontsDir = path.resolve(process.env.FONTS_DIR || path.join(process.cwd(), 'public', 'fonts'));
const mediaStorage = new MediaStorage(process.cwd());
const siteDataStore = new SiteDataStore(DATA_FILE_PATH, process.env.DATABASE_URL);
const uploadStagingDir = path.resolve(process.env.UPLOAD_STAGING_DIR || path.join(os.tmpdir(), 'hila-graphic-upload-staging'));

if (mediaStorage.provider === 'local' && !fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
if (!process.env.DATABASE_URL && !fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
if (!fs.existsSync(uploadStagingDir)) {
  fs.mkdirSync(uploadStagingDir, { recursive: true });
}
// Multer storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadStagingDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanName = normalizeFilename(path.basename(file.originalname, ext)).replace(/\.[^/.]+$/, '');
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e5)}`;
    cb(null, `${uniqueSuffix}-${cleanName}${ext}`);
  },
});

const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.mp4', '.webm', '.mov', '.pdf'];
const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(ext)) {
      cb(null, true);
      return;
    }

    cb(new Error(`Unsupported file format "${ext}". Supported: JPG, PNG, WEBP, SVG, MP4, WEBM, MOV, PDF`));
  },
});

const uploadMimeByExtension: Record<string, string> = {
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp',
  '.mp4': 'video/mp4', '.webm': 'video/webm', '.mov': 'video/quicktime', '.pdf': 'application/pdf',
};

async function getVerifiedUploadContentType(filePath: string, extension: string) {
  if (extension === '.svg') {
    const handle = await fs.promises.open(filePath, 'r');
    const prefix = Buffer.alloc(8192);
    let bytesRead = 0;
    try { ({ bytesRead } = await handle.read(prefix, 0, prefix.length, 0)); } finally { await handle.close(); }
    const header = prefix.toString('utf8', 0, bytesRead);
    return /<svg(?:\s|>)/i.test(header) && !/<!DOCTYPE|<!ENTITY|<script\b|\son\w+\s*=/i.test(header) ? 'image/svg+xml' : null;
  }

  const expectedType = uploadMimeByExtension[extension];
  const detectedType = await fileTypeFromFile(filePath);
  return expectedType && detectedType?.mime === expectedType ? expectedType : null;
}

function getUploadCategory(value: unknown, contentType: string) {
  if (typeof value === 'string' && (STORAGE_CATEGORIES as readonly string[]).includes(value)) return value;
  if (contentType.startsWith('video/')) return 'videos';
  if (contentType === 'application/pdf') return 'documents';
  return 'media';
}

app.disable('x-powered-by');
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  if (IS_PRODUCTION) {
    res.setHeader('Content-Security-Policy', "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https:; media-src 'self' data: blob: https:; connect-src 'self' https: wss:; form-action 'self' https://wa.me");
    if (req.secure) res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  next();
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

if (mediaStorage.provider === 'local') {
  app.use('/uploads', express.static(uploadDir, {
    setHeaders: (res, filePath) => {
      if (path.extname(filePath).toLowerCase() === '.svg') {
        res.setHeader('Content-Security-Policy', "default-src 'none'; style-src 'unsafe-inline'; sandbox");
      }
      if (path.extname(filePath).toLowerCase() === '.pdf') {
        res.setHeader('Content-Disposition', 'attachment');
      }
    },
  }));
} else {
  app.use('/uploads', (req, res) => {
    try {
      const objectKey = (req.path || '').replace(/^\/+/, '');
      if (!objectKey) return res.status(404).end();
      return res.redirect(302, mediaStorage.publicUrl(objectKey));
    } catch {
      return res.status(404).end();
    }
  });
}
app.use('/fonts', express.static(fontsDir, { maxAge: '30d' }));

app.get('/api/health', async (req, res) => {
  try {
    await Promise.all([siteDataStore.health(), mediaStorage.health()]);
    return res.json({ status: 'ok' });
  } catch {
    return res.status(503).json({ status: 'degraded' });
  }
});

app.get('/api/fonts/status', (req, res) => {
  const expectedFonts = [
    'RokhFaNum-HairLine.woff2',
    'RokhFaNum-Thin.woff2',
    'RokhFaNum-ExtraLight.woff2',
    'RokhFaNum-Light.woff2',
    'RokhFaNum-Normal.woff2',
    'RokhFaNum-Regular.woff2',
    'RokhFaNum-Medium.woff2',
    'RokhFaNum-SemiBold.woff2',
    'RokhFaNum-Bold.woff2',
    'RokhFaNum-ExtraBold.woff2',
    'RokhFaNum-UltraBold.woff2',
    'RokhFaNum-Black.woff2',
  ];

  const status = expectedFonts.map((filename) => {
    const filePath = path.join(fontsDir, filename);
    const exists = fs.existsSync(filePath);
    return {
      filename,
      installed: exists,
      size: exists ? `${(fs.statSync(filePath).size / 1024).toFixed(1)} KB` : null,
    };
  });

  const totalInstalled = status.filter((s) => s.installed).length;
  res.json({
    fontsDirectory: 'public/fonts',
    installedCount: totalInstalled,
    totalExpected: expectedFonts.length,
    allInstalled: totalInstalled === expectedFonts.length,
    fonts: status,
  });
});

app.get('/api/admin/session', async (req, res) => {
  try {
    const session = await getSessionFromRequest(req);
    return res.json({ authenticated: Boolean(session) });
  } catch {
    return res.status(503).json({ error: 'Authentication service unavailable.' });
  }
});

app.get('/api/admin/security', requireAdminAuth, async (req, res) => {
  try {
    await cleanupExpiredSessions();
    const session = req.adminSession!;
    return res.json({
      authenticated: true,
      sessionCreatedAt: session.createdAt,
      sessionExpiresAt: session.createdAt + SESSION_TTL_MS,
      activeSessions: siteDataStore.databaseBacked ? await siteDataStore.countAdminSessions() : sessionStore.size,
    });
  } catch {
    return res.status(503).json({ error: 'Authentication service unavailable.' });
  }
});

app.post('/api/admin/sessions/revoke-others', requireAdminAuth, async (req, res) => {
  try {
    const currentSessionId = req.adminSession!.sessionId;
    let revokedSessions = 0;
    if (siteDataStore.databaseBacked) {
      revokedSessions = await siteDataStore.deleteAdminSessionsExcept(currentSessionId);
    } else {
      for (const sessionId of sessionStore.keys()) {
        if (sessionId !== currentSessionId) {
          sessionStore.delete(sessionId);
          revokedSessions += 1;
        }
      }
    }
    return res.json({ success: true, revokedSessions });
  } catch {
    return res.status(503).json({ error: 'Authentication service unavailable.' });
  }
});

app.post('/api/admin/sessions/revoke-all', requireAdminAuth, async (_req, res) => {
  try {
    if (siteDataStore.databaseBacked) await siteDataStore.deleteAllAdminSessions();
    else sessionStore.clear();
    clearAdminCookies(res);
    return res.json({ success: true });
  } catch {
    return res.status(503).json({ error: 'Authentication service unavailable.' });
  }
});

app.post('/api/admin/password', requireAdminAuth, async (req, res) => {
  const currentPassword = typeof req.body?.currentPassword === 'string' ? req.body.currentPassword : '';
  const newPassword = typeof req.body?.newPassword === 'string' ? req.body.newPassword : '';
  const confirmNewPassword = typeof req.body?.confirmNewPassword === 'string' ? req.body.confirmNewPassword : '';

  if (currentPassword.length > 128 || newPassword.length > 128 || confirmNewPassword.length > 128) {
    return res.status(400).json({ error: 'Password fields must not exceed 128 characters.' });
  }
  if (!(await verifyConfiguredAdminPassword(currentPassword))) {
    return res.status(401).json({ error: 'Current password is incorrect.' });
  }
  if (!newPassword || newPassword !== confirmNewPassword) {
    return res.status(400).json({ error: 'New password confirmation does not match.' });
  }
  if (!isStrongAdminPassword(newPassword)) {
    return res.status(400).json({ error: 'Use 12-128 characters and at least three character types.' });
  }
  if (verifyAdminPassword(newPassword, currentPassword)) {
    return res.status(400).json({ error: 'Choose a different password.' });
  }

  try {
    const salt = crypto.randomBytes(16);
    const hash = await deriveAdminPasswordHash(newPassword, salt);
    const credential: AdminPasswordCredential = {
      algorithm: 'scrypt',
      salt: salt.toString('hex'),
      hash: hash.toString('hex'),
    };
    await persistAdminPasswordCredential(credential);
    adminPasswordCredential = credential;
    adminCredentialInvalid = false;
    if (siteDataStore.databaseBacked) await siteDataStore.deleteAllAdminSessions();
    else sessionStore.clear();
    clearAdminCookies(res);
    return res.json({ success: true, sessionsRevoked: true });
  } catch {
    return res.status(500).json({ error: 'Unable to save the password change.' });
  }
});

app.post('/api/admin/login', async (req, res) => {
  try {
    if (await isLoginRateLimited(req)) {
      return res.status(429).json({ error: 'Too many attempts. Please try again shortly.' });
    }

    const databaseCredential = siteDataStore.databaseBacked
      ? await siteDataStore.getAdminPasswordCredential()
      : null;
    if ((!ADMIN_PASSWORD && !adminPasswordCredential && !databaseCredential) || !SESSION_SECRET || adminCredentialInvalid) {
      return res.status(503).json({ error: 'Authentication is not configured.' });
    }

    const submittedPassword = typeof req.body?.password === 'string' ? req.body.password : '';
    if (submittedPassword.length > 128) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    if (!(await verifyConfiguredAdminPassword(submittedPassword))) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    loginAttempts.delete(getClientIp(req));
    await cleanupExpiredSessions();
    const sessionId = crypto.randomBytes(32).toString('hex');
    const csrfToken = crypto.randomBytes(32).toString('hex');
    const adminSession = { sessionId, createdAt: Date.now(), csrfToken };
    if (siteDataStore.databaseBacked) await siteDataStore.createAdminSession(adminSession);
    else sessionStore.set(sessionId, { createdAt: adminSession.createdAt, csrfToken });
    const signedSessionId = `${sessionId}.${signValue(sessionId)}`;
    setAdminCookies(res, signedSessionId, csrfToken);
    return res.json({ success: true });
  } catch {
    return res.status(503).json({ error: 'Authentication service unavailable.' });
  }
});

app.post('/api/admin/logout', async (req, res) => {
  try {
    const session = await getSessionFromRequest(req);
    if (session) {
      if (!verifyCsrfToken(req, session)) {
        return res.status(403).json({ error: 'Invalid security token.' });
      }
      if (siteDataStore.databaseBacked) await siteDataStore.deleteAdminSession(session.sessionId);
      else sessionStore.delete(session.sessionId);
    }

    clearAdminCookies(res);
    return res.json({ success: true });
  } catch {
    return res.status(503).json({ error: 'Authentication service unavailable.' });
  }
});

app.post('/api/upload', requireAdminAuth, async (req, res) => {
  try {
    if (await isUploadRateLimited(req)) return res.status(429).json({ error: 'Upload rate limit reached. Please try again shortly.' });
  } catch {
    return res.status(503).json({ error: 'Upload service unavailable.' });
  }
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File exceeds 100MB size limit.' });
      }
      return res.status(400).json({ error: `Upload error: ${err.message}` });
    }
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file provided.' });
    }

    const stagedFile = req.file;
    void (async () => {
      try {
        const ext = path.extname(stagedFile.originalname).toLowerCase();
        const contentType = await getVerifiedUploadContentType(stagedFile.path, ext);
        if (!contentType) {
          await fs.promises.rm(stagedFile.path, { force: true });
          return res.status(400).json({ error: 'File content does not match its supported extension.' });
        }
        const category = getUploadCategory(req.body?.category, contentType);
        const key = `${category}/${stagedFile.filename}`;
        const stored = await mediaStorage.putFile(stagedFile.path, key, contentType, stagedFile.originalname);
        const type = contentType === 'application/pdf' ? 'document' : contentType.startsWith('video/') ? 'video' : 'image';
        return res.json({ success: true, url: stored.url, key: stored.key, filename: stored.filename, originalName: stagedFile.originalname, contentType, size: `${(stagedFile.size / (1024 * 1024)).toFixed(2)} MB`, bytes: stagedFile.size, type });
      } catch (error) {
        console.error(JSON.stringify({ level: 'error', event: 'upload_store_failed', message: error instanceof Error ? error.message : 'unknown' }));
        return res.status(500).json({ error: 'Unable to store uploaded file.' });
      } finally {
        await fs.promises.rm(stagedFile.path, { force: true }).catch(() => undefined);
      }
    })();
  });
});

app.get('/api/data', async (req, res) => {
  try {
    const data = await siteDataStore.get();
    if (data) return res.json({ exists: true, data });
    return res.json({ exists: false });
  } catch (err) {
    console.error(JSON.stringify({ level: 'error', event: 'site_data_read_failed', message: err instanceof Error ? err.message : 'unknown' }));
    return res.status(500).json({ error: 'Failed to read site data' });
  }
});

app.post('/api/data', requireAdminAuth, async (req, res) => {
  if (!isSiteData(req.body)) return res.status(400).json({ error: 'Invalid site data payload.' });
  try {
    await siteDataStore.save(req.body);
    return res.json({ success: true, timestamp: new Date().toISOString() });
  } catch (err) {
    console.error(JSON.stringify({ level: 'error', event: 'site_data_write_failed', message: err instanceof Error ? err.message : 'unknown' }));
    return res.status(500).json({ error: 'Failed to save site data' });
  }
});

app.get('/api/media', requireAdminAuth, async (req, res) => {
  try {
    const objects = await mediaStorage.list();
    const files = objects
      .filter((object) => object.contentType !== 'application/pdf')
      .map((object) => {
        const isVideo = object.contentType.startsWith('video/');
        return {
          id: `media-${object.key}`,
          name: object.filename,
          filename: object.key,
          url: object.url,
          type: isVideo ? 'video' : 'image',
          size: `${(object.size / (1024 * 1024)).toFixed(2)} MB`,
          bytes: object.size,
          createdAt: object.lastModified.split('T')[0],
        };
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    return res.json({ files });
  } catch (err) {
    console.error(JSON.stringify({ level: 'error', event: 'media_list_failed', message: err instanceof Error ? err.message : 'unknown' }));
    return res.status(500).json({ error: 'Failed to list media files' });
  }
});

app.delete('/api/media/*', requireAdminAuth, async (req, res) => {
  try {
    const objectKey = String(req.params[0] || '');
    await mediaStorage.delete(objectKey);
    return res.json({ success: true, deleted: objectKey });
  } catch (err) {
    const invalidKey = err instanceof Error && err.message.includes('Invalid storage object key');
    if (!invalidKey) console.error(JSON.stringify({ level: 'error', event: 'media_delete_failed', message: err instanceof Error ? err.message : 'unknown' }));
    return res.status(invalidKey ? 400 : 404).json({ error: invalidKey ? 'Invalid media key.' : 'File not found.' });
  }
});

app.post('/api/drive/import', requireAdminAuth, async (req, res) => {
  try {
    const url = req.body?.url;
    const name = req.body?.name;
    if (typeof url !== 'string' || !url.trim() || url.length > 2048 || (name !== undefined && typeof name !== 'string')) {
      return res.status(400).json({ error: 'Valid URL is required.' });
    }

    let targetDownloadUrl = url.trim();
    const driveRegex = /(?:https?:\/\/)?drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?id=)([a-zA-Z0-9_-]+)/;
    const match = targetDownloadUrl.match(driveRegex);
    if (match && match[1]) {
      const fileId = match[1];
      targetDownloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    }

    let fetchRes: Response | null = null;
    for (let redirectCount = 0; redirectCount <= 5; redirectCount += 1) {
      let safeUrl: URL;
      try {
        safeUrl = await validateRemoteAssetUrl(targetDownloadUrl);
      } catch {
        return res.status(400).json({ error: 'Remote asset URL is not permitted.' });
      }
      fetchRes = await fetch(safeUrl, {
        redirect: 'manual',
        signal: AbortSignal.timeout(15_000),
        headers: { 'User-Agent': 'Hila Graphic media importer' },
      });
      if (![301, 302, 303, 307, 308].includes(fetchRes.status)) break;
      const redirectLocation = fetchRes.headers.get('location');
      if (!redirectLocation || redirectCount === 5) {
        return res.status(400).json({ error: 'Remote asset redirect is not permitted.' });
      }
      targetDownloadUrl = new URL(redirectLocation, safeUrl).toString();
    }

    if (!fetchRes || !fetchRes.ok) {
      return res.status(400).json({ error: `Could not download asset from remote URL (HTTP ${fetchRes.status})` });
    }

    const contentLength = Number(fetchRes.headers.get('content-length'));
    const maxBytes = 100 * 1024 * 1024;
    if (Number.isFinite(contentLength) && contentLength > maxBytes) {
      return res.status(413).json({ error: 'Remote asset exceeds the 100MB size limit.' });
    }

    const contentType = (fetchRes.headers.get('content-type') || '').split(';')[0].trim().toLowerCase();
    let ext = '.jpg';
    if (contentType === 'image/png') ext = '.png';
    else if (contentType === 'image/webp') ext = '.webp';
    else if (contentType === 'image/svg+xml') ext = '.svg';
    else if (contentType === 'video/mp4') ext = '.mp4';
    else if (contentType === 'video/webm') ext = '.webm';
    else if (!['image/jpeg', 'image/jpg'].includes(contentType)) {
      return res.status(400).json({ error: 'Unsupported remote asset type.' });
    }

    const cleanName = normalizeFilename((name || 'cloud_asset').slice(0, 120).replace(/\.[^/.]+$/, '')).replace(/\.[^/.]+$/, '');
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e5)}`;
    const savedFilename = `${uniqueSuffix}-${cleanName}${ext}`;

    if (!fetchRes.body) return res.status(400).json({ error: 'Remote asset has no content.' });
    const reader = fetchRes.body.getReader();
    const chunks: Uint8Array[] = [];
    let totalBytes = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.length;
      if (totalBytes > maxBytes) {
        await reader.cancel();
        return res.status(413).json({ error: 'Remote asset exceeds the 100MB size limit.' });
      }
      chunks.push(value);
    }
    const buffer = Buffer.concat(chunks, totalBytes);
    const stored = await mediaStorage.putBuffer(buffer, `media/${savedFilename}`, contentType, `${cleanName}${ext}`);

    const isVideo = ext === '.mp4' || ext === '.webm';
    return res.json({
      success: true,
      url: stored.url,
      key: stored.key,
      filename: savedFilename,
      name: `${cleanName}${ext}`,
      type: isVideo ? 'video' : 'image',
      size: `${(buffer.length / (1024 * 1024)).toFixed(2)} MB`,
    });
  } catch {
    return res.status(500).json({ error: 'Remote asset import failed.' });
  }
});

const sourceZipPath = path.join(PRIVATE_DOWNLOAD_DIR, 'hila-graphic-website.zip');
const readyZipPath = path.join(PRIVATE_DOWNLOAD_DIR, 'hila-graphic-ready-to-host.zip');

async function createSourceZipFile(): Promise<string> {
  const rootDir = process.cwd();
  fs.mkdirSync(PRIVATE_DOWNLOAD_DIR, { recursive: true });
  const output = fs.createWriteStream(sourceZipPath);
  const archive = new archiver.ZipArchive({ zlib: { level: 9 } });

  return new Promise((resolve, reject) => {
    output.on('close', () => resolve(sourceZipPath));
    archive.on('error', (err: any) => reject(err));
    archive.pipe(output);

    if (fs.existsSync(path.join(rootDir, 'src'))) {
      archive.directory(path.join(rootDir, 'src'), 'src');
    }

    if (fs.existsSync(uploadDir)) {
      archive.glob('**/*', {
        cwd: path.join(rootDir, 'public'),
        ignore: ['*.zip'],
      }, { prefix: 'public' });
    }

    if (fs.existsSync(dataDir)) {
      archive.directory(dataDir, 'data');
    }

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

async function createReadyToHostZipFile(): Promise<string> {
  const rootDir = process.cwd();
  const distDir = path.join(rootDir, 'dist');
  fs.mkdirSync(PRIVATE_DOWNLOAD_DIR, { recursive: true });
  const output = fs.createWriteStream(readyZipPath);
  const archive = new archiver.ZipArchive({ zlib: { level: 9 } });

  return new Promise((resolve, reject) => {
    output.on('close', () => resolve(readyZipPath));
    archive.on('error', (err: any) => reject(err));
    archive.pipe(output);

    if (fs.existsSync(path.join(distDir, 'index.html'))) {
      archive.file(path.join(distDir, 'index.html'), { name: 'index.html' });
    } else {
      archive.file(path.join(rootDir, 'index.html'), { name: 'index.html' });
    }

    if (fs.existsSync(path.join(distDir, 'assets'))) {
      archive.directory(path.join(distDir, 'assets'), 'assets');
    }

    if (fs.existsSync(uploadDir)) {
      archive.directory(uploadDir, 'uploads');
    }

    if (fs.existsSync(fontsDir)) {
      archive.directory(fontsDir, 'fonts');
    }

    const htaccess = `<IfModule mod_rewrite.c>
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
    archive.append(htaccess, { name: '.htaccess' });
    archive.append('/*    /index.html   200\n', { name: '_redirects' });
    archive.append(JSON.stringify({ rewrites: [{ source: '/(.*)', destination: '/index.html' }] }, null, 2), { name: 'vercel.json' });

    const instructions = `=====================================================
HILA GRAPHIC — READY-TO-HOST FULL WEBSITE
=====================================================
This static package does not include the Express API or admin CMS functionality.

1. cPanel / Apache / Hostinger:
   - Extract files into "public_html".
   - The included .htaccess automatically handles routing for all pages.

2. Netlify:
   - Drag and drop this folder into https://app.netlify.com/drop

3. Vercel:
   - Deploy using the Vercel CLI ("vercel deploy --prod") or GitHub integration.

Contact Hila Graphic via WhatsApp for any assistance!
`;
    archive.append(instructions, { name: 'README-HOSTING.txt' });

    archive.finalize();
  });
}

function serveAdminArchive(filePath: string, filename: string, createArchive: () => Promise<string>) {
  return async (_req: express.Request, res: express.Response) => {
    try {
      if (!fs.existsSync(filePath)) await createArchive();
      return res.download(filePath, filename, (error) => {
        if (error && !res.headersSent) res.status(500).json({ error: 'Failed to send website archive.' });
      });
    } catch {
      if (!res.headersSent) return res.status(500).json({ error: 'Failed to prepare website archive.' });
    }
  };
}

app.get('/hila-graphic-website.zip', requireAdminAuth, serveAdminArchive(sourceZipPath, 'hila-graphic-full-website.zip', createSourceZipFile));
app.get('/hila-graphic-ready-to-host.zip', requireAdminAuth, serveAdminArchive(readyZipPath, 'hila-graphic-ready-to-host.zip', createReadyToHostZipFile));

app.get('/api/download/full-website', requireAdminAuth, async (req, res) => {
  try {
    if (!fs.existsSync(sourceZipPath) || req.query.fresh === 'true') {
      await createSourceZipFile();
    }
    return res.download(sourceZipPath, 'hila-graphic-full-website.zip', (err) => {
      if (err && !res.headersSent) {
        res.status(500).json({ error: 'Failed to download full website archive' });
      }
    });
  } catch (err: any) {
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to generate website archive.' });
    }
  }
});

app.get('/api/download/ready-to-host', requireAdminAuth, async (req, res) => {
  try {
    if (!fs.existsSync(readyZipPath) || req.query.fresh === 'true') {
      await createReadyToHostZipFile();
    }
    return res.download(readyZipPath, 'hila-graphic-ready-to-host.zip', (err) => {
      if (err && !res.headersSent) {
        res.status(500).json({ error: 'Failed to download ready-to-host archive' });
      }
    });
  } catch (err: any) {
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to generate website archive.' });
    }
  }
});

app.get('/api/download/info', requireAdminAuth, (req, res) => {
  try {
    const sourceExists = fs.existsSync(sourceZipPath);
    const readyExists = fs.existsSync(readyZipPath);

    return res.json({
      fullWebsite: {
        ready: sourceExists,
        size: sourceExists ? `${(fs.statSync(sourceZipPath).size / (1024 * 1024)).toFixed(2)} MB` : 'Not generated yet',
        bytes: sourceExists ? fs.statSync(sourceZipPath).size : 0,
        url: '/api/download/full-website',
      },
      readyToHost: {
        ready: readyExists,
        size: readyExists ? `${(fs.statSync(readyZipPath).size / (1024 * 1024)).toFixed(2)} MB` : 'Not generated yet',
        bytes: readyExists ? fs.statSync(readyZipPath).size : 0,
        url: '/api/download/ready-to-host',
      },
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Unable to read download status.' });
  }
});

async function startServer() {
  const importedLegacyData = await siteDataStore.initialize();
  if (IS_PRODUCTION) {
    const storedCredential = await siteDataStore.getAdminPasswordCredential();
    const validStoredCredential = storedCredential?.algorithm === 'scrypt' &&
      typeof storedCredential.salt === 'string' && /^[a-f0-9]{32}$/i.test(storedCredential.salt) &&
      typeof storedCredential.hash === 'string' && /^[a-f0-9]{128}$/i.test(storedCredential.hash);
    if (storedCredential && !validStoredCredential) throw new Error('Stored admin password credential is invalid.');
    if (!storedCredential && !isStrongAdminPassword(ADMIN_PASSWORD || '')) {
      throw new Error('Set a strong ADMIN_PASSWORD or provision an admin credential in PostgreSQL.');
    }
  }
  await mediaStorage.health();
  console.log(JSON.stringify({ level: 'info', event: 'storage_ready', dataProvider: process.env.DATABASE_URL ? 'postgres' : 'local-json', mediaProvider: mediaStorage.provider, importedLegacyData }));
  app.use('/api', (req, res) => res.status(404).json({ error: 'Not found.' }));

  if (!IS_PRODUCTION) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(['/server.cjs', '/server.cjs.map'], (_req, res) => res.sendStatus(404));
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.use((error: { status?: number }, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (res.headersSent) return next(error);
    const errorStatus = error.status;
    const status = Number.isInteger(errorStatus) && errorStatus! >= 400 && errorStatus! < 500 ? errorStatus! : 500;
    return res.status(status).json({ error: status < 500 ? 'Invalid request.' : 'Request failed.' });
  });

  const port = await listenOnAvailablePort(DEFAULT_PORT);
  if (port !== DEFAULT_PORT) {
    console.log(`Port ${DEFAULT_PORT} is busy; Hila Graphic Server is listening on ${HOST}:${port}`);
  } else {
    console.log(`Hila Graphic Server listening on ${HOST}:${port}`);
  }
}

startServer().catch((error: unknown) => {
  console.error(JSON.stringify({ level: 'fatal', event: 'server_start_failed', message: error instanceof Error ? error.message : 'unknown' }));
  process.exitCode = 1;
});
