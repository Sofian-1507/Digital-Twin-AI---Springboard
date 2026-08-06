"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDatabase = seedDatabase;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const atlas_pool_1 = require("../connections/atlas_pool");
const Models = __importStar(require("../models/index"));
/**
 * Automated CLI Development Database Seeder.
 * Wipes existing development collections and populates mock Indian user profiles,
 * financial ledgers, academic study activities, and biometric habit logs.
 */
async function seedDatabase() {
    console.log('⏳ [Seeder] Connecting to MongoDB Atlas development cluster...');
    await atlas_pool_1.atlasPool.connect();
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
    const usersData = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, 'seed_data/mock_users.json'), 'utf-8'));
    const financeData = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, 'seed_data/mock_finance.json'), 'utf-8'));
    const studyData = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, 'seed_data/mock_study.json'), 'utf-8'));
    const habitsData = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, 'seed_data/mock_habits.json'), 'utf-8'));
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
    await atlas_pool_1.atlasPool.disconnect();
    process.exit(0);
}
if (require.main === module) {
    seedDatabase().catch((err) => {
        console.error('💥 [Seeder] Fatal error during database seeding:', err);
        process.exit(1);
    });
}
