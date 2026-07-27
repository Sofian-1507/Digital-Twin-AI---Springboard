import { synchronizeDatabaseIndexes } from '../indexes/sync_indexes';
import { atlasPool } from '../connections/atlas_pool';

/**
 * Migration 001: Initial Collection & Index Setup.
 * Establishes connection pool, creates collections if non-existent, and deploys all ESR indexes.
 */
async function runInitialSetup(): Promise<void> {
  console.log('🚀 [Migration 001] Starting initial database setup...');
  try {
    await synchronizeDatabaseIndexes();
    console.log('✅ [Migration 001] Initial database setup and index deployment completed successfully.');
  } catch (error) {
    console.error('❌ [Migration 001] Setup failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  runInitialSetup();
}

export { runInitialSetup };
