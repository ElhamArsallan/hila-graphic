import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash, randomUUID } from 'node:crypto';
import { config as loadEnv } from 'dotenv';
import { fileTypeFromFile } from 'file-type';
import { SiteDataStore } from '../server/data-store';
import { MediaStorage } from '../server/storage';

for (const file of ['.env.local', '.env']) loadEnv({ path: path.resolve(process.cwd(), file) });

const contentTypeByExtension: Record<string, string> = {
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp',
  '.mp4': 'video/mp4', '.webm': 'video/webm', '.mov': 'video/quicktime', '.pdf': 'application/pdf', '.svg': 'image/svg+xml',
};

async function listFiles(directory: string, prefix = ''): Promise<string[]> {
  const result: string[] = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    const fullPath = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) continue;
    if (entry.isDirectory()) result.push(...await listFiles(fullPath, relative));
    else if (entry.isFile()) result.push(relative);
  }
  return result;
}

function rewriteUploads(value: unknown, urls: Map<string, string>): unknown {
  if (typeof value === 'string') {
    let result = value;
    for (const [localUrl, publicUrl] of urls) {
      if (result === localUrl || result.startsWith(`${localUrl}?`)) {
        result = `${publicUrl}${result.slice(localUrl.length)}`;
        break;
      }
    }
    return result;
  }
  if (Array.isArray(value)) return value.map((item) => rewriteUploads(item, urls));
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, rewriteUploads(item, urls)]));
  }
  return value;
}

async function main() {
  if (!process.env.DATABASE_URL) throw new Error('Set DATABASE_URL before running the media migration.');
  const projectRoot = process.cwd();
  const uploadDirectory = path.resolve(process.env.UPLOAD_DIR || path.join(projectRoot, 'public', 'uploads'));
  const dataDirectory = path.resolve(process.env.DATA_DIR || path.join(projectRoot, 'data'));
  const dataFile = path.resolve(process.env.DATA_FILE_PATH || path.join(dataDirectory, 'site-data.json'));
  const mediaStorage = new MediaStorage(projectRoot);
  if (mediaStorage.provider !== 's3') throw new Error('Set STORAGE_PROVIDER=s3 or r2 and configure an HTTPS public URL before migrating media.');

  const store = new SiteDataStore(dataFile, process.env.DATABASE_URL);
  try {
    await store.initialize();
    const currentData = await store.get();
    if (!currentData) throw new Error('No saved site data was found to update. Local files were not modified.');

    const urls = new Map<string, string>();
    let uploaded = 0;
    const migrationPrefix = `legacy-migration/${randomUUID()}`;
    for (const relativePath of await listFiles(uploadDirectory)) {
      const extension = path.extname(relativePath).toLowerCase();
      const expectedType = contentTypeByExtension[extension];
      if (!expectedType) throw new Error(`Unsupported existing upload extension: ${extension || '(none)'}`);
      const sourcePath = path.join(uploadDirectory, ...relativePath.split('/'));
      let contentType = expectedType;
      if (extension === '.svg') {
        const sample = (await fs.readFile(sourcePath)).subarray(0, 8192).toString('utf8');
        if (!/<svg(?:\s|>)/i.test(sample) || /<!DOCTYPE|<!ENTITY|<script\b|\son\w+\s*=/i.test(sample)) throw new Error(`Unsafe SVG cannot be migrated: ${path.basename(relativePath)}`);
      } else {
        const detected = await fileTypeFromFile(sourcePath);
        if (detected?.mime !== expectedType) throw new Error(`File signature mismatch: ${path.basename(relativePath)}`);
        contentType = detected.mime;
      }
      const safeFilename = path.basename(relativePath).replace(/[^a-zA-Z0-9_.-]/g, '_').slice(0, 120) || 'asset';
      const pathHash = createHash('sha256').update(relativePath).digest('hex').slice(0, 16);
      const migrationKey = `${migrationPrefix}/${pathHash}-${safeFilename}`;
      const stored = await mediaStorage.putFile(sourcePath, migrationKey, contentType, path.basename(relativePath));
      const encodedPath = relativePath.split('/').map(encodeURIComponent).join('/');
      urls.set(`/uploads/${encodedPath}`, stored.url);
      uploaded += 1;
    }

    const updatedData = rewriteUploads(currentData, urls);
    await store.save(updatedData as typeof currentData);
    console.log(JSON.stringify({ status: 'complete', uploaded, referencesUpdated: urls.size, localFilesRetained: true }));
  } finally {
    await store.close();
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : 'Media migration failed.');
  process.exitCode = 1;
});
