import mongoose, { Model } from 'mongoose';
import { IDashboardCache, DashboardCacheSchema } from '../schemas/cache_schema';

/**
 * Mongoose ODM Model for the 'dashboard_cache' collection.
 * Ephemeral UI aggregation cache governed by a 15-minute automatic TTL index.
 */
export const DashboardCache: Model<IDashboardCache> =
  mongoose.models.DashboardCache || mongoose.model<IDashboardCache>('DashboardCache', DashboardCacheSchema, 'dashboard_cache');
