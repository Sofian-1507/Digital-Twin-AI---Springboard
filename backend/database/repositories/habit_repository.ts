import mongoose from 'mongoose';
import { BaseRepository } from './base_repository';
import { IHabitTracking } from '../schemas/habit_schema';
import { HabitTracking } from '../models/index';
import { BurnoutRisk } from '../schemas/enums';

export interface KMeansFeatureMatrixRow {
  log_id: string;
  user_id: string;
  sleep_hours: number;
  exercise_minutes: number;
  water_intake_liters: number;
  screen_time_hours: number;
  log_date: string;
}

/**
 * Enterprise Habit Tracking Data Access Object (DAO).
 * Formats 4D biometric feature matrices for K-Means burnout clustering
 * and manages cluster classification write-backs.
 */
export class HabitTrackingRepository extends BaseRepository<IHabitTracking> {
  constructor() {
    super(HabitTracking);
  }

  /**
   * Retrieves or updates today's daily habit check-in for a user.
   * Leverages the unique compound index on (user_id, log_date) to prevent duplicate daily entries.
   */
  public async upsertDailyHabitLog(userId: string | mongoose.Types.ObjectId, data: Partial<IHabitTracking>): Promise<IHabitTracking> {
    const uId = new mongoose.Types.ObjectId(userId.toString());
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    return await this.model.findOneAndUpdate(
      { user_id: uId, log_date: today },
      { $set: { ...data, user_id: uId, log_date: today } },
      { new: true, upsert: true, runValidators: true }
    ).exec();
  }

  /**
   * Extracts the 4D biometric feature space over a specified window (default 30 days)
   * to feed Scikit-Learn K-Means clustering algorithms.
   */
  public async extractKMeansFeatureSpace(
    userId: string | mongoose.Types.ObjectId,
    days: number = 30
  ): Promise<KMeansFeatureMatrixRow[]> {
    const uId = new mongoose.Types.ObjectId(userId.toString());
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setUTCHours(0, 0, 0, 0);

    const logs = await this.model.find({
      user_id: uId,
      log_date: { $gte: startDate },
    }).sort({ log_date: 1 }).exec();

    return logs.map((l) => ({
      log_id: l._id.toString(),
      user_id: l.user_id.toString(),
      sleep_hours: parseFloat(l.sleep_hours.toString()),
      exercise_minutes: l.exercise_minutes,
      water_intake_liters: parseFloat(l.water_intake_liters.toString()),
      screen_time_hours: parseFloat(l.screen_time_hours.toString()),
      log_date: l.log_date.toISOString().split('T')[0],
    }));
  }

  /**
   * Batch updates burnout risk cluster classifications assigned by background K-Means ML jobs.
   */
  public async updateBurnoutClusterBatch(
    logIds: (string | mongoose.Types.ObjectId)[],
    cluster: BurnoutRisk
  ): Promise<number> {
    const ids = logIds.map((id) => new mongoose.Types.ObjectId(id.toString()));
    const result = await this.model.updateMany(
      { _id: { $in: ids } },
      { $set: { burnout_risk_cluster: cluster } }
    ).exec();

    return result.modifiedCount;
  }
}

export const habitTrackingRepository = new HabitTrackingRepository();
