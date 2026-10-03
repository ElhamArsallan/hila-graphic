import path from 'node:path';
import { config as loadEnv } from 'dotenv';
import { SiteDataStore } from '../server/data-store';

for (const file of ['.env.local', '.env']) loadEnv({ path: path.resolve(process.cwd(), file) });

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error('Set DATABASE_URL before running the legacy site-data migration.');
  const projectRoot = process.cwd();
  const dataDirectory = path.resolve(process.env.DATA_DIR || path.join(projectRoot, 'data'));
  const dataFile = path.resolve(process.env.DATA_FILE_PATH || path.join(dataDirectory, 'site-data.json'));
  const store = new SiteDataStore(dataFile, databaseUrl);
  try {
    const imported = await store.initialize();
    const data = await store.get();
    console.log(JSON.stringify({
      status: imported ? 'imported' : data ? 'already-present-no-overwrite' : 'no-legacy-data',
      sourceRetained: true,
      counts: data ? {
        menuItems: data.menuItems.length,
        services: data.services.length,
        portfolio: data.portfolio.length,
        pricePackages: data.pricePackages.length,
        clients: data.clients.length,
        mediaLibrary: data.mediaLibrary.length,
      } : null,
    }));
  } finally {
    await store.close();
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : 'Site-data migration failed.');
  process.exitCode = 1;
});
