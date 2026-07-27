import mongoose, { Schema } from 'mongoose';
import { BurnoutRisk } from './enums';

export interface IHabitTracking extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  sleep_hours: mongoose.Types.Decimal128;
  exercise_minutes: number;
  water_intake_liters: mongoose.Types.Decimal128;
  screen_time_hours: mongoose.Types.Decimal128;
  mood_rating?: number;
  meditation_minutes?: number;
  productivity_score_computed?: mongoose.Types.Decimal128;
  lifestyle_score_computed?: mongoose.Types.Decimal128;
  burnout_risk_cluster: BurnoutRisk;
  log_date: Date;
  created_at: Date;
}

export const HabitTrackingSchema = new Schema<IHabitTracking>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID reference is required for biometric habit log.'],
      index: true,
    },
    sleep_hours: {
      type: Schema.Types.Decimal128,
      required: [true, 'Daily sleep duration in hours is required (K-Means Feature #1).'],
      validate: {
        validator: (v: mongoose.Types.Decimal128) => {
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
      type: Schema.Types.Decimal128,
      required: [true, 'Water intake in liters is required (K-Means Feature #3).'],
      validate: {
        validator: (v: mongoose.Types.Decimal128) => {
          const val = parseFloat(v.toString());
          return val >= 0.0 && val <= 20.0;
        },
        message: 'Water intake must be between 0.0 and 20.0 liters.',
      },
    },
    screen_time_hours: {
      type: Schema.Types.Decimal128,
      required: [true, 'Screen time in hours is required (K-Means Feature #4).'],
      validate: {
        validator: (v: mongoose.Types.Decimal128) => {
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
      type: Schema.Types.Decimal128,
      required: false,
    },
    lifestyle_score_computed: {
      type: Schema.Types.Decimal128,
      required: false,
    },
    burnout_risk_cluster: {
      type: String,
      required: true,
      enum: Object.values(BurnoutRisk),
      default: BurnoutRisk.UNKNOWN,
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
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
    versionKey: false,
    toJSON: { getters: true },
    toObject: { getters: true },
  }
);

// Pre-validate middleware: Automatically normalize log_date to midnight UTC (00:00:00.000Z)
// This guarantees that the unique compound index on (user_id, log_date) evaluates daily uniqueness correctly!
HabitTrackingSchema.pre('validate', function (next) {
  if (this.log_date) {
    const d = new Date(this.log_date);
    d.setUTCHours(0, 0, 0, 0);
    this.log_date = d;
  }
  next();
});

// Critical Data Integrity Index: Strictly enforces 1 biometric log per user per calendar day!
HabitTrackingSchema.index({ user_id: 1, log_date: 1 }, { unique: true, name: 'idx_habit_user_date_unique' });

// ESR Index: Habit calendar heatmap and trend charts
HabitTrackingSchema.index({ user_id: 1, log_date: -1 }, { name: 'idx_habit_user_date_desc' });

// ESR Index: Filter high-risk users for proactive Gemini recommendations
HabitTrackingSchema.index({ user_id: 1, burnout_risk_cluster: 1, log_date: -1 }, { name: 'idx_habit_user_burnout' });
