import mongoose, { Model } from 'mongoose';
import { IAnalyticsLog, AnalyticsLogSchema } from '../schemas/analytics_schema';

/**
 * Mongoose ODM Model for the 'analytics_logs' collection.
 * High-velocity system telemetry sink governed by a 90-day automatic TTL index.
 */
export const AnalyticsLog: Model<IAnalyticsLog> =
  mongoose.models.AnalyticsLog || mongoose.model<IAnalyticsLog>('AnalyticsLog', AnalyticsLogSchema, 'analytics_logs');
