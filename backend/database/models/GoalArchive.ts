import mongoose, { Model } from 'mongoose';
import { IGoalArchive, GoalArchiveSchema } from '../schemas/goal_archive_schema';

/**
 * Mongoose ODM Model for the 'goals' (archive) collection.
 * Preserves lifelong user milestone history and AI retrospectives without bloating the User root document.
 */
export const GoalArchive: Model<IGoalArchive> =
  mongoose.models.GoalArchive || mongoose.model<IGoalArchive>('GoalArchive', GoalArchiveSchema, 'goals');
