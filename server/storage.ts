import fs from 'node:fs/promises';
import path from 'node:path';
import { DeleteObjectCommand, HeadBucketCommand, ListObjectsV2Command, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

export const STORAGE_CATEGORIES = ['logos', 'backgrounds', 'services', 'portfolio', 'clients', 'founder', 'videos', 'documents', 'media'] as const;
export type StorageCategory = typeof STORAGE_CATEGORIES[number];

export interface StoredObject {
  key: string;
  url: string;
  filename: string;
  contentType: string;
  size: number;
  lastModified: string;
}

const mimeByExtension: Record<string, string> = {
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp',
  '.svg': 'image/svg+xml', '.mp4': 'video/mp4', '.webm': 'video/webm', '.mov': 'video/quicktime', '.pdf': 'application/pdf',
};

function encodePath(value: string) {
  return value.split('/').map(encodeURIComponent).join('/');
}

function normalizeObjectKey(value: string) {
  const normalized = value.replace(/\\/g, '/').replace(/^\/+/, '');
  const segments = normalized.split('/');
  if (!normalized || segments.some((segment) => !segment || segment === '.' || segment === '..' || !/^[a-zA-Z0-9_.-]+$/.test(segment))) {
    throw new Error('Invalid storage object key.');
  }
  return segments.join('/');
}

export class MediaStorage {
  readonly provider: 'local' | 's3';
  readonly localDirectory: string;
  private readonly publicBaseUrl: string | null;
  private readonly bucket: string | null;
  private readonly client: S3Client | null;

  constructor(projectRoot: string) {
    const configuredProvider = (process.env.STORAGE_PROVIDER || 'local').toLowerCase();
    if (!['local', 's3', 'r2'].includes(configuredProvider)) throw new Error('STORAGE_PROVIDER must be local, s3, or r2.');
    this.provider = configuredProvider === 'local' ? 'local' : 's3';
    this.localDirectory = path.resolve(process.env.UPLOAD_DIR || path.join(projectRoot, 'public', 'uploads'));
    if (this.provider === 'local') {
      this.publicBaseUrl = null;
      this.bucket = null;
      this.client = null;
      return;
    }

    const accountId = process.env.R2_ACCOUNT_ID;
    const endpoint = process.env.OBJECT_STORAGE_ENDPOINT || (configuredProvider === 'r2' && accountId ? `https://${accountId}.r2.cloudflarestorage.com` : undefined);
    const bucket = process.env.OBJECT_STORAGE_BUCKET || process.env.R2_BUCKET_NAME || process.env.S3_BUCKET_NAME;
    const accessKeyId = process.env.OBJECT_STORAGE_ACCESS_KEY_ID || process.env.R2_ACCESS_KEY_ID || process.env.S3_ACCESS_KEY_ID;
    const secretAccessKey = process.env.OBJECT_STORAGE_SECRET_ACCESS_KEY || process.env.R2_SECRET_ACCESS_KEY || process.env.S3_SECRET_ACCESS_KEY;
    const publicBaseUrl = process.env.OBJECT_STORAGE_PUBLIC_URL || process.env.R2_PUBLIC_URL || process.env.S3_PUBLIC_URL;
    const region = process.env.OBJECT_STORAGE_REGION || (configuredProvider === 'r2' ? 'auto' : 'us-east-1');

    if (!bucket || !accessKeyId || !secretAccessKey || !publicBaseUrl) {
      throw new Error('S3 storage requires OBJECT_STORAGE_BUCKET, OBJECT_STORAGE_ACCESS_KEY_ID, OBJECT_STORAGE_SECRET_ACCESS_KEY, and OBJECT_STORAGE_PUBLIC_URL.');
    }
    if (!/^https:\/\//i.test(publicBaseUrl)) throw new Error('OBJECT_STORAGE_PUBLIC_URL must use HTTPS.');

    this.bucket = bucket;
    this.publicBaseUrl = publicBaseUrl.replace(/\/+$/, '');
    this.client = new S3Client({
      region,
      ...(endpoint ? { endpoint } : {}),
      forcePathStyle: Boolean(endpoint),
      credentials: { accessKeyId, secretAccessKey },
    });
  }

  publicUrl(key: string) {
    const normalized = normalizeObjectKey(key);
    if (this.provider === 'local') return `/uploads/${encodePath(normalized)}`;
    return `${this.publicBaseUrl}/uploads/${encodePath(normalized)}`;
  }

  async putFile(sourcePath: string, key: string, contentType: string, filename: string): Promise<StoredObject> {
    const normalized = normalizeObjectKey(key);
    const stats = await fs.stat(sourcePath);
    if (this.provider === 'local') {
      const destination = this.resolveLocalPath(normalized);
      await fs.mkdir(path.dirname(destination), { recursive: true });
      await fs.copyFile(sourcePath, destination);
    } else {
      await this.client!.send(new PutObjectCommand({
        Bucket: this.bucket!,
        Key: `uploads/${normalized}`,
        Body: (await import('node:fs')).createReadStream(sourcePath),
        ContentLength: stats.size,
        ContentType: contentType,
        Metadata: { filename: filename.slice(0, 200) },
      }));
    }
    return { key: normalized, url: this.publicUrl(normalized), filename, contentType, size: stats.size, lastModified: new Date().toISOString() };
  }

  async putBuffer(buffer: Buffer, key: string, contentType: string, filename: string): Promise<StoredObject> {
    const normalized = normalizeObjectKey(key);
    if (this.provider === 'local') {
      const destination = this.resolveLocalPath(normalized);
      await fs.mkdir(path.dirname(destination), { recursive: true });
      await fs.writeFile(destination, buffer, { flag: 'wx' });
    } else {
      await this.client!.send(new PutObjectCommand({
        Bucket: this.bucket!, Key: `uploads/${normalized}`, Body: buffer,
        ContentLength: buffer.length, ContentType: contentType,
        Metadata: { filename: filename.slice(0, 200) },
      }));
    }
    return { key: normalized, url: this.publicUrl(normalized), filename, contentType, size: buffer.length, lastModified: new Date().toISOString() };
  }

  async delete(key: string) {
    const normalized = normalizeObjectKey(key);
    if (this.provider === 'local') {
      const target = this.resolveLocalPath(normalized);
      try { await fs.unlink(target); } catch (error) { if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error; }
      return;
    }
    await this.client!.send(new DeleteObjectCommand({ Bucket: this.bucket!, Key: `uploads/${normalized}` }));
  }

  async list(): Promise<StoredObject[]> {
    if (this.provider === 'local') return this.listLocal(this.localDirectory, '');
    const objects: StoredObject[] = [];
    let continuationToken: string | undefined;
    do {
      const page = await this.client!.send(new ListObjectsV2Command({ Bucket: this.bucket!, Prefix: 'uploads/', ContinuationToken: continuationToken }));
      for (const item of page.Contents || []) {
        if (!item.Key?.startsWith('uploads/') || item.Key.endsWith('/')) continue;
        const key = normalizeObjectKey(item.Key.slice('uploads/'.length));
        const extension = path.posix.extname(key).toLowerCase();
        objects.push({
          key,
          url: this.publicUrl(key),
          filename: key.split('/').pop() || key,
          contentType: mimeByExtension[extension] || 'application/octet-stream',
          size: item.Size || 0,
          lastModified: item.LastModified?.toISOString() || new Date(0).toISOString(),
        });
      }
      continuationToken = page.IsTruncated ? page.NextContinuationToken : undefined;
    } while (continuationToken);
    return objects.sort((a, b) => b.lastModified.localeCompare(a.lastModified));
  }

  async health() {
    if (this.provider === 'local') {
      await fs.mkdir(this.localDirectory, { recursive: true });
      await fs.access(this.localDirectory, fs.constants.W_OK);
      return 'local';
    }
    await this.client!.send(new HeadBucketCommand({ Bucket: this.bucket! }));
    return 's3-compatible';
  }

  localPath(key: string) {
    if (this.provider !== 'local') throw new Error('Local file access is unavailable for object storage.');
    return this.resolveLocalPath(key);
  }

  private resolveLocalPath(key: string) {
    const target = path.resolve(this.localDirectory, ...normalizeObjectKey(key).split('/'));
    if (!target.startsWith(this.localDirectory + path.sep)) throw new Error('Invalid local storage path.');
    return target;
  }

  private async listLocal(directory: string, prefix: string): Promise<StoredObject[]> {
    await fs.mkdir(directory, { recursive: true });
    const result: StoredObject[] = [];
    for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
      if (entry.name.startsWith('.')) continue;
      const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
      const filePath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        result.push(...await this.listLocal(filePath, relative));
      } else if (entry.isFile()) {
        const stat = await fs.stat(filePath);
        const extension = path.extname(entry.name).toLowerCase();
        result.push({ key: relative, url: this.publicUrl(relative), filename: entry.name, contentType: mimeByExtension[extension] || 'application/octet-stream', size: stat.size, lastModified: stat.mtime.toISOString() });
      }
    }
    return result;
  }
}
