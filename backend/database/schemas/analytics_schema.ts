import mongoose, { Schema } from 'mongoose';

export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL',
}

export interface IAnalyticsLog extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  user_id?: mongoose.Types.ObjectId;
  event_type: string;
  module: string;
  level: LogLevel;
  metadata: Record<string, any>;
  client_ip?: string;
  timestamp: Date;
}

export const AnalyticsLogSchema = new Schema<IAnalyticsLog>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false, // System logs may not be associated with a specific user
      index: true,
    },
    event_type: {
      type: String,
      required: [true, 'Event type identifier is required.'],
      trim: true,
      uppercase: true,
      maxlength: [100, 'Event type cannot exceed 100 characters.'],
    },
    module: {
      type: String,
      required: [true, 'System module name is required.'],
      trim: true,
      maxlength: [100, 'Module name cannot exceed 100 characters.'],
    },
    level: {
      type: String,
      required: true,
      enum: Object.values(LogLevel),
      default: LogLevel.INFO,
    },
    metadata: {
      type: Schema.Types.Mixed,
      required: true,
      default: {},
    },
    client_ip: {
      type: String,
      required: false,
      trim: true,
    },
    timestamp: {
      type: Date,
      required: true,
      default: () => new Date(),
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

// 90-Day Automatic TTL Index: MongoDB Atlas engine silently deletes telemetry older than 90 days (7,776,000s)
AnalyticsLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 7776000, name: 'idx_analytics_ttl_90d' });

// ESR Index: Filter system logs by module and event severity
AnalyticsLogSchema.index({ module: 1, level: 1, timestamp: -1 }, { name: 'idx_analytics_mod_level_date' });
