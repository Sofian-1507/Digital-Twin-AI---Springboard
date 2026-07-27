import mongoose from 'mongoose';
import { atlasPool } from '../connections/atlas_pool';
import * as Models from '../models/index';
import { userRepository } from '../repositories/user_repository';
import { financialRecordRepository } from '../repositories/finance_repository';
import { studyActivityRepository } from '../repositories/study_repository';
import { habitTrackingRepository } from '../repositories/habit_repository';
import { GoalCategory, GoalStatus, BurnoutRisk } from '../schemas/enums';

/**
 * Complete End-to-End Database Integration Test Suite.
 * Validates connection pooling, zero-hop reads, atomic goal archival,
 * Random Forest aggregation pipelines, 4D K-Means feature extraction,
 * and daily habit check-in uniqueness constraints against MongoDB Atlas.
 */
async function runE2ETestSuite(): Promise<void> {
  console.log('==============================================================================');
  console.log('🧪 DIGITAL TWIN AI — END-TO-END DATABASE INTEGRATION TEST SUITE');
  console.log('==============================================================================\n');

  let passedTests = 0;
  let failedTests = 0;

  function assert(condition: boolean, testName: string, errorMessage?: string): void {
    if (condition) {
      console.log(`   ✅ [PASS] ${testName}`);
      passedTests++;
    } else {
      console.error(`   ❌ [FAIL] ${testName}: ${errorMessage || 'Assertion failed'}`);
      failedTests++;
    }
  }

  try {
    // 1. Connection Pool Test
    console.log('1️⃣  Testing MongoDB Atlas Connection Pool...');
    await atlasPool.connect();
    const status = atlasPool.getStatus();
    assert(status.isConnected === true, 'Connection pool successfully connected to Atlas cluster');

    // 2. Zero-Hop Twin Context Retrieval (Rule of 100)
    console.log('\n2️⃣  Testing Zero-Hop Twin Context Retrieval ($O(1)$ Read Complexity)...');
    const user = await Models.User.findOne().exec();
    assert(user !== null, 'Found seed user in cluster');
    if (user) {
      const twinContext = await userRepository.getTwinContext(user._id);
      assert(twinContext !== null, 'userRepository.getTwinContext() retrieved document');
      assert(twinContext?.profile?.name === 'Aarav Sharma', 'Embedded profile name retrieved in zero hops');
      assert(twinContext?.active_goals !== undefined, 'Embedded active goals array retrieved in zero hops');
      assert(twinContext?.digital_twin_state?.burnout_risk_cluster === BurnoutRisk.LOW_RISK, 'Embedded AI digital twin state retrieved in zero hops');
    }

    // 3. Atomic Goal Archival & Rule of 100 Array Bounds
    console.log('\n3️⃣  Testing Atomic Goal Archival & Milestone Migration...');
    if (user && user.active_goals.length > 0) {
      const targetGoal = user.active_goals[0];
      const initialActiveCount = user.active_goals.length;
      const initialArchiveCount = await Models.GoalArchive.countDocuments({ user_id: user._id });

      console.log(`   📌 Archiving goal '${targetGoal.title}' (${targetGoal.goal_id})...`);
      const archived = await userRepository.archiveGoal(
        user._id,
        targetGoal.goal_id,
        GoalStatus.COMPLETED,
        mongoose.Types.Decimal128.fromString('50000.00'),
        'AI Retrospective: Exceptional savings discipline demonstrated!'
      );
      assert(archived === true, 'userRepository.archiveGoal() executed successfully');

      const updatedUser = await Models.User.findById(user._id);
      const newArchiveCount = await Models.GoalArchive.countDocuments({ user_id: user._id });

      assert(updatedUser?.active_goals.length === initialActiveCount - 1, 'Goal atomically removed from users.active_goals array');
      assert(newArchiveCount === initialArchiveCount + 1, 'Goal milestone successfully created in GoalArchive collection');
    }

    // 4. Random Forest Financial Savings Aggregation Pipeline
    console.log('\n4️⃣  Testing Random Forest Financial Cashflow Aggregation Pipeline...');
    if (user) {
      const startDate = new Date('2026-01-01');
      const cashflowPipeline = await financialRecordRepository.getMonthlyCashflowPipeline(user._id, startDate);
      assert(Array.isArray(cashflowPipeline), 'Financial aggregation pipeline returned structured array');
      assert(cashflowPipeline.length > 0, `Extracted ${cashflowPipeline.length} monthly cashflow feature groups for Scikit-Learn regression`);
      if (cashflowPipeline.length > 0) {
        console.log(`      📊 Sample Feature Row: Month ${cashflowPipeline[0]._id.month}/${cashflowPipeline[0]._id.year} | Type: ${cashflowPipeline[0]._id.type} | Total: ₹${cashflowPipeline[0].total_amount.toString()}`);
      }
    }

    // 5. Random Forest Academic Mark Prediction & Pre-Save Percentage Computation
    console.log('\n5️⃣  Testing Academic Feature Matrix Extraction & Pre-Validate Percentage Calculation...');
    if (user) {
      const featureMatrix = await studyActivityRepository.extractRandomForestFeatureMatrix(user._id);
      assert(Array.isArray(featureMatrix), 'Academic feature matrix extraction returned clean row array');
      assert(featureMatrix.length > 0, `Extracted ${featureMatrix.length} academic 3D feature rows for exam score prediction`);
      if (featureMatrix.length > 0) {
        const quizRow = featureMatrix.find((r) => r.quiz_marks_pct > 0);
        const examRow = featureMatrix.find((r) => r.target_exam_pct > 0);
        assert(quizRow !== undefined && examRow !== undefined, `Normalized percentage scores automatically computed and extracted (Sample Quiz: ${quizRow?.quiz_marks_pct}%, Sample Exam: ${examRow?.target_exam_pct}%)`);
      }
    }

    // 6. K-Means 4D Biometric Feature Space Extraction & Unique Daily Log Enforcement
    console.log('\n6️⃣  Testing Habit Biometric Tracking & Unique Daily Compound Indexing...');
    if (user) {
      const todayLog = await habitTrackingRepository.upsertDailyHabitLog(user._id, {
        sleep_hours: mongoose.Types.Decimal128.fromString('7.2'),
        exercise_minutes: 60,
        water_intake_liters: mongoose.Types.Decimal128.fromString('3.5'),
        screen_time_hours: mongoose.Types.Decimal128.fromString('4.5'),
        burnout_risk_cluster: BurnoutRisk.LOW_RISK,
      });
      assert(todayLog !== null, 'upsertDailyHabitLog() created/updated today check-in');
      assert(todayLog.log_date.toISOString().endsWith('T00:00:00.000Z'), 'log_date automatically normalized to midnight UTC');

      // Test unique constraint: Attempting to insert duplicate log for same user & same date
      try {
        await Models.HabitTracking.create({
          user_id: user._id,
          sleep_hours: mongoose.Types.Decimal128.fromString('5.0'),
          exercise_minutes: 10,
          water_intake_liters: mongoose.Types.Decimal128.fromString('1.0'),
          screen_time_hours: mongoose.Types.Decimal128.fromString('12.0'),
          burnout_risk_cluster: BurnoutRisk.HIGH_RISK,
          log_date: todayLog.log_date,
        });
        assert(false, 'Unique compound index on (user_id, log_date)', 'Failed to block duplicate daily check-in!');
      } catch (err: any) {
        assert(err.code === 11000 || err.message.includes('duplicate key'), 'Unique compound index on (user_id, log_date) successfully blocked duplicate daily submission');
      }

      const kmeansMatrix = await habitTrackingRepository.extractKMeansFeatureSpace(user._id, 30);
      assert(kmeansMatrix.length > 0, `Extracted ${kmeansMatrix.length} continuous 4D biometric vectors for K-Means burnout clustering`);
      if (kmeansMatrix.length > 0) {
        const kRow = kmeansMatrix[kmeansMatrix.length - 1];
        console.log(`      🏃 Sample 4D Feature Vector [Date: ${kRow.log_date}]: Sleep=${kRow.sleep_hours}h | Exercise=${kRow.exercise_minutes}m | Water=${kRow.water_intake_liters}L | ScreenTime=${kRow.screen_time_hours}h`);
      }
    }

  } catch (error: any) {
    console.error('\n💥 [E2E Suite] Fatal Exception encountered during testing:', error.message || error);
    failedTests++;
  } finally {
    console.log('\n==============================================================================');
    console.log('🏁 TEST SUITE EXECUTION SUMMARY');
    console.log('==============================================================================');
    console.log(`   ✨ Total Tests Passed: ${passedTests}`);
    console.log(`   🚨 Total Tests Failed: ${failedTests}`);
    console.log('==============================================================================\n');

    await atlasPool.disconnect();
    if (failedTests > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  }
}

if (require.main === module) {
  runE2ETestSuite();
}

export { runE2ETestSuite };
