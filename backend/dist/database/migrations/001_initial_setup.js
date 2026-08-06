"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runInitialSetup = runInitialSetup;
const sync_indexes_1 = require("../indexes/sync_indexes");
/**
 * Migration 001: Initial Collection & Index Setup.
 * Establishes connection pool, creates collections if non-existent, and deploys all ESR indexes.
 */
async function runInitialSetup() {
    console.log('🚀 [Migration 001] Starting initial database setup...');
    try {
        await (0, sync_indexes_1.synchronizeDatabaseIndexes)();
        console.log('✅ [Migration 001] Initial database setup and index deployment completed successfully.');
    }
    catch (error) {
        console.error('❌ [Migration 001] Setup failed:', error);
        process.exit(1);
    }
}
if (require.main === module) {
    runInitialSetup();
}
