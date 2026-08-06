"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HabitTrackingSchema = void 0;
const mongoose_1 = require("mongoose");
const enums_1 = require("./enums");
exports.HabitTrackingSchema = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID reference is required for biometric habit log.'],
        index: true,
    },
    sleep_hours: {
        type: mongoose_1.Schema.Types.Decimal128,
        required: [true, 'Daily sleep duration in hours is required (K-Means Feature #1).'],
        validate: {
            validator: (v) => {
                const val = parseFloat(v.toString());
                return val >= 0.0 && val <= 24.0;
            },
            message: 'Sleep hours must be between 0.0 and 24.0 hours.',
        },
    },
    exercise_minutes: {
        type: Number,
        required: [true, 'Exercise duration in minutes is required (K-Means Feature #2).'],
        min: [0, 'Exercise minutes cannot be negative.'],
        max: [1440, 'Exercise minutes cannot exceed 1440 (24 hours).'],
    },
    water_intake_liters: {
        type: mongoose_1.Schema.Types.Decimal128,
        required: [true, 'Water intake in liters is required (K-Means Feature #3).'],
        validate: {
            validator: (v) => {
                const val = parseFloat(v.toString());
                return val >= 0.0 && val <= 20.0;
            },
            message: 'Water intake must be between 0.0 and 20.0 liters.',
        },
    },
    screen_time_hours: {
        type: mongoose_1.Schema.Types.Decimal128,
        required: [true, 'Screen time in hours is required (K-Means Feature #4).'],
        validate: {
            validator: (v) => {
                const val = parseFloat(v.toString());
                return val >= 0.0 && val <= 24.0;
            },
            message: 'Screen time must be between 0.0 and 24.0 hours.',
        },
    },
    mood_rating: {
        type: Number,
        required: false,
        min: [1, 'Minimum mood rating is 1 (Very Low).'],
        max: [5, 'Maximum mood rating is 5 (Excellent).'],
    },
    meditation_minutes: {
        type: Number,
        required: false,
        min: [0, 'Meditation minutes cannot be negative.'],
        max: [1440, 'Meditation minutes cannot exceed 1440.'],
    },
    productivity_score_computed: {
        type: mongoose_1.Schema.Types.Decimal128,
        required: false,
    },
    lifestyle_score_computed: {
        type: mongoose_1.Schema.Types.Decimal128,
        required: false,
    },
    burnout_risk_cluster: {
        type: String,
        required: true,
        enum: Object.values(enums_1.BurnoutRisk),
        default: enums_1.BurnoutRisk.UNKNOWN,
    },
    log_date: {
        type: Date,
        required: true,
        default: () => {
            const now = new Date();
            now.setUTCHours(0, 0, 0, 0);
            return now;
        },
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: false },
    versionKey: false,
    toJSON: { getters: true },
    toObject: { getters: true },
});
// Pre-validate middleware: Automatically normalize log_date to midnight UTC (00:00:00.000Z)
// This guarantees that the unique compound index on (user_id, log_date) evaluates daily uniqueness correctly!
exports.HabitTrackingSchema.pre('validate', function (next) {
    if (this.log_date) {
        const d = new Date(this.log_date);
        d.setUTCHours(0, 0, 0, 0);
        this.log_date = d;
    }
    next();
});
// Critical Data Integrity Index: Strictly enforces 1 biometric log per user per calendar day!
exports.HabitTrackingSchema.index({ user_id: 1, log_date: 1 }, { unique: true, name: 'idx_habit_user_date_unique' });
// ESR Index: Habit calendar heatmap and trend charts
exports.HabitTrackingSchema.index({ user_id: 1, log_date: -1 }, { name: 'idx_habit_user_date_desc' });
// ESR Index: Filter high-risk users for proactive Gemini recommendations
exports.HabitTrackingSchema.index({ user_id: 1, burnout_risk_cluster: 1, log_date: -1 }, { name: 'idx_habit_user_burnout' });
