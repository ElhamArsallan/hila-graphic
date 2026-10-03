import fs from 'node:fs/promises';
import { constants } from 'node:fs';
import path from 'node:path';
import { Pool, PoolClient } from 'pg';

const COLLECTIONS = ['menuItems', 'services', 'portfolio', 'pricePackages', 'clients', 'mediaLibrary'] as const;
type CollectionName = typeof COLLECTIONS[number];
export type SiteData = {
  config: Record<string, unknown>;
  menuItems: Record<string, unknown>[];
  services: Record<string, unknown>[];
  portfolio: Record<string, unknown>[];
  pricePackages: Record<string, unknown>[];
  clients: Record<string, unknown>[];
  mediaLibrary: Record<string, unknown>[];
};

export type AdminSessionRecord = {
  sessionId: string;
  createdAt: number;
  csrfToken: string;
};

export function isSiteData(value: unknown): value is SiteData {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const data = value as Record<string, unknown>;
  if (!data.config || typeof data.config !== 'object' || Array.isArray(data.config)) return false;
  return COLLECTIONS.every((name) => Array.isArray(data[name]) && (data[name] as unknown[]).every((record) => Boolean(record) && typeof record === 'object' && !Array.isArray(record)));
}

function normalizeRecordId(record: Record<string, unknown>, index: number) {
  if (typeof record.id === 'string' && record.id) return record.id;
  return `record-${index}`;
}

export class SiteDataStore {
  private readonly pool: Pool | null;
  private readonly filePath: string;
  readonly databaseBacked: boolean;

  constructor(filePath: string, databaseUrl?: string) {
    this.filePath = path.resolve(filePath);
    this.pool = databaseUrl ? new Pool({ connectionString: databaseUrl, max: 10, idleTimeoutMillis: 30_000, connectionTimeoutMillis: 10_000 }) : null;
    this.databaseBacked = Boolean(this.pool);
  }

  async initialize(): Promise<boolean> {
    if (!this.pool) {
      await fs.mkdir(path.dirname(this.filePath), { recursive: true });
      return false;
    }

    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS cms_records (
        collection text NOT NULL,
        record_id text NOT NULL,
        payload jsonb NOT NULL,
        updated_at timestamptz NOT NULL DEFAULT now(),
        PRIMARY KEY (collection, record_id)
      )
    `);
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS admin_sessions (
        session_id text PRIMARY KEY,
        created_at bigint NOT NULL,
        csrf_token text NOT NULL
      )
    `);
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS admin_credentials (
        credential_key text PRIMARY KEY,
        payload jsonb NOT NULL,
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `);
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS admin_rate_limits (
        bucket text NOT NULL,
        identifier text NOT NULL,
        window_started_at bigint NOT NULL,
        attempt_count integer NOT NULL,
        PRIMARY KEY (bucket, identifier)
      )
    `);
    await this.pool.query('CREATE INDEX IF NOT EXISTS admin_rate_limits_window_idx ON admin_rate_limits(window_started_at)');
    return this.importLegacyFileIfEmpty();
  }

  async get(): Promise<SiteData | null> {
    if (!this.pool) {
      try {
        const value: unknown = JSON.parse(await fs.readFile(this.filePath, 'utf8'));
        return isSiteData(value) ? value : null;
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null;
        throw error;
      }
    }

    const result = await this.pool.query<{ collection: string; record_id: string; payload: Record<string, unknown> }>(
      'SELECT collection, record_id, payload FROM cms_records ORDER BY collection, record_id'
    );
    if (!result.rowCount) return null;

    const data: SiteData = {
      config: {},
      menuItems: [],
      services: [],
      portfolio: [],
      pricePackages: [],
      clients: [],
      mediaLibrary: [],
    };
    for (const row of result.rows) {
      if (row.collection === 'config') data.config = row.payload;
      else if (COLLECTIONS.includes(row.collection as CollectionName)) {
        data[row.collection as CollectionName].push(row.payload);
      }
    }
    return data;
  }

  async save(data: SiteData) {
    if (!this.pool) {
      await fs.mkdir(path.dirname(this.filePath), { recursive: true });
      const temporaryPath = `${this.filePath}.${process.pid}.tmp`;
      try {
        await fs.writeFile(temporaryPath, JSON.stringify(data, null, 2), { encoding: 'utf8', mode: 0o600 });
        await fs.rename(temporaryPath, this.filePath);
      } catch (error) {
        await fs.rm(temporaryPath, { force: true }).catch(() => undefined);
        throw error;
      }
      return;
    }

    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('LOCK TABLE cms_records IN EXCLUSIVE MODE');
      await this.replaceRecords(client, data);
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK').catch(() => undefined);
      throw error;
    } finally {
      client.release();
    }
  }

  async importLegacyFileIfEmpty() {
    if (!this.pool) return false;
    let raw: string;
    try {
      raw = await fs.readFile(this.filePath, 'utf8');
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return false;
      throw error;
    }

    const legacyData: unknown = JSON.parse(raw);
    if (!isSiteData(legacyData)) throw new Error(`Legacy site data at ${this.filePath} has an unsupported structure.`);

    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('LOCK TABLE cms_records IN EXCLUSIVE MODE');
      const existing = await client.query('SELECT 1 FROM cms_records LIMIT 1');
      if (existing.rowCount) {
        await client.query('ROLLBACK');
        return false;
      }
      await this.replaceRecords(client, legacyData);
      await client.query('COMMIT');
      return true;
    } catch (error) {
      await client.query('ROLLBACK').catch(() => undefined);
      throw error;
    } finally {
      client.release();
    }
  }

  async health() {
    if (!this.pool) {
      await fs.access(path.dirname(this.filePath), constants.W_OK);
      return 'local-json';
    }
    await this.pool.query('SELECT 1');
    return 'postgres';
  }

  async close() {
    await this.pool?.end();
  }

  async createAdminSession(session: AdminSessionRecord) {
    if (!this.pool) throw new Error('Database-backed admin sessions are unavailable.');
    await this.pool.query(
      'INSERT INTO admin_sessions(session_id, created_at, csrf_token) VALUES ($1, $2, $3)',
      [session.sessionId, session.createdAt, session.csrfToken]
    );
  }

  async getAdminSession(sessionId: string): Promise<AdminSessionRecord | null> {
    if (!this.pool) throw new Error('Database-backed admin sessions are unavailable.');
    const result = await this.pool.query<{ session_id: string; created_at: string; csrf_token: string }>(
      'SELECT session_id, created_at, csrf_token FROM admin_sessions WHERE session_id = $1',
      [sessionId]
    );
    const row = result.rows[0];
    return row ? { sessionId: row.session_id, createdAt: Number(row.created_at), csrfToken: row.csrf_token } : null;
  }

  async deleteAdminSession(sessionId: string) {
    if (!this.pool) throw new Error('Database-backed admin sessions are unavailable.');
    await this.pool.query('DELETE FROM admin_sessions WHERE session_id = $1', [sessionId]);
  }

  async deleteAdminSessionsExcept(sessionId: string) {
    if (!this.pool) throw new Error('Database-backed admin sessions are unavailable.');
    const result = await this.pool.query('DELETE FROM admin_sessions WHERE session_id <> $1', [sessionId]);
    return result.rowCount || 0;
  }

  async deleteAllAdminSessions() {
    if (!this.pool) throw new Error('Database-backed admin sessions are unavailable.');
    await this.pool.query('DELETE FROM admin_sessions');
  }

  async countAdminSessions() {
    if (!this.pool) throw new Error('Database-backed admin sessions are unavailable.');
    const result = await this.pool.query<{ count: string }>('SELECT COUNT(*)::text AS count FROM admin_sessions');
    return Number(result.rows[0]?.count || 0);
  }

  async cleanupAdminSessions(expiredBefore: number) {
    if (!this.pool) throw new Error('Database-backed admin sessions are unavailable.');
    await this.pool.query('DELETE FROM admin_sessions WHERE created_at <= $1', [expiredBefore]);
  }

  async consumeAdminRateLimit(bucket: string, identifier: string, limit: number, windowMs: number, now: number) {
    if (!this.pool) throw new Error('Database-backed rate limits are unavailable.');
    const result = await this.pool.query<{ attempt_count: number }>(
      `INSERT INTO admin_rate_limits(bucket, identifier, window_started_at, attempt_count)
       VALUES ($1, $2, $3, 1)
       ON CONFLICT (bucket, identifier) DO UPDATE SET
         attempt_count = CASE WHEN $3 - admin_rate_limits.window_started_at > $4 THEN 1 ELSE admin_rate_limits.attempt_count + 1 END,
         window_started_at = CASE WHEN $3 - admin_rate_limits.window_started_at > $4 THEN $3 ELSE admin_rate_limits.window_started_at END
       RETURNING attempt_count`,
      [bucket, identifier, now, windowMs]
    );
    return Number(result.rows[0]?.attempt_count || 0) > limit;
  }

  async cleanupAdminRateLimits(expiredBefore: number) {
    if (!this.pool) throw new Error('Database-backed rate limits are unavailable.');
    await this.pool.query('DELETE FROM admin_rate_limits WHERE window_started_at <= $1', [expiredBefore]);
  }

  async getAdminPasswordCredential(): Promise<Record<string, unknown> | null> {
    if (!this.pool) return null;
    const result = await this.pool.query<{ payload: Record<string, unknown> }>(
      "SELECT payload FROM admin_credentials WHERE credential_key = 'admin-password'"
    );
    return result.rows[0]?.payload || null;
  }

  async setAdminPasswordCredential(credential: Record<string, unknown>) {
    if (!this.pool) throw new Error('Database-backed admin credentials are unavailable.');
    await this.pool.query(
      `INSERT INTO admin_credentials(credential_key, payload) VALUES ('admin-password', $1::jsonb)
       ON CONFLICT (credential_key) DO UPDATE SET payload = EXCLUDED.payload, updated_at = now()`,
      [JSON.stringify(credential)]
    );
  }

  private async replaceRecords(client: PoolClient, data: SiteData) {
    await client.query('DELETE FROM cms_records');
    await client.query(
      'INSERT INTO cms_records(collection, record_id, payload) VALUES ($1, $2, $3::jsonb)',
      ['config', 'site-config', JSON.stringify(data.config)]
    );
    for (const collection of COLLECTIONS) {
      const records = data[collection];
      for (let index = 0; index < records.length; index += 1) {
        await client.query(
          'INSERT INTO cms_records(collection, record_id, payload) VALUES ($1, $2, $3::jsonb)',
          [collection, normalizeRecordId(records[index], index), JSON.stringify(records[index])]
        );
      }
    }
  }
}
