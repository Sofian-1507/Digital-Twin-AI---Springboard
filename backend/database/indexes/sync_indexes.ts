import mongoose from 'mongoose';
import { atlasPool } from '../connections/atlas_pool';
import * as Models from '../models/index';
import { indexRegistry } from './index_registry';

/**
 * Idempotent CLI Index Synchronization Script.
 * Iterates through all compiled Mongoose ODM models and invokes Model.syncIndexes().
 * This guarantees that MongoDB Atlas index structures match the declarative TypeScript schemas exactly without downtime.
 */
async function synchronizeDatabaseIndexes(): Promise<void> {
  console.log('⏳ [IndexSync] Connecting to MongoDB Atlas cluster...');
  await atlasPool.connect();

  console.log(`🚀 [IndexSync] Starting index synchronization across ${Object.keys(Models).length} models and registry...`);
  let successCount = 0;
  let failCount = 0;

  const modelMap: Record<string, mongoose.Model<any>> = {
    User: Models.User,
    FinancialRecord: Models.FinancialRecord,
    StudyActivity: Models.StudyActivity,
    HabitTracking: Models.HabitTracking,
    Simulation: Models.Simulation,
    Recommendation: Models.Recommendation,
    ChatHistory: Models.ChatHistory,
    Report: Models.Report,
    AnalyticsLog: Models.AnalyticsLog,
    DashboardCache: Models.DashboardCache,
    GoalArchive: Models.GoalArchive,
  };

  for (const [modelName, model] of Object.entries(modelMap)) {
    if (!model || !model.syncIndexes) continue;
    try {
      console.log(`📡 [IndexSync] Synchronizing indexes for collection: '${model.collection.name}' (${modelName})...`);
      const result = await model.syncIndexes();
      console.log(`   ✅ Synchronized: ${JSON.stringify(result || 'No index drift detected.')}`);
      successCount++;
    } catch (error: any) {
      console.error(`   ❌ Failed to sync indexes for ${modelName}:`, error.message || error);
      failCount++;
    }
  }

  console.log('\n📊 [IndexSync] Summary Report:');
  console.log(`   🎯 Models Successfully Synced: ${successCount}`);
  console.log(`   ⚠️ Synchronization Failures: ${failCount}`);
  console.log(`   📌 Total Declarative Indexes in Registry: ${indexRegistry.length}`);

  await atlasPool.disconnect();
  if (failCount > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

// Execute CLI script if run directly
if (require.main === module) {
  synchronizeDatabaseIndexes().catch((err) => {
    console.error('💥 [IndexSync] Fatal error during synchronization:', err);
    process.exit(1);
  });
}

export { synchronizeDatabaseIndexes };
