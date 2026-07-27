import mongoose, { Model } from 'mongoose';
import { IHabitTracking, HabitTrackingSchema } from '../schemas/habit_schema';

/**
 * Mongoose ODM Model for the 'habit_tracking' collection.
 * Biometric routine log feeding Scikit-Learn K-Means burnout clustering.
 */
export const HabitTracking: Model<IHabitTracking> =
  mongoose.models.HabitTracking || mongoose.model<IHabitTracking>('HabitTracking', HabitTrackingSchema, 'habit_tracking');
