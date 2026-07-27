import fs from 'fs';
import path from 'path';
import { atlasPool } from '../connections/atlas_pool';
import * as Models from '../models/index';

/**
 * Automated CLI Development Database Seeder.
 * Wipes existing development collections and populates mock Indian user profiles,
 * financial ledgers, academic study activities, and biometric habit logs.
 */
async function seedDatabase(): Promise<void> {
  console.log('⏳ [Seeder] Connecting to MongoDB Atlas development cluster...');
  await atlasPool.connect();

  console.log('🧹 [Seeder] Cleaning existing development collections...');
  await Promise.all([
    Models.User.deleteMany({}),
    Models.FinancialRecord.deleteMany({}),
    Models.StudyActivity.deleteMany({}),
    Models.HabitTracking.deleteMany({}),
    Models.Simulation.deleteMany({}),
    Models.Recommendation.deleteMany({}),
    Models.ChatHistory.deleteMany({}),
    Models.Report.deleteMany({}),
    Models.AnalyticsLog.deleteMany({}),
    Models.DashboardCache.deleteMany({}),
    Models.GoalArchive.deleteMany({}),
  ]);

  console.log('🌱 [Seeder] Loading mock seed data from JSON files...');
  const usersData = JSON.parse(fs.readFileSync(path.join(__dirname, 'seed_data/mock_users.json'), 'utf-8'));
  const financeData = JSON.parse(fs.readFileSync(path.join(__dirname, 'seed_data/mock_finance.json'), 'utf-8'));
  const studyData = JSON.parse(fs.readFileSync(path.join(__dirname, 'seed_data/mock_study.json'), 'utf-8'));
  const habitsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'seed_data/mock_habits.json'), 'utf-8'));

  console.log('📥 [Seeder] Inserting mock records into MongoDB Atlas...');
  const [insertedUsers, insertedFinance, insertedStudy, insertedHabits] = await Promise.all([
    Models.User.insertMany(usersData),
    Models.FinancialRecord.insertMany(financeData),
    Models.StudyActivity.insertMany(studyData),
    Models.HabitTracking.insertMany(habitsData),
  ]);

  console.log('\n🌟 [Seeder] Database Seeding Completed Successfully!');
  console.log(`   👤 Users Seeded: ${insertedUsers.length}`);
  console.log(`   💰 Financial Records Seeded: ${insertedFinance.length}`);
  console.log(`   📚 Study Activities Seeded: ${insertedStudy.length}`);
  console.log(`   🏃 Habit Logs Seeded: ${insertedHabits.length}`);

  await atlasPool.disconnect();
  process.exit(0);
}

if (require.main === module) {
  seedDatabase().catch((err) => {
    console.error('💥 [Seeder] Fatal error during database seeding:', err);
    process.exit(1);
  });
}

export { seedDatabase };
