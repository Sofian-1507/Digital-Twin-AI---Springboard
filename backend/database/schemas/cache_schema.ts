import mongoose, { Schema } from 'mongoose';

export interface IDashboardCache extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  cache_key: string;
  payload: Record<string, any>;
  generated_at: Date;
}

export const DashboardCacheSchema = new Schema<IDashboardCache>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID reference is required for dashboard cache payload.'],
    },
    cache_key: {
      type: String,
      required: [true, 'Cache key identifier is required.'],
      trim: true,
      uppercase: true,
      maxlength: [100, 'Cache key cannot exceed 100 characters.'],
    },
    payload: {
      type: Schema.Types.Mixed,
      required: [true, 'Pre-aggregated UI payload is required.'],
      default: {},
    },
    generated_at: {
      type: Date,
      required: true,
      default: () => new Date(),
    },
  },
  {
    timestamps: false,
    versionKey: false,
    minimize: false,
  }
);

// Unique Compound Index: Ensures 1 cache payload per user per UI widget/dashboard key
DashboardCacheSchema.index({ user_id: 1, cache_key: 1 }, { unique: true, name: 'idx_cache_user_key_unique' });

// 15-Minute Automatic TTL Index: Purges pre-computed UI dashboard summaries exactly 15 minutes (900s) after generation
DashboardCacheSchema.index({ generated_at: 1 }, { expireAfterSeconds: 900, name: 'idx_cache_ttl_15m' });
