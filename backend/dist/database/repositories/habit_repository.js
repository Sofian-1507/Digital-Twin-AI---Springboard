"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.habitTrackingRepository = exports.HabitTrackingRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const base_repository_1 = require("./base_repository");
const index_1 = require("../models/index");
/**
 * Enterprise Habit Tracking Data Access Object (DAO).
 * Formats 4D biometric feature matrices for K-Means burnout clustering
 * and manages cluster classification write-backs.
 */
class HabitTrackingRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(index_1.HabitTracking);
    }
    /**
     * Retrieves or updates today's daily habit check-in for a user.
     * Leverages the unique compound index on (user_id, log_date) to prevent duplicate daily entries.
     */
    async upsertDailyHabitLog(userId, data) {
        const uId = new mongoose_1.default.Types.ObjectId(userId.toString());
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        return await this.model.findOneAndUpdate({ user_id: uId, log_date: today }, { $set: { ...data, user_id: uId, log_date: today } }, { new: true, upsert: true, runValidators: true }).exec();
    }
    /**
     * Extracts the 4D biometric feature space over a specified window (default 30 days)
     * to feed Scikit-Learn K-Means clustering algorithms.
     */
    async extractKMeansFeatureSpace(userId, days = 30) {
        const uId = new mongoose_1.default.Types.ObjectId(userId.toString());
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
    async updateBurnoutClusterBatch(logIds, cluster) {
        const ids = logIds.map((id) => new mongoose_1.default.Types.ObjectId(id.toString()));
        const result = await this.model.updateMany({ _id: { $in: ids } }, { $set: { burnout_risk_cluster: cluster } }).exec();
        return result.modifiedCount;
    }
}
exports.HabitTrackingRepository = HabitTrackingRepository;
exports.habitTrackingRepository = new HabitTrackingRepository();
