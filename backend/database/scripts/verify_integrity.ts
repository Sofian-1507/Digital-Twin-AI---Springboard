import mongoose from 'mongoose';
import { atlasPool } from '../connections/atlas_pool';
import * as Models from '../models/index';

/**
 * Diagnostic Reference Integrity Verification Script.
 * Scans all collections with user_id foreign keys and confirms that the referenced parent user
 * exists in the 'users' collection. Detects orphaned records and broken relationships.
 */
async function verifyReferenceIntegrity(): Promise<void> {
  console.log('⏳ [IntegrityCheck] Connecting to MongoDB Atlas cluster...');
  await atlasPool.connect();

  console.log('🔍 [IntegrityCheck] Scanning collections for orphaned user_id references...');

  const collectionsToCheck: [string, mongoose.Model<any>][] = [
    ['financial_records', Models.FinancialRecord],
    ['study_activities', Models.StudyActivity],
    ['habit_tracking', Models.HabitTracking],
    ['simulations', Models.Simulation],
    ['recommendations', Models.Recommendation],
    ['chat_history', Models.ChatHistory],
    ['reports', Models.Report],
    ['dashboard_cache', Models.DashboardCache],
    ['goals (archive)', Models.GoalArchive],
  ];

  let totalOrphans = 0;
  let totalRecordsScanned = 0;

  for (const [name, model] of collectionsToCheck) {
    const records = await model.find({}, { _id: 1, user_id: 1 }).exec();
    totalRecordsScanned += records.length;

    const userIds = [...new Set(records.map((r) => r.user_id?.toString()).filter(Boolean))];
    if (userIds.length === 0) {
      console.log(`   ✔️  [${name}]: 0 records scanned. No orphans.`);
      continue;
    }

    const existingUsers = await Models.User.find({ _id: { $in: userIds } }, { _id: 1 }).exec();
    const existingUserIds = new Set(existingUsers.map((u) => u._id.toString()));

    let collectionOrphans = 0;
    for (const r of records) {
      if (r.user_id && !existingUserIds.has(r.user_id.toString())) {
        collectionOrphans++;
        totalOrphans++;
      }
    }

    if (collectionOrphans > 0) {
      console.warn(`   ⚠️  [${name}]: Found ${collectionOrphans} orphaned record(s) pointing to non-existent User IDs!`);
    } else {
      console.log(`   ✅ [${name}]: Scanned ${records.length} records. 100% Reference Integrity verified.`);
    }
  }

  console.log('\n📊 [IntegrityCheck] Verification Summary:');
  console.log(`   📌 Total Records Scanned: ${totalRecordsScanned}`);
  console.log(`   🚨 Total Orphaned Records Detected: ${totalOrphans}`);

  await atlasPool.disconnect();
  if (totalOrphans > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

if (require.main === module) {
  verifyReferenceIntegrity().catch((err) => {
    console.error('💥 [IntegrityCheck] Fatal error during reference verification:', err);
    process.exit(1);
  });
}

export { verifyReferenceIntegrity };
